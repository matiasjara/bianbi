import { SectionTitle } from "@/components/ui";
import { OutreachDatabase } from "@/components/sports/SportsOrgDatabase";
import {
  outreachOrganizations,
  outreachSources,
} from "@/lib/data/outreach";

export const metadata = { title: "Base de datos" };

export default function BaseDatosPage() {
  return (
    <div>
      <SectionTitle
        title="Base de datos"
        subtitle="Contactos con gente afiliada (clubes, federaciones, asociaciones) a quienes enviar campañas. No ticketeras, productoras ni agencias estatales: el objetivo es llegar a posibles arrendatarios."
      />

      <OutreachDatabase
        organizations={outreachOrganizations}
        sources={outreachSources}
      />
    </div>
  );
}
