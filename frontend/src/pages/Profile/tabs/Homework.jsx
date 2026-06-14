import React from "react";
import { useTranslation } from "react-i18next";
import { FiBookOpen, FiCheckCircle, FiClock } from "react-icons/fi";

const Homework = () => {
  const { t } = useTranslation();

  const tasks = [
    {
      id: 1,
      title: "Vocabulary Exercise",
      due: "Tomorrow",
      status: "pending",
      icon: "📝",
    },
    {
      id: 2,
      title: "Grammar Test",
      due: "Friday",
      status: "pending",
      icon: "📖",
    },
    {
      id: 3,
      title: "Speaking Practice",
      due: "Completed",
      status: "done",
      icon: "🎤",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">📋 Homework</h2>
        <span className="text-sm opacity-60">
          {tasks.filter((t) => t.status === "pending").length} pending
        </span>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <div className="text-2xl">{task.icon}</div>
          <div className="flex-1">
            <p className="font-medium text-sm">{task.title}</p>
            <p className="text-xs opacity-60">Due: {task.due}</p>
          </div>
          {task.status === "done" ? (
            <FiCheckCircle className="text-green-500" size={18} />
          ) : (
            <FiClock className="text-yellow-500" size={18} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Homework;
