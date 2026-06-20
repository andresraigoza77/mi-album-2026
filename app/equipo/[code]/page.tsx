import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TeamStickerGrid } from "@/components/TeamStickerGrid";
import { albumTeams, getTeamByCode } from "@/lib/albumData";

type TeamPageProps = {
  params: Promise<{ code: string }>;
};

export function generateStaticParams() {
  return albumTeams.map((team) => ({ code: team.code }));
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { code } = await params;
  const team = getTeamByCode(code);

  return { title: team?.name ?? "Selección no encontrada" };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { code } = await params;
  const team = getTeamByCode(code);

  if (!team) notFound();

  return (
    <div className="space-y-8">
      <Link href={`/grupos#grupo-${team.group}`} className="inline-flex min-h-11 items-center text-sm font-bold text-emerald-700 hover:underline">
        ← Volver a grupos
      </Link>
      <header className="relative overflow-hidden rounded-[2rem] bg-emerald-950 p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div className="absolute -right-10 -top-12 size-40 rounded-full border-[20px] border-lime-300/10" />
        <div className="relative flex items-center gap-5">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-lime-300 text-lg font-black tracking-wide text-emerald-950 sm:size-20 sm:text-xl">
            {team.code}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">Grupo {team.group}</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">{team.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100 sm:text-base">
              Toca cada figurita para recorrer sus tres estados. Los cambios se guardan automáticamente.
            </p>
          </div>
        </div>
      </header>
      <TeamStickerGrid team={team} />
    </div>
  );
}
