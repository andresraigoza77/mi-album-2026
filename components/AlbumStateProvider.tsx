"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import {
  changeStickerState,
  createStateFromOwnedChecklist,
  initializeAlbumState,
} from "@/lib/albumState";
import {
  getCurrentUser,
  loadCloudAlbumState,
  saveCloudAlbumState,
  signInWithGoogle as signInWithGoogleCloud,
  signOut as signOutCloud,
} from "@/lib/albumCloudStorage";
import {
  loadAlbumState,
  saveAlbumState,
  validateAlbumImport,
  type AlbumImportResult,
} from "@/lib/albumStorage";
import type { AlbumState } from "@/lib/types";

export type CloudSyncStatus = "idle" | "syncing" | "synced" | "error";

type AlbumStateContextValue = {
  state: AlbumState;
  isReady: boolean;
  cloudUser: User | null;
  cloudStatus: CloudSyncStatus;
  isCloudReady: boolean;
  changeSticker: (teamCode: string, stickerNumber: number) => void;
  importAlbum: (rawValue: string) => AlbumImportResult;
  loadChecklistProgress: () => boolean;
  resetAlbum: () => void;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
  syncWithCloud: () => Promise<boolean>;
};

const AlbumStateContext = createContext<AlbumStateContextValue | null>(null);

export function AlbumStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlbumState>(initializeAlbumState);
  const [isReady, setIsReady] = useState(false);
  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>("idle");
  const [isCloudReady, setIsCloudReady] = useState(false);

  useEffect(() => {
    let active = true;

    const hydrationTask = window.setTimeout(async () => {
      const localState = loadAlbumState(window.localStorage);
      if (!active) return;

      setState(localState);
      setIsReady(true);

      try {
        setCloudStatus("syncing");
        const user = await getCurrentUser();
        if (!active) return;

        setCloudUser(user);

        if (!user) {
          setCloudStatus("idle");
          setIsCloudReady(true);
          return;
        }

        const cloudState = await loadCloudAlbumState();
        if (!active) return;

        if (cloudState) {
          setState(cloudState);
          saveAlbumState(window.localStorage, cloudState);
        } else {
          await saveCloudAlbumState(localState);
        }

        if (!active) return;
        setCloudStatus("synced");
        setIsCloudReady(true);
      } catch {
        if (!active) return;
        setCloudStatus("error");
        setIsCloudReady(true);
      }
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(hydrationTask);
    };
  }, []);

  useEffect(() => {
    if (isReady) saveAlbumState(window.localStorage, state);
  }, [isReady, state]);

  useEffect(() => {
    if (!isReady || !isCloudReady || !cloudUser) return;

    const cloudSaveTask = window.setTimeout(() => {
      setCloudStatus("syncing");
      saveCloudAlbumState(state)
        .then(() => setCloudStatus("synced"))
        .catch(() => setCloudStatus("error"));
    }, 600);

    return () => window.clearTimeout(cloudSaveTask);
  }, [cloudUser, isCloudReady, isReady, state]);

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

  function loadChecklistProgress(): boolean {
    const checklistState = createStateFromOwnedChecklist();
    const saved = saveAlbumState(window.localStorage, checklistState);
    setState(checklistState);
    return saved;
  }

  async function signInWithGoogle(): Promise<boolean> {
    try {
      setCloudStatus("syncing");
      await signInWithGoogleCloud();
      return true;
    } catch {
      setCloudStatus("error");
      return false;
    }
  }

  async function signOut(): Promise<boolean> {
    try {
      await signOutCloud();
      setCloudUser(null);
      setCloudStatus("idle");
      return true;
    } catch {
      setCloudStatus("error");
      return false;
    }
  }

  async function syncWithCloud(): Promise<boolean> {
    if (!cloudUser) return false;

    try {
      setCloudStatus("syncing");
      await saveCloudAlbumState(state);
      setCloudStatus("synced");
      return true;
    } catch {
      setCloudStatus("error");
      return false;
    }
  }

  return (
    <AlbumStateContext.Provider
      value={{
        state,
        isReady,
        cloudUser,
        cloudStatus,
        isCloudReady,
        changeSticker,
        importAlbum,
        loadChecklistProgress,
        resetAlbum,
        signInWithGoogle,
        signOut,
        syncWithCloud,
      }}
    >
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
