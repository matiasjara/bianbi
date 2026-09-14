import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/lib/site/indexing";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";

export const metadata: Metadata = {
  title: "Política de privacidad",
  robots: PRIVATE_ROBOTS,
};

export default function PrivacidadPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Política de privacidad"
        description="Documento en preparación. Tu privacidad es importante para nosotros."
      />
      <section className="pb-20 pt-4">
        <Container className="max-w-3xl">
          <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-carbon/70">
            <p>
              KitchenCare está preparando su política de privacidad conforme
              a la legislación chilena. Este documento describirá cómo
              recopilamos, usamos y protegemos tus datos personales cuando
              utilizas nuestro sitio web, solicitas servicios o te comunicas
              con nosotros.
            </p>
            <p className="mt-4">
              Los datos que nos entregues a través de formularios de
              agendamiento o contacto se utilizarán exclusivamente para
              gestionar tu solicitud de servicio y mejorar tu experiencia con
              KitchenCare.
            </p>
            <p className="mt-4">
              Para consultas, escríbenos a{" "}
              <a href="mailto:hola@kitchencare.cl" className="text-terracotta hover:underline">
                hola@kitchencare.cl
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
