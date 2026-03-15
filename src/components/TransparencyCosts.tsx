import costsData from "@/data/hosting-costs.json";

interface HostingService {
  name: string;
  monthlyCost: number;
  oneTimeCost: number;
  costType: "recurring" | "one-time" | "cumulative";
  startDate: string;
  endDate: string | null;
  status: "active" | "inactive";
  notes: string;
}

interface HostingCategory {
  name: string;
  services: HostingService[];
}

interface HostingCostsData {
  projectStartDate: string;
  lastUpdated: string;
  currency: string;
  categories: HostingCategory[];
}

function computeServiceCost(service: HostingService): number {
  if (service.costType === "one-time" || service.costType === "cumulative") {
    return service.oneTimeCost;
  }
  // recurring
  const start = new Date(service.startDate);
  const end = service.endDate ? new Date(service.endDate) : new Date();
  const msPerMonth = 30.44 * 24 * 60 * 60 * 1000;
  const months = Math.ceil((end.getTime() - start.getTime()) / msPerMonth);
  return service.monthlyCost * Math.max(months, 0);
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function TransparencyCosts() {
  const data = costsData as HostingCostsData;

  const allServices = data.categories.flatMap((c) => c.services);
  const totalCost = allServices.reduce(
    (sum, s) => sum + computeServiceCost(s),
    0
  );
  const paidServices = allServices.filter(
    (s) => s.monthlyCost > 0 || s.oneTimeCost > 0
  );
  const freeServices = allServices.filter(
    (s) => s.monthlyCost === 0 && s.oneTimeCost === 0
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold tracking-tight text-[var(--foreground)]">
          What This Costs
        </h2>
        <p className="text-[15px] text-[var(--muted)] mt-2 max-w-3xl">
          Full transparency on what it costs to build and run this site.
          Updated periodically as services change.
        </p>
      </div>

      <div className="space-y-8">
        {/* Total callout */}
        <div className="border border-black/[0.06] rounded-lg px-5 py-5 bg-white max-w-3xl">
          <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--accent)] mb-1">
            Total Cost to Date
          </p>
          <p className="text-[36px] sm:text-[44px] font-extrabold tracking-tight text-[var(--foreground)] leading-none">
            {formatCurrency(totalCost)}
          </p>
          <p className="text-[13px] text-[var(--muted)] mt-2">
            Since {formatDate(data.projectStartDate)} &middot; Last updated{" "}
            {formatDate(data.lastUpdated)}
          </p>
        </div>

        {/* Paid services breakdown */}
        <div className="max-w-3xl">
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-3">
            Paid Services
          </h3>
          <div className="border border-black/[0.06] rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/[0.06] bg-black/[0.02]">
                  <th className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-2.5">
                    Service
                  </th>
                  <th className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-2.5 text-right">
                    Monthly
                  </th>
                  <th className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-2.5 text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {paidServices.map((service, i) => {
                  const cumulative = computeServiceCost(service);
                  return (
                    <tr
                      key={service.name}
                      className={
                        i < paidServices.length - 1
                          ? "border-b border-black/[0.04]"
                          : ""
                      }
                    >
                      <td className="px-4 py-3">
                        <p className="text-[14px] font-medium text-[var(--foreground)]">
                          {service.name}
                        </p>
                        <p className="text-[12px] text-[var(--muted)] mt-0.5">
                          {service.notes}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {service.costType === "recurring" ? (
                          <span className="text-[14px] text-[var(--foreground)]">
                            {formatCurrency(service.monthlyCost)}
                          </span>
                        ) : (
                          <span className="text-[12px] text-[var(--muted)]">
                            {service.costType === "one-time"
                              ? "One-time"
                              : "Usage-based"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="text-[14px] font-semibold text-[var(--foreground)]">
                          {formatCurrency(cumulative)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Free services */}
        <div className="max-w-3xl">
          <h3 className="text-[18px] font-bold text-[var(--foreground)] mb-3">
            Free Services ({freeServices.length})
          </h3>
          <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-3">
            These APIs and tools are used at no cost via free tiers or open
            access.
          </p>
          <div className="flex flex-wrap gap-2">
            {freeServices.map((service) => (
              <span
                key={service.name}
                className="text-[12px] bg-black/[0.04] px-2.5 py-1.5 rounded text-[var(--foreground)] font-medium"
              >
                {service.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
