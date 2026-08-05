/** Genera HTML para campaña Brevo: agenda consolidada de atletismo 2026. */
const UTM = "utm_source=brevo&utm_medium=email&utm_campaign=atletismo-agenda-2026";
const BASE = "https://crambie.com";

const GUIDE_DISCLAIMER =
  "Estas guías son solo informativas. No están relacionadas con los organizadores del evento, no constituyen información oficial y pueden contener errores. Confirma fechas, sedes e inscripciones en las fuentes oficiales.";

const heroImage =
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1589223102087983072/original/c37f24ca-e731-48d3-88fb-3c7792ecea96.jpeg?im_w=1200";

type AgendaEvent = {
  title: string;
  dates: string;
  venue: string;
  teaser: string;
  photo: string;
  guide: string;
  externalUrl?: string;
  externalLabel?: string;
};

/** Copy alineado con microsite-event-overrides y datos FEDACHI/CAS 2026. */
const events: AgendaEvent[] = [
  {
    title: "40ª Posta de Santiago",
    dates: "23 ago 2026 · 10:00–12:30",
    venue: "Escuela Militar · Las Condes",
    teaser:
      "Posta por relevos escolar y federada. Colegios de Santiago y regiones, clubes AARM e instituciones invitadas.",
    photo: `${BASE}/guides/deportes/atletismo.png`,
    guide: `${BASE}/g/deporte-competencia-competencia-atletismo-40-posta-de-santia-2026-08-23atletismo?lang=es&${UTM}&utm_content=evento-posta`,
    externalUrl:
      "https://clubatleticosantiago.cl/wp-content/uploads/2026/01/Bases-40a-Posta-de-Santiago-Escuela-Militar-2026.pdf",
    externalLabel: "Bases oficiales (PDF) →",
  },
  {
    title: "2° Torneo Master «Ramón Sandoval»",
    dates: "30 ago 2026",
    venue: "Estadio Mario Recordón · Parque Estadio Nacional",
    teaser:
      "Torneo master en pista. Atletas federados, clubes AARM y categorías master del calendario CAS.",
    photo: `${BASE}/guides/deportes/atletismo-1.png`,
    guide: `${BASE}/g/deporte-competencia-competencia-estadio-2026-08-30atletismo-2-t-r-ramon-sandoval?lang=es&${UTM}&utm_content=evento-master-sandoval`,
  },
  {
    title: "Campeonato Nacional U18",
    dates: "5–6 sep 2026",
    venue: "Estadio Mario Recordón · Parque Estadio Nacional",
    teaser:
      "Campeonato Nacional U18 FEDACHI en pista y campo. Atletas de asociaciones regionales con entrenadores y familias.",
    photo: `${BASE}/guides/deportes/atletismo-2.png`,
    guide: `${BASE}/g/deporte-competencia-competencia-estadio-2026-09-05atletismo-cam-ato-nacional-u18?lang=es&${UTM}&utm_content=evento-u18`,
    externalUrl: "https://www.instagram.com/p/Danr5lvkV4S",
    externalLabel: "Convocatoria FEDACHI (Instagram) →",
  },
  {
    title: "Campeonato Nacional U16",
    dates: "12 sep 2026",
    venue: "Santiago, Chile",
    teaser:
      "Campeonato Nacional U16 FEDACHI. Sede exacta por confirmar — revisa el calendario oficial antes de viajar.",
    photo: `${BASE}/guides/deportes/atletismo-3.png`,
    guide: `${BASE}/g/deporte-competencia-competencia-estadio-2026-09-12atletismo-cam-ato-nacional-u16?lang=es&${UTM}&utm_content=evento-u16`,
    externalUrl: "https://fedachi.cl/calendar",
    externalLabel: "Calendario FEDACHI →",
  },
  {
    title: "Campeonato Interescolar Final",
    dates: "30 oct – 1 nov 2026",
    venue: "Parque Estadio Nacional · Ñuñoa",
    teaser:
      "Finales escolares femenino y masculino. Colegios de Santiago y regiones en el calendario interescolar CAS.",
    photo: `${BASE}/guides/deportes/atletismo-4.png`,
    guide: `${BASE}/g/deporte-competencia-competencia-estadio-2026-10-3078-campeonato--heck-y-91-campe?lang=es&${UTM}&utm_content=evento-interescolar`,
  },
  {
    title: "61° Torneo «Guillermo García-Huidobro»",
    dates: "14–15 nov 2026",
    venue: "Estadio Mario Recordón · Parque Estadio Nacional",
    teaser:
      "Torneo CAS en pista. Una de las fechas clásicas del Club Atlético Santiago antes del cierre de temporada.",
    photo: `${BASE}/guides/deportes/atletismo-5.png`,
    guide: `${BASE}/g/deporte-competencia-competencia-estadio-2026-11-14atletismo-61---garcia-huidobro?lang=es&${UTM}&utm_content=evento-garcia-huidobro`,
  },
];

