import Link from "next/link";
import { PROPOSAL_PATH } from "@/kitchencare/lib/constants";

export function DemoBanner() {
  return (
    <div className="bg-[#111311] px-4 py-2 text-center text-[11px] tracking-wide text-white/70">
      Estás viendo una demo de la propuesta KitchenCare.{" "}
      <Link
        href={PROPOSAL_PATH}
        className="font-semibold text-white underline-offset-2 hover:underline"
      >
        Volver a la propuesta
      </Link>
    </div>
  );
}
