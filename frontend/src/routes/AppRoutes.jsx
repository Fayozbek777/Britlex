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

const AppRoutes = () => {
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

        <Route element={<ProtectedRoutes />}>
          {/* Свой профиль */}
          <Route path="/profile" element={<Profile />}>
            <Route index element={<Navigate to="homework" replace />} />
            <Route path="homework" element={<Homework />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="dictionary" element={<Dictionary />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Чужой профиль с параметрами */}
          <Route path="/profile/:userId/:username" element={<Profile />}>
            <Route index element={<Navigate to="homework" replace />} />
            <Route path="homework" element={<Homework />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="dictionary" element={<Dictionary />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Маршрут для userfeed (для обратной совместимости) */}
          <Route
            path="/profile/userfeed/:userId/:username"
            element={<Profile />}
          >
            <Route index element={<Navigate to="homework" replace />} />
            <Route path="homework" element={<Homework />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="dictionary" element={<Dictionary />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
