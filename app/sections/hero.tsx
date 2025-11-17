'use client';

import Waves from '../components/Waves';

export default function Hero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      <Waves
        lineColor="rgba(255, 0, 0, 0.2)"
        backgroundColor="rgba(0, 0, 0, 0.8)"
        waveSpeedX={0.1}
        waveSpeedY={0.1}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Bienvenido a tu Biblioteca de Juegos</h1>
        <p className="text-xl md:text-2xl text-gray-300">Organiza, gestiona y explora tu colección de videojuegos.</p>
      </div>
    </div>
  );
}
