import type { Metadata } from "next";
import { REPAIR_CATEGORIES, STANDARDS } from "@/kitchencare/lib/constants";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";
import { Button } from "@/kitchencare/components/ui/Button";
import { CtaSection } from "@/kitchencare/components/home/CtaSection";

export const metadata: Metadata = {
  title: "Reparación a domicilio",
  description:
    "Reparación de electrodomésticos de cocina a domicilio en Santiago. Diagnóstico profesional, cotización previa y garantía documentada.",
};

const BENEFITS = [
  "Técnicos especializados en equipos de cocina",
  "Atención a domicilio en Santiago",
  "Diagnóstico profesional antes de reparar",
  "Cotización previa — tú apruebas antes de comenzar",
  "Repuestos originales o alternativas técnicamente apropiadas",
  "Garantía documentada en cada intervención",
  "Historial y seguimiento post-reparación",
];

export default function ReparacionPage() {
  return (
    <>
      <PageHero
        eyebrow="Reparación"
        title="Reparación a domicilio"
        description="Diagnóstico profesional, cotización previa y reparación con técnicos especializados. Primero diagnosticamos. Después tú decides."
        dark
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Categorías"
                title="Equipos de cocina que atendemos"
                description="Nos especializamos en los electrodomésticos centrales de tu cocina. Otras categorías se incorporan cuando la capacidad operacional esté confirmada."
              />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {REPAIR_CATEGORIES.map((cat) => (
                  <li
                    key={cat}
                    className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-carbon ring-1 ring-carbon/5"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading
                eyebrow="Beneficios"
                title="Un estándar superior en cada visita"
              />
              <ul className="mt-8 space-y-3">
                {BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-sm text-carbon/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/p/kitchencare/demo/agendar" size="lg">
                  Agendar diagnóstico
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="El Estándar KitchenCare"
            title="Primero diagnosticamos. Después tú decides."
            className="mb-10"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARDS.map((s) => (
              <article
                key={s.number}
                className="rounded-2xl bg-ivory p-6 ring-1 ring-carbon/5"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                  {s.number}
                </span>
                <h3 className="mt-2 font-serif text-lg">{s.title}</h3>
                <p className="mt-1 text-sm text-carbon/70">{s.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
