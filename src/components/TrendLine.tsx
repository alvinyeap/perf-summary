import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
import { Chart } from "chart.js";
import { Line } from "react-chartjs-2";
import { registerables } from "chart.js";
import "chartjs-adapter-date-fns";

import LOGGED_FEEDBACK from "@/data/LoggedFeedback.const";

Chart.register(...registerables);

const TrendLine = () => {
  const dates = LOGGED_FEEDBACK.map((entry) => entry.createdAt);
  let trendValue = 0;
  const trendData = LOGGED_FEEDBACK.map((entry) => {
    if (entry.category === "positive") {
      trendValue += 1;
    } else {
      trendValue -= 1;
    }
    return trendValue;
  });
  const trendColors = trendData.map((value) => (value > 0 ? "green" : "red"));

  const data = {
    labels: dates,
    datasets: [
      {
        label: "Feedback Trend",
        fill: false,
        data: trendData,
        backgroundColor: trendColors,
        borderColor: trendColors,
      },
    ],
  };

  const values = data.datasets[0].data;
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const yAxisMin = dataMin < -5 ? dataMin : -5;
  const yAxisMax = dataMax > 5 ? dataMax : 5;
  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "day" as const,
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        min: yAxisMin,
        max: yAxisMax,
        grid: {
          display: true,
          color: (context: any) => {
            return context.tick.value === 0
              ? "rgba(0, 0, 0, 0.1)"
              : "transparent";
          },
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default TrendLine;
