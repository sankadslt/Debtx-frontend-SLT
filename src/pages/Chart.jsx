import { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { fetchChartData } from "../services/chart/chartService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Chart = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [chartData, setChartData] = useState(null);
  const popupRef = useRef(null);

  const datasetColors = ["#4F46E5", "#1bd33f", "#F43F5E"];

  // Fetch data from the backend API
  useEffect(() => {
    const getChartData = async () => {
      try {
        const data = await fetchChartData(); // Use the service function

        // Add colors to datasets
        const updatedDatasets = data.datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: datasetColors[index] || "#cccccc",
        }));

        setChartData({ ...data, datasets: updatedDatasets });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    if (showPopup) getChartData(); // Fetch only when popup is shown
  }, [showPopup]);

  // Handle clicks outside the popup
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };

    if (showPopup) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showPopup]);

  return (
    <div className="text-white min-h-screen py-8 px-4">
      {/* Button to Show Popup */}
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition-all"
      >
        Show Chart
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={popupRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">
              DRC Summary
            </h3>
            <div className="h-96">
              {chartData ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                    scales: {
                      x: { stacked: true, title: { display: true, text: "DRC Locations" } },
                      y: { stacked: true, beginAtZero: true, title: { display: true, text: "Amount" } },
                    },
                  }}
                />
              ) : (
                <p className="text-center text-gray-500">Loading chart...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chart;
