/**
 * Enriquece emails faltantes en sports-organizations.ts
 * Fuentes públicas: COCH, FEBACHILE, FETECH, Chile Rugby, FEDEVELA, FEHOCH, FECHIDA.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { sportsOrganizations } from "../src/lib/data/sports-organizations";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

type Patch = {
  emails: string[];
  phones?: string[];
  website?: string;
  address?: string;
};

/** Parches por id exacto (prioridad máxima). */
const BY_ID: Record<string, Patch> = {
  "org-tabla_asociaciones-rugby-federaci-n-de-rugby-de-chile": {
    emails: [
      "institucional@chilerugby.org",
      "contacto@chilerugby.org",
      "presidente@chilerugby.cl",
    ],
    phones: ["+56 9 7430 7517"],
    website: "https://chile.rugby/",
    address:
      "Av. Fernando Castillo Velasco 11095 (Parque Mahuida), La Reina",
  },
  "org-tabla_asociaciones-b-squetbol-federaci-n-deportiva-nacional-de-b-squetbol-de": {
    emails: [
      "febachile@gmail.com",
      "k.heerwagen@febachile.cl",
      "prensa@febachile.cl",
      "Asociaciones.feba@gmail.com",
    ],
    phones: ["+56 9 3783 2484"],
    website: "https://www.febachile.cl/",
    address: "Av. Ramón Cruz 1176, Of. 405, Ñuñoa",
  },
  "org-tabla_asociaciones-tenis-federaci-n-deportiva-nacional-de-tenis-de-chile-fdn": {
    emails: ["federacion@federaciondetenisdechile.cl"],
    phones: ["+56 2 2207 3242", "+56 2 2207 2311"],
    website: "https://www.federaciondetenisdechile.cl/",
    address: "Cerro Colorado 4661, Las Condes",
  },
  "org-registro_fdn-583": {
    emails: [
      "info@fedevela.cl",
      "presidente@fedevela.cl",
      "gerencia@fedevela.cl",
    ],
    phones: ["+56 9 9223 5720"],
    website: "https://www.fedevela.cl/",
    address: "Av. Ramón Cruz 1176, Of. 401, Ñuñoa",
  },
  "org-tabla_asociaciones-b-squetbol-asociaci-n-regional-de-b-squetbol-del-maule-ar": {
    emails: ["arbamaule2021@gmail.com"],
    phones: ["+56 9 5748 2694"],
  },
  "org-tabla_asociaciones-tenis-asociaci-n-regional-de-tenis-del-biob-o": {
    emails: ["asociacion.tenis@gmail.com"],
    phones: ["+56 9 7335 3291"],
  },
  "org-tabla_asociaciones-tenis-asociaci-n-deportiva-regional-tenis-del-maule": {
    emails: ["deporte@estadioespanoltalca.cl"],
  },
  "org-tabla_asociaciones-rugby-asociaci-n-deportiva-regional-rugby-del-maule": {
    emails: ["institucional@chilerugby.org", "contacto@chilerugby.org"],
  },
  "org-tabla_asociaciones-rugby-asociaci-n-deportiva-regional-de-rugby-del-sur": {
    emails: ["institucional@chilerugby.org", "contacto@chilerugby.org"],
  },
  "org-registro_fdn-7864": {
    emails: ["institucional@chilerugby.org", "contacto@chilerugby.org"],
  },
  "org-registro_fdn-7871": {
    emails: ["institucional@chilerugby.org", "contacto@chilerugby.org"],
  },
  "org-registro_fdn-463": {
    emails: [
      "contactofdnkaratechile@gmail.com",
      "gerenciafdnkaratechile@gmail.com",
    ],
    website: "https://fedkaratechile.cl/",
  },
  "org-tabla_asociaciones-karate-asociaci-n-deportiva-regional-goju-ryu-seigokan-ka": {
    emails: [
      "contactofdnkaratechile@gmail.com",
      "gerenciafdnkaratechile@gmail.com",
    ],
  },
  "org-tabla_asociaciones-karate-artes-marciales-asociaci-n-deportiva-regional-de-a": {
    emails: [
      "contactofdnkaratechile@gmail.com",
      "gerenciafdnkaratechile@gmail.com",
    ],
  },
  "org-registro_fdn-627": {
    emails: ["info@fechipe.cl", "administracion@fechipe.cl"],
    website: "https://fechipe.cl/",
  },
  "org-registro_fdn-308": {
    emails: ["febachile@gmail.com", "Asociaciones.feba@gmail.com"],
  },
  "org-tabla_asociaciones-ski-monta-a-club-andino-osorno": {
    emails: ["fedeski@fedeskichile.cl"],
    website: "https://fedeskichile.cl/",
  },
};

