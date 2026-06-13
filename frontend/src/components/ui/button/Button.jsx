import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Button = ({ children, className = "" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <motion.button
      onClick={handleLoginRedirect}
      whileHover={{
        scale: 1.02,
        backgroundColor: "#263238",
        color: "#ffffff",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        px-8 py-3.5
        bg-[#8F95A5] text-white 
        dark:bg-white dark:text-[#12181b] 
        text-[18px] font-medium rounded-xl 
        shadow-[0_4px_20px_rgba(143,149,165,0.2)] dark:shadow-none
        transition-colors duration-300 cursor-pointer
        ${className}
      `}
    >
      {children || t("hero.cta")}
    </motion.button>
  );
};

export default Button;
