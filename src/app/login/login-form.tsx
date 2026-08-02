"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";

const initial: LoginState = {};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <label className="block">
        <span className="mb-1.5 block text-sm text-[var(--muted)]">
          Contraseña
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="w-full rounded-lg border border-[var(--line)] bg-[var(--panel)] px-3.5 py-2.5 text-[var(--ink)] outline-none ring-[var(--accent)] focus:ring-2"
          placeholder="Tu acceso a Crambie"
        />
      </label>

      {state.error ? (
        <p
          role="alert"
          className="rounded-md bg-[var(--warn-soft)] px-3 py-2 text-sm text-[var(--warn)]"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--panel)] transition hover:bg-[var(--accent-ink)] disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
