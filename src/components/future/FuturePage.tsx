"use client";

import { useRef, useState, useEffect } from "react";
import ShareSectionBar from "@/components/ShareSectionBar";
import ReadingProgressBar from "@/components/ReadingProgressBar";

/* ══════════════════════════════════════════════════════════════════════
   From Here to There — A Plausible Path Through the AI Transition
   ══════════════════════════════════════════════════════════════════════ */

export default function FuturePage() {
  return (
    <article className="max-w-[740px] mx-auto">
      <ReadingProgressBar />

      {/* ───── Header ───── */}
      <header className="mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)] mb-4">
          Scenario
        </p>
        <h1
          className="text-5xl sm:text-6xl font-extrabold text-[var(--foreground)] leading-[1.1] tracking-tight mb-4"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          From Here to There
        </h1>
        <p
          className="text-2xl sm:text-heading-sm text-[var(--muted)] leading-relaxed mb-5"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          A plausible positive scenario for the AI transition that
          doesn&rsquo;t require many further technological breakthroughs
          &mdash; just deliberate choices.
        </p>

        {/* Thesis card */}
        <div className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg p-4 sm:p-5">
          <p
            className="text-lg sm:text-xl text-[var(--foreground)] leading-relaxed font-medium"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            Most AI futures are either utopian hand-waves or dystopian
            alarm bells. This is neither. It&rsquo;s a scenario where
            every step follows from the last, every mechanism has
            empirical precedent, and the outcome &mdash; broad-based
            prosperity &mdash; is earned, not assumed. The timeline is
            15&ndash;25 years. It starts rough.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            12 min read
          </span>
          <span className="pill bg-black/[0.04] text-[var(--muted)]">
            This is a scenario, not a forecast
          </span>
        </div>
      </header>

      {/* ───── The Chain Visualization ───── */}
      <section className="mb-12">
        <div className="border-t border-card pt-8">
          <p className="text-md text-[var(--muted)] leading-[1.75] mb-6">
            The path from here to there has seven links. Each one is a
            causal mechanism, not a hope. Click any link to jump to the
            evidence.
          </p>
          <ChainDiagram />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PHASE I: THE DISRUPTION (Near-term)
         ═══════════════════════════════════════ */}

      <PhaseLabel phase="I" title="The Disruption" color="#ef4444" />

      {/* ───── Link 1: Recession + Career Ladder ───── */}
      <section className="mb-12" id="link-1">
        <div className="border-t border-card pt-8">
          <SectionLabel number="01" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            A recession breaks the early-career ladder
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              The scenario begins with the thing most likely to happen
              next: an economic downturn. Not necessarily caused by AI
              &mdash; tariff uncertainty, rate adjustments, or a garden-variety
              credit cycle would suffice. What matters is the interaction
              effect: when firms cut costs during a recession, AI gives
              them a new way to do it. Instead of laying off senior
              staff, they stop backfilling junior roles.
            </p>
            <p>
              This is already visible in the data. Software developers
              aged 22&ndash;25 saw a ~20% employment decline from their
              late-2022 peak, while those aged 35&ndash;49 grew +9%.
              The mechanism isn&rsquo;t mass layoffs &mdash; it&rsquo;s
              evaporated entry points. Senior developers absorb junior
              work with AI tools. The career ladder loses its bottom
              rungs.
            </p>
          </div>

          <EvidenceCard
            stat="~20%"
            label="employment decline for software developers aged 22-25 since late 2022"
            source="Brynjolfsson, Chandar & Chen (2025) — ADP data, 3.5M+ workers"
            tier={1}
          />

          <div className="mt-4">
            <EvidenceCard
              stat="86%"
              label="of the most-vulnerable AI-exposed workers are women"
              source="Manning & Aguirre, NBER WP 34705 (2026) — 37.1M workers analyzed"
              tier={1}
            />
          </div>

          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mt-6">
            <p>
              The damage is concentrated. Of 37.1 million highly
              AI-exposed workers, 70% have strong adaptive capacity
              &mdash; savings, transferable skills, dense labor markets.
              But 6.1 million workers, concentrated in clerical and
              administrative roles, have both high exposure and low
              adaptive capacity. A recession turns their vulnerability
              into displacement.
            </p>
            <p>
              There is a countervailing force. Brynjolfsson&rsquo;s
              customer-support research shows that firms choosing{" "}
              <a
                href="/j-curve"
                className="text-[var(--accent)] hover:underline"
              >
                augmentation over automation
              </a>{" "}
              see productivity gains that rebuild career ladders
              organically &mdash; novice workers using AI tools perform
              at near-expert levels, which means firms can still hire
              juniors productively. In{" "}
              <a
                href="/predictions/tech-sector-displacement"
                className="text-[var(--accent)] hover:underline"
              >
                tech
              </a>,
              the K-shaped split is already visible: augmentation-heavy
              firms show positive youth employment trends while
              automation-heavy firms show the opposite.
            </p>
            <p>
              This is the valley. It&rsquo;s real, it&rsquo;s measurable,
              and it&rsquo;s where the political window opens.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PHASE II: THE POLICY RESPONSE
         ═══════════════════════════════════════ */}

      <PhaseLabel phase="II" title="The Policy Response" color="#5C61F6" />

      {/* ───── Link 2: Industrial Policy ───── */}
      <section className="mb-12" id="link-2">
        <div className="border-t border-card pt-8">
          <SectionLabel number="02" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            The political window opens for industrial policy
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Recessions create political will that prosperity does not.
              The New Deal followed the Depression. Job retraining
              programs followed deindustrialization. When 6 million
              vulnerable workers face displacement simultaneously,
              government acts &mdash; not because politicians are wise,
              but because the alternative is electorally fatal.
            </p>
            <p>
              The policy toolkit that matters here is not universal basic
              income or retraining tax credits. It&rsquo;s targeted
              apprenticeship programs designed for the AI era &mdash;
              structured pathways that bridge the gap between junior and
              senior white-collar roles by teaching the one skill AI
              cannot provide: discernment. The ability to judge when AI
              output is right, when it&rsquo;s subtly wrong, and when
              the question itself needs reframing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <EvidenceCard
              stat="93%"
              label="of registered apprentices remain employed after completion"
              source="DOL / Apprenticeship.gov (2021)"
              tier={1}
              compact
            />
            <EvidenceCard
              stat="$1.47"
              label="return per $1 invested in apprenticeship programs"
              source="DOL / Apprenticeship.gov (2021)"
              tier={1}
              compact
            />
          </div>

          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75]">
            <p>
              The evidence here comes with a caveat. These 93% retention
              and $1.47 ROI figures are from traditional skilled-trade
              apprenticeships &mdash; electricians, machinists, plumbers.
              White-collar AI apprenticeships are empirically untested
              at scale. The mechanism is analogous (learning judgment
              under supervision), but the conversion is not proven. This
              is where the scenario requires a policy bet, not just a
              policy extension.
            </p>
            <p>
              That said, the design of AI-era apprenticeships is clear.
              An apprentice financial analyst learns to spot when an
              AI-generated model has hallucinated an assumption. An
              apprentice designer learns when AI-generated layouts
              violate the hierarchy that makes information legible. The
              apprenticeship teaches judgment, not production &mdash;
              because AI handles production.
            </p>
            <p>
              Acemoglu&rsquo;s electrician example from his Nobel lecture
              captures it precisely: rather than replacing a beginner
              electrician, AI should provide real-time data-driven
              information, allowing the worker to perform more
              sophisticated tasks and learn on the job. The
              apprenticeship is the institutional form of this idea.
            </p>
          </div>
        </div>
      </section>

      {/* ───── Link 3: The Care Economy Reallocation ───── */}
      <section className="mb-12" id="link-3">
        <div className="border-t border-card pt-8">
          <SectionLabel number="03" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            Workers reshuffle into education and healthcare
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              The 6.1 million workers with high AI exposure and low
              adaptive capacity are concentrated in clerical and
              administrative roles &mdash; data entry, medical billing,
              scheduling, document processing. These roles are
              genuinely being automated. But the workers in them have
              skills that transfer: organizational ability, attention to
              detail, comfort with institutional processes, and &mdash;
              critically &mdash; experience interacting with the public.
            </p>
            <p>
              Two sectors have enormous, chronic, measurable labor
              shortages: education and healthcare. The US has
              approximately 411,500 teaching positions that are either
              unfilled or filled by uncertified teachers. The nursing
              profession faces 197,200 annual openings, with over 1
              million nurses expected to retire by 2030.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <StatCard
              value="411K"
              label="Teaching positions"
              sublabel="Unfilled or uncertified nationally"
              color="#5C61F6"
            />
            <StatCard
              value="197K"
              label="Nursing openings"
              sublabel="Per year through 2033 (BLS)"
              color="#5C61F6"
            />
            <StatCard
              value="1M+"
              label="Nurse retirements"
              sublabel="Expected by 2030"
              color="#5C61F6"
              emphasis
            />
          </div>

          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75]">
            <p>
              The policy mechanism: structured transition programs that
              help clerical workers move into education (especially
              elementary and middle school 1-on-1 tutoring) or nursing,
              with AI tools that compress the upskilling timeline.
              A medical billing specialist already understands healthcare
              workflows, insurance systems, and patient interaction
              &mdash; the distance to a clinical support role is shorter
              than it appears from the outside.
            </p>
            <p>
              But transition programs alone are not enough. These roles
              must pay enough to attract and retain workers. Teacher and
              nurse wages have been suppressed for decades relative to
              their education requirements, which is a primary driver of
              the shortages. This scenario requires public investment
              not just in retraining pipelines but in compensation
              &mdash; raising teacher and nurse pay to levels competitive
              with the private-sector roles these workers are leaving.
              Without wage reform, the reallocation stalls regardless of
              how good the transition programs are.
            </p>
            <p>
              AI itself makes the transition faster. Adaptive learning
              platforms can compress certification timelines. AI clinical
              decision support tools allow nurses to practice at the top
              of their license sooner. The technology that creates the{" "}
              <a
                href="/predictions/overall-us-displacement"
                className="text-[var(--accent)] hover:underline"
              >
                displacement
              </a>{" "}
              also reduces the cost of the transition.
            </p>
          </div>
        </div>
      </section>

      {/* ───── Link 4: Construction + Entrepreneurship ───── */}
      <section className="mb-12" id="link-4">
        <div className="border-t border-card pt-8">
          <SectionLabel number="04" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            AI unlocks construction and entrepreneurship
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Industrial policy doesn&rsquo;t only mean workforce
              programs. It also means removing the regulatory friction
              that AI is uniquely positioned to address. In construction,
              regulations account for 23.8% of the final price of a new
              home and 40.6% of multifamily development costs. Much of
              this isn&rsquo;t safety-critical &mdash; it&rsquo;s
              permitting delays, compliance documentation, zoning review
              backlogs, and code verification that currently requires
              months of human review.
            </p>
            <p>
              AI doesn&rsquo;t change the building code. But it can
              review a permit application against the code in hours
              instead of months. It can flag non-compliant designs before
              submission. It can generate compliance documentation
              automatically. A UCLA study found that cutting approval
              times by 25% could boost housing production by 33%. The
              strongest evidence is in housing: denser construction and
              shorter permitting timelines directly address the supply
              shortage that drives housing costs in high-productivity
              metro areas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <EvidenceCard
              stat="23.8%"
              label="of a new home's price is regulatory cost ($93,870 per home)"
              source="NAHB Special Study (2021)"
              tier={2}
              compact
            />
            <EvidenceCard
              stat="5.5M"
              label="new business applications filed in 2023 — record high"
              source="Census Bureau BFS (2024)"
              tier={1}
              compact
            />
          </div>

          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75]">
            <p>
              Meanwhile, those workers with a risk-taking or strategic
              bent find a different path: entrepreneurship. AI agents
              make it possible to run a business at a scale that
              previously required a team. A solo founder can deploy
              customer service, accounting, legal review, and marketing
              through AI systems, focusing their own time on strategy,
              relationships, and judgment calls.
            </p>
            <p>
              This is already happening. New business applications hit a
              record 5.5 million in 2023 &mdash; though that surge began
              during the pandemic, driven by remote work, stimulus
              capital, and shifting career preferences, not AI. The
              question is whether AI sustains and accelerates the trend
              as those one-time drivers fade. Census research shows
              AI-using young firms exhibit faster revenue growth and
              higher conversion rates to employer businesses, which
              suggests AI may be becoming the next structural tailwind.
              The bar for starting a company is falling. The bar for
              running one well &mdash; which requires human judgment
              about markets, people, and timing &mdash; remains high.
              That gap is where human entrepreneurs thrive.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PHASE III: THE EQUILIBRIUM
         ═══════════════════════════════════════ */}

      <PhaseLabel phase="III" title="The New Equilibrium" color="#10b981" />

      {/* ───── Link 5: Material Abundance ───── */}
      <section className="mb-12" id="link-5">
        <div className="border-t border-card pt-8">
          <SectionLabel number="05" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            Goods get cheap. Spending shifts to services.
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Robot manufacturing drives the next structural shift.
              Industrial robot costs have fallen from ~$47,000 in 2011
              to ~$23,000 in 2022, with collaborative robot prices
              declining 4&ndash;6% annually. As manufacturing automates
              further, goods become cheaper and easier to produce
              domestically. Supply chains shorten. The cost of physical
              things &mdash; appliances, vehicles, building materials,
              electronics &mdash; falls in real terms.
            </p>
            <p>
              This is not a prediction about the future. It is the
              continuation of a 70-year trend. The US economy has already
              shifted from goods to services: services now account for
              71% of GDP, nearly doubling their share since 1953. As
              goods become commodities, the share of household spending
              on human-delivered services grows. Today&rsquo;s luxuries
              become tomorrow&rsquo;s expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <EvidenceCard
              stat="71%"
              label="of US GDP is now services (2024) — nearly 2x the 1953 share"
              source="Bureau of Economic Analysis (2024)"
              tier={1}
              compact
            />
            <EvidenceCard
              stat="-51%"
              label="decline in industrial robot costs, 2011 to 2022"
              source="Inbolt / IFR analysis (2024)"
              tier={2}
              compact
            />
          </div>
        </div>
      </section>

      {/* ───── Link 6: The Service Economy Blooms ───── */}
      <section className="mb-12" id="link-6">
        <div className="border-t border-card pt-8">
          <SectionLabel number="06" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            Human services become the economy
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              Here is where Baumol&rsquo;s cost disease stops being a
              bug and becomes a feature.
            </p>
            <p>
              William Baumol observed in 1966 that labor-intensive
              services &mdash; education, healthcare, performing arts
              &mdash; resist productivity improvement because their
              value comes from the human time itself. A string quartet
              cannot play faster. A therapist cannot see more patients
              without degrading care. This makes these services
              perpetually expensive relative to goods, which is why
              healthcare and education costs have risen relentlessly.
            </p>
            <p>
              But in an economy where goods are cheap, the{" "}
              <em>relative</em> expense of human services stops being a
              budget problem and starts being a labor market solution.
              The sectors that are expensive{" "}
              <em>because</em> they require human attention are exactly
              the sectors that absorb displaced workers. And they are
              jobs worth having.
            </p>
          </div>

          {/* The four service pillars */}
          <div className="space-y-3 mb-6">
            <ServicePillar
              title="High-quality education"
              description="Schooling in many places has historically been low quality for most, with lifelong knock-on effects. 1-on-1 personal attention by human teachers for younger students, plus AI-personalized tutoring for older students, bridges this gap. If even a fraction of K-8 students received regular human tutoring, the implied labor demand runs into the millions of positions — dwarfing the 411K current teacher shortage."
              stat="2 SD improvement"
              statNote="Students tutored 1-on-1 perform 2 standard deviations above classroom peers (Bloom, 1984). AI tutoring at Harvard showed 2x the learning gains of active learning (Kestin et al., 2025). With ~35M K-8 students in the US, even 1:10 tutor-to-student ratios imply 3.5M tutor positions."
              color="#5C61F6"
            />
            <ServicePillar
              title="Preventive healthcare for everyone"
              description="People use ERs for treatable conditions not because they lack judgment, but because they lack access — no primary care provider, no appointment available, no way to assess severity at 2 AM. AI triage addresses the access barrier: 24/7 symptom assessment that routes people to the right level of care, creating demand for more human providers at every tier."
              stat="18M avoidable ER visits/year"
              statNote="67% of ER visits by the privately insured are for conditions treatable in primary care. Average ER cost: $2,032 vs. $167 at a physician's office. The gap reflects access barriers, not patient irrationality — and closing it creates millions of primary care, urgent care, and community health roles. (UnitedHealth Group, 2019)"
              color="#10b981"
            />
            <ServicePillar
              title="Elevated service quality everywhere"
              description="The bar for customer service rises across the board — high-end retail, hospitality, personal services. Japan's omotenashi model shows what this looks like: higher staffing ratios, lower measured productivity, but service quality that Americans would recognize as luxury."
              stat="73.3% of Japan's workforce"
              statNote="Japan's service sector employs 73.3% of workers (2023) — with retail/hospitality staffing ratios that produce service quality Americans experience as luxury. (World Bank, 2023)"
              color="#f59e0b"
            />
            <ServicePillar
              title="AI-enabled entrepreneurship"
              description="Easy access to AI agents means starting a business requires judgment and ambition, not capital for a back office. Solo founders deploy AI for operations while focusing on the irreducibly human work: reading markets, building relationships, making bets."
              stat="5.5M new businesses (2023)"
              statNote="Record-high business applications. Census research: AI-using young firms show faster revenue growth and higher conversion to employer businesses. (Census BFS, 2024)"
              color="#ef4444"
            />
          </div>
        </div>
      </section>

      {/* ───── Link 7: The Work Week and the Good Life ───── */}
      <section className="mb-12" id="link-7">
        <div className="border-t border-card pt-8">
          <SectionLabel number="07" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            Everyone works 3&ndash;4 days a week
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              This is where the scenario arrives. Not at leisure &mdash;
              at a different allocation of time.
            </p>
            <p>
              The historical precedent is exact. The average American
              work week fell from ~60 hours in the 1880s to 40 hours by
              the 1940s, a one-third reduction driven entirely by
              productivity gains. Workers chose to convert some of their
              increased productive capacity into time rather than
              income. The same mechanism operates here.
            </p>
            <p>
              When AI handles the routine cognitive work that currently
              fills 20&ndash;30% of a knowledge worker&rsquo;s week
              &mdash; drafting, summarizing, scheduling, data processing,
              first-pass analysis &mdash; the same output can be
              produced in less time. Firms that compete for talent offer
              compressed schedules. The 4-day week becomes a recruiting
              advantage, then a norm, then an expectation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard
              value="~60 hrs"
              label="1880s"
              sublabel="Average US work week"
              color="#ef4444"
            />
            <StatCard
              value="~40 hrs"
              label="1940s"
              sublabel="After mechanization"
              color="#f59e0b"
            />
            <StatCard
              value="~30 hrs"
              label="20??s"
              sublabel="After cognitive automation"
              color="#10b981"
              emphasis
            />
          </div>

          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75]">
            <p>
              The jobs in this economy are jobs worth having. Teaching a
              child to read. Helping a patient recover. Designing a
              building. Running a business. Providing the kind of
              attentive, human-led service that has always been reserved
              for the wealthy. The work is hard and meaningful. It is
              not replaced by AI because its value is inseparable from
              the human providing it.
            </p>
            <p>
              The historical precedent sets the timeline. The shift from
              60- to 40-hour weeks took roughly 60 years. This scenario
              is faster &mdash; 15 to 25 years &mdash; because the
              underlying technology diffuses faster than electrification
              did. But it is not instant. The{" "}
              <a
                href="/j-curve"
                className="text-[var(--accent)] hover:underline"
              >
                J-curve
              </a>{" "}
              applies: the disruption arrives before the equilibrium.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CODA: Conditionals
         ═══════════════════════════════════════ */}
      <section className="mb-12">
        <div className="border-t border-card pt-8">
          <SectionLabel number="08" />
          <h2 className="text-3xl sm:text-heading-lg font-bold text-[var(--foreground)] leading-tight mb-3">
            What has to go right
          </h2>
          <div className="space-y-4 text-md text-[var(--muted)] leading-[1.75] mb-6">
            <p>
              This is a scenario, not a prophecy. Every link in the chain
              is conditional. If enough of these conditions fail, the
              more likely outcome is Acemoglu&rsquo;s &ldquo;so-so
              automation&rdquo; &mdash; a long period of modest
              productivity gains, continued labor share decline, and
              rising inequality without compensating abundance. Not
              dystopia, but stagnation. Here are the things that must
              hold for the better path:
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <ConditionalCard
              condition="Policy acts during the window"
              risk="Recessions create political will, but it can be captured by incumbents who prefer subsidies over structural reform. If the policy response is tax credits for AI adoption rather than apprenticeship programs, the disruption deepens without the reallocation."
            />
            <ConditionalCard
              condition="Care economy transitions are funded at scale"
              risk="Retraining 6 million workers is not a pilot program. The US currently spends a fraction of what peer nations spend on active labor market policy — 0.1% of GDP vs. Denmark's 1.9%. Scaling requires political commitment that historically evaporates when the recession ends."
            />
            <ConditionalCard
              condition="Firms choose augmentation over pure automation"
              risk="The Turing Trap is real. If firms optimize for headcount reduction rather than worker productivity, the career ladder stays broken. This is a corporate governance question as much as a technology question."
            />
            <ConditionalCard
              condition="Market concentration doesn't capture the gains"
              risk="If a few dominant firms capture AI's productivity gains through market power (Bessen's 'New Goliaths'), the abundance doesn't reach consumers or workers. Antitrust enforcement is a prerequisite."
            />
            <ConditionalCard
              condition="Machine fluency doesn't become the new inequality"
              risk="The ability to effectively direct AI systems — what Imas calls 'specification hazard' — varies systematically by demographics, education, and personality. If the gains of the AI transition flow disproportionately to those with high 'machine fluency,' the scenario reproduces inequality in a new form rather than resolving it. Broad-based AI literacy programs are a prerequisite."
            />
            <ConditionalCard
              condition="The reduced work week is chosen, not imposed"
              risk="If productivity gains are captured by firms as profit rather than shared as reduced hours, workers get the displacement without the leisure. The historical precedent required strong labor bargaining power."
            />
          </div>
        </div>
      </section>

      {/* ───── Closing ───── */}
      <section className="mb-12">
        <div className="border-t border-card pt-8">
          <blockquote className="border-l-4 border-[var(--accent)] bg-[var(--accent-light)] rounded-r-lg p-4 sm:p-5">
            <p
              className="text-lg sm:text-xl text-[var(--foreground)] leading-[1.75] font-medium"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Baumol&rsquo;s cost disease is a feature, not a bug. The
              relative expense of human services stops being a budget
              problem and starts being a labor market solution. That is
              where the jobs are, and they&rsquo;re jobs worth having.
            </p>
          </blockquote>

          <div className="mt-6 space-y-4 text-md text-[var(--muted)] leading-[1.75]">
            <p>
              None of this requires AGI, superintelligence, or
              technological breakthroughs beyond what already exists in
              labs today. It requires AI that is good enough to automate
              routine cognitive work, cheap enough to deploy widely, and
              paired with institutional choices that direct the
              resulting abundance toward human flourishing.
            </p>
            <p>
              Acemoglu put it best in his Nobel lecture: &ldquo;Institutions
              are always about choices. What worries us also gives us
              hope.&rdquo;
            </p>
          </div>

          {/* Source note */}
          <div className="mt-8 rounded-lg border border-card p-4 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
              Sources &amp; frameworks
            </p>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              This scenario draws on: Acemoglu &amp; Restrepo&rsquo;s
              task-based automation framework; Brynjolfsson, Chandar &amp;
              Chen&rsquo;s &ldquo;Canaries&rdquo; paper on entry-level displacement;
              Kinder &amp; Gimbel&rsquo;s adaptive capacity analysis
              (Brookings/Yale Budget Lab); Bessen&rsquo;s demand
              elasticity model; Baumol&rsquo;s cost disease (1966);
              Bloom&rsquo;s 2-sigma tutoring finding (1984); BLS and
              Census Bureau labor statistics. All data points are cited
              inline. For the full evidence base, see the{" "}
              <a
                href="/predictions"
                className="text-[var(--accent)] hover:underline"
              >
                prediction dashboard
              </a>, including{" "}
              <a
                href="/predictions/customer-service-automation"
                className="text-[var(--accent)] hover:underline"
              >
                customer service automation
              </a>,{" "}
              <a
                href="/predictions/white-collar-professional-displacement"
                className="text-[var(--accent)] hover:underline"
              >
                white-collar displacement
              </a>, and{" "}
              <a
                href="/predictions/workforce-ai-exposure"
                className="text-[var(--accent)] hover:underline"
              >
                workforce AI exposure
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* ───── Share ───── */}
      <section className="mb-8">
        <ShareSectionBar
          url="https://jobsdata.ai/future"
          title="From Here to There"
          description="A plausible path through the AI transition"
        />
      </section>
    </article>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   Utility Components
   ══════════════════════════════════════════════════════════════════════ */

