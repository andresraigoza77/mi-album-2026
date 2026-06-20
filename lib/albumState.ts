import { albumTeams } from "@/lib/albumData";
import { ownedFromChecklist } from "@/lib/ownedFromChecklist";
import type {
  AlbumProgress,
  AlbumState,
  StickerReference,
  StickerStatus,
  Team,
} from "@/lib/types";

export const INITIAL_STICKER_STATUS: StickerStatus = "missing";

const nextStatus: Record<StickerStatus, StickerStatus> = {
  missing: "owned",
  owned: "duplicate",
  duplicate: "missing",
};

/** Creates a fresh album state without mutating the team data. */
export function initializeAlbumState(teams: readonly Team[] = albumTeams): AlbumState {
  return Object.fromEntries(
    teams.map((team) => [
      team.code,
      Array.from<StickerStatus>({ length: team.stickerCount }).fill(INITIAL_STICKER_STATUS),
    ]),
  );
}

/** Creates a fresh state using the owned stickers read from the physical checklist. */
export function createStateFromOwnedChecklist(
  teams: readonly Team[] = albumTeams,
): AlbumState {
  const initialState = initializeAlbumState(teams);
  const nextState: Record<string, StickerStatus[]> = Object.fromEntries(
    Object.entries(initialState).map(([teamCode, stickers]) => [teamCode, [...stickers]]),
  );

  for (const [teamCode, stickerNumbers] of Object.entries(ownedFromChecklist)) {
    const teamStickers = nextState[teamCode];

    if (!teamStickers) {
      throw new Error(`El equipo ${teamCode} de la checklist no existe en el álbum.`);
    }

    for (const stickerNumber of stickerNumbers) {
      if (!Number.isInteger(stickerNumber) || stickerNumber < 1 || stickerNumber > 20) {
        throw new RangeError(
          `La figurita ${stickerNumber} de ${teamCode} está fuera del rango 1–20.`,
        );
      }

      if (stickerNumber > teamStickers.length) {
        throw new RangeError(
          `La figurita ${stickerNumber} no existe en el estado del equipo ${teamCode}.`,
        );
      }

      teamStickers[stickerNumber - 1] = "owned";
    }
  }

  return nextState;
}

/** Returns the next value in the missing → owned → duplicate → missing cycle. */
export function getNextStickerStatus(status: StickerStatus): StickerStatus {
  return nextStatus[status];
}

/** Returns a new state with one sticker advanced by one status. */
export function changeStickerState(
  state: AlbumState,
  teamCode: string,
  stickerNumber: number,
): AlbumState {
  const resolvedCode = resolveTeamCode(state, teamCode);
  const teamStickers = state[resolvedCode];
  const index = stickerNumber - 1;

  if (!Number.isInteger(stickerNumber) || index < 0 || index >= teamStickers.length) {
    throw new RangeError(`La figurita ${stickerNumber} no existe en el equipo ${resolvedCode}.`);
  }

  const updatedTeam: StickerStatus[] = [...teamStickers];
  updatedTeam[index] = getNextStickerStatus(updatedTeam[index]);

  return {
    ...state,
    [resolvedCode]: updatedTeam,
  };
}

/** Calculates collection totals. Duplicate stickers count as collected. */
export function calculateTotalProgress(state: AlbumState): AlbumProgress {
  return calculateProgress(Object.values(state).flat());
}

/** Calculates progress for one team. Duplicate stickers count as collected. */
export function calculateTeamProgress(state: AlbumState, teamCode: string): AlbumProgress {
  return calculateProgress(state[resolveTeamCode(state, teamCode)]);
}

export function getMissingStickers(
  state: AlbumState,
  teams: readonly Team[] = albumTeams,
): StickerReference[] {
  return getStickersByStatus(state, "missing", teams);
}

export function getDuplicateStickers(
  state: AlbumState,
  teams: readonly Team[] = albumTeams,
): StickerReference[] {
  return getStickersByStatus(state, "duplicate", teams);
}

function calculateProgress(stickers: readonly StickerStatus[]): AlbumProgress {
  const total = stickers.length;
  const missing = stickers.filter((status) => status === "missing").length;
  const duplicates = stickers.filter((status) => status === "duplicate").length;
  const collected = total - missing;

  return {
    total,
    collected,
    missing,
    duplicates,
    percentage: total === 0 ? 0 : Math.round((collected / total) * 100),
  };
}

function getStickersByStatus(
  state: AlbumState,
  status: StickerStatus,
  teams: readonly Team[],
): StickerReference[] {
  return teams.flatMap((team) => {
    const resolvedCode = findTeamCode(state, team.code);
    if (!resolvedCode) return [];

    return state[resolvedCode].flatMap((stickerStatus, index) =>
      stickerStatus === status
        ? [
            {
              number: index + 1,
              teamCode: team.code,
              teamName: team.name,
              status,
            },
          ]
        : [],
    );
  });
}

function findTeamCode(state: AlbumState, teamCode: string): string | undefined {
  return Object.keys(state).find((code) => code.toLowerCase() === teamCode.toLowerCase());
}

function resolveTeamCode(state: AlbumState, teamCode: string): string {
  const resolvedCode = findTeamCode(state, teamCode);

  if (!resolvedCode) {
    throw new Error(`El equipo ${teamCode} no existe en el estado del álbum.`);
  }

  return resolvedCode;
}
