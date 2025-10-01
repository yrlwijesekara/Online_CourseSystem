import React, { useEffect, useState } from "react";
import Sidebar from "../../components/AdminSideBar";
import api from "../../api"; // your axios instance
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Admin({ navigateTo }) {
  const [stats, setStats] = useState({
    userCount: 0,
    courseCount: 0,
    enrollmentCount: 0,
    totalRevenueCents: 0,
  });

  const [loading, setLoading] = useState(true);

  // Mock enrollment growth (for chart visualization)
  const [enrollmentGrowth, setEnrollmentGrowth] = useState([
    { month: 1, enrollments: 5 },
    { month: 2, enrollments: 8 },
    { month: 3, enrollments: 12 },
    { month: 4, enrollments: 20 },
    { month: 5, enrollments: 25 },
    { month: 6, enrollments: 30 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        console.log("Stats response:", res.data);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch system stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = {
    labels: enrollmentGrowth.map((item) => `Month ${item.month}`),
    datasets: [
      {
        label: "Enrollments Growth",
        data: enrollmentGrowth.map((item) => item.enrollments),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Enrollment Growth Over Time" },
    },
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar navigateTo={navigateTo} />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-5 text-center">
            <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
            <p className="text-3xl font-bold mt-2">{stats.userCount}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5 text-center">
            <h2 className="text-lg font-semibold text-gray-600">Total Courses</h2>
            <p className="text-3xl font-bold mt-2">{stats.courseCount}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-5 text-center">
            <h2 className="text-lg font-semibold text-gray-600">Total Enrollments</h2>
            <p className="text-3xl font-bold mt-2">{stats.enrollmentCount}</p>
          </div>
        </div>

        {/* Enrollment Growth Chart */}
        <div className="bg-white shadow rounded-lg p-5">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Admin;