function SectionLabel({ number }: { number: string }) {
  return (
    <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3 block">
      {number}
    </span>
  );
}

function PhaseLabel({
  phase,
  title,
  color,
}: {
  phase: string;
  title: string;
  color: string;
}) {
  return (
    <div className="mb-6 mt-4">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          {phase}
        </div>
        <h3
          className="text-xl sm:text-2xl font-bold tracking-tight"
          style={{ color }}
        >
          {title}
        </h3>
        <div
          className="flex-1 h-px"
          style={{ backgroundColor: color + "30" }}
        />
      </div>
    </div>
  );
}

/* ── Chain Diagram ── */

const CHAIN_LINKS = [
  { id: 1, label: "Recession breaks career ladder", color: "#ef4444", phase: "I" },
  { id: 2, label: "Political window opens", color: "#5C61F6", phase: "II" },
  { id: 3, label: "Workers move to care economy", color: "#5C61F6", phase: "II" },
  { id: 4, label: "Construction + entrepreneurship unlock", color: "#5C61F6", phase: "II" },
  { id: 5, label: "Goods get cheap", color: "#10b981", phase: "III" },
  { id: 6, label: "Human services become the economy", color: "#10b981", phase: "III" },
  { id: 7, label: "3-4 day work week", color: "#10b981", phase: "III" },
];

