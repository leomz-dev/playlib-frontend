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
  RadialLinearScale,
} from 'chart.js';

// Registrar componentes necesarios
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

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#9CA3AF',
        font: {
          family: 'Inter',
        },
      },
    },
    tooltip: {
      backgroundColor: '#1F2937',
      titleColor: '#E5E7EB',
      bodyColor: '#9CA3AF',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(55, 65, 81, 0.5)',
        borderColor: '#374151',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
    y: {
      grid: {
        color: 'rgba(55, 65, 81, 0.5)',
        borderColor: '#374151',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
  },
};

export const chartColors = {
  green: 'rgba(0, 255, 157, 0.8)',
  blue: 'rgba(0, 184, 255, 0.8)',
  yellow: 'rgba(249, 248, 113, 0.8)',
  orange: 'rgba(255, 123, 84, 0.8)',
  purple: 'rgba(164, 89, 209, 0.8)',
  darkBg: 'rgba(17, 24, 39, 0.8)',
  gridColor: 'rgba(55, 65, 81, 0.5)',
  borderColor: 'rgba(55, 65, 81, 1)',
};

export const getGradient = (chart: any, color: string) => {
  const { ctx, chartArea } = chart;
  if (!chartArea) return;
  
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  // Asegurarse de que el color base tenga una opacidad válida
  const baseColor = color.endsWith(',') ? `${color}1)` : color.endsWith(')') ? color : `${color})`;
  
  // Crear versiones con diferentes opacidades
  const transparentColor = baseColor.replace(/(\d*\.?\d*\))$/, '0)');
  const semiTransparentColor = baseColor.replace(/(\d*\.?\d*\))$/, '0.5)');
  
  gradient.addColorStop(0, transparentColor);
  gradient.addColorStop(0.5, semiTransparentColor);
  gradient.addColorStop(1, baseColor);
  
  return gradient;
};
