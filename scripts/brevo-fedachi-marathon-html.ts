/** Genera HTML para campaña Brevo dedicada: FEDACHI Marathon Sudamericano 2026. */
const UTM = "utm_source=brevo&utm_medium=email&utm_campaign=fedachi-marathon-2026";
const BASE = "https://crambie.com";
const OFFICIAL = "https://fedachimarathon.cl/";

const heroImage =
  "https://a0.muscache.com/im/pictures/hosting/Hosting-1589223102087983072/original/c37f24ca-e731-48d3-88fb-3c7792ecea96.jpeg?im_w=1200";

const guideUrl = `${BASE}/g/deporte-competencia-competencia-estadio-2026-11-15atletismo-sud-fedachi-marathon?lang=es&${UTM}&utm_content=guia`;
const santiagoUrl = `${BASE}/santiago?lang=es&${UTM}#deptos`;
const inscripcionUrl = `${OFFICIAL}?utm_source=crambie&utm_medium=email&utm_campaign=fedachi-marathon-2026`;

const distances = [
  { km: "5K", name: "Cinco kilómetros", note: "Familiar · desde 10 años", preventa: "$20.000", general: "$22.000" },
  { km: "10K", name: "Diez kilómetros", note: "Ritmo y ciudad · desde 16 años", preventa: "$25.000", general: "$27.000" },
  { km: "21K", name: "Medio maratón", note: "Avenidas de Santiago · desde 18 años", preventa: "$32.000", general: "$35.000" },
  { km: "42K", name: "Maratón", note: "Campeonato Sudamericano · largada y meta en Estadio Nacional", preventa: "$38.000", general: "$40.000" },
];

const includes = [
  "Polera oficial by ASICS",
  "Morral de competencia (guardarropía)",
  "Dorsal con chip de cronometraje",
  "Medalla finisher al cruzar la meta",
  "Hidratación, fruta y servicio médico en ruta",
];

const stays = [
  {
    name: "Ñuñoa · Estadio Nacional",
    sub: "A pasos del Estadio Nacional · Metro Estadio Nacional / Ñuble",
    photo:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589223102087983072/original/c37f24ca-e731-48d3-88fb-3c7792ecea96.jpeg?im_w=720",
    href: `${BASE}/santiago?lang=es&${UTM}&utm_content=depto-estadio-a#deptos`,
  },
  {
    name: "Ñuñoa · Estadio Nacional (2 deptos)",
    sub: "Ideal para kit pickup (13–14 nov) y largada matinal",
    photo:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1589231422574001170/original/d88292bb-89ec-44a9-a50c-783bfa6bb6a3.jpeg?im_w=720",
    href: `${BASE}/santiago?lang=es&${UTM}&utm_content=depto-estadio-b#deptos`,
  },
];

function distanceCards() {
  return distances
    .map(
      (d) => `
<tr><td style="padding:0 0 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#ffffff;">
    <tr><td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="56" valign="top">
            <div style="width:48px;height:48px;border-radius:10px;background:#222222;color:#ffffff;font-size:15px;font-weight:800;line-height:48px;text-align:center;">${d.km}</div>
          </td>
          <td style="padding-left:12px;">
            <p style="margin:0;font-size:16px;font-weight:700;color:#222222;">${d.name}</p>
            <p style="margin:4px 0 0;font-size:13px;line-height:1.45;color:#6a6a6a;">${d.note}</p>
            <p style="margin:8px 0 0;font-size:12px;color:#555555;">Preventa ${d.preventa} · General ${d.general}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</td></tr>`,
    )
    .join("\n");
}

function includeList() {
  return includes
    .map(
      (item) => `
<tr><td style="padding:0 0 10px;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td width="22" valign="top" style="color:#FF5A5F;font-size:16px;line-height:1.4;">✓</td>
    <td style="font-size:14px;line-height:1.45;color:#333333;">${item}</td>
  </tr></table>
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
    <tr><td><a href="${s.href}"><img src="${s.photo}" alt="${s.name}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" /></a></td></tr>
    <tr><td style="padding:18px 20px 20px;font-family:Arial,Helvetica,sans-serif;">
      <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6a6a6a;font-weight:700;">${s.sub}</p>
      <p style="margin:8px 0 14px;font-size:22px;line-height:1.2;color:#222222;font-weight:700;">${s.name}</p>
      <a href="${s.href}" style="display:inline-block;background:#FF5A5F;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 18px;border-radius:10px;">Ver en Crambie</a>
    </td></tr>
  </table>
</td></tr>`,
    )
    .join("\n");
}

