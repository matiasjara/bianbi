import { SectionTitle } from "@/components/ui";
import { CampaignMonthNav } from "@/components/campaigns/CampaignMonthNav";
import { CampaignPackCard } from "@/components/campaigns/CampaignPackCard";
import { loadApprovedCampaigns } from "@/lib/demand/approved-campaigns";
import { loadAllCampaignMetrics } from "@/lib/demand/ad-metrics-store";
import { loadAllCampaignPacks } from "@/lib/demand/load-campaign-packs";
import { loadAllSignals } from "@/lib/demand/load-signals";
import {
  MONTH_NAMES_ES,
  parseMonthParam,
} from "@/lib/demand/month-range";

export const metadata = { title: "Campañas" };
export const dynamic = "force-dynamic";

export default async function CampanasPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const { year, monthIndex } = parseMonthParam(params.year, params.month);
  const monthLabel = `${MONTH_NAMES_ES[monthIndex]} ${year}`;

  const [{ ingestedAt }, packs, approved, metrics] = await Promise.all([
    loadAllSignals(),
    loadAllCampaignPacks({ year, monthIndex, limit: 16 }),
    loadApprovedCampaigns(),
    loadAllCampaignMetrics(),
  ]);
  const approvedIds = new Set(approved.map((a) => a.campaignId));
  const metricsById = new Map(metrics.map((m) => [m.campaignId, m]));

  return (
    <div>
      <SectionTitle
        title="Campañas"
        subtitle="Preparas el pack, publicas cuando estés seguro y monitoreas con semáforo por canal (Meta / Google / mailing). La API engancha después; hoy puedes ver el flujo con demo."
      />

      <CampaignMonthNav year={year} monthIndex={monthIndex} />

      <p className="mb-6 text-sm text-[var(--muted)]">
        {packs.length} packs en {monthLabel}
        {ingestedAt
          ? ` · Señales ${new Date(ingestedAt).toLocaleString("es-CL")}`
          : " · Ejecuta npm run ingest o los robots en Fuentes"}
      </p>

      {packs.length === 0 ? (
        <div className="surface rounded-xl p-6 text-[var(--muted)]">
          No hay peaks suficientes en {monthLabel}. Prueba otro mes o revisa{" "}
          <a href="/demanda" className="text-[var(--accent-ink)] hover:underline">
            Demanda
          </a>{" "}
          / vuelve a correr la ingesta.
        </div>
      ) : (
        <div className="space-y-4">
          {packs.map((pack) => {
            const m = metricsById.get(pack.campaignId);
            return (
              <CampaignPackCard
                key={pack.campaignId}
                pack={pack}
                approved={approvedIds.has(pack.campaignId)}
                initialMetrics={m?.channels}
                initialMetricsSource={m?.source}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
