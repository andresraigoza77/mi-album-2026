import type { Metadata } from "next";

import { StickerStatusList } from "@/components/StickerStatusList";

export const metadata: Metadata = { title: "Repetidas" };

export default function DuplicatesPage() {
  return <StickerStatusList status="duplicate" />;
}
