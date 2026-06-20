"use client";

import Link from "next/link";
import { useState } from "react";

import { useAlbumState } from "@/components/AlbumStateProvider";
import { PageHeader } from "@/components/PageHeader";
import { getDuplicateStickers, getMissingStickers } from "@/lib/albumState";
import type { StickerReference, StickerStatus } from "@/lib/types";

type StickerStatusListProps = {
  status: Extract<StickerStatus, "missing" | "duplicate">;
};

const copy = {
  missing: {
    eyebrow: "Lista de búsqueda",
    title: "Figuritas faltantes",
    description: "Todo lo que necesitas conseguir, ordenado por selección.",
    emptyTitle: "¡No te falta ninguna!",
    emptyText: "Has completado todas las figuritas de equipos.",
    badge: "bg-slate-200 text-slate-700",
  },
  duplicate: {
    eyebrow: "Lista de intercambio",
    title: "Figuritas repetidas",
    description: "Tu inventario para preparar intercambios sin revisar equipo por equipo.",
    emptyTitle: "Aún no tienes repetidas",
    emptyText: "Cuando marques una figurita como repetida, aparecerá aquí.",
    badge: "bg-amber-100 text-amber-900",
  },
} as const;

export function StickerStatusList({ status }: StickerStatusListProps) {
  const { state, isReady } = useAlbumState();
  const [copyFeedback, setCopyFeedback] = useState("");
  const stickers = status === "missing" ? getMissingStickers(state) : getDuplicateStickers(state);
  const groups = groupByTeam(stickers);
  const content = copy[status];
  const shareText = buildListText(status, groups);
  const hasStickers = isReady && stickers.length > 0;

  async function copyList() {
    if (!hasStickers) return;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopyFeedback("Lista copiada");
    } catch {
      setCopyFeedback("No se pudo copiar");
    }

    window.setTimeout(() => setCopyFeedback(""), 2500);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />
        <div className={`w-fit shrink-0 rounded-2xl px-5 py-3 ${content.badge}`}>
          <strong className="text-3xl font-black">{isReady ? stickers.length : "—"}</strong>
          <span className="ml-2 text-sm font-bold">en total</span>
        </div>
      </div>

      <section aria-label="Acciones de la lista" className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={copyList}
          disabled={!hasStickers}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Copiar lista
        </button>
        <a
          href={hasStickers ? `https://wa.me/?text=${encodeURIComponent(shareText)}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!hasStickers}
          onClick={(event) => {
            if (!hasStickers) event.preventDefault();
          }}
          className={`inline-flex min-h-11 items-center justify-center rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-black text-emerald-950 transition hover:bg-[#20bd5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
            hasStickers ? "" : "pointer-events-none opacity-40"
          }`}
        >
          Compartir por WhatsApp
        </a>
        <p className="min-h-5 text-sm font-bold text-emerald-700" role="status" aria-live="polite">
          {copyFeedback}
        </p>
      </section>

      {!isReady ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">
          Recuperando tu colección…
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-12">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-700 text-2xl text-white" aria-hidden="true">✓</div>
          <h2 className="mt-4 text-xl font-black text-emerald-950">{content.emptyTitle}</h2>
          <p className="mt-2 text-sm text-emerald-800">{content.emptyText}</p>
          <Link href="/grupos" className="mt-5 inline-block text-sm font-black text-emerald-800 hover:underline">
            Explorar grupos →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map(({ teamCode, teamName, stickers: teamStickers }) => (
            <section key={teamCode} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-950 text-[0.7rem] font-black text-lime-300">
                    {teamCode}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate font-black text-slate-950">{teamName}</h2>
                    <p className="text-xs text-slate-500">{teamStickers.length} figuritas</p>
                  </div>
                </div>
                <Link href={`/equipo/${teamCode}`} className="inline-flex min-h-11 shrink-0 items-center text-xs font-black text-emerald-700 hover:underline">
                  Abrir →
                </Link>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Figuritas de ${teamName}`}>
                {teamStickers.map((sticker) => (
                  <li key={sticker.number} className={`flex size-9 items-center justify-center rounded-lg text-xs font-black ${content.badge}`}>
                    {sticker.number}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

type CountryStickerGroup = {
  teamCode: string;
  teamName: string;
  stickers: StickerReference[];
};

function groupByTeam(stickers: StickerReference[]): CountryStickerGroup[] {
  const groups = new Map<string, { teamCode: string; teamName: string; stickers: StickerReference[] }>();

  for (const sticker of stickers) {
    const current = groups.get(sticker.teamCode);
    if (current) current.stickers.push(sticker);
    else groups.set(sticker.teamCode, { teamCode: sticker.teamCode, teamName: sticker.teamName, stickers: [sticker] });
  }

  return Array.from(groups.values());
}

function buildListText(
  status: StickerStatusListProps["status"],
  groups: CountryStickerGroup[],
): string {
  const title = status === "missing" ? "Figuritas faltantes" : "Figuritas repetidas";
  const countryLines = groups.map(
    (group) => `${group.teamName} (${group.teamCode}): ${group.stickers.map((sticker) => sticker.number).join(", ")}`,
  );

  return [`${title} — Mi Álbum 2026`, "", ...countryLines].join("\n");
}
