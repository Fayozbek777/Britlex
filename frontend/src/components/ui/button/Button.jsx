import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  setIsOpen,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const handleClick = (e) => {
    if (setIsOpen) setIsOpen(true);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: 1.02, backgroundColor: "#263238", color: "#ffffff" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`px-8 py-3.5 bg-[#8F95A5] text-white dark:bg-white dark:text-[#12181b] text-[18px] font-medium rounded-xl shadow-[0_4px_20px_rgba(143,149,165,0.2)] dark:shadow-none transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
