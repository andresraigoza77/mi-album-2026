"use client";

import Link from "next/link";

import { useAlbumState } from "@/components/AlbumStateProvider";
import { calculateTeamProgress } from "@/lib/albumState";
import type { Team } from "@/lib/types";

export function TeamCard({ team }: { team: Team }) {
  const { state } = useAlbumState();
  const progress = calculateTeamProgress(state, team.code);

  return (
    <Link
      href={`/equipo/${team.code}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-950 text-xs font-black tracking-wide text-lime-300">
          {team.code}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-black text-slate-950 group-hover:text-emerald-800">{team.name}</h3>
            <span className="text-xs font-black text-emerald-700">{progress.percentage}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress.percentage}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {progress.collected}/{progress.total} · {progress.duplicates} repetidas
          </p>
        </div>
      </div>
    </Link>
  );
}
