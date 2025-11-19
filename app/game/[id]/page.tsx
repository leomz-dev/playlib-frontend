'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Game, Reseña, getGame, deleteGame, updateGame, addReseña, getReseñas } from '../../services/gameService';

// Componente de detalle del juego
// Muestra información completa, estadísticas y reseñas
export default function GameDetail() {
  const router = useRouter();
  const { id } = useParams();

  // Estados para manejo de carga, errores y datos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [gameData, setGameData] = useState<Game | null>(null);
  const [reseñas, setReseñas] = useState<Reseña[]>([]);

  // Estados para el formulario de reseñas
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    nombreUsuario: '',
    textoReseña: '',
    calificaciones: 5,
    horasJugadas: 0,
    dificultad: 'Normal',
    recomendaria: true
  });

  // Efecto para cargar los datos del juego al montar el componente o cambiar el ID
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
        setReseñas(game.reseñas || []);
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

  // Manejador para eliminar el juego
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

  // Manejador para enviar una nueva reseña
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const newReview = await addReseña(id as string, reviewFormData);
      setReseñas([...reseñas, newReview]);
      setShowReviewForm(false);
      setReviewFormData({
        nombreUsuario: '',
        textoReseña: '',
        calificaciones: 5,
        horasJugadas: 0,
        dificultad: 'Normal',
        recomendaria: true
      });
    } catch (err) {
      console.error('Error al agregar reseña:', err);
      setError('No se pudo agregar la reseña');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-['Chakra_Petch']">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dc2626] mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando información del juego...</p>
        </div>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-['Chakra_Petch']">
        <div className="text-center max-w-md">
          <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg mb-4">
            <p className="font-semibold">Error al cargar el juego</p>
            <p className="text-sm mt-1">{error || 'No se encontró el juego solicitado'}</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-[#dc2626] hover:bg-[#dc2626]/80 text-white rounded-lg transition-colors font-bold uppercase tracking-wider font-['Orbitron']"
          >
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

  // Normalizar genero y plataforma a arrays
  const generosArray = Array.isArray(genero) ? genero : [genero];
  const plataformasArray = Array.isArray(plataforma) ? plataforma : [plataforma];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-['Chakra_Petch']">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Orbitron:wght@700;900&display=swap');
        
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        
        .glass-card {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(220, 38, 38, 0.3);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        
        .glass-card-strong {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(220, 38, 38, 0.4);
          box-shadow: 0 8px 32px 0 rgba(220, 38, 38, 0.15);
        }
        
        .clip-path-button {
          clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
        }
        
        .btn-gaming {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease-in-out;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .btn-gaming:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }
        
        .btn-gaming:active:before {
          width: 200%;
          padding-bottom: 200%;
        }
        
        .btn-gaming:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 0 25px 5px rgba(220, 38, 38, 0.5);
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-flicker {
          animation: flicker 1.5s infinite;
        }
      `}</style>

      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{
          backgroundImage: imagenPortada ? `url(${imagenPortada})` : 'none',
          backgroundColor: '#000000',
          zIndex: 0
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        {/* Back Button */}
        <div className="w-full max-w-7xl mx-auto mb-6">
          <Link
            href="/"
            className="btn-gaming clip-path-button inline-flex items-center gap-2 h-10 px-6 bg-black/40 border border-red-600/30 text-white text-sm font-bold uppercase tracking-widest font-['Orbitron'] hover:border-[#dc2626] hover:bg-red-900/20"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver al Inicio</span>
          </Link>
        </div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Image Column */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <img
              src={imagenPortada || '/placeholder-game.png'}
              alt={titulo}
              className="w-full max-w-sm rounded-xl border-2 border-[#dc2626]/50"
              style={{ boxShadow: '0 0 20px 8px rgba(220, 38, 38, 0.4)' }}
            />
          </div>

          {/* Info Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Title Card */}
            <div className="glass-card-strong p-6 rounded-xl">
              <h1 className="text-5xl md:text-7xl font-['Orbitron'] font-black tracking-wider text-white uppercase animate-flicker">
                {titulo}
              </h1>
              <h2 className="text-2xl font-['Orbitron'] text-[#dc2626] font-bold mt-1">
                {generosArray.join(' • ') || 'Género no especificado'}
              </h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Platform Card */}
              <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#dc2626] text-4xl">public</span>
                <p className="text-lg font-semibold mt-2 font-['Orbitron']">Plataforma</p>
                <div className="flex gap-2 mt-2 flex-wrap justify-center">
                  {plataformasArray.map((p, i) => (
                    <span key={`${id}-platform-${i}-${p}`} className="bg-black/40 text-white text-xs font-bold px-3 py-1 rounded-full border border-red-600/30">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hours Card */}
              <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#dc2626] text-4xl">hourglass_top</span>
                <p className="text-lg font-semibold mt-2 font-['Orbitron']">Horas Jugadas</p>
                <p className="text-2xl text-white font-bold">{horasJugadas || 0}</p>
              </div>

              {/* Status Card */}
              <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#dc2626] text-4xl">workspace_premium</span>
                <p className="text-lg font-semibold mt-2 font-['Orbitron']">Estado</p>
                <p className="text-2xl text-white font-bold">{completado ? 'Completado' : 'No Iniciado'}</p>
              </div>
            </div>

            {/* Actions Card */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-2xl font-bold font-['Orbitron'] text-[#dc2626] mb-4">Acciones</h3>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">

                <Link
                  href={`/game/${id}/edit`}
                  className="btn-gaming clip-path-button flex-1 min-w-[150px] flex items-center justify-center gap-2 h-12 px-6 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-widest font-['Orbitron']"
                >
                  <span className="material-symbols-outlined">edit</span>
                  <span>Editar</span>
                </Link>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-gaming clip-path-button flex-1 min-w-[150px] flex items-center justify-center gap-2 h-12 px-6 bg-transparent border-2 border-[#dc2626] text-[#dc2626] text-sm font-bold uppercase tracking-widest font-['Orbitron'] hover:bg-[#dc2626] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">delete</span>
                      <span>Eliminar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-gaming clip-path-button flex-1 min-w-[150px] flex items-center justify-center gap-2 h-12 px-6 bg-black/40 border border-red-600/30 text-white text-sm font-bold uppercase tracking-widest font-['Orbitron'] hover:border-[#dc2626] hover:bg-red-900/20"
                >
                  <span className="material-symbols-outlined">add_comment</span>
                  <span>{showReviewForm ? 'Cancelar' : 'Añadir Reseña'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="lg:col-span-12 w-full mt-4">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-2xl font-bold font-['Orbitron'] text-[#dc2626] mb-4">Nueva Reseña</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 font-['Orbitron']">Nombre de Usuario</label>
                      <input
                        type="text"
                        value={reviewFormData.nombreUsuario}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, nombreUsuario: e.target.value })}
                        className="w-full px-4 py-2 bg-black/40 border border-red-600/30 text-white rounded-lg focus:border-[#dc2626] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-['Orbitron']">Horas Jugadas</label>
                      <input
                        type="number"
                        value={reviewFormData.horasJugadas}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, horasJugadas: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-black/40 border border-red-600/30 text-white rounded-lg focus:border-[#dc2626] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-['Orbitron']">Calificación (0-5)</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.5"
                        value={reviewFormData.calificaciones}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, calificaciones: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-black/40 border border-red-600/30 text-white rounded-lg focus:border-[#dc2626] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-['Orbitron']">Dificultad</label>
                      <select
                        value={reviewFormData.dificultad}
                        onChange={(e) => setReviewFormData({ ...reviewFormData, dificultad: e.target.value })}
                        className="w-full px-4 py-2 bg-black/40 border border-red-600/30 text-white rounded-lg focus:border-[#dc2626] focus:outline-none"
                      >
                        <option value="Fácil">Fácil</option>
                        <option value="Normal">Normal</option>
                        <option value="Difícil">Difícil</option>
                        <option value="Muy Difícil">Muy Difícil</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-['Orbitron']">Reseña</label>
                    <textarea
                      value={reviewFormData.textoReseña}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, textoReseña: e.target.value })}
                      className="w-full px-4 py-2 bg-black/40 border border-red-600/30 text-white rounded-lg focus:border-[#dc2626] focus:outline-none h-32 resize-none"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={reviewFormData.recomendaria}
                      onChange={(e) => setReviewFormData({ ...reviewFormData, recomendaria: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-white font-['Orbitron']">Recomendaría este juego</label>
                  </div>
                  <button
                    type="submit"
                    className="btn-gaming clip-path-button w-full flex items-center justify-center gap-2 h-12 px-6 bg-[#dc2626] text-white text-sm font-bold uppercase tracking-widest font-['Orbitron']"
                  >
                    <span className="material-symbols-outlined">send</span>
                    <span>Enviar Reseña</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Reviews Section - Full Width */}
          <div className="lg:col-span-12 w-full mt-4">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-3xl font-bold font-['Orbitron'] text-[#dc2626] mb-4 text-center">Reseñas ({reseñas.length})</h3>
              <div className="space-y-4">
                {reseñas.length > 0 ? (
                  reseñas.map((review, idx) => (
                    <div key={idx} className="glass-card-strong p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-white font-['Orbitron']">{review.nombreUsuario}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-white font-bold">{review.calificaciones}/5</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400">{review.horasJugadas}h jugadas</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400">{review.dificultad}</span>
                          </div>
                        </div>
                        {review.recomendaria && (
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-[#a0a0b8] leading-relaxed">{review.textoReseña}</p>
                    </div>
                  ))
                ) : (
                  <div className="glass-card-strong p-6 rounded-lg text-center">
                    <p className="text-[#a0a0b8] text-lg">Aún no hay reseñas. ¡Sé el primero en agregar una!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Material Symbols Link */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    </div>
  );
}
