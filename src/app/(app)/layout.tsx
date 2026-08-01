import { AppNav } from "@/components/AppNav";

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
