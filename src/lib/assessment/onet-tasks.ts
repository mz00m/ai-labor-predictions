// Curated O*NET task mapping for AI opportunity assessment
// Based on O*NET task categories mapped to AI automation/augmentation potential
// Source: O*NET OnLine (onetonline.org) — U.S. Department of Labor

export interface OnetTaskMapping {
  id: string; // O*NET-style task ID
  category: string; // Broad work activity category
  task: string; // Specific task description
  aiPotential: "high" | "medium" | "low";
  aiApproach: string; // How AI can help
  humanEssential: string; // Why humans are still needed
  industries: string[]; // Which industries this is common in
  timeEstimate: string; // Typical time savings
}

// Generalized Work Activities mapped to AI potential
// These cover the most common tasks across small businesses and individual roles
export const ONET_TASK_MAPPINGS: OnetTaskMapping[] = [
  // === INFORMATION & DATA TASKS (Generally HIGH AI potential) ===
  {
    id: "4.A.2.a.1",
    category: "Information Input",
    task: "Getting information from emails, documents, and online sources",
    aiPotential: "high",
    aiApproach: "AI summarization and extraction tools can scan, sort, and surface the key information from large volumes of email and documents",
    humanEssential: "Deciding what information matters and how to act on it",
    industries: ["professional-services", "legal", "accounting-finance", "nonprofit", "education", "government"],
    timeEstimate: "3-5 hours/week saved",
  },
  {
    id: "4.A.2.a.2",
    category: "Information Input",
    task: "Monitoring processes, materials, or surroundings",
    aiPotential: "medium",
    aiApproach: "AI dashboards and alerting tools can track metrics and flag anomalies automatically",
    humanEssential: "Interpreting alerts in context and making judgment calls about what to do",
    industries: ["manufacturing", "healthcare", "retail", "logistics-transportation", "construction"],
    timeEstimate: "1-3 hours/week saved",
  },
  {
    id: "4.A.2.a.4",
    category: "Information Input",
    task: "Identifying objects, actions, and events",
    aiPotential: "medium",
    aiApproach: "Computer vision and pattern recognition can automate classification and sorting tasks",
    humanEssential: "Handling edge cases and novel situations that don't fit patterns",
    industries: ["manufacturing", "healthcare", "retail", "logistics-transportation"],
    timeEstimate: "1-2 hours/week saved",
  },
  {
    id: "4.A.2.b.1",
    category: "Mental Processes",
    task: "Analyzing data or information to find patterns",
    aiPotential: "high",
    aiApproach: "AI analytics tools can process large datasets, find trends, and generate insights far faster than manual analysis",
    humanEssential: "Asking the right questions and deciding what the patterns mean for your business",
    industries: ["accounting-finance", "professional-services", "retail", "healthcare", "media-marketing"],
    timeEstimate: "3-8 hours/week saved",
  },
  {
    id: "4.A.2.b.2",
    category: "Mental Processes",
    task: "Making decisions and solving problems",
    aiPotential: "low",
    aiApproach: "AI can present options, model scenarios, and surface relevant information to support decisions",
    humanEssential: "Weighing trade-offs, understanding context, and taking responsibility for outcomes",
    industries: ["all"],
    timeEstimate: "Decision support, not replacement",
  },
  {
    id: "4.A.2.b.3",
    category: "Mental Processes",
    task: "Thinking creatively and developing new ideas",
    aiPotential: "medium",
    aiApproach: "AI can brainstorm options, generate variations, and help overcome creative blocks as a starting point",
    humanEssential: "Original vision, taste, judgment about what's good, and connecting ideas to human needs",
    industries: ["media-marketing", "education", "professional-services", "nonprofit"],
    timeEstimate: "Faster iteration, not fewer creative hours",
  },
  {
    id: "4.A.2.b.4",
    category: "Mental Processes",
    task: "Updating and using relevant knowledge",
    aiPotential: "high",
    aiApproach: "AI research assistants can quickly summarize new developments, regulations, and industry changes",
    humanEssential: "Applying knowledge to your specific situation and building real expertise over time",
    industries: ["legal", "healthcare", "accounting-finance", "education", "government"],
    timeEstimate: "2-4 hours/week saved",
  },

  // === COMMUNICATION TASKS (HIGH AI potential for drafting, LOW for relationship) ===
  {
    id: "4.A.4.a.1",
    category: "Communication",
    task: "Writing emails, reports, proposals, and other documents",
    aiPotential: "high",
    aiApproach: "AI writing tools can draft, edit, reformat, and proofread documents at high speed — often producing solid first drafts",
    humanEssential: "Your voice, your judgment about tone and audience, and final review for accuracy",
    industries: ["all"],
    timeEstimate: "5-10 hours/week saved",
  },
  {
    id: "4.A.4.a.2",
    category: "Communication",
    task: "Documenting and recording information",
    aiPotential: "high",
    aiApproach: "AI transcription, auto-summarization of meetings, and smart templates can handle most documentation",
    humanEssential: "Ensuring accuracy and capturing nuances that matter",
    industries: ["healthcare", "legal", "professional-services", "education", "government"],
    timeEstimate: "3-6 hours/week saved",
  },
  {
    id: "4.A.4.a.4",
    category: "Communication",
    task: "Talking with clients, customers, or the public",
    aiPotential: "medium",
    aiApproach: "AI chatbots can handle routine inquiries, schedule appointments, and provide basic information 24/7",
    humanEssential: "Complex issues, emotional situations, relationship building, and trust",
    industries: ["retail", "restaurant-hospitality", "healthcare", "professional-services", "real-estate"],
    timeEstimate: "2-4 hours/week saved on routine inquiries",
  },
  {
    id: "4.A.4.b.4",
    category: "Communication",
    task: "Establishing and maintaining relationships",
    aiPotential: "low",
    aiApproach: "AI can help with CRM management, follow-up reminders, and personalized outreach templates",
    humanEssential: "Genuine connection, empathy, trust — these are fundamentally human",
    industries: ["all"],
    timeEstimate: "Better follow-through, not fewer relationship hours",
  },
  {
    id: "4.A.4.b.5",
    category: "Communication",
    task: "Selling or influencing others",
    aiPotential: "medium",
    aiApproach: "AI can personalize pitches, analyze prospect data, generate proposals, and optimize pricing",
    humanEssential: "Reading people, building trust, handling objections, and closing",
    industries: ["retail", "real-estate", "professional-services", "media-marketing"],
    timeEstimate: "2-3 hours/week saved on prep work",
  },

  // === ADMINISTRATIVE TASKS (Generally HIGH AI potential) ===
  {
    id: "4.A.3.a.1",
    category: "Administrative",
    task: "Scheduling, calendar management, and coordination",
    aiPotential: "high",
    aiApproach: "AI scheduling tools can find optimal meeting times, manage calendars, and handle rescheduling automatically",
    humanEssential: "Priority judgment — which meetings actually matter",
    industries: ["all"],
    timeEstimate: "2-4 hours/week saved",
  },
  {
    id: "4.A.3.a.2",
    category: "Administrative",
    task: "Processing invoices, expenses, and financial records",
    aiPotential: "high",
    aiApproach: "AI bookkeeping tools can categorize transactions, match receipts, flag anomalies, and prepare reports",
    humanEssential: "Reviewing accuracy, handling exceptions, and financial judgment calls",
    industries: ["accounting-finance", "retail", "restaurant-hospitality", "construction", "professional-services"],
    timeEstimate: "4-8 hours/week saved",
  },
  {
    id: "4.A.3.a.3",
    category: "Administrative",
    task: "Filing, organizing, and managing documents",
    aiPotential: "high",
    aiApproach: "AI document management can auto-classify, tag, and organize files — and find anything instantly through search",
    humanEssential: "Deciding what's important and setting up organizational systems",
    industries: ["legal", "healthcare", "government", "education", "professional-services"],
    timeEstimate: "2-5 hours/week saved",
  },
  {
    id: "4.A.3.b.1",
    category: "Administrative",
    task: "Data entry and form filling",
    aiPotential: "high",
    aiApproach: "AI can extract data from documents, auto-fill forms, and transfer information between systems",
    humanEssential: "Spot-checking accuracy on critical data",
    industries: ["healthcare", "government", "accounting-finance", "legal", "retail"],
    timeEstimate: "3-6 hours/week saved",
  },

  // === CUSTOMER / CLIENT SERVICE (MEDIUM-HIGH potential) ===
  {
    id: "4.A.4.c.1",
    category: "Customer Service",
    task: "Responding to routine customer inquiries",
    aiPotential: "high",
    aiApproach: "AI chatbots and auto-responders can handle FAQs, order status, and basic troubleshooting around the clock",
    humanEssential: "Escalation for complex issues, emotional customers, and building loyalty",
    industries: ["retail", "restaurant-hospitality", "healthcare", "professional-services", "real-estate"],
    timeEstimate: "4-8 hours/week saved",
  },
  {
    id: "4.A.4.c.2",
    category: "Customer Service",
    task: "Onboarding new clients or customers",
    aiPotential: "medium",
    aiApproach: "AI can automate welcome sequences, collect intake information, and guide people through setup steps",
    humanEssential: "Personal welcome, understanding unique needs, and setting expectations",
    industries: ["professional-services", "healthcare", "legal", "accounting-finance", "real-estate"],
    timeEstimate: "1-3 hours/week saved",
  },

  // === CREATIVE & CONTENT TASKS (MEDIUM potential) ===
  {
    id: "4.A.5.a.1",
    category: "Creative",
    task: "Creating marketing content and social media posts",
    aiPotential: "high",
    aiApproach: "AI can generate first drafts, suggest headlines, create image variations, and repurpose content across platforms",
    humanEssential: "Brand voice, strategy, authenticity, and knowing what resonates with your specific audience",
    industries: ["media-marketing", "retail", "restaurant-hospitality", "nonprofit", "real-estate"],
    timeEstimate: "3-6 hours/week saved",
  },
  {
    id: "4.A.5.a.2",
    category: "Creative",
    task: "Designing presentations and visual materials",
    aiPotential: "medium",
    aiApproach: "AI design tools can generate layouts, suggest improvements, and create visual assets from text descriptions",
    humanEssential: "Design judgment, brand consistency, and storytelling through visuals",
    industries: ["media-marketing", "education", "professional-services", "nonprofit"],
    timeEstimate: "2-4 hours/week saved",
  },

  // === MANAGEMENT & PLANNING TASKS (LOW-MEDIUM potential) ===
  {
    id: "4.A.4.b.1",
    category: "Management",
    task: "Coordinating the work of others",
    aiPotential: "medium",
    aiApproach: "AI project management tools can track tasks, flag bottlenecks, and suggest resource allocation",
    humanEssential: "Motivating people, resolving conflicts, and making trade-off decisions",
    industries: ["all"],
    timeEstimate: "1-2 hours/week saved on tracking",
  },
  {
    id: "4.A.4.b.2",
    category: "Management",
    task: "Training and teaching others",
    aiPotential: "medium",
    aiApproach: "AI can create training materials, quizzes, and personalized learning paths. It can answer common questions.",
    humanEssential: "Mentorship, coaching through difficult situations, and modeling good practices",
    industries: ["education", "healthcare", "retail", "restaurant-hospitality", "manufacturing"],
    timeEstimate: "2-3 hours/week saved on material creation",
  },
  {
    id: "4.A.2.b.6",
    category: "Planning",
    task: "Developing plans, budgets, and strategies",
    aiPotential: "medium",
    aiApproach: "AI can model scenarios, generate forecasts, draft budget templates, and analyze historical data for planning",
    humanEssential: "Strategic vision, understanding your market, and making bets about the future",
    industries: ["all"],
    timeEstimate: "2-4 hours saved per planning cycle",
  },

  // === COMPLIANCE & LEGAL TASKS (MEDIUM-HIGH potential) ===
  {
    id: "4.A.2.c.1",
    category: "Compliance",
    task: "Reviewing contracts, policies, and legal documents",
    aiPotential: "high",
    aiApproach: "AI can summarize long documents, flag key terms, compare versions, and identify missing clauses",
    humanEssential: "Legal judgment, understanding implications, and responsibility for decisions",
    industries: ["legal", "healthcare", "government", "real-estate", "construction"],
    timeEstimate: "3-6 hours/week saved",
  },
  {
    id: "4.A.2.c.2",
    category: "Compliance",
    task: "Tracking regulatory requirements and deadlines",
    aiPotential: "high",
    aiApproach: "AI compliance tools can monitor regulation changes, track deadlines, and auto-generate required filings",
    humanEssential: "Interpreting how regulations apply to your specific situation",
    industries: ["healthcare", "accounting-finance", "legal", "government", "manufacturing"],
    timeEstimate: "2-4 hours/week saved",
  },

  // === RESEARCH & ANALYSIS (HIGH potential) ===
  {
    id: "4.A.2.d.1",
    category: "Research",
    task: "Researching competitors, markets, or prospects",
    aiPotential: "high",
    aiApproach: "AI research tools can scan the web, compile data, summarize findings, and generate competitive analysis reports",
    humanEssential: "Knowing what questions to ask and what the findings mean for your strategy",
    industries: ["professional-services", "media-marketing", "real-estate", "retail", "nonprofit"],
    timeEstimate: "3-6 hours/week saved",
  },
  {
    id: "4.A.2.d.2",
    category: "Research",
    task: "Preparing reports and presentations from data",
    aiPotential: "high",
    aiApproach: "AI can transform raw data into formatted reports, generate charts, and create presentation-ready summaries",
    humanEssential: "Narrative framing — telling the story the data supports",
    industries: ["all"],
    timeEstimate: "3-5 hours/week saved",
  },

  // === INVENTORY & OPERATIONS (MEDIUM-HIGH potential) ===
  {
    id: "4.A.3.c.1",
    category: "Operations",
    task: "Managing inventory and supply ordering",
    aiPotential: "high",
    aiApproach: "AI forecasting can predict demand, auto-reorder supplies, and optimize stock levels to reduce waste",
    humanEssential: "Vendor relationships, quality decisions, and handling supply disruptions",
    industries: ["retail", "restaurant-hospitality", "manufacturing", "healthcare", "construction"],
    timeEstimate: "2-5 hours/week saved",
  },
  {
    id: "4.A.3.c.2",
    category: "Operations",
    task: "Scheduling staff and managing shifts",
    aiPotential: "high",
    aiApproach: "AI scheduling tools optimize coverage based on demand patterns, availability, and labor rules",
    humanEssential: "Understanding individual team members' needs and handling special situations",
    industries: ["restaurant-hospitality", "retail", "healthcare", "manufacturing", "logistics-transportation"],
    timeEstimate: "2-4 hours/week saved",
  },
];

