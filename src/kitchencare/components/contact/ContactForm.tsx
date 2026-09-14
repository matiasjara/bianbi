"use client";

import { useState } from "react";
import { Button } from "@/kitchencare/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!email || !message) {
      setError("Completa los campos obligatorios.");
      return;
    }

    setError("");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-carbon/5">
        <h2 className="font-serif text-2xl text-carbon">Mensaje enviado</h2>
        <p className="mt-3 text-sm text-carbon/70">
          Te responderemos a la brevedad. Gracias por contactarnos.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-carbon/15 bg-ivory/50 px-4 py-3 text-base text-carbon placeholder:text-carbon/40 focus:border-terracotta focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-carbon/5 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-carbon">
            Nombre
          </label>
          <input id="name" name="name" type="text" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-carbon">
            Correo electrónico *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="type" className="mb-2 block text-sm font-medium text-carbon">
          Motivo
        </label>
        <select id="type" name="type" className={inputClass}>
          <option value="general">Consulta general</option>
          <option value="business">KitchenCare Business</option>
          <option value="plus">KitchenCare+</option>
          <option value="repair">Reparación</option>
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-carbon">
          Mensaje *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputClass}
          placeholder="Cuéntanos en qué podemos ayudarte"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-terracotta" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6">
        <Button type="submit">Enviar mensaje</Button>
      </div>
    </form>
  );
}
