import { useState, useEffect } from 'react';
import { gamesService } from '../services/games.service';
import { GameStatsState } from '../types/games.types';

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStatsState>({
    totalGames: 0,
    completedGames: 0,
    completionRate: 0,
    platformDistribution: [],
    genreDistribution: [],
    monthlyData: [],
    topGames: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const gameStats = await gamesService.getGameStats();
        setStats(prev => ({
          ...prev,
          ...gameStats,
          loading: false,
          error: null
        }));
      } catch (error) {
        console.error('Error fetching game stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar las estadísticas. Intenta de nuevo más tarde.'
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
