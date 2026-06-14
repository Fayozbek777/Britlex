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

// Импорт компонентов вкладок профиля
import MyCourses from "../pages/Profile/tabs/MyCourses";
import Settings from "../pages/Profile/tabs/Settings";
import Billing from "../pages/Profile/tabs/Billing";

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-bg-main text-dark transition-colors duration-300">
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/fr" element={<Forbidden />} />
        <Route path="/cookie" element={<Cookie />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Защищенные маршруты */}
        <Route element={<ProtectedRoutes />}>
          {/* 1. Свой профиль пользователя */}
          <Route path="/profile" element={<Profile />}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="settings" element={<Settings />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          {/* 2. Просмотр чужого профиля (userfeed) */}
          <Route
            path="/profile/userfeed/:userId/:username"
            element={<Profile />}
          >
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="settings" element={<Settings />} />
            <Route path="billing" element={<Billing />} />
          </Route>
        </Route>

        {/* 404 Ошибка — Маршрут не найден */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
