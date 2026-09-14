import type { Metadata } from "next";
import { HOW_IT_WORKS, STANDARDS } from "@/kitchencare/lib/constants";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";
import { Button } from "@/kitchencare/components/ui/Button";
import { CtaSection } from "@/kitchencare/components/home/CtaSection";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Así funciona KitchenCare: cuéntanos qué ocurre, agenda tu visita y recibe un servicio transparente con diagnóstico previo y garantía documentada.",
};

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHero
        eyebrow="Proceso"
        title="Cuéntanos qué ocurre. Nosotros nos encargamos del resto."
        description="Un proceso diseñado para darte tranquilidad desde el primer contacto hasta el seguimiento post-reparación."
      />

      <section className="py-16 lg:py-24">
        <Container>
          <ol className="relative space-y-0">
            {HOW_IT_WORKS.map((item, i) => (
              <li key={item.step} className="relative flex gap-6 pb-12 last:pb-0">
                {i < HOW_IT_WORKS.length - 1 && (
                  <span
                    className="absolute left-5 top-12 h-full w-px bg-carbon/10"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm font-semibold text-white">
                  {item.step}
                </span>
                <div className="pt-1">
                  <h2 className="font-serif text-xl text-carbon sm:text-2xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-carbon/70">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button href="/p/kitchencare/demo/agendar" size="lg">
              Agendar diagnóstico
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="El Estándar KitchenCare"
            title="Seis principios en cada visita"
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
