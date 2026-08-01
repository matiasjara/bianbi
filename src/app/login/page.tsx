import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    typeof params.next === "string" && params.next.startsWith("/")
      ? params.next
      : "/propiedades";

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-fade opacity-40"
      />
      <div className="relative w-full max-w-md animate-[rise-in_0.5s_ease-out]">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl"
        >
          Bianbi
        </Link>
        <div className="surface mt-8 rounded-2xl p-6 shadow-sm">
          <LoginForm nextPath={nextPath} />
        </div>
        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          <Link href="/" className="underline-offset-4 hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
