import { STANDARDS } from "@/kitchencare/lib/constants";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";

export function StandardSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="El Estándar KitchenCare"
          title="Primero diagnosticamos. Después tú decides."
          description="Seis principios que guían cada visita y cada interacción con tu cocina."
          className="mb-12"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STANDARDS.map((standard) => (
            <article
              key={standard.number}
              className="rounded-2xl bg-white p-6 ring-1 ring-carbon/5 transition-shadow hover:shadow-md sm:p-8"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
                {standard.number}
              </span>
              <h3 className="mt-3 font-serif text-xl text-carbon">
                {standard.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-carbon/70">
                {standard.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
