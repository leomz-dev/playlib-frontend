'use client';

import React, { useState } from 'react';
import { createGame } from '../services/gameService';

export default function AddGameForm({ onGameAdded }: { onGameAdded?: () => void }) {
  const [formData, setFormData] = useState({
    titulo: '',
    genero: [] as string[],
    plataforma: [] as string[],
    añoLanzamiento: new Date().getFullYear(),
    desarrollador: '',
    imagenPortada: '',
    descripcion: '',
    completado: false,
    horasJugadas: 0,
    calificacion: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
      const currentArray = prev[name];
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
    setError('');
    setIsSubmitting(true);

    try {
      await createGame({
        ...formData,
        añoLanzamiento: Number(formData.añoLanzamiento),
        horasJugadas: Number(formData.horasJugadas),
        calificacion: Number(formData.calificacion),
      });

      if (onGameAdded) {
        onGameAdded();
      }

      // Reset form
      setFormData({
        titulo: '',
        genero: [],
        plataforma: [],
        añoLanzamiento: new Date().getFullYear(),
        desarrollador: '',
        imagenPortada: '',
        descripcion: '',
        completado: false,
        horasJugadas: 0,
        calificacion: 0,
      });

    } catch (error: unknown) {
      let errorMessage = 'Error al agregar el juego. Por favor, inténtalo de nuevo.';

      if (error instanceof Error) {
        console.error('Error adding game:', error);
        errorMessage = error.message || errorMessage;
      } else {
        console.error('Unexpected error adding game:', error);
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const platforms = [
    'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X|S',
    'Xbox One', 'Nintendo Switch', 'Mobile', 'Otra'
  ];

  const genres = [
    'Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Carreras',
    'Disparos', 'Lucha', 'Plataformas', 'Puzzle', 'Simulación', 'Terror'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-xl bg-black/40 border border-red-500/30 p-8 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.2)]">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700 mb-6">Agregar Nuevo Juego</h2>

      {error && (
        <div className="p-4 backdrop-blur-md bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Título *</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Géneros *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-black/20 rounded-xl border border-red-500/20">
            {genres.map(genre => (
              <label key={genre} className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.genero.includes(genre)}
                    onChange={(e) => handleArrayChange('genero', genre, e.target.checked)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-red-500/50 bg-black/40 transition-all checked:border-red-500 checked:bg-red-500 hover:border-red-400"
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
                <span className="text-sm text-gray-400 group-hover:text-red-400 transition-colors">{genre}</span>
              </label>
            ))}
          </div>
          {formData.genero.length === 0 && (
            <p className="text-xs text-red-400 mt-1">Selecciona al menos un género</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Plataformas *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-black/20 rounded-xl border border-red-500/20">
            {platforms.map(platform => (
              <label key={platform} className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    value={platform}
                    checked={formData.plataforma.includes(platform)}
                    onChange={(e) => handleArrayChange('plataforma', platform, e.target.checked)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-red-500/50 bg-black/40 transition-all checked:border-red-500 checked:bg-red-500 hover:border-red-400"
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
                <span className="text-sm text-gray-400 group-hover:text-red-400 transition-colors">{platform}</span>
              </label>
            ))}
          </div>
          {formData.plataforma.length === 0 && (
            <p className="text-xs text-red-400 mt-1">Selecciona al menos una plataforma</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Año de lanzamiento</label>
          <input
            type="number"
            name="añoLanzamiento"
            min="1970"
            max={new Date().getFullYear() + 1}
            value={formData.añoLanzamiento}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Desarrollador</label>
          <input
            type="text"
            name="desarrollador"
            value={formData.desarrollador}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">URL de la imagen de portada</label>
          <input
            type="url"
            name="imagenPortada"
            value={formData.imagenPortada}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Horas jugadas</label>
          <input
            type="number"
            name="horasJugadas"
            min="0"
            step="0.5"
            value={formData.horasJugadas}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
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
            value={formData.calificacion}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="completado"
            name="completado"
            checked={formData.completado}
            onChange={handleChange}
            className="h-4 w-4 text-red-500 bg-black/40 rounded border-red-500/30 focus:ring-red-500"
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
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => {
            // Reset form
            setFormData({
              titulo: '',
              genero: [],
              plataforma: [],
              añoLanzamiento: new Date().getFullYear(),
              desarrollador: '',
              imagenPortada: '',
              descripcion: '',
              completado: false,
              horasJugadas: 0,
              calificacion: 0,
            });
            setError('');
          }}
          className="px-6 py-3 text-sm font-medium text-gray-300 bg-black/20 backdrop-blur-md border border-red-500/30 rounded-xl hover:bg-red-500/10 hover:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Agregando...' : 'Agregar Juego'}
        </button>
      </div>
    </form>
  );
}
