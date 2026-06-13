import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const termsList = [
    {
      title: "1. Принятие условий",
      desc: "Используя наш сайт, вы автоматически соглашаетесь с настоящими Условиями использования. Если вы не согласны с каким-либо пунктом, мы просим вас прекратить использование платформы.",
    },
    {
      title: "2. Интеллектуальная собственность",
      desc: "Весь контент, код, анимации, дизайн, интерактивные элементы и логотипы, представленные на сайте, являются нашей интеллектуальной собственностью и защищены законами об авторском праве. Копирование кода или ассетов запрещено.",
    },
    {
      title: "3. Ограничение ответственности",
      desc: "Мы делаем всё возможное, чтобы платформа работала без сбоев. Однако мы не несём ответственности за временные технические неполадки, потерю данных или ущерб, возникший в результате использования или невозможности использования нашего ресурса.",
    },
  ];

  return (
    <section className="min-h-screen w-full bg-white dark:bg-[#12181b] text-[#263238] dark:text-white px-6 py-20 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-[800px] mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#263238]/60 dark:text-white/40 hover:text-[#263238] dark:hover:text-white transition-colors mb-12"
        >
          <span>←</span> <span> Назад </span>
        </button>

        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#263238]/10 dark:border-white/10 bg-[#263238]/5 dark:bg-white/5 w-fit">
            <span className="font-mono text-[10px] tracking-wider uppercase opacity-60">
              Legal / Terms & Conditions
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight font-poppins leading-none">
            Условия использования
          </h1>
          <p className="text-sm font-mono text-[#263238]/50 dark:text-white/30">
            Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
          </p>
        </div>

        <div className="space-y-6">
          {termsList.map((item, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 rounded-2xl border border-[#263238]/10 dark:border-white/5 bg-[#263238]/5 dark:bg-[#1c2327]/40 backdrop-blur-sm"
            >
              <h2 className="text-lg font-bold font-poppins mb-3">
                {item.title}
              </h2>
              <p className="text-sm md:text-[15px] leading-relaxed text-[#263238]/70 dark:text-white/60">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Terms;
