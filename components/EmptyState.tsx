import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function EmptyState({ eyebrow, title, description }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Esta pantalla está preparada, pero aún no guarda ni calcula estados.
      </div>
      <Link
        href="/grupos"
        className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
      >
        Explorar grupos
      </Link>
    </div>
  );
}
