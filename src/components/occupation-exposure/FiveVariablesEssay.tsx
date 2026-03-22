"use client";

import Link from "next/link";

export default function FiveVariablesEssay() {
  return (
    <article className="max-w-[740px] mx-auto prose-custom">
      <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-6">
        Five Things That Determine Whether AI Takes Your Job
      </h2>

      <div className="space-y-5 text-[14px] text-[var(--muted)] leading-[1.8]">
        <p>
          Most of the conversation about AI and jobs boils down to a single
          question: can AI do this task? That&rsquo;s the wrong question. Or
          rather, it&rsquo;s only one-fifth of the right question.
        </p>

        <p>
          Whether your job is actually at risk depends on five things, not one.
          Two of them push toward displacement. Three of them push against it.
          The net score is what matters, and it&rsquo;s often surprising.
        </p>

        <p>
          Here&rsquo;s what we mean.
        </p>

        {/* ── Variable 1 ── */}
        <h3 className="text-[17px] font-bold text-[var(--foreground)] !mb-2 !mt-8">
          1. Technical Exposure — &ldquo;Can AI do your tasks?&rdquo;
        </h3>
        <p>
          This is the one everyone focuses on, and it&rsquo;s real. If you spend
          your day writing boilerplate legal documents, and an LLM can produce
          those documents in seconds, you have high technical exposure. If you
          spend your day climbing utility poles in sleet, you don&rsquo;t.
        </p>
        <p>
          We score this by looking at every task in an occupation — not just
          the headline description, but the{" "}
          <Link
            href="/task-visualizer"
            className="text-[var(--accent-text)] hover:underline"
          >
            actual daily tasks defined by the Bureau of Labor Statistics
          </Link>
          {" "}— and asking what percentage of them current AI systems can
          handle. Some jobs score surprisingly high. Radiologists, for example,
          have high exposure because image analysis is one of AI&rsquo;s
          strongest capabilities. But as you&rsquo;ll see, that doesn&rsquo;t
          tell the whole story.
        </p>

        {/* ── Variable 2 ── */}
        <h3 className="text-[17px] font-bold text-[var(--foreground)] !mb-2 !mt-8">
          2. Adoption Speed — &ldquo;How fast will companies actually deploy it?&rdquo;
        </h3>
        <p>
          Just because AI <em>can</em> do something doesn&rsquo;t mean
          companies will roll it out tomorrow. This is where people
          consistently get the timeline wrong.
        </p>
        <p>
          A tech startup can plug in a new API over a weekend. A hospital
          system has to navigate FDA clearance, liability questions, union
          contracts, IT integration across dozens of legacy systems, and
          probably a two-year pilot program. A bank has to satisfy regulators
          who are still writing the rules.
        </p>
        <p>
          So a hospital receptionist and a startup&rsquo;s customer support
          agent might have identical technical exposure — but one will feel
          the effects years before the other. The gap between &ldquo;AI can do
          this&rdquo; and &ldquo;my employer has deployed AI to do this&rdquo;
          is often measured in years, sometimes decades. Regulated industries,
          unionized workplaces, and organizations with complex IT environments
          all move slower. That delay matters enormously for the humans
          involved.
        </p>

        {/* ── Variable 3 ── */}
        <h3 className="text-[17px] font-bold text-[var(--foreground)] !mb-2 !mt-8">
          3. Worker Adaptability — &ldquo;Can you make the jump?&rdquo;
        </h3>
        <p>
          This one is uncomfortable because it&rsquo;s personal. When your
          current role changes, how well positioned are you to move into a
          new one?
        </p>
        <p>
          It turns out this depends on measurable things. How transferable are
          your skills — does your experience apply to adjacent occupations, or
          is it narrow? Do you have enough savings to weather a transition
          period? Are there other employers hiring nearby, or would you have
          to relocate? What&rsquo;s your age — not because older workers
          can&rsquo;t learn, but because the economics of retraining look
          different at 55 than at 25.
        </p>
        <p>
          A recent NBER paper by{" "}
          <a
            href="https://www.nber.org/papers/w34705"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            Manning and Aguirre
          </a>
          {" "}built a composite index of these factors, and the variation is
          striking. Software developers score very high — their skills
          transfer widely, they have financial buffers, and there are employers
          everywhere. Food preparation workers score low — not because
          they&rsquo;re less capable, but because their skills are narrow,
          their savings are thin, and their geographic options are limited. The
          system, not the individual, creates the vulnerability.
        </p>

        {/* ── Variable 4 ── */}
        <h3 className="text-[17px] font-bold text-[var(--foreground)] !mb-2 !mt-8">
          4. Demand Elasticity — &ldquo;When it gets cheaper, do people buy more?&rdquo;
        </h3>
        <p>
          This is the most underrated variable, and it has the most historical
          precedent going for it.
        </p>
        <p>
          When ATMs were introduced in the 1970s, everyone assumed bank tellers
          were finished.{" "}
          <a
            href="https://www.jstor.org/stable/j.ctvc77hh1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            What actually happened
          </a>
          {" "}was that ATMs made it cheaper to operate a branch, so banks
          opened more branches, and the total number of tellers went{" "}
          <em>up</em> for the next 30 years. The cost per unit of banking
          went down, demand for banking went up, and that demand increase
          more than offset the automation.
        </p>
        <p>
          The same dynamic played out with textile looms, accounting software,
          and electronic trading. The question is: when AI makes the output of
          this occupation cheaper, will people want a lot more of it? Legal
          research is a good candidate — most people who need legal help
          currently can&rsquo;t afford it, so making it cheaper could
          dramatically expand the market. Whereas the demand for, say,
          payroll processing is relatively fixed. Companies have exactly as
          many paychecks to process as they have employees, no matter how cheap
          it gets.
        </p>
        <p>
          We write more about this dynamic on our{" "}
          <Link
            href="/demand-elasticity"
            className="text-[var(--accent-text)] hover:underline"
          >
            demand elasticity explainer
          </Link>
          .
        </p>

        {/* ── Variable 5 ── */}
        <h3 className="text-[17px] font-bold text-[var(--foreground)] !mb-2 !mt-8">
          5. AI Complementarity — &ldquo;Does AI replace you or make you better?&rdquo;
        </h3>
        <p>
          This is the variable that flips the whole narrative for some
          occupations. The question is simple: when AI enters this job, does
          it <em>substitute</em> for the worker or <em>complement</em> them?
        </p>
        <p>
          Think about the difference between a call center agent and a
          management consultant. A call center agent handles a conversation
          from start to finish — an AI chatbot is a direct substitute for
          that entire workflow. A management consultant uses judgment, builds
          relationships, and synthesizes messy inputs from multiple
          stakeholders — AI can make them faster at the analysis parts, but
          the human is still driving the engagement. One is a replacement
          pattern. The other is an augmentation pattern.
        </p>
        <p>
          We draw on a{" "}
          <a
            href="https://www.nber.org/papers/w33886"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            large-scale CFO survey
          </a>
          {" "}that asked executives directly: for each role, is AI primarily
          enhancing your workers or replacing them? Where that data isn&rsquo;t
          available, we estimate it from the task mix — jobs heavy on
          interpersonal interaction and physical presence tend to be augmented.
          Jobs that are mostly information processing tend to be replaced.
        </p>

        {/* ── Putting it together ── */}
        <h3 className="text-[17px] font-bold text-[var(--foreground)] !mb-2 !mt-8">
          Putting it together
        </h3>
        <p>
          The two pressure variables (exposure and adoption speed) push risk
          up. The three buffer variables (adaptability, demand elasticity,
          complementarity) push risk down. The{" "}
          <strong className="text-[var(--foreground)]">net risk score</strong>
          {" "}is the balance between them, on a 1-10 scale.
        </p>
        <p>
          This is why single-dimension analysis is misleading. Radiologists
          have very high technical exposure — but slow institutional adoption
          (hospitals), high worker adaptability (specialized skills transfer
          across medicine), moderate demand elasticity, and strong
          complementarity (AI makes radiologists faster, it doesn&rsquo;t
          replace the diagnosis). Their net risk is much lower than their
          exposure score alone would suggest.
        </p>
        <p>
          Conversely, some jobs with moderate exposure end up with higher net
          risk because the buffer factors are all weak — companies in their
          sector adopt fast, workers have limited transferable skills, demand
          is fixed, and AI is a direct substitute. The chart above lets you
          explore these dynamics across 342 occupations. Click any block to
          see all five scores and how they combine.
        </p>

        <p>
          None of this is destiny. Every one of these variables can be changed
          by policy, by companies, or by individuals. But you can&rsquo;t
          change what you don&rsquo;t understand. And understanding starts
          with asking the right five questions instead of just one.
        </p>

        <div className="border-t border-black/[0.06] pt-4 mt-8">
          <p className="text-[12px] text-[var(--muted)] leading-[1.7]">
            For the full scoring methodology — including data sources, weights,
            and academic citations for each variable — see the{" "}
            <a
              href="#methodology"
              className="text-[var(--accent-text)] hover:underline"
            >
              methodology section
            </a>
            {" "}below. To explore how AI affects the specific tasks in your
            job, try the{" "}
            <Link
              href="/task-visualizer"
              className="text-[var(--accent-text)] hover:underline"
            >
              task-level visualizer
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
}
