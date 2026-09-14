import { TRUST_ITEMS } from "@/kitchencare/lib/constants";
import { Container } from "@/kitchencare/components/ui/Container";

export function TrustStrip() {
  return (
    <section
      aria-label="Diferenciadores de servicio"
      className="border-y border-white/10 bg-black"
    >
      <Container className="py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white/50">
          {TRUST_ITEMS.map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              {i > 0 && (
                <span className="hidden text-white/20 sm:inline" aria-hidden="true">
                  ·
                </span>
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
