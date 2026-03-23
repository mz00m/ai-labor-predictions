"use client";

import Link from "next/link";

export default function FiveVariablesEssay() {
  return (
    <article id="essay" className="max-w-[740px] mx-auto prose-custom scroll-mt-40 sm:scroll-mt-24">
      <h2 className="text-[22px] sm:text-[26px] font-bold text-[var(--foreground)] leading-tight mb-6">
        The Wrong Question About AI and Jobs
      </h2>

      <div className="space-y-5 text-[14px] text-[var(--muted)] leading-[1.8]">
        <p>
         Most people are starting to ask themselves a single question: will I lose my job if AI is able to do it better than me? But after spending months in the research, I can say that seems to be the wrong question. Or
          rather, it&rsquo;s one-fifth of the right question. And it&rsquo;s
          not even the most important fifth.
        </p>

        <p>
          I often chat with people who&rsquo;ve convinced themselves
          they&rsquo;re either safe or doomed based entirely on this one
          dimension. A radiologist sees that AI can read medical images and
          panics. An electrician knows that AI can&rsquo;t fish wires through a basement crawl space and relaxes.
          Both are making the same mistake, seeing only one factor affecting their future.
        </p>

        <p>
          What actually determines whether AI displaces you at work looks a lot more like five specific and easy to understand factors. Two of them push toward job loss or displacement. Three push against it. And
          the three that push against it are, actually quite a bit more interesting.
          Partly because they&rsquo;re less obvious, and partly because
          they&rsquo;re the ones you can actually do something about.
        </p>

        {/* ── Pressure 1: Exposure ── */}
        <p>
          The first variable is the one everyone focuses on: technical
          exposure. Can AI do your{" "}
          <Link
            href="/task-visualizer"
            className="text-[var(--accent-text)] hover:underline"
          >
            actual daily tasks
          </Link>
          ? Not your job title. Your tasks. A &ldquo;financial analyst&rdquo;
          might spend 70% of their time on work an LLM can handle and 30% on
          judgment calls that require a human in the room. That 70% is
          real exposure, and ignoring it would be foolish. But treating it as
          the whole story is equally foolish, and that&rsquo;s what most
          analysis does.
        </p>

        {/* ── Pressure 2: Speed ── */}
        <p>
          The second variable is adoption speed: how fast companies will
          actually deploy AI into your specific workflow. This is where people
          consistently get the timeline wrong. A tech startup can plug in a new
          API over a weekend. A hospital system has to navigate FDA clearance,
          liability questions, union contracts, IT integration across dozens of
          legacy systems, and probably a two-year pilot program. A hospital
          receptionist and a startup&rsquo;s customer support agent might have
          identical technical exposure, but one will feel the effects years
          before the other. We{" "}
          <Link
            href="/signals"
            className="text-[var(--accent-text)] hover:underline"
          >
            track real-time signals
          </Link>
          {" "}of how fast firms are actually moving, and the variation is
          enormous.
        </p>

        <p>
          And here&rsquo;s something most analysis misses entirely: even within
          fast-moving companies, adoption is uneven. At firms that rolled out
          GitHub Copilot, roughly{" "}
          <a
            href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4945566"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            half of the developers never used it
          </a>
          . Think about that. The tool is right there, free, integrated into
          their editor. And half of them ignore it. The speed at which a
          company buys a tool and the speed at which its workers actually adopt
          it are two very different things.
        </p>

        {/* ── The Turn ── */}
        <p>
          So those are the two pressure variables. If you stopped here,
          you&rsquo;d conclude that any job with high exposure in a
          fast-adopting industry is toast. And that&rsquo;s exactly the
          conclusion most AI-and-jobs commentary reaches. But it&rsquo;s
          wrong, because it ignores three forces pushing in the other
          direction. These are the interesting ones.
        </p>

        {/* ── Buffer 1: Adaptability ── */}
        <p>
          The first buffer is worker adaptability. When your role changes, how
          well positioned are you to move into a new one? This sounds soft, but
          it turns out to depend on surprisingly measurable things: how
          transferable your skills are across occupations, whether you have
          savings to weather a transition, whether there are other employers
          nearby. And, uncomfortably, your age. Not because older workers
          can&rsquo;t learn, but because the economics of retraining look
          different at 55 than at 25.
        </p>

        <p>
          <a
            href="https://www.nber.org/papers/w34705"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            Manning and Aguirre
          </a>
          {" "}built a composite index of these factors, and the variation is
          striking. Software developers score very high. Their skills transfer
          widely, they have financial cushions, employers are everywhere. Food
          preparation workers score low. Not because they&rsquo;re less
          capable, but because their skills are narrow, their savings are thin,
          and their geographic options are limited. The system creates the
          vulnerability, not the individual. (Our{" "}
          <Link
            href="/productivity"
            className="text-[var(--accent-text)] hover:underline"
          >
            productivity data
          </Link>
          {" "}shows that workers who can adapt are already seeing real gains.)
        </p>

        {/* ── Buffer 2: Demand Elasticity ── */}
        <p>
          The second buffer is the one I find most underrated, maybe because
          it requires you to think one step beyond the obvious. It&rsquo;s
          demand elasticity: when AI makes the output of an occupation cheaper,
          do people buy more of it?
        </p>

        <p>
          Consider what happened with ATMs. When they were introduced in the
          late 1960s, everyone assumed bank tellers were finished. The{" "}
          <a
            href="https://www.jstor.org/stable/j.ctvc77hh1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            opposite happened
          </a>
          . ATMs made it cheaper to operate a branch, so banks opened more
          branches, and the total number of tellers went <em>up</em> for
          roughly three decades. The cost per unit of banking fell, demand for
          banking rose, and that demand increase more than offset the
          automation. (Teller employment did{" "}
          <a
            href="https://www.bls.gov/ooh/office-and-administrative-support/tellers.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            eventually decline
          </a>
          {" "}once online banking eliminated the need for branches
          altogether. The buffer was powerful, but it wasn&rsquo;t permanent.)
        </p>

        <p>
          The same dynamic played out with{" "}
          <Link
            href="/history"
            className="text-[var(--accent-text)] hover:underline"
          >
            textile looms, accounting software, and electronic trading
          </Link>
          . So the question for any occupation is: when AI makes this cheaper,
          will people want more of it? Legal research is a good
          candidate. Most people who need legal help can&rsquo;t afford it, so
          making it cheaper could dramatically expand the market. Payroll
          processing is not. Companies have exactly as many paychecks to
          process as they have employees, no matter how cheap it gets. (We
          write more about this on our{" "}
          <Link
            href="/demand-elasticity"
            className="text-[var(--accent-text)] hover:underline"
          >
            demand elasticity explainer
          </Link>
          .)
        </p>

        {/* ── Buffer 3: Complementarity ── */}
        <p>
          The third buffer is the one that flips the entire narrative for some
          occupations. It&rsquo;s the question of whether AI <em>replaces</em>
          {" "}you or <em>makes you better</em>.
        </p>

        <p>
          Think about the difference between a call center agent and a
          management consultant. A call center agent handles often routine conversations about returns or billing issues
          from start to finish. An AI chatbot can often be a direct substitute for that
          whole workflow. A management consultant uses judgment, builds
          relationships, synthesizes messy inputs from many stakeholders. AI
          makes them faster at the analysis parts, but the human is still
          driving the engagement. One is a replacement pattern. The other is
          augmentation. (This intuition is formalized by{" "}
          <a
            href="https://aleximas.substack.com/p/how-will-ai-driven-automation-actually"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            Imas and Shukla
          </a>
          {" "}using the{" "}
          <a
            href="https://www.nber.org/papers/w33886"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            O-ring model of automation
          </a>
          : in jobs with many complementary tasks, partial automation triggers a
          &ldquo;focus effect&rdquo; that raises worker productivity and wages.
          The real displacement risk concentrates in low-dimensional jobs like
          trucking and warehousing, where automating one core task eliminates the
          position entirely.) You can see this distinction clearly in our{" "}
          <Link
            href="/predictions/customer-service-automation"
            className="text-[var(--accent-text)] hover:underline"
          >
            customer service automation forecast
          </Link>
          {" "}versus the{" "}
          <Link
            href="/predictions/high-skill-wage-premium"
            className="text-[var(--accent-text)] hover:underline"
          >
            high-skill wage premium
          </Link>
          , which is rising precisely because AI complements those workers.
        </p>

        <p>
          A{" "}
          <a
            href="https://www.nber.org/papers/w33886"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            large-scale CFO survey
          </a>
          {" "}asked executives directly: for each role, is AI primarily
          enhancing your workers or replacing them? The pattern is clear. Jobs
          heavy on interpersonal interaction and physical presence tend to be
          augmented. Jobs that are mostly information processing tend toward replacement.
        </p>

        {/* ── The Payoff ── */}
        <p>
          So: two forces push toward displacement, three push against it. The{" "}
          <strong className="text-[var(--foreground)]">net risk score</strong>
          {" "}is the balance between them, on a 1&ndash;10 scale. And this is
          where the picture gets genuinely surprising.
        </p>

        <p>
          Take radiologists. Their technical exposure is very high. Image
          analysis is one of AI&rsquo;s strongest capabilities. If you only
          looked at that number, you&rsquo;d assume they&rsquo;re in serious
          trouble. But adoption in hospitals is glacially slow. Their
          specialized skills transfer across medicine. And AI makes
          radiologists faster at reading scans without replacing the
          diagnosis itself. Strong complementarity. Their net risk is much
          lower than their exposure alone would suggest.
        </p>

        <p>
          Conversely, some jobs with moderate exposure end up with higher net
          risk because every buffer is weak. Companies in their sector adopt
          fast, workers have limited transferable skills, demand is fixed, and
          AI is a direct substitute.
        </p>

        <p>
          An important caveat: as of early 2026, aggregate labor data from{" "}
          <a
            href="https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-januaryfebruary-cps-update"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            Yale
          </a>
         {" "}and{" "}
          <a
            href="https://www.dallasfed.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            Dallas Fed
          </a>
          {" "}shows{" "}
          <Link
            href="/predictions/overall-us-displacement"
            className="text-[var(--accent-text)] hover:underline"
          >
            no detectable aggregate AI displacement or job loss
          </Link>
          . These are not forward-looking projections, they are observations on what has happened so far, and its showing basically zero substantial job loss. The
          displacement everyone is worried about hasn&rsquo;t shown up in the
         data yet. That doesn&rsquo;t mean it won&rsquo;t. But it&rsquo;s
          worth keeping in mind when the headlines get loud.
        </p>

        <p>
          The chart above lets you explore these dynamics across 342
          occupations. Click any block to see all five scores and how they
          combine. For the aggregate picture, what happens when you add up all
          342 occupations, see our{" "}
          <Link
            href="/predictions/overall-us-displacement"
            className="text-[var(--accent-text)] hover:underline"
          >
            overall US displacement forecast
          </Link>
          . And if you&rsquo;re wondering why the short-term picture might
          look worse before it gets better, the{" "}
          <Link
            href="/j-curve"
            className="text-[var(--accent-text)] hover:underline"
          >
            J-Curve explainer
          </Link>
          {" "}covers that.
        </p>

        {/* ── The Landing ── */}
        <p>
          There&rsquo;s one more thing this framework can&rsquo;t capture, and
          it might be the most important thing of all. These five variables
          score the risks to <em>existing</em> jobs. But technology
          doesn&rsquo;t just destroy tasks. It{" "}
          <a
            href="https://economics.mit.edu/sites/default/files/2024-05/new-work-aw.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-text)] hover:underline"
          >
            creates new ones
          </a>
          . Roughly 60% of workers today are employed in occupations that
          didn&rsquo;t exist in 1940. That&rsquo;s not a minor footnote. It
          has been, historically, the dominant response to technological
          change. Not shuffling people between existing jobs, but the emergence
          of entirely new work that nobody predicted. There&rsquo;s no reason
          to think AI will be different.
        </p>

        <p>
          None of this is destiny. Read that again. Every one of these five variables can be
          changed. By policy, by companies, by individuals. But you
          can&rsquo;t change what you don&rsquo;t understand. And
          understanding means asking five questions instead of one.
        </p>

        <div className="border-t border-black/[0.06] pt-4 mt-8">
          <p className="text-[12px] text-[var(--muted)] leading-[1.7]">
            For the full scoring methodology, including data sources, weights,
            and academic citations for each variable, see the{" "}
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
            . Or browse all{" "}
            <Link
              href="/research"
              className="text-[var(--accent-text)] hover:underline"
            >
              300+ sources
            </Link>
            {" "}behind this analysis.
          </p>
        </div>
      </div>
    </article>
  );
}
