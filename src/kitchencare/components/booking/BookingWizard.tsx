"use client";

import { useState } from "react";
import { COMUNAS, DEMO_BASE, EQUIPMENT_TYPES } from "@/kitchencare/lib/constants";
import { Button } from "@/kitchencare/components/ui/Button";
import { cn } from "@/kitchencare/lib/utils";

interface FormData {
  equipment: string;
  brand: string;
  model: string;
  problem: string;
  errorCode: string;
  comuna: string;
  address: string;
  availability: string;
  name: string;
  phone: string;
  email: string;
}

const INITIAL: FormData = {
  equipment: "",
  brand: "",
  model: "",
  problem: "",
  errorCode: "",
  comuna: "",
  address: "",
  availability: "",
  name: "",
  phone: "",
  email: "",
};

type WizardStep = {
  id: string;
  label: string;
  fields: readonly (keyof FormData)[];
  optional?: boolean;
};

const STEPS: WizardStep[] = [
  { id: "equipment", label: "Equipo", fields: ["equipment"] },
  { id: "brand", label: "Marca", fields: ["brand"] },
  { id: "model", label: "Modelo", fields: ["model"], optional: true },
  { id: "problem", label: "Problema", fields: ["problem"] },
  { id: "errorCode", label: "Código de error", fields: ["errorCode"], optional: true },
  { id: "comuna", label: "Comuna", fields: ["comuna"] },
  { id: "address", label: "Dirección", fields: ["address"] },
  { id: "availability", label: "Disponibilidad", fields: ["availability"] },
  { id: "name", label: "Nombre", fields: ["name"] },
  { id: "phone", label: "Teléfono", fields: ["phone"] },
  { id: "email", label: "Correo electrónico", fields: ["email"] },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  function update(field: keyof FormData, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function validateCurrent(): boolean {
    const field = current.fields[0];
    const value = data[field].trim();

    if (!value && !current.optional) {
      setError("Este campo es obligatorio.");
      return false;
    }

    if (field === "email" && value && !isValidEmail(value)) {
      setError("Ingresa un correo electrónico válido.");
      return false;
    }

    if (field === "phone" && value && value.replace(/\D/g, "").length < 8) {
      setError("Ingresa un teléfono válido.");
      return false;
    }

    return true;
  }

  function next() {
    if (!validateCurrent()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-carbon/5 sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sage/20 text-sage-dark">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-carbon sm:text-3xl">
          Solicitud recibida
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-carbon/70">
          Gracias, {data.name}. Revisaremos tu solicitud y te contactaremos
          pronto para confirmar la visita. Mientras tanto, puedes escribirnos
          por WhatsApp si necesitas algo urgente.
        </p>
        <div className="mt-8">
          <Button href={DEMO_BASE}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-carbon/5">
      <div className="border-b border-carbon/5 px-6 py-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-carbon">
            Paso {step + 1} de {STEPS.length}
          </span>
          <span className="text-carbon/50">{current.label}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-ivory">
          <div
            className="h-full rounded-full bg-terracotta transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <label htmlFor="wizard-field" className="block font-serif text-2xl text-carbon">
          {getQuestion(current.id)}
        </label>
        {current.optional && (
          <p className="mt-1 text-sm text-carbon/50">Opcional</p>
        )}

        <div className="mt-6">
          {renderField(current.id, data, update)}
        </div>

        {error && (
          <p className="mt-3 text-sm text-terracotta" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 0}
            className={cn(step === 0 && "invisible")}
          >
            Atrás
          </Button>
          <Button onClick={next}>
            {step === STEPS.length - 1 ? "Enviar solicitud" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function getQuestion(stepId: string): string {
  const questions: Record<string, string> = {
    equipment: "¿Qué equipo necesita atención?",
    brand: "¿Cuál es la marca?",
    model: "¿Conoces el modelo?",
    problem: "Cuéntanos qué ocurre",
    errorCode: "¿Hay algún código de error en pantalla?",
    comuna: "¿En qué comuna estás?",
    address: "¿Cuál es tu dirección?",
    availability: "¿Cuándo te acomoda recibir la visita?",
    name: "¿Cómo te llamamos?",
    phone: "¿Cuál es tu teléfono?",
    email: "¿Cuál es tu correo electrónico?",
  };
  return questions[stepId] ?? "";
}

function renderField(
  stepId: string,
  data: FormData,
  update: (field: keyof FormData, value: string) => void,
) {
  const inputClass =
    "w-full rounded-xl border border-carbon/15 bg-ivory/50 px-4 py-3 text-base text-carbon placeholder:text-carbon/40 focus:border-terracotta focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/20";

  switch (stepId) {
    case "equipment":
      return (
        <select
          id="wizard-field"
          value={data.equipment}
          onChange={(e) => update("equipment", e.target.value)}
          className={inputClass}
        >
          <option value="">Selecciona un equipo</option>
          {EQUIPMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      );
    case "comuna":
      return (
        <select
          id="wizard-field"
          value={data.comuna}
          onChange={(e) => update("comuna", e.target.value)}
          className={inputClass}
        >
          <option value="">Selecciona tu comuna</option>
          {COMUNAS.map((comuna) => (
            <option key={comuna} value={comuna}>
              {comuna}
            </option>
          ))}
        </select>
      );
    case "problem":
      return (
        <textarea
          id="wizard-field"
          value={data.problem}
          onChange={(e) => update("problem", e.target.value)}
          rows={4}
          placeholder="Describe los síntomas: ruidos, no enfría, no enciende..."
          className={inputClass}
        />
      );
    default:
      return (
        <input
          id="wizard-field"
          type={stepId === "email" ? "email" : stepId === "phone" ? "tel" : "text"}
          value={data[stepId as keyof FormData]}
          onChange={(e) => update(stepId as keyof FormData, e.target.value)}
          placeholder={getPlaceholder(stepId)}
          className={inputClass}
        />
      );
  }
}

function getPlaceholder(stepId: string): string {
  const placeholders: Record<string, string> = {
    brand: "Ej: Samsung, Bosch, Miele...",
    model: "Ej: RB37 o dejar en blanco si no lo sabes",
    errorCode: "Ej: E4, F21 o dejar en blanco",
    address: "Calle, número, depto/casa",
    availability: "Ej: Mañanas, tardes, fines de semana",
    name: "Tu nombre completo",
    phone: "+56 9 XXXX XXXX",
    email: "tu@email.com",
  };
  return placeholders[stepId] ?? "";
}
