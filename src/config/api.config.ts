// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100';

export const API_ENDPOINTS = {
  GAMES: `${API_BASE_URL}/api/juegos`,
  // Podemos agregar más endpoints aquí según sea necesario
};

export const fetchAPI = async (url: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la solicitud');
  }

  return response.json();
};
