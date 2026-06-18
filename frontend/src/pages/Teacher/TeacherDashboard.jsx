import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  Award,
  Clock,
  Settings,
  LogOut,
  User,
  Bell,
  MessageCircle,
  FileText,
  BarChart2,
  Plus,
  X,
  Save,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import axios from "axios";

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    icon: "📝",
  });

  useEffect(() => {
    if (user && user.role !== "teacher" && user.role !== "admin") {
      toast.error("Access denied. Teachers only.");
      navigate("/forbidden");
    }
    fetchTasks();
  }, [user, navigate]);

  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    if (!formData.title || !formData.due_date) {
      toast.error("Title and due date are required");
      return;
    }

    setLoading(true);
    try {
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task updated!");
      } else {
        await axios.post("/api/tasks", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task created! All students can see it.");
      }
      await fetchTasks();
      setShowModal(false);
      setEditingTask(null);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await axios.delete(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task deleted!");
        await fetchTasks();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      due_date: "",
      icon: "📝",
    });
  };

  const icons = ["📝", "📖", "🎤", "📚", "✍️", "🎯", "💡", "🌟"];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out");
  };

  const stats = [
    {
      label: "My Courses",
      value: "5",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Students",
      value: "89",
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Classes Today",
      value: "3",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Tasks",
      value: tasks.length,
      icon: FileText,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "done");

  return (
    <div
      className="min-h-screen p-6 transition-all duration-300"
      style={{
        backgroundColor: "var(--color-bg-main)",
        color: "var(--color-dark)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg"
              style={{
                backgroundColor: "var(--color-dark)",
                color: "var(--color-bg-main)",
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "T"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.username || "Teacher"}! 👋
              </h1>
              <p className="text-sm opacity-60">Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="p-2.5 rounded-xl transition-all hover:scale-105 relative"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
                {pendingTasks.length}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl transition-all hover:scale-105 text-red-500"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-2 mb-6 border-b pb-3"
          style={{ borderColor: "var(--color-muted)" }}
        >
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "bg-[#263238] dark:bg-white text-white dark:text-[#263238]"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <BarChart2 size={16} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === "tasks"
                ? "bg-[#263238] dark:bg-white text-white dark:text-[#263238]"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <FileText size={16} />
            Tasks ({tasks.length})
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white inline-block mb-2`}
                    >
                      <Icon size={20} />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm opacity-60">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className="lg:col-span-2 p-5 rounded-xl"
                style={{ backgroundColor: "var(--color-input-bg)" }}
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock size={18} />
                  Recent Tasks
                </h3>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                ) : tasks.length === 0 ? (
                  <p className="text-center opacity-60 py-4">
                    No tasks created yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-2 rounded-lg"
                        style={{ backgroundColor: "var(--color-bg-main)" }}
                      >
                        <span className="text-xl">{task.icon || "📝"}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <p className="text-xs opacity-40">
                            Due: {task.due_date}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            task.status === "done"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {task.status || "pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="p-5 rounded-xl"
                style={{ backgroundColor: "var(--color-input-bg)" }}
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings size={18} />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      resetForm();
                      setEditingTask(null);
                      setShowModal(true);
                    }}
                    className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02] flex items-center gap-3"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                  >
                    <Plus size={16} />
                    <span className="text-sm">Create Task</span>
                  </button>
                  <button
                    className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02] flex items-center gap-3"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                  >
                    <BookOpen size={16} />
                    <span className="text-sm">View Courses</span>
                  </button>
                  <button
                    className="w-full p-3 rounded-lg text-left transition-all hover:scale-[1.02] flex items-center gap-3"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm">View Messages</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">All Tasks</h3>
                <p className="text-xs opacity-60">
                  {pendingTasks.length} pending • {completedTasks.length}{" "}
                  completed
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setEditingTask(null);
                  setShowModal(true);
                }}
                className="px-4 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2 text-white"
                style={{ backgroundColor: "#3b82f6" }}
              >
                <Plus size={16} />
                Create Task
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>No tasks created yet</p>
                <button
                  onClick={() => {
                    resetForm();
                    setEditingTask(null);
                    setShowModal(true);
                  }}
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--color-dark)",
                    color: "var(--color-bg-main)",
                  }}
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl flex flex-wrap items-center justify-between gap-4"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{task.icon || "📝"}</div>
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-xs opacity-60">
                          Due: {task.due_date}
                        </p>
                        {task.description && (
                          <p className="text-xs opacity-40 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          task.status === "done"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {task.status || "pending"}
                      </span>
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setFormData({
                            title: task.title,
                            description: task.description || "",
                            due_date: task.due_date,
                            icon: task.icon || "📝",
                          });
                          setShowModal(true);
                        }}
                        className="p-2 rounded-lg transition-all hover:scale-105"
                        style={{ backgroundColor: "var(--color-bg-main)" }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-lg transition-all hover:scale-105 text-red-500"
                        style={{ backgroundColor: "var(--color-bg-main)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Task Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-md w-full rounded-2xl p-6 shadow-2xl"
                style={{ backgroundColor: "var(--color-bg-main)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold">
                    {editingTask ? "Edit Task" : "Create New Task"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-lg hover:bg-[var(--color-input-bg)] transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="Task title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows="2"
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all resize-none"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="Task description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Due Date *
                    </label>
                    <input
                      type="text"
                      value={formData.due_date}
                      onChange={(e) =>
                        setFormData({ ...formData, due_date: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="e.g. Tomorrow, Friday, 2026-06-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Icon
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {icons.map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setFormData({ ...formData, icon })}
                          className={`w-10 h-10 rounded-lg text-2xl transition-all ${
                            formData.icon === icon
                              ? "border-2 border-blue-500 bg-blue-500/10"
                              : "hover:bg-[var(--color-input-bg)]"
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <p className="text-xs opacity-60 flex items-center gap-2">
                      <AlertCircle size={14} />
                      Task will be visible to all students
                    </p>
                  </div>

                  <button
                    onClick={handleSaveTask}
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--color-dark)",
                      color: "var(--color-bg-main)",
                    }}
                  >
                    <Save size={18} />
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherDashboard;