export const fedachiMarathonHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FEDACHI Marathon Sudamericano 2026 · Santiago</title>
</head>
<body style="margin:0;padding:0;background:#f7f4f0;color:#222222;font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    15 nov 2026 · Estadio Nacional · 5K, 10K, 21K y 42K. Campeonato Sudamericano. Reserva tu alojamiento en Santiago.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4f0;">
    <tr><td align="center" style="padding:0;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#f7f4f0;">

        <tr><td style="padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
            background="${heroImage}"
            style="background-color:#111111;background-image:linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.97) 100%), url('${heroImage}');background-size:cover;background-position:center;">
            <tr><td height="120" style="font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:0 24px 36px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.72);font-weight:700;">
                Sudamericano 2026 · Santiago de Chile
              </p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.08;color:#ffffff;font-weight:700;">
                FEDACHI Marathon
              </h1>
              <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.82);font-weight:600;">
                El maratón oficial del atletismo en Chile · by ASICS
              </p>
              <p style="margin:18px 0 0;font-size:16px;line-height:1.55;color:rgba(255,255,255,0.92);">
                Domingo <strong style="color:#fff;">15 de noviembre de 2026</strong>, inicio <strong style="color:#fff;">06:30 hrs</strong> · <strong style="color:#fff;">Estadio Nacional</strong>
              </p>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.5;color:rgba(255,255,255,0.85);">
                Cuatro distancias con categoría de <strong style="color:#fff;">Campeonato Sudamericano</strong>: 5K, 10K, 21K y 42K. Miles de corredores, elite regional y recorrido urbano por Santiago.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:26px;">
                <tr>
                  <td style="padding:0 10px 12px 0;">
                    <a href="${inscripcionUrl}" style="display:inline-block;background:#FF5A5F;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 22px;border-radius:10px;">Inscribirme en fedachimarathon.cl</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 10px 12px 0;">
                    <a href="${santiagoUrl}" style="display:inline-block;border:1px solid rgba(255,255,255,0.55);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 20px;border-radius:10px;">Ver alojamiento en Santiago</a>
                  </td>
                </tr>
                <tr><td>
                  <a href="${guideUrl}" style="color:rgba(255,255,255,0.78);font-size:14px;font-weight:600;text-decoration:underline;">Guía del evento en Crambie →</a>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="background:#ffffff;padding:36px 24px;font-family:Arial,Helvetica,sans-serif;border-bottom:1px solid rgba(0,0,0,0.08);">
          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.2;color:#222222;font-weight:700;">
            Elige tu distancia
          </h2>
          <p style="margin:10px 0 20px;font-size:14px;line-height:1.55;color:#6a6a6a;">
            Preventa disponible hasta el 15 de julio o hasta agotar cupos. Valores no incluyen comisión de ticketera.
            Afiliados Caja Los Andes: <strong>$7.000 de descuento</strong> por inscripción.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${distanceCards()}
          </table>
          <p style="margin:16px 0 0;text-align:center;">
            <a href="${inscripcionUrl}" style="color:#FF5A5F;font-weight:700;font-size:15px;text-decoration:none;">Ver distancias e inscribirme →</a>
          </p>
        </td></tr>

        <tr><td style="background:#f7f4f0;padding:36px 24px;font-family:Arial,Helvetica,sans-serif;border-bottom:1px solid rgba(0,0,0,0.08);">
          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.2;color:#222222;font-weight:700;">
            ¿Qué incluye tu inscripción?
          </h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
            ${includeList()}
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#ffffff;">
            <tr><td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6a6a6a;font-weight:700;">Kit del corredor</p>
              <p style="margin:8px 0 0;font-size:14px;line-height:1.5;color:#333333;">
                <strong>Entrega de kits:</strong> 13 y 14 de noviembre, 10:00 a 20:00 hrs (lugar por confirmar).
              </p>
              <p style="margin:10px 0 0;font-size:14px;line-height:1.5;color:#333333;">
                <strong>Premiación:</strong> general el día del evento en Estadio Nacional; por categorías posterior al evento.
              </p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="background:#222222;padding:36px 24px;font-family:Arial,Helvetica,sans-serif;">
          <h2 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.2;color:#ffffff;font-weight:700;">
            Quédate cerca del Estadio Nacional
          </h2>
          <p style="margin:12px 0 22px;font-size:15px;line-height:1.55;color:rgba(255,255,255,0.78);">
            Largada a las 06:30, kit pickup el 13–14 nov y alta demanda ese fin de semana (coincide con García Huidobro). Ñuñoa es la base ideal para corredores de regiones e internacionales.
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${stayCards()}
          </table>
          <p style="margin:8px 0 0;text-align:center;">
            <a href="${santiagoUrl}" style="color:#ffffff;font-weight:700;font-size:15px;">Ver todos los alojamientos →</a>
          </p>
        </td></tr>

        <tr><td style="background:#ffffff;padding:32px 24px;font-family:Arial,Helvetica,sans-serif;text-align:center;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6a6a6a;font-weight:700;">Organiza FEDACHI · Produce Menta Producciones</p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#555555;">
            info@fedachimarathon.cl · cambios@fedachimarathon.cl
          </p>
          <a href="${inscripcionUrl}" style="display:inline-block;background:#FF5A5F;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 24px;border-radius:10px;">Inscríbete ahora · fedachimarathon.cl</a>
        </td></tr>

        <tr><td style="background:#f7f4f0;padding:22px 24px 36px;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0;font-size:12px;line-height:1.5;color:#6a6a6a;text-align:center;">
            Información del evento según <a href="${OFFICIAL}" style="color:#555555;">fedachimarathon.cl</a>. Crambie no organiza la carrera; mostramos alojamiento independiente en Santiago.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

if (process.argv[1]?.endsWith("brevo-fedachi-marathon-html.ts")) {
  process.stdout.write(fedachiMarathonHtml);
}
