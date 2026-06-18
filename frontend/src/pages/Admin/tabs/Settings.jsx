import React, { useState, useEffect } from "react";
import {
  Save,
  Globe,
  Moon,
  Sun,
  Bell,
  Mail,
  Shield,
  User,
  Lock,
  Key,
  Monitor,
  Smartphone,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Training Center",
    adminEmail: "admin@britlex.uz",
    theme: "dark",
    language: "ru",
    notifications: true,
    emailUpdates: true,
    twoFactorAuth: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Загружаем настройки из localStorage
    const savedTheme = localStorage.getItem("theme");
    const savedLang = localStorage.getItem("i18nextLng");

    setSettings((prev) => ({
      ...prev,
      theme: savedTheme || "dark",
      language: savedLang || "ru",
    }));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Сохраняем настройки
      localStorage.setItem("theme", settings.theme);
      localStorage.setItem("i18nextLng", settings.language);

      // Применяем тему
      document.documentElement.classList.toggle(
        "dark",
        settings.theme === "dark",
      );

      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">⚙️ Settings</h2>
          <p className="text-sm opacity-60 mt-1">Manage your admin settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-dark)",
            color: "var(--color-bg-main)",
          }}
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl space-y-4"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Monitor size={18} />
            Appearance
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSettings({ ...settings, theme: "light" })}
                  className={`flex-1 p-3 rounded-xl transition-all flex items-center gap-2 justify-center ${
                    settings.theme === "light"
                      ? "border-2 border-blue-500"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: "var(--color-bg-main)" }}
                >
                  <Sun size={18} />
                  Light
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: "dark" })}
                  className={`flex-1 p-3 rounded-xl transition-all flex items-center gap-2 justify-center ${
                    settings.theme === "dark"
                      ? "border-2 border-blue-500"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: "var(--color-bg-main)" }}
                >
                  <Moon size={18} />
                  Dark
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { code: "ru", label: "Русский" },
                  { code: "en", label: "English" },
                  { code: "uz", label: "O'zbekcha" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() =>
                      setSettings({ ...settings, language: lang.code })
                    }
                    className={`px-4 py-2 rounded-lg transition-all ${
                      settings.language === lang.code
                        ? "bg-blue-600 text-white"
                        : "hover:bg-[var(--color-bg-main)]"
                    }`}
                  >
                    <Globe size={16} className="inline mr-2" />
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl space-y-4"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Bell size={18} />
            Notifications
          </h3>

          <div className="space-y-3">
            <label
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg"
              style={{ backgroundColor: "var(--color-bg-main)" }}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} className="opacity-60" />
                <div>
                  <p className="font-medium text-sm">Push Notifications</p>
                  <p className="text-xs opacity-60">
                    Receive push notifications
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications: !settings.notifications,
                  })
                }
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.notifications ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    settings.notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>

            <label
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg"
              style={{ backgroundColor: "var(--color-bg-main)" }}
            >
              <div className="flex items-center gap-3">
                <Mail size={18} className="opacity-60" />
                <div>
                  <p className="font-medium text-sm">Email Updates</p>
                  <p className="text-xs opacity-60">Get updates via email</p>
                </div>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    emailUpdates: !settings.emailUpdates,
                  })
                }
                className={`w-12 h-6 rounded-full transition-all ${
                  settings.emailUpdates ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    settings.emailUpdates ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl space-y-4 lg:col-span-2"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Shield size={18} />
            Security
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Change Password */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Key size={16} />
                Change Password
              </h4>
              <form onSubmit={handlePasswordChange} className="space-y-3">
                <div>
                  <input
                    type="password"
                    placeholder="Current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="New password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: "var(--color-bg-main)" }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg font-medium transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--color-dark)",
                    color: "var(--color-bg-main)",
                  }}
                >
                  <Lock size={16} className="inline mr-2" />
                  Update Password
                </button>
              </form>
            </div>

            {/* Two Factor Auth */}
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--color-bg-main)" }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Shield size={20} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs opacity-60 mt-1">
                    Add an extra layer of security to your account
                  </p>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        twoFactorAuth: !settings.twoFactorAuth,
                      })
                    }
                    className={`mt-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      settings.twoFactorAuth
                        ? "text-green-500 bg-green-500/10"
                        : "text-blue-500 bg-blue-500/10"
                    }`}
                  >
                    {settings.twoFactorAuth ? (
                      <>
                        <CheckCircle size={14} className="inline mr-1" />{" "}
                        Enabled
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} className="inline mr-1" /> Enable
                        2FA
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <div
          className="lg:col-span-2 p-4 rounded-xl text-center text-sm opacity-60"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <p>Settings are automatically saved to your profile</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
