export interface GameByHours {
  name: string;
  hours: number;
  platform: string;
  year: number;
}

export interface GameStat {
  totalGames: number;
  completedGames: number;
  completionRate: number;
  platformDistribution: Array<{ name: string; value: number }>;
  genreDistribution: Array<{ name: string; value: number }>;
  monthlyData: Array<{ month: string; count: number }>;
  topGames: Array<{ name: string; hours: number; year: number }>;
  gamesByHours: GameByHours[];
}

export interface GameStatsState extends GameStat {
  loading: boolean;
  error: string | null;
}

export interface Game {
  _id: string;
  titulo: string;
  genero: string;
  plataforma: string;
  añoLanzamiento: number;
  desarrollador: string;
  imagenPortada?: string;
  descripcion?: string;
  completado: boolean;
  fechaCreacion: string;
}
