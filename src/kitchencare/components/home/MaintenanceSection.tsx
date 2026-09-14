import Image from "next/image";
import { HEALTH_CHECK_ITEMS } from "@/kitchencare/lib/constants";
import { Button } from "@/kitchencare/components/ui/Button";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";

export function MaintenanceSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/kitchencare-demo/images/horno.png"
              alt="Técnico revisando un horno empotrado"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Mantención preventiva"
              title="Cuidarlos cuesta menos que reemplazarlos."
              description="Chequeo integral de cocina: una visita para revisar múltiples equipos y detectar problemas antes de que fallen."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {HEALTH_CHECK_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-carbon/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-dark" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/p/kitchencare/demo/mantencion" variant="secondary">
                Quiero mantener mis equipos
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
