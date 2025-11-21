'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Star, Clock, Trophy } from 'lucide-react';
import { Game } from '../services/gameService';

// Interfaz para las propiedades de la tarjeta de juego
// Extiende la interfaz Game pero omite fechaCreacion y redefine reseñas
interface GameCardProps extends Omit<Game, 'fechaCreacion' | 'reseñas'> {
  reseñas?: Array<{ calificaciones?: number }>;
}

// Componente de tarjeta para mostrar un juego individual en la lista
export default function GameCard({
  _id,
  titulo,
  genero,
  plataforma,
  imagenPortada,
  horasJugadas = 0,
  añoLanzamiento,
  desarrollador,
  descripcion,
  completado,
  reseñas = [],
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calcular calificación promedio basada en las reseñas
  const calculateAverageRating = () => {
    if (!reseñas || reseñas.length === 0) return 0;
    const validRatings = reseñas
      .map(r => r.calificaciones)
      .filter((rating): rating is number => typeof rating === 'number' && rating > 0);

    if (validRatings.length === 0) return 0;
    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    return sum / validRatings.length;
  };

  const averageRating = calculateAverageRating();

  // Función segura para formatear números
  const formatNumber = (value: any, decimals: number = 1): string => {
    const num = Number(value);
    return isNaN(num) ? '0' : num.toFixed(decimals);
  };

  // Normalizar genero a array
  const generosArray = Array.isArray(genero) ? genero : [genero];

  // Función para obtener el color de fondo según el género
  const getGenreColor = (genre: string) => {
    const genreLower = genre.toLowerCase();

    if (genreLower.includes('acción') || genreLower.includes('action')) return 'from-red-500/30 to-red-600/30';
    if (genreLower.includes('aventura') || genreLower.includes('adventure')) return 'from-orange-500/30 to-orange-600/30';
    if (genreLower.includes('rpg') || genreLower.includes('rol')) return 'from-purple-500/30 to-purple-600/30';
    if (genreLower.includes('estrategia') || genreLower.includes('strategy')) return 'from-blue-500/30 to-blue-600/30';
    if (genreLower.includes('deporte') || genreLower.includes('sport')) return 'from-green-500/30 to-green-600/30';
    if (genreLower.includes('simulación') || genreLower.includes('simulation')) return 'from-cyan-500/30 to-cyan-600/30';
    if (genreLower.includes('puzzle') || genreLower.includes('rompecabezas')) return 'from-yellow-500/30 to-yellow-600/30';
    if (genreLower.includes('horror') || genreLower.includes('terror')) return 'from-gray-500/30 to-gray-900/30';
    if (genreLower.includes('shooter') || genreLower.includes('disparos')) return 'from-red-600/30 to-orange-600/30';
    if (genreLower.includes('plataforma') || genreLower.includes('platform')) return 'from-pink-500/30 to-pink-600/30';

    return 'from-gray-500/30 to-gray-600/30';
  };

  const getGenreTextColor = (genre: string) => {
    const genreLower = genre.toLowerCase();

    if (genreLower.includes('acción') || genreLower.includes('action')) return 'text-red-300';
    if (genreLower.includes('aventura') || genreLower.includes('adventure')) return 'text-orange-300';
    if (genreLower.includes('rpg') || genreLower.includes('rol')) return 'text-purple-300';
    if (genreLower.includes('estrategia') || genreLower.includes('strategy')) return 'text-blue-300';
    if (genreLower.includes('deporte') || genreLower.includes('sport')) return 'text-green-300';
    if (genreLower.includes('simulación') || genreLower.includes('simulation')) return 'text-cyan-300';
    if (genreLower.includes('puzzle') || genreLower.includes('rompecabezas')) return 'text-yellow-300';
    if (genreLower.includes('horror') || genreLower.includes('terror')) return 'text-gray-300';
    if (genreLower.includes('shooter') || genreLower.includes('disparos')) return 'text-orange-300';
    if (genreLower.includes('plataforma') || genreLower.includes('platform')) return 'text-pink-300';

    return 'text-gray-300';
  };

  // Valores formateados seguros
  const formattedCalificacion = formatNumber(averageRating);
  const formattedHorasJugadas = formatNumber(horasJugadas, 0);
  const totalReviews = reseñas?.length || 0;

  return (
    <Link
      href={`/game/${_id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative border rounded-xl overflow-hidden transition-all duration-300 h-80 ${isHovered ? 'scale-[1.02] -translate-y-1 border-white/20 shadow-xl' : 'border-white/10 shadow-lg'}`}>
        {/* Background Image - Full Card */}
        {imagenPortada ? (
          <>
            <Image
              src={imagenPortada}
              alt={titulo}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            {/* Gradient overlay para mejor legibilidad */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-6xl text-gray-600">🎮</div>
          </div>
        )}

        {/* Completed Badge - Simple Icon */}
        {completado && (
          <div className="absolute top-3 left-3 z-10">
            <div className="w-8 h-8 rounded-full backdrop-blur-md bg-green-500/20 border border-green-400/40 flex items-center justify-center shadow-lg">
              <Trophy className="w-4 h-4 text-green-400" />
            </div>
          </div>
        )}

        {/* Rating Badge */}
        {averageRating > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 backdrop-blur-md bg-black/40 border border-yellow-400/30 px-2.5 py-1 rounded-lg shadow-lg">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-white">{formattedCalificacion}</span>
              {totalReviews > 0 && (
                <span className="text-xs text-gray-400">({totalReviews})</span>
              )}
            </div>
          </div>
        )}

        {/* Game Info - Positioned at bottom with gradient effect */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-black via-black/70 to-transparent">
          {/* Title */}
          <h3 className="font-bold text-xl text-white mb-2 line-clamp-2 group-hover:text-white/90 transition-colors">
            {titulo}
          </h3>

          {/* Developer & Year */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
            <span>{desarrollador}</span>
            <span>•</span>
            <span>{añoLanzamiento}</span>
          </div>

          {/* Hours Played */}
          {horasJugadas > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-200 mb-3">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formattedHorasJugadas}h jugadas</span>
            </div>
          )}

          {/* Genre Tags - Minimalist with Glassmorphism */}
          <div className="flex flex-wrap gap-2">
            {generosArray.slice(0, 3).map((g, i) => {
              const colorClass = getGenreColor(g);
              const textColor = getGenreTextColor(g);
              return (
                <span
                  key={`${_id}-genre-${i}-${g}`}
                  className={`px-3 py-1 backdrop-blur-md bg-linear-to-r ${colorClass} border border-white/10 ${textColor} text-xs font-medium rounded-md`}
                >
                  {typeof g === 'string' ? g.trim() : g}
                </span>
              );
            })}
            {generosArray.length > 3 && (
              <span className="px-3 py-1 backdrop-blur-md bg-white/5 border border-white/10 text-gray-400 text-xs font-medium rounded-md">
                +{generosArray.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