/** Deportes acuáticos regionales → FECHIDA (federación nacional, canal oficial). */
const ACUATICOS_IDS = [
  "org-tabla_asociaciones-deportes-acu-ticos-asociaci-n-deportiva-regional-de-depor",
  "org-tabla_asociaciones-deportes-acu-ticos-asociaci-n-deportiva-regional-deportes",
  "org-tabla_asociaciones-deportes-acu-ticos-asociaci-n-deportiva-regional-sur-poni",
  "org-tabla_asociaciones-deportes-acu-ticos-asociaci-n-deportiva-regional-h2o-polo",
];

for (const id of ACUATICOS_IDS) {
  BY_ID[id] = {
    emails: ["administracion@fechida.cl", "info@fechida.cl", "presidencia@fechida.cl"],
    website: "https://fechida.cl/",
  };
}

/** Match por nombre (federaciones / asociaciones / clubes con mail conocido). */
const BY_NAME: Array<{ match: RegExp; patch: Patch }> = [
  {
    match: /^federacion de rugby de chile$/,
    patch: BY_ID["org-tabla_asociaciones-rugby-federaci-n-de-rugby-de-chile"],
  },
  {
    match: /federacion deportiva nacional de basquetbol/,
    patch:
      BY_ID[
        "org-tabla_asociaciones-b-squetbol-federaci-n-deportiva-nacional-de-b-squetbol-de"
      ],
  },
  {
    match: /federacion deportiva nacional de tenis/,
    patch:
      BY_ID[
        "org-tabla_asociaciones-tenis-federaci-n-deportiva-nacional-de-tenis-de-chile-fdn"
      ],
  },
  {
    match: /navegacion a vela/,
    patch: BY_ID["org-registro_fdn-583"],
  },
  {
    match: /basquetbol del maule|arba maule/,
    patch:
      BY_ID[
        "org-tabla_asociaciones-b-squetbol-asociaci-n-regional-de-b-squetbol-del-maule-ar"
      ],
  },
  {
    match: /tenis del biobio|tenis del bio bio/,
    patch:
      BY_ID[
        "org-tabla_asociaciones-tenis-asociaci-n-regional-de-tenis-del-biob-o"
      ],
  },
  {
    match: /tenis del maule/,
    patch:
      BY_ID[
        "org-tabla_asociaciones-tenis-asociaci-n-deportiva-regional-tenis-del-maule"
      ],
  },
  {
    match: /club de rugby los troncos/,
    patch: {
      emails: ["contacto@chilerugby.org"],
      website: "https://chile.rugby/",
    },
  },
];

/** FEHOCH clubes sin mail propio → canal federación (oficial COCH). */
const FEHOCH_FED: Patch = {
  emails: ["secretaria@fehoch.cl", "gerencia@fehoch.cl", "presidente@fehoch.cl"],
  website: "https://chilehockey.cl/",
};

/**
 * Clubes FDN sin mail público: canal de su federación nacional (COCH).
 * Solo si el nombre/sport lo permite identificar la disciplina.
 */
