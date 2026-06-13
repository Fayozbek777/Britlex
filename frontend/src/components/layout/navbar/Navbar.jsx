import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Sun, Moon, Globe, ChevronDown, Check } from "lucide-react";

import whiteLogo from "../../../assets/icons/darkLogo.png";
import darkLogo from "../../../assets/icons/whiteLogo.png";
import Button from "../../../components/ui/button/Button";
import { useTheme } from "../../../hooks/useTheme";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const navRef = useRef(null);
  const langMenuRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-nav-item", {
        y: -30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "power4.out",
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { name: t("nav.home"), href: "#home" },
    { name: t("nav.skills"), href: "#skills" },
    { name: t("nav.about"), href: "#about" },
    { name: t("nav.pricing"), href: "#pricing" },
    { name: t("nav.contacts"), href: "#contact" },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
    { code: "uz", label: "O'zbekcha" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language.substring(0, 2)) ||
    languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.4,
        stiffness: 350,
        damping: 25,
      },
    },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } },
  };

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: { x: "-100%", transition: { ease: "easeInOut", duration: 0.25 } },
  };
  const handleScroll = (e, href) => {
    e.preventDefault();

    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const lenisInstance = window.lenis;

      if (lenisInstance && typeof lenisInstance.scrollTo === "function") {
        lenisInstance.scrollTo(targetElement, {
          offset: -80,
          duration: 1.2,
        });
      } else {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <header
      ref={navRef}
      className={`
        relative w-full font-poppins select-none transition-all duration-500 border-b 
        lg:fixed lg:top-0 lg:left-0 lg:z-50
        ${
          isScrolled
            ? "lg:bg-bg-main/80 lg:backdrop-blur-xl lg:py-3 lg:shadow-[0_10px_30px_rgba(0,0,0,0.03)] lg:border-muted/20 dark:lg:border-white/10"
            : "bg-bg-main lg:py-5 border-muted/10 dark:border-white/5"
        }
      `}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:py-0 md:px-12">
        <div className="animate-nav-item flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95">
          <img
            src={theme === "dark" ? whiteLogo : darkLogo}
            alt="Logo"
            className="h-7 w-auto object-contain md:h-8"
          />
        </div>

        <ul
          className="animate-nav-item hidden lg:flex w-[772px] h-[40px] items-center justify-between list-none m-0 p-0 relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {links.map((link, index) => (
            <li
              key={index}
              className="relative list-none h-full flex items-center"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              <a
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)} // Плавно опускаем страницу
                className="text-[18px] font-medium tracking-wide text-dark hover:text-muted transition-colors duration-300 px-4 py-2 relative z-10"
              >
                {link.name}
              </a>
              {hoveredIndex === index && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-dark dark:bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="animate-nav-item hidden md:flex items-center gap-3">
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-dark hover:bg-muted/10 transition-all duration-300 cursor-pointer text-sm font-medium border border-muted/10 dark:border-white/10 hover:border-muted/30"
            >
              <Globe className="w-4 h-4 text-muted" />
              <span>{currentLanguage.code.toUpperCase()}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-muted transition-transform duration-300 ${isLangOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2.5 w-44 rounded-2xl bg-white dark:bg-[#1c2327] border border-muted/20 dark:border-white/10 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] z-50 overflow-hidden"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
                        currentLanguage.code === lang.code
                          ? "bg-[#263238] text-white dark:bg-white dark:text-[#12181b] font-semibold"
                          : "text-[#263238] dark:text-white hover:bg-muted/10"
                      }`}
                    >
                      {lang.label}
                      {currentLanguage.code === lang.code && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl border border-muted/10 dark:border-white/10 hover:bg-muted/10 text-dark transition-all duration-300 cursor-pointer overflow-hidden group hover:border-muted/30"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 90, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0, rotate: 90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: -90, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Moon className="w-5 h-5 text-slate-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>

          <div className="ml-1.5 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]">
            <Button>{t("auth.signin")}</Button>
          </div>
        </div>

        {/* Инструменты Мобильные (Остались relative без фиксирования) */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl text-dark active:bg-muted/10 transition-colors cursor-pointer overflow-hidden"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="mobile-sun"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-5 h-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mobile-moon"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-slate-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-muted/20 p-2 bg-bg-main cursor-pointer"
          >
            <span
              className={`h-[2px] w-5 bg-dark transition-all duration-300 ${isOpen ? "translate-y-[8px] rotate-45" : ""}`}
            />
            <span
              className={`h-[2px] w-5 bg-dark transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[2px] w-5 bg-dark transition-all duration-300 ${isOpen ? "-translate-y-[8px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Мобильный Сайдбар */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />

            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 z-40 w-[80%] max-w-[300px] bg-bg-main p-8 pt-24 shadow-2xl md:hidden flex flex-col justify-between transition-colors duration-300"
            >
              <ul className="flex flex-col gap-6 list-none p-0 m-0">
                {links.map((link, index) => (
                  <motion.li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        setIsOpen(false); // Закрываем мобильное меню
                        handleScroll(e, link.href); // Плавно опускаем страницу
                      }}
                      className="block text-[22px] font-medium text-dark active:opacity-70 transition-opacity"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="pt-6 border-t border-muted/20 flex flex-col gap-5">
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-semibold text-muted tracking-wider uppercase">
                    Language
                  </span>
                  <div className="grid grid-cols-3 gap-2 bg-muted/10 p-1 rounded-xl">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                          currentLanguage.code === lang.code
                            ? "bg-[#263238] text-white dark:bg-white dark:text-[#12181b] shadow-sm font-semibold"
                            : "text-muted hover:text-dark"
                        }`}
                      >
                        {lang.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full py-3.5 rounded-xl shadow-lg shadow-dark/5"
                  onClick={() => setIsOpen(false)}
                >
                  {t("auth.signin")}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
