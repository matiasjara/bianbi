import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientWorkspace } from "@/components/clients/ClientWorkspace";
import { getClientBySlug, getClientSlugs } from "@/lib/data/clients";
import { getKitchenCareSharePassword } from "@/lib/share/kitchencare";
import { PRIVATE_ROBOTS } from "@/lib/site/indexing";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getClientSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) return { title: "Cliente", robots: PRIVATE_ROBOTS };
  return { title: client.name, robots: PRIVATE_ROBOTS };
}

export default async function ClientePage({ params }: Props) {
  const { slug } = await params;
  const client = getClientBySlug(slug);
  if (!client) notFound();

  const sharePassword =
    client.slug === "kitchencare" ? getKitchenCareSharePassword() : undefined;

  return <ClientWorkspace client={client} sharePassword={sharePassword} />;
}
