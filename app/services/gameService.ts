const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100/api/juegos';

export interface Reseña {
  _id?: string;
  juegoId: string;
  nombreUsuario: string;
  textoReseña: string;
  calificaciones: number;
  horasJugadas: number;
  dificultad: string;
  recomendaria: boolean;
  fechaCreacion?: string;
}

export interface Game {
  _id?: string;
  titulo: string;
  genero: string | string[];
  plataforma: string | string[];
  añoLanzamiento: number;
  desarrollador: string;
  imagenPortada: string;
  descripcion: string;
  completado: boolean;
  fechaCreacion?: string;
  calificacion?: number;
  calificaciones?: number[];
  horasJugadas?: number;
  reseñas?: Reseña[];
}

interface GameStats {
  totalGames: number;
  completedGames: number;
  byPlatform: Record<string, number>;
  byGenre: Record<string, number>;
  byYear: Record<string, number>;
  averageRating: number;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const responseText = await response.text();
  let data: any;
  
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch (e) {
    console.error('Failed to parse response as JSON:', responseText);
    throw new Error(`Invalid server response: ${response.status} ${response.statusText}. Response: ${responseText.substring(0, 200)}`);
  }
  
  if (!response.ok) {
    const errorMessage = data?.message || 
                       data?.error?.message || 
                       data?.error ||
                       `Error (${response.status} ${response.statusText})`;
    
    console.error('Error response:', {
      status: response.status,
      statusText: response.statusText,
      data: data,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    throw new Error(errorMessage);
  }
  
  return data.data || data;
};

const handleNetworkError = (error: unknown, defaultMessage: string) => {
  console.error(defaultMessage, error);
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('No se pudo conectar con el servidor. Asegúrate de que el backend esté en ejecución y accesible en ' + API_URL);
    }
    throw error;
  }
  throw new Error(defaultMessage);
};

export const getGames = async (): Promise<Game[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    
    const data = await handleResponse<Game[]>(response);
    return data.map(game => ({
      ...game,
      añoLanzamiento: game.añoLanzamiento ? Number(game.añoLanzamiento) : 0,
      calificacion: game.calificacion ? Number(game.calificacion) : 0,
      horasJugadas: game.horasJugadas ? Number(game.horasJugadas) : 0,
      completado: Boolean(game.completado)
    }));
  } catch (error) {
    return handleNetworkError(error, 'Error al obtener los juegos');
  }
};

export const getGame = async (id: string): Promise<Game> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      cache: 'no-store'
    });
    
    const game = await handleResponse<Game>(response);
    return {
      ...game,
      añoLanzamiento: game.añoLanzamiento ? Number(game.añoLanzamiento) : 0,
      calificacion: game.calificacion ? Number(game.calificacion) : 0,
      horasJugadas: game.horasJugadas ? Number(game.horasJugadas) : 0,
      completado: Boolean(game.completado)
    };
  } catch (error) {
    return handleNetworkError(error, `Error al obtener el juego con ID: ${id}`);
  }
};

export const createGame = async (game: Omit<Game, '_id'>): Promise<Game> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    });
    
    return handleResponse<Game>(response);
  } catch (error) {
    return handleNetworkError(error, 'Error al crear el juego');
  }
};

export const updateGame = async (id: string, game: Partial<Game>): Promise<Game> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    });
    
    return handleResponse<Game>(response);
  } catch (error) {
    return handleNetworkError(error, `Error al actualizar el juego con ID: ${id}`);
  }
};

export const deleteGame = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      await handleResponse<void>(response);
    }
  } catch (error) {
    return handleNetworkError(error, `Error al eliminar el juego con ID: ${id}`);
  }
};

export const rateGame = async (id: string, calificacion: number): Promise<Game> => {
  return updateGame(id, { calificacion });
};

export const getGameStats = async (): Promise<GameStats> => {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      cache: 'no-store'
    });
    
    return handleResponse<GameStats>(response);
  } catch (error) {
    return handleNetworkError(error, 'Error al obtener las estadísticas de los juegos');
  }
};

export const addReseña = async (juegoId: string, reseña: Omit<Reseña, '_id' | 'juegoId' | 'fechaCreacion'>): Promise<Reseña> => {
  try {
    const response = await fetch(`${API_URL}/${juegoId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reseña)
    });
    
    return handleResponse<Reseña>(response);
  } catch (error) {
    return handleNetworkError(error, 'Error al agregar la reseña');
  }
};

export const getReseñas = async (juegoId: string): Promise<Reseña[]> => {
  try {
    const response = await fetch(`${API_URL}/${juegoId}/reviews`, {
      cache: 'no-store'
    });
    
    return handleResponse<Reseña[]>(response);
  } catch (error) {
    return handleNetworkError(error, 'Error al obtener las reseñas');
  }
};
