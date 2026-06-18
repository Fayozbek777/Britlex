import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  Trash2,
  Edit2,
  Eye,
  Filter,
  RefreshCw,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  // Проверка токена
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    if (!token) {
      toast.error("No token found. Please login.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("/api/admin/students", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setStudents(response.data.students || []);
      toast.success(`Loaded ${response.data.students?.length || 0} students`);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        // navigate("/login");
      } else {
        toast.error("Failed to load students");
      }
      // Fallback данные для демонстрации
      setStudents([
        {
          id: 1,
          username: "john_doe",
          email: "john@example.com",
          phone: "+998901234567",
          created_at: "2024-01-15",
          words_count: 45,
          cards_count: 3,
        },
        {
          id: 2,
          username: "jane_smith",
          email: "jane@example.com",
          phone: "+998901234568",
          created_at: "2024-02-20",
          words_count: 32,
          cards_count: 2,
        },
        {
          id: 3,
          username: "alex_wilson",
          email: "alex@example.com",
          phone: "+998901234569",
          created_at: "2024-03-10",
          words_count: 18,
          cards_count: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone?.includes(searchTerm),
  );

  const handleDelete = async (id) => {
    if (!token) {
      toast.error("Please login");
      return;
    }

    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`/api/admin/students/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setStudents(students.filter((s) => s.id !== id));
        toast.success("Student deleted successfully");
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error("Failed to delete student");
        }
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!token) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto mb-4 opacity-30" />
        <p className="opacity-60">Please login to view students</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">👨‍🎓 Students</h2>
          <p className="text-sm opacity-60 mt-1">
            Total: {students.length} students
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="p-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p className="opacity-60">No students found</p>
          {searchTerm && (
            <p className="text-sm opacity-40 mt-2">Try adjusting your search</p>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredStudents.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl transition-all hover:scale-[1.01] flex flex-wrap items-center justify-between gap-4"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              {/* Student Info */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: "var(--color-bg-main)",
                    color: "var(--color-dark)",
                  }}
                >
                  {student.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {student.username || "Unknown"}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap text-xs opacity-60">
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      {student.email || "No email"}
                    </span>
                    {student.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {student.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center px-3">
                  <p className="text-sm font-semibold">
                    {student.words_count || 0}
                  </p>
                  <p className="text-xs opacity-60">Words</p>
                </div>
                <div className="text-center px-3">
                  <p className="text-sm font-semibold">
                    {student.cards_count || 0}
                  </p>
                  <p className="text-xs opacity-60">Cards</p>
                </div>
                <div className="text-center px-3">
                  <p className="text-xs opacity-60">
                    {formatDate(student.created_at)}
                  </p>
                  <p className="text-xs opacity-40">Joined</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowModal(true);
                  }}
                  className="p-2 rounded-lg transition-all hover:scale-105"
                  style={{ backgroundColor: "var(--color-bg-main)" }}
                >
                  <Eye size={16} />
                </button>
                <button
                  className="p-2 rounded-lg transition-all hover:scale-105"
                  style={{ backgroundColor: "var(--color-bg-main)" }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
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

      {/* Student Details Modal */}
      <AnimatePresence>
        {showModal && selectedStudent && (
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
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Student Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-[var(--color-input-bg)] transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    {selectedStudent.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedStudent.username}
                    </p>
                    <p className="text-sm opacity-60">
                      Student ID: #{selectedStudent.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <Mail size={16} className="opacity-60" />
                    <span className="text-sm">
                      {selectedStudent.email || "No email"}
                    </span>
                  </div>
                  {selectedStudent.phone && (
                    <div
                      className="flex items-center gap-3 p-2 rounded-lg"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                    >
                      <Phone size={16} className="opacity-60" />
                      <span className="text-sm">{selectedStudent.phone}</span>
                    </div>
                  )}
                  <div
                    className="flex items-center gap-3 p-2 rounded-lg"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <Calendar size={16} className="opacity-60" />
                    <span className="text-sm">
                      Joined: {formatDate(selectedStudent.created_at)}
                    </span>
                  </div>
                </div>

                <div
                  className="grid grid-cols-2 gap-3 pt-4 border-t"
                  style={{ borderColor: "var(--color-muted)" }}
                >
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <BookOpen size={20} className="mx-auto mb-1 opacity-60" />
                    <p className="text-xl font-bold">
                      {selectedStudent.words_count || 0}
                    </p>
                    <p className="text-xs opacity-60">Words Saved</p>
                  </div>
                  <div
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <Award size={20} className="mx-auto mb-1 opacity-60" />
                    <p className="text-xl font-bold">
                      {selectedStudent.cards_count || 0}
                    </p>
                    <p className="text-xs opacity-60">Cards Saved</p>
                  </div>
                </div>

                <button
                  className="w-full py-2.5 rounded-lg font-medium transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--color-dark)",
                    color: "var(--color-bg-main)",
                  }}
                >
                  View Full Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;
