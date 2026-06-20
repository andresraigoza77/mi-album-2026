"use client";

import { useAlbumState } from "@/components/AlbumStateProvider";
import { calculateTeamProgress } from "@/lib/albumState";
import type { StickerStatus, Team } from "@/lib/types";

const statusLabels: Record<StickerStatus, string> = {
  missing: "Faltante",
  owned: "Conseguida",
  duplicate: "Repetida",
};

const statusStyles: Record<StickerStatus, string> = {
  missing: "border-slate-300 bg-white text-slate-500 hover:border-slate-500 hover:bg-slate-50",
  owned: "border-emerald-600 bg-emerald-100 text-emerald-900 shadow-sm shadow-emerald-200 hover:bg-emerald-200",
  duplicate: "border-amber-500 bg-amber-100 text-amber-950 shadow-sm shadow-amber-200 hover:bg-amber-200",
};

export function TeamStickerGrid({ team }: { team: Team }) {
  const { state, isReady, changeSticker } = useAlbumState();
  const stickers = state[team.code];
  const progress = calculateTeamProgress(state, team.code);

  return (
    <section className="space-y-5" aria-labelledby="team-progress-title">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 id="team-progress-title" className="font-bold text-slate-950">
            Progreso del equipo
          </h2>
          <span className="text-2xl font-black tracking-tight text-emerald-700">{progress.percentage}%</span>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label={`Progreso de ${team.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.percentage}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width]"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ProgressStat value={progress.collected} label="Conseguidas" className="bg-emerald-50 text-emerald-900" />
          <ProgressStat value={progress.missing} label="Faltantes" className="bg-slate-100 text-slate-700" />
          <ProgressStat value={progress.duplicates} label="Repetidas" className="bg-amber-50 text-amber-900" />
        </div>
        <p className="mt-1 text-xs font-medium text-slate-500" aria-live="polite">
          {isReady ? "Progreso guardado automáticamente." : "Recuperando progreso guardado…"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700" aria-label="Leyenda">
        <span className="mr-1 font-black text-slate-950">Estados:</span>
        {(Object.keys(statusLabels) as StickerStatus[]).map((status) => (
          <span key={status} className="inline-flex items-center gap-2">
            <span className={`size-3 rounded-full border ${statusStyles[status]}`} aria-hidden="true" />
            {statusLabels[status]}
          </span>
        ))}
      </div>

      <ol
        aria-label={`Figuritas de ${team.name}`}
        className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-10"
      >
        {stickers.map((status, index) => {
          const number = index + 1;
          const nextLabel = statusLabels[
            status === "missing" ? "owned" : status === "owned" ? "duplicate" : "missing"
          ];

          return (
            <li key={number}>
              <button
                type="button"
                onClick={() => changeSticker(team.code, number)}
                disabled={!isReady}
                className={`flex aspect-[3/4] w-full flex-col items-center justify-center rounded-2xl border-2 text-xl font-black transition disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${statusStyles[status]}`}
                aria-label={`Figurita ${number}: ${statusLabels[status]}. Cambiar a ${nextLabel}.`}
              >
                {number}
                <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide">
                  {statusLabels[status]}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ProgressStat({ value, label, className }: { value: number; label: string; className: string }) {
  return (
    <div className={`rounded-xl px-2 py-3 text-center ${className}`}>
      <strong className="block text-xl font-black">{value}</strong>
      <span className="block text-[0.65rem] font-bold sm:text-xs">{label}</span>
    </div>
  );
}
