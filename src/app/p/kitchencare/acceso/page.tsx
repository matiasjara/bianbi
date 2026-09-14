import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth/config";
import {
  verifyScopedSessionToken,
  verifySessionToken,
} from "@/lib/auth/session";
import {
  KITCHENCARE_SHARE_COOKIE,
  KITCHENCARE_SHARE_SCOPE,
  safeKitchenCareNextPath,
} from "@/lib/share/kitchencare";
import { PRIVATE_ROBOTS } from "@/lib/site/indexing";
import { KitchenCareAccessForm } from "./acceso-form";

export const metadata: Metadata = {
  title: { absolute: "KitchenCare — Acceso a propuesta" },
  robots: PRIVATE_ROBOTS,
};

export default async function KitchenCareAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = safeKitchenCareNextPath(params.next);
  const jar = await cookies();
  const adminOk = await verifySessionToken(jar.get(SESSION_COOKIE)?.value);
  const shareOk = await verifyScopedSessionToken(
    KITCHENCARE_SHARE_SCOPE,
    jar.get(KITCHENCARE_SHARE_COOKIE)?.value,
  );
  if (adminOk || shareOk) redirect(nextPath);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#111311] px-5 py-16 text-[#e9e8e1]">
      <div className="relative w-full max-w-md">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#a0afa3]">
          KitchenCare
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Propuesta comercial
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Esta página es privada. Ingresa la clave para ver el resumen, descargar
          la propuesta extendida y abrir la demo del sitio.
        </p>
        <KitchenCareAccessForm nextPath={nextPath} />
      </div>
    </main>
  );
}
