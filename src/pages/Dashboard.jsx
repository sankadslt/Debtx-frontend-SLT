import { useState, useEffect } from "react";
import LaunchCelebration from "../components/LaunchCelebration"; // Adjust the path if needed
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell
} from "recharts";

const Dashboard = () => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [ready, setReady] = useState(false);

  const [cardStats, setCardStats] = useState({
    openNoAgent: 0,
    negotiation: 0,
    mediationBoard: 0,
    complete: 0,
  });

  const [settlementData, setSettlementData] = useState([]);
  const [terminatedCases, setTerminatedCases] = useState([]);

  useEffect(() => {
    const today = new Date();
    const isLaunchDay =
      today.getFullYear() === 2025 &&
      today.getMonth() === 7 && // Aug (0-indexed)
      today.getDate() === 1;

    if (isLaunchDay) {
      setShowCelebration(true);
    } else {
      setReady(true);
    }

    // Simulated API data
    setCardStats({
      openNoAgent: 12,
      negotiation: 18,
      mediationBoard: 6,
      complete: 30,
    });

    setSettlementData([
      { month: 'May', active: 10, payments: 30000 },
      { month: 'June', active: 14, payments: 40000 },
      { month: 'July', active: 9, payments: 35000 },
    ]);

    setTerminatedCases([
      { billing_center: 'Colombo', count: 8 },
      { billing_center: 'Galle', count: 5 },
      { billing_center: 'Kandy', count: 7 },
      { billing_center: 'Kurunegala', count: 6 },
      { billing_center: 'Anuradhapura', count: 4 },
      { billing_center: 'Ratnapura', count: 9 },
      { billing_center: 'Jaffna', count: 3 },
      { billing_center: 'Matara', count: 5 },
      { billing_center: 'Badulla', count: 6 },
      { billing_center: 'Trincomalee', count: 4 },
      { billing_center: 'Batticaloa', count: 7 },
      { billing_center: 'Ampara', count: 5 },
      { billing_center: 'Polonnaruwa', count: 4 },
      { billing_center: 'Hambantota', count: 6 },
      { billing_center: 'Nuwara Eliya', count: 3 },
    ]);
  }, []);

  if (showCelebration && !ready) {
    return <LaunchCelebration onFinish={() => setReady(true)} />;
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-10">
      <div className="max-w-7xl mx-auto w-full space-y-10">
      <h1 className="text-3xl font-bold">DebtX Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Open No Agent",
            count: cardStats.openNoAgent,
            percentage: 12.5,
            borderColor: "border-red-500",
            icon: "🕵️‍♂️",
            textColor: "text-red-600",
          },
          {
            title: "Negotiation",
            count: cardStats.negotiation,
            percentage: -8.2,
            borderColor: "border-yellow-500",
            icon: "💬",
            textColor: "text-yellow-600",
          },
          {
            title: "Mediation Board",
            count: cardStats.mediationBoard,
            percentage: 6.3,
            borderColor: "border-blue-500",
            icon: "⚖️",
            textColor: "text-blue-600",
          },
          {
            title: "Complete",
            count: cardStats.complete,
            percentage: 14.8,
            borderColor: "border-green-500",
            icon: "✅",
            textColor: "text-green-600",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl shadow-md bg-white border-2 ${card.borderColor} transition-transform transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className={`text-md font-semibold ${card.textColor}`}>{card.title}</h2>
              <span className="text-xl">{card.icon}</span>
            </div>
            <p className={`text-4xl font-bold ${card.textColor}`}>{card.count}</p>
            <div className="mt-2 text-sm">
              {card.percentage >= 0 ? (
                <span className="text-green-500">↑ {card.percentage}% from last month</span>
              ) : (
                <span className="text-red-500">↓ {Math.abs(card.percentage)}% from last month</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DRC and Settlements */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* DRC-wise Case Count */}
        <div className="bg-white rounded-xl p-6 shadow-md flex-1">
          <h2 className="text-lg mb-4 font-semibold">DRC-wise Case Count</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={[
                { drc: "DRC A", cases: 110 },
                { drc: "DRC B", cases: 85 },
                { drc: "DRC C", cases: 130 },
                { drc: "DRC D", cases: 75 },
                { drc: "DRC E", cases: 95 },
                { drc: "DRC F", cases: 120 },
                { drc: "DRC G", cases: 100 },
                { drc: "DRC H", cases: 90 },
                { drc: "DRC I", cases: 105 },
                { drc: "DRC J", cases: 115 },
                { drc: "DRC K", cases: 80 },
                { drc: "DRC L", cases: 98 },
                { drc: "DRC M", cases: 88 },
                { drc: "DRC N", cases: 135 },
                { drc: "DRC O", cases: 110 },
              ]}
            >
              <XAxis dataKey="drc" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cases">
                {[...Array(15)].map((_, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={i % 2 === 0 ? "#11db80ff" : "#4872e6ff"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Settlements vs Payments */}
        <div className="bg-white p-6 rounded-xl shadow-md flex-1">
          <h2 className="text-xl font-semibold mb-4">Active Settlements vs Payments (Last 3 Months)</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={settlementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="active" stroke="#8884d8" name="Active Settlements" />
              <Line type="monotone" dataKey="payments" stroke="#82ca9d" name="Payments" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Terminated Cases by Billing Center */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cases Distribution by Billing Center</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={terminatedCases} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="billing_center" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Case Count">
              {terminatedCases.map((entry, index) => {
                const colors = ["#f97316", "#10b981", "#3b82f6"]; // orange, green, blue
                return <Cell key={`cell-${index}`} fill={colors[index % 3]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
