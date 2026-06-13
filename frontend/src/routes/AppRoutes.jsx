import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Login from "../pages/Auth/Login";
import Forbidden from "../pages/Forbidden/Forbidden";
import Cookie from "../pages/Legal/Cookie";
import Privacy from "../pages/Legal/Privacy";
import Terms from "../pages/Legal/Terms";

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-bg-main text-dark transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fr" element={<Forbidden />} />
        <Route path="/cookie" element={<Cookie />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
