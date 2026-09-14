import type { Metadata } from "next";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";
import { Button } from "@/kitchencare/components/ui/Button";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "KitchenCare: cuidado experto para tu cocina. Una compañía chilena que transforma la experiencia de servicio técnico en cuidado continuo de electrodomésticos.",
};

const VALUES = [
  {
    title: "Confianza",
    description:
      "Procesos transparentes, precio antes de reparar y evidencia de cada intervención.",
  },
  {
    title: "Conocimiento técnico",
    description:
      "Técnicos especializados con experiencia bajo estándares exigentes de postventa.",
  },
  {
    title: "Proximidad",
    description:
      "Cercanos y profesionales. Te presentamos al técnico antes de la visita.",
  },
  {
    title: "Innovación",
    description:
      "Tecnología invisible que prepara mejor cada visita y mejora la resolución.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="KitchenCare se encarga de tu cocina."
        description="Nacimos desde una cultura operacional de alto estándar en servicio técnico y postventa. Hoy llevamos ese conocimiento a una propuesta multimarca creada para el cliente."
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Nuestra tesis"
              title="Del servicio de reparación al cuidado continuo de tus equipos"
              description="No somos otro servicio técnico multimarca genérico. Somos una compañía profesional que se hace cargo de los equipos de tu cocina durante todo su ciclo de vida."
              align="center"
            />
            <p className="mt-8 text-center text-sm leading-relaxed text-carbon/60">
              Reparamos, mantenemos y cuidamos. Vendemos tranquilidad,
              continuidad y confianza — no solo reparaciones puntuales.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Valores"
            title="Lo que nos guía"
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl bg-ivory p-8 ring-1 ring-carbon/5"
              >
                <h3 className="font-serif text-xl text-carbon">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-carbon/70">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="rounded-3xl bg-black px-8 py-12 text-center text-white sm:px-12">
            <h2 className="font-serif text-2xl sm:text-3xl">
              Más cocina. Menos preocupaciones.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
              Estamos construyendo una nueva forma de recibir servicio
              técnico en Chile. Únete desde el inicio.
            </p>
            <div className="mt-8">
              <Button href="/p/kitchencare/demo/agendar">Agendar diagnóstico</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
