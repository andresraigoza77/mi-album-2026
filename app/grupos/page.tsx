import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { TeamCard } from "@/components/TeamCard";
import { albumGroups } from "@/lib/albumData";

export const metadata: Metadata = { title: "Grupos" };

export default function GroupsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="12 grupos · 48 selecciones"
        title="Explora el álbum por grupos"
        description="Entra a una selección para marcar sus figuritas. Cada tarjeta muestra el progreso guardado en este dispositivo."
      />
      <div className="space-y-7">
        {albumGroups.map((group) => (
          <section
            id={`grupo-${group.code}`}
            key={group.code}
            className="scroll-mt-32 rounded-[2rem] border border-slate-200 bg-slate-100/60 p-4 sm:p-5"
            aria-labelledby={`titulo-grupo-${group.code}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-950 text-lg font-black text-lime-300">
                {group.code}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Grupo</p>
                <h2 id={`titulo-grupo-${group.code}`} className="text-xl font-black text-slate-950">
                  {group.code}
                </h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {group.teams.map((team) => <TeamCard key={team.code} team={team} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
