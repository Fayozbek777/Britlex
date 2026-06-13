import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const privacyPoints = [
    {
      title: "1. Сбор информации",
      desc: "Мы собираем минимальный набор данных, необходимый для работы экосистемы: технические логи, данные об используемом браузере, IP-адресе и файлы настроек конфигурации пользователя.",
    },
    {
      title: "2. Защита ваших данных",
      desc: "Безопасность ваших данных — наш приоритет. Мы применяем современные протоколы шифрования данных, строгие политики контроля доступа и передовые веб-стандарты защиты информации для предотвращения утечек.",
    },
    {
      title: "3. Передача третьим лицам",
      desc: "Мы никогда не продаем, не обмениваем и не передаем ваши личные данные сторонним организациям. Исключением могут быть только официальные запросы государственных органов в строгом соответствии с действующим законодательством.",
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
              Legal / Privacy Policy
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight font-poppins leading-none">
            Политика конфиденциальности
          </h1>
          <p className="text-sm font-mono text-[#263238]/50 dark:text-white/30">
            Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
          </p>
        </div>

        <div className="space-y-6">
          {privacyPoints.map((item, idx) => (
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

export default Privacy;
