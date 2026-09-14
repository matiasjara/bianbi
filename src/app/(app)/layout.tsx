import type { Metadata } from "next";
import { AppNav } from "@/components/AppNav";
import { PRIVATE_ROBOTS } from "@/lib/site/indexing";

export const metadata: Metadata = {
  robots: PRIVATE_ROBOTS,
};

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AppNav />
      <div className="mx-auto max-w-6xl px-5 py-10">{children}</div>
    </div>
  );
}
