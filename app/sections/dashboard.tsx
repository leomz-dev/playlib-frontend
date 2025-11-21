'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { chartOptions, chartColors, getGradient } from '@/utils/chartConfigs';
import { useGameStats } from '@/src/hooks/useGameStats';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isClient, setIsClient] = useState(false);
  const chartRefs = {
    bar: useRef<any>(null),
    line: useRef<any>(null),
    pie: useRef<any>(null),
    radar: useRef<any>(null)
  };

  // Asegurarse de que el componente se monte antes de renderizar los gráficos
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Obtener estadísticas de la API
  const {
    totalGames,
    completedGames,
    completionRate,
    platformDistribution,
    genreDistribution,
    monthlyData,
    gamesByHours,
    loading,
    error
  } = useGameStats();

  // Configuración de gráficos
  const chartData = {
    topGamesByHours: {
      labels: gamesByHours?.map(item => item.name) || [],
      datasets: [
        {
          label: 'Horas Jugadas',
          data: gamesByHours?.map(item => item.hours) || [],
          backgroundColor: [
            chartColors.green,
            chartColors.blue,
            chartColors.yellow,
            chartColors.orange,
            chartColors.purple,
            chartColors.green.replace('0.8', '0.6'),
            chartColors.blue.replace('0.8', '0.6'),
            chartColors.yellow.replace('0.8', '0.6'),
          ],
          borderColor: [
            chartColors.green.replace('0.8', '1'),
            chartColors.blue.replace('0.8', '1'),
            chartColors.yellow.replace('0.8', '1'),
            chartColors.orange.replace('0.8', '1'),
            chartColors.purple.replace('0.8', '1'),
            chartColors.green.replace('0.8', '1'),
            chartColors.blue.replace('0.8', '1'),
            chartColors.yellow.replace('0.8', '1'),
          ],
          borderWidth: 1,
        },
      ],
    },
    platformDistribution: {
      labels: platformDistribution.map(item => item.name),
      datasets: [
        {
          data: platformDistribution.map(item => item.value),
          backgroundColor: platformDistribution.map((_, i) => {
            const colors = [
              chartColors.green,
              chartColors.blue,
              chartColors.yellow,
              chartColors.orange,
              chartColors.purple,
              chartColors.green.replace('0.8', '0.6'),
              chartColors.blue.replace('0.8', '0.6'),
              chartColors.yellow.replace('0.8', '0.6'),
              chartColors.orange.replace('0.8', '0.6'),
              chartColors.purple.replace('0.8', '0.6'),
            ];
            return colors[i % colors.length];
          }),
          borderColor: platformDistribution.map((_, i) => {
            const colors = [
              chartColors.green.replace('0.8', '1'),
              chartColors.blue.replace('0.8', '1'),
              chartColors.yellow.replace('0.8', '1'),
              chartColors.orange.replace('0.8', '1'),
              chartColors.purple.replace('0.8', '1'),
            ];
            return colors[i % colors.length];
          }),
          borderWidth: 1,
        },
      ],
    },
    genreDistribution: {
      labels: genreDistribution.map(item => item.name),
      datasets: [
        {
          data: genreDistribution.map(item => item.value),
          backgroundColor: genreDistribution.map((_, i) => {
            const colors = [
              chartColors.green,
              chartColors.blue,
              chartColors.yellow,
              chartColors.orange,
              chartColors.purple,
              chartColors.green.replace('0.8', '0.6'),
              chartColors.blue.replace('0.8', '0.6'),
              chartColors.yellow.replace('0.8', '0.6'),
              chartColors.orange.replace('0.8', '0.6'),
              chartColors.purple.replace('0.8', '0.6'),
            ];
            return colors[i % colors.length];
          }),
          borderColor: genreDistribution.map((_, i) => {
            const colors = [
              chartColors.green.replace('0.8', '1'),
              chartColors.blue.replace('0.8', '1'),
              chartColors.yellow.replace('0.8', '1'),
              chartColors.orange.replace('0.8', '1'),
              chartColors.purple.replace('0.8', '1'),
            ];
            return colors[i % colors.length];
          }),
          borderWidth: 1,
        },
      ],
    },
  };

  // Opciones personalizadas para cada gráfico
  const chartOptionsCustomized = {
    line: {
      ...chartOptions,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...chartOptions.plugins,
        legend: {
          display: false,
        },
      },
      scales: {
        ...chartOptions.scales,
        y: {
          ...chartOptions.scales?.y,
          beginAtZero: true,
        },
      },
    },
    bar: {
      ...chartOptions,
      indexAxis: 'y' as const,
      scales: {
        ...chartOptions.scales,
        x: {
          ...chartOptions.scales?.x,
          beginAtZero: true,
        },
      },
    },
    radar: {
      ...chartOptions,
      scales: {
        r: {
          angleLines: {
            color: chartColors.gridColor,
          },
          grid: {
            color: chartColors.gridColor,
          },
          pointLabels: {
            color: chartColors.orange,
          },
          ticks: {
            display: false,
            beginAtZero: true,
          },
        },
      },
    },
  };

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-6 rounded-lg max-w-2xl text-center">
          <h3 className="text-xl font-bold mb-2">Error al cargar las estadísticas</h3>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md text-white transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 md:p-8 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 backdrop-blur-xl bg-black/20 border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-red-500 via-red-600 to-red-700 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            Estadísticas de Juegos
          </h2>
          <p className="text-gray-300">Visualiza y analiza tu actividad de juego</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Juegos"
            value={totalGames}
            icon="🎮"
            color="from-red-600 to-red-800"
          />
          <StatCard
            title="Juegos Completados"
            value={completedGames}
            icon="✅"
            color="from-green-600 to-green-800"
          />
          <StatCard
            title="Tasa de Finalización"
            value={`${completionRate.toFixed(1)}%`}
            icon="🏆"
            color="from-yellow-600 to-yellow-800"
          />
          <StatCard
            title="Juegos por Plataforma"
            value={platformDistribution.length}
            icon="🎯"
            color="from-purple-600 to-purple-800"
          />
        </div>
        {/* Gráfico de Barras - Juegos Más Jugados */}
        <div className="backdrop-blur-xl bg-black/20 border border-red-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(220,38,38,0.2)] hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] transition-all duration-300 mb-8">
          <h3 className="text-xl font-bold mb-4 text-red-400">Juegos Más Jugados</h3>
          <div className="h-80">
            {isClient && gamesByHours && gamesByHours.length > 0 ? (
              <Bar
                ref={chartRefs.bar}
                data={chartData.topGamesByHours}
                options={chartOptionsCustomized.bar}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No hay datos de horas jugadas disponibles</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Donut - Distribución por Plataforma */}
          <div className="backdrop-blur-xl bg-black/20 border border-red-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(220,38,38,0.2)] hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-red-400">Distribución por Plataforma</h3>
            <div className="h-80 flex flex-col items-center justify-center">
              {isClient && (
                <div className="w-full h-full max-w-md">
                  <Doughnut
                    ref={chartRefs.pie}
                    data={chartData.platformDistribution}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins?.legend,
                          position: 'bottom',
                        },
                        tooltip: {
                          ...chartOptions.plugins?.tooltip,
                          callbacks: {
                            label: function (context: any) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${value} juegos (${percentage}%)`;
                            }
                          }
                        }
                      },
                      cutout: '60%',
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Gráfico de Radar - Distribución por Género */}
          <div className="backdrop-blur-xl bg-black/20 border border-red-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(220,38,38,0.2)] hover:shadow-[0_0_60px_rgba(220,38,38,0.3)] transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-red-400">Distribución por Género</h3>
            <div className="h-80">
              {isClient && (
                <Radar
                  ref={chartRefs.radar}
                  data={chartData.genreDistribution}
                  options={chartOptionsCustomized.radar}
                />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
  <div className="backdrop-blur-xl bg-black/30 border border-red-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(220,38,38,0.2)] hover:shadow-[0_0_50px_rgba(220,38,38,0.4)] transition-all hover:-translate-y-1 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-300 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-red-400 transition-colors">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-full bg-linear-to-br ${color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
  </div>
);
