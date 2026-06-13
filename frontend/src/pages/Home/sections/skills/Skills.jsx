import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import gsap from "gsap";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowUpRight } from "lucide-react";

import skillImage1 from "../../../../assets/images/skills-image1.png";
import skillImage2 from "../../../../assets/images/skills-image2.png";
import skillImage3 from "../../../../assets/images/skills-image3.png";
import skillImage4 from "../../../../assets/images/skills-image4.png";
import Button from "../../../../components/ui/button/Button";

const Skills = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });

    const ctx = gsap.context(() => {
      gsap.from(".animate-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      y: -10,
      scale: 1.01,
      borderColor: "rgba(143, 149, 165, 0.4)",
      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.06)",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  const arrowVariants = {
    initial: { x: 0, y: 0 },
    hover: { x: 3, y: -3, transition: { type: "spring", stiffness: 400 } },
  };

  return (
    <section
      id="skills"
      ref={containerRef}
      className="w-full bg-bg-main py-24 transition-colors duration-300 overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-16 text-center lg:text-left" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-dark font-poppins">
            {t("skills.title")}
          </h2>
          <div className="h-[3px] w-16 bg-[#8F95A5] mt-4 mx-auto lg:mx-0 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[auto]">
          <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className="animate-card lg:row-span-2 flex flex-col justify-between rounded-3xl border border-muted/10 dark:border-white/5 bg-white dark:bg-[#1c2327] p-8 transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.01)] group"
          >
            <div className="flex flex-col gap-6">
              <div className="w-full rounded-2xl overflow-hidden bg-muted/5 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-[1.03]">
                <img
                  src={skillImage1}
                  alt="Speaking"
                  className="h-48 md:h-64 w-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-dark">
                {t("skills.speaking.title")}
              </h3>
              <p className="text-muted text-[16px] leading-relaxed">
                {t("skills.speaking.desc")}
              </p>
            </div>
            <div className="pt-8 flex items-center justify-between mt-auto">
              <Button className="py-2.5 px-6 text-sm">
                {t("skills.more")}
              </Button>
              <motion.div variants={arrowVariants}>
                <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-dark transition-colors cursor-pointer" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className="animate-card flex flex-col justify-between rounded-3xl border border-muted/10 dark:border-white/5 bg-white dark:bg-[#1c2327] p-8 transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.01)] group"
          >
            <div className="flex flex-col gap-5">
              <div className="w-full h-36 rounded-2xl overflow-hidden bg-muted/5 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-[1.03]">
                <img
                  src={skillImage2}
                  alt="Writing"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-dark">
                {t("skills.writing.title")}
              </h3>
              <p className="text-muted text-[15px] leading-relaxed line-clamp-4">
                {t("skills.writing.desc")}
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between mt-auto">
              <Button className="py-2.5 px-6 text-sm">
                {t("skills.more")}
              </Button>
              <motion.div variants={arrowVariants}>
                <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-dark transition-colors" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className="animate-card flex flex-col justify-between rounded-3xl border border-muted/10 dark:border-white/5 bg-white dark:bg-[#1c2327] p-8 transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.01)] group"
          >
            <div className="flex flex-col gap-5">
              <div className="w-full h-36 rounded-2xl overflow-hidden bg-muted/5 flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-[1.03]">
                <img
                  src={skillImage3}
                  alt="Reading"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-dark">
                {t("skills.reading.title")}
              </h3>
              <p className="text-muted text-[15px] leading-relaxed line-clamp-4">
                {t("skills.reading.desc")}
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between mt-auto">
              <Button className="py-2.5 px-6 text-sm">
                {t("skills.more")}
              </Button>
              <motion.div variants={arrowVariants}>
                <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-dark transition-colors" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            className="animate-card md:col-span-2 flex flex-col sm:flex-row gap-6 items-center justify-between rounded-3xl border border-muted/10 dark:border-white/5 bg-white dark:bg-[#1c2327] p-8 transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.01)] group"
          >
            <div className="w-full sm:w-1/3 rounded-2xl overflow-hidden bg-muted/5 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-[1.03]">
              <img
                src={skillImage4}
                alt="Listening"
                className="h-32 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col justify-between flex-1 h-full min-h-[150px]">
              <div>
                <h3 className="text-2xl font-bold text-dark mb-2">
                  {t("skills.listening.title")}
                </h3>
                <p className="text-muted text-[15px] leading-relaxed">
                  {t("skills.listening.desc")}
                </p>
              </div>
              <div className="pt-5 flex items-center justify-between mt-auto">
                <Button className="py-2.5 px-6 text-sm">
                  {t("skills.more")}
                </Button>
                <motion.div variants={arrowVariants}>
                  <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-dark transition-colors" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
