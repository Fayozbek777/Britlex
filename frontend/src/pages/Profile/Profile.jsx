import React, { useState, useEffect, useRef } from "react";
import { useParams, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import {
  FiBookOpen,
  FiSettings,
  FiCreditCard,
  FiGlobe,
  FiMoon,
  FiSun,
  FiLogOut,
  FiUser,
  FiAward,
  FiBookmark,
  FiMenu,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const { userId, username } = useParams();
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const langRef = useRef();
  const menuRef = useRef();
  const [currentUser, setCurrentUser] = useState(user);
  const token = localStorage.getItem("token");

  const isOwnProfile = !userId || userId === currentUser?.userId;
  const displayId = userId || currentUser?.userId;
  const displayUsername = username || currentUser?.username;
  const displayAvatar = currentUser?.avatar;

  const fetchUserData = async () => {
    if (!token) return;
    try {
      const response = await axios.get("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.user) {
        setCurrentUser(response.data.user);
        login(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target))
        setIsLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    setIsLangOpen(false);
    toast.success(`Language changed to ${lang.toUpperCase()}`);
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
    toast.success("Logged out");
  };

  const navItems = [
    {
      path: "homework",
      icon: FiBookOpen,
      label: t("profile.homework", "Homework"),
    },
    {
      path: "certificates",
      icon: FiAward,
      label: t("profile.certificates", "Certificates"),
    },
    {
      path: "dictionary",
      icon: FiBookmark,
      label: t("profile.dictionary", "Dictionary"),
    },
    {
      path: "billing",
      icon: FiCreditCard,
      label: t("profile.billing", "Billing"),
    },
    {
      path: "settings",
      icon: FiSettings,
      label: t("profile.settings", "Settings"),
    },
  ];

  const tabClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl transition-all ${
      isActive
        ? "bg-[#263238] dark:bg-white text-white dark:text-[#263238] shadow-md"
        : "text-[#8f95a5] dark:text-[#a0a5b5] hover:bg-[#263238]/10"
    }`;

  return (
    <div
      className="min-h-screen p-4 lg:p-6 transition-all duration-300"
      style={{
        backgroundColor: "var(--color-bg-main)",
        color: "var(--color-dark)",
      }}
    >
      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Right Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-72 z-50 shadow-2xl lg:hidden overflow-y-auto"
            style={{ backgroundColor: "var(--color-bg-main)" }}
          >
            <div
              className="p-5 border-b"
              style={{ borderColor: "var(--color-muted)", opacity: 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg transition-all hover:bg-[#263238]/10"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: "var(--color-dark)",
                    color: "var(--color-bg-main)",
                  }}
                >
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    displayUsername?.[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{displayUsername}</p>
                  <p className="text-xs opacity-60">
                    ID: {displayId?.slice(0, 8)}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-[#263238] dark:bg-white text-white dark:text-[#263238]"
                          : "hover:bg-[#263238]/10"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div
              className="h-px mx-3"
              style={{ backgroundColor: "var(--color-muted)", opacity: 0.1 }}
            />

            <div className="p-3 space-y-1">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-[#263238]/10"
              ></button>

              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all hover:bg-[#263238]/10"
                >
                  <div className="flex items-center gap-3">
                    <FiGlobe size={18} />
                    <span className="text-sm">Language</span>
                  </div>
                  <span className="text-sm opacity-60">
                    {i18n.language.toUpperCase()}
                  </span>
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-3 right-3 mt-1 rounded-lg shadow-lg border overflow-hidden z-50"
                      style={{
                        backgroundColor: "var(--color-bg-main)",
                        borderColor: "var(--color-muted)",
                      }}
                    >
                      {["ru", "en", "uz"].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => changeLanguage(lang)}
                          className={`w-full px-3 py-2 text-left text-sm transition-all ${
                            i18n.language === lang
                              ? "bg-[#263238] text-white"
                              : "hover:bg-[#263238]/10"
                          }`}
                        >
                          {lang === "ru"
                            ? "Русский"
                            : lang === "en"
                              ? "English"
                              : "O'zbekcha"}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div
              className="h-px mx-3"
              style={{ backgroundColor: "var(--color-muted)", opacity: 0.1 }}
            />

            <div className="p-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FiLogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        {/* Header с кнопкой Вернуться */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {/* Кнопка Вернуться на главную */}
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <FiArrowLeft size={18} />
            </button>

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-md"
              style={{
                backgroundColor: "var(--color-dark)",
                color: "var(--color-bg-main)",
              }}
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                displayUsername?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold">{displayUsername}</h1>
              <p className="text-xs opacity-60">ID: {displayId?.slice(0, 8)}</p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex gap-2">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
            </button>

            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 rounded-lg transition-all"
                style={{ backgroundColor: "var(--color-input-bg)" }}
              >
                <FiGlobe size={16} />
              </button>
            </div>

            {isOwnProfile && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-all text-red-500 hover:bg-red-50"
                style={{ backgroundColor: "var(--color-input-bg)" }}
              >
                <FiLogOut size={16} />
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden gap-2">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg transition-all"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <FiMenu size={18} />
            </button>
          </div>
        </div>

        {/* Desktop Tabs */}
        {isOwnProfile && (
          <div
            className="hidden lg:flex flex-wrap gap-1 mb-5 p-1 rounded-xl"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={tabClass}>
                {({ isActive }) => (
                  <div className="flex items-center gap-1.5 px-2">
                    <item.icon size={14} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        )}

        {/* Content */}
        {isOwnProfile ? (
          <div
            className="rounded-xl p-5 transition-all"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <Outlet context={{ refreshUser: fetchUserData }} />
          </div>
        ) : (
          <div
            className="rounded-xl p-10 text-center"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <div
              className="w-20 h-20 mx-auto mb-3 rounded-xl flex items-center justify-center text-3xl font-bold"
              style={{
                backgroundColor: "var(--color-dark)",
                color: "var(--color-bg-main)",
              }}
            >
              {displayUsername?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{displayUsername}</h2>
            <button
              className="mt-4 px-5 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: "var(--color-dark)",
                color: "var(--color-bg-main)",
              }}
            >
              Follow
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
