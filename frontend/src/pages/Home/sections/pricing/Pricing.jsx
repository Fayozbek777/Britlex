import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

import priceImage1 from "../../../../assets/images/precing-image1.png";
import priceImage2 from "../../../../assets/images/precing-image2.png";
import priceImage3 from "../../../../assets/images/precing-image3.png";
import Button from "../../../../components/ui/button/Button";
import Modal from "../../../../components/ui/modal/Modal";

const Pricing = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const cardVariants = {
    hover: {
      y: -12,
      boxShadow: "0 25px 50px rgba(38, 50, 56, 0.25)",
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  return (
    <section
      id="pricing"
      className="w-full bg-bg-main py-24 transition-colors duration-300 overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-dark font-poppins">
            {t("pricing.title")}
          </h2>
          <div className="h-[3px] w-16 bg-[#8F95A5] mt-4 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            data-aos="fade-up"
            data-aos-delay="100"
            className="flex flex-col justify-between rounded-3xl bg-[#263238] dark:bg-[#1c2327] border border-transparent dark:border-white/5 p-8 transition-colors duration-300 shadow-[0_10px_40px_rgba(38, 50, 56, 0.1)]"
          >
            <div className="flex flex-col space-y-6">
              <div className="w-full h-44 flex items-center justify-center p-2 bg-white/5 rounded-2xl">
                <img
                  src={priceImage1}
                  alt="Self-study"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-white font-poppins">
                {t("pricing.course1.title")}
              </h3>
              <p className="text-white/80 dark:text-muted text-[15px] leading-relaxed">
                {t("pricing.course1.desc")}
              </p>
            </div>

            <div className="pt-8 mt-auto flex flex-col space-y-4">
              <div className="text-2xl font-bold text-white">
                £5.99{" "}
                <span className="text-sm font-normal text-white/60 dark:text-muted">
                  / {t("pricing.period")}
                </span>
              </div>
              <Button
                setIsOpen={setIsModalOpen}
                className="w-full py-3 text-sm font-semibold bg-white text-[#263238] dark:bg-white dark:text-[#12181b]"
              >
                {t("pricing.cta")}
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-col justify-between rounded-3xl bg-[#263238] dark:bg-[#20292e] p-8 relative shadow-[0_12px_45px_rgba(38, 50, 56, 0.15)] border-2 border-[#8F95A5]/30 dark:border-white/10"
          >
            {/* Популярный бейдж */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8F95A5] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
              Popular
            </div>

            <div className="flex flex-col space-y-6">
              <div className="w-full h-44 flex items-center justify-center p-2 bg-white/5 rounded-2xl">
                <img
                  src={priceImage2}
                  alt="Live classes"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-white font-poppins">
                {t("pricing.course2.title")}
              </h3>
              <p className="text-white/80 dark:text-muted text-[15px] leading-relaxed">
                {t("pricing.course2.desc")}
              </p>
            </div>

            <div className="pt-8 mt-auto flex flex-col space-y-4">
              <div className="text-2xl font-bold text-white">
                £12.99{" "}
                <span className="text-sm font-normal text-white/60 dark:text-muted">
                  / {t("pricing.period")}
                </span>
              </div>
              <Button
                setIsOpen={setIsModalOpen}
                className="w-full py-3 text-sm font-semibold bg-white text-[#263238] dark:bg-white dark:text-[#12181b]"
              >
                {t("pricing.cta")}
              </Button>
            </div>
          </motion.div>

          {/* Тариф 3: Personal Tuition */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-col justify-between rounded-3xl bg-[#263238] dark:bg-[#1c2327] border border-transparent dark:border-white/5 p-8 transition-colors duration-300 shadow-[0_10px_40px_rgba(38, 50, 56, 0.1)]"
          >
            <div className="flex flex-col space-y-6">
              <div className="w-full h-44 flex items-center justify-center p-2 bg-white/5 rounded-2xl">
                <img
                  src={priceImage3}
                  alt="Personal Tuition"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-white font-poppins">
                {t("pricing.course3.title")}
              </h3>
              <p className="text-white/80 dark:text-muted text-[15px] leading-relaxed">
                {t("pricing.course3.desc")}
              </p>
            </div>

            <div className="pt-8 mt-auto flex flex-col space-y-4">
              <div className="text-2xl font-bold text-white">
                £20.99{" "}
                <span className="text-sm font-normal text-white/60 dark:text-muted">
                  / {t("pricing.period")}
                </span>
              </div>
              <Button
                setIsOpen={setIsModalOpen}
                className="w-full py-3 text-sm font-semibold bg-white text-[#263238] dark:bg-white dark:text-[#12181b]"
              >
                {t("pricing.cta")}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default Pricing;
