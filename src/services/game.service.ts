import { API_ENDPOINTS, fetchAPI } from '../config/api.config';
import { Game } from '../types/games.types';

export const gamesService = {
    // Obtener todos los juegos
    getAllGames: async (): Promise<Game[]> => {
        try {
            const response = await fetchAPI(API_ENDPOINTS.GAMES);
            // Asegurarnos de que la respuesta tenga la propiedad data y sea un array
            if (response && Array.isArray(response.data)) {
                return response.data;
            }
            console.warn('Unexpected response format:', response);
            return [];
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    },

    // Obtener estadísticas de juegos
    getGameStats: async () => {
        try {
            // Primero obtenemos todos los juegos
            const games = await gamesService.getAllGames();

            // Calculamos las estadísticas
            const totalGames = games.length;
            const completedGames = games.filter(game => game.completado).length;
            const completionRate = totalGames > 0 ? (completedGames / totalGames) * 100 : 0;

            // Distribución por plataforma
            const platformCounts: Record<string, number> = {};
            games.forEach(game => {
                const platforms = Array.isArray(game.plataforma)
                    ? game.plataforma
                    : [game.plataforma || 'Desconocida'];

                platforms.forEach(platform => {
                    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
                });
            });

            // Distribución por género
            const genreCounts: Record<string, number> = {};
            games.forEach(game => {
                const genres = Array.isArray(game.genero)
                    ? game.genero
                    : [game.genero || 'Desconocido'];

                genres.forEach(genre => {
                    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                });
            });

            // Juegos por mes (últimos 12 meses)
            const monthlyCounts = Array(12).fill(0);
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            games.forEach(game => {
                const gameDate = new Date(game.fechaCreacion);
                const gameMonth = gameDate.getMonth();
                const gameYear = gameDate.getFullYear();

                // Solo contamos juegos del último año
                if (gameYear === currentYear || (gameYear === currentYear - 1 && gameMonth > currentMonth)) {
                    const monthsAgo = (currentMonth - gameMonth + 12) % 12;
                    if (monthsAgo < 12) {
                        monthlyCounts[11 - monthsAgo]++;
                    }
                }
            });

            // Meses para el gráfico
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const monthlyData = monthlyCounts.map((count, index) => ({
                month: monthNames[(currentMonth - 11 + index + 12) % 12],
                count
            }));

            // Top juegos por horas jugadas
            const topGamesByHours = [...games]
                .filter(game => game.horasJugadas && game.horasJugadas > 0)
                .sort((a, b) => (b.horasJugadas || 0) - (a.horasJugadas || 0))
                .slice(0, 5);

            // Top juegos (más recientes o más jugados)
            const topGames = [...games]
                .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
                .slice(0, 5)
                .map(game => ({
                    titulo: game.titulo,
                    plataforma: game.plataforma,
                    genero: game.genero,
                    año: game.añoLanzamiento,
                    completado: game.completado ? 'Sí' : 'No',
                    fecha: new Date(game.fechaCreacion).toLocaleDateString(),
                    horasJugadas: game.horasJugadas || 0
                }));

            // Datos para el gráfico de horas jugadas
            const gamesByHours = [...games]
                .filter(game => game.horasJugadas && game.horasJugadas > 0)
                .sort((a, b) => (b.horasJugadas || 0) - (a.horasJugadas || 0))
                .slice(0, 8); // Mostrar los 8 juegos con más horas jugadas

            // Prepare games by hours data for the chart
            const gamesByHoursData = gamesByHours.map(game => ({
                name: game.titulo,
                hours: game.horasJugadas || 0,
                platform: Array.isArray(game.plataforma) ? game.plataforma.join(', ') : (game.plataforma || 'Desconocida'),
                year: game.añoLanzamiento || new Date(game.fechaCreacion).getFullYear()
            }));

            return {
                totalGames,
                completedGames,
                completionRate: parseFloat(completionRate.toFixed(1)),
                platformDistribution: Object.entries(platformCounts).map(([name, value]) => ({
                    name,
                    value
                })),
                genreDistribution: Object.entries(genreCounts).map(([name, value]) => ({
                    name,
                    value
                })),
                monthlyData,
                topGames,
                topGamesByHours,
                gamesByHours: gamesByHoursData
            };
        } catch (error) {
            console.error('Error calculating game stats:', error);
            throw error;
        }
    }
};