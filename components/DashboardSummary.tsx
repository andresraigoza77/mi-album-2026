"use client";

import Link from "next/link";

import { useAlbumState } from "@/components/AlbumStateProvider";
import { calculateTotalProgress } from "@/lib/albumState";

export function DashboardSummary() {
  const { state, isReady } = useAlbumState();
  const progress = calculateTotalProgress(state);
  const stats = [
    { label: "Conseguidas", value: progress.collected, tone: "bg-emerald-100 text-emerald-900", href: "/grupos" },
    { label: "Faltantes", value: progress.missing, tone: "bg-slate-100 text-slate-800", href: "/faltantes" },
    { label: "Repetidas", value: progress.duplicates, tone: "bg-amber-100 text-amber-950", href: "/repetidas" },
  ] as const;

  return (
    <section aria-labelledby="progress-title" className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Resumen general</p>
          <h2 id="progress-title" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Progreso de tu colección
          </h2>
          <p className="mt-2 text-sm text-slate-500" aria-live="polite">
            {isReady ? "Sincronizado en este dispositivo" : "Recuperando progreso…"}
          </p>
        </div>
        <div className="flex items-baseline gap-2">
          <strong className="text-5xl font-black tracking-tighter text-emerald-700">{progress.percentage}%</strong>
          <span className="text-sm font-semibold text-slate-500">completo</span>
        </div>
      </div>

      <div
        className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label="Progreso total del álbum"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percentage}
      >
        <div className="h-full rounded-full bg-emerald-600 transition-[width]" style={{ width: `${progress.percentage}%` }} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className={`rounded-2xl p-3 transition hover:-translate-y-0.5 sm:p-4 ${stat.tone}`}>
            <strong className="block text-2xl font-black sm:text-3xl">{stat.value}</strong>
            <span className="mt-1 block text-[0.7rem] font-bold sm:text-sm">{stat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
