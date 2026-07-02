/** Error carrying the HTTP status so retry logic can branch on status codes
 * instead of matching error-message strings (which breaks the moment the
 * server sends a custom message). 4xx = don't retry; 5xx/network = retry. */
export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function isNonRetryable(err: unknown): boolean {
  return err instanceof HttpError && err.status >= 400 && err.status < 500;
}
