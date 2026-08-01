import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingMap } from "@/components/campaigns/LandingMap";
import { PhotoStoryCarousel } from "@/components/campaigns/PhotoStoryCarousel";
import { loadCampaignPackBySlug } from "@/lib/demand/load-campaign-packs";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

/** Color de acento Airbnb (Rausch) — solo color, sin logo. */
const AIRBNB_BTN =
  "inline-flex items-center justify-center rounded-lg bg-[#FF5A5F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E0484D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]";

const AIRBNB_BTN_LG =
  "inline-flex items-center justify-center rounded-lg bg-[#FF5A5F] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#E0484D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5A5F]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pack = await loadCampaignPackBySlug(slug);
  if (!pack) return { title: "Campaña" };
  return {
    title: pack.headline,
    description: pack.subhead,
  };
}

export default async function CampaignLandingPage({ params }: Props) {
  const { slug } = await params;
  const pack = await loadCampaignPackBySlug(slug);
  if (!pack) notFound();

  const lead = pack.properties[0];
  const metros = [
    ...new Set(pack.properties.flatMap((p) => p.metroStations)),
  ];
  const barrioLead = lead?.neighborhood ?? "Santiago";

  const propertyPins = new Map<
    string,
    { lat: number; lng: number; label: string; kind: "property" }
  >();
  for (const p of pack.properties) {
    const key = `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
    if (!propertyPins.has(key)) {
      propertyPins.set(key, {
        lat: p.lat,
        lng: p.lng,
        // Sin dirección exacta en UI — solo pin + barrio
        label: p.neighborhood,
        kind: "property",
      });
    }
  }
  const mapMarkers = [
    {
      lat: pack.venueLat,
      lng: pack.venueLng,
      label: pack.venueName,
      kind: "venue" as const,
    },
    ...propertyPins.values(),
  ];

  return (
    <div className="min-h-screen bg-[#f7f4f0] text-[#222222]">
      {/* Hero */}
      <div
        className="relative min-h-[78vh] overflow-hidden"
        style={{
          backgroundImage: lead?.photo
            ? `linear-gradient(180deg, rgba(34,34,34,0.25) 0%, rgba(34,34,34,0.72) 55%, rgba(34,34,34,0.92) 100%), url(${lead.photo}?im_w=1440)`
            : "linear-gradient(160deg, #2b2b2b, #111)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex min-h-[78vh] max-w-4xl flex-col justify-end px-5 pb-14 pt-24">
          <p className="animate-rise mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/75">
            {pack.venueName} · {pack.eventDates}
          </p>
          <h1 className="animate-rise max-w-3xl font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-white md:text-5xl">
            {pack.headline}
          </h1>
          <p className="animate-rise-delay mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            {pack.subhead}
          </p>

          <p className="animate-rise-delay mt-5 max-w-2xl text-sm text-white/80">
            {metros.length > 0
              ? `Metro ${metros.slice(0, 2).join(" / ")} · `
              : ""}
            {barrioLead} · barrio seguro en Santiago · arriendo directo en
            Airbnb
          </p>

          <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
            {lead ? (
              <a
                href={lead.airbnbUrl}
                target="_blank"
                rel="noreferrer"
                className={AIRBNB_BTN_LG}
              >
                Ver disponibilidad en Airbnb
              </a>
            ) : null}
            <a
              href="#deptos"
              className="inline-flex items-center justify-center rounded-lg border border-white/55 bg-white/10 px-6 py-3.5 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Ver departamentos
            </a>
          </div>
        </div>
      </div>

      {/* Por qué aquí */}
      <section className="border-b border-black/8 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            Por qué este es el lugar indicado
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#6a6a6a]">
            No es un hotel genérico lejos del evento: es un departamento real en
            Santiago, pensado para que llegues, descanses y estés cerca de{" "}
            {pack.venueName}.
          </p>
          <ol className="mt-8 space-y-5">
            {pack.trustPoints.map((point, i) => (
              <li key={point} className="flex gap-4">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#222] text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-[#222]">
                  {point}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Departamentos */}
      <section id="deptos" className="mx-auto max-w-4xl px-5 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
          Elige tu departamento
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#6a6a6a]">
          Ordenados por cercanía a {pack.venueName}. Reserva con las fechas del
          evento directo en Airbnb: pago protegido y mensajes con el anfitrión.
        </p>

        <div className="mt-10 space-y-8">
          {pack.properties.map((prop, idx) => (
            <article
              key={prop.slug}
              className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:grid md:grid-cols-[320px_1fr]"
            >
              <PhotoStoryCarousel
                photos={prop.photos.length ? prop.photos : [prop.photo].filter(Boolean)}
                alt={prop.name}
                caption={prop.neighborhood}
                className="h-72 w-full md:h-full md:min-h-[360px]"
              />
              <div className="flex flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a6a6a]">
                  Opción {idx + 1} · {prop.walkingMinutes} min a pie ·{" "}
                  {prop.distanceKm} km
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug">
                  {prop.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#484848]">
                  {prop.pitch}
                </p>

                <ul className="mt-4 grid gap-2 text-sm text-[#222] sm:grid-cols-2">
                  <li>
                    <span className="text-[#6a6a6a]">Barrio:</span>{" "}
                    {prop.neighborhood}
                  </li>
                  {prop.metroStations.length > 0 ? (
                    <li>
                      <span className="text-[#6a6a6a]">Metro:</span>{" "}
                      {prop.metroStations.join(", ")}
                    </li>
                  ) : null}
                  <li>
                    <span className="text-[#6a6a6a]">Camas:</span> matrimonial +
                    sofá-cama
                  </li>
                  <li>
                    <span className="text-[#6a6a6a]">Capacidad:</span> hasta{" "}
                    {prop.capacity} huésped
                    {prop.capacity === 1 ? "" : "es"} · {prop.bedrooms} dorm
                  </li>
                  {prop.rating != null && prop.reviewCount != null ? (
                    <li>
                      <span className="text-[#6a6a6a]">Airbnb:</span>{" "}
                      {prop.rating.toFixed(1)} ★ · {prop.reviewCount} reseña
                      {prop.reviewCount === 1 ? "" : "s"}
                      {prop.isSuperhost ? " · Superhost" : ""}
                    </li>
                  ) : null}
                </ul>

                <ul className="mt-4 flex flex-wrap gap-2 text-xs text-[#6a6a6a]">
                  {prop.amenities.map((a) => (
                    <li
                      key={a}
                      className="rounded-md bg-[#f7f4f0] px-2.5 py-1"
                    >
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={prop.airbnbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={AIRBNB_BTN}
                  >
                    Reservar en Airbnb
                  </a>
                  <span className="text-xs text-[#6a6a6a]">
                    Pago seguro · cancelación según política del anuncio
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Mapa: evento + propiedades */}
      <section id="mapa" className="border-t border-black/8 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-14">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            Evento y departamentos en el mapa
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#6a6a6a]">
            Pin negro = {pack.venueName}. Pins coral = tus opciones de
            alojamiento. Así ves la distancia real antes de reservar.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#6a6a6a]">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-full bg-[#222]" />
              Evento
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-full bg-[#FF5A5F]" />
              Departamento
            </span>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl border border-black/8">
            <LandingMap markers={mapMarkers} className="h-96 w-full" />
          </div>
        </div>
      </section>

      {/* Cierre vendedor */}
      <section className="border-t border-black/8 bg-[#222] text-white">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            Reserva ahora y asegura tu estadía
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            Las fechas de {pack.eventDates} se llenan rápido cerca de{" "}
            {pack.venueName}. Arriendas en Airbnb: es el canal seguro para
            pagar, coordinar el check-in y ver reseñas reales.
          </p>
          {lead ? (
            <a
              href={lead.airbnbUrl}
              target="_blank"
              rel="noreferrer"
              className={`${AIRBNB_BTN_LG} mt-8`}
            >
              Ir a Airbnb
            </a>
          ) : null}
        </div>
      </section>

      <footer className="bg-[#1a1a1a] px-5 py-10 text-center text-xs leading-relaxed text-white/45">
        <p
          className="font-[family-name:var(--font-display)] text-[11px] font-semibold tracking-[0.28em] text-white/30"
          aria-label="Bianbi"
        >
          BIANBI
        </p>
        <p className="mt-6">
          Alojamiento independiente en Santiago · {pack.eventDates}
        </p>
        <p className="mx-auto mt-3 max-w-2xl">
          Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. No
          gestionamos arriendos, no cobramos reservas ni procesamos pagos: solo
          mostramos opciones y te redirigimos al anuncio oficial en Airbnb para
          que reserves allí.
        </p>
      </footer>
    </div>
  );
}
