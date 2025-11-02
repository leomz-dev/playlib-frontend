'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Star, Clock, Calendar, Play, Trash2 } from 'lucide-react';
import { Icon } from '@iconify/react';
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

  // Función para obtener el estilo y el ícono según la plataforma
  const getPlatformStyles = (platform: string) => {
    const platformLower = platform.toLowerCase();
    
    if (platformLower.includes('playstation')) {
      return {
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        icon: <Icon icon="tabler:device-gamepad-2" width="16" height="16" className="text-white" />
      };
    }
    if (platformLower.includes('xbox')) {
      return {
        bgColor: 'bg-green-600',
        textColor: 'text-white',
        icon: <Icon icon="tabler:brand-xbox" width="16" height="16" className="text-white" />
      };
    }
    if (platformLower.includes('nintendo') || platformLower.includes('switch')) {
      return {
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        icon: <Icon icon="tabler:device-nintendo" width="16" height="16" className="text-white" />
      };
    }
    if (platformLower.includes('mobile') || platformLower.includes('android') || platformLower.includes('ios')) {
      return {
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        icon: <Icon icon="tabler:device-mobile" width="16" height="16" className="text-white" />
      };
    }
    // Por defecto (PC/Windows/Linux)
    return {
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
      icon: <Icon icon="tabler:devices-pc" width="16" height="16" className="text-white" />
    };
  };
  
  const platformStyles = getPlatformStyles(plataforma);
  
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

  return (
    <div 
      className={`relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform ${isHovered ? 'scale-105 -translate-y-1' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Image with Gradient Overlay */}
      <div className="relative h-48 bg-gray-800 overflow-hidden">
        {imagenPortada ? (
          <>
            <Image
              src={imagenPortada}
              alt={titulo}
              fill
              className="object-cover transition-all duration-500"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {platformStyles.icon}
          </div>
        )}
        
        {/* Platform Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className={`flex items-center px-3 py-1 rounded-full ${platformStyles.bgColor} ${platformStyles.textColor} shadow-lg`}>
            {platformStyles.icon}
            <span className="ml-1 text-xs font-semibold">{plataforma}</span>
          </div>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 text-sm font-semibold text-white">{formattedCalificacion}</span>
        </div>
      </div>
      
      {/* Game Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-xl text-white mb-1 line-clamp-1">{titulo}</h3>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formattedAñoLanzamiento}</span>
            <span className="mx-2">•</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{formattedHorasJugadas}h</span>
          </div>
        </div>
        
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {genero.split(',').map((g, i) => (
            <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
              {g.trim()}
            </span>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <Link 
            href={`/game/${_id}`}
            className="flex-1 mr-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold text-center transition-colors flex items-center justify-center"
          >
            <Play className="w-4 h-4 mr-2" />
            Ver más
          </Link>
          
          {showActions && onDelete && (
            <button 
              onClick={handleDelete}
              className="p-2.5 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
              title="Eliminar juego"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {error && (
          <div className="mt-2 text-red-400 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
}
