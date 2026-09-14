import Image from "next/image";
import { TRUST_ITEMS } from "@/kitchencare/lib/constants";
import { Button } from "@/kitchencare/components/ui/Button";
import { Container } from "@/kitchencare/components/ui/Container";

const TRUST_ICONS = [
  <svg key="shield" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>,
  <svg key="gear" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>,
  <svg key="home" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>,
  <svg key="leaf" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>,
];

export function Hero() {
  return (
    <section className="overflow-hidden bg-black">
      <div className="grid lg:min-h-[calc(100vh-4.5rem)] lg:grid-cols-[1fr_1.1fr]">
        {/* Panel izquierdo — negro sólido, sin overlay */}
        <Container className="flex flex-col justify-between py-10 sm:py-14 lg:py-16">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-white/50">
            Cuidado experto para tu cocina
          </p>

          <div className="my-auto max-w-xl py-10 lg:py-12">
            <div className="mb-8 h-px w-14 bg-white/25" aria-hidden="true" />
            <h1 className="font-serif text-4xl italic leading-[1.12] text-white sm:text-5xl lg:text-[3.25rem]">
              Tu cocina, siempre funcionando.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/55 sm:text-lg">
              Reparamos, mantenemos y cuidamos tus electrodomésticos con técnicos
              especializados y una experiencia de servicio superior.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/p/kitchencare/demo/agendar" size="lg">
                Agendar diagnóstico
                <span aria-hidden="true">→</span>
              </Button>
              <Button
                href="/p/kitchencare/demo/kitchencare-plus"
                variant="outline"
                size="lg"
                className="border-white/25 text-white hover:border-white/40 hover:bg-white/10"
              >
                Conocer KitchenCare+
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
              {TRUST_ITEMS.map((item, i) => (
                <div key={item} className="flex flex-col items-start gap-2">
                  <div className="text-white/70">{TRUST_ICONS[i]}</div>
                  <p className="text-[0.6rem] font-medium uppercase leading-snug tracking-wide text-white/45">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white/35">
            <span>Reparamos.</span>
            <span>Mantenemos.</span>
            <span>Cuidamos.</span>
          </div>
        </Container>

        {/* Imagen derecha — limpia, sin wash gris */}
        <div className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-full">
          <Image
            src="/kitchencare-demo/images/horno.png"
            alt="Cocina contemporánea con electrodomésticos premium"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-black to-transparent lg:block xl:w-32"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
