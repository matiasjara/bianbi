export function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="metric-block">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p> : null}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)] md:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-[var(--muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "accent";
}) {
  const tones = {
    neutral: "bg-[var(--panel-2)] text-[var(--muted)]",
    good: "bg-[var(--good-soft)] text-[var(--good)]",
    warn: "bg-[var(--warn-soft)] text-[var(--warn)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent-ink)]",
  };

  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function formatClp(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number) {
  return `${Math.round(value * 100)}%`;
}
