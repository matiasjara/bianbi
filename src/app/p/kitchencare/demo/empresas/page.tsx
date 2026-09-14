import type { Metadata } from "next";
import Image from "next/image";
import { BUSINESS_SERVICES } from "@/kitchencare/lib/constants";
import { PageHero } from "@/kitchencare/components/ui/PageHero";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";
import { Button } from "@/kitchencare/components/ui/Button";

export const metadata: Metadata = {
  title: "KitchenCare Business",
  description:
    "Servicio técnico y mantención para empresas, administradores de propiedades, hoteles y restaurantes en Santiago. Un solo responsable para todos tus equipos.",
};

const CLIENTS = [
  "Administradores de propiedades",
  "Edificios residenciales y comunidades",
  "Departamentos corporativos",
  "Hoteles y hospitalidad",
  "Restaurantes y cocinas comerciales",
  "Residencias y empresas",
];

export default function EmpresasPage() {
  return (
    <>
      <PageHero
        eyebrow="Empresas"
        title="Un solo responsable para todos tus equipos."
        description="Gestión centralizada de electrodomésticos para quienes necesitan continuidad, trazabilidad y un estándar de servicio consistente."
        dark
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Servicios"
                title="Continuidad operacional para tu parque de equipos"
              />
              <ul className="mt-8 space-y-3">
                {BUSINESS_SERVICES.map((service) => (
                  <li
                    key={service}
                    className="flex items-start gap-3 text-sm text-carbon/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image
                src="/kitchencare-demo/images/campana.png"
                alt="Técnico en cocina comercial"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Para quién"
              title="Diseñado para quienes gestionan múltiples activos"
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {CLIENTS.map((client) => (
                <li
                  key={client}
                  className="rounded-xl bg-ivory px-4 py-3 text-sm text-carbon ring-1 ring-carbon/5"
                >
                  {client}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 rounded-3xl bg-black px-8 py-12 text-center text-white sm:px-12">
            <h2 className="font-serif text-2xl sm:text-3xl">
              Cotiza un plan para tu operación
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
              Cuéntanos sobre tu parque de equipos y te proponemos una
              solución a medida. Los acuerdos de nivel de servicio y condiciones
              comerciales se confirman según tu operación.
            </p>
            <div className="mt-8">
              <Button href="/p/kitchencare/demo/contacto?tipo=business" size="lg">
                Hablar con KitchenCare Business
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
