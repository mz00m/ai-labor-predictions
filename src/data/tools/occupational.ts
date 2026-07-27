/**
 * Occupation-native AI tools.
 *
 * Every entry here names a product someone in the occupation would recognize.
 * That is the whole bar, and the previous approach failed it: routing the
 * scorecard through the horizontal office-software catalog put Grammarly at
 * the top of both the Lawyers page and the HR pages.
 *
 * Rules for this file:
 *   - Pricing is verbatim from the vendor, or "Pricing not public." Most
 *     clinical, legal, and industrial AI is quote-only; inventing a number
 *     is worse than admitting there isn't one.
 *   - No padding. Several occupations genuinely have little worker-facing AI
 *     tooling, and a short honest list beats a long plausible one.
 *   - Product names rot. Lexis+ AI became Lexis+ with Protégé in Feb 2026;
 *     Spellbook moved off spellbook.legal. Re-verify against `lastVerified`.
 */

import type { OccupationTool } from "./occupational-types";

export const OCCUPATION_TOOLS: OccupationTool[] = [
  // -------------------------------------------------------------------------
  // Legal
  // -------------------------------------------------------------------------
  {
    id: "harvey",
    name: "Harvey",
    url: "https://www.harvey.ai",
    description:
      "Legal AI platform used inside large firms and in-house teams, where agents run multi-step matter work against the firm's own document set rather than answering one question at a time.",
    automates: [
      "Due diligence review across a full deal document set",
      "First-pass contract review and negotiation markup",
      "Legal and regulatory research grounded in firm knowledge",
      "Drafting from precedent held in Vault",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["legal"],
    occupationSlugs: ["lawyers", "paralegals-and-legal-assistants"],
    limitations: [
      "Sold to firms and legal departments, not to individual practitioners",
      "Value depends on having a large internal document corpus to ground against",
      "Output still requires attorney review before it leaves the building",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "cocounsel",
    name: "CoCounsel Legal (Thomson Reuters)",
    url: "https://www.thomsonreuters.com/en/cocounsel",
    description:
      "Thomson Reuters' legal AI assistant, grounded in Westlaw content, that handles research, drafting, and review in one place.",
    automates: [
      "Legal research with citations back to primary authority",
      "Document review and deposition summarization",
      "Contract drafting and redlining",
      "Matter management across a caseload",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["legal"],
    occupationSlugs: ["lawyers", "paralegals-and-legal-assistants"],
    limitations: [
      "Strongest for firms already paying for Westlaw",
      "Sold in separate Legal, Tax, and Audit editions — capability differs by edition",
      "Grounding reduces but does not eliminate the need to check citations",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "lexis-protege",
    name: "Lexis+ with Protégé",
    url: "https://www.lexisnexis.com/en-us/products/lexis-plus-ai.page",
    description:
      "LexisNexis' legal AI assistant, renamed from Lexis+ AI in February 2026, that drafts and researches against LexisNexis content with Shepard's citation validation built in.",
    automates: [
      "Drafting motions, briefs, complaints, and transactional agreements",
      "Legal research across primary law and secondary sources",
      "Citation validation through Shepard's",
      "Summarizing and analyzing uploaded case materials",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["legal"],
    occupationSlugs: [
      "lawyers",
      "paralegals-and-legal-assistants",
      "judges-and-hearing-officers",
    ],
    limitations: [
      "Requires a LexisNexis content subscription to be useful",
      "Renamed recently — older guides and reviews still say Lexis+ AI",
      "Drafting output is a starting point, not a filing",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "spellbook",
    name: "Spellbook",
    url: "https://spellbook.com",
    description:
      "A Microsoft Word add-in that redlines and drafts contracts in place, so transactional work never leaves the document.",
    automates: [
      "Redlining third-party paper against your own playbook",
      "Flagging non-standard or missing terms in vendor agreements",
      "Generating clauses and full drafts from a precedent library",
      "Benchmarking terms against market standards",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public; 7-day free trial",
    occupationCategories: ["legal"],
    occupationSlugs: ["lawyers", "paralegals-and-legal-assistants"],
    limitations: [
      "Contracts only — not litigation, research, or practice management",
      "Requires Microsoft Word; no standalone editor",
      "Domain moved from spellbook.legal to spellbook.com",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "clearbrief",
    name: "Clearbrief",
    url: "https://www.clearbrief.com",
    description:
      "A Word add-in that checks every factual assertion in a brief against the record and the cited authority, catching unsupported and hallucinated citations before filing.",
    automates: [
      "Verifying record citations against the underlying evidence",
      "Generating a Table of Authorities",
      "Building case timelines from depositions and records",
      "Checking an opponent's brief for unsupported assertions",
    ],
    aiNative: "ai-native",
    pricingDetails: "$300/user/mo (Solo); Enterprise Unlimited custom",
    occupationCategories: ["legal"],
    occupationSlugs: ["lawyers", "paralegals-and-legal-assistants"],
    limitations: [
      "Litigation-focused — little use in transactional practice",
      "Priced for firms, steep for solo practitioners",
      "Requires Microsoft Word and a LexisNexis link for citation checks",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "clio-duo",
    name: "Clio (with Clio Duo)",
    url: "https://www.clio.com",
    description:
      "Practice management for small and mid-size firms — cases, billing, calendaring, intake — with a Duo AI layer that drafts documents and answers questions about the firm's own matters.",
    automates: [
      "AI document drafting from case context",
      "Time capture and trust-compliant billing",
      "Client intake with conflict checking",
      "Court deadline calculation and calendaring",
    ],
    aiNative: "ai-enhanced",
    pricingDetails:
      "$39/user/mo (EasyStart) to $149/user/mo (Complete); Duo on higher tiers",
    occupationCategories: ["legal"],
    occupationSlugs: ["lawyers", "paralegals-and-legal-assistants"],
    limitations: [
      "Duo sits on the upper tiers, not the entry plan",
      "Built for small and mid-size firms rather than large-firm workflows",
      "Migrating from another practice management system is a real project",
    ],
    lastVerified: "2026-04-01",
  },
  {
    id: "verbit-legal",
    name: "Verbit Legal Capture",
    url: "https://verbit.ai/legal/",
    description:
      "Real-time AI transcription built for court reporting agencies and digital reporters, with a separate Legal Visor product that gives attorneys live insight into the record.",
    automates: [
      "Real-time transcription of depositions and proceedings",
      "Rough draft production immediately after a proceeding",
      "Speaker identification and keyword indexing of the record",
      "Translation and captioning of recorded proceedings",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["legal"],
    occupationSlugs: ["court-reporters"],
    limitations: [
      "Certified transcripts still require a human reporter to certify",
      "Accuracy degrades with crosstalk, accents, and poor room audio",
      "Aimed at agencies more than at individual reporters",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Protective service
  //
  // Nearly all of this is employer-deployed: an officer does not choose these,
  // an agency procures them. Kept deliberately short — the rest of this
  // category (firefighters, corrections) runs on agency systems with no
  // consumer-facing AI product worth naming.
  // -------------------------------------------------------------------------
  {
    id: "axon-draft-one",
    name: "Axon Draft One",
    url: "https://www.axon.com",
    description:
      "Generates a police report narrative from body-worn camera audio, which the officer then reviews, edits, and signs before it becomes a record.",
    automates: [
      "First-draft incident narratives from body camera transcripts",
      "Report turnaround within minutes of an incident closing",
      "Side-by-side review of draft against source video",
      "Audit logging of every AI-assisted report",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["protective-service"],
    occupationSlugs: ["police-and-detectives"],
    employerDeployed: true,
    limitations: [
      "Restricted to what is audible on the transcript — no inference",
      "Several prosecutors' offices restrict AI-drafted reports for serious charges",
      "Requires Axon body cameras and evidence management",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "truleo",
    name: "Truleo",
    url: "https://www.truleo.co",
    description:
      "Searches across an agency's disconnected systems — records, dispatch, body camera, jail calls, license plate readers — and surfaces case leads from them.",
    automates: [
      "Single-query search across records, CAD, and body camera systems",
      "Linking jail calls and phone records to open cases",
      "Report writing and interview summarization",
      "Policy drafting for command staff",
    ],
    aiNative: "ai-native",
    pricingDetails:
      "$50/user/mo (Patrol), $200/user/mo (Investigations), $250/user/mo (Command); $100/mo per connector",
    occupationCategories: ["protective-service"],
    occupationSlugs: ["police-and-detectives", "private-detectives-and-investigators"],
    employerDeployed: true,
    limitations: [
      "Value scales with how many agency systems are connected",
      "Body camera analytics have drawn union objections in some departments",
      "Per-connector pricing adds up for agencies with many legacy systems",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Healthcare
  //
  // Ambient documentation is the one category with real, measured adoption;
  // it is scoped to clinician slugs rather than the whole `healthcare`
  // category, which also contains opticians, massage therapists, and
  // veterinary aides who do not write clinical notes.
  // -------------------------------------------------------------------------
  {
    id: "abridge",
    name: "Abridge",
    url: "https://www.abridge.com",
    description:
      "Listens to the visit and produces a structured clinical note, orders, and a patient summary before the clinician leaves the room.",
    automates: [
      "Note generation from the clinician-patient conversation",
      "Coding specificity and billing-ready documentation",
      "Order capture during the encounter",
      "After-visit summaries written for the patient",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "physicians-and-surgeons",
      "nurse-anesthetists-nurse-midwives-and-nurse-practitioners",
      "physician-assistants",
      "registered-nurses",
    ],
    limitations: [
      "Bought by health systems, not by individual clinicians",
      "Clinician still reviews and signs every note",
      "Accuracy drops in noisy rooms and with heavy accents or interpreters",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "dragon-copilot",
    name: "Microsoft Dragon Copilot",
    url: "https://www.microsoft.com/en-us/health-solutions/clinical-workflow/dragon-copilot",
    description:
      "Microsoft's clinical assistant, formed by folding Nuance DAX Copilot and Dragon Medical together, with separate workflows for physicians, nurses, and radiologists.",
    automates: [
      "Ambient note capture and generation during the encounter",
      "Dictation and voice-driven navigation of the chart",
      "Surfacing prior history and results mid-visit",
      "Radiology reporting workflows",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "physicians-and-surgeons",
      "nurse-anesthetists-nurse-midwives-and-nurse-practitioners",
      "physician-assistants",
      "registered-nurses",
      "radiologic-technologists",
    ],
    limitations: [
      "Renamed from DAX Copilot — older comparisons use the old name",
      "Enterprise deployment tied to Microsoft and EHR integration work",
      "Strongest inside organizations already standardized on Nuance",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "freed",
    name: "Freed",
    url: "https://www.getfreed.ai",
    description:
      "An AI scribe priced for independent and community clinics rather than health systems, with add-on coding help and an AI front desk.",
    automates: [
      "Clinical note generation synced back to the EHR",
      "ICD-10 and CPT code suggestions",
      "Answering clinical questions from cited sources",
      "Front-desk call handling and appointment booking",
    ],
    aiNative: "ai-native",
    pricingDetails: "From $39/mo (AI Scribe); Front Desk from $149/mo",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "physicians-and-surgeons",
      "nurse-anesthetists-nurse-midwives-and-nurse-practitioners",
      "physician-assistants",
      "medical-assistants",
      "medical-transcriptionists",
    ],
    limitations: [
      "Built for small and midsize clinics, not enterprise health systems",
      "EHR sync depth varies by system",
      "Coding suggestions still need a human check before billing",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "ambience",
    name: "Ambience Healthcare",
    url: "https://www.ambiencehealthcare.com",
    description:
      "Ambient documentation that runs inside Epic and takes the coding step seriously — E/M level, ICD-10, and HCC capture alongside the note.",
    automates: [
      "Real-time note capture across 200+ specialties",
      "E/M level selection and ICD-10 / CPT suggestion",
      "HCC opportunity identification for risk adjustment",
      "Structuring notes for compliance review",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "physicians-and-surgeons",
      "nurse-anesthetists-nurse-midwives-and-nurse-practitioners",
      "physician-assistants",
      "medical-records-and-health-information-technicians",
      "health-information-technologists-and-medical-registrars",
    ],
    limitations: [
      "Deepest value requires Epic",
      "Enterprise sale with an implementation cycle",
      "Coding accuracy claims are vendor-reported, not independently audited",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "suki",
    name: "Suki",
    url: "https://www.suki.ai",
    description:
      "Voice-first clinical assistant that writes the note, drafts orders and patient instructions, and lets clinicians edit by speaking.",
    automates: [
      "Ambient note generation from the encounter",
      "Patient instructions and order drafting",
      "Voice-command editing of an existing note",
      "Coding and revenue cycle assistance",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "physicians-and-surgeons",
      "nurse-anesthetists-nurse-midwives-and-nurse-practitioners",
      "physician-assistants",
      "registered-nurses",
    ],
    limitations: [
      "Integration quality varies across Epic, Oracle Health, athenahealth, MEDITECH",
      "Voice editing has a learning curve",
      "Clinician review still required before signing",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "aidoc",
    name: "Aidoc",
    url: "https://www.aidoc.com",
    description:
      "Reads imaging studies as they arrive and pushes suspected acute findings to the top of the radiologist's worklist.",
    automates: [
      "Triage of studies for pulmonary embolism, hemorrhage, and C-spine fracture",
      "Worklist reprioritization by suspected acuity",
      "Care team notification on positive findings",
      "Incidental finding follow-up tracking",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "physicians-and-surgeons",
      "radiologic-technologists",
      "nuclear-medicine-technologists",
    ],
    limitations: [
      "Triage aid only — the radiologist still reads and signs the study",
      "FDA clearance is per-algorithm, not blanket platform clearance",
      "False positives add worklist noise if thresholds are not tuned",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "viz-ai",
    name: "Viz.ai",
    url: "https://www.viz.ai",
    description:
      "Detects suspected large vessel occlusion and other time-critical findings on imaging, then alerts the whole stroke or cardiac team on mobile at once.",
    automates: [
      "Large vessel occlusion detection on CT angiography",
      "Simultaneous mobile alerting of the on-call care team",
      "Cardiac finding detection from imaging and EKG",
      "Transfer coordination between facilities",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "physicians-and-surgeons",
      "radiologic-technologists",
      "emts-and-paramedics",
    ],
    limitations: [
      "Value depends on the hospital having a stroke or cardiac pathway to trigger",
      "Alerting only — it does not make the treatment decision",
      "Requires imaging infrastructure integration",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "upheal",
    name: "Upheal",
    url: "https://www.upheal.io",
    description:
      "An AI-native EHR for therapists that writes the progress note from the session and checks it against payer requirements before signing.",
    automates: [
      "Progress notes generated from session audio, video, or text",
      "Treatment plan drafting from session history",
      "Compliance checks against payer documentation requirements",
      "Scheduling, intake forms, and client billing",
    ],
    aiNative: "ai-native",
    pricingDetails: "Free plan; $1/session capped at $69/mo (Individual)",
    occupationCategories: [
      "healthcare",
      "community-and-social-service",
      "life-physical-and-social-science",
    ],
    occupationSlugs: [
      "marriage-and-family-therapists",
      "substance-abuse-behavioral-disorder-and-mental-health-counselors",
      "psychologists",
      "social-workers",
      "rehabilitation-counselors",
    ],
    limitations: [
      "Recording therapy sessions requires explicit client consent",
      "Switching EHRs mid-practice is disruptive",
      "Not built for medical specialties outside behavioral health",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "overjet",
    name: "Overjet",
    url: "https://www.overjet.com",
    description:
      "FDA-cleared AI that outlines disease on dental x-rays, so findings can be shown to the patient on the image rather than described.",
    automates: [
      "Detection and outlining of caries and bone loss on radiographs",
      "Automatic image enhancement",
      "Insurance verification across 300+ payers",
      "Voice documentation of the visit and charting",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: ["dentists", "dental-hygienists", "dental-assistants"],
    limitations: [
      "Detection assists diagnosis — the dentist still makes the call",
      "Requires digital radiography and practice software integration",
      "Sold to practices and DSOs rather than to individual hygienists",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Software, IT, data, and research
  // -------------------------------------------------------------------------
  {
    id: "claude-code",
    name: "Claude Code",
    url: "https://claude.com/product/claude-code",
    description:
      "Terminal-based coding agent that reads a repository, edits files across it, runs tests, and opens pull requests from a written instruction.",
    automates: [
      "Multi-file changes reasoned across an entire codebase",
      "Test writing and iterating until the suite passes",
      "Debugging from a stack trace or failing test",
      "Commit, branch, and pull request creation",
      "Codebase questions without reading the files yourself",
    ],
    aiNative: "ai-native",
    pricingDetails:
      "Not on Free; Pro $17/mo billed annually ($20 monthly); Max from $100/mo; Team $20/seat/mo annually ($25 monthly), Premium seat $100/mo annually",
    occupationCategories: ["computer-and-information-technology"],
    occupationSlugs: [
      "software-developers",
      "computer-programmers",
      "web-developers",
      "computer-systems-analysts",
      "database-administrators",
      "computer-and-information-research-scientists",
      "network-and-computer-systems-administrators",
    ],
    limitations: [
      "Shares your plan's usage limits — heavy sessions hit them",
      "Acts on a real repository, so it needs review before merge",
      "Weaker on large legacy codebases with thin test coverage",
    ],
    lastVerified: "2026-07-27",
  },
  {
    id: "cursor",
    name: "Cursor",
    url: "https://cursor.com",
    description:
      "A code editor built around an agent that reads the whole repository and makes multi-file changes, rather than autocompleting a line at a time.",
    automates: [
      "Multi-file edits and refactors from a plain-language request",
      "Codebase-wide question answering",
      "Agentic code review on pull requests",
      "Running and iterating on tests until they pass",
    ],
    aiNative: "ai-native",
    pricingDetails: "Free (Hobby); $20/mo (Individual); $40/user/mo (Teams)",
    occupationCategories: ["computer-and-information-technology"],
    occupationSlugs: [
      "software-developers",
      "computer-programmers",
      "web-developers",
      "computer-systems-analysts",
      "database-administrators",
    ],
    limitations: [
      "Agent output needs review — it will confidently edit the wrong thing",
      "Heavy usage runs past included limits into usage-based billing",
      "Weaker on very large legacy codebases without good structure",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    description:
      "Completion and agent assistance inside the IDE and on GitHub itself, including automated code review on pull requests.",
    automates: [
      "Inline code completion and next-edit suggestions",
      "Pull request review and description drafting",
      "Delegating small issues to a cloud agent",
      "Explaining unfamiliar code in place",
    ],
    aiNative: "ai-enhanced",
    pricingDetails:
      "Free tier; $10/user/mo (Pro); $39/user/mo (Pro+); $100/user/mo (Max)",
    occupationCategories: ["computer-and-information-technology"],
    occupationSlugs: [
      "software-developers",
      "computer-programmers",
      "web-developers",
      "information-security-analysts",
      "network-and-computer-systems-administrators",
      "computer-support-specialists",
    ],
    limitations: [
      "Premium model access is metered by credits, not unlimited",
      "Suggestion quality drops in less common languages and frameworks",
      "Organizational policy often restricts which repositories it can see",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "elicit",
    name: "Elicit",
    url: "https://elicit.com",
    description:
      "Searches across 125M+ papers and extracts findings into a structured table, built around systematic review rather than chat.",
    automates: [
      "Literature search with extracted findings per paper",
      "Systematic review screening at scale",
      "Building comparison tables across studies",
      "Standing alerts on new papers in a research question",
    ],
    aiNative: "ai-native",
    pricingDetails: "Free (Basic); $49/mo (Pro); $169/mo (Scale)",
    occupationCategories: [
      "life-physical-and-social-science",
      "education-training-and-library",
    ],
    limitations: [
      "Extraction still needs verification against the source paper",
      "Coverage is weakest where papers are paywalled or non-English",
      "Screening caps differ sharply between tiers",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // HR, finance, and analysis
  // -------------------------------------------------------------------------
  {
    id: "paradox",
    name: "Paradox",
    url: "https://www.paradox.ai",
    description:
      "A conversational assistant that screens, schedules, and messages candidates over text, aimed at high-volume hourly hiring rather than executive search.",
    automates: [
      "Screening questions and qualification over chat or SMS",
      "Interview self-scheduling without recruiter coordination",
      "Candidate status updates and follow-up",
      "Offer letter generation and onboarding document delivery",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["business-and-financial", "management"],
    occupationSlugs: ["human-resources-specialists", "human-resources-managers"],
    limitations: [
      "Built for high-volume hourly roles; weak fit for specialized hiring",
      "Automated screening is subject to NYC Local Law 144 bias-audit rules",
      "Candidates who prefer human contact drop out of text-first funnels",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "eightfold",
    name: "Eightfold AI",
    url: "https://eightfold.ai",
    description:
      "Talent intelligence that matches people to roles on inferred skills rather than keyword-matching résumés, and runs agent-led screening at scale.",
    automates: [
      "Skills-based candidate matching against open roles",
      "AI-conducted first-round interviews with summaries for recruiters",
      "Internal mobility and succession recommendations",
      "Continuous candidate evaluation across a talent pool",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["business-and-financial", "management"],
    occupationSlugs: [
      "human-resources-specialists",
      "human-resources-managers",
      "compensation-benefits-and-job-analysis-specialists",
      "training-and-development-specialists",
    ],
    limitations: [
      "Automated employment decisioning is high-risk under the EU AI Act",
      "Publishes third-party bias audits — worth reading before deploying",
      "Match quality depends on how well internal skills data is maintained",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "numeric",
    name: "Numeric",
    url: "https://www.numeric.io",
    description:
      "Close automation that reconciles accounts, drafts journal entries, and writes the variance explanations a controller would otherwise chase down.",
    automates: [
      "Bank and account reconciliation",
      "Journal entry drafting and posting to the ERP",
      "Flux and variance analysis with written explanations",
      "Anomaly detection in general ledger activity",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["business-and-financial", "management"],
    occupationSlugs: [
      "accountants-and-auditors",
      "financial-analysts",
      "financial-managers",
      "bookkeeping-accounting-and-auditing-clerks",
    ],
    limitations: [
      "Assumes a modern ERP; NetSuite integration is the most developed",
      "Built for the close, not for tax or audit fieldwork",
      "Drafted entries still require review and approval",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "mindbridge",
    name: "MindBridge",
    url: "https://www.mindbridge.ai",
    description:
      "Scores every transaction in a ledger for risk instead of sampling, so auditors test the anomalies rather than a random selection.",
    automates: [
      "Risk scoring across 100% of transactions",
      "Anomaly detection combining statistical models and business rules",
      "Evidence-linked explanations for each flagged item",
      "Continuous monitoring between audit periods",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["business-and-financial"],
    occupationSlugs: [
      "accountants-and-auditors",
      "financial-examiners",
      "compliance-officers",
    ],
    limitations: [
      "Flags risk; it does not conclude — the auditor still forms the opinion",
      "Requires clean, complete ledger extracts to be meaningful",
      "Firm-level purchase rather than an individual subscription",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "blue-j",
    name: "Blue J",
    url: "https://www.bluej.com",
    description:
      "Answers tax questions against primary authority, Tax Notes, and IBFD, returning the sources so the answer can be defended.",
    automates: [
      "Tax research with cited primary authority",
      "Drafting memos and client-ready explanations",
      "Checking a position against current guidance",
      "Cross-border research through IBFD content",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public; 7-day free trial",
    occupationCategories: ["business-and-financial"],
    occupationSlugs: [
      "tax-examiners-and-collectors-and-revenue-agents",
      "accountants-and-auditors",
    ],
    limitations: [
      "Tax only — not general legal or accounting research",
      "Coverage strongest for US and Canadian federal tax",
      "Answers still need professional judgment applied to the facts",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "alphasense",
    name: "AlphaSense",
    url: "https://www.alpha-sense.com",
    description:
      "Search and synthesis across filings, earnings transcripts, broker research, and expert calls, with sentence-level citations back to the document.",
    automates: [
      "Cross-document research with citations to the source sentence",
      "Building comparable company sets and spotting deal risk",
      "Monitoring companies and themes for new disclosures",
      "Generating draft slides and reports from findings",
    ],
    aiNative: "ai-enhanced",
    pricingDetails: "Pricing not public",
    occupationCategories: ["business-and-financial", "sales"],
    occupationSlugs: [
      "financial-analysts",
      "market-research-analysts",
      "management-analysts",
      "personal-financial-advisors",
      "securities-commodities-and-financial-services-sales-agents",
    ],
    limitations: [
      "Expensive enough that access is usually a firm decision",
      "Premium broker research requires entitlements you may not have",
      "Synthesis is only as good as the document set it can see",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "sierra",
    name: "Sierra",
    url: "https://sierra.ai",
    description:
      "Builds customer service agents that resolve issues across chat, SMS, email, and voice, priced against outcomes rather than seats.",
    automates: [
      "Resolving common support requests end to end",
      "Handling the same conversation across voice and text channels",
      "Building agents from existing SOPs and past transcripts",
      "Flagging and improving conversations that went badly",
    ],
    aiNative: "ai-native",
    pricingDetails: "Outcome-based pricing; rates not public",
    occupationCategories: ["office-and-administrative-support"],
    occupationSlugs: ["customer-service-representatives", "information-clerks"],
    limitations: [
      "Directly substitutes for tier-1 support headcount",
      "Quality depends on documented procedures existing to train against",
      "Escalation paths to humans need deliberate design",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Education
  // -------------------------------------------------------------------------
  {
    id: "magicschool",
    name: "MagicSchool AI",
    url: "https://www.magicschool.ai",
    description:
      "A set of 80+ narrow teacher tools — rubrics, IEP drafts, report card comments — rather than a general chatbot pointed at a lesson plan.",
    automates: [
      "Lesson plan and worksheet generation from an objective",
      "Quiz and rubric creation",
      "Written feedback on student work against custom criteria",
      "IEP drafting and report card comments",
    ],
    aiNative: "ai-native",
    pricingDetails: "Free; $8.33/user/mo annual or $12.99/mo (Plus)",
    occupationCategories: ["education-training-and-library"],
    occupationSlugs: [
      "kindergarten-and-elementary-school-teachers",
      "middle-school-teachers",
      "high-school-teachers",
      "special-education-teachers",
      "career-and-technical-education-teachers",
      "preschool-teachers",
      "teacher-assistants",
      "tutors",
      "instructional-coordinators",
      "adult-literacy-and-ged-teachers",
    ],
    limitations: [
      "Generated IEP content carries legal weight and must be reviewed",
      "District data-privacy review is usually required before classroom use",
      "Output quality drops on specialized or advanced subject matter",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Media, design, and production
  // -------------------------------------------------------------------------
  {
    id: "descript",
    name: "Descript",
    url: "https://www.descript.com",
    description:
      "Edits video and audio by editing the transcript — delete a sentence in the text and it disappears from the recording.",
    automates: [
      "Transcription and text-based cutting of video and audio",
      "Removing filler words and dead air across a whole timeline",
      "Caption generation and translation",
      "Studio-grade audio cleanup on poor recordings",
    ],
    aiNative: "ai-native",
    pricingDetails: "Free; $16/mo (Hobbyist); $24/mo (Creator); $50/mo (Business)",
    occupationCategories: ["media-and-communication", "entertainment-and-sports"],
    occupationSlugs: [
      "film-and-video-editors-and-camera-operators",
      "broadcast-and-sound-engineering-technicians",
      "announcers",
      "producers-and-directors",
      "editors",
    ],
    limitations: [
      "Text-based editing fights you on frame-accurate cuts",
      "Voice cloning and AI avatars raise consent and disclosure issues",
      "Not a replacement for a full NLE on complex productions",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "runway",
    name: "Runway",
    url: "https://runway.com",
    description:
      "Generates and edits video with frontier models, used in production for previs, plates, and effects work rather than finished scenes.",
    automates: [
      "Generating video from text or reference images",
      "Rotoscoping, background removal, and inpainting",
      "4K upscaling of generated or shot footage",
      "Lip sync and voice generation for temp tracks",
    ],
    aiNative: "ai-native",
    pricingDetails: "Free; $12/mo (Standard); $28/mo (Pro); $76/mo (Max)",
    occupationCategories: ["media-and-communication", "arts-and-design", "entertainment-and-sports"],
    occupationSlugs: [
      "film-and-video-editors-and-camera-operators",
      "multimedia-artists-and-animators",
      "producers-and-directors",
      "photographers",
      "art-directors",
    ],
    limitations: [
      "Credit-metered — sustained production use gets expensive fast",
      "SAG-AFTRA and union agreements constrain synthetic performer use",
      "Output rarely holds up as a final shot without compositing work",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Construction, field service, and transport
  //
  // Almost entirely employer-deployed. These trades have very little
  // worker-facing AI: the automation lands as equipment, telematics, and
  // back-office platforms that a company buys, not something an individual
  // tradesperson subscribes to.
  // -------------------------------------------------------------------------
  {
    id: "trunk-tools",
    name: "Trunk Tools",
    url: "https://www.trunktools.com",
    description:
      "Answers questions against a jobsite's own drawings, specs, RFIs, and schedules, so field staff stop digging through document sets.",
    automates: [
      "Instant answers from project specs, drawings, and contracts",
      "Submittal review and discrepancy flagging",
      "Drawing revision comparison across bulletins",
      "Duplicate RFI detection and drafting",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["construction-and-extraction"],
    occupationSlugs: [
      "construction-and-building-inspectors",
      "construction-equipment-operators",
      "construction-laborers-and-helpers",
      "carpenters",
      "electricians",
      "plumbers-pipefitters-and-steamfitters",
      "sheet-metal-workers",
      "structural-iron-and-steel-workers",
      "drywall-and-ceiling-tile-installers-and-tapers",
      "glaziers",
      "brickmasons-blockmasons-and-stonemasons",
      "elevator-installers-and-repairers",
      "boilermakers",
    ],
    employerDeployed: true,
    limitations: [
      "Aimed at commercial GCs — little use on residential or small jobs",
      "Only as good as the document set the project actually maintains",
      "Answers about contract scope still need human confirmation",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "servicetitan",
    name: "ServiceTitan",
    url: "https://www.servicetitan.com",
    description:
      "Field service management for HVAC, plumbing, and electrical contractors, with AI answering inbound calls and surfacing job recommendations.",
    automates: [
      "AI voice agent handling inbound booking calls",
      "Dispatching and technician routing",
      "Estimate and proposal generation in the field",
      "Invoicing, payments, and service agreement renewals",
    ],
    aiNative: "ai-enhanced",
    pricingDetails: "Pricing not public",
    occupationCategories: [
      "installation-maintenance-and-repair",
      "building-and-grounds-cleaning",
    ],
    occupationSlugs: [
      "heating-air-conditioning-and-refrigeration-mechanics-and-installers",
      "general-maintenance-and-repair-workers",
      "electrical-and-electronics-installers-and-repairers",
      "pest-control-workers",
      "grounds-maintenance-workers",
    ],
    employerDeployed: true,
    limitations: [
      "Priced for established contractors, not one-truck operations",
      "AI features sit in higher Pro product tiers",
      "Technicians adopt what the employer buys — not an individual choice",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "motive",
    name: "Motive",
    url: "https://gomotive.com",
    description:
      "AI dashcams and telematics that detect unsafe driving in real time, combined with ELD compliance and fleet maintenance tracking.",
    automates: [
      "Real-time collision and unsafe-driving alerts from camera vision",
      "Automated driver coaching from detected behavior",
      "ELD hours-of-service and IFTA compliance reporting",
      "Predictive vehicle maintenance flags",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["transportation-and-material-moving"],
    occupationSlugs: [
      "heavy-and-tractor-trailer-truck-drivers",
      "delivery-truck-drivers-and-driver-sales-workers",
      "bus-drivers",
      "taxi-drivers-and-chauffeurs",
      "material-moving-machine-operators",
    ],
    employerDeployed: true,
    limitations: [
      "Driver-facing cameras are a live labor relations issue",
      "Bought by the carrier — drivers do not opt in",
      "Behavior detection produces false positives that still require review",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Engineering, design, and technical
  // -------------------------------------------------------------------------
  {
    id: "ntop",
    name: "nTop",
    url: "https://www.ntop.com",
    description:
      "Implicit-modeling design platform that evaluates dozens of geometry variants at once and applies machine learning to structural, thermal, and fluid optimization.",
    automates: [
      "Generating and comparing design variants without rebuilding CAD geometry",
      "Embedded structural, thermal, and fluid evaluation of each variant",
      "Lattice and topology optimization for weight reduction",
      "Repeatable design workflows across a team",
    ],
    aiNative: "ai-enhanced",
    pricingDetails: "Pricing not public",
    occupationCategories: ["architecture-and-engineering"],
    occupationSlugs: [
      "mechanical-engineers",
      "aerospace-engineers",
      "materials-engineers",
      "industrial-engineers",
      "biomedical-engineers",
    ],
    limitations: [
      "Implicit modeling is a different mental model than parametric CAD — real ramp-up cost",
      "Aimed at additive and high-performance parts, not routine detailing",
      "Optimized geometry still needs manufacturability review",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "cloudnc-cam-assist",
    name: "CloudNC CAM Assist",
    url: "https://cloudnc.com/cam-assist",
    description:
      "Generates machining strategies and toolpaths inside existing CAM software, which CloudNC says completes up to 80% of a CAM program in minutes.",
    automates: [
      "Toolpath and operation strategy generation for 3-axis and 3+2 axis milling",
      "Physics-based feeds and speeds calculation",
      "Machinability checks for missing stock and unsupported features",
      "Soft jaw fixture design",
      "Cycle time estimates for quoting",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public — quoted per seat by shop size",
    occupationCategories: ["production"],
    occupationSlugs: [
      "machinists-and-tool-and-die-makers",
      "metal-and-plastic-machine-workers",
    ],
    limitations: [
      "Requires a supported host CAM package (Mastercam, Fusion, NX, GibbsCAM, SolidCAM)",
      "Covers milling — not turning, EDM, or multi-axis simultaneous work",
      "Generated programs still need proving out on the machine",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "figma",
    name: "Figma",
    url: "https://www.figma.com",
    description:
      "Design tool whose AI features generate images and prototypes, rewrite copy in place, rename layers, and edit images without leaving the canvas.",
    automates: [
      "Prototype generation from a written prompt (Figma Make)",
      "Layer renaming and interaction wiring",
      "Background removal, object isolation, and image expansion",
      "Copy tone adjustment and text replacement",
    ],
    aiNative: "ai-enhanced",
    pricingDetails:
      "Full seat $16/mo (Professional), $55/mo (Organization), $90/mo (Enterprise); Dev seat $12/$25/$35; Collab seat $3/$5/$5",
    occupationCategories: ["arts-and-design"],
    occupationSlugs: [
      "graphic-designers",
      "art-directors",
      "industrial-designers",
      "multimedia-artists-and-animators",
      "set-and-exhibit-designers",
      "web-developers",
    ],
    limitations: [
      "AI credits are metered per seat and run out on heavy use",
      "The chat-based agent is still beta",
      "Generated output is a draft — brand and accessibility review still sit with the designer",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Data, sales, and sport
  // -------------------------------------------------------------------------
  {
    id: "hex",
    name: "Hex",
    url: "https://www.hex.tech",
    description:
      "Analytics notebook where agents write and revise SQL and Python against your warehouse, then publish the result as an interactive app.",
    automates: [
      "Drafting and revising notebook analysis from a plain-language ask (Notebook Agent)",
      "Conversational querying against a semantic model (Threads Agent)",
      "Semantic model construction and maintenance",
      "Publishing analyses as shareable apps without separate front-end work",
    ],
    aiNative: "ai-enhanced",
    pricingDetails:
      "Community free; Professional $36/editor/mo; Team $75/editor/mo; Enterprise custom",
    occupationCategories: ["math"],
    occupationSlugs: [
      "data-scientists",
      "operations-research-analysts",
      "mathematicians-and-statisticians",
    ],
    limitations: [
      "Agent quality depends on how well the warehouse is modeled and documented",
      "AI features are metered by monthly credit grants per seat",
      "Notebook Agent requires Professional or above — not on the free tier",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "gong",
    name: "Gong",
    url: "https://www.gong.io",
    description:
      "Records and analyzes sales calls and emails, then surfaces deal risk, competitor mentions, and coaching notes without a rep writing them up.",
    automates: [
      "Call recording, transcription, and summary",
      "CRM field updates from call and email content",
      "Deal risk and pipeline forecasting signals",
      "Coaching feedback drawn from what top reps actually say",
    ],
    aiNative: "ai-enhanced",
    pricingDetails: "Pricing not public — per-user licenses plus a platform fee",
    occupationCategories: ["sales", "management"],
    occupationSlugs: [
      "wholesale-and-manufacturing-sales-representatives",
      "advertising-sales-agents",
      "sales-engineers",
      "insurance-sales-agents",
      "sales-managers",
    ],
    limitations: [
      "Bought by the employer — call recording is not the rep's choice",
      "Two-party consent laws shape where and how it can record",
      "Priced for teams, not individual sellers",
    ],
    employerDeployed: true,
    lastVerified: "2026-07-26",
  },
  {
    id: "hudl",
    name: "Hudl",
    url: "https://www.hudl.com",
    description:
      "Automated cameras capture and upload full games, then Hudl Assist returns broken-down film and stats that a coach would otherwise tag by hand.",
    automates: [
      "Unattended game capture and livestream (Hudl Focus)",
      "Film breakdown and stat tagging (Assist)",
      "Player tracking and physical load metrics from wearables",
      "Opponent scouting reports from video and data",
    ],
    aiNative: "ai-enhanced",
    pricingDetails: "Pricing not public — quoted by level (high school, club, college, pro)",
    occupationCategories: ["entertainment-and-sports"],
    occupationSlugs: [
      "coaches-and-scouts",
      "athletes-and-sports-competitors",
      "umpires-referees-and-other-sports-officials",
    ],
    limitations: [
      "Bought at the program level, not by an individual coach",
      "Automated breakdown depth varies a lot by sport",
      "Hardware (Focus cameras, wearables) is a separate capital cost",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Veterinary, fitness, and field safety
  // -------------------------------------------------------------------------
  {
    id: "digitail",
    name: "Digitail",
    url: "https://digitail.com",
    description:
      "Veterinary practice software whose Tails AI workflows draft the medical record, intake forms, discharge notes, and invoices from the visit itself.",
    automates: [
      "Ambient scribing of the clinical record (Tails AI Scribe)",
      "Patient intake form completion",
      "Discharge note and medical record summary drafting",
      "Voice-to-invoice billing capture",
    ],
    aiNative: "ai-enhanced",
    pricingDetails: "Pricing not public — AI workflows sit in the Growth AI plan",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "veterinarians",
      "veterinary-technologists-and-technicians",
      "veterinary-assistants-and-laboratory-animal-caretakers",
    ],
    limitations: [
      "Replacing an existing practice management system is a real migration, not a plug-in",
      "AI workflows require the higher-tier plan",
      "Drafted records still need clinician sign-off",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "trainerize",
    name: "ABC Trainerize",
    url: "https://www.trainerize.com",
    description:
      "Coaching platform for trainers with an AI workout builder that programs from a client's own history, data, and stated preferences.",
    automates: [
      "Workout program generation tailored to client history",
      "Client check-ins, habit tracking, and progress logging",
      "Meal and nutrition tracking",
      "Billing and package management",
    ],
    aiNative: "ai-enhanced",
    pricingDetails:
      "Free (1 client); Grow $9/mo (2 clients, adds AI Workout Builder); Pro from $23/mo (5-200 clients); Studio Plus $248/mo (500+ clients)",
    occupationCategories: ["personal-care-and-service"],
    occupationSlugs: ["fitness-trainers-and-instructors"],
    limitations: [
      "AI Workout Builder starts on the paid Grow plan, not the free tier",
      "Nutrition, video coaching, and payments are priced add-ons",
      "Generated programming needs a trainer's judgment on injury and contraindication",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "pano-ai",
    name: "Pano AI",
    url: "https://www.pano.ai",
    description:
      "Mountaintop camera network that detects wildfire ignitions automatically and pushes confirmed incidents with visual context to responders.",
    automates: [
      "Continuous 360-degree scanning for smoke",
      "Automated ignition detection and confirmation",
      "Incident notification with location and live imagery",
      "Real-time situational picture during response",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["protective-service", "farming-fishing-and-forestry"],
    occupationSlugs: [
      "firefighters",
      "fire-inspectors-and-investigators",
      "forest-and-conservation-workers",
    ],
    employerDeployed: true,
    limitations: [
      "Bought by agencies and utilities, not by individual firefighters",
      "Only covers terrain within an installed camera network's sightlines",
      "Detections are confirmed by humans before dispatch",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "carbon-robotics",
    name: "Carbon Robotics LaserWeeder",
    url: "https://carbonrobotics.com/laserweeder",
    description:
      "Tractor-drawn implement using 42 cameras and 30 lasers to identify and kill weeds in-row, which Carbon Robotics compares to a hand crew of 75.",
    automates: [
      "Weed identification and destruction at sub-millimeter accuracy",
      "In-row weeding that would otherwise be done by hand",
      "Field-level weed pressure data capture",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public — financing offered",
    occupationCategories: ["farming-fishing-and-forestry", "management"],
    occupationSlugs: [
      "agricultural-workers",
      "farmers-ranchers-and-other-agricultural-managers",
    ],
    employerDeployed: true,
    limitations: [
      "Capital equipment bought by the operation, not the farmworker",
      "Throughput of 0.5-1.5 acres/hour suits high-value row crops, not broadacre",
      "Displaces the hand-weeding crews it is compared against",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Allied health and specialty clinical
  // -------------------------------------------------------------------------
  {
    id: "ambiki",
    name: "Ambiki",
    url: "https://www.ambiki.com",
    description:
      "EMR and therapy-materials platform built for speech, occupational, and physical therapy practices, with AI tools for documentation and session planning.",
    automates: [
      "Session note and evaluation drafting",
      "Goal bank and treatment plan assembly",
      "Scheduling and caseload management",
      "Insurance claim submission",
    ],
    aiNative: "ai-enhanced",
    pricingDetails:
      "Free first month; Professional $59/user/mo; Professional Limited $25/user/mo; add-ons: therapy tools $5/mo, teletherapy $20/mo, claims $0.25 each",
    occupationCategories: ["healthcare"],
    occupationSlugs: [
      "speech-language-pathologists",
      "occupational-therapists",
      "physical-therapists",
      "occupational-therapy-assistants-and-aides",
      "physical-therapist-assistants-and-aides",
    ],
    limitations: [
      "The Limited plan caps documentation volume",
      "Professional edition is capped at 20 licenses before custom pricing",
      "Built for outpatient private practice, not hospital rehab departments",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "eyeart",
    name: "EyeArt",
    url: "https://www.eyenuk.com/en/products/eyeart/",
    description:
      "FDA-cleared autonomous AI that grades a retinal image for diabetic retinopathy in under a minute, without a specialist reading it first.",
    automates: [
      "Autonomous detection of more-than-mild and vision-threatening diabetic retinopathy",
      "Screening report generation in under 60 seconds",
      "Referral triage during a routine exam",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: ["optometrists"],
    limitations: [
      "Scoped to diabetic retinopathy — not a general retinal screen",
      "Requires a compatible fundus camera",
      "Positive results still route to an ophthalmologist",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "limbus-ai",
    name: "Limbus Contour",
    url: "https://limbus.ai",
    description:
      "Auto-contours organs at risk and target volumes on CT, MRI, and CBCT for radiation planning, running locally on the existing clinical workstation.",
    automates: [
      "Delineation of organs at risk and clinical target volumes",
      "Treatment site detection and template selection",
      "Push of finished contours into the treatment planning system",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["healthcare"],
    occupationSlugs: ["medical-dosimetrists", "radiation-therapists"],
    limitations: [
      "Contours are a starting point — the oncologist still edits and signs off",
      "Bought by the department, not the individual therapist",
      "Accuracy varies by anatomical site and image quality",
    ],
    employerDeployed: true,
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Property, marketing, and management
  // -------------------------------------------------------------------------
  {
    id: "eliseai",
    name: "EliseAI",
    url: "https://www.eliseai.com",
    description:
      "Answers leasing and resident messages across voice, SMS, email, and chat around the clock, booking tours and routing maintenance without a person in the loop.",
    automates: [
      "Instant lead response and follow-up on rental inquiries",
      "Tour scheduling",
      "Resident question handling across channels",
      "Maintenance request intake, categorization, and routing",
      "Delinquency outreach",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["management", "sales"],
    occupationSlugs: [
      "property-real-estate-and-community-association-managers",
      "real-estate-brokers-and-sales-agents",
    ],
    limitations: [
      "Bought by the property owner or operator, not the on-site leasing agent",
      "Fair housing exposure means responses need auditing",
      "Directly substitutes for the leasing-office phone work it handles",
    ],
    employerDeployed: true,
    lastVerified: "2026-07-26",
  },
  {
    id: "jasper",
    name: "Jasper",
    url: "https://www.jasper.ai",
    description:
      "Marketing-specific generation platform that writes and images against a stored brand voice, style guide, and audience definitions rather than from a blank prompt.",
    automates: [
      "Campaign copy across email, social, ads, and web",
      "On-brand image generation and editing",
      "Repurposing one asset into channel-specific variants",
      "Brand voice and style enforcement across a team",
    ],
    aiNative: "ai-native",
    pricingDetails:
      "Pro $69/seat/mo, or $59/seat/mo billed annually (7-day free trial); Business custom, 12-month minimum",
    occupationCategories: ["management"],
    occupationSlugs: [
      "advertising-promotions-and-marketing-managers",
      "public-relations-managers",
    ],
    limitations: [
      "Pro caps brand voices, knowledge assets, and audiences",
      "Output still needs a marketer's edit before it ships",
      "Business tier requires a year commitment",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Recruiting and people operations
  // -------------------------------------------------------------------------
  {
    id: "ashby",
    name: "Ashby",
    url: "https://www.ashbyhq.com",
    description:
      "Recruiting system where AI builds candidate searches from a plain-language prompt, screens inbound applications against criteria, and takes interview notes.",
    automates: [
      "Candidate search filter construction from a written prompt",
      "Inbound application review against defined criteria",
      "Interview recording, transcription, and debrief summaries",
      "Outreach email personalization from the posting and resume",
      "Rediscovery of past applicants matching a new opening",
    ],
    aiNative: "ai-enhanced",
    pricingDetails:
      "Foundations $400/mo (up to 100 employees); Plus and Enterprise custom; 10% off annual",
    occupationCategories: ["business-and-financial", "management"],
    occupationSlugs: ["human-resources-specialists", "human-resources-managers"],
    limitations: [
      "Priced by company headcount, not by recruiter seat",
      "Automated application screening carries adverse-impact risk that needs auditing",
      "Replacing an incumbent ATS is a significant migration",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "seekout",
    name: "SeekOut",
    url: "https://www.seekout.com",
    description:
      "Sourcing platform over 1B+ candidate profiles that runs AI video screens, scores responses against your criteria, and handles high-volume inbound triage.",
    automates: [
      "Context-aware candidate search across public and ATS profiles",
      "AI video screening interviews with explainable scoring",
      "Bulk evaluation of inbound applicants",
      "Personalized outreach sequences",
      "Skills gap and labor market analysis",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["business-and-financial", "management"],
    occupationSlugs: ["human-resources-specialists", "human-resources-managers"],
    limitations: [
      "AI video screening is regulated in NYC, Illinois, and Maryland — disclosure and bias audits apply",
      "Profile coverage is much thinner outside tech and healthcare",
      "Candidate scoring needs human review before any rejection",
    ],
    lastVerified: "2026-07-26",
  },
  {
    id: "textio",
    name: "Textio",
    url: "https://textio.com",
    description:
      "Real-time writing guidance for job posts and performance feedback, flagging biased or vague language as a recruiter or manager types.",
    automates: [
      "Bias and tone flagging in job postings",
      "Guidance on specific, actionable performance feedback",
      "Interview feedback alignment with job requirements",
      "Analytics on language patterns across a hiring team",
    ],
    aiNative: "ai-enhanced",
    pricingDetails: "Pricing not public",
    occupationCategories: ["business-and-financial", "management"],
    occupationSlugs: [
      "human-resources-specialists",
      "human-resources-managers",
      "training-and-development-specialists",
      "training-and-development-managers",
    ],
    limitations: [
      "Guidance is language-level — it does not change who actually gets hired or promoted",
      "Enterprise-quoted, not available to a single recruiter",
      "Bias detection reflects its training data, not your applicant pool",
    ],
    lastVerified: "2026-07-26",
  },

  // -------------------------------------------------------------------------
  // Software agents, QA, and operations
  // -------------------------------------------------------------------------
  {
    id: "devin",
    name: "Devin",
    url: "https://devin.ai",
    description:
      "Cognition's autonomous engineering agent that picks up a ticket, works it in its own cloud environment, and returns a pull request.",
    automates: [
      "Working assigned tickets end to end from Linear or Jira",
      "Running many concurrent sessions against separate tasks",
      "Migrations and repetitive refactors across a repository",
      "Bug reproduction and fix drafting",
    ],
    aiNative: "ai-native",
    pricingDetails:
      "Pro $20/mo; Max $200/mo; Teams $80/mo base plus $40/mo per developer seat; Enterprise custom",
    occupationCategories: ["computer-and-information-technology"],
    occupationSlugs: ["software-developers", "computer-programmers"],
    limitations: [
      "Cognition acquired Windsurf — that product now sits under the same roof",
      "Usage runs on quotas that refresh daily and weekly; overages bill at API rates",
      "Autonomy is best on well-scoped, well-tested work, not ambiguous design",
    ],
    lastVerified: "2026-07-27",
  },
  {
    id: "qodo",
    name: "Qodo",
    url: "https://www.qodo.ai",
    description:
      "Reviews pull requests against your codebase and your written rules, catching regressions before a human reviewer or QA engineer sees them.",
    automates: [
      "Agentic pull request review in the PR, IDE, and CLI",
      "Enforcement of team coding standards through a rules system",
      "Codebase quality monitoring over time",
      "Cross-repository analysis (Enterprise)",
    ],
    aiNative: "ai-native",
    pricingDetails:
      "14-day free trial; Pro Team $30/mo for up to 30 users with credit packs ($0.012/credit, ~18-144 reviews); Enterprise custom above 30 users",
    occupationCategories: ["computer-and-information-technology"],
    occupationSlugs: ["software-developers", "computer-programmers", "web-developers"],
    limitations: [
      "Metered by credits — review volume, not seats, drives cost",
      "Catches code-level defects, not requirements or UX problems",
      "Still an assist to review, not a replacement for a human approver",
    ],
    lastVerified: "2026-07-27",
  },
  {
    id: "datadog-bits",
    name: "Datadog Bits AI",
    url: "https://www.datadoghq.com/product/bits-ai/",
    description:
      "Investigates alerts automatically — correlating telemetry, naming a root cause, and summarizing blast radius before an on-call engineer opens a dashboard.",
    automates: [
      "Alert investigation and telemetry correlation",
      "Root cause identification and impact summaries",
      "Natural-language querying across logs, metrics, and traces",
      "Custom incident response agents",
    ],
    aiNative: "ai-enhanced",
    pricingDetails:
      "AI features billed as AI Credits on top of platform pricing; Infrastructure Pro from $15/host/mo, APM from $31/host/mo (annual billing)",
    occupationCategories: ["computer-and-information-technology"],
    occupationSlugs: [
      "network-and-computer-systems-administrators",
      "computer-network-architects",
      "computer-support-specialists",
      "computer-and-information-systems-managers",
    ],
    employerDeployed: true,
    limitations: [
      "Bought at the org level — an individual admin does not procure it",
      "AI Credits are a separate line item from host and APM pricing",
      "Root cause suggestions still need confirmation before remediation",
    ],
    lastVerified: "2026-07-27",
  },
  {
    id: "charlotte-ai",
    name: "CrowdStrike Charlotte AI",
    url: "https://www.crowdstrike.com/en-us/platform/charlotte-ai/",
    description:
      "Triages security detections the way an experienced analyst would, filtering false positives so the queue that reaches a human is the one that matters.",
    automates: [
      "Detection triage and false-positive filtering",
      "Investigation summarization and enrichment",
      "Agentic SOAR workflows across security tools",
      "No-code custom agent building",
    ],
    aiNative: "ai-native",
    pricingDetails: "Pricing not public",
    occupationCategories: ["computer-and-information-technology"],
    occupationSlugs: ["information-security-analysts"],
    employerDeployed: true,
    limitations: [
      "Requires the CrowdStrike Falcon platform — not standalone",
      "Bought by the security org, not the individual analyst",
      "Automating triage directly targets the tier-1 analyst workload",
    ],
    lastVerified: "2026-07-27",
  },
];
