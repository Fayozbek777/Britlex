import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  GraduationCap,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const ADMIN_DASHBOARD_PATH =
    import.meta.env.VITE_ADMIN_DASHBOARD_PATH || "/admin/dashboard";

  const menuItems = [
    { to: "analytics", label: "Аналитика", icon: BarChart3 },
    { to: "courses", label: "Курсы", icon: GraduationCap },
    { to: "students", label: "Студенты", icon: Users },
    { to: "teachers", label: "Учителя", icon: ShieldAlert },
    { to: "settings", label: "Настройки", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleBack = () => {
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3.5 font-semibold text-sm rounded-2xl transition-all cursor-pointer relative ${
      isActive
        ? "text-white"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-100 font-poppins">
      <aside className="w-72 bg-[#1E293B] border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                <LayoutDashboard size={22} />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">Britlex</h2>
                <span className="text-xs text-blue-500 font-semibold tracking-wider uppercase">
                  Admin Panel
                </span>
              </div>
            </div>
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/5 rounded-lg transition-all"
              title="Вернуться на сайт"
            >
              <ArrowLeft size={18} className="text-gray-400" />
            </button>
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="adminActiveTab"
                          className="absolute inset-0 bg-blue-600 rounded-2xl -z-10 shadow-lg shadow-blue-600/20"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon size={18} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-2xl transition-all cursor-pointer font-semibold text-sm"
        >
          <LogOut size={18} />
          Выйти из панели
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
