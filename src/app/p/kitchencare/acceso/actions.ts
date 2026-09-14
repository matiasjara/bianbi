"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthSecret } from "@/lib/auth/config";
import {
  createScopedSessionToken,
  passwordsMatch,
} from "@/lib/auth/session";
import {
  getKitchenCareSharePassword,
  kitchenCareShareCookieOptions,
  KITCHENCARE_SHARE_MAX_AGE_SEC,
  KITCHENCARE_SHARE_SCOPE,
  safeKitchenCareNextPath,
} from "@/lib/share/kitchencare";

export type ShareLoginState = {
  error?: string;
};

export async function kitchenCareShareLoginAction(
  _prev: ShareLoginState,
  formData: FormData,
): Promise<ShareLoginState> {
  const password = String(formData.get("password") ?? "");
  const next = safeKitchenCareNextPath(String(formData.get("next") ?? ""));
  const expected = getKitchenCareSharePassword();

  if (!expected || !getAuthSecret()) {
    return {
      error: "El acceso a esta propuesta aún no está configurado.",
    };
  }

  if (!password || !(await passwordsMatch(password, expected))) {
    return { error: "Clave incorrecta." };
  }

  const token = await createScopedSessionToken(
    KITCHENCARE_SHARE_SCOPE,
    KITCHENCARE_SHARE_MAX_AGE_SEC,
  );
  if (!token) {
    return { error: "No se pudo abrir la propuesta. Intenta de nuevo." };
  }

  const jar = await cookies();
  const opts = kitchenCareShareCookieOptions();
  jar.set(opts.name, token, opts);

  redirect(next);
}
