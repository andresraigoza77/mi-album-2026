import { albumTeams } from "@/lib/albumData";
import { initializeAlbumState } from "@/lib/albumState";
import type { AlbumState, StickerStatus, Team } from "@/lib/types";

export const ALBUM_STORAGE_KEY = "mi-album-2026:progress";
export const ALBUM_STORAGE_VERSION = 1;

export type StoredAlbum = {
  version: number;
  state: AlbumState;
};

export type AlbumImportResult =
  | { success: true; state: AlbumState }
  | { success: false; error: string };

const validStatuses: readonly StickerStatus[] = ["missing", "owned", "duplicate"];

/** Parses and validates persisted data. Invalid or missing data produces a fresh state. */
export function parseStoredAlbumState(
  rawValue: string | null,
  teams: readonly Team[] = albumTeams,
): AlbumState {
  if (!rawValue) return initializeAlbumState(teams);

  const result = validateAlbumImport(rawValue, teams);
  return result.success ? result.state : initializeAlbumState(teams);
}

/** Validates an imported JSON document without modifying the current album. */
export function validateAlbumImport(
  rawValue: string,
  teams: readonly Team[] = albumTeams,
): AlbumImportResult {
  try {
    const stored: unknown = JSON.parse(rawValue);

    if (!isValidStoredAlbum(stored, teams)) {
      return {
        success: false,
        error: "El archivo no tiene una estructura de progreso válida o pertenece a otra versión.",
      };
    }

    return { success: true, state: stored.state };
  } catch {
    return { success: false, error: "El archivo no contiene JSON válido." };
  }
}

export function serializeAlbumState(state: AlbumState): string {
  const value: StoredAlbum = {
    version: ALBUM_STORAGE_VERSION,
    state,
  };

  return JSON.stringify(value, null, 2);
}

/** Reads progress safely. Browser storage errors also fall back to a fresh state. */
export function loadAlbumState(
  storage: Pick<Storage, "getItem">,
  teams: readonly Team[] = albumTeams,
): AlbumState {
  try {
    return parseStoredAlbumState(storage.getItem(ALBUM_STORAGE_KEY), teams);
  } catch {
    return initializeAlbumState(teams);
  }
}

/** Saves progress without allowing quota or privacy errors to break the app. */
export function saveAlbumState(
  storage: Pick<Storage, "setItem">,
  state: AlbumState,
): boolean {
  try {
    storage.setItem(ALBUM_STORAGE_KEY, serializeAlbumState(state));
    return true;
  } catch {
    return false;
  }
}

function isValidStoredAlbum(value: unknown, teams: readonly Team[]): value is StoredAlbum {
  if (!isRecord(value) || value.version !== ALBUM_STORAGE_VERSION) return false;

  const storedState = value.state;
  if (!isRecord(storedState)) return false;

  const expectedCodes = new Set(teams.map((team) => team.code));
  const storedCodes = Object.keys(storedState);

  if (storedCodes.length !== expectedCodes.size) return false;

  return teams.every((team) => {
    const stickers = storedState[team.code];

    return (
      Array.isArray(stickers) &&
      stickers.length === team.stickerCount &&
      stickers.every(isStickerStatus)
    );
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStickerStatus(value: unknown): value is StickerStatus {
  return typeof value === "string" && validStatuses.includes(value as StickerStatus);
}