const marathonFeatured = {
  title: "FEDACHI Marathon Sudamericano 2026",
  dates: "15 nov 2026 · 06:30",
  venue: "Estadio Nacional · Ñuñoa",
  photo: `${BASE}/guides/deportes/atletismo.png`,
  guide: `${BASE}/g/deporte-competencia-competencia-estadio-2026-11-15atletismo-sud-fedachi-marathon?lang=es&${UTM}&utm_content=evento-maraton`,
  officialUrl: "https://fedachimarathon.cl/",
  distances: "5K · 10K · 21K · 42K",
};

const stays = [
  {
    label: "A pasos del Estadio Nacional",
    sub: "Metro Estadio Nacional / Ñuble",
    name: "Ñuñoa · Estadio Nacional",
    photo:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589223102087983072/original/c37f24ca-e731-48d3-88fb-3c7792ecea96.jpeg?im_w=720",
    href: `${BASE}/santiago?lang=es&${UTM}&utm_content=depto-estadio-a#deptos`,
  },
  {
    label: "A pasos del Estadio Nacional",
    sub: "Metro Estadio Nacional / Ñuble",
    name: "Ñuñoa · Estadio Nacional (2 deptos)",
    photo:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589231422574001170/original/d88292bb-89ec-44a9-a50c-783bfa6bb6a3.jpeg?im_w=720",
    href: `${BASE}/santiago?lang=es&${UTM}&utm_content=depto-estadio-b#deptos`,
  },
  {
    label: "Buena ubicación · Metro Irarrázaval",
    sub: "Barrio Italia",
    name: "Edificio Santa Elena · Barrio Italia",
    photo:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1599328111588834445/original/2aabe7e0-1b4e-4034-9aa9-92a2aad83d2b.jpeg?im_w=720",
    href: `${BASE}/santiago?lang=es&${UTM}&utm_content=depto-italia#deptos`,
  },
  {
    label: "Cerca de Escuela Militar",
    sub: "Las Condes · Posta de Santiago",
    name: "Providencia / Barrio Italia",
    photo:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1575446462764908645/original/ba1290cc-676c-4f3e-8833-f26643367303.jpeg?im_w=720",
    href: `${BASE}/santiago?lang=es&${UTM}&utm_content=depto-las-condes#deptos`,
  },
];

function heroBlock(santiagoUrl: string, heroGuide: string) {
  return `
<tr><td style="padding:0;">
  <!--[if gte mso 9]>
  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:440px;">
    <v:fill type="frame" src="${heroImage}" color="#1a1a1a" />
    <v:textbox inset="0,0,0,0" style="mso-fit-shape-to-text:true">
  <![endif]-->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    background="${heroImage}"
    style="background-color:#1a1a1a;background-image:linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.94) 100%), url('${heroImage}');background-size:cover;background-position:center center;background-repeat:no-repeat;">
    <tr><td height="168" style="font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="padding:0 24px 34px;font-family:Arial,Helvetica,sans-serif;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.78);font-weight:600;">
        Atletismo · ago–nov 2026 · Santiago
      </p>
      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.12;color:#ffffff;font-weight:700;">
        Agenda de atletismo 2026 en Santiago
      </h1>
      <p style="margin:16px 0 0;font-size:16px;line-height:1.5;color:rgba(255,255,255,0.9);">
        Siete fechas clave entre agosto y noviembre — con cierre en el <strong style="color:#ffffff;">FEDACHI Marathon Sudamericano 2026</strong> (~12.000 corredores, Estadio Nacional).
      </p>
      <p style="margin:12px 0 0;font-size:16px;line-height:1.5;color:rgba(255,255,255,0.9);">
        <strong style="color:#ffffff;">Guías por evento, sede confirmada y recomendaciones de alojamiento.</strong>
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr>
          <td style="padding:0 10px 10px 0;">
            <a href="${santiagoUrl}" style="display:inline-block;background:#FF5A5F;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 22px;border-radius:10px;">Ver alojamientos en Santiago</a>
          </td>
        </tr>
        <tr>
          <td>
            <a href="${heroGuide}" style="display:inline-block;border:1px solid rgba(255,255,255,0.55);color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:13px 22px;border-radius:10px;">Ver guía · 40ª Posta de Santiago</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
  <!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
</td></tr>`;
}

