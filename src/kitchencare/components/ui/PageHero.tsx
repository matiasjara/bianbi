import { Container } from "@/kitchencare/components/ui/Container";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
}

export function PageHero({
  eyebrow,
  title,
  description,
  dark = false,
}: PageHeroProps) {
  return (
    <section
      className={
        dark
          ? "bg-black py-16 text-white sm:py-20"
          : "border-b border-carbon/5 bg-white py-16 sm:py-20"
      }
    >
      <Container>
        <div className="max-w-3xl">
          {eyebrow && (
            <p
              className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-sage" : "text-sage-dark"}`}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className={`font-serif text-4xl leading-tight sm:text-5xl ${dark ? "text-white" : "text-carbon"}`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-white/75" : "text-carbon/70"}`}
            >
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
