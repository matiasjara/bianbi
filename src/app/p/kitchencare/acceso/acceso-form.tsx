"use client";

import { useActionState } from "react";
import {
  kitchenCareShareLoginAction,
  type ShareLoginState,
} from "./actions";

const initial: ShareLoginState = {};

export function KitchenCareAccessForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(
    kitchenCareShareLoginAction,
    initial,
  );

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={nextPath} />
      <label className="block">
        <span className="mb-1.5 block text-sm text-white/55">Clave de acceso</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20"
          placeholder="La clave que te enviaron"
        />
      </label>

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl bg-white/8 px-3 py-2 text-sm text-[#efb4a4]"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#de6347] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c8553a] disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Ver propuesta"}
      </button>
    </form>
  );
}
