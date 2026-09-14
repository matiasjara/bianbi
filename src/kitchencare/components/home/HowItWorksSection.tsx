import { HOW_IT_WORKS } from "@/kitchencare/lib/constants";
import { Button } from "@/kitchencare/components/ui/Button";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";

export function HowItWorksSection() {
  return (
    <section className="bg-black py-20 text-white lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Cómo funciona"
          title="Cuéntanos qué ocurre. Nosotros nos encargamos del resto."
          dark
          className="mb-12"
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <li
              key={item.step}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-sm font-semibold">
                {item.step}
              </span>
              <h3 className="mt-4 font-serif text-xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {item.description}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/p/kitchencare/demo/como-funciona" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Ver el proceso completo
          </Button>
          <Button href="/p/kitchencare/demo/agendar">Agendar diagnóstico</Button>
        </div>
      </Container>
    </section>
  );
}
