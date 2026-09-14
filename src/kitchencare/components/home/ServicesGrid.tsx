import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/kitchencare/lib/constants";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";

export function ServicesGrid() {
  return (
    <section id="servicios" className="bg-ivory py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Servicios"
          title="Reparamos. Mantenemos. Cuidamos."
          description="Cuatro formas de cuidar tu cocina, desde la reparación puntual hasta la relación continua."
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-carbon/5 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                {"subtitle" in service && service.subtitle && (
                  <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sage-dark">
                    {service.subtitle}
                  </p>
                )}
                <h3 className="font-serif text-xl text-carbon">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-carbon/65">
                  {service.description}
                </p>
                <div className="my-4 h-px w-8 bg-terracotta" aria-hidden="true" />
                <ul className="space-y-2">
                  {service.features.slice(0, 4).map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs leading-relaxed text-carbon/75"
                    >
                      <svg
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terracotta"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={service.href}
                  className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-terracotta transition-colors hover:text-terracotta-hover"
                >
                  {service.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