function marathonFeaturedBlock() {
  const m = marathonFeatured;
  const inscripcionUrl = `${m.officialUrl}?utm_source=crambie&utm_medium=email&utm_campaign=atletismo-agenda-2026`;
  return `
<tr><td style="padding:0;background:#111111;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:28px 24px 0;font-family:Arial,Helvetica,sans-serif;">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#FF5A5F;font-weight:700;">
        ★ Evento destacado · el más grande del calendario
      </p>
      <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.15;color:#ffffff;font-weight:700;">
        ${m.title}
      </h2>
      <p style="margin:10px 0 0;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.65);font-weight:700;">
        ${m.dates} · ${m.venue} · ${m.distances}
      </p>
    </td></tr>
    <tr><td style="padding:18px 24px 0;line-height:0;font-size:0;">
      <a href="${m.guide}" style="text-decoration:none;display:block;">
        <img src="${m.photo}" alt="${m.title}" width="600" style="display:block;width:100%;max-width:600px;height:220px;object-fit:cover;border:0;border-radius:14px 14px 0 0;" />
      </a>
    </td></tr>
    <tr><td style="padding:20px 24px 32px;font-family:Arial,Helvetica,sans-serif;">
      <p style="margin:0;font-size:16px;line-height:1.55;color:rgba(255,255,255,0.9);">
        El <strong style="color:#fff;">maratón oficial del atletismo en Chile</strong>. Campeonato Sudamericano 2026 by ASICS · ~12.000 corredores en cuatro distancias. La 42K con largada y meta en el Estadio Nacional. Kit pickup 13–14 nov.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
        <tr>
          <td style="padding:0 10px 10px 0;">
            <a href="${inscripcionUrl}" style="display:inline-block;background:#FF5A5F;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 20px;border-radius:10px;">Inscribirme · fedachimarathon.cl</a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 0 10px;">
            <a href="${m.guide}" style="display:inline-block;border:1px solid rgba(255,255,255,0.45);color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 18px;border-radius:10px;">Ver guía del evento en Crambie</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</td></tr>`;
}

function eventRows() {
  return events
    .map(
      (e, i) => `
<tr><td style="padding:0 0 14px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(0,0,0,0.08);border-radius:14px;overflow:hidden;background:#ffffff;">
    <tr>
      <td width="168" valign="top" style="padding:0;line-height:0;font-size:0;background:#ece8e3;">
        <a href="${e.guide}" style="text-decoration:none;display:block;">
          <img src="${e.photo}" alt="${e.title}" width="168" height="132" style="display:block;width:168px;max-width:168px;height:132px;border:0;" />
        </a>
      </td>
      <td valign="middle" style="padding:16px 18px 16px 14px;font-family:Arial,Helvetica,sans-serif;">
        <a href="${e.guide}" style="text-decoration:none;color:#222222;display:block;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="30" valign="top" style="padding-right:8px;">
                <div style="width:26px;height:26px;border-radius:999px;background:#222222;color:#ffffff;font-size:11px;font-weight:700;line-height:26px;text-align:center;">${i + 1}</div>
              </td>
              <td>
                <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6a6a6a;font-weight:700;">${e.dates} · ${e.venue}</p>
                <p style="margin:6px 0 0;font-size:17px;line-height:1.28;color:#222222;font-weight:700;">${e.title}</p>
                <p style="margin:8px 0 0;font-size:13px;line-height:1.45;color:#555555;">${e.teaser}</p>
                ${e.externalUrl ? `<p style="margin:8px 0 0;font-size:13px;"><a href="${e.externalUrl}" style="color:#FF5A5F;font-weight:600;text-decoration:none;">${e.externalLabel ?? "Fuente oficial →"}</a></p>` : ""}
                <p style="margin:10px 0 0;font-size:14px;line-height:1.4;color:#FF5A5F;font-weight:700;">Ver guía del evento →</p>
              </td>
            </tr>
          </table>
        </a>
      </td>
    </tr>
  </table>
</td></tr>`,
    )
    .join("\n");
}

