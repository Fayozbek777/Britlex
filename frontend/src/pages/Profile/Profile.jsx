import React from "react";
import { useParams, NavLink, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { userId, username } = useParams();
  const { user } = useAuth();

  const displayId = userId || user?.userId;
  const displayUsername = username || user?.username;

  const tabClass = ({ isActive }) =>
    `px-4 py-2 font-medium border-b-2 transition-colors ${
      isActive
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Привет, {displayUsername}!
        </h1>
        <p className="text-sm text-gray-500">ID профиля: {displayId}</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          <NavLink to="courses" className={tabClass}>
            📦 Мои курсы
          </NavLink>
          <NavLink to="settings" className={tabClass}>
            ⚙️ Настройки
          </NavLink>
          <NavLink to="billing" className={tabClass}>
            💳 Оплата
          </NavLink>
        </nav>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
