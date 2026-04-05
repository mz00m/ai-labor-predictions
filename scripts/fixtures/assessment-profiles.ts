// Test fixture profiles for assessment pipeline testing
// Each profile represents a realistic organization at a different industry/size/maturity

import type { AssessmentIntake } from "../../src/lib/assessment/types";

export interface TestProfile {
  name: string;
  description: string;
  intake: AssessmentIntake;
  // Optional fake uploaded docs to test file-aware analysis
  fileContents?: { name: string; category: string; text: string }[];
  websiteContent?: string;
}

/** Default test profile — Matt's actual role at GitLab Foundation */
export const MATT_PROFILE: TestProfile = {
  name: "matt-gitlab-foundation",
  description: "Matt Zieger — Chief Program & Partnerships Officer, GitLab Foundation",
  intake: {
    organizationName: "GitLab Foundation",
    industry: "nonprofit",
    industryDetail:
      "Private foundation focused on economic opportunity, workforce development, and AI policy. Manages $50M+ grantmaking portfolio including the AI for Economic Opportunity Fund ($30M+ collaborative with OpenAI and Ballmer Group).",
    companySize: "11-50",
    annualRevenue: "25m-100m",
    assessmentScope: "department",
    departmentName: "Programs & Partnerships",
    primaryFunctions: [
      "Grantmaking strategy and portfolio management",
      "Partnership development with funders and tech companies",
      "Research synthesis and policy communications",
      "Data analysis and labor market monitoring",
      "Network facilitation (Opportunity AI — 165+ philanthropy leaders)",
      "Executive communications and stakeholder reporting",
    ],
    keyRoles: [
      "Chief Program & Partnerships Officer",
      "Program Officers",
      "Research Analysts",
      "Grants Managers",
      "Communications Lead",
      "Partnership Coordinators",
    ],
    currentTools: [
      "Google Workspace",
      "Slack",
      "Notion",
      "Salesforce",
      "Claude",
      "Vercel",
      "GitHub",
      "Figma",
    ],
    currentAiUsage: "widespread",
    biggestChallenges: [
      "Synthesizing 300+ research sources into actionable funder briefings",
      "Grant proposal review and due diligence across 50+ active grants",
      "Coordinating across 165+ network members with varied AI literacy",
      "Keeping jobsdata.ai predictions current with fast-moving research",
      "Context-switching across grantmaking, data viz, writing, and partnership strategy",
    ],
    goals: [
      "Automate research monitoring and source scoring for jobsdata.ai",
      "Streamline grant review with AI-assisted due diligence",
      "Scale network communications without adding headcount",
      "Produce higher-quality policy memos and funder reports faster",
      "Free up time from operational work for strategic relationship-building",
    ],
    websiteUrl: "https://about.gitlab.com/company/gitlab-foundation/",
    uploadedFiles: [],
    additionalContext:
      "I co-founded the AI for Economic Opportunity Fund and lead Opportunity AI, a network of 165+ philanthropy leaders focused on AI and workforce. I also personally build and maintain jobsdata.ai — a labor market signals dashboard. I'm a senior non-engineer who codes, with strong design sensibilities (Stripe/Tufte aesthetic). My work spans executive communications for major funders, quantitative data analysis, and hands-on web development.",
  },
};

