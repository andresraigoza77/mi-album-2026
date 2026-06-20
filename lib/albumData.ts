import type {
  AlbumDataGroup,
  AlbumGroup,
  SpecialStickerCollection,
  Team,
} from "@/lib/types";

export const albumData = [
  {
    group: "A",
    teams: [
      { code: "MEX", name: "México" },
      { code: "RSA", name: "Sudáfrica" },
      { code: "KOR", name: "Corea del Sur" },
      { code: "CZE", name: "Rep. Checa" },
    ],
  },
  {
    group: "B",
    teams: [
      { code: "CAN", name: "Canadá" },
      { code: "BIH", name: "Bosnia" },
      { code: "QAT", name: "Qatar" },
      { code: "SUI", name: "Suiza" },
    ],
  },
  {
    group: "C",
    teams: [
      { code: "BRA", name: "Brasil" },
      { code: "MAR", name: "Marruecos" },
      { code: "HAI", name: "Haití" },
      { code: "SCO", name: "Escocia" },
    ],
  },
  {
    group: "D",
    teams: [
      { code: "USA", name: "EE. UU." },
      { code: "PAR", name: "Paraguay" },
      { code: "AUS", name: "Australia" },
      { code: "TUR", name: "Turquía" },
    ],
  },
  {
    group: "E",
    teams: [
      { code: "GER", name: "Alemania" },
      { code: "CUW", name: "Curazao" },
      { code: "CIV", name: "Costa de Marfil" },
      { code: "ECU", name: "Ecuador" },
    ],
  },
  {
    group: "F",
    teams: [
      { code: "NED", name: "Países Bajos" },
      { code: "JPN", name: "Japón" },
      { code: "SWE", name: "Suecia" },
      { code: "TUN", name: "Túnez" },
    ],
  },
  {
    group: "G",
    teams: [
      { code: "BEL", name: "Bélgica" },
      { code: "EGY", name: "Egipto" },
      { code: "IRN", name: "Irán" },
      { code: "NZL", name: "Nueva Zelanda" },
    ],
  },
  {
    group: "H",
    teams: [
      { code: "ESP", name: "España" },
      { code: "CPV", name: "Cabo Verde" },
      { code: "KSA", name: "Arabia Saudita" },
      { code: "URU", name: "Uruguay" },
    ],
  },
  {
    group: "I",
    teams: [
      { code: "FRA", name: "Francia" },
      { code: "SEN", name: "Senegal" },
      { code: "IRQ", name: "Irak" },
      { code: "NOR", name: "Noruega" },
    ],
  },
  {
    group: "J",
    teams: [
      { code: "ARG", name: "Argentina" },
      { code: "ALG", name: "Argelia" },
      { code: "AUT", name: "Austria" },
      { code: "JOR", name: "Jordania" },
    ],
  },
  {
    group: "K",
    teams: [
      { code: "POR", name: "Portugal" },
      { code: "COD", name: "R. D. Congo" },
      { code: "UZB", name: "Uzbekistán" },
      { code: "COL", name: "Colombia" },
    ],
  },
  {
    group: "L",
    teams: [
      { code: "ENG", name: "Inglaterra" },
      { code: "CRO", name: "Croacia" },
      { code: "GHA", name: "Ghana" },
      { code: "PAN", name: "Panamá" },
    ],
  },
] as const satisfies readonly AlbumDataGroup[];

export const stickersPerTeam = 20;
export const STICKERS_PER_TEAM = stickersPerTeam;

export const specialStickers: SpecialStickerCollection = {
  code: "SPECIAL",
  name: "Especiales",
  stickers: Array.from({ length: 18 }, (_, index) => index + 1),
};

export const albumGroups: readonly AlbumGroup[] = albumData.map(({ group, teams }) => ({
  code: group,
  name: `Grupo ${group}`,
  teams: teams.map<Team>((team) => ({
    ...team,
    group,
    stickerCount: stickersPerTeam,
  })),
}));

export const albumTeams: readonly Team[] = albumGroups.flatMap((group) => group.teams);

export const totalTeams = albumTeams.length;
export const totalTeamStickers = totalTeams * stickersPerTeam;
export const totalStickers = totalTeamStickers + specialStickers.stickers.length;

export function getTeamByCode(code: string): Team | undefined {
  return albumTeams.find((team) => team.code.toLowerCase() === code.toLowerCase());
}
