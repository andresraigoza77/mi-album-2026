"use client";

import { useRef, useState, type ChangeEvent } from "react";

import { useAlbumState } from "@/components/AlbumStateProvider";
import { serializeAlbumState } from "@/lib/albumStorage";

type Feedback = {
  tone: "success" | "error";
  message: string;
} | null;

export function AlbumDataTools() {
  const { state, isReady, importAlbum, loadChecklistProgress, resetAlbum } = useAlbumState();
  const inputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  function exportProgress() {
    const file = new Blob([serializeAlbumState(state)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `mi-album-2026-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedback({ tone: "success", message: "Progreso exportado correctamente." });
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const result = importAlbum(await file.text());
      setFeedback(
        result.success
          ? { tone: "success", message: "Progreso importado y guardado correctamente." }
          : { tone: "error", message: result.error },
      );
    } catch {
      setFeedback({ tone: "error", message: "No se pudo leer el archivo seleccionado." });
    }
  }

  function confirmReset() {
    const confirmed = window.confirm(
      "¿Quieres reiniciar todo el álbum? Se borrará el progreso guardado y esta acción no se puede deshacer.",
    );

    if (!confirmed) return;

    resetAlbum();
    setFeedback({ tone: "success", message: "El álbum se reinició correctamente." });
  }

  function confirmChecklistLoad() {
    const confirmed = window.confirm(
      "Esto reemplazará tu avance actual por el avance leído desde la imagen. ¿Deseas continuar?",
    );

    if (!confirmed) return;

    const saved = loadChecklistProgress();
    setFeedback(
      saved
        ? { tone: "success", message: "Avance de la checklist cargado y guardado." }
        : {
            tone: "error",
            message: "El avance se cargó, pero el navegador no permitió guardarlo.",
          },
    );
  }

  return (
    <section aria-labelledby="data-tools-title" className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Copia de seguridad</p>
        <h2 id="data-tools-title" className="mt-1 text-2xl font-black tracking-tight text-slate-950">
          Gestiona tu progreso
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Descarga una copia en JSON, recupérala en este dispositivo o comienza el álbum de nuevo.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={confirmChecklistLoad}
          disabled={!isReady}
          className="data-tool-button bg-lime-300 text-emerald-950 hover:bg-lime-200"
        >
          Cargar avance de la imagen
        </button>
        <button type="button" onClick={exportProgress} disabled={!isReady} className="data-tool-button bg-emerald-950 text-white hover:bg-emerald-800">
          Exportar JSON
        </button>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={!isReady} className="data-tool-button border border-emerald-700 bg-white text-emerald-800 hover:bg-emerald-50">
          Importar JSON
        </button>
        <button type="button" onClick={confirmReset} disabled={!isReady} className="data-tool-button border border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
          Reiniciar álbum
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      <p
        className={`mt-4 min-h-5 text-sm font-bold ${feedback?.tone === "error" ? "text-red-700" : "text-emerald-700"}`}
        role="status"
        aria-live="polite"
      >
        {feedback?.message}
      </p>
    </section>
  );
}