export const TEST_PROFILES: TestProfile[] = [
  MATT_PROFILE,
  {
    name: "community-foundation",
    description: "Mid-size nonprofit, exploring AI, full org assessment",
    intake: {
      organizationName: "Heartland Community Foundation",
      industry: "nonprofit",
      industryDetail: "Community foundation with grantmaking and donor services",
      companySize: "51-200",
      annualRevenue: "25m-100m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "Grantmaking and program evaluation",
        "Donor relations and fundraising",
        "Financial management and compliance",
        "Communications and community engagement",
      ],
      keyRoles: [
        "Program Officers",
        "Development Director",
        "Grant Writers",
        "Finance Manager",
        "Communications Coordinator",
        "Executive Director",
      ],
      currentTools: ["Salesforce NPSP", "QuickBooks", "Mailchimp", "Google Workspace"],
      currentAiUsage: "exploring",
      biggestChallenges: [
        "Grant application review takes 3+ weeks per cycle",
        "Donor reporting is manual and time-consuming",
        "Measuring community impact is inconsistent",
        "Staff stretched thin across too many programs",
      ],
      goals: [
        "Reduce grant review cycle time by 50%",
        "Automate donor impact reports",
        "Improve program evaluation with better data",
        "Free up staff time for relationship-building",
      ],
      uploadedFiles: [],
      additionalContext:
        "We manage 200+ donor-advised funds and make $15M in annual grants across education, health, and economic development.",
    },
  },

  {
    name: "family-restaurant-group",
    description: "Small restaurant group, no AI usage, department-level assessment",
    intake: {
      organizationName: "Rosario's Restaurant Group",
      industry: "restaurant-hospitality",
      industryDetail: "Three full-service Italian restaurants in metro area",
      companySize: "51-200",
      annualRevenue: "5m-25m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "Kitchen operations and menu development",
        "Front of house service",
        "Purchasing and inventory management",
        "Marketing and social media",
        "HR and staff scheduling",
      ],
      keyRoles: [
        "General Managers",
        "Head Chefs",
        "Sous Chefs",
        "Front of House Managers",
        "Bookkeeper",
        "Marketing Coordinator",
      ],
      currentTools: ["Toast POS", "7shifts", "Sysco ordering platform", "Instagram"],
      currentAiUsage: "none",
      biggestChallenges: [
        "Food cost management across three locations",
        "Staff turnover averaging 80% annually",
        "Inconsistent customer experience between locations",
        "Owner spends 20+ hours/week on scheduling and admin",
      ],
      goals: [
        "Reduce food waste by 15%",
        "Streamline scheduling and reduce overtime costs",
        "Build consistent brand presence on social media",
        "Free up owners from day-to-day admin tasks",
      ],
      uploadedFiles: [],
    },
  },

  {
    name: "regional-manufacturer",
    description: "Mid-size manufacturer, piloting AI, team-level assessment",
    intake: {
      organizationName: "Precision Components Inc.",
      industry: "manufacturing",
      industryDetail: "CNC machining and precision metal fabrication for aerospace",
      companySize: "201-500",
      annualRevenue: "25m-100m",
      assessmentScope: "department",
      departmentName: "Quality Assurance and Engineering",
      primaryFunctions: [
        "Quality inspection and testing",
        "Process engineering and optimization",
        "Compliance documentation (AS9100)",
        "Customer specs review and quoting",
      ],
      keyRoles: [
        "QA Manager",
        "Quality Inspectors",
        "Process Engineers",
        "CNC Programmers",
        "Estimators",
      ],
      currentTools: [
        "Mastercam",
        "CMM inspection software",
        "ERP (Epicor)",
        "AutoCAD",
        "Microsoft Office",
      ],
      currentAiUsage: "piloting",
      biggestChallenges: [
        "First-article inspection reports take 4-6 hours each",
        "Quoting accuracy varies by estimator — 15% error rate",
        "AS9100 documentation updates lag behind process changes",
        "Experienced inspectors retiring with no knowledge transfer plan",
      ],
      goals: [
        "Automate inspection report generation from CMM data",
        "Improve quoting accuracy and speed",
        "Keep compliance docs in sync with actual processes",
        "Capture tribal knowledge from senior staff",
      ],
      uploadedFiles: [],
      additionalContext:
        "We're an AS9100-certified shop. Our biggest customer is a Tier 1 aerospace supplier. Compliance documentation is critical.",
    },
    fileContents: [
      {
        name: "QA-Process-Manual-Excerpt.pdf",
        category: "process-document",
        text: `Quality Assurance Process Manual — Excerpt
Section 4: First Article Inspection
4.1 All new parts require FAI per AS9102 Rev C.
4.2 Inspector records all dimensions from CMM output into the FAI report template.
4.3 Out-of-tolerance conditions require NCR initiation within 24 hours.
4.4 Customer approval required before production run begins.
Section 5: In-Process Inspection
5.1 Statistical process control charts maintained for all critical dimensions.
5.2 Random sampling at 10% rate for production runs over 100 pieces.
5.3 Tool wear compensation documented in CNC program change log.`,
      },
    ],
  },

  {
    name: "dental-practice",
    description: "Small healthcare practice, exploring AI",
    intake: {
      organizationName: "Lakewood Family Dentistry",
      industry: "healthcare",
      industryDetail: "Multi-provider general and cosmetic dentistry practice",
      companySize: "11-50",
      annualRevenue: "1m-5m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "Patient scheduling and front desk operations",
        "Clinical treatment and patient care",
        "Insurance billing and claims processing",
        "Patient communications and follow-up",
        "Office management and HR",
      ],
      keyRoles: [
        "Dentists (3)",
        "Dental Hygienists (4)",
        "Front Desk Coordinators (2)",
        "Office Manager",
        "Billing Specialist",
        "Dental Assistants (5)",
      ],
      currentTools: [
        "Dentrix (practice management)",
        "Dexis (imaging)",
        "Weave (patient communication)",
        "QuickBooks",
      ],
      currentAiUsage: "exploring",
      biggestChallenges: [
        "No-show rate of 12% costs $8K/month in lost revenue",
        "Insurance claim denials take weeks to resolve",
        "Treatment plan acceptance rate only 45%",
        "Front desk overwhelmed with phone calls — 30% go to voicemail",
      ],
      goals: [
        "Reduce no-show rate below 5%",
        "Automate insurance verification and pre-authorization",
        "Improve treatment plan presentation and acceptance",
        "Handle more patient inquiries without adding staff",
      ],
      uploadedFiles: [],
    },
  },

  {
    name: "ecommerce-retailer",
    description: "Growing DTC brand, some AI adoption",
    intake: {
      organizationName: "Evergreen Outdoor Co.",
      industry: "retail",
      industryDetail: "Direct-to-consumer sustainable outdoor apparel and gear",
      companySize: "11-50",
      annualRevenue: "5m-25m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "E-commerce operations and fulfillment",
        "Product development and sourcing",
        "Digital marketing and social media",
        "Customer service",
        "Brand and content creation",
      ],
      keyRoles: [
        "Founder/CEO",
        "Head of Marketing",
        "E-commerce Manager",
        "Customer Service Lead",
        "Product Designer",
        "Content Creator",
        "Warehouse Manager",
      ],
      currentTools: [
        "Shopify Plus",
        "Klaviyo",
        "Gorgias",
        "Canva",
        "Google Analytics",
        "ShipStation",
      ],
      currentAiUsage: "some-adoption",
      biggestChallenges: [
        "Product photography costs $500-800 per SKU",
        "Customer service tickets up 40% YoY with only 2 agents",
        "Email marketing takes 15+ hours/week for one person",
        "Returns rate of 18% — sizing is the top reason",
      ],
      goals: [
        "Scale content production without proportional cost increase",
        "Handle 2x customer volume with current team",
        "Reduce returns through better product information",
        "Personalize marketing at scale",
      ],
      uploadedFiles: [],
      additionalContext:
        "We already use ChatGPT for draft product descriptions and Canva's AI features for social content. Looking to go deeper.",
    },
  },

  {
    name: "accounting-firm",
    description: "Traditional accounting firm, piloting AI",
    intake: {
      organizationName: "Morrison & Associates CPAs",
      industry: "accounting-finance",
      industryDetail: "Full-service CPA firm serving small businesses and high-net-worth individuals",
      companySize: "11-50",
      annualRevenue: "1m-5m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "Tax preparation and planning",
        "Bookkeeping and accounting services",
        "Audit and assurance",
        "Payroll processing",
        "Business advisory services",
      ],
      keyRoles: [
        "Managing Partner",
        "Senior CPAs (3)",
        "Staff Accountants (4)",
        "Bookkeepers (3)",
        "Administrative Assistant",
        "Tax Season Contractors (6-8)",
      ],
      currentTools: [
        "Thomson Reuters UltraTax",
        "QuickBooks Online (client work)",
        "CCH Axcess",
        "Bill.com",
        "Microsoft Excel",
      ],
      currentAiUsage: "piloting",
      biggestChallenges: [
        "Tax season crunch — staff work 70+ hour weeks for 3 months",
        "Client document collection takes 5+ follow-ups per engagement",
        "Junior staff spend 60% of time on data entry vs. learning advisory skills",
        "Difficulty retaining staff who leave for industry positions",
      ],
      goals: [
        "Reduce tax prep time per return by 30%",
        "Automate client document collection and follow-up",
        "Shift staff time from data entry to advisory work",
        "Add business advisory as a revenue stream",
      ],
      uploadedFiles: [],
    },
    fileContents: [
      {
        name: "tax-prep-workflow.docx",
        category: "process-document",
        text: `Tax Preparation Workflow — Current State
Step 1: Client sends documents via portal or email (avg 3 uploads, 2 follow-ups needed)
Step 2: Staff accountant organizes documents, enters data into UltraTax (2-4 hours per return)
Step 3: Senior CPA reviews return, makes adjustments (1-2 hours)
Step 4: Managing partner final review for complex returns (30 min - 1 hour)
Step 5: Client review meeting (30 min)
Step 6: E-file and deliver copies

Average time per individual return: 6-8 hours
Average time per business return: 12-20 hours
We prepare approximately 800 individual and 200 business returns per season.`,
      },
    ],
  },

  {
    name: "boutique-law-firm",
    description: "Small law firm, no AI, exploring options",
    intake: {
      organizationName: "Chen & Whitfield LLP",
      industry: "legal",
      industryDetail: "Boutique employment law firm — plaintiff and defense side",
      companySize: "11-50",
      annualRevenue: "5m-25m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "Case research and legal analysis",
        "Document review and discovery",
        "Client intake and case management",
        "Brief writing and court filings",
        "Billing and practice management",
      ],
      keyRoles: [
        "Partners (4)",
        "Associates (6)",
        "Paralegals (3)",
        "Legal Secretary",
        "Office Administrator",
        "IT Consultant (part-time)",
      ],
      currentTools: [
        "Clio (practice management)",
        "Westlaw",
        "NetDocuments",
        "Microsoft Office",
        "DocuSign",
      ],
      currentAiUsage: "none",
      biggestChallenges: [
        "Document review on large cases costs $50K+ in associate time",
        "Associates spend 40% of billable hours on routine research",
        "Client intake process loses 20% of qualified leads",
        "Partners concerned about AI and ethics/privilege issues",
      ],
      goals: [
        "Reduce document review time by 60%",
        "Accelerate legal research for routine matters",
        "Improve client intake conversion rate",
        "Maintain strict ethical compliance with any AI adoption",
      ],
      uploadedFiles: [],
      additionalContext:
        "We handle employment discrimination, wrongful termination, and wage/hour cases. Confidentiality and privilege are paramount — we need AI solutions that keep data secure.",
    },
  },

  {
    name: "charter-school-network",
    description: "Education org, exploring AI across admin and instruction",
    intake: {
      organizationName: "Horizon Charter Schools",
      industry: "education",
      industryDetail: "K-8 charter school network with 4 campuses",
      companySize: "201-500",
      annualRevenue: "25m-100m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "Classroom instruction and curriculum development",
        "Student assessment and progress tracking",
        "Family engagement and communications",
        "Administrative operations and compliance",
        "Staff professional development",
      ],
      keyRoles: [
        "Principals (4)",
        "Teachers (120+)",
        "Instructional Coaches (8)",
        "Operations Manager",
        "Data Analyst",
        "Family Liaisons (4)",
        "Special Education Coordinator",
      ],
      currentTools: [
        "PowerSchool (SIS)",
        "Google Workspace for Education",
        "Illuminate (assessment)",
        "ParentSquare",
        "Schoology (LMS)",
      ],
      currentAiUsage: "exploring",
      biggestChallenges: [
        "Teachers spend 10+ hours/week on lesson planning and grading",
        "Inconsistent instructional quality across campuses",
        "IEP compliance documentation is overwhelming SpEd staff",
        "Family communication in 4 languages with limited translation capacity",
      ],
      goals: [
        "Give teachers back 5+ hours/week for instruction and relationships",
        "Improve assessment data analysis for personalized learning",
        "Streamline IEP documentation while maintaining compliance",
        "Scale multilingual family communications",
      ],
      uploadedFiles: [],
      additionalContext:
        "Our student population is 70% free/reduced lunch eligible, 45% English learners. We serve predominantly Latino and Black communities. Equity in AI adoption is critical — we won't deploy tools that widen achievement gaps.",
    },
  },

  {
    name: "logistics-company",
    description: "Mid-size logistics firm, some AI adoption",
    intake: {
      organizationName: "Pacific Route Logistics",
      industry: "logistics-transportation",
      industryDetail: "Regional freight brokerage and last-mile delivery",
      companySize: "51-200",
      annualRevenue: "25m-100m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "Freight brokerage and carrier management",
        "Route optimization and dispatch",
        "Customer service and shipment tracking",
        "Billing and accounts receivable",
        "Driver recruitment and retention",
      ],
      keyRoles: [
        "Freight Brokers (12)",
        "Dispatchers (8)",
        "Customer Service Reps (6)",
        "Billing Clerks (3)",
        "Operations Manager",
        "Fleet Manager",
        "HR Coordinator",
      ],
      currentTools: [
        "McLeod TMS",
        "DAT load boards",
        "Samsara (fleet tracking)",
        "Salesforce",
        "QuickBooks Enterprise",
      ],
      currentAiUsage: "some-adoption",
      biggestChallenges: [
        "Brokers spend 3 hours/day on repetitive rate negotiations",
        "Customer 'where's my shipment?' calls are 50% of CS volume",
        "Invoice disputes average $45K/month in delayed payments",
        "Driver turnover at 65% — recruiting costs $8K per driver",
      ],
      goals: [
        "Automate rate quoting for standard lanes",
        "Reduce inbound CS calls by 40% through self-service tracking",
        "Cut invoice dispute resolution time from 2 weeks to 2 days",
        "Use predictive analytics for capacity planning",
      ],
      uploadedFiles: [],
    },
  },

  {
    name: "tech-startup",
    description: "Small tech company, widespread AI adoption, looking for next level",
    intake: {
      organizationName: "Meridian AI Labs",
      industry: "technology",
      industryDetail: "B2B SaaS — AI-powered document processing for legal teams",
      companySize: "11-50",
      annualRevenue: "1m-5m",
      assessmentScope: "full-organization",
      primaryFunctions: [
        "Product development and engineering",
        "Sales and business development",
        "Customer success and onboarding",
        "Marketing and content",
        "Operations and finance",
      ],
      keyRoles: [
        "CEO/Co-founder",
        "CTO/Co-founder",
        "Engineers (8)",
        "Head of Sales",
        "SDRs (3)",
        "Customer Success Manager",
        "Marketing Lead",
        "Head of Finance (part-time)",
      ],
      currentTools: [
        "GitHub",
        "Linear",
        "Slack",
        "Notion",
        "HubSpot",
        "Stripe",
        "Cursor",
        "Claude",
        "Vercel",
      ],
      currentAiUsage: "widespread",
      biggestChallenges: [
        "Engineers context-switch between 3-4 projects — velocity down 30%",
        "Sales demos are customized per prospect — prep takes 2 hours each",
        "Customer onboarding takes 3 weeks — competitors do it in 1",
        "Founder bottleneck on strategic decisions, product direction, and hiring",
      ],
      goals: [
        "Improve engineering velocity by reducing toil and context-switching",
        "Scale sales without proportional headcount",
        "Cut onboarding time to 1 week",
        "Build internal knowledge systems so founders aren't single points of failure",
      ],
      uploadedFiles: [],
      additionalContext:
        "We're a Series A startup ($5M raised). Our product already uses AI heavily. This assessment is about using AI to improve our internal operations, not our product.",
    },
  },
];
