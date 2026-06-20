"use client";

import { useState, type ReactNode } from "react";

import { useAlbumState } from "@/components/AlbumStateProvider";

export function AuthGate({ children }: { children: ReactNode }) {
  const { cloudUser, cloudStatus, isCloudReady, signInWithGoogle } = useAlbumState();
  const [feedback, setFeedback] = useState("");

  async function handleSignIn() {
    setFeedback("");
    const started = await signInWithGoogle();

    if (!started) {
      setFeedback("No se pudo iniciar sesión con Google. Inténtalo nuevamente.");
    }
  }

  if (cloudUser) return children;

  const isCheckingSession = !isCloudReady || cloudStatus === "loading";

  return (
    <main
      id="contenido-principal"
      className="flex min-h-screen items-center justify-center bg-emerald-950 px-4 py-10"
    >
      <section
        aria-labelledby="login-title"
        className="w-full max-w-md rounded-[2rem] bg-white p-6 text-center shadow-2xl shadow-black/20 sm:p-10"
      >
        <div
          aria-hidden="true"
          className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-lime-300 text-2xl font-black text-emerald-950"
        >
          26
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
          Mi Álbum 2026
        </p>
        <h1 id="login-title" className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Tu colección te espera
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Inicia sesión con Google para acceder a tu progreso y mantenerlo sincronizado entre tus dispositivos.
        </p>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={isCheckingSession}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-emerald-900 px-5 py-3 text-base font-black text-white transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-500 disabled:cursor-wait disabled:opacity-60"
        >
          Iniciar sesión con Google
        </button>

        <p className="mt-4 min-h-6 text-sm font-bold text-emerald-800" role="status" aria-live="polite">
          {isCheckingSession ? "Comprobando sesión…" : feedback}
        </p>
      </section>
    </main>
  );
}
