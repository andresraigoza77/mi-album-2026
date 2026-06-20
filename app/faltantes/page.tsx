import type { Metadata } from "next";

import { StickerStatusList } from "@/components/StickerStatusList";

export const metadata: Metadata = { title: "Faltantes" };

export default function MissingPage() {
  return <StickerStatusList status="missing" />;
}
