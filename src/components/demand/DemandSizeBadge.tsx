import {
  dimensionLabel,
  formatAttendanceRange,
  formatPeople,
} from "@/lib/demand/attendance";
import { StatusPill } from "@/components/ui";

type Dimension = "mega" | "grande" | "media" | "chica";

function toneFor(dim: Dimension): "accent" | "good" | "warn" | "neutral" {
  if (dim === "mega") return "accent";
  if (dim === "grande") return "good";
  if (dim === "media") return "warn";
  return "neutral";
}

/** Badge compacto de dimensión + gente estimada. */
export function DemandSizeBadge({
  dimension,
  attendees,
  overnight,
}: {
  dimension: Dimension;
  attendees: number;
  overnight: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <StatusPill tone={toneFor(dimension)}>
        Dimensión {dimensionLabel(dimension)}
      </StatusPill>
      <StatusPill>~{formatPeople(attendees)} asistentes</StatusPill>
      <StatusPill tone="accent">
        ~{formatPeople(overnight)} pernocta
      </StatusPill>
    </div>
  );
}

/** Bloque explicativo de demanda estimada (señal o campaña). */
export function DemandSizeBlock({
  dimension,
  attendees,
  attendeesLow,
  attendeesHigh,
  overnight,
  overnightLow,
  overnightHigh,
  method,
  confidence,
}: {
  dimension: Dimension;
  attendees: number;
  attendeesLow?: number;
  attendeesHigh?: number;
  overnight: number;
  overnightLow?: number;
  overnightHigh?: number;
  method?: string;
  confidence?: "alta" | "media" | "baja";
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
        Demanda estimada de gente
      </p>
      <div className="mt-2">
        <DemandSizeBadge
          dimension={dimension}
          attendees={attendees}
          overnight={overnight}
        />
      </div>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-[var(--muted)]">Asistentes / público</dt>
          <dd className="text-right tabular-nums">
            {attendeesLow != null && attendeesHigh != null
              ? formatAttendanceRange(attendeesLow, attendees, attendeesHigh)
              : `~${formatPeople(attendees)}`}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[var(--muted)]">Con chance de pernocta</dt>
          <dd className="text-right tabular-nums">
            {overnightLow != null && overnightHigh != null
              ? formatAttendanceRange(overnightLow, overnight, overnightHigh)
              : `~${formatPeople(overnight)}`}
          </dd>
        </div>
        {confidence ? (
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--muted)]">Confianza del proxy</dt>
            <dd>{confidence}</dd>
          </div>
        ) : null}
      </dl>
      {method ? (
        <p className="mt-2 text-xs text-[var(--muted)]">{method}</p>
      ) : (
        <p className="mt-2 text-xs text-[var(--muted)]">
          Estimación aproximada para comparar campañas (no es aforo oficial).
        </p>
      )}
    </div>
  );
}
