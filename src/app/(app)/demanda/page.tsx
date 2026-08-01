import { DemandCalendar } from "@/components/demand/DemandCalendar";
import { SectionTitle } from "@/components/ui";
import { loadAllSignals } from "@/lib/demand/load-signals";

export const metadata = { title: "Demanda" };
export const dynamic = "force-dynamic";

export default async function DemandaPage() {
  const { signals, ingestedAt, sourceCounts } = await loadAllSignals();

  return (
    <div>
      <SectionTitle
        title="Demanda"
        subtitle="Eventos scrapeados, feriados oficiales y estacionalidad. Elige un mes futuro y mira los peaks."
      />
      <DemandCalendar
        signals={signals}
        ingestedAt={ingestedAt}
        sourceCounts={sourceCounts}
      />
    </div>
  );
}
