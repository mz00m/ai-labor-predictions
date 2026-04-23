import { cookies } from "next/headers";
import { checkAdminToken } from "@/lib/admin-auth";
import KbClient from "./KbClient";

export const metadata = {
  robots: "noindex, nofollow",
};

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function KbPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kb_session")?.value;
  const authed = await checkAdminToken(token);
  const { error } = await searchParams;

  // When the user arrives with ?error=expired from the KB client's 401 handler
  // or the explicit sign-out link, always show the gate — even if the server
  // somehow still thinks the token is valid. This prevents a recovery loop
  // where a client-side 401 sends the user back to a page that re-renders
  // KbClient because of an inconsistent auth state.
  if (!authed || error === "expired") {
    return <TokenGate variant={error === "expired" ? "expired" : error ? "invalid" : "default"} />;
  }

  return <KbClient />;
}

function TokenGate({ variant }: { variant: "default" | "expired" | "invalid" }) {
  const message =
    variant === "expired"
      ? "Your session expired. Sign in again to continue."
      : variant === "invalid"
        ? "Incorrect token. Try again."
        : null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <form method="POST" action="/api/kb/login" className="w-full max-w-sm px-6">
        <div className="mb-6">
          <div className="text-xs font-mono text-neutral-400 mb-1">jobsdata.ai</div>
          <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">
            Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Admin access required</p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            name="token"
            placeholder="Admin token"
            autoFocus
            className="w-full text-sm px-4 py-3 rounded-lg border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400"
          />
          {message && (
            <p
              className={`text-xs ${
                variant === "expired" ? "text-neutral-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
          >
            Access KB
          </button>
        </div>
      </form>
    </div>
  );
}
