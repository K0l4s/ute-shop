import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  Filler
} from 'chart.js';

// Register all required components including Filler for area fills
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

interface LineChartProps {
  data: ChartData<"line", number[], string>;
  width?: number;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, width, height }) => {
  // Enhanced gradient function with smoother color transitions
  const createGradient = (ctx: CanvasRenderingContext2D, chartArea: any) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)'); // Very transparent blue at bottom
    gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.3)'); // Semi-transparent blue in middle
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)'); // More opaque blue at top
    return gradient;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#FFFFFF',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        },
      },
      title: {
        display: true,
        text: 'DOANH THU THEO THÁNG',
        color: '#FFFFFF',
        font: {
          size: 20,
          weight: 'bold' as const
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        bodyFont: {
          size: 14
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            let value = context.parsed.y;
            return new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND' 
            }).format(value);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND',
              notation: 'compact'
            }).format(value);
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4, // Adds smooth curves to the line
        borderWidth: 3,
        borderColor: '#3B82F6', // Solid blue line
        fill: true,
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          return chartArea ? createGradient(ctx, chartArea) : 'rgba(59, 130, 246, 0.1)';
        }
      },
      point: {
        radius: 0, // Hide points by default
        hoverRadius: 6, // Show points on hover
        backgroundColor: '#FFFFFF',
        borderColor: '#3B82F6',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hitRadius: 30, // Increase hover detection area
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const // Fixed by adding type assertion
    }
  };

  return (
    <div className="relative p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl">
      <div className="absolute inset-0 bg-blue-500/10 rounded-2xl backdrop-blur-sm"></div>
      <div className="relative h-[400px]">
        <Line data={data} options={chartOptions} width={width} height={height} />
      </div>
    </div>
  );
}

export default LineChart;
