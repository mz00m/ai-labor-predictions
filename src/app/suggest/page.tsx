import { Metadata } from "next";
import Link from "next/link";
import SubmissionForm from "@/components/SubmissionForm";

export const metadata: Metadata = {
  title: "Suggest a Source",
  description:
    "Submit a study, article, or dataset for review. Help improve the evidence base behind AI labor market predictions.",
  alternates: {
    canonical: "/suggest",
  },
  openGraph: {
    title: "Suggest a Source | Early Signals of AI Impact",
    description:
      "Submit a study, article, or dataset for review.",
    type: "website",
    siteName: "Early Signals of AI Impact",
  },
};

export default function SuggestPage() {
  return (
    <div className="max-w-3xl space-y-10">
      {/* Header */}
      <section>
        <p className="text-base font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          Community
        </p>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.1] mb-4">
          Suggest a Source
        </h1>
        <p className="text-md text-[var(--muted)] leading-relaxed max-w-2xl">
          Know of a study, government dataset, or report that should be reflected
          in the predictions? Submit the link below. Every suggestion is reviewed
          manually before anything is ingested into the data.
        </p>
      </section>

      {/* What we're looking for */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          What makes a good suggestion
        </h2>
        <ul className="text-md text-[var(--muted)] leading-relaxed space-y-2 list-disc pl-5">
          <li>
            <strong className="text-[var(--foreground)]">Quantitative findings</strong> about
            AI&rsquo;s impact on jobs, wages, adoption, or workforce exposure
          </li>
          <li>
            Peer-reviewed research, government statistics, or institutional reports
            (these carry the most weight in our{" "}
            <Link href="/methodology#evidence-tiers" className="underline hover:text-[var(--foreground)]">
              evidence tier system
            </Link>)
          </li>
          <li>
            Recent work (2023 or newer preferred) with clear methodology
          </li>
        </ul>
      </section>

      {/* Form */}
      <section>
        <SubmissionForm />
      </section>

      {/* Privacy note */}
      <section className="border-t border-black/[0.06] pt-6">
        <p className="text-base text-[var(--muted)] leading-relaxed max-w-2xl">
          <span className="font-semibold text-[var(--foreground)]">Privacy:</span>{" "}
          Submissions are stored securely and reviewed only by the site maintainer.
          Email addresses are optional and used solely to notify you if your source
          is added. No data is shared with third parties.
        </p>
      </section>
    </div>
  );
}
