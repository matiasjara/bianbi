import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";

export function ProblemSection() {
  return (
    <section className="bg-black py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Por qué KitchenCare"
            title="Cuando algo falla, no deberías tener que dudar"
            description="Cuando algo falla, no deberías tener que preguntarte si el técnico llegará, si el diagnóstico será correcto o cuánto terminarás pagando."
            dark
          />
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:p-10">
            <p className="font-serif text-2xl italic leading-snug text-white sm:text-3xl">
              KitchenCare transforma el servicio técnico en una experiencia
              profesional, transparente y fácil.
            </p>
            <p className="mt-6 text-base leading-relaxed text-white/55">
              Reparamos. Mantenemos. Cuidamos. Con procesos claros, técnicos
              especializados y una relación que continúa después de cada visita.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
