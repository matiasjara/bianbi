import { Button } from "@/kitchencare/components/ui/Button";
import { Container } from "@/kitchencare/components/ui/Container";

export function CtaSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="rounded-3xl bg-white px-8 py-12 text-center shadow-sm ring-1 ring-carbon/5 sm:px-12 sm:py-16">
          <h2 className="font-serif text-3xl text-carbon sm:text-4xl">
            ¿Algo no está funcionando como debería?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-carbon/70">
            Cuéntanos qué ocurre. Nosotros nos encargamos del resto.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/p/kitchencare/demo/agendar" size="lg">
              Agendar diagnóstico
            </Button>
            <Button href="/p/kitchencare/demo/contacto" variant="outline" size="lg">
              Hablar con un especialista
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
