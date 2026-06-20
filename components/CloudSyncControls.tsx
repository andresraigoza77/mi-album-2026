"use client";

import { useState } from "react";

import { useAlbumState } from "@/components/AlbumStateProvider";

export function CloudSyncControls() {
  const {
    cloudUser,
    cloudStatus,
    isCloudReady,
    signInWithGoogle,
    signOut,
    syncWithCloud,
  } = useAlbumState();
  const [feedback, setFeedback] = useState("");

  async function handleSignIn() {
    const started = await signInWithGoogle();
    if (!started) setFeedback("No se pudo iniciar sesión con Google.");
  }

  async function handleSignOut() {
    const completed = await signOut();
    setFeedback(
      completed
        ? "Sesión cerrada. El progreso local permanece en este dispositivo."
        : "No se pudo cerrar la sesión.",
    );
  }

  async function handleSync() {
    const completed = await syncWithCloud();
    setFeedback(
      completed
        ? "Progreso sincronizado con la nube."
        : "No se pudo sincronizar el progreso.",
    );
  }

  const statusText = !isCloudReady
    ? "Comprobando sesión…"
    : cloudStatus === "syncing"
      ? "Sincronizando…"
      : cloudStatus === "synced"
        ? "Progreso sincronizado"
        : cloudStatus === "error"
          ? "No se pudo conectar con la nube"
          : "Solo en este dispositivo";

  return (
    <section
      aria-labelledby="cloud-sync-title"
      className="rounded-[2rem] border border-sky-200 bg-sky-50 p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
            Respaldo en la nube
          </p>
          <h2 id="cloud-sync-title" className="mt-1 text-2xl font-black text-slate-950">
            {cloudUser ? "Tu álbum está conectado" : "Guarda tu álbum por usuario"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {cloudUser
              ? `Sesión iniciada como ${cloudUser.email ?? "usuario de Google"}.`
              : "Inicia sesión con Google para conservar y recuperar tu progreso en Supabase."}
          </p>
          <p className="mt-2 text-xs font-bold text-sky-800" aria-live="polite">
            {statusText}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          {cloudUser ? (
            <>
              <button
                type="button"
                onClick={handleSync}
                disabled={!isCloudReady || cloudStatus === "syncing"}
                className="data-tool-button bg-sky-700 text-white hover:bg-sky-800"
              >
                Sincronizar con la nube
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={cloudStatus === "syncing"}
                className="data-tool-button border border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={!isCloudReady || cloudStatus === "syncing"}
              className="data-tool-button bg-sky-700 text-white hover:bg-sky-800"
            >
              Iniciar sesión con Google
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 min-h-5 text-sm font-bold text-sky-800" role="status" aria-live="polite">
        {feedback}
      </p>
    </section>
  );
}
