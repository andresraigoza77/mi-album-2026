export const GROUP_CODES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

export type GroupCode = (typeof GROUP_CODES)[number];

export type StickerStatus = "missing" | "owned" | "duplicate";

export type AlbumDataTeam = {
  code: string;
  name: string;
};

export type AlbumDataGroup = {
  group: GroupCode;
  teams: readonly AlbumDataTeam[];
};

export type Team = {
  code: string;
  name: string;
  group: GroupCode;
  stickerCount: number;
};

export type AlbumGroup = {
  code: GroupCode;
  name: string;
  teams: readonly Team[];
};

export type Sticker = {
  number: number;
  teamCode: string;
  status: StickerStatus;
};

export type TeamStickerState = readonly StickerStatus[];

export type AlbumState = Readonly<Record<string, TeamStickerState>>;

export type StickerReference = Sticker & {
  teamName: string;
};

export type AlbumProgress = {
  total: number;
  collected: number;
  missing: number;
  duplicates: number;
  percentage: number;
};

export type SpecialStickerCollection = {
  code: "SPECIAL";
  name: string;
  stickers: readonly number[];
};
