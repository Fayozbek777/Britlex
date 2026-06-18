import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Languages,
  Eye,
  EyeOff,
  Loader2,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const THEME_KEY = "app-theme";
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const languages = [
    { code: "ru", name: "Русский" },
    { code: "uz", name: "O'zbekcha" },
    { code: "en", name: "English" },
  ];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  }, [isDark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading(t("auth.loading", "Загрузка..."));

    try {
      const res = await axios.post("/api/login", formData);
      console.log("Данные от сервера:", res.data);

      // Сохраняем токен
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Сохраняем пользователя
      const userData = res.data.user;
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        login(userData);
      }

      toast.dismiss(toastId);
      toast.success(t("auth.success", "Добро пожаловать!"));

      // ⚠️ ПЕРЕНАПРАВЛЕНИЕ В ЗАВИСИМОСТИ ОТ РОЛИ ⚠️
      const userId = userData.userId || userData.id;

      if (userData.role === "admin") {
        // Админ -> админ панель
        const adminPath =
          import.meta.env.VITE_ADMIN_DASHBOARD_PATH || "/admin/dashboard";
        navigate(adminPath);
      } else if (userData.role === "teacher") {
        // Учитель -> teacher dashboard
        navigate("/teacher/dashboard");
      } else {
        // Студент -> профиль
        navigate(`/profile/${userId}/${userData.username}`);
      }
    } catch (e) {
      toast.dismiss(toastId);
      setIsLoading(false);
      console.error("Login error:", e);
      const errorMessage =
        e.response?.data?.message || t("auth.error", "Ошибка");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-dark)] transition-colors duration-300 flex items-center justify-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="absolute top-6 right-6 flex gap-3">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <Languages size={24} />
            <ChevronDown size={16} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 p-2 bg-[var(--color-bg-main)] border border-[var(--color-muted)]/20 rounded-2xl shadow-xl w-32 z-50"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      i18n.changeLanguage(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`block w-full text-left p-2 rounded-lg ${i18n.language === l.code ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    {l.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm p-8 rounded-[2rem] border border-[var(--color-muted)]/20 shadow-2xl bg-[var(--color-bg-main)]"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("auth.login")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full p-4 bg-[var(--color-input-bg)] text-[var(--color-dark)] rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all"
            placeholder={t("auth.email")}
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <div className="relative">
            <input
              className="w-full p-4 bg-[var(--color-input-bg)] text-[var(--color-dark)] rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-blue-500 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              t("auth.loginBtn")
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-muted)]">
          {t("auth.noAccount")}{" "}
          <Link
            to="/register"
            className="font-bold text-blue-500 hover:underline"
          >
            {t("auth.createAccount")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