function stayCards() {
  return stays
    .map(
      (s) => `
<tr><td style="padding:0 0 18px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(0,0,0,0.08);border-radius:16px;overflow:hidden;background:#ffffff;">
    <tr><td>
      <a href="${s.href}" style="text-decoration:none;">
        <img src="${s.photo}" alt="${s.name}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
      </a>
    </td></tr>
    <tr><td style="padding:18px 20px 20px;font-family:Arial,Helvetica,sans-serif;">
      <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6a6a6a;font-weight:700;">${s.label} · ${s.sub}</p>
      <p style="margin:8px 0 14px;font-size:22px;line-height:1.2;color:#222222;font-weight:700;">${s.name}</p>
      <a href="${s.href}" style="display:inline-block;background:#FF5A5F;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 18px;border-radius:10px;">Ver en Crambie</a>
    </td></tr>
  </table>
</td></tr>`,
    )
    .join("\n");
}

const santiagoUrl = `${BASE}/santiago?lang=es&${UTM}#deptos`;
const heroGuide = events[0].guide;

export const athleticsAgendaHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Agenda de atletismo 2026 · Santiago</title>
</head>
<body style="margin:0;padding:0;background:#f7f4f0;color:#222222;font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    7 fechas de atletismo en Santiago (ago–nov 2026). Destacado: FEDACHI Marathon Sudamericano 2026, 15 nov. Guías por evento y alojamiento.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4f0;">
    <tr><td align="center" style="padding:0;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#f7f4f0;">

        ${heroBlock(santiagoUrl, heroGuide)}

        ${marathonFeaturedBlock()}

        <tr><td style="background:#ffffff;padding:40px 24px;font-family:Arial,Helvetica,sans-serif;border-bottom:1px solid rgba(0,0,0,0.08);">
          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#222222;font-weight:700;">
            6 eventos más · guías por fecha
          </h2>
          <p style="margin:10px 0 24px;font-size:15px;line-height:1.55;color:#6a6a6a;">
            Cada guía resume sede, contexto del evento y recomendaciones de estadía en Santiago. Haz clic en la foto o en el título.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${eventRows()}
          </table>
        </td></tr>

        <tr><td style="background:#f7f4f0;padding:40px 24px;font-family:Arial,Helvetica,sans-serif;">
          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#222222;font-weight:700;">
            Elige tu alojamiento en Santiago
          </h2>
          <p style="margin:10px 0 24px;font-size:15px;line-height:1.55;color:#6a6a6a;">
            Deptos cerca del Estadio Nacional para el maratón y el calendario federado; opciones útiles también para la Posta en Las Condes. En fines de semana de campeonato se llenan rápido.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${stayCards()}
          </table>
          <p style="margin:8px 0 0;font-size:12px;line-height:1.45;color:#6a6a6a;">
            Pago seguro en Airbnb · cancelación según política del anuncio
          </p>
          <p style="margin:18px 0 0;">
            <a href="${santiagoUrl}" style="color:#222222;font-weight:700;font-size:15px;">Ver todos los alojamientos en crambie.com/santiago →</a>
          </p>
        </td></tr>

        <tr><td style="background:#222222;padding:40px 24px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#ffffff;font-weight:700;">
            Reserva con anticipación
          </h2>
          <p style="margin:14px auto 0;max-width:480px;font-size:15px;line-height:1.55;color:rgba(255,255,255,0.75);">
            La temporada de atletismo concentra viajes de asociaciones, clubes, corredores y familias. Asegura tu base en Santiago antes de que suba la demanda.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto 0;">
            <tr><td style="background:#FF5A5F;border-radius:10px;">
              <a href="${santiagoUrl}" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;">Ir a crambie.com/santiago</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="background:#f7f4f0;padding:22px 24px 36px;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0 0 12px;font-size:12px;line-height:1.55;color:#6a6a6a;text-align:center;">
            ${GUIDE_DISCLAIMER}
          </p>
          <p style="margin:0;font-size:12px;line-height:1.5;color:#6a6a6a;text-align:center;">
            Alojamiento independiente en Santiago · ago–nov 2026. Este sitio no es parte de Airbnb ni está afiliado a Airbnb, Inc. Solo mostramos opciones y te redirigimos al anuncio oficial.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

if (process.argv[1]?.endsWith("brevo-athletics-agenda-html.ts")) {
  process.stdout.write(athleticsAgendaHtml);
}
