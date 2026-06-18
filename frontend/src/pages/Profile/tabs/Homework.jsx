import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const Homework = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      // Fallback данные
      setTasks([
        {
          id: 1,
          title: "Vocabulary Exercise",
          due_date: "Tomorrow",
          status: "pending",
          icon: "📝",
        },
        {
          id: 2,
          title: "Grammar Test",
          due_date: "Friday",
          status: "pending",
          icon: "📖",
        },
        {
          id: 3,
          title: "Speaking Practice",
          due_date: "Completed",
          status: "done",
          icon: "🎤",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );

      toast.success("Task updated!");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">📋 Homework</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-60">
            {pendingTasks.length} pending
          </span>
          <button
            onClick={fetchTasks}
            className="p-1.5 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: "var(--color-bg-main)" }}
          >
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 opacity-60">
          <p>No tasks available</p>
        </div>
      ) : (
        tasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01] cursor-pointer"
            style={{ backgroundColor: "var(--color-input-bg)" }}
            onClick={() => {
              if (task.status === "pending") {
                updateTaskStatus(task.id, "done");
              }
            }}
          >
            <div className="text-2xl">{task.icon || "📝"}</div>
            <div className="flex-1">
              <p className="font-medium text-sm">{task.title}</p>
              <p className="text-xs opacity-60">Due: {task.due_date}</p>
              {task.description && (
                <p className="text-xs opacity-40 mt-1">{task.description}</p>
              )}
            </div>
            {task.status === "done" ? (
              <FiCheckCircle className="text-green-500" size={18} />
            ) : (
              <FiClock className="text-yellow-500" size={18} />
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Homework;
