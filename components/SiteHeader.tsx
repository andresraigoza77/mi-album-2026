"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/grupos", label: "Grupos" },
  { href: "/faltantes", label: "Faltantes" },
  { href: "/repetidas", label: "Repetidas" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-emerald-950/95 text-white shadow-lg shadow-emerald-950/5 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:flex sm:items-center sm:justify-between sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex min-h-11 items-center gap-2 font-black tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <span className="flex size-9 items-center justify-center rounded-xl bg-lime-300 text-sm text-emerald-950">26</span>
            <span>Mi Álbum</span>
          </Link>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-100 sm:hidden">
            Guardado local
          </span>
        </div>
        <nav aria-label="Navegación principal" className="-mx-1 overflow-x-auto pb-3 sm:mx-0 sm:pb-0">
          <ul className="flex min-w-max gap-1">
            {navigation.map((item) => {
              const active = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href) || (item.href === "/grupos" && pathname.startsWith("/equipo/"));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-3.5 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-white ${
                      active ? "bg-lime-300 text-emerald-950" : "text-emerald-50 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
