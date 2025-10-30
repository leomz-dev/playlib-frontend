'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Star, Clock, Calendar, Gamepad2, Play, Trash2 } from 'lucide-react';
import { Game } from '../services/gameService';
import { rateGame } from '../services/gameService';

interface GameCardProps extends Omit<Game, 'fechaCreacion' | 'completado'> {
  calificaciones?: number[];
  onRatingChange?: (id: string, rating: number) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function GameCard({
  _id,
  titulo,
  genero,
  plataforma,
  imagenPortada,
  horasJugadas = 0,
  calificacion = 0,
  calificaciones = [],
  añoLanzamiento,
  desarrollador,
  descripcion,
  onRatingChange,
  onDelete,
  showActions = true,
}: GameCardProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate average rating from calificaciones array or use calificacion as fallback
  const calculateAverageRating = (ratings: number[] = []) => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    return sum / ratings.length;
  };

  // Use the average of calificaciones if available, otherwise use calificacion
  const averageRating = calificaciones && calificaciones.length > 0 
    ? calculateAverageRating(calificaciones)
    : calificacion || 0;

  // Función segura para formatear números
  const formatNumber = (value: any, decimals: number = 1): string => {
    const num = Number(value);
    return isNaN(num) ? '0' : num.toFixed(decimals);
  };

  // Valores formateados seguros
  const formattedCalificacion = formatNumber(averageRating);
  const formattedHorasJugadas = formatNumber(horasJugadas, 0);
  const formattedAñoLanzamiento = añoLanzamiento ? añoLanzamiento.toString() : 'N/A';

  const handleRating = async (rating: number) => {
    if (!_id || isLoading) return;
    
    // Validación simple de rating
    const safeRating = Math.max(0, Math.min(5, rating || 0));
    
    setIsLoading(true);
    setError(null);
    
    try {
      await rateGame(_id, safeRating);
      onRatingChange?.(_id, safeRating);
    } catch (err) {
      console.error('Error al calificar el juego:', err);
      setError('Error al calificar el juego. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!_id || !onDelete) return;
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${titulo}"?`)) {
      onDelete(_id);
    }
  };

  const renderStars = () => {
    const stars = [];
    const rating = hoverRating || averageRating || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`text-${i <= rating ? 'yellow-400' : 'gray-400'} text-xl`}
          onClick={() => handleRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        >
          {i <= rating ? '★' : '☆'}
        </button>
      );
    }
    return stars;
  };

  const getPlatformIcon = (platform: string) => {
    return <Gamepad2 className="w-4 h-4" />;
  };

  return (
    <div 
      className={`relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform ${isHovered ? 'scale-105 shadow-xl' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Image */}
      <div className="relative h-48 bg-gray-700 overflow-hidden">
        {imagenPortada ? (
          <Image
            src={imagenPortada}
            alt={titulo}
            fill
            className="object-cover transition-opacity duration-300"
            style={{ opacity: isHovered ? 0.8 : 1 }}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <Gamepad2 className="w-16 h-16 text-gray-600" />
          </div>
        )}
        
        
        {/* Play Button on Hover */}
        {isHovered && (
          <button className="absolute inset-0 m-auto w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-black hover:bg-opacity-100 transition-all duration-300">
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </button>
        )}
      </div>
      
      {/* Game Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white truncate">{titulo}</h3>
          <div className="flex items-center bg-black/50 bg-opacity-20 text-yellow-400 px-2 py-1 rounded text-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'fill-yellow-400' : 'fill-gray-500 text-gray-500'}`} 
              />
            ))}
            <span className="ml-1">{formattedCalificacion}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <Gamepad2 className="w-4 h-4 mr-1" />
          <span className="mr-3">{plataforma}</span>
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formattedAñoLanzamiento}</span>
        </div>
        
        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formattedHorasJugadas} horas</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Género: {genero}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between">
          <Link 
            href={`/game/${_id}`}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Ver detalles
          </Link>
          
          <div className="flex space-x-2">
            {showActions && onDelete && (
              <button 
                onClick={handleDelete}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                title="Eliminar juego"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-2 text-red-400 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
}
