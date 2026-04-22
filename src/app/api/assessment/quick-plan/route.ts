import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { CLAUDE_HAIKU } from "@/lib/claude-models";

export const maxDuration = 300;

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

const QuickPlanInput = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  score: z.number().int().min(1).max(10),
  band: z.string(),
  bandLabel: z.string(),
  taskBreakdown: z.object({
    aiCanDoNow: z.number(),
    aiCanAssist: z.number(),
    humanDomain: z.number(),
  }),
  teamSize: z.string().min(1),
  industry: z.string().min(1),
  goal: z.string().min(1).max(500),
});

// ---------------------------------------------------------------------------
// Output schema (what we expect from Haiku)
// ---------------------------------------------------------------------------

const ActionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  timeline: z.string(),
  toolName: z.string().optional(),
  toolUrl: z.string().optional(),
});

const QuickPlanOutput = z.object({
  summary: z.string(),
  actions: z.array(ActionItemSchema).min(3).max(5),
  weeklyTimeSaved: z.string(),
  firstWeekFocus: z.string(),
});

type QuickPlanResult = z.infer<typeof QuickPlanOutput>;

// ---------------------------------------------------------------------------
// Fallback template (if Haiku fails or times out)
// ---------------------------------------------------------------------------

function getFallbackPlan(
  input: z.infer<typeof QuickPlanInput>
): QuickPlanResult {
  const isHighExposure = input.score >= 7;
  const isMidExposure = input.score >= 4;

  return {
    summary: `As a ${input.title} with an AI score of ${input.score}/10, you have ${
      isHighExposure
        ? "significant opportunity to integrate AI into your daily workflow"
        : isMidExposure
        ? "growing opportunities to use AI tools for specific tasks"
        : "early-stage opportunities to explore AI tools"
    }. Based on your goal and ${input.industry} context, here are targeted actions.`,
    actions: [
      {
        title: isHighExposure
          ? "Set up an AI-assisted workflow for your top recurring task"
          : "Try an AI tool on one specific task this week",
        description: isHighExposure
          ? `Identify the task you spend the most time on each week. Use Claude or ChatGPT to handle the first draft, data analysis, or research phase. Review and refine the output rather than starting from scratch.`
          : `Pick one repetitive task you do regularly. Use a free AI tool (ChatGPT, Claude, or Gemini) to help with it. The goal is to learn what AI can and can't do well for your specific work.`,
        timeline: "This week",
        toolName: "Claude",
        toolUrl: "https://claude.ai",
      },
      {
        title: `Automate a ${input.industry} reporting or data task`,
        description: `Look for tasks where you're manually gathering, formatting, or summarizing information. AI can handle the assembly while you focus on the analysis and decisions that matter.`,
        timeline: "Week 2",
      },
      {
        title: "Build a team playbook for AI-assisted work",
        description: `Document your best AI prompts and workflows. Share them with your team of ${input.teamSize}. The compounding effect of team-wide adoption is 3-5x individual use.`,
        timeline: "Week 3-4",
      },
      {
        title: "Measure and iterate",
        description: `Track time saved for 2 weeks. Real numbers build the case for expanding AI use. Share results with your team to identify the next high-impact workflow to automate.`,
        timeline: "Week 4-5",
      },
    ],
    weeklyTimeSaved: `${Math.round(40 * (input.score / 10) * 0.3)} hours/week potential`,
    firstWeekFocus: isHighExposure
      ? "Start with your highest-volume task and redesign it with AI in the loop."
      : "Pick one low-stakes task and experiment with AI assistance.",
  };
}

// ---------------------------------------------------------------------------
// Build the prompt
// ---------------------------------------------------------------------------

function buildPrompt(input: z.infer<typeof QuickPlanInput>): string {
  return `You are a practical AI adoption advisor. Generate a personalized action plan.

CONTEXT:
- Occupation: ${input.title}
- AI Opportunity Score: ${input.score}/10 (${input.bandLabel})
- Task breakdown: ${Math.round(input.taskBreakdown.aiCanDoNow * 100)}% AI can do now, ${Math.round(input.taskBreakdown.aiCanAssist * 100)}% AI can assist, ${Math.round(input.taskBreakdown.humanDomain * 100)}% human domain
- Team size: ${input.teamSize}
- Industry: ${input.industry}
- Their goal: "${input.goal}"

OUTPUT JSON (no markdown, no code fences):
{
  "summary": "2-3 sentence personalized summary connecting their score, role, and goal",
  "actions": [
    {
      "title": "short action title",
      "description": "2-3 sentence specific description. Reference their industry and role. Be concrete about WHAT to do, not vague.",
      "timeline": "This week / Week 2 / Week 3-4 / Month 2",
      "toolName": "specific tool name if relevant (optional)",
      "toolUrl": "tool URL if relevant (optional)"
    }
  ],
  "weeklyTimeSaved": "estimated hours/week with brief explanation",
  "firstWeekFocus": "one sentence: the single most impactful thing to do first"
}

RULES:
- Generate exactly 5 action items
- Actions must be specific to their occupation and industry, not generic
- Timeline should be progressive (first action this week, last action in 1-2 months)
- Reference real AI tools where relevant (Claude, ChatGPT, Copilot, Gemini, etc.)
- Match their stated goal in the action emphasis
- Be direct and practical, not aspirational
- Output ONLY valid JSON, nothing else`;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = QuickPlanInput.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn("ANTHROPIC_API_KEY not set, using fallback plan");
      return NextResponse.json({ plan: getFallbackPlan(input), source: "fallback" });
    }

    const client = new Anthropic();

    try {
      const message = await client.messages.create({
        model: CLAUDE_HAIKU,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: buildPrompt(input),
          },
        ],
        system:
          "You are a practical AI adoption advisor. Output only valid JSON. No markdown, no code fences, no explanation.",
      });

      // Extract text from response
      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        console.warn("No text block in Haiku response, using fallback");
        return NextResponse.json({ plan: getFallbackPlan(input), source: "fallback" });
      }

      // Parse and validate Haiku's JSON output
      let rawJson: unknown;
      try {
        rawJson = JSON.parse(textBlock.text);
      } catch {
        console.warn("Haiku returned invalid JSON, using fallback");
        return NextResponse.json({ plan: getFallbackPlan(input), source: "fallback" });
      }

      const planParsed = QuickPlanOutput.safeParse(rawJson);
      if (!planParsed.success) {
        console.warn("Haiku response failed schema validation, using fallback:", planParsed.error.flatten());
        return NextResponse.json({ plan: getFallbackPlan(input), source: "fallback" });
      }

      return NextResponse.json({ plan: planParsed.data, source: "haiku" });
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        console.warn("Haiku rate limited, using fallback");
        return NextResponse.json({ plan: getFallbackPlan(input), source: "fallback" }, { status: 429 });
      }

      console.error("Haiku API error:", err);
      return NextResponse.json({ plan: getFallbackPlan(input), source: "fallback" });
    }
  } catch (err) {
    console.error("Quick plan route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
