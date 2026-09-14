import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/lib/site/indexing";
import { ProposalCarousel } from "./ProposalCarousel";

export const metadata: Metadata = {
  title: { absolute: "KitchenCare — Propuesta comercial #1" },
  description:
    "Propuesta de creación de marca y ecosistema digital para KitchenCare.",
  robots: PRIVATE_ROBOTS,
};

export default function KitchenCareProposalPage() {
  return (
    <main className="min-h-screen bg-[#e8e6df] font-[Arial,Helvetica,sans-serif] text-[#171b18]">
      <ProposalCarousel />
    </main>
  );
}
