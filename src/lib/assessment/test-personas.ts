import type { AssessmentIntake } from "./types";

export interface TestPersona {
  id: string;
  label: string;
  description: string;
  email: string;
  intake: AssessmentIntake;
}

const ROOFING: TestPersona = {
  id: "roofing",
  label: "Marcus Rivera — Rivera Roofing LLC",
  description: "Small business owner, 12-person residential roofing company in Phoenix metro",
  email: "test-roofing@jobsdata-test.ai",
  intake: {
    organizationName: "Rivera Roofing LLC",
    industry: "construction",
    industryDetail: "Residential and light commercial roofing",
    companySize: "11-50",
    annualRevenue: "500k-1m",
    assessmentScope: "full-organization",
    jobTitle: "Owner / General Manager",
    primaryFunctions: [
      "Estimating & bidding",
      "Project scheduling",
      "Customer communication",
      "Crew management",
      "Invoicing & collections",
      "Subcontractor coordination",
    ],
    keyRoles: [
      "Owner / GM (Marcus)",
      "Field foreman",
      "Roofing crew (8 installers)",
      "Office manager / bookkeeper",
      "Sales / estimator",
    ],
    currentTools: ["QuickBooks", "Excel", "Google Workspace", "JobNimbus (light use)"],
    currentAiUsage: "none",
    toolPreference: "find-new",
    biggestChallenges: [
      "Estimates take 2–3 hours each and we lose around 30% of bids",
      "Scheduling falls apart when weather delays stack up",
      "Collecting payment — chasing invoices takes up too much time",
      "Responding to every inquiry fast enough to win the job",
      "Tracking material costs across multiple jobs",
    ],
    goals: [
      "Cut estimate prep time in half",
      "Stop losing bids to competitors who respond faster",
      "Automate invoice follow-up so I'm not doing it manually",
      "Give my office manager a way to handle more without hiring",
      "Better job costing so I know if each project is actually profitable",
    ],
    specificProblem:
      "We do residential and light commercial roofing across the Phoenix metro — mostly insurance replacement work and some new construction. My biggest pain is estimating: it takes me or my sales guy 2–3 hours per job to measure, check material prices, write the proposal, and follow up. We're leaving money on the table because we can't turn quotes around fast enough. I also have one office manager handling everything from scheduling to QuickBooks and she's maxed out. I've heard about AI but don't know where to start or what's actually useful for a contractor.",
    uploadedFiles: [],
    websiteUrl: "https://riveararoofing.com",
    additionalContext:
      "12 total staff. About 60% of revenue is insurance claims work (hail season is huge), 40% retail/referral. We're licensed in AZ and NV. Peak season April–October. I handle sales myself most of the time. We use JobNimbus for CRM but barely scratch the surface of what it can do.",
  },
};

const HOUSING: TestPersona = {
  id: "housing",
  label: "Sarah Chen — Bridge Housing Initiative",
  description: "Executive director, 25-person affordable housing nonprofit with $2.8M budget",
  email: "test-housing@jobsdata-test.ai",
  intake: {
    organizationName: "Bridge Housing Initiative",
    industry: "nonprofit",
    industryDetail: "Affordable housing, permanent supportive housing, housing navigation",
    companySize: "11-50",
    annualRevenue: "1m-5m",
    assessmentScope: "full-organization",
    jobTitle: "Executive Director",
    primaryFunctions: [
      "Program delivery & case management",
      "Grant writing & fundraising",
      "Compliance reporting",
      "Policy advocacy",
      "Community outreach",
      "Financial management",
      "Board relations",
    ],
    keyRoles: [
      "Executive Director (Sarah)",
      "Deputy Director / COO",
      "Grants Manager (1 person managing 40+ grants)",
      "Housing Navigators (6 staff)",
      "Case Managers (8 staff)",
      "Data & Evaluation Manager",
      "Community Organizers (3 staff)",
      "Finance & Operations (2 staff)",
      "Development Associate",
      "Admin / Office Manager",
    ],
    currentTools: [
      "Salesforce NPSP",
      "Google Workspace",
      "Excel / Google Sheets",
      "Canva",
      "Zoom",
      "HMIS (implementing new system)",
      "Bill.com",
    ],
    currentAiUsage: "exploring",
    toolPreference: "find-new",
    biggestChallenges: [
      "Reporting burden — about 30% of staff time goes to documentation and compliance",
      "Grants manager is one person handling 40+ active grants with different funder requirements",
      "Housing navigators spend 2–3 hours per client on intake documentation",
      "Data storytelling — we have lots of data but struggle to turn it into compelling funder reports",
      "Staff capacity — can't hire fast enough to meet demand, need to do more with 25 people",
      "Board reporting takes our ED and COO a full week each quarter",
    ],
    goals: [
      "Free up 20–30% of case manager time from documentation so they can serve more clients",
      "Improve grant application quality and reduce writing time",
      "Automate routine compliance reporting",
      "Build better dashboards for funder and board reporting",
      "Create consistent documentation templates across all housing programs",
      "Help staff use data to make real-time decisions on client needs",
    ],
    specificProblem:
      "We serve 400+ households annually through permanent supportive housing, rapid rehousing, and prevention programs. Our housing navigators each manage 50–60 active cases and spend an enormous amount of time on paperwork — HMIS data entry, funder intake forms, progress notes, lease-up documentation. Our grants manager is maxed out writing and reporting on 40+ active grants from city, county, state, and federal sources, each with different formats and timelines. We're implementing a new HMIS system this year and want to build in AI-assisted workflows from the start. Budget: $2.8M with about $700K in unrestricted reserves.",
    uploadedFiles: [],
    websiteUrl: "https://bridgehousing.org",
    additionalContext:
      "Fiscal year July–June. About 65% government contracts, 25% foundation grants, 10% individual donors. Staff are mostly MSW/BSW trained case managers and navigators — tech-curious but not tech-native. We have a strong data culture but lack the capacity to act on it. We're in the process of hiring a part-time data analyst. Our board includes two tech executives who are very supportive of AI adoption. We operate in one metro area (Seattle) with satellite offices in two suburbs.",
  },
};

export const TEST_PERSONAS: TestPersona[] = [ROOFING, HOUSING];

export function getPersona(id: string): TestPersona | undefined {
  return TEST_PERSONAS.find((p) => p.id === id);
}
