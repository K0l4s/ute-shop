import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register các component của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
    }>
  },
  width?: number,
  height?: number
}

const BarChart: React.FC<BarChartProps> = ({ data, width, height }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Doanh thu theo tháng',
      },
    },
  };

  return (
    <div className="p-4 bg-white shadow-xl rounded-lg">
      <Bar data={data} options={options} width={width} height={height} />
    </div>
  );
}

export default BarChart;
