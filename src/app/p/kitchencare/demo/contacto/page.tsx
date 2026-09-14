import type { Metadata } from "next";
import { SITE } from "@/kitchencare/lib/constants";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";
import { ContactForm } from "@/kitchencare/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para consultas, KitchenCare Business o información sobre KitchenCare+.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Hablemos"
        description="Escríbenos para consultas generales, planes empresariales o para enterarte cuando KitchenCare+ esté disponible."
      />

      <section className="pb-20 pt-4 lg:pb-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
                  Correo electrónico
                </h2>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-2 block text-carbon hover:text-terracotta"
                >
                  {SITE.email}
                </a>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
                  WhatsApp
                </h2>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-carbon hover:text-terracotta"
                >
                  Escríbenos por WhatsApp
                </a>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-sage-dark">
                  Cobertura
                </h2>
                <p className="mt-2 text-carbon/70">{SITE.city}</p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
