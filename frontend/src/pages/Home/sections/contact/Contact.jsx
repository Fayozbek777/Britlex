import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PhoneInputModule from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AOS from "aos";
import "aos/dist/aos.css";
import toast, { Toaster } from "react-hot-toast";

import contactImage from "../../../../assets/images/contact-image.png";
import Button from "../../../../components/ui/button/Button";

const PhoneInput = PhoneInputModule.default || PhoneInputModule;

const Contact = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || phone.length < 12) {
      toast.error(
        t("contact.error") || "Пожалуйста, введите корректный номер телефона",
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: isDark ? "#20292e" : "#ffffff",
            color: isDark ? "#ffffff" : "#263238",
            borderRadius: "12px",
            border: isDark
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.05)",
            fontFamily: "Poppins, sans-serif",
            fontSize: "15px",
          },
        },
      );
      return;
    }

    toast.success(
      t("contact.success") || "Успешно отправлено! Перенаправление...",
      {
        duration: 2000,
        position: "top-center",
        style: {
          background: isDark ? "#20292e" : "#ffffff",
          color: isDark ? "#ffffff" : "#263238",
          borderRadius: "12px",
          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.05)",
          fontFamily: "Poppins, sans-serif",
          fontSize: "15px",
        },
      },
    );

    console.log("Данные отправлены:", { name, phone });

    setTimeout(() => {
      navigate("/login");
    }, 1800);
  };

  return (
    <section
      id="contact"
      className="w-full bg-bg-main py-24 transition-colors duration-300 overflow-hidden"
    >
      <Toaster />

      <div className="mx-auto max-w-[1440px] px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div
          className="flex justify-center lg:justify-start w-full relative group"
          data-aos="fade-right"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-radial from-muted/5 via-transparent to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl" />
          <img
            src={contactImage}
            alt="Contact Us"
            className="w-full max-w-[500px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:drop-shadow-[0_10px_50px_rgba(255,255,255,0.01)] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />
        </div>

        <div
          className="flex flex-col space-y-8 max-w-[580px] w-full mx-auto lg:mx-0"
          data-aos="fade-left"
        >
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight font-poppins transition-colors duration-300"
              style={{ color: isDark ? "#ffffff" : "#263238" }}
            >
              {t("contact.title")}
            </h2>
            <div className="h-[3px] w-16 bg-[#8F95A5] mt-4 rounded-full" />
          </div>

          <p
            className="text-[16px] md:text-[18px] leading-relaxed font-normal transition-colors duration-300"
            style={{ color: isDark ? "rgba(255, 255, 255, 0.7)" : "#263238" }}
          >
            {t("contact.desc")}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 w-full"
          >
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact.name_placeholder")}
              className="w-full px-5 py-4 rounded-xl border border-muted/20 dark:border-white/10 bg-white dark:bg-[#1c2327] !text-[#263238] dark:!text-white placeholder-muted/60 focus:outline-none focus:border-[#8F95A5] dark:focus:border-white transition-all text-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
            />

            <div className="phone-input-wrapper w-full relative">
              <PhoneInput
                country={"uz"}
                onlyCountries={["uz"]}
                countryCodeEditable={false}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                placeholder="(90) 123-45-67"
                buttonStyle={{ display: "none" }}
                inputClass="!w-full !h-auto !px-5 !py-4 !pl-5 !rounded-xl !border !border-muted/20 dark:!border-white/10 !bg-white dark:!bg-[#1c2327] !text-[#263238] dark:!text-white !text-[16px] !focus:outline-none !focus:border-[#8F95A5] !transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 mt-2 text-sm font-semibold tracking-wide uppercase bg-[#263238] text-white dark:bg-white dark:text-[#12181b] border border-transparent"
            >
              {t("contact.cta")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
