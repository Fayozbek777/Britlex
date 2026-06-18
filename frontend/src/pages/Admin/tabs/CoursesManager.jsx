import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronRight,
  X,
  Save,
  Image,
  Calendar,
  Tag,
  Globe,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const CoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Beginner",
    category: "English",
    duration: "",
    price: "",
    students: 0,
    rating: 0,
    image: "",
    status: "Active",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Здесь будет запрос к бэкенду
      // const response = await axios.get("/api/admin/courses", {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setCourses(response.data.courses);

      // Fallback данные
      setCourses([
        {
          id: 1,
          title: "English for Beginners",
          description: "Learn basic English from scratch",
          level: "Beginner",
          category: "English",
          duration: "40 hours",
          price: "$49",
          students: 156,
          rating: 4.8,
          image: "📚",
          status: "Active",
        },
        {
          id: 2,
          title: "Intermediate English",
          description: "Improve your English skills",
          level: "Intermediate",
          category: "English",
          duration: "50 hours",
          price: "$69",
          students: 89,
          rating: 4.6,
          image: "📖",
          status: "Active",
        },
        {
          id: 3,
          title: "Business English",
          description: "Professional business communication",
          level: "Advanced",
          category: "English",
          duration: "30 hours",
          price: "$99",
          students: 45,
          rating: 4.9,
          image: "💼",
          status: "Inactive",
        },
      ]);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (editingCourse) {
        // Update course
        // await axios.put(`/api/admin/courses/${editingCourse.id}`, formData, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        setCourses(
          courses.map((c) =>
            c.id === editingCourse.id ? { ...c, ...formData } : c,
          ),
        );
        toast.success("Course updated successfully!");
      } else {
        // Add new course
        // await axios.post("/api/admin/courses", formData, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        setCourses([{ id: Date.now(), ...formData }, ...courses]);
        toast.success("Course added successfully!");
      }
      setShowModal(false);
      setEditingCourse(null);
      resetForm();
    } catch (error) {
      toast.error("Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        // await axios.delete(`/api/admin/courses/${id}`, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        setCourses(courses.filter((c) => c.id !== id));
        toast.success("Course deleted successfully");
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      level: "Beginner",
      category: "English",
      duration: "",
      price: "",
      students: 0,
      rating: 0,
      image: "",
      status: "Active",
    });
  };

  const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const categories = ["English", "Math", "Science", "Business", "Technology"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">📚 Courses</h2>
          <p className="text-sm opacity-60 mt-1">
            Total: {courses.length} courses
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCourses}
            className="p-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingCourse(null);
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-lg transition-all hover:scale-105 flex items-center gap-2 text-white"
            style={{ backgroundColor: "#3b82f6" }}
          >
            <Plus size={16} />
            Add Course
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
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          />
        </div>
        <button
          className="p-2.5 rounded-lg transition-all flex items-center gap-2"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p className="opacity-60">No courses found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                  >
                    {course.image || "📚"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{course.title}</h3>
                    <p className="text-xs opacity-60">{course.category}</p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    course.status === "Active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {course.status}
                </div>
              </div>

              <p className="text-sm opacity-60 line-clamp-2 mb-3">
                {course.description}
              </p>

              <div className="flex items-center gap-4 text-xs opacity-60 mb-3">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {course.students}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" />
                  {course.rating}
                </span>
              </div>

              <div
                className="flex items-center justify-between pt-3 border-t"
                style={{ borderColor: "var(--color-muted)" }}
              >
                <span className="font-bold">{course.price}</span>
                <div className="flex gap-2">
                  <button
                    className="p-1.5 rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setFormData(course);
                      setShowModal(true);
                    }}
                    className="p-1.5 rounded-lg transition-all hover:scale-105"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-1.5 rounded-lg transition-all hover:scale-105 text-red-500"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
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
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
              style={{ backgroundColor: "var(--color-bg-main)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">
                  {editingCourse ? "Edit Course" : "Add New Course"}
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
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all resize-none"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                    placeholder="Course description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="e.g. 40 hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                      placeholder="$49"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                  {editingCourse ? "Update Course" : "Add Course"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesManager;
