import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Скрытый путь из .env
  const ADMIN_DASHBOARD_PATH =
    import.meta.env.VITE_ADMIN_DASHBOARD_PATH || "/admin/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/login", { email, password });

      if (response.data.user?.role === "admin") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Welcome Admin!");
        navigate(ADMIN_DASHBOARD_PATH);
      } else {
        toast.error("Access denied. Admin only.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md p-8 rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg-main)",
          borderColor: "var(--color-muted)",
        }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm opacity-60 mt-1">Secure admin access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@britlex.uz"
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all border-2 border-transparent focus:border-blue-500"
                style={{ backgroundColor: "var(--color-input-bg)" }}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl outline-none transition-all border-2 border-transparent focus:border-blue-500"
                style={{ backgroundColor: "var(--color-input-bg)" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              backgroundColor: "var(--color-dark)",
              color: "var(--color-bg-main)",
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm opacity-60">
          Default: admin@britlex.uz / admin123
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
