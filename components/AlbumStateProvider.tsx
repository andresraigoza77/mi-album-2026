"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

export type CloudSyncStatus = "idle" | "loading" | "saving" | "saved" | "offline";

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
};

const AlbumStateContext = createContext<AlbumStateContextValue | null>(null);

export function AlbumStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlbumState>(initializeAlbumState);
  const [isReady, setIsReady] = useState(false);
  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>("loading");
  const [isCloudReady, setIsCloudReady] = useState(false);

  const stateRef = useRef<AlbumState>(state);
  const applyingCloudStateRef = useRef(false);
  const dirtyRef = useRef(false);
  const localRevisionRef = useRef(0);
  const isSavingRef = useRef(false);
  const saveDebouncePendingRef = useRef(false);
  const refreshInFlightRef = useRef(false);
  const cloudWritesEnabledRef = useRef(false);
  const lastCloudUpdatedAtRef = useRef<string | null>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const persistStateToCloud = useCallback(
    async (snapshot: AlbumState, revision: number): Promise<void> => {
      isSavingRef.current = true;
      setCloudStatus("saving");

      try {
        const savedSnapshot = await saveCloudAlbumState(snapshot);
        if (!savedSnapshot) return;

        lastCloudUpdatedAtRef.current = savedSnapshot.updatedAt;

        if (revision === localRevisionRef.current && snapshot === stateRef.current) {
          dirtyRef.current = false;
          setCloudStatus("saved");
        }
      } catch {
        setCloudStatus("offline");
      } finally {
        isSavingRef.current = false;
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    const hydrationTask = window.setTimeout(async () => {
      const localState = loadAlbumState(window.localStorage);
      stateRef.current = localState;

      if (!active) return;
      setState(localState);
      setIsReady(true);

      try {
        const user = await getCurrentUser();
        if (!active) return;

        setCloudUser(user);

        if (!user) {
          setCloudStatus("idle");
          setIsCloudReady(true);
          return;
        }

        const cloudSnapshot = await loadCloudAlbumState();
        if (!active) return;

        if (cloudSnapshot) {
          cloudWritesEnabledRef.current = true;
          applyingCloudStateRef.current = true;
          stateRef.current = cloudSnapshot.state;
          lastCloudUpdatedAtRef.current = cloudSnapshot.updatedAt;
          saveAlbumState(window.localStorage, cloudSnapshot.state);
          setState(cloudSnapshot.state);
          setCloudStatus("saved");
        } else {
          cloudWritesEnabledRef.current = true;
          dirtyRef.current = true;
          const savedSnapshot = await saveCloudAlbumState(localState);

          if (savedSnapshot) {
            lastCloudUpdatedAtRef.current = savedSnapshot.updatedAt;
            dirtyRef.current = false;
            setCloudStatus("saved");
          }
        }
      } catch {
        setCloudStatus("offline");
      } finally {
        if (active) setIsCloudReady(true);
      }
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(hydrationTask);
    };
  }, []);

  useEffect(() => {
    stateRef.current = state;
    if (isReady) saveAlbumState(window.localStorage, state);
  }, [isReady, state]);

  useEffect(() => {
    if (!isReady || !isCloudReady || !cloudUser || !cloudWritesEnabledRef.current) return;

    if (applyingCloudStateRef.current) {
      applyingCloudStateRef.current = false;
      return;
    }

    dirtyRef.current = true;
    localRevisionRef.current += 1;
    saveDebouncePendingRef.current = true;
    setCloudStatus("saving");

    const cloudSaveTask = window.setTimeout(() => {
      saveDebouncePendingRef.current = false;
      const snapshot = stateRef.current;
      const revision = localRevisionRef.current;

      saveQueueRef.current = saveQueueRef.current.then(() =>
        persistStateToCloud(snapshot, revision),
      );
    }, 900);

    return () => {
      saveDebouncePendingRef.current = false;
      window.clearTimeout(cloudSaveTask);
    };
  }, [cloudUser, isCloudReady, isReady, persistStateToCloud, state]);

  useEffect(() => {
    if (!isCloudReady || !cloudUser) return;

    async function refreshFromCloud() {
      if (
        refreshInFlightRef.current ||
        isSavingRef.current ||
        saveDebouncePendingRef.current
      ) {
        return;
      }

      if (dirtyRef.current && cloudWritesEnabledRef.current) {
        await persistStateToCloud(stateRef.current, localRevisionRef.current);
        return;
      }

      refreshInFlightRef.current = true;

      try {
        const cloudSnapshot = await loadCloudAlbumState();
        if (dirtyRef.current || isSavingRef.current) return;

        if (!cloudSnapshot) {
          if (!cloudWritesEnabledRef.current) {
            cloudWritesEnabledRef.current = true;
            dirtyRef.current = true;
            await persistStateToCloud(stateRef.current, localRevisionRef.current);
          }
          return;
        }

        cloudWritesEnabledRef.current = true;

        const cloudTime = Date.parse(cloudSnapshot.updatedAt);
        const localCloudTime = lastCloudUpdatedAtRef.current
          ? Date.parse(lastCloudUpdatedAtRef.current)
          : 0;

        if (lastCloudUpdatedAtRef.current === null || cloudTime > localCloudTime) {
          applyingCloudStateRef.current = true;
          stateRef.current = cloudSnapshot.state;
          lastCloudUpdatedAtRef.current = cloudSnapshot.updatedAt;
          saveAlbumState(window.localStorage, cloudSnapshot.state);
          setState(cloudSnapshot.state);
        }

        setCloudStatus("saved");
      } catch {
        setCloudStatus("offline");
      } finally {
        refreshInFlightRef.current = false;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") void refreshFromCloud();
    }

    const interval = window.setInterval(() => void refreshFromCloud(), 10_000);
    window.addEventListener("focus", refreshFromCloud);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshFromCloud);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cloudUser, isCloudReady, persistStateToCloud]);

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
      setCloudStatus("loading");
      await signInWithGoogleCloud();
      return true;
    } catch {
      setCloudStatus("offline");
      return false;
    }
  }

  async function signOut(): Promise<boolean> {
    try {
      await signOutCloud();
      dirtyRef.current = false;
      cloudWritesEnabledRef.current = false;
      setCloudUser(null);
      setCloudStatus("idle");
      return true;
    } catch {
      setCloudStatus("offline");
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
