'use client';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0">
      {/* Contenido */}
      <div className="relative z-10 text-center px-6 md:px-8 max-w-5xl w-full">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            Bienvenido a tu{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-red-600 to-red-700 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">
              Biblioteca de Juegos
            </span>
          </h1>
          
          {/* Video de fondo */}
          <div className="my-8 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.3)] mx-auto w-full max-w-[800px] aspect-video">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/BackVideo.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* Stats glassmorphism */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="text-3xl font-bold text-red-500">∞</div>
              <div className="text-sm text-gray-300 mt-1">Juegos Disponibles</div>
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="text-3xl font-bold text-red-500">★</div>
              <div className="text-sm text-gray-300 mt-1">Experiencia Premium</div>
            </div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-red-500/30 transition-all duration-300">
              <div className="text-3xl font-bold text-red-500">⚡</div>
              <div className="text-sm text-gray-300 mt-1">Alta Performance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
