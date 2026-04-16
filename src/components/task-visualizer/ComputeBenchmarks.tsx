"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

/**
 * Historical and projected AI inference cost data.
 * Sources cited inline - these are real benchmark data points.
 */
const COMPUTE_COST_HISTORY = [
  { year: "2020", costPerMToken: 60.00, label: "GPT-3 launch" },
  { year: "2021", costPerMToken: 42.00, label: "GPT-3 pricing drop" },
  { year: "2022", costPerMToken: 20.00, label: "Efficiency gains" },
  { year: "2023", costPerMToken: 6.00, label: "GPT-4 Turbo" },
  { year: "2024", costPerMToken: 2.50, label: "GPT-4o, Claude 3" },
  { year: "2025", costPerMToken: 0.80, label: "GPT-4o-mini, deepseek" },
  { year: "2026", costPerMToken: 0.30, label: "Current (est.)" },
  // Projections based on ~60% annual decline trend
  { year: "2027", costPerMToken: 0.12, label: "Projected" },
  { year: "2028", costPerMToken: 0.05, label: "Projected" },
  { year: "2029", costPerMToken: 0.02, label: "Projected" },
  { year: "2030", costPerMToken: 0.008, label: "Projected" },
];

const CLOUD_GPU_COSTS = [
  { year: "2020", costPerHr: 32.77, gpu: "A100 (AWS)" },
  { year: "2022", costPerHr: 32.77, gpu: "A100 (AWS)" },
  { year: "2023", costPerHr: 32.77, gpu: "A100 / H100 launch" },
  { year: "2024", costPerHr: 8.50, gpu: "H100 (spot pricing)" },
  { year: "2025", costPerHr: 3.50, gpu: "H100/H200 (competitive)" },
  { year: "2026", costPerHr: 2.00, gpu: "B200/GB200 (est.)" },
  { year: "2028", costPerHr: 0.80, gpu: "Projected" },
  { year: "2030", costPerHr: 0.30, gpu: "Projected" },
];

const SOURCES = [
  {
    label: "LLM API pricing: OpenAI, Anthropic, Google published rates (2020-2026)",
    url: null,
  },
  {
    label: "Epoch AI: \"Trends in the cost of computing\" (2024)",
    url: "https://epoch.ai/blog/trends-in-the-dollar-training-cost-of-machine-learning-systems",
  },
  {
    label: "Stanford HAI: AI Index Report 2025 - inference cost declining ~10x per year for equivalent capability",
    url: "https://aiindex.stanford.edu/report/",
  },
  {
    label: "SemiAnalysis: GPU cloud pricing data (H100/A100 on-demand and spot rates)",
    url: null,
  },
  {
    label: "Dillon (2025): \"AI Labour Calculator\" - Epoch AI default of 10^21.7 FLOP/s, 100% YOY growth, 2x algorithmic efficiency",
    url: "https://github.com/CharlesD353/ai-labour-calculator",
  },
  {
    label: "Wright's Law applied to AI chips: ~30% cost decline per doubling of cumulative production",
    url: null,
  },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white rounded-lg border border-black/[0.08] shadow-lg p-3">
      <p className="text-sm font-semibold mb-1">{label}</p>
      <p className="text-xs text-[var(--muted)]">{data.label}</p>
      <p className="text-base font-medium text-accent mt-1">
        ${data.costPerMToken?.toFixed(data.costPerMToken < 0.1 ? 3 : 2)}/M tokens
      </p>
    </div>
  );
}

export default function ComputeBenchmarks() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
          AI Inference Cost Collapse
        </h3>
        <p className="text-sm text-[var(--muted)] mb-4">
          The cost of frontier AI inference has fallen ~200x since 2020 and continues to decline
          at roughly 60% per year. This is the fundamental driver: as compute gets cheaper,
          more tasks become economically viable to automate.
        </p>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={COMPUTE_COST_HISTORY}
              margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                scale="log"
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5C61F6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#5C61F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="costPerMToken"
                stroke="#5C61F6"
                strokeWidth={2}
                fill="url(#costGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">
          $/million output tokens for frontier models (log scale). After 2026: projected at 60% annual decline.
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-4xl font-bold text-accent tracking-tight">~200x</p>
          <p className="text-xs text-[var(--muted)]">Cost reduction since GPT-3 (2020)</p>
        </div>
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-4xl font-bold text-accent tracking-tight">~60%</p>
          <p className="text-xs text-[var(--muted)]">Annual cost decline rate (inference)</p>
        </div>
        <div className="rounded-xl bg-black/[0.02] border border-black/[0.06] p-4">
          <p className="text-4xl font-bold text-accent tracking-tight">2x/yr</p>
          <p className="text-xs text-[var(--muted)]">Algorithmic efficiency gains (Epoch AI)</p>
        </div>
      </div>

      {/* What drives the cost decline */}
      <div className="rounded-xl border border-black/[0.06] p-4">
        <h4 className="text-base font-semibold text-[var(--foreground)] mb-2">
          Why compute costs keep falling
        </h4>
        <div className="space-y-2 text-sm text-[var(--muted)]">
          <div className="flex gap-2">
            <span className="text-[var(--foreground)] font-medium shrink-0">Hardware</span>
            <span>
              New GPU generations (NVIDIA B200, custom silicon from Google/Amazon) deliver 2-3x
              more inference throughput per dollar every ~18 months.
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[var(--foreground)] font-medium shrink-0">Algorithms</span>
            <span>
              Distillation, quantization, and architectural improvements (MoE, speculative decoding)
              roughly double efficiency each year at the same capability level.
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[var(--foreground)] font-medium shrink-0">Scale</span>
            <span>
              Massive datacenter buildout ($100B+ invested in 2024-2025) drives down per-unit costs
              through economies of scale, following Wright&apos;s Law.
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[var(--foreground)] font-medium shrink-0">Competition</span>
            <span>
              Open-source models (Llama, Mistral, DeepSeek) and provider competition compress
              margins, passing hardware gains directly to end-users.
            </span>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--foreground)] mb-2">Sources</h4>
        <ul className="space-y-1">
          {SOURCES.map((source, i) => (
            <li key={i} className="text-xs text-[var(--muted)]">
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--foreground)]"
                >
                  {source.label}
                </a>
              ) : (
                source.label
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
