// PieChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: ChartData<"pie", number[], string>;
    width?: number;
    height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height }) => {
    return (
        <div className="p-4 bg-gradient-to-r from-purple-400 to-blue-600 shadow-xl rounded-lg opacity-90">
            <h2 className="text-white text-center text-xl font-semibold">Top sách bán chạy</h2>
            <Pie className='max-w-screen h-full m-auto'
                data={data}
                options={{
                    plugins: {
                        legend: {
                            display: false,
                            position: 'top',
                            labels: {
                                color: '#fff',
                                font: {
                                    size: 16,
                                },
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}%`,
                            },
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                        },
                    },
                }}
                width={width}
                height={height}
            />
        </div>
    );
};

export default PieChart;
