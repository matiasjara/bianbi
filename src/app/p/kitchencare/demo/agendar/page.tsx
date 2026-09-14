import type { Metadata } from "next";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";
import { BookingWizard } from "@/kitchencare/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Agendar servicio",
  description:
    "Agenda un diagnóstico a domicilio con KitchenCare. Cuéntanos qué ocurre y nosotros nos encargamos del resto.",
};

export default function AgendarPage() {
  return (
    <>
      <PageHero
        eyebrow="Agendar"
        title="Cuéntanos qué está pasando."
        description="Completa estos pasos y te contactaremos para confirmar tu visita. Nosotros nos encargamos del resto."
      />

      <section className="pb-20 pt-4 lg:pb-28">
        <Container className="max-w-2xl">
          <BookingWizard />
        </Container>
      </section>
    </>
  );
}
