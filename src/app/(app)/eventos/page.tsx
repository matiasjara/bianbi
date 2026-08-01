import { AdminEventCalendar } from "@/components/demand/AdminEventCalendar";
import { SectionTitle } from "@/components/ui";
import { signalsToAdminCalendarEvents } from "@/lib/demand/admin-calendar";
import { loadAllSignals } from "@/lib/demand/load-signals";
import { loadSignalAdminState } from "@/lib/demand/signal-admin";

export const metadata = { title: "Eventos" };
export const dynamic = "force-dynamic";

export default async function EventosPage() {
  const [{ signals, ingestedAt }, admin] = await Promise.all([
    loadAllSignals(),
    loadSignalAdminState(),
  ]);

  const overriddenIds = Object.keys(admin.overrides);
  const events = signalsToAdminCalendarEvents(
    signals,
    new Set(overriddenIds),
  );

  return (
    <div>
      <SectionTitle
        title="Eventos"
        subtitle="Calendario de señales ingestadas. Revisa la fuente, corrige datos erróneos o elimina eventos problemáticos."
      />
      <AdminEventCalendar
        events={events}
        overriddenIds={overriddenIds}
        ingestedAt={ingestedAt}
      />
    </div>
  );
}
