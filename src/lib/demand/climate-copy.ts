import type { Locale } from "@/lib/i18n/locale";
import type { CampaignInterest } from "./types";

export type ClimateCopy = { summary: string; tip: string };

type Season = "summer" | "fall" | "winter" | "spring";

function seasonFrom(isoDate: string): Season {
  const m = Number(isoDate.slice(5, 7));
  if (m >= 12 || m <= 2) return "summer";
  if (m >= 3 && m <= 5) return "fall";
  if (m >= 6 && m <= 8) return "winter";
  return "spring";
}

function eventKind(interest: CampaignInterest) {
  if (interest === "concierto") return "concierto" as const;
  if (interest === "partido_futbol") return "partido" as const;
  if (interest === "deporte_competencia") return "deporte" as const;
  if (interest === "nieve") return "nieve" as const;
  return "evento" as const;
}

export function climateForCampaign(
  isoDate: string,
  interest: CampaignInterest,
  locale: Locale = "es",
): ClimateCopy {
  const season = seasonFrom(isoDate);
  const kind = eventKind(interest);

  if (locale === "en") {
    if (season === "summer") {
      return {
        summary: "Summer in Santiago: hot days and mild nights.",
        tip:
          kind === "nieve"
            ? "Light clothes in the city; pack warm layers for the mountains."
            : "Pack light clothes plus a layer for the night after the venue.",
      };
    }
    if (season === "fall") {
      return {
        summary: "Fall: pleasant temperatures, cooler evenings possible.",
        tip: "A light jacket is enough for the way back.",
      };
    }
    if (season === "winter") {
      if (kind === "nieve") {
        return {
          summary: "Winter: cold mornings; mountains may have snow.",
          tip: "Coat and closed shoes. For snow trips, Santiago is a comfortable base.",
        };
      }
      return {
        summary: "Winter in Santiago: cold mornings and cooler nights.",
        tip:
          kind === "deporte"
            ? "Layer up for early outdoor sessions; closed shoes help on cold mornings."
            : kind === "partido"
              ? "Coat and closed shoes; it can feel chilly after the match at night."
              : "Coat and a light layer for the walk back after the event.",
      };
    }
    return {
      summary: "Spring: changeable, great for walking.",
      tip: "Ideal to combine the event with a neighborhood stroll or metro rides.",
    };
  }

  if (locale === "pt") {
    if (season === "summer") {
      return {
        summary: "Verão em Santiago: dias quentes e noites amenas.",
        tip:
          kind === "nieve"
            ? "Roupa leve na cidade; leve camadas quentes para a cordilheira."
            : "Leve roupa leve e uma camada para a noite ao sair do venue.",
      };
    }
    if (season === "fall") {
      return {
        summary: "Outono: temperaturas agradáveis, tardes mais frescas.",
        tip: "Uma jaqueta leve basta para o caminho de volta.",
      };
    }
    if (season === "winter") {
      if (kind === "nieve") {
        return {
          summary: "Inverno: manhãs frias; na cordilheira pode nevar.",
          tip: "Casaco e calçado fechado. Para neve, Santiago é sua base confortável.",
        };
      }
      return {
        summary: "Inverno em Santiago: manhãs frias e noites mais frescas.",
        tip:
          kind === "deporte"
            ? "Vá em camadas para provas ao ar livre cedo; calçado fechado ajuda."
            : kind === "partido"
              ? "Casaco e calçado fechado; depois do jogo pode esfriar à noite."
              : "Casaco e uma camada leve para a volta do evento.",
      };
    }
    return {
      summary: "Primavera: clima variável, ótimo para caminhar.",
      tip: "Ideal para combinar o evento com o bairro a pé ou de metrô.",
    };
  }

  // es
  if (season === "summer") {
    return {
      summary: "Verano en Santiago: días calurosos y noches templadas.",
      tip:
        kind === "nieve"
          ? "Ropa fresca en la ciudad; lleva abrigo para la cordillera."
          : "Lleva ropa fresca y una capa liviana para la noche al salir del venue.",
    };
  }
  if (season === "fall") {
    return {
      summary: "Otoño: temperaturas agradables, posibles tardes frescas.",
      tip: "Una chaqueta liviana alcanza para el trayecto de vuelta.",
    };
  }
  if (season === "winter") {
    if (kind === "nieve") {
      return {
        summary: "Invierno: mañanas frías; en cordillera puede haber nieve.",
        tip: "Abrigo y calzado cerrado. Si vienes por nieve, Santiago es tu base cómoda.",
      };
    }
    return {
      summary: "Invierno en Santiago: mañanas frías y noches más frescas.",
      tip:
        kind === "deporte"
          ? "Mañanas frías en canchas al aire libre: capas y calzado cerrado."
          : kind === "partido"
            ? "Abrigo y calzado cerrado; después del partido puede refrescar de noche."
            : kind === "concierto"
              ? "Abrigo y capa liviana para la noche al salir del venue."
              : "Chaqueta liviana para la vuelta del evento.",
    };
  }
  return {
    summary: "Primavera: clima variable, agradable para caminar.",
    tip: "Ideal para combinar evento + barrio a pie o en metro.",
  };
}
