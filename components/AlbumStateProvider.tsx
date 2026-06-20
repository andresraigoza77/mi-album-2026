"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { changeStickerState, initializeAlbumState } from "@/lib/albumState";
import {
  loadAlbumState,
  saveAlbumState,
  validateAlbumImport,
  type AlbumImportResult,
} from "@/lib/albumStorage";
import type { AlbumState } from "@/lib/types";

type AlbumStateContextValue = {
  state: AlbumState;
  isReady: boolean;
  changeSticker: (teamCode: string, stickerNumber: number) => void;
  importAlbum: (rawValue: string) => AlbumImportResult;
  resetAlbum: () => void;
};

const AlbumStateContext = createContext<AlbumStateContextValue | null>(null);

export function AlbumStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlbumState>(initializeAlbumState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      setState(loadAlbumState(window.localStorage));
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(hydrationTask);
  }, []);

  useEffect(() => {
    if (isReady) saveAlbumState(window.localStorage, state);
  }, [isReady, state]);

  function changeSticker(teamCode: string, stickerNumber: number) {
    if (!isReady) return;
    setState((currentState) => changeStickerState(currentState, teamCode, stickerNumber));
  }

  function importAlbum(rawValue: string): AlbumImportResult {
    const result = validateAlbumImport(rawValue);
    if (result.success) setState(result.state);
    return result;
  }

  function resetAlbum() {
    setState(initializeAlbumState());
  }

  return (
    <AlbumStateContext.Provider value={{ state, isReady, changeSticker, importAlbum, resetAlbum }}>
      {children}
    </AlbumStateContext.Provider>
  );
}

export function useAlbumState(): AlbumStateContextValue {
  const context = useContext(AlbumStateContext);

  if (!context) {
    throw new Error("useAlbumState debe usarse dentro de AlbumStateProvider.");
  }

  return context;
}
