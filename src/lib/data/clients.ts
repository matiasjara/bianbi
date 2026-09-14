import type { Client } from "@/lib/types";
import {
  DEMO_BASE,
  DOWNLOAD_PATH,
  PROPOSAL_PATH,
} from "@/kitchencare/lib/constants";

const clients: Client[] = [
  {
    id: "cli-performance-rfc",
    slug: "performance-rfc",
    name: "Performance RFC",
    status: "active",
    contacts: [],
    notes: [],
    links: [],
    assets: [],
    work: [],
  },
  {
    id: "cli-kitchencare",
    slug: "kitchencare",
    name: "KitchenCare",
    status: "active",
    industry: "Servicio técnico de cocina",
    summary:
      "Nueva marca de servicio técnico multimarca. Proyecto inicial: marca + ecosistema digital + lanzamiento.",
    contacts: [],
    notes: [],
    links: [
      {
        id: "kc-link-proposal",
        label: "Propuesta comercial #1 (web)",
        url: PROPOSAL_PATH,
      },
      {
        id: "kc-link-demo",
        label: "Demo del sitio",
        url: DEMO_BASE,
      },
    ],
    assets: [
      {
        id: "kc-asset-proposal-docx",
        title: "Propuesta extendida (Word)",
        description: "Documento completo · v2",
        href: DOWNLOAD_PATH,
      },
    ],
    work: [
      {
        id: "kc-work-propuesta-1",
        title: "Propuesta comercial #1",
        kind: "entrega",
        status: "lista para enviar",
        notes:
          "Marca + ecosistema digital + lanzamiento inicial · 45 UF · 4–6 semanas.",
        href: PROPOSAL_PATH,
      },
    ],
    proposals: [
      {
        id: "kc-propuesta-1",
        number: 1,
        title: "Propuesta comercial #1",
        status: "lista para enviar",
        summary:
          "Creación de marca, sitio, presencia digital y primera campaña experimental con IA. 45 UF.",
        webHref: PROPOSAL_PATH,
        demoHref: DEMO_BASE,
        downloadHref: DOWNLOAD_PATH,
      },
    ],
  },
];

export function getClients(): Client[] {
  return clients;
}

export function getClientBySlug(slug: string): Client | undefined {
  return clients.find((client) => client.slug === slug);
}

export function getClientSlugs(): string[] {
  return clients.map((client) => client.slug);
}

export function clientRecordCounts(client: Client) {
  return {
    contacts: client.contacts.length,
    notes: client.notes.length,
    links: client.links.length,
    assets: client.assets.length,
    work: client.work.length,
    proposals: client.proposals?.length ?? 0,
  };
}
