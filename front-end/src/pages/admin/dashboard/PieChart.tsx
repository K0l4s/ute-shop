// PieChart.tsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
    Title
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
    data: ChartData<"pie", number[], string>;
    width?: number;
    height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#FFFFFF',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const value = Number(tooltipItem.raw);
                        return `${tooltipItem.label}: ${value.toFixed(1)}%`;
                    }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
                padding: 12,
                cornerRadius: 8,
                displayColors: true
            }
        },
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 2000,
            easing: 'easeInOutQuart' as const
        },
        elements: {
            arc: {
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }
        }
    };

    return (
        <div className="relative p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl backdrop-blur-sm"></div>
            <h2 className="relative text-white text-center text-2xl font-bold mb-6">Top sách bán chạy</h2>
            <div className="relative h-[400px]">
                <Pie 
                    data={data}
                    options={chartOptions}
                    width={width}
                    height={height}
                />
            </div>
        </div>
    );
};

export default PieChart;
