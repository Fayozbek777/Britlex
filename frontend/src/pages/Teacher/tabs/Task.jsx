import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Save,
  Trash2,
  Edit2,
  RefreshCw,
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    icon: "📝",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks || []);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.due_date) {
      toast.error("Title and due date are required");
      return;
    }

    setLoading(true);
    try {
      if (editingTask) {
        // Обновление
        await axios.put(`/api/tasks/${editingTask.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task updated!");
      } else {
        // Создание
        await axios.post("/api/tasks", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task created!");
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

  const handleDelete = async (id) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">📋 Tasks Manager</h2>
          <p className="text-sm opacity-60 mt-1">Total: {tasks.length} tasks</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTasks}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
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
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 opacity-60">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>No tasks created yet</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl transition-all hover:scale-[1.01] flex flex-wrap items-center justify-between gap-4"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{task.icon || "📝"}</div>
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-xs opacity-60">
                    Due: {task.due_date}
                    {task.description && ` • ${task.description}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        task.status === "done"
                          ? "bg-green-500/10 text-green-500"
                          : task.status === "in_progress"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {task.status || "pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
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
                  onClick={() => handleDelete(task.id)}
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

      {/* Create/Edit Modal */}
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
                      setFormData({ ...formData, description: e.target.value })
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
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.due_date}
                      onChange={(e) =>
                        setFormData({ ...formData, due_date: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="e.g. Tomorrow, Friday, 2026-06-20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
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

                <button
                  onClick={handleSave}
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
  );
};

export default Task;
