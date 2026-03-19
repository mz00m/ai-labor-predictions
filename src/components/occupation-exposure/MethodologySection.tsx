"use client";

import { useState } from "react";

function ExpandableSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/[0.04] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 text-left"
      >
        <span className="text-[13px] font-semibold text-[var(--foreground)]">
          {title}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`text-[var(--muted)] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
      </button>
      {open && (
        <div className="pb-4 text-[13px] text-[var(--muted)] leading-[1.75] space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

export default function MethodologySection() {
  return (
    <div className="border border-black/[0.06] rounded-lg overflow-hidden">
      <ExpandableSection title="Dimension 1: Technical AI Exposure">
        <p>
          How many of an occupation&rsquo;s tasks can current or near-term AI
          systems perform? We use GPT-scored exposure ratings for 342 BLS
          Occupational Outlook Handbook occupations, validated against six
          academic exposure indices (Pearson r = 0.878 with Yale PCA reference,
          0.885 with Eloundou et al.).
        </p>
        <p>
          Scores are aggregated to the SOC major group level. This is
          deliberately similar to Karpathy&rsquo;s approach, but uses a more
          rigorous validation pipeline against academic benchmarks rather than a
          single LLM pass.
        </p>
        <p className="text-[11px] italic">
          Sources: Yale Budget Lab (2026); Eloundou et al. (2023); Felten et al.
          (2023); Eisfeldt et al. (2023); Tomlinson et al. (2024)
        </p>
      </ExpandableSection>

      <ExpandableSection title="Dimension 2: Institutional Adoption Speed">
        <p>
          Economic viability is necessary but not sufficient for displacement.
          Real adoption requires process redesign, regulatory compliance, staff
          retraining, and cultural buy-in. Historical technology diffusion
          research (Griliches 1957, Comin & Hobijn 2010) consistently shows
          5-45 year gaps between economic viability and full adoption.
        </p>
        <p>
          We score each industry on five factors: regulatory burden (25%),
          digital maturity (25%), competitive pressure (20%), labor rigidity
          (15%), and organizational complexity (15%). Technology has a 0.6x
          multiplier (fast); healthcare has 1.4x (very slow).
        </p>
        <p className="text-[11px] italic">
          Sources: OECD Product Market Regulation; McKinsey &ldquo;Digital
          America&rdquo; (2015); Acemoglu & Restrepo (2020); Brynjolfsson et al.
          (2021)
        </p>
      </ExpandableSection>

      <ExpandableSection title="Dimension 3: Worker Adaptability">
        <p>
          When displacement does occur, some workers can transition more easily
          than others. Manning & Aguirre (NBER w34705, 2026) construct a
          composite adaptability index across 356 occupations covering 95.9% of
          the US workforce, based on four sub-components: net liquid wealth
          (financial buffer), skill transferability (O*NET cross-occupation skill
          overlap), geographic job density (Lightcast CBSA data), and age
          fraction (workers 55+ face steeper retraining curves).
        </p>
        <p>
          Professional and managerial workers score highest (0.734) due to
          transferable skills and financial buffers. Administrative support
          scores lowest (0.360): narrow skills, lower savings, and concentrated
          geography.
        </p>
        <p className="text-[11px] italic">
          Sources: Manning & Aguirre, NBER w34705 (2026); O*NET; SIPP 2022-2024;
          BLS CPS; Lightcast
        </p>
      </ExpandableSection>

      <ExpandableSection title="Dimension 4: Demand Elasticity">
        <p>
          The Jevons Paradox: when AI makes an occupation&rsquo;s output
          cheaper, total demand for that output may expand enough to offset
          productivity-driven headcount reduction. This has happened repeatedly:
          ATMs lowered branch costs and teller employment <em>grew</em> for 30
          years; cheaper web design made professional design accessible to
          millions of small businesses.
        </p>
        <p>
          We classify each occupation group as high, moderate, or low elasticity
          based on historical precedent and structural analysis. High-elasticity
          groups (arts/media, personal care, community services) have large
          pools of unmet demand. Low-elasticity groups (office admin,
          transportation, building maintenance) serve fixed demand that
          doesn&rsquo;t expand when costs fall.
        </p>
        <p className="text-[11px] italic">
          Sources: Bessen (2019); Autor & Salomons (2018); jobsdata.ai demand
          elasticity analysis
        </p>
      </ExpandableSection>

      <ExpandableSection title="Dimension 5: AI Complementarity">
        <p>
          Is AI primarily enhancing worker productivity or substituting for
          workers entirely? The Baslandze et al. (2026) CFO survey asked ~750
          executives whether AI was replacing or enhancing roles in each
          occupation group. The Negative Exposure Index (NEI) measures the ratio
          of replacement to enhancement mentions.
        </p>
        <p>
          Office & administrative support is the only group where CFOs
          predominantly describe AI as replacing rather than enhancing (NEI =
          2.03). Management and engineering are strongly enhancement-dominant
          (NEI &lt; 0.15). For occupation groups without CFO survey data, we
          estimate complementarity from task composition: high
          interpersonal/physical content suggests complementarity; high
          information-processing suggests substitution.
        </p>
        <p className="text-[11px] italic">
          Sources: Baslandze et al. (2026) Fed Atlanta/Duke CFO Survey; Autor
          (2024) new-tasks framework; Agrawal et al. prediction/judgment
          decomposition
        </p>
      </ExpandableSection>

      <ExpandableSection title="Composite Score Calculation">
        <p>
          The net displacement risk score combines the five dimensions with the
          following weights: Technical Exposure (30%), Adoption Speed (20%),
          Worker Adaptability (15%), Demand Elasticity (20%), Complementarity
          (15%).
        </p>
        <p>
          Exposure and adoption speed are &ldquo;pressure&rdquo; factors that
          drive displacement up. Adaptability, elasticity, and complementarity
          are &ldquo;absorption&rdquo; factors that moderate it. The composite
          formula: Net Risk = (w1 &times; Exposure + w2 &times; Speed) &minus;
          (w3 &times; Adaptability + w4 &times; Elasticity + w5 &times;
          Complementarity), normalized to 0-10.
        </p>
        <p>
          The weighting is intentionally simple and transparent. Reasonable
          people will disagree on weights. The tool&rsquo;s value is not in the
          precise composite number but in showing that single-dimension exposure
          scores omit most of what determines actual displacement.
        </p>
      </ExpandableSection>

      <ExpandableSection title="Limitations">
        <p>
          This framework operates at the SOC major group level (22 groups),
          which masks significant within-group variation. A &ldquo;computer
          and mathematical&rdquo; group includes both data entry clerks and
          machine learning researchers.
        </p>
        <p>
          The composite weights are author-chosen, not econometrically
          estimated. Demand elasticity classifications are qualitative
          assessments, not measured parameters. CFO complementarity data covers
          only 8 of 22 groups.
        </p>
        <p>
          These scores describe structural tendencies, not predictions for
          individual workers. A person&rsquo;s actual risk depends on their
          specific role, employer, geography, skills, and adaptability &mdash;
          not just their occupation group&rsquo;s average.
        </p>
      </ExpandableSection>
    </div>
  );
}
