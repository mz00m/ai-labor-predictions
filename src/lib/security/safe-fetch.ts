import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const DEFAULT_MAX_BYTES = 1_000_000;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_REDIRECTS = 3;

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

export interface SafeFetchOptions {
  headers?: Record<string, string>;
  maxBytes?: number;
  timeoutMs?: number;
  maxRedirects?: number;
  allowedContentTypes?: string[];
}

export interface SafeFetchResult {
  ok: boolean;
  status: number;
  body: string;
  contentType: string;
  finalUrl: string;
}

function parseIpv4(ip: string): number[] | null {
  if (isIP(ip) !== 4) return null;
  return ip.split(".").map(Number);
}

/** Reject non-public address space, including cloud metadata and documentation ranges. */
export function isNonPublicIp(ip: string): boolean {
  const ipv4 = parseIpv4(ip);
  if (ipv4) {
    const [a, b, c] = ipv4;
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0 && c === 0) ||
      (a === 192 && b === 0 && c === 2) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113) ||
      a >= 224
    );
  }

  if (isIP(ip) !== 6) return true;
  const normalized = ip.toLowerCase();
  if (normalized === "::" || normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (/^fe[89ab]/.test(normalized)) return true;
  if (normalized.startsWith("ff")) return true;
  if (normalized.startsWith("2001:db8")) return true;

  const mapped = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return mapped ? isNonPublicIp(mapped[1]) : false;
}

export async function assertPublicHttpUrl(input: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new UnsafeUrlError("URL is invalid");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Only HTTP and HTTPS URLs are allowed");
  }
  if (url.username || url.password) {
    throw new UnsafeUrlError("URLs containing credentials are not allowed");
  }

  const hostname = url.hostname
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/^\[|\]$/g, "");
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new UnsafeUrlError("Local and private hosts are not allowed");
  }

  const literalType = isIP(hostname);
  if (literalType && isNonPublicIp(hostname)) {
    throw new UnsafeUrlError("Local and private IP addresses are not allowed");
  }

  if (!literalType) {
    let addresses: Array<{ address: string; family: number }>;
    try {
      addresses = await lookup(hostname, { all: true, verbatim: true });
    } catch {
      throw new UnsafeUrlError("Host could not be resolved");
    }
    if (addresses.length === 0 || addresses.some(({ address }) => isNonPublicIp(address))) {
      throw new UnsafeUrlError("Host resolves to a local or private address");
    }
  }

  return url;
}

async function readBodyWithLimit(response: Response, maxBytes: number): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new UnsafeUrlError(`Response exceeded the ${maxBytes}-byte limit`);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Fetch untrusted user URLs with explicit redirect validation and response caps.
 * Every redirect target is DNS-checked before the next request.
 */
export async function safeFetchText(
  input: string,
  options: SafeFetchOptions = {},
): Promise<SafeFetchResult> {
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  let current = await assertPublicHttpUrl(input);

  for (let redirects = 0; redirects <= maxRedirects; redirects += 1) {
    const response = await fetch(current, {
      headers: options.headers,
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new UnsafeUrlError("Redirect response was missing a location");
      if (redirects === maxRedirects) throw new UnsafeUrlError("Too many redirects");
      current = await assertPublicHttpUrl(new URL(location, current).toString());
      continue;
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (
      options.allowedContentTypes?.length &&
      contentType &&
      !options.allowedContentTypes.some((allowed) => contentType.startsWith(allowed))
    ) {
      throw new UnsafeUrlError(`Unsupported response content type: ${contentType}`);
    }

    const contentLength = Number(response.headers.get("content-length") ?? 0);
    if (contentLength > maxBytes) {
      throw new UnsafeUrlError(`Response exceeded the ${maxBytes}-byte limit`);
    }

    return {
      ok: response.ok,
      status: response.status,
      body: await readBodyWithLimit(response, maxBytes),
      contentType,
      finalUrl: current.toString(),
    };
  }

  throw new UnsafeUrlError("Too many redirects");
}
