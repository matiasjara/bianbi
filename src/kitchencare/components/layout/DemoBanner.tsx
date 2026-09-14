import Link from "next/link";
import { PROPOSAL_PATH } from "@/kitchencare/lib/constants";

export function DemoBanner() {
  return (
    <div className="bg-[#de6347] px-4 py-2.5 text-center text-[12px] font-medium tracking-wide text-white">
      Estás viendo una demo de la propuesta KitchenCare.{" "}
      <Link
        href={PROPOSAL_PATH}
        className="font-semibold text-white underline underline-offset-2 hover:text-white/90"
      >
        Volver a la propuesta
      </Link>
    </div>
  );
}
