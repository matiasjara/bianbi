import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/lib/site/indexing";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  robots: PRIVATE_ROBOTS,
};

export default function TerminosPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Términos y condiciones"
        description="Documento en preparación. Los términos definitivos se publicarán antes del lanzamiento comercial."
      />
      <section className="pb-20 pt-4">
        <Container className="max-w-3xl">
          <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-carbon/70">
            <p>
              KitchenCare está preparando sus términos y condiciones de
              servicio. Este documento regulará el uso del sitio web, la
              contratación de servicios de reparación, mantención y
              membresía, así como las condiciones de garantía y
              seguimiento post-servicio.
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
