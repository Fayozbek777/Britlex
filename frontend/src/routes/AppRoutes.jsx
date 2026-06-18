import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Auth/Login/Login";
import Forbidden from "../pages/Forbidden/Forbidden";
import Cookie from "../pages/Legal/Cookie";
import Privacy from "../pages/Legal/Privacy";
import Terms from "../pages/Legal/Terms";
import Register from "../pages/Auth/Register/Register";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Profile/tabs/Settings";
import Billing from "../pages/Profile/tabs/Billing";
import Certificates from "../pages/Profile/tabs/Certificates";
import Dictionary from "../pages/Profile/tabs/Dictionary";
import Homework from "../pages/Profile/tabs/Homework";
import AdminLogin from "../pages/Admin/login/AdminLogin";
import Dashboard from "../pages/Admin/Dashboard";
import Analytics from "../pages/Admin/tabs/Analytics";
import CoursesManager from "../pages/Admin/tabs/CoursesManager";
import Students from "../pages/Admin/tabs/Students";
import Teachers from "../pages/Admin/tabs/Teachers";
import AdminSettings from "../pages/Admin/tabs/Settings";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import Task from "../pages/Teacher/tabs/Task";

const AppRoutes = () => {
  const ADMIN_LOGIN_PATH =
    import.meta.env.VITE_ADMIN_LOGIN_PATH || "/admin/login";
  const ADMIN_DASHBOARD_PATH =
    import.meta.env.VITE_ADMIN_DASHBOARD_PATH || "/admin/dashboard";

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-[var(--color-dark)] transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/cookie" element={<Cookie />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="tasks" element={<Task />} />
        {/* Скрытый админ логин из .env */}
        <Route path={ADMIN_LOGIN_PATH} element={<AdminLogin />} />

        {/* Student Routes */}
        <Route
          element={
            <ProtectedRoutes allowedRoles={["student", "admin", "teacher"]} />
          }
        >
          <Route path="/profile" element={<Profile />}>
            <Route index element={<Navigate to="homework" replace />} />
            <Route path="homework" element={<Homework />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="dictionary" element={<Dictionary />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/profile/:userId/:username" element={<Profile />}>
            <Route index element={<Navigate to="homework" replace />} />
            <Route path="homework" element={<Homework />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="dictionary" element={<Dictionary />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Teacher Routes */}
        <Route
          element={<ProtectedRoutes allowedRoles={["teacher", "admin"]} />}
        >
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path={ADMIN_DASHBOARD_PATH} element={<Dashboard />}>
            <Route index element={<Navigate to="analytics" replace />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="courses" element={<CoursesManager />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
