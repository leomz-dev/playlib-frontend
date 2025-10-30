'use client';

import React, { useState } from 'react';
import { createGame } from '../services/gameService';

export default function AddGameForm({ onGameAdded }: { onGameAdded?: () => void }) {
  const [formData, setFormData] = useState({
    titulo: '',
    genero: '',
    plataforma: 'PC',
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
        genero: '',
        plataforma: 'PC',
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#1a1a1a] p-6 rounded-lg border border-[#2a2a2a]">
      <h2 className="text-2xl font-bold text-white mb-6">Agregar Nuevo Juego</h2>
      
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
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Género *</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
          >
            <option value="">Seleccionar género</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Plataforma *</label>
          <select
            name="plataforma"
            value={formData.plataforma}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
          >
            {platforms.map(platform => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
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
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Desarrollador</label>
          <input
            type="text"
            name="desarrollador"
            value={formData.desarrollador}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
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
            value={formData.horasJugadas}
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
            value={formData.calificacion}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="completado"
            name="completado"
            checked={formData.completado}
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
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#ff4757]"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => {
            // Reset form
            setFormData({
              titulo: '',
              genero: '',
              plataforma: 'PC',
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
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-[#ff4757] rounded-md hover:bg-[#ff3742] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4757] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Agregando...' : 'Agregar Juego'}
        </button>
      </div>
    </form>
  );
}
