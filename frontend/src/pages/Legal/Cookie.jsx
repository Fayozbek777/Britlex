import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Cookie = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sections = [
    {
      title: "1. Что такое файлы cookie?",
      desc: "Файлы cookie — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении нашего сайта. Они помогают нам обеспечивать стабильную работу платформы, запоминать ваши предпочтения и анализировать трафик.",
    },
    {
      title: "2. Как мы используем cookie?",
      desc: "Мы используем обязательные cookie (для авторизации и сохранения настроек темы), аналитические (для отслеживания производительности страниц) и функциональные (для работы кастомных анимаций и интерактивных компонентов).",
    },
    {
      title: "3. Управление файлами cookie",
      desc: "Вы можете в любой момент отключить или настроить параметры cookie в настройках вашего браузера. Однако учтите, что отключение некоторых файлов может привести к некорректной работе отдельных элементов интерфейса или сбросу темной темы.",
    },
  ];

  return (
    <section className="min-h-screen w-full bg-white dark:bg-[#12181b] text-[#263238] dark:text-white px-6 py-20 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-[800px] mx-auto relative z-10">
        {/* Кнопка Назад */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#263238]/60 dark:text-white/40 hover:text-[#263238] dark:hover:text-white transition-colors mb-12"
        >
          <span>←</span> <span> Назад</span>
        </button>

        {/* Заголовок */}
        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#263238]/10 dark:border-white/10 bg-[#263238]/5 dark:bg-white/5 w-fit">
            <span className="font-mono text-[10px] tracking-wider uppercase opacity-60">
              Legal / Cookie Policy
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight font-poppins leading-none">
            Положение о куки-файлах
          </h1>
          <p className="text-sm font-mono text-[#263238]/50 dark:text-white/30">
            Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
          </p>
        </div>

        {/* Контент */}
        <div className="space-y-6">
          {sections.map((item, idx) => (
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

export default Cookie;
