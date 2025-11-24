// Importación de secciones de la página principal
import Nav from "./sections/nav";
import Hero from "./sections/hero";
import Dashboard from "./sections/dashboard";
import Library from "./sections/library";
// Componente de fondo animado
import Waves from "./components/Waves";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      {/* Waves como fondo fijo de toda la página */}
      <div className="fixed top-0 left-0 w-screen h-screen z-0">
        <Waves
          lineColor="rgba(220, 38, 38, 0.6)"
          backgroundColor="#000000"
          waveSpeedX={0.08}
          waveSpeedY={0.05}
          waveAmpX={45}
          waveAmpY={25}
          friction={0.92}
          tension={0.008}
          maxCursorMove={150}
          xGap={15}
          yGap={40}
        />
      </div>

      {/* Gradiente overlay sutil para profundidad sin oscurecer las waves */}
      <div className="fixed inset-0 z-1 bg-linear-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />

      {/* Contenido principal con posicionamiento relativo para estar sobre el fondo */}
      <div className="relative z-10">
        <Nav />
        <section id="hero">
          <Hero />
        </section>
        <section id="dashboard">
          <Dashboard />
        </section>
        <section id="library">
          <Library />
        </section>
      </div>
    </main>
  );
}

