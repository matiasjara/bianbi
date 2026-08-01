"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthPassword, SESSION_COOKIE } from "@/lib/auth/config";
import {
  createSessionToken,
  passwordsMatch,
  sessionCookieOptions,
} from "@/lib/auth/session";

export type LoginState = {
  error?: string;
};

function safeNextPath(raw: FormDataEntryValue | null): string {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/propiedades";
  }
  if (raw.startsWith("/login") || raw.startsWith("/c")) {
    return "/propiedades";
  }
  return raw;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  const expected = getAuthPassword();

  if (!expected || !process.env.AUTH_SECRET?.trim()) {
    return {
      error:
        "Falta configurar AUTH_PASSWORD y AUTH_SECRET en las variables de entorno.",
    };
  }

  if (!password || !(await passwordsMatch(password, expected))) {
    return { error: "Contraseña incorrecta." };
  }

  const token = await createSessionToken();
  if (!token) {
    return { error: "No se pudo crear la sesión. Revisa AUTH_SECRET." };
  }

  const jar = await cookies();
  const opts = sessionCookieOptions();
  jar.set(opts.name, token, opts);

  redirect(next);
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  redirect("/login");
}
