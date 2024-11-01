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
  ChartData
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface LineChartProps {
  data: ChartData<"line", number[], string>;
  width?: number;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, width, height }) => {
  // Function to create a more visible gradient color for the line
  const createGradient = (ctx: CanvasRenderingContext2D, chartArea: any) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "#E43D00"); // Darker blue at the bottom
    gradient.addColorStop(1, "#FFE900"); // Lighter purple at the top
    return gradient;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#FFFFFF', // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
        color: '#FFFFFF', // Set title text color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF', // Set X-axis text color to white
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#FFFFFF', // Set Y-axis text color to white
        },
      },
    },
    elements: {
      line: {
        borderColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return '#1E3A8A'; // Fallback color
          const gradient = createGradient(ctx, chartArea);
          context.dataset.backgroundColor = gradient;
           // Fill the area under the line
          return gradient;
        },
        
        borderWidth: 2,
        fill: true,
      },
      point: {
        radius: 2,
        borderColor: 'white',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="p-4 bg-gradient-to-r from-purple-400 to-blue-600 shadow-xl rounded-lg h-80 opacity-90">
      <Line data={data} options={chartOptions} width={width} height={height} />
    </div>
  );
}

export default LineChart;
