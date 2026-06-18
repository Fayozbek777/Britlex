import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Users,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Save,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    if (token) {
      fetchTeachers();
    } else {
      toast.error("Please login first");
      setLoading(false);
    }
  }, []);

  const fetchTeachers = async () => {
    if (!token) {
      toast.error("No token found. Please login.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("/api/admin/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setTeachers(response.data.teachers || []);
      toast.success(`Loaded ${response.data.teachers?.length || 0} teachers`);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        // Можно перенаправить на логин
        // window.location.href = "/login";
      } else {
        toast.error("Failed to load teachers");
      }
      // Fallback данные для демонстрации
      setTeachers([
        {
          id: 1,
          username: "teacher_john",
          email: "john@teacher.com",
          phone: "+998901234567",
          created_at: "2024-01-15",
        },
        {
          id: 2,
          username: "teacher_jane",
          email: "jane@teacher.com",
          phone: "+998901234568",
          created_at: "2024-02-20",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone?.includes(searchTerm),
  );

  const handleSave = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/admin/teachers", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setTeachers([response.data.teacher, ...teachers]);
      toast.success("Teacher created successfully!");
      setShowModal(false);
      setEditingTeacher(null);
      resetForm();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(error.response?.data?.error || "Failed to save teacher");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      toast.error("Please login");
      return;
    }

    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`/api/admin/teachers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setTeachers(teachers.filter((t) => t.id !== id));
        toast.success("Teacher deleted successfully");
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error("Failed to delete teacher");
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      phone: "",
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">👨‍🏫 Teachers</h2>
          <p className="text-sm opacity-60 mt-1">
            Total: {teachers.length} teachers
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTeachers}
            disabled={loading}
            className="p-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingTeacher(null);
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2 text-white"
            style={{ backgroundColor: "#3b82f6" }}
          >
            <UserPlus size={16} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          />
        </div>
      </div>

      {/* Teachers List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p className="opacity-60">No teachers found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredTeachers.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl transition-all hover:scale-[1.01] flex flex-wrap items-center justify-between gap-4"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <div className="flex items-center gap-4 min-w-[200px]">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: "var(--color-bg-main)",
                    color: "var(--color-dark)",
                  }}
                >
                  {teacher.username?.[0]?.toUpperCase() || "T"}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {teacher.username || "Unknown"}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap text-xs opacity-60">
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      {teacher.email || "No email"}
                    </span>
                    {teacher.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {teacher.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center px-3">
                  <p className="text-xs opacity-60">
                    {formatDate(teacher.created_at)}
                  </p>
                  <p className="text-xs opacity-40">Joined</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500">
                  Teacher
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="p-2 rounded-lg transition-all hover:scale-105"
                  style={{ backgroundColor: "var(--color-bg-main)" }}
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
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

      {/* Add Teacher Modal */}
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
                <h3 className="text-xl font-bold">Add New Teacher</h3>
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
                    Username *
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="Enter username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                      size={18}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="teacher@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                      size={18}
                    />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="+998 XX XXX XX XX"
                    />
                  </div>
                </div>

                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--color-input-bg)" }}
                >
                  <p className="text-sm opacity-60 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Teacher will be able to login with these credentials
                  </p>
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
                  Create Teacher
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teachers;
