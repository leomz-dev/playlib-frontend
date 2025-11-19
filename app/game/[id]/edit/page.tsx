'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Game, getGame, updateGame } from '../../../services/gameService';

export default function EditGamePage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Game>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchGame = async () => {
        try {
          const game = await getGame(id as string);
          // Normalize genres and platforms to arrays if they are strings
          setFormData({
            ...game,
            genero: Array.isArray(game.genero) ? game.genero : (game.genero ? [game.genero] : []),
            plataforma: Array.isArray(game.plataforma) ? game.plataforma : (game.plataforma ? [game.plataforma] : [])
          });
        } catch (error) {
          setError('Error al cargar los datos del juego.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchGame();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayChange = (name: 'genero' | 'plataforma', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev[name] as string[]) || [];
      let newArray;
      if (checked) {
        newArray = [...currentArray, value];
      } else {
        newArray = currentArray.filter(item => item !== value);
      }
      return {
        ...prev,
        [name]: newArray
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await updateGame(id as string, {
        ...formData,
        añoLanzamiento: Number(formData.añoLanzamiento),
        horasJugadas: Number(formData.horasJugadas),
        calificacion: Number(formData.calificacion),
      });
      router.push(`/game/${id}`);
    } catch (error: unknown) {
      let errorMessage = 'Error al actualizar el juego. Por favor, inténtalo de nuevo.';
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  const platforms = [
    'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X|S',
    'Xbox One', 'Nintendo Switch', 'Mobile', 'Otra'
  ];

  const genres = [
    'Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Carreras',
    'Disparos', 'Lucha', 'Plataformas', 'Puzzle', 'Simulación', 'Terror'
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a1a1a] p-6 rounded-lg border border-[#2a2a2a]">
          <h2 className="text-2xl font-bold text-white mb-6">Editar Juego</h2>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo || ''}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Géneros *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#2a2a2a] rounded-md border border-[#3a3a3a]">
                {genres.map(genre => (
                  <label key={genre} className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        value={genre}
                        checked={(formData.genero as string[] || []).includes(genre)}
                        onChange={(e) => handleArrayChange('genero', genre, e.target.checked)}
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-600 bg-[#1a1a1a] transition-all checked:border-[#ff4757] checked:bg-[#ff4757] hover:border-[#ff4757]"
                      />
                      <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity peer-checked:opacity-100"
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.5L3.5 6L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-[#ff4757] transition-colors">{genre}</span>
                  </label>
                ))}
              </div>
              {(!formData.genero || formData.genero.length === 0) && (
                <p className="text-xs text-[#ff4757] mt-1">Selecciona al menos un género</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Plataformas *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#2a2a2a] rounded-md border border-[#3a3a3a]">
                {platforms.map(platform => (
                  <label key={platform} className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        value={platform}
                        checked={(formData.plataforma as string[] || []).includes(platform)}
                        onChange={(e) => handleArrayChange('plataforma', platform, e.target.checked)}
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-600 bg-[#1a1a1a] transition-all checked:border-[#ff4757] checked:bg-[#ff4757] hover:border-[#ff4757]"
                      />
                      <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity peer-checked:opacity-100"
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 3.5L3.5 6L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-[#ff4757] transition-colors">{platform}</span>
                  </label>
                ))}
              </div>
              {(!formData.plataforma || formData.plataforma.length === 0) && (
                <p className="text-xs text-[#ff4757] mt-1">Selecciona al menos una plataforma</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Año de lanzamiento</label>
              <input
                type="number"
                name="añoLanzamiento"
                min="1970"
                max={new Date().getFullYear() + 1}
                value={formData.añoLanzamiento || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Desarrollador</label>
              <input
                type="text"
                name="desarrollador"
                value={formData.desarrollador || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">URL de la imagen de portada</label>
              <input
                type="url"
                name="imagenPortada"
                value={formData.imagenPortada || ''}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Horas jugadas</label>
              <input
                type="number"
                name="horasJugadas"
                min="0"
                step="0.5"
                value={formData.horasJugadas || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Calificación (0-5)</label>
              <input
                type="number"
                name="calificacion"
                min="0"
                max="5"
                step="0.5"
                value={formData.calificacion || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="completado"
                name="completado"
                checked={formData.completado || false}
                onChange={handleChange}
                className="h-4 w-4 text-[#ff4757] rounded border-gray-600 focus:ring-[#ff4757]"
              />
              <label htmlFor="completado" className="text-sm font-medium text-gray-300">
                Completado
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Descripción</label>
            <textarea
              name="descripcion"
              rows={4}
              value={formData.descripcion || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-[#ff4757] rounded-md hover:bg-[#ff3742] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4757] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
