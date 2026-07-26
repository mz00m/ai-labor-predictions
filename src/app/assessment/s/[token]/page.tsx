import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAssessmentByShareToken } from "@/lib/assessment/db";
import { toPublicReport } from "@/lib/assessment/public-report";
import { computeHeadline } from "@/lib/assessment/headline";
import SharedReportView from "@/components/assessment/SharedReportView";

export const dynamic = "force-dynamic";

interface Props {
  params: { token: string };
}

const TOKEN_RE = /^[a-f0-9]{32}$/;

async function load(token: string) {
  if (!TOKEN_RE.test(token)) return null;
  const assessment = await getAssessmentByShareToken(token);
  if (!assessment) return null;
  return toPublicReport(assessment);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params.token);
  if (!data) return { title: "Report not found | jobsdata.ai", robots: { index: false } };

  const headline = computeHeadline(data.report);
  const title = `${data.organizationName}'s AI action plan | jobsdata.ai`;
  const description = headline
    ? `${headline.totalTasks} tasks reviewed, an estimated ${headline.low}–${headline.high} hours a week of routine work AI could take on. Build your own free plan.`
    : `An AI action plan for ${data.organizationName}, built from task-by-task analysis. Build your own free plan.`;

  return {
    title,
    description,
    // Shared reports are semi-private: the token is the only credential, so
    // they must never end up in a search index.
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "jobsdata.ai",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharedReportPage({ params }: Props) {
  const data = await load(params.token);
  if (!data) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-14">
      <SharedReportView data={data} />

      <div className="mt-16 border-t border-neutral-200 pt-10">
        <h2 className="text-xl font-semibold text-neutral-900">
          Want one of these for your own work?
        </h2>
        <p className="mt-2 text-neutral-600 leading-relaxed">
          The plan above was generated from a short intake about how this team spends its
          time. Yours takes about five minutes and costs nothing.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/assessment"
            className="inline-flex items-center rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Build my AI action plan
          </Link>
          <Link
            href="/scorecard"
            className="inline-flex items-center rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-400 transition-colors"
          >
            Look up my occupation first
          </Link>
        </div>
      </div>
    </div>
  );
}
