import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { NOINDEX_ROBOTS_TAG } from "@/lib/site/indexing";

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "data/clients/kitchencare/Propuesta_KitchenCare_v2.docx",
  );
  const file = await readFile(filePath);

  return new NextResponse(file, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":
        'attachment; filename="Propuesta_KitchenCare_v2.docx"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": NOINDEX_ROBOTS_TAG,
    },
  });
}
