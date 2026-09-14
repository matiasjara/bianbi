import type { Metadata } from "next";
import { PLUS_BENEFITS } from "@/kitchencare/lib/constants";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";
import { Button } from "@/kitchencare/components/ui/Button";
import { PlusSection } from "@/kitchencare/components/home/PlusSection";
import { CtaSection } from "@/kitchencare/components/home/CtaSection";

export const metadata: Metadata = {
  title: "KitchenCare+",
  description:
    "Membresía KitchenCare+ para el cuidado continuo de los electrodomésticos de tu cocina. Chequeo anual, historial digital y atención prioritaria.",
};

export default function KitchenCarePlusPage() {
  return (
    <>
      <PageHero
        eyebrow="Membresía"
        title="Tu cocina tiene memoria."
        description="Nosotros nos preocupamos antes de que tengas que preocuparte tú. KitchenCare+ no es un seguro ni una garantía extendida: es cuidado continuo para tu cocina."
        dark
      />

      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Beneficios"
            title="Tranquilidad, continuidad y confianza"
            description="KitchenCare+ está diseñada para convertir cada reparación en el inicio de una relación permanente con tu cocina."
            className="mb-10"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLUS_BENEFITS.map((benefit) => (
              <article
                key={benefit}
                className="rounded-2xl bg-white p-6 ring-1 ring-carbon/5"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-terracotta" />
                <p className="mt-3 text-sm leading-relaxed text-carbon/80">
                  {benefit}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-carbon/15 bg-ivory/50 p-6 text-center">
            <p className="text-sm text-carbon/60">
              El precio de la membresía está en definición. Te avisaremos
              cuando KitchenCare+ esté disponible para nuevos miembros.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Button href="/p/kitchencare/demo/contacto" size="lg">
              Quiero ser avisado
            </Button>
          </div>
        </Container>
      </section>

      <PlusSection />
      <CtaSection />
    </>
  );
}