/**
 * Find relevant O*NET task mappings for a given set of user-selected functions
 */
export function matchOnetTasks(
  selectedFunctions: string[],
  industry: string
): OnetTaskMapping[] {
  const functionText = selectedFunctions.join(" ").toLowerCase();

  return ONET_TASK_MAPPINGS.filter((mapping) => {
    // Match by industry
    const industryMatch = mapping.industries.includes("all") || mapping.industries.includes(industry);
    if (!industryMatch) return false;

    // Match by task relevance to selected functions
    const taskWords = mapping.task.toLowerCase().split(" ");
    const categoryWords = mapping.category.toLowerCase().split(" ");
    const allWords = [...taskWords, ...categoryWords];

    return allWords.some((word) => functionText.includes(word)) || true; // Include all industry-matched tasks
  }).sort((a, b) => {
    // Sort by AI potential (high first)
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.aiPotential] - order[b.aiPotential];
  });
}

/**
 * Get a summary of AI opportunity by category for use in prompts
 */
export function getOnetSummaryForPrompt(
  selectedFunctions: string[],
  industry: string
): string {
  const tasks = matchOnetTasks(selectedFunctions, industry);

  const highOpportunity = tasks.filter((t) => t.aiPotential === "high");
  const mediumOpportunity = tasks.filter((t) => t.aiPotential === "medium");

  let summary = "## O*NET Task Analysis Reference\n\n";
  summary += `Based on O*NET work activity classifications, here are the AI opportunities most relevant to this person's work:\n\n`;

  if (highOpportunity.length > 0) {
    summary += "### High AI Potential Tasks\n";
    for (const t of highOpportunity.slice(0, 8)) {
      summary += `- **${t.task}** (${t.category}): ${t.aiApproach}. Human essential: ${t.humanEssential}. Est. savings: ${t.timeEstimate}\n`;
    }
  }

  if (mediumOpportunity.length > 0) {
    summary += "\n### Medium AI Potential Tasks\n";
    for (const t of mediumOpportunity.slice(0, 6)) {
      summary += `- **${t.task}** (${t.category}): ${t.aiApproach}. Human essential: ${t.humanEssential}. Est. savings: ${t.timeEstimate}\n`;
    }
  }

  return summary;
}
