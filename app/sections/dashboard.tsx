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
    topGames,
    loading,
    error
  } = useGameStats();

  // Configuración de gráficos
  const chartData = {
    monthlyPlaytime: {
      labels: monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Juegos por Mes',
          data: monthlyData.map(item => item.count),
          borderColor: chartColors.green,
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const gradient = getGradient(chart, chartColors.green.split(',0.8)')[0]);
            return gradient || chartColors.green;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    platformDistribution: {
      labels: platformDistribution.map(item => item.name),
      datasets: [
        {
          data: platformDistribution.map(item => item.value),
          backgroundColor: [
            chartColors.green,
            chartColors.blue,
            chartColors.yellow,
            chartColors.orange,
            chartColors.purple,
          ],
          borderColor: [
            chartColors.green.replace('0.8', '1'),
            chartColors.blue.replace('0.8', '1'),
            chartColors.yellow.replace('0.8', '1'),
            chartColors.orange.replace('0.8', '1'),
            chartColors.purple.replace('0.8', '1'),
          ],
          borderWidth: 1,
        },
      ],
    },
    topGames: {
      labels: topGames.map(item => item.name),
      datasets: [
        {
          label: 'Juegos Recientes',
          data: topGames.map(item => item.hours),
          backgroundColor: [
            chartColors.green,
            chartColors.blue,
            chartColors.yellow,
            chartColors.orange,
            chartColors.purple,
          ],
          borderColor: [
            chartColors.green.replace('0.8', '1'),
            chartColors.blue.replace('0.8', '1'),
            chartColors.yellow.replace('0.8', '1'),
            chartColors.orange.replace('0.8', '1'),
            chartColors.purple.replace('0.8', '1'),
          ],
          borderWidth: 1,
        },
      ],
    },
    genreDistribution: {
      labels: genreDistribution.map(item => item.name),
      datasets: [
        {
          data: genreDistribution.map(item => item.value),
          backgroundColor: [
            chartColors.green,
            chartColors.blue,
            chartColors.yellow,
            chartColors.orange,
          ],
          borderColor: [
            chartColors.green.replace('0.8', '1'),
            chartColors.blue.replace('0.8', '1'),
            chartColors.yellow.replace('0.8', '1'),
            chartColors.orange.replace('0.8', '1'),
          ],
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
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-green-100 to-blue-500">
            Estadísticas de Juegos
          </h2>
          <p className="text-gray-400">Visualiza y analiza tu actividad de juego</p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Total de Juegos" 
              value={totalGames} 
              icon="🎮" 
              color="green" 
            />
            <StatCard 
              title="Juegos Completados" 
              value={completedGames} 
              icon="✅" 
              color="blue" 
            />
            <StatCard 
              title="Tasa de Finalización" 
              value={`${completionRate.toFixed(1)}%`} 
              icon="🏆" 
              color="yellow" 
            />
            <StatCard 
              title="Juegos por Plataforma" 
              value={platformDistribution.length} 
              icon="🎯" 
              color="purple" 
            />
          </div>
        {/* Gráfico de Línea - Horas Jugadas por Mes */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl mb-8">
          <h3 className="text-xl font-bold mb-4 text-green-400">Horas Jugadas por Mes</h3>
          <div className="h-80">
            {isClient && (
              <Line
                ref={chartRefs.line}
                data={chartData.monthlyPlaytime}
                options={chartOptionsCustomized.line}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Donut - Distribución por Plataforma */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Distribución por Plataforma</h3>
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
                            label: function(context: any) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${value}% (${percentage}%)`;
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
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Distribución por Género</h3>
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
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-2xl`}>
        {icon}
      </div>
    </div>
  </div>
);
