import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";

export function ExpertiseSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Nuestro origen"
            title="Experiencia real, estándar superior"
            description="Nuestro equipo reúne años de experiencia trabajando bajo exigentes estándares de servicio técnico y postventa. Hoy llevamos ese conocimiento a una propuesta multimarca creada para el cliente."
            align="center"
          />
          <p className="mt-8 text-sm leading-relaxed text-carbon/60">
            La capacidad técnica es central. La tecnología no reemplaza la
            operación: la industrializa para que el técnico llegue mejor
            preparado y resuelva más problemas en la primera visita.
          </p>
        </div>
      </Container>
    </section>
  );
}