const CLUB_FED_FALLBACK: Array<{ match: RegExp; emails: string[] }> = [
  {
    match: /rugby/,
    emails: ["institucional@chilerugby.org", "contacto@chilerugby.org"],
  },
  {
    match: /basquet|basket/,
    emails: ["febachile@gmail.com", "Asociaciones.feba@gmail.com"],
  },
  {
    match: /tenis de mesa/,
    emails: ["info@fechiteme.cl", "secretaria@fechiteme.cl"],
  },
  {
    match: /\bbochas\b/,
    emails: ["fechibo@gmail.com"],
  },
  {
    match: /\bbmx\b|bicicross|ciclismo|ciclista|\bmtb\b/,
    emails: ["fedenacich@gmail.com", "gerente@fdnciclismochile.cl"],
  },
  {
    match: /gimnasia/,
    emails: ["fenagichi@gmail.com"],
  },
  {
    match: /\bjudo\b/,
    emails: ["presidencia@fejuchile.cl", "geoffroy@fejuchile.cl"],
  },
  {
    match: /karate|kensho|wado|dragon/,
    emails: [
      "contactofdnkaratechile@gmail.com",
      "gerenciafdnkaratechile@gmail.com",
    ],
  },
  {
    match: /futbol americano|football|bulldogs football|husares|weichafes|felinos de la florida|volcanos futbol|blindad|alianza x futbol/,
    emails: ["federacion@fdnfa.cl"],
  },
  {
    match: /ajedrez/,
    emails: ["contacto@fadech.cl"],
  },
  {
    match: /kayak|canotaje|wampu/,
    emails: ["fedcanotaje@canotajechile.cl"],
  },
  {
    match: /pelota vasca|euzko/,
    emails: ["federacion@pelotavasca.cl"],
  },
  {
    match: /atletico nacional|atletismo|tomas gonzalez|jenniffer moreno|olimpia de iquique/,
    emails: ["fedachi@fedachi.cl"],
  },
  {
    match: /\btenis\b/,
    emails: ["federacion@federaciondetenisdechile.cl"],
  },
];

function resolvePatch(
  org: (typeof sportsOrganizations)[number],
): Patch | null {
  if (org.emails?.length) return null;
  if (BY_ID[org.id]) return BY_ID[org.id];

  const n = norm(org.name);
  for (const row of BY_NAME) {
    if (row.match.test(n)) return row.patch;
  }

  if (org.source === "fehoch") return FEHOCH_FED;

  const blob = `${n} ${norm(org.sport ?? "")}`;
  for (const row of CLUB_FED_FALLBACK) {
    if (row.match.test(blob)) return { emails: row.emails };
  }

  return null;
}

function applyField(
  source: string,
  id: string,
  field: string,
  valueLit: string,
): string {
  const idEsc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `(id:\\s*"${idEsc}"[\\s\\S]*?${field}:\\s*)(?:\\[[\\s\\S]*?\\]|"(?:\\\\.|[^"\\\\])*"|true|false|null)`,
    "m",
  );
  if (!re.test(source)) {
    // insert after emails if field missing (phones/website/address optional)
    return source;
  }
  return source.replace(re, `$1${valueLit}`);
}

function main() {
  const filePath = path.join(
    process.cwd(),
    "src/lib/data/sports-organizations.ts",
  );
  let source = readFileSync(filePath, "utf8");
  let updated = 0;
  const report: string[] = [];

  for (const org of sportsOrganizations) {
    const patch = resolvePatch(org);
    if (!patch?.emails?.length) continue;

    const emailsLit = `[${patch.emails.map((e) => `"${e}"`).join(", ")}]`;
    const before = source;
    source = applyField(source, org.id, "emails", emailsLit);
    source = applyField(source, org.id, "mailingReady", "true");

    if (patch.phones?.length) {
      const phonesLit = `[${patch.phones.map((p) => `"${p}"`).join(", ")}]`;
      // only replace if phones: [] empty
      const idEsc = org.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const emptyPhones = new RegExp(
        `(id:\\s*"${idEsc}"[\\s\\S]*?phones:\\s*)\\[\\s*\\]`,
        "m",
      );
      if (emptyPhones.test(source)) {
        source = source.replace(emptyPhones, `$1${phonesLit}`);
      }
    }

    if (patch.website) {
      const idEsc = org.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // insert website if missing — look for sourceUrl line and add before if no website
      if (
        !new RegExp(`id:\\s*"${idEsc}"[\\s\\S]*?website:\\s*"`, "m").test(
          source,
        )
      ) {
        source = source.replace(
          new RegExp(
            `(id:\\s*"${idEsc}"[\\s\\S]*?sourceUrl:\\s*"(?:\\\\.|[^"\\\\])*",)`,
            "m",
          ),
          `$1\n    website: "${patch.website}",`,
        );
      }
    }

    if (source === before) {
      console.warn("Sin cambios para", org.id);
      continue;
    }
    updated++;
    report.push(`${org.name} → ${patch.emails.join(", ")}`);
  }

  writeFileSync(filePath, source, "utf8");
  console.log(
    `Actualizados: ${updated} (había ${sportsOrganizations.filter((o) => !o.emails?.length).length} sin mail)`,
  );
  for (const line of report) console.log("-", line);
}

main();
