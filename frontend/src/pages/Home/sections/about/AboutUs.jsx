import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import CountUpComponent from "react-countup";
import { useInView } from "react-intersection-observer";
import AOS from "aos";
import "aos/dist/aos.css";

import aboutImage from "../../../../assets/images/about-us-image.png";

const CountUp = CountUpComponent.default || CountUpComponent;

const AboutUs = () => {
  const { t } = useTranslation();

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const { ref: statsRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const statCardVariants = {
    hover: {
      y: -6,
      boxShadow: "0 20px 40px rgba(38, 50, 56, 0.15)",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  return (
    <section
      id="about"
      className="w-full bg-bg-main py-24 transition-colors duration-300 overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div
          className="flex flex-col space-y-8 max-w-[620px]"
          data-aos="fade-right"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-dark font-poppins">
              {t("about.title")}
            </h2>
            <div className="h-[3px] w-16 bg-[#8F95A5] mt-4 rounded-full" />
          </div>

          <p className="text-muted text-[16px] md:text-[18px] leading-relaxed font-normal">
            {t("about.desc")}
          </p>

          <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-4">
            <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="flex flex-col justify-center rounded-2xl bg-[#263238] dark:bg-[#1c2327] border border-transparent dark:border-white/5 p-5 transition-colors duration-300 shadow-[0_4px_25px_rgba(38,50,56,0.08)]"
            >
              <div className="text-2xl sm:text-4xl font-bold text-white font-poppins leading-none mb-2">
                {inView ? <CountUp start={0} end={800} duration={2.5} /> : "0"}+
              </div>
              <div className="text-xs sm:text-sm font-medium text-white/70 dark:text-muted">
                {t("about.pupils")}
              </div>
            </motion.div>
            <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="flex flex-col justify-center rounded-2xl bg-[#263238] dark:bg-[#1c2327] border border-transparent dark:border-white/5 p-5 transition-colors duration-300 shadow-[0_4px_25px_rgba(38,50,56,0.08)]"
            >
              <div className="text-2xl sm:text-4xl font-bold text-white font-poppins leading-none mb-2">
                {inView ? <CountUp start={0} end={18} duration={2} /> : "0"}
              </div>
              <div className="text-xs sm:text-sm font-medium text-white/70 dark:text-muted">
                {t("about.teachers")}
              </div>
            </motion.div>
            <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="flex flex-col justify-center rounded-2xl bg-[#263238] dark:bg-[#1c2327] border border-transparent dark:border-white/5 p-5 transition-colors duration-300 shadow-[0_4px_25px_rgba(38,50,56,0.08)]"
            >
              <div className="text-2xl sm:text-4xl font-bold text-white font-poppins leading-none mb-2">
                {inView ? <CountUp start={0} end={6} duration={1.5} /> : "0"}
              </div>
              <div className="text-xs sm:text-sm font-medium text-white/70 dark:text-muted">
                {t("about.languages")}
              </div>
            </motion.div>
          </div>
        </div>
        <div
          className="flex justify-center lg:justify-end w-full relative group"
          data-aos="fade-left"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-radial from-muted/5 via-transparent to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl" />

          <img
            src={aboutImage}
            alt="About Us"
            className="w-full max-w-[540px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:drop-shadow-[0_10px_50px_rgba(255,255,255,0.01)] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
