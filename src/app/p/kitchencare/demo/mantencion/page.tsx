import type { Metadata } from "next";
import Image from "next/image";
import { HEALTH_CHECK_ITEMS } from "@/kitchencare/lib/constants";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";
import { Button } from "@/kitchencare/components/ui/Button";
import { CtaSection } from "@/kitchencare/components/home/CtaSection";

export const metadata: Metadata = {
  title: "Mantención preventiva",
  description:
    "Mantención preventiva de electrodomésticos de cocina en Santiago. Chequeo integral para revisar múltiples equipos antes de que fallen.",
};

export default function MantencionPage() {
  return (
    <>
      <PageHero
        eyebrow="Mantención"
        title="Cuidarlos cuesta menos que reemplazarlos."
        description="Revisamos tus equipos antes de que fallen, ayudando a extender su vida útil y detectar problemas tempranamente."
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/kitchencare-demo/images/horno.png"
                alt="Técnico realizando mantención en horno"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <SectionHeading
                eyebrow="Chequeo integral de cocina"
                title="Una visita para revisar múltiples equipos"
                description="El chequeo integral de cocina es una visita programada para revisar varios electrodomésticos en una sola sesión."
              />
              <ul className="mt-8 space-y-3">
                {HEALTH_CHECK_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-carbon/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-dark" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/p/kitchencare/demo/agendar" size="lg">
                  Quiero mantener mis equipos
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Prevención"
              title="Más cocina. Menos preocupaciones."
              description="La mantención preventiva puede ser un servicio individual o formar parte de KitchenCare+ y KitchenCare Business. Te ayudamos a elegir la opción que mejor se adapte a tu hogar."
              align="center"
            />
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/p/kitchencare/demo/kitchencare-plus" variant="outline">
                Conocer KitchenCare+
              </Button>
              <Button href="/p/kitchencare/demo/empresas" variant="ghost">
                Ver opciones para empresas
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
