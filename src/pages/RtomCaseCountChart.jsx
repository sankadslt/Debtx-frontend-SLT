import { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { fetchRtomCaseCountChartData } from "../services/chart/chartService";
import GlobalStyle from "../assets/prototype/GlobalStyle.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RtomCaseCountChart = ({ showPopup, setShowPopup, arrearsBands }) => {
    const [chartData, setChartData] = useState(null);
    const popupRef = useRef(null);
    const drcListRef = useRef(null);
    const [selectedBand, setSelectedBand] = useState("");
    const response = [
        { Billing_Centre: "HAVELOCK TOWN", count: 1, drc_list: ["D1"] },
        { Billing_Centre: "KANDY", count: 2, drc_list: ["D1", "D2"] },
        { Billing_Centre: "NUGEGODA", count: 1, drc_list: ["D2"] },
        { Billing_Centre: "MARADANA", count: 1, drc_list: ["D1"] },
        { Billing_Centre: "HAVELOCK TOWN", count: 1, drc_list: ["Central Management Services (Pvt) Ltd."] },
        { Billing_Centre: "KANDY", count: 2, drc_list: ["Central Management Services (Pvt) Ltd.", "Total Credit Management Services Lanka (Pvt) Ltd."] },
        { Billing_Centre: "NUGEGODA", count: 1, drc_list: ["Total Credit Management Services Lanka (Pvt) Ltd."] },
        { Billing_Centre: "MARADANA", count: 1, drc_list: ["Central Management Services (Pvt) Ltd."] },
        { Billing_Centre: "GALLE", count: 3, drc_list: ["Central Management Services (Pvt) Ltd.", "Recover Enterprises Pvt Ltd"] },
        { Billing_Centre: "KURUNEGALA", count: 2, drc_list: ["Total Credit Management Services Lanka (Pvt) Ltd."] },
        { Billing_Centre: "MATARA", count: 1, drc_list: ["Recover Enterprises Pvt Ltd"] },
        { Billing_Centre: "RATMALANA", count: 2, drc_list: ["Central Management Services (Pvt) Ltd.", "Total Credit Management Services Lanka (Pvt) Ltd."] },
        { Billing_Centre: "ANURADHAPURA", count: 1, drc_list: ["Recover Enterprises Pvt Ltd"] },
        { Billing_Centre: "BATTICALOA", count: 2, drc_list: ["Total Credit Management Services Lanka (Pvt) Ltd.", "Recover Enterprises Pvt Ltd"] },
    ];

    const datasetColors = ["#4F46E5", "#1bd33f", "#F43F5E"];
    const colors = response.map((_, index) => datasetColors[index % datasetColors.length]);

    // Fetch data when popup is shown
    useEffect(() => {
        const getChartData = async () => {
            try {
                // const response = await fetchRtomCaseCountChartData();
                const labels = response.map(item => item.Billing_Centre);
                const counts = response.map(item => item.count);
                drcListRef.current = response.map(item => item.drc_list.join(", "));

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Case Count",
                            data: counts,
                            backgroundColor: colors,
                            borderColor: colors,
                            borderWidth: 1
                        }
                    ]
                })
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        };

        if (showPopup) getChartData();
    }, [showPopup, selectedBand]);

    // Close modal if clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowPopup(false);
                setSelectedBand("");
            }
        };

        if (showPopup) document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [showPopup]);

    return (
        <>
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div ref={popupRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowPopup(false);
                                setSelectedBand("");
                            }}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                        >
                            ✖
                        </button>
                        <div className="flex justify-center mb-4">
                            <select
                                className={`${GlobalStyle.selectBox} w-full sm:w-auto`}
                                value={selectedBand}
                                onChange={(e) => setSelectedBand(e.target.value)}
                                style={{ color: selectedBand ? "black" : "gray" }}
                            >
                                <option value="" hidden>
                                    Arrears Band
                                </option>
                                {arrearsBands.map(({ key, value }) => (
                                    <option key={key} value={value} style={{ color: "black" }}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3 text-center">
                            Success Path Chart
                        </h3>
                        <div className="h-96">
                            {chartData ? (
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        const index = context.dataIndex;
                                                        const drc = drcListRef.current[index]?.split(", ") || "No DRC";
                                                        return [`DRCs:`, ...drc];
                                                    }
                                                }
                                            }
                                        },
                                        scales: {
                                            x: { stacked: true, title: { display: true, text: "Billing Centers" } },
                                            y: {
                                                stacked: true,
                                                beginAtZero: true,
                                                title: { display: true, text: "Case Count" },
                                                ticks: {
                                                    precision: 0,
                                                    callback: function (value) {
                                                        if (Number.isInteger(value)) {
                                                            return value;
                                                        }
                                                        return '';
                                                    }
                                                }
                                            },
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
        </>
    );
};

export default RtomCaseCountChart;
