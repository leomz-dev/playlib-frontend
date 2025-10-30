'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Gamepad2, 
  Clock, 
  Star, 
  CheckCircle, 
  Edit, 
  Trash2,
  Monitor,
  User,
  Tag,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Game, getGame, deleteGame, updateGame } from '../../services/gameService';

export default function GameDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [gameData, setGameData] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) {
        setError('ID de juego no proporcionado');
        setLoading(false);
        return;
      }

      try {
        const game = await getGame(id as string);
        setGameData(game);
        setError(null);
      } catch (err) {
        console.error('Error al cargar el juego:', err);
        setError('No se pudo cargar la información del juego. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('¿Estás seguro de que deseas eliminar este juego? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteGame(id as string);
      router.push('/');
    } catch (err) {
      console.error('Error al eliminar el juego:', err);
      setError('No se pudo eliminar el juego. Por favor, inténtalo de nuevo.');
      setIsDeleting(false);
    }
  };

  const toggleCompletion = async () => {
    if (!gameData?._id) return;
    
    try {
      const updatedGame = await updateGame(gameData._id, { 
        completado: !gameData.completado 
      });
      setGameData(updatedGame);
    } catch (err) {
      console.error('Error al actualizar el estado del juego:', err);
      setError('No se pudo actualizar el estado del juego');
    }
  };

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star 
        key={star} 
        className={`w-5 h-5 ${star <= Math.round(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
      />
    ));
  };

  const getPlatformIcon = (platform: string) => {
    if (!platform) return <Gamepad2 className="w-5 h-5 text-blue-400" />;
    
    const platformLower = platform.toLowerCase();
    
    if (platformLower.includes('playstation') || platformLower.includes('ps')) {
      return <Gamepad2 className="w-5 h-5 text-blue-400" />;
    } else if (platformLower.includes('xbox')) {
      return <Gamepad2 className="w-5 h-5 text-green-400" />;
    } else if (platformLower.includes('nintendo') || platformLower.includes('switch')) {
      return <Gamepad2 className="w-5 h-5 text-red-400" />;
    } else if (platformLower.includes('pc') || platformLower.includes('computer')) {
      return <Monitor className="w-5 h-5 text-purple-400" />;
    } else {
      return <Gamepad2 className="w-5 h-5 text-yellow-400" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando información del juego...</p>
        </div>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-4">
            <p className="font-semibold">Error al cargar el juego</p>
            <p className="text-sm mt-1">{error || 'No se encontró el juego solicitado'}</p>
          </div>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const {
    titulo,
    genero,
    plataforma,
    añoLanzamiento,
    desarrollador,
    imagenPortada,
    descripcion,
    completado,
    calificacion = 0,
    horasJugadas = 0,
    fechaCreacion
  } = gameData;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header with back button and actions */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Link>
          
          <div className="flex space-x-3">
            <Link 
              href={`/game/${id}/edit`}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Game header with cover and basic info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="relative aspect-2/3 bg-gray-900 rounded-xl overflow-hidden">
              {imagenPortada ? (
                <Image
                  src={imagenPortada}
                  alt={titulo}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                  <Gamepad2 className="w-12 h-12" />
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                onClick={toggleCompletion}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border ${
                  completado 
                    ? 'bg-green-900/30 border-green-600 text-green-400 hover:bg-green-900/50' 
                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                } transition-colors`}
              >
                <CheckCircle className={`w-5 h-5 mr-2 ${completado ? 'fill-current' : ''}`} />
                {completado ? 'Completado' : 'Marcar como completado'}
              </button>

              <button 
                onClick={() => alert('Función de compartir no implementada todavía.')}
                className="flex-1 border border-[#2a2a2a] hover:border-[#ff4757] text-gray-400 hover:text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                Compartir
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col h-full">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{titulo}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                  <span className="flex items-center">
                    {getPlatformIcon(plataforma)}
                    <span className="ml-2">{plataforma || 'Plataforma no especificada'}</span>
                  </span>
                  
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-1 text-purple-400" />
                    {genero || 'Género no especificado'}
                  </span>
                  
                  {añoLanzamiento && (
                    <span className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1 text-blue-400" />
                      {añoLanzamiento}
                    </span>
                  )}
                  
                  {desarrollador && (
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1 text-green-400" />
                      {desarrollador}
                    </span>
                  )}
                </div>
                
                {calificacion > 0 && (
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {renderStars(calificacion)}
                    </div>
                    <span className="ml-2 text-yellow-400 font-medium">
                      {calificacion.toFixed(1)}
                    </span>
                  </div>
                )}
                
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">Descripción</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {descripcion || 'No hay descripción disponible para este juego.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-white">Detalles del juego</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Estado</span>
                {completado ? (
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" /> Completado
                  </span>
                ) : (
                  <span className="text-yellow-400">No iniciado</span>
                )}
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Horas jugadas</span>
                <span className="text-white">{horasJugadas || 'No registradas'}</span>
              </div>
              
              {fechaCreacion && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Añadido el</span>
                  <span className="text-white">{formatDate(fechaCreacion)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
