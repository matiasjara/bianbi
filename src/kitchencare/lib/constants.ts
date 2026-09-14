export const DEMO_BASE = "/p/kitchencare/demo";
export const PROPOSAL_PATH = "/p/kitchencare/propuesta-1";
export const ACCESS_PATH = "/p/kitchencare/acceso";
export const DOWNLOAD_PATH = "/api/p/kitchencare/propuesta";

export function kcPath(path = "/"): string {
  if (!path || path === "/") return DEMO_BASE;
  if (path.startsWith("http")) return path;
  return `${DEMO_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITE = {
  name: "KitchenCare",
  tagline: "Cuidado experto para tu cocina.",
  url: "https://kitchencare.cl",
  email: "hola@kitchencare.cl",
  phone: "+56 2 0000 0000",
  whatsapp: "56900000000",
  city: "Santiago de Chile",
} as const;

export const NAV_LINKS = [
  { href: kcPath("/reparacion"), label: "Reparación" },
  { href: kcPath("/mantencion"), label: "Mantención" },
  { href: kcPath("/kitchencare-plus"), label: "KitchenCare+" },
  { href: kcPath("/empresas"), label: "Empresas" },
  { href: kcPath("/como-funciona"), label: "Cómo funciona" },
  { href: kcPath("/nosotros"), label: "Nosotros" },
] as const;

export const TRUST_ITEMS = [
  "Técnicos especializados",
  "Multimarca",
  "Atención a domicilio",
  "Garantía y trazabilidad",
] as const;

export const SERVICES = [
  {
    id: "repair",
    title: "Reparación a domicilio",
    description:
      "Diagnóstico profesional, cotización previa y reparación con técnicos especializados en equipos de cocina.",
    href: kcPath("/reparacion"),
    cta: "Agendar diagnóstico",
    image: "/kitchencare-demo/images/lavavajillas.png",
    features: [
      "Técnicos especializados",
      "Atención a domicilio",
      "Diagnóstico profesional",
      "Cotización previa",
      "Garantía documentada",
    ],
  },
  {
    id: "maintenance",
    title: "Mantención preventiva",
    description:
      "Revisamos tus equipos antes de que fallen, ayudando a extender su vida útil y detectar problemas tempranamente.",
    href: kcPath("/mantencion"),
    cta: "Quiero mantener mis equipos",
    image: "/kitchencare-demo/images/horno.png",
    features: [
      "Revisión multipunto",
      "Limpieza técnica",
      "Detección temprana",
      "Recomendaciones personalizadas",
    ],
  },
  {
    id: "plus",
    title: "KitchenCare+",
    subtitle: "Membresía",
    description:
      "Nosotros nos preocupamos antes de que tengas que preocuparte tú. Cuidado continuo para tu cocina.",
    href: kcPath("/kitchencare-plus"),
    cta: "Conocer KitchenCare+",
    image: "/kitchencare-demo/images/chat.png",
    features: [
      "Chequeo anual de cocina",
      "Diagnóstico remoto",
      "Atención prioritaria",
      "Historial digital",
    ],
  },
  {
    id: "business",
    title: "KitchenCare Business",
    description:
      "Un solo responsable para todos tus equipos. Gestión centralizada para administradores de propiedades, hoteles y restaurantes.",
    href: kcPath("/empresas"),
    cta: "Hablar con KitchenCare Business",
    image: "/kitchencare-demo/images/campana.png",
    features: [
      "Gestión del parque",
      "Mantención programada",
      "Historial por activo",
      "Reportes y trazabilidad",
    ],
  },
] as const;

export const STANDARDS = [
  {
    number: "01",
    title: "Sabes quién va",
    description: "Te presentamos al técnico antes de la visita.",
  },
  {
    number: "02",
    title: "Llegamos preparados",
    description: "Revisamos tu equipo y los síntomas antes de ir.",
  },
  {
    number: "03",
    title: "Diagnosticamos primero",
    description: "No cambiamos piezas por probar.",
  },
  {
    number: "04",
    title: "Precio antes de reparar",
    description: "Tú apruebas el trabajo antes de comenzar.",
  },
  {
    number: "05",
    title: "Dejamos evidencia",
    description: "Diagnóstico, trabajo y repuestos quedan registrados.",
  },
  {
    number: "06",
    title: "Respondemos después",
    description: "Cada reparación tiene garantía y seguimiento.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Cuéntanos qué ocurre",
    description: "Describe el problema o el equipo que quieres revisar.",
  },
  {
    step: 2,
    title: "Identificamos tu equipo",
    description: "Marca, modelo y síntomas para preparar la visita.",
  },
  {
    step: 3,
    title: "Agenda tu visita",
    description: "Elige comuna, dirección y disponibilidad.",
  },
  {
    step: 4,
    title: "Tu técnico llega preparado",
    description: "Con diagnóstico previo y las herramientas necesarias.",
  },
  {
    step: 5,
    title: "Diagnóstico y aprobación",
    description: "Primero diagnosticamos. Después tú decides.",
  },
  {
    step: 6,
    title: "Reparación + historial + garantía",
    description: "Todo queda registrado para futuras intervenciones.",
  },
] as const;

export const REPAIR_CATEGORIES = [
  "Refrigeradores",
  "Lavavajillas",
  "Hornos",
  "Campanas",
] as const;

export const HEALTH_CHECK_ITEMS = [
  "Revisión multipunto",
  "Limpieza técnica",
  "Desgaste y sellos",
  "Temperaturas y drenajes",
  "Filtros y conexiones",
  "Recomendaciones personalizadas",
] as const;

export const PLUS_BENEFITS = [
  "Equipos registrados en tu hogar",
  "Chequeo integral anual de cocina",
  "Diagnóstico remoto",
  "Atención prioritaria",
  "Historial digital",
  "Recordatorios de mantención",
  "Precios preferentes en mano de obra",
  "Beneficios en repuestos",
  "Garantía superior en reparaciones KitchenCare",
] as const;

export const BUSINESS_SERVICES = [
  "Gestión del parque de equipos",
  "Mantención programada",
  "Reparaciones con atención prioritaria",
  "Historial por activo",
  "Reportes y trazabilidad",
  "Recomendación reparar vs. reemplazar",
  "Gestión centralizada",
] as const;

export const EQUIPMENT_TYPES = [
  "Refrigerador",
  "Lavavajillas",
  "Horno",
  "Campana",
  "Encimera",
  "Microondas",
  "Otro equipo de cocina",
] as const;

export const COMUNAS = [
  "Las Condes",
  "Providencia",
  "Vitacura",
  "Lo Barnechea",
  "Ñuñoa",
  "La Reina",
  "Peñalolén",
  "Macul",
  "Santiago Centro",
  "Maipú",
  "La Florida",
  "Puente Alto",
  "Otra comuna de Santiago",
] as const;
