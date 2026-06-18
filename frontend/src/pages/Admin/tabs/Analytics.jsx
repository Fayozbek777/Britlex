import React, { useState, useEffect } from "react";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  UserPlus,
  Calendar,
  Award,
  Download,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalWords: 0,
    totalCards: 0,
    totalUsers: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const token = localStorage.getItem("token");

  // Цвета для графиков
  const colors = {
    blue: "rgba(59, 130, 246, 0.8)",
    purple: "rgba(139, 92, 246, 0.8)",
    green: "rgba(34, 197, 94, 0.8)",
    orange: "rgba(251, 146, 60, 0.8)",
    red: "rgba(239, 68, 68, 0.8)",
    pink: "rgba(236, 72, 153, 0.8)",
    cyan: "rgba(6, 182, 212, 0.8)",
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Получаем статистику с бэкенда
      const response = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        totalStudents: response.data.total_students || 0,
        totalTeachers: response.data.total_teachers || 0,
        totalCourses: response.data.total_courses || 0,
        totalWords: response.data.total_words || 0,
        totalCards: response.data.total_cards || 0,
        totalUsers:
          (response.data.total_students || 0) +
          (response.data.total_teachers || 0),
      });

      // Генерируем месячные данные (пример)
      generateMonthlyData();
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
      // Fallback данные для демонстрации
      setStats({
        totalStudents: 156,
        totalTeachers: 12,
        totalCourses: 24,
        totalWords: 342,
        totalCards: 89,
        totalUsers: 168,
      });
      generateMonthlyData();
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyData = () => {
    // Генерируем данные за последние 6 месяцев
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const data = months.map((month, index) => ({
      month,
      students: Math.floor(Math.random() * 50) + 20 + index * 5,
      teachers: Math.floor(Math.random() * 5) + 3 + Math.floor(index / 2),
      courses: Math.floor(Math.random() * 10) + 5 + index * 2,
    }));
    setMonthlyData(data);
  };

  // Данные для графика студентов
  const studentChartData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Students",
        data: monthlyData.map((d) => d.students),
        backgroundColor: colors.blue,
        borderRadius: 8,
      },
      {
        label: "Teachers",
        data: monthlyData.map((d) => d.teachers),
        backgroundColor: colors.purple,
        borderRadius: 8,
      },
    ],
  };

  // Данные для круговой диаграммы
  const doughnutData = {
    labels: ["Students", "Teachers", "Courses", "Words"],
    datasets: [
      {
        data: [
          stats.totalStudents,
          stats.totalTeachers,
          stats.totalCourses,
          stats.totalWords,
        ],
        backgroundColor: [
          colors.blue,
          colors.purple,
          colors.green,
          colors.orange,
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // Данные для графика прогресса
  const progressData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Course Completion",
        data: monthlyData.map((d) => Math.floor(d.courses * 1.5 + 5)),
        borderColor: colors.blue,
        backgroundColor: colors.blue + "20",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Word Learning",
        data: monthlyData.map((d, i) => Math.floor(d.students * 2 + i * 10)),
        borderColor: colors.green,
        backgroundColor: colors.green + "20",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "var(--color-dark)",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "var(--color-muted)",
          opacity: 0.1,
        },
        ticks: {
          color: "var(--color-muted)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "var(--color-muted)",
        },
      },
    },
  };

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Teachers",
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Words",
      value: stats.totalWords,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">📊 Analytics</h2>
          <p className="text-sm opacity-60 mt-1">Overview of your platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            className="p-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl transition-all hover:scale-105 ${stat.bg}`}
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs opacity-60">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Students & Teachers */}
        <div
          className="p-4 rounded-xl"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users size={18} />
            Students & Teachers Overview
          </h3>
          <div className="h-64">
            <Bar data={studentChartData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut Chart - Distribution */}
        <div
          className="p-4 rounded-xl"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award size={18} />
            Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-64">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Line Chart - Progress */}
        <div
          className="p-4 rounded-xl lg:col-span-2"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            Progress Over Time
          </h3>
          <div className="h-64">
            <Line data={progressData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-3 rounded-xl text-center"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <p className="text-2xl font-bold text-blue-500">{stats.totalUsers}</p>
          <p className="text-xs opacity-60">Total Users</p>
        </div>
        <div
          className="p-3 rounded-xl text-center"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <p className="text-2xl font-bold text-green-500">
            {stats.totalCards}
          </p>
          <p className="text-xs opacity-60">Saved Cards</p>
        </div>
        <div
          className="p-3 rounded-xl text-center"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <p className="text-2xl font-bold text-purple-500">
            {stats.totalStudents > 0
              ? Math.round((stats.totalTeachers / stats.totalStudents) * 100)
              : 0}
            %
          </p>
          <p className="text-xs opacity-60">Teacher Ratio</p>
        </div>
        <div
          className="p-3 rounded-xl text-center"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <p className="text-2xl font-bold text-orange-500">
            {stats.totalCourses > 0
              ? Math.round(stats.totalStudents / stats.totalCourses)
              : 0}
          </p>
          <p className="text-xs opacity-60">Students/Course</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
