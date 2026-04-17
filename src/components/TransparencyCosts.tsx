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
        <h2 className="text-4xl sm:text-title-sm font-extrabold tracking-tight text-[var(--foreground)]">
          What This Costs
        </h2>
        <p className="text-lg text-[var(--muted)] mt-2 max-w-3xl">
          Full transparency on what it costs to build and run this site.
          Updated periodically as services change.
        </p>
      </div>

      <div className="space-y-8">
        {/* Total callout */}
        <div className="border border-card rounded-lg px-5 py-5 bg-white max-w-3xl">
          <p className="text-base font-bold uppercase tracking-widest text-[var(--accent)] mb-1">
            Total Cost to Date
          </p>
          <p className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-none">
            {formatCurrency(totalCost)}
          </p>
          <p className="text-base text-[var(--muted)] mt-2">
            Since {formatDate(data.projectStartDate)} &middot; Last updated{" "}
            {formatDate(data.lastUpdated)}
          </p>
        </div>

        {/* Paid services breakdown */}
        <div className="max-w-3xl">
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
            Paid Services
          </h3>
          <div className="border border-card rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-card bg-black/[0.02]">
                  <th className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-2.5">
                    Service
                  </th>
                  <th className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-2.5 text-right">
                    Monthly
                  </th>
                  <th className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider px-4 py-2.5 text-right">
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
                          ? "border-b border-divider"
                          : ""
                      }
                    >
                      <td className="px-4 py-3">
                        <p className="text-md font-medium text-[var(--foreground)]">
                          {service.name}
                        </p>
                        <p className="text-sm text-[var(--muted)] mt-0.5">
                          {service.notes}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {service.costType === "recurring" ? (
                          <span className="text-md text-[var(--foreground)]">
                            {formatCurrency(service.monthlyCost)}
                          </span>
                        ) : (
                          <span className="text-sm text-[var(--muted)]">
                            {service.costType === "one-time"
                              ? "One-time"
                              : "Usage-based"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="text-md font-semibold text-[var(--foreground)]">
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
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3">
            Free Services ({freeServices.length})
          </h3>
          <p className="text-md text-[var(--muted)] leading-relaxed mb-3">
            These APIs and tools are used at no cost via free tiers or open
            access.
          </p>
          <div className="flex flex-wrap gap-2">
            {freeServices.map((service) => (
              <span
                key={service.name}
                className="text-sm bg-black/[0.04] px-2.5 py-1.5 rounded text-[var(--foreground)] font-medium"
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
