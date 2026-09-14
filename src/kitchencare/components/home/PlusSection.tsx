import { PLUS_BENEFITS } from "@/kitchencare/lib/constants";
import { Button } from "@/kitchencare/components/ui/Button";
import { Container } from "@/kitchencare/components/ui/Container";
import { SectionHeading } from "@/kitchencare/components/ui/SectionHeading";

const MOCK_EQUIPMENT = [
  { name: "Refrigerador Samsung", status: "Excelente", color: "bg-sage" },
  { name: "Lavavajillas Bosch", status: "Bueno", color: "bg-sage/70" },
  { name: "Horno Miele", status: "Requiere atención", color: "bg-terracotta" },
];

export function PlusSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="KitchenCare+"
              title="Tu cocina tiene memoria."
              description="Nosotros nos preocupamos antes de que tengas que preocuparte tú. Registra tus equipos, recibe recordatorios y accede a atención prioritaria."
            />
            <ul className="mt-8 space-y-3">
              {PLUS_BENEFITS.slice(0, 6).map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-sm text-carbon/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                  {benefit}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-carbon/50">
              Precio de membresía en definición. Te avisaremos cuando esté
              disponible.
            </p>
            <div className="mt-8">
              <Button href="/p/kitchencare/demo/kitchencare-plus">
                Conocer KitchenCare+
                <span aria-hidden="true">→</span>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-[2rem] bg-black p-3 shadow-2xl ring-1 ring-black/10">
              <div className="overflow-hidden rounded-[1.5rem] bg-ivory">
                <div className="border-b border-carbon/10 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-dark">
                    Mis equipos
                  </p>
                  <p className="mt-1 font-serif text-xl text-carbon">
                    Identidad KitchenCare
                  </p>
                </div>
                <div className="space-y-3 p-4">
                  {MOCK_EQUIPMENT.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-xl bg-white p-4 ring-1 ring-carbon/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-carbon">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-carbon/50">
                            Estado del equipo
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-white ${item.color}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-carbon/10 px-5 py-4">
                  <p className="text-center text-xs text-carbon/45">
                    Vista previa · Plataforma en desarrollo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
