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
  User,
  Mail,
  Lock,
} from "lucide-react";

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const THEME_KEY = "app-theme";
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  }, [isDark]);

  const languages = [
    { code: "ru", name: "Русский" },
    { code: "uz", name: "O'zbekcha" },
    { code: "eng", name: "English" },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading(t("auth.loading", "Регистрация..."));

    try {
      await axios.post("/api/register", formData);
      toast.dismiss(toastId);
      toast.success(t("auth.success", "Регистрация успешна!"));
      navigate("/login");
    } catch (err) {
      toast.dismiss(toastId);
      setIsLoading(false);
      toast.error(
        err.response?.data?.message || t("auth.error", "Ошибка регистрации"),
      );
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

      {/* Верхнее меню (Тема + Язык) */}
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
                    className="block w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {l.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Форма регистрации */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm p-8 rounded-[2rem] border border-[var(--color-muted)]/20 shadow-2xl bg-[var(--color-bg-main)]"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("auth.register")}
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <User
              className="absolute left-4 top-4 text-[var(--color-muted)]"
              size={20}
            />
            <input
              className="w-full pl-12 p-4 bg-[var(--color-input-bg)] text-[var(--color-dark)] rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all"
              placeholder={t("auth.username")}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <Mail
              className="absolute left-4 top-4 text-[var(--color-muted)]"
              size={20}
            />
            <input
              className="w-full pl-12 p-4 bg-[var(--color-input-bg)] text-[var(--color-dark)] rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all"
              type="email"
              placeholder={t("auth.email")}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-4 text-[var(--color-muted)]"
              size={20}
            />
            <input
              className="w-full pl-12 p-4 bg-[var(--color-input-bg)] text-[var(--color-dark)] rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all"
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
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
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              t("auth.registerBtn")
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="font-bold text-blue-500 hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
