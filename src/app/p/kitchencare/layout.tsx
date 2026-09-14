import type { Metadata } from "next";
import { PRIVATE_ROBOTS } from "@/lib/site/indexing";
import "./demo/kitchencare.css";

export const metadata: Metadata = {
  robots: PRIVATE_ROBOTS,
};

export default function KitchenCareShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
