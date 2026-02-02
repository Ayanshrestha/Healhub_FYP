import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AnalyticsChart = ({ labels, series }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1f2937',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    const data = {
        labels: labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: (series || []).map((s, idx) => {
            const colors = [
                { border: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)' },
                { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                { border: '#0d9488', bg: 'rgba(13, 148, 136, 0.1)' }
            ];
            const color = colors[idx % colors.length];
            return {
                label: s.name,
                data: s.data,
                borderColor: color.border,
                backgroundColor: color.bg,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: color.border,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            };
        })
    };

    return (
        <div className="h-[300px] w-full">
            <Line options={options} data={data} />
        </div>
    );
};

export default AnalyticsChart;
