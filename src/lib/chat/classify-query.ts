/**
 * Classifies a chat query into a category, subcategory, and intent.
 * Uses keyword matching — fast, no API calls, runs on every request.
 */

export interface QueryClassification {
  category: string;
  subcategory: string | null;
  intent: "question" | "comparison" | "data-request" | "opinion" | "feature-request" | "other";
}

interface Rule {
  category: string;
  subcategory: string | null;
  patterns: RegExp[];
}

const RULES: Rule[] = [
  // Displacement
  {
    category: "displacement",
    subcategory: "overall",
    patterns: [/job\s*(loss|lost|displace|disappear|eliminat|replac)/i, /how many jobs/i, /jobs? (at risk|threatened)/i],
  },
  {
    category: "displacement",
    subcategory: "white-collar",
    patterns: [/white.?collar/i, /office\s*job/i, /knowledge\s*work/i, /professional\s*(job|role|displace)/i],
  },
  {
    category: "displacement",
    subcategory: "tech",
    patterns: [/tech\s*(sector|job|worker|industry)/i, /software\s*(engineer|develop|job)/i, /program(mer|ming)\s*(job|displace|replac)/i, /coding\s*job/i],
  },
  {
    category: "displacement",
    subcategory: "creative",
    patterns: [/creative\s*(industry|job|role|work)/i, /artist/i, /design(er)?\s*(job|role|displace|replac)/i, /writ(er|ing)\s*(job|role|displace|replac)/i],
  },
  {
    category: "displacement",
    subcategory: "education",
    patterns: [/education\s*(sector|job|role)/i, /teacher/i, /teaching/i, /professor/i],
  },
  {
    category: "displacement",
    subcategory: "healthcare",
    patterns: [/healthcare/i, /health\s*care/i, /medical\s*(admin|job|role)/i, /hospital/i, /clinical/i],
  },
  {
    category: "displacement",
    subcategory: "customer-service",
    patterns: [/customer\s*service/i, /call\s*center/i, /chatbot\s*(replac|automat)/i, /support\s*(agent|rep|role)/i],
  },

  // Wages
  {
    category: "wages",
    subcategory: "median",
    patterns: [/median\s*wage/i, /average\s*(wage|salary|pay|income)/i, /wage\s*(impact|effect|change)/i],
  },
  {
    category: "wages",
    subcategory: "entry-level",
    patterns: [/entry.?level/i, /junior\s*(role|position|salary)/i, /starting\s*salary/i, /new\s*grad/i],
  },
  {
    category: "wages",
    subcategory: "high-skill-premium",
    patterns: [/high.?skill/i, /wage\s*premium/i, /top\s*earner/i, /senior\s*(salary|wage|pay)/i, /ai\s*skill.*pay/i],
  },
  {
    category: "wages",
    subcategory: "geographic",
    patterns: [/geographic/i, /ai\s*hub/i, /silicon\s*valley/i, /location.*wage/i, /wage.*location/i, /remote.*pay/i, /city.*salary/i],
  },
  {
    category: "wages",
    subcategory: "freelancer",
    patterns: [/freelanc/i, /gig\s*(work|economy|rate)/i, /contract(or|ing)\s*(rate|pay)/i],
  },
  {
    category: "wages",
    subcategory: null,
    patterns: [/wage/i, /salary/i, /pay\s*(cut|increas|decreas)/i, /income/i, /earn(ing)?s?\b/i, /compensat/i],
  },

  // Adoption & Exposure
  {
    category: "adoption",
    subcategory: "corporate",
    patterns: [/adopt(ion|ing)?.*compan/i, /compan.*adopt/i, /firm.*using\s*ai/i, /enterprise.*ai/i, /business.*ai\s*(tool|adopt)/i],
  },
  {
    category: "adoption",
    subcategory: "generative-ai",
    patterns: [/gen(erative)?\s*ai\s*(adopt|us)/i, /chatgpt\s*(us|adopt)/i, /llm\s*(adopt|us)/i, /using\s*(chatgpt|copilot|claude)/i],
  },
  {
    category: "adoption",
    subcategory: "exposure",
    patterns: [/expos(ure|ed)/i, /at\s*risk/i, /vulnerab/i, /susceptib/i],
  },
  {
    category: "adoption",
    subcategory: "signals",
    patterns: [/earning.*call/i, /s&p\s*500/i, /mention/i, /signal/i, /leading\s*indicator/i],
  },
  {
    category: "adoption",
    subcategory: null,
    patterns: [/adopt(ion|ing|ed)?/i, /how\s*(many|much).*using\s*ai/i, /ai\s*(usage|penetrat)/i],
  },

  // Methodology & Data
  {
    category: "methodology",
    subcategory: "sources",
    patterns: [/source/i, /citation/i, /reference/i, /where.*data.*from/i, /evidence/i, /research/i, /stud(y|ies)/i, /paper/i],
  },
  {
    category: "methodology",
    subcategory: "methodology",
    patterns: [/method(ology)?/i, /how.*calculat/i, /how.*weight/i, /how.*measur/i, /confidence/i, /tier/i],
  },

  // Productivity & J-Curve
  {
    category: "productivity",
    subcategory: null,
    patterns: [/productiv/i, /j.?curve/i, /efficien/i, /output\s*per/i],
  },

  // History / Comparisons
  {
    category: "history",
    subcategory: null,
    patterns: [/histor(y|ical)/i, /past\s*technolog/i, /industrial\s*revolution/i, /previous.*automat/i, /compar.*past/i],
  },

  // Site / Feature requests
  {
    category: "site-feedback",
    subcategory: null,
    patterns: [/feature\s*request/i, /can\s*you\s*add/i, /would\s*be\s*(nice|great|helpful)\s*(if|to)/i, /suggest(ion)?.*site/i, /bug\s*(report|found)/i, /broken/i, /not\s*working/i, /improve/i],
  },
];

function classifyIntent(query: string): QueryClassification["intent"] {
  const q = query.toLowerCase();
  if (/can you add|feature|suggest|improve|would be (nice|great|helpful)/i.test(q)) return "feature-request";
  if (/compar|vs\.?|versus|differ|better|worse/i.test(q)) return "comparison";
  if (/show me|give me|what('s| is| are) the (data|number|stat|figure|percent)/i.test(q)) return "data-request";
  if (/do you think|opinion|should|will|predict(?!ion)/i.test(q)) return "opinion";
  if (/\?/.test(q) || /^(what|how|why|when|where|who|which|is|are|does|do|can|will)\b/i.test(q)) return "question";
  return "other";
}

export function classifyQuery(query: string): QueryClassification {
  const intent = classifyIntent(query);

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(query)) {
        return { category: rule.category, subcategory: rule.subcategory, intent };
      }
    }
  }

  return { category: "general", subcategory: null, intent };
}
