import Image from "next/image";
import { BUSINESS_SERVICES } from "@/kitchencare/lib/constants";
import { Button } from "@/kitchencare/components/ui/Button";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";

export function BusinessSection() {
  return (
    <section className="bg-black py-20 text-white lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="KitchenCare Business"
              title="Un solo responsable para todos tus equipos."
              description="Para administradores de propiedades, edificios residenciales, departamentos corporativos, hoteles, restaurantes y residencias."
              dark
            />
            <ul className="mt-8 space-y-3">
              {BUSINESS_SERVICES.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-3 text-sm text-white/75"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                  {service}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/p/kitchencare/demo/empresas">
                Hablar con KitchenCare Business
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/kitchencare-demo/images/campana.png"
              alt="Técnico KitchenCare en cocina profesional"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
