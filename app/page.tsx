import Link from "next/link";

import { AlbumDataTools } from "@/components/AlbumDataTools";
import { DashboardSummary } from "@/components/DashboardSummary";
import { albumGroups, totalTeams, totalTeamStickers } from "@/lib/albumData";

export default function HomePage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-emerald-950 px-5 py-8 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-12">
        <div className="absolute -right-16 -top-20 size-56 rounded-full border-[28px] border-lime-300/10" />
        <div className="absolute -bottom-20 right-24 size-40 rounded-full border-[20px] border-white/5" />
        <div className="relative max-w-2xl">
          <span className="inline-flex rounded-full bg-lime-300 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-950">
            Checklist 2026
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Tu álbum, siempre al día.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-emerald-100 sm:text-lg">
            Marca lo que tienes, descubre qué te falta y lleva tus repetidas listas para el próximo intercambio.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/grupos"
              className="rounded-full bg-lime-300 px-5 py-3 text-sm font-black text-emerald-950 transition hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Ver grupos
            </Link>
            <Link
              href="/faltantes"
              className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Mis faltantes
            </Link>
          </div>
        </div>
      </section>

      <DashboardSummary />

      <AlbumDataTools />

      <section aria-labelledby="album-map-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Mapa del álbum</p>
            <h2 id="album-map-title" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              Doce grupos, una colección
            </h2>
          </div>
          <Link href="/grupos" className="inline-flex min-h-11 shrink-0 items-center text-sm font-bold text-emerald-700 hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {albumGroups.map((group) => (
            <Link
              key={group.code}
              href={`/grupos#grupo-${group.code}`}
              className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl font-black text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50"
              aria-label={`Ir al Grupo ${group.code}`}
            >
              {group.code}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          {totalTeams} selecciones · {totalTeamStickers} figuritas de equipos
        </p>
      </section>
    </div>
  );
}
