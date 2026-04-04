// Industry-specific task taxonomy for AI opportunity assessment
// Mapped to common O*NET task categories for small/mid-size businesses

import { IndustryCategory } from "./types";

export interface IndustryTaskTemplate {
  industry: IndustryCategory;
  departments: DepartmentTemplate[];
  commonChallenges: string[];
  suggestedUploads: string[];
}

export interface DepartmentTemplate {
  name: string;
  keyFunctions: string[];
  typicalRoles: string[];
  aiOpportunityAreas: string[];
}

export const INDUSTRY_TEMPLATES: Record<string, IndustryTaskTemplate> = {
  nonprofit: {
    industry: "nonprofit",
    departments: [
      {
        name: "Development / Fundraising",
        keyFunctions: ["Grant writing", "Donor management", "Event planning", "Prospect research", "Impact reporting"],
        typicalRoles: ["Development Director", "Grant Writer", "Donor Relations Manager", "Events Coordinator"],
        aiOpportunityAreas: ["Grant proposal drafting", "Donor communication personalization", "Prospect research automation", "Impact report generation"],
      },
      {
        name: "Programs",
        keyFunctions: ["Program delivery", "Outcome tracking", "Volunteer coordination", "Community outreach"],
        typicalRoles: ["Program Manager", "Case Manager", "Volunteer Coordinator", "Outreach Specialist"],
        aiOpportunityAreas: ["Outcome data analysis", "Volunteer matching", "Program documentation", "Reporting automation"],
      },
      {
        name: "Operations / Admin",
        keyFunctions: ["Financial management", "HR / compliance", "Board reporting", "Communications"],
        typicalRoles: ["Executive Director", "Operations Manager", "Bookkeeper", "Communications Manager"],
        aiOpportunityAreas: ["Board report drafting", "Policy documentation", "Financial reconciliation", "Social media content"],
      },
    ],
    commonChallenges: ["Limited budget for new tools", "Staff wearing multiple hats", "Reporting burden to funders", "Donor engagement at scale"],
    suggestedUploads: ["Grant templates", "Annual report", "Program descriptions", "Staff role descriptions", "Board presentation decks"],
  },

  "restaurant-hospitality": {
    industry: "restaurant-hospitality",
    departments: [
      {
        name: "Front of House",
        keyFunctions: ["Reservations", "Customer service", "Order management", "Marketing / social media"],
        typicalRoles: ["General Manager", "Host/Hostess", "Server", "Bartender"],
        aiOpportunityAreas: ["Reservation optimization", "Review response automation", "Menu engineering insights", "Social media content"],
      },
      {
        name: "Back of House",
        keyFunctions: ["Inventory management", "Menu planning", "Food prep scheduling", "Supplier management"],
        typicalRoles: ["Head Chef", "Kitchen Manager", "Prep Cook", "Purchasing Manager"],
        aiOpportunityAreas: ["Inventory forecasting", "Menu cost analysis", "Supplier comparison", "Waste reduction analytics"],
      },
      {
        name: "Business Operations",
        keyFunctions: ["Scheduling", "Payroll", "Marketing", "Financial reporting", "Compliance"],
        typicalRoles: ["Owner/Operator", "Business Manager", "Bookkeeper", "Marketing Coordinator"],
        aiOpportunityAreas: ["Staff scheduling optimization", "Financial forecasting", "Marketing campaign creation", "Compliance tracking"],
      },
    ],
    commonChallenges: ["Thin margins", "High staff turnover", "Inconsistent demand", "Managing multiple locations"],
    suggestedUploads: ["Menu / pricing sheets", "Employee handbook", "Training manuals", "Scheduling procedures", "Vendor contracts"],
  },

  manufacturing: {
    industry: "manufacturing",
    departments: [
      {
        name: "Production",
        keyFunctions: ["Production scheduling", "Quality control", "Equipment maintenance", "Safety compliance"],
        typicalRoles: ["Plant Manager", "Production Supervisor", "Quality Inspector", "Maintenance Technician"],
        aiOpportunityAreas: ["Predictive maintenance", "Quality defect detection", "Production scheduling optimization", "Safety incident analysis"],
      },
      {
        name: "Supply Chain",
        keyFunctions: ["Procurement", "Inventory management", "Logistics", "Supplier management"],
        typicalRoles: ["Supply Chain Manager", "Buyer", "Warehouse Manager", "Logistics Coordinator"],
        aiOpportunityAreas: ["Demand forecasting", "Supplier risk assessment", "Inventory optimization", "Route optimization"],
      },
      {
        name: "Administration",
        keyFunctions: ["Order processing", "Customer service", "Quoting / estimating", "Compliance / documentation"],
        typicalRoles: ["Office Manager", "Estimator", "Customer Service Rep", "Compliance Officer"],
        aiOpportunityAreas: ["Automated quoting", "Order processing automation", "Document generation", "Regulatory compliance tracking"],
      },
    ],
    commonChallenges: ["Skilled labor shortage", "Supply chain disruptions", "Quality consistency", "Regulatory compliance burden"],
    suggestedUploads: ["Process flowcharts", "Quality manuals", "Job descriptions", "Safety procedures", "Equipment maintenance logs"],
  },

  healthcare: {
    industry: "healthcare",
    departments: [
      {
        name: "Clinical Operations",
        keyFunctions: ["Patient scheduling", "Clinical documentation", "Referral management", "Patient communication"],
        typicalRoles: ["Practice Manager", "Medical Assistant", "Front Desk Coordinator", "Nurse"],
        aiOpportunityAreas: ["Scheduling optimization", "Clinical note drafting", "Patient communication automation", "Referral tracking"],
      },
      {
        name: "Billing / Revenue Cycle",
        keyFunctions: ["Coding", "Claims processing", "Denial management", "Patient billing"],
        typicalRoles: ["Billing Manager", "Medical Coder", "Claims Specialist", "Collections Rep"],
        aiOpportunityAreas: ["Coding assistance", "Denial pattern analysis", "Prior authorization automation", "Patient payment plans"],
      },
      {
        name: "Administration",
        keyFunctions: ["Compliance", "Credentialing", "HR / staffing", "Financial reporting"],
        typicalRoles: ["Administrator", "Compliance Officer", "HR Manager", "Financial Controller"],
        aiOpportunityAreas: ["Compliance monitoring", "Credentialing tracking", "Staff scheduling", "Financial analysis"],
      },
    ],
    commonChallenges: ["Regulatory complexity (HIPAA)", "Staff burnout", "Prior authorization burden", "Documentation overhead"],
    suggestedUploads: ["Job descriptions", "Process workflows", "Patient communication templates", "Compliance policies", "Organizational chart"],
  },

  retail: {
    industry: "retail",
    departments: [
      {
        name: "Store Operations",
        keyFunctions: ["Customer service", "Inventory management", "Visual merchandising", "Loss prevention"],
        typicalRoles: ["Store Manager", "Assistant Manager", "Sales Associate", "Inventory Specialist"],
        aiOpportunityAreas: ["Inventory forecasting", "Customer service chatbots", "Merchandising optimization", "Demand prediction"],
      },
      {
        name: "Marketing / E-commerce",
        keyFunctions: ["Digital marketing", "Social media", "Product photography", "Email campaigns"],
        typicalRoles: ["Marketing Manager", "Social Media Coordinator", "E-commerce Manager", "Content Creator"],
        aiOpportunityAreas: ["Product description generation", "Ad copy creation", "Email personalization", "Customer segmentation"],
      },
      {
        name: "Back Office",
        keyFunctions: ["Purchasing", "Accounting", "HR / scheduling", "Vendor management"],
        typicalRoles: ["Owner/Operator", "Bookkeeper", "HR Coordinator", "Buyer"],
        aiOpportunityAreas: ["Purchase order automation", "Financial reporting", "Schedule optimization", "Vendor comparison"],
      },
    ],
    commonChallenges: ["Competition from e-commerce", "Seasonal demand swings", "Staff retention", "Omnichannel expectations"],
    suggestedUploads: ["Employee handbook", "Training materials", "Product catalog", "Marketing plans", "Store procedures"],
  },

  "professional-services": {
    industry: "professional-services",
    departments: [
      {
        name: "Client Services / Delivery",
        keyFunctions: ["Client communication", "Project management", "Research / analysis", "Deliverable creation"],
        typicalRoles: ["Partner / Principal", "Senior Consultant", "Analyst", "Project Manager"],
        aiOpportunityAreas: ["Research synthesis", "Report drafting", "Proposal generation", "Client communication templates"],
      },
      {
        name: "Business Development",
        keyFunctions: ["Proposal writing", "Client prospecting", "RFP responses", "Market research"],
        typicalRoles: ["BD Director", "Proposal Manager", "Marketing Coordinator", "Research Analyst"],
        aiOpportunityAreas: ["RFP response automation", "Prospect research", "Pitch deck creation", "Market analysis"],
      },
      {
        name: "Operations",
        keyFunctions: ["Billing / invoicing", "Time tracking", "Knowledge management", "Compliance"],
        typicalRoles: ["Operations Manager", "Office Manager", "Billing Coordinator", "IT Manager"],
        aiOpportunityAreas: ["Invoice processing", "Knowledge base creation", "Process documentation", "Compliance monitoring"],
      },
    ],
    commonChallenges: ["Utilization pressure", "Knowledge loss from turnover", "Proposal time sink", "Scaling without headcount"],
    suggestedUploads: ["Service descriptions", "Proposal templates", "Process documentation", "Client communication templates", "Org chart"],
  },

  "accounting-finance": {
    industry: "accounting-finance",
    departments: [
      {
        name: "Client Services",
        keyFunctions: ["Tax preparation", "Bookkeeping", "Audit / assurance", "Advisory services"],
        typicalRoles: ["CPA / Partner", "Senior Accountant", "Staff Accountant", "Bookkeeper"],
        aiOpportunityAreas: ["Tax research assistance", "Transaction categorization", "Workpaper preparation", "Client communication drafting"],
      },
      {
        name: "Operations",
        keyFunctions: ["Engagement management", "Billing", "Client onboarding", "Document management"],
        typicalRoles: ["Office Manager", "Engagement Manager", "Admin Assistant", "IT Coordinator"],
        aiOpportunityAreas: ["Client onboarding automation", "Document extraction", "Billing optimization", "Deadline tracking"],
      },
    ],
    commonChallenges: ["Seasonal crunch (tax season)", "Staffing pipeline", "Regulatory changes", "Client document collection"],
    suggestedUploads: ["Service catalog", "Engagement letter templates", "Process workflows", "Staff role descriptions", "Client onboarding checklist"],
  },

  legal: {
    industry: "legal",
    departments: [
      {
        name: "Legal Practice",
        keyFunctions: ["Legal research", "Document drafting", "Case management", "Client communication"],
        typicalRoles: ["Attorney / Partner", "Associate", "Paralegal", "Legal Assistant"],
        aiOpportunityAreas: ["Legal research acceleration", "Document review", "Contract analysis", "Brief drafting assistance"],
      },
      {
        name: "Administration",
        keyFunctions: ["Billing / time entry", "Client intake", "Calendar management", "Filing / records"],
        typicalRoles: ["Office Manager", "Billing Coordinator", "Receptionist", "Records Clerk"],
        aiOpportunityAreas: ["Time entry automation", "Client intake processing", "Calendar optimization", "Document filing"],
      },
    ],
    commonChallenges: ["Billable hour pressure", "Document volume", "Client expectations on speed", "Knowledge management"],
    suggestedUploads: ["Practice area descriptions", "Client intake forms", "Process documentation", "Role descriptions", "Technology inventory"],
  },

  education: {
    industry: "education",
    departments: [
      {
        name: "Instruction / Academic",
        keyFunctions: ["Curriculum development", "Lesson planning", "Assessment / grading", "Student communication"],
        typicalRoles: ["Teacher / Instructor", "Department Head", "Curriculum Coordinator", "Academic Advisor"],
        aiOpportunityAreas: ["Lesson plan generation", "Assessment creation", "Feedback drafting", "Differentiated instruction support"],
      },
      {
        name: "Administration",
        keyFunctions: ["Enrollment", "Reporting", "Compliance", "Parent communication", "Scheduling"],
        typicalRoles: ["Principal / Director", "Registrar", "Office Manager", "Compliance Officer"],
        aiOpportunityAreas: ["Report generation", "Parent communication templates", "Enrollment processing", "Compliance documentation"],
      },
    ],
    commonChallenges: ["Limited budgets", "Diverse student needs", "Reporting requirements", "Staff professional development"],
    suggestedUploads: ["Curriculum guides", "Staff handbook", "Role descriptions", "Assessment templates", "Annual reports"],
  },

  construction: {
    industry: "construction",
    departments: [
      {
        name: "Project Management",
        keyFunctions: ["Estimating", "Scheduling", "Project documentation", "Client communication"],
        typicalRoles: ["Project Manager", "Estimator", "Superintendent", "Project Engineer"],
        aiOpportunityAreas: ["Cost estimating assistance", "Schedule optimization", "RFI drafting", "Progress reporting"],
      },
      {
        name: "Office / Admin",
        keyFunctions: ["Accounting", "Payroll", "Safety documentation", "Bidding / proposals"],
        typicalRoles: ["Office Manager", "Bookkeeper", "Safety Officer", "HR Coordinator"],
        aiOpportunityAreas: ["Invoice processing", "Safety documentation", "Bid preparation", "Subcontractor management"],
      },
    ],
    commonChallenges: ["Skilled labor shortage", "Project delays / overruns", "Safety compliance", "Cash flow management"],
    suggestedUploads: ["Project templates", "Safety manuals", "Estimating sheets", "Employee handbook", "Bid templates"],
  },

  "real-estate": {
    industry: "real-estate",
    departments: [
      {
        name: "Sales / Brokerage",
        keyFunctions: ["Listings management", "Client prospecting", "Market analysis", "Transaction coordination"],
        typicalRoles: ["Broker", "Agent", "Transaction Coordinator", "Marketing Specialist"],
        aiOpportunityAreas: ["Listing description generation", "Market analysis reports", "Client follow-up automation", "Comparative market analysis"],
      },
      {
        name: "Property Management",
        keyFunctions: ["Tenant communication", "Maintenance coordination", "Lease management", "Financial reporting"],
        typicalRoles: ["Property Manager", "Leasing Agent", "Maintenance Coordinator", "Accountant"],
        aiOpportunityAreas: ["Tenant communication automation", "Maintenance request triage", "Lease abstraction", "Financial reporting"],
      },
    ],
    commonChallenges: ["Market volatility", "Client communication volume", "Transaction complexity", "Lead management"],
    suggestedUploads: ["Listing templates", "Process workflows", "Client communication templates", "Training materials", "Marketing plans"],
  },

  technology: {
    industry: "technology",
    departments: [
      {
        name: "Engineering",
        keyFunctions: ["Software development", "Code review", "Testing", "Documentation"],
        typicalRoles: ["Engineer", "Tech Lead", "QA Engineer", "DevOps Engineer"],
        aiOpportunityAreas: ["Code generation / completion", "Code review automation", "Test generation", "Documentation writing"],
      },
      {
        name: "Product / Design",
        keyFunctions: ["Product management", "UX research", "Design", "Analytics"],
        typicalRoles: ["Product Manager", "UX Designer", "Data Analyst", "UX Researcher"],
        aiOpportunityAreas: ["User research synthesis", "Design iteration", "A/B test analysis", "Feature spec drafting"],
      },
      {
        name: "Go-to-Market",
        keyFunctions: ["Sales", "Marketing", "Customer success", "Support"],
        typicalRoles: ["Sales Rep", "Marketing Manager", "CSM", "Support Engineer"],
        aiOpportunityAreas: ["Sales email personalization", "Content creation", "Customer health scoring", "Support ticket triage"],
      },
      {
        name: "People / HR",
        keyFunctions: ["Recruiting", "Onboarding", "Performance management", "Employee engagement", "Compensation planning", "People analytics", "Policy development", "L&D / training"],
        typicalRoles: ["Head of People", "HR Manager", "Recruiter", "People Operations Manager", "L&D Manager", "HRBP"],
        aiOpportunityAreas: ["Job description drafting", "Resume screening", "Onboarding content generation", "Employee survey analysis", "Policy documentation", "Training material creation"],
      },
      {
        name: "Finance / Operations",
        keyFunctions: ["Financial planning", "Budgeting", "Vendor management", "Procurement", "Legal / compliance", "Office management"],
        typicalRoles: ["CFO", "Finance Manager", "Controller", "Office Manager", "Legal Counsel"],
        aiOpportunityAreas: ["Financial reporting automation", "Contract review", "Expense categorization", "Vendor comparison", "Compliance monitoring"],
      },
    ],
    commonChallenges: ["Talent competition", "Technical debt", "Scaling support", "Documentation lag"],
    suggestedUploads: ["Engineering wiki / docs", "Product specs", "Role descriptions", "Onboarding guides", "Process documentation"],
  },

  "media-marketing": {
    industry: "media-marketing",
    departments: [
      {
        name: "Creative / Content",
        keyFunctions: ["Content creation", "Copywriting", "Design", "Video production"],
        typicalRoles: ["Creative Director", "Copywriter", "Designer", "Video Editor"],
        aiOpportunityAreas: ["First-draft content generation", "Copy variation testing", "Image generation / editing", "Video transcription"],
      },
      {
        name: "Strategy / Analytics",
        keyFunctions: ["Campaign strategy", "Analytics / reporting", "SEO / SEM", "Client management"],
        typicalRoles: ["Account Director", "Strategist", "Analytics Manager", "SEO Specialist"],
        aiOpportunityAreas: ["Campaign performance analysis", "SEO content optimization", "Audience insights", "Reporting automation"],
      },
    ],
    commonChallenges: ["Content volume demands", "Proving ROI", "Client retention", "Keeping up with platform changes"],
    suggestedUploads: ["Service catalog", "Workflow documentation", "Client onboarding process", "Content templates", "Role descriptions"],
  },

  "logistics-transportation": {
    industry: "logistics-transportation",
    departments: [
      {
        name: "Operations",
        keyFunctions: ["Route planning", "Dispatch", "Warehouse operations", "Fleet management"],
        typicalRoles: ["Operations Manager", "Dispatcher", "Warehouse Supervisor", "Fleet Manager"],
        aiOpportunityAreas: ["Route optimization", "Demand forecasting", "Warehouse layout optimization", "Maintenance prediction"],
      },
      {
        name: "Administration",
        keyFunctions: ["Billing / invoicing", "Customer service", "Compliance", "HR / driver management"],
        typicalRoles: ["Office Manager", "Billing Clerk", "CSR", "HR Coordinator"],
        aiOpportunityAreas: ["Invoice automation", "Customer inquiry handling", "Compliance documentation", "Driver scheduling"],
      },
    ],
    commonChallenges: ["Driver shortage", "Fuel costs", "Regulatory compliance", "Customer visibility demands"],
    suggestedUploads: ["Operations manuals", "Safety procedures", "Driver handbook", "Route documentation", "Compliance checklists"],
  },

  agriculture: {
    industry: "agriculture",
    departments: [
      {
        name: "Farm Operations",
        keyFunctions: ["Crop / livestock planning", "Equipment management", "Supply purchasing", "Compliance / reporting"],
        typicalRoles: ["Farm Manager", "Operations Lead", "Equipment Manager", "Agronomist"],
        aiOpportunityAreas: ["Yield prediction", "Equipment maintenance scheduling", "Supply cost optimization", "Weather-based planning"],
      },
      {
        name: "Business / Administration",
        keyFunctions: ["Financial management", "Marketing / sales", "Regulatory compliance", "Employee management"],
        typicalRoles: ["Owner/Operator", "Bookkeeper", "Sales Manager", "HR Coordinator"],
        aiOpportunityAreas: ["Financial forecasting", "Market price analysis", "Compliance documentation", "Workforce scheduling"],
      },
    ],
    commonChallenges: ["Weather uncertainty", "Labor availability", "Commodity price volatility", "Regulatory complexity"],
    suggestedUploads: ["Farm business plan", "Operations procedures", "Employee handbook", "Compliance records", "Marketing materials"],
  },

  government: {
    industry: "government",
    departments: [
      {
        name: "Public Services",
        keyFunctions: ["Citizen services", "Case management", "Permitting", "Public communication"],
        typicalRoles: ["Department Director", "Case Worker", "Permit Coordinator", "Public Information Officer"],
        aiOpportunityAreas: ["Citizen inquiry handling", "Case documentation", "Permit processing", "Public notice drafting"],
      },
      {
        name: "Administration",
        keyFunctions: ["Budget management", "HR / civil service", "Procurement", "Records management"],
        typicalRoles: ["City/County Manager", "Finance Director", "HR Director", "Procurement Officer"],
        aiOpportunityAreas: ["Budget analysis", "Job posting creation", "RFP drafting", "Records classification"],
      },
    ],
    commonChallenges: ["Budget constraints", "Aging technology", "Public transparency requirements", "Talent retention"],
    suggestedUploads: ["Organizational chart", "Department descriptions", "Process documentation", "Job classifications", "Strategic plan"],
  },

  other: {
    industry: "other",
    departments: [
      {
        name: "General Operations",
        keyFunctions: ["Customer / client service", "Product or service delivery", "Marketing", "Administration"],
        typicalRoles: ["Owner / Manager", "Team Lead", "Specialist", "Administrator"],
        aiOpportunityAreas: ["Communication automation", "Document creation", "Data analysis", "Process optimization"],
      },
    ],
    commonChallenges: ["Resource constraints", "Scaling operations", "Keeping up with technology", "Process documentation"],
    suggestedUploads: ["Organizational chart", "Employee handbook", "Process documentation", "Job descriptions", "Marketing materials"],
  },
};

// Helper to get industry template with fallback
export function getIndustryTemplate(industry: IndustryCategory): IndustryTaskTemplate {
  return INDUSTRY_TEMPLATES[industry] || INDUSTRY_TEMPLATES["other"];
}

// Get all department names for an industry
export function getIndustryDepartments(industry: IndustryCategory): string[] {
  const template = getIndustryTemplate(industry);
  return template.departments.map((d) => d.name);
}

// Get suggested uploads for an industry
export function getSuggestedUploads(industry: IndustryCategory): string[] {
  const template = getIndustryTemplate(industry);
  return template.suggestedUploads;
}
