import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import darkLogo from "../../../assets/icons/whiteLogo.png";
import whiteLogo from "../../../assets/icons/darkLogo.png";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-[#12181b] transition-colors duration-300 relative z-20">
      <div className="w-full h-[1px] bg-[#263238]/10 dark:bg-white/5" />

      <div className="max-w-[1240px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="h-8 flex items-center justify-center">
            <img
              src={whiteLogo}
              alt="Logo"
              className="h-full w-auto object-contain hidden dark:block"
            />
            <img
              src={darkLogo}
              alt="Logo"
              className="h-full w-auto object-contain block dark:hidden"
            />
          </div>

          <span className="text-xs font-mono text-[#263238]/40 dark:text-white/30 tracking-wider">
            © {currentYear} Ecosystem. All rights reserved
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#263238]/60 dark:text-white/50">
          <Link
            to="/terms"
            className="hover:text-[#263238] dark:hover:text-white transition-colors duration-200"
          >
            Terms and Conditions
          </Link>

          <span className="text-[#263238]/20 dark:text-white/10 select-none hidden sm:inline">
            •
          </span>

          <Link
            to="/privacy"
            className="hover:text-[#263238] dark:hover:text-white transition-colors duration-200"
          >
            Privacy Policy
          </Link>

          <span className="text-[#263238]/20 dark:text-white/10 select-none hidden sm:inline">
            •
          </span>

          <Link
            to="/cookie"
            className="hover:text-[#263238] dark:hover:text-white transition-colors duration-200"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
