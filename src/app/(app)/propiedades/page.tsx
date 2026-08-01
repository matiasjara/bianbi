import { getPoi, properties } from "@/lib/data/seed";
import { SectionTitle, StatusPill, formatPct } from "@/components/ui";

export const metadata = { title: "Propiedades" };

export default function PropiedadesPage() {
  return (
    <div>
      <SectionTitle
        title="Propiedades"
        subtitle="Inventario real desde Airbnb."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {properties.map((property) => {
          const low =
            property.occupancyNext30 !== null && property.occupancyNext30 < 0.5;
          const nearby = property.nearbyPoiIds
            .map((id) => getPoi(id)?.name)
            .filter(Boolean);

          return (
            <article key={property.id} className="surface overflow-hidden rounded-xl">
              {property.photos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${property.photos[0]}?im_w=720`}
                  alt={property.name}
                  className="h-48 w-full object-cover"
                />
              ) : null}

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <StatusPill tone="accent">
                        ID interno · {property.code}
                      </StatusPill>
                      {property.buildingName ? (
                        <StatusPill>{property.buildingName}</StatusPill>
                      ) : null}
                      <StatusPill tone={property.isReal ? "good" : "warn"}>
                        {property.isReal ? "Real · Airbnb" : "Dummy"}
                      </StatusPill>
                      {property.isSuperhost ? (
                        <StatusPill>Superhost</StatusPill>
                      ) : null}
                      {property.rating ? (
                        <StatusPill>
                          ★ {property.rating} · {property.reviewCount} reviews
                        </StatusPill>
                      ) : null}
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-xl">
                      {property.name}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {property.neighborhood}
                    </p>
                  </div>
                  <StatusPill tone={low ? "warn" : "neutral"}>
                    {property.occupancyNext30 === null
                      ? "ocup. n/d"
                      : formatPct(property.occupancyNext30)}
                  </StatusPill>
                </div>

                <p className="mt-3 text-sm text-[var(--muted)]">
                  {property.description}
                </p>

                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--muted)]">Capacidad</dt>
                    <dd>
                      {property.capacity} huéspedes · {property.bedrooms}D ·{" "}
                      {property.beds} cama · {property.bathrooms}B
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--muted)]">Noches libres (30d)</dt>
                    <dd>{property.availableNightsNext30 ?? "sin sync"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--muted)]">Metro</dt>
                    <dd className="text-right">
                      {property.metroStations.join(", ")}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[var(--muted)]">Coords</dt>
                    <dd className="tabular-nums">
                      {property.lat}, {property.lng}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    Públicos
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {property.audiences.map((a) => (
                      <StatusPill key={a} tone="accent">
                        {a}
                      </StatusPill>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    POIs cercanos
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {nearby.map((name) => (
                      <StatusPill key={name}>{name}</StatusPill>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {property.amenities.map((a) => (
                    <StatusPill key={a}>{a}</StatusPill>
                  ))}
                </div>

                <a
                  href={property.airbnbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-block text-sm text-[var(--accent-ink)] hover:underline"
                >
                  Abrir Airbnb →
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
