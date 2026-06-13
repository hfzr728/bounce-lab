"use client";

// ============================================================
// 雷达图组件 — 基于 Chart.js 的能力维度可视化
// ============================================================

import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { DimensionScore } from "@/lib/questionnaire/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  dimensionScores: DimensionScore[];
}

export function RadarChart({ dimensionScores }: RadarChartProps) {
  const labels = dimensionScores.map((d) => d.label);
  const scores = dimensionScores.map((d) => d.score);

  const data = {
    labels,
    datasets: [
      {
        label: "您的评分",
        data: scores,
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(37, 99, 235, 1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointRadius: 4,
      },
      {
        label: "参考基准 (70分)",
        data: Array(labels.length).fill(70),
        backgroundColor: "rgba(156, 163, 175, 0.05)",
        borderColor: "rgba(156, 163, 175, 0.4)",
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          backdropColor: "transparent",
          font: { size: 8 },
        },
        pointLabels: {
          font: { size: 11, weight: "bold" as const },
          color: "#374151",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.06)",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        能力维度雷达图
      </h3>
      <div className="w-full max-w-md mx-auto">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