function ChainDiagram() {
  return (
    <div className="relative">
      {CHAIN_LINKS.map((link, i) => (
        <a
          key={link.id}
          href={`#link-${link.id}`}
          className="group flex items-start gap-3 py-2.5 hover:bg-black/[0.02] -mx-3 px-3 rounded-lg transition-colors"
        >
          {/* Dot + connector */}
          <div className="flex flex-col items-center shrink-0 pt-0.5">
            <div
              className="w-3 h-3 rounded-full border-2 group-hover:scale-125 transition-transform"
              style={{
                borderColor: link.color,
                backgroundColor: link.color + "20",
              }}
            />
            {i < CHAIN_LINKS.length - 1 && (
              <div
                className="w-px h-5 mt-0.5"
                style={{ backgroundColor: link.color + "30" }}
              />
            )}
          </div>

          {/* Label */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold tabular-nums" style={{ color: link.color }}>
              {String(link.id).padStart(2, "0")}
            </span>
            <span className="text-base text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors leading-snug">
              {link.label}
            </span>
            <span className="text-xs opacity-0 group-hover:opacity-60 transition-opacity ml-auto shrink-0">
              &darr;
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ── Evidence Card ── */

const TIER_COLORS: Record<number, string> = {
  1: "#10b981",
  2: "#5C61F6",
  3: "#f59e0b",
  4: "#6b7280",
};

const TIER_LABELS: Record<number, string> = {
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
  4: "Tier 4",
};

function EvidenceCard({
  stat,
  label,
  source,
  tier,
  compact,
}: {
  stat: string;
  label: string;
  source: string;
  tier: number;
  compact?: boolean;
}) {
  const color = TIER_COLORS[tier] || "#6b7280";

  return (
    <div
      className={`rounded-lg border-l-3 ${compact ? "px-3 py-2.5" : "p-4 sm:p-5"}`}
      style={{
        borderLeftColor: color,
        borderLeftWidth: 3,
        backgroundColor: color + "08",
      }}
    >
      <div className="flex items-baseline gap-2 mb-1">
        <span
          className={`font-black tabular-nums ${compact ? "text-heading-sm" : "text-heading"}`}
          style={{ color }}
        >
          {stat}
        </span>
        <span className={`text-[var(--muted)] leading-snug ${compact ? "text-sm" : "text-base"}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-3xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: color + "15", color }}
        >
          {TIER_LABELS[tier]}
        </span>
        <span className="text-xs text-[var(--muted)] opacity-70">
          {source}
        </span>
      </div>
    </div>
  );
}

/* ── Stat Card (matches J-curve pattern) ── */

function StatCard({
  value,
  label,
  sublabel,
  color,
  emphasis,
}: {
  value: string;
  label: string;
  sublabel: string;
  color: string;
  emphasis?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const numMatch = value.match(/~?(\d+)/);
  const targetNum = numMatch ? parseInt(numMatch[1], 10) : null;
  const prefix = value.startsWith("~") ? "~" : "";
  const suffix = value.replace(/~?\d+/, "");

  return (
    <div
      ref={ref}
      className={`text-center rounded-lg px-3 border${emphasis ? " py-4 relative" : " py-3"}`}
      style={{
        borderColor: emphasis ? color + "50" : color + "30",
        backgroundColor: emphasis ? color + "12" : color + "08",
        ...(emphasis ? { boxShadow: `0 0 16px ${color}15` } : {}),
      }}
    >
      {emphasis && (
        <span
          className="absolute top-2 right-2 text-3xs font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: color + "20", color }}
        >
          Next
        </span>
      )}
      <p
        className={emphasis ? "text-heading-lg sm:text-heading-xl font-black" : "text-3xl sm:text-heading font-black"}
        style={{ color }}
      >
        {targetNum !== null && visible ? (
          <CountUp target={targetNum} prefix={prefix} suffix={suffix} />
        ) : (
          value
        )}
      </p>
      <p className="text-xs font-bold text-[var(--foreground)] mt-0.5">
        {label}
      </p>
      <p className="text-2xs text-[var(--muted)]">{sublabel}</p>
    </div>
  );
}

function CountUp({
  target,
  prefix,
  suffix,
}: {
  target: number;
  prefix: string;
  suffix: string;
}) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCurrent(target);
      return;
    }

    let start: number | null = null;
    const duration = 800;

    function tick(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return (
    <>
      {prefix}
      {current}
      {suffix}
    </>
  );
}

/* ── Service Pillar ── */

function ServicePillar({
  title,
  description,
  stat,
  statNote,
  color,
}: {
  title: string;
  description: string;
  stat: string;
  statNote: string;
  color: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg border p-4 sm:p-5 cursor-pointer hover:bg-black/[0.01] transition-colors"
      style={{ borderColor: color + "25" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4
            className="text-md font-bold text-[var(--foreground)] mb-1"
          >
            {title}
          </h4>
          <p className="text-base text-[var(--muted)] leading-relaxed">
            {description}
          </p>
        </div>
        <span
          className="text-xs shrink-0 mt-1 transition-transform"
          style={{
            color: color,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          &#9660;
        </span>
      </div>

      {/* Expandable evidence */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? "200px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div
          className="mt-3 pt-3 border-t"
          style={{ borderColor: color + "15" }}
        >
          <p className="text-base font-bold mb-0.5" style={{ color }}>
            {stat}
          </p>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            {statNote}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Conditional Card ── */

function ConditionalCard({
  condition,
  risk,
}: {
  condition: string;
  risk: string;
}) {
  return (
    <div className="rounded-lg border border-amber-200/80 bg-amber-50/50 p-4 sm:p-6">
      <h4 className="text-base font-bold text-[var(--foreground)] mb-1.5">
        {condition}
      </h4>
      <p className="text-sm text-[var(--muted)] leading-relaxed">
        {risk}
      </p>
    </div>
  );
}
