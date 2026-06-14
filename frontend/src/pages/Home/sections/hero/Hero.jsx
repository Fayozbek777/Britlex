import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import heroImage from "../../../../assets/images/hero-image.png";
import useAuth from "../../../../hooks/useAuth";
import Button from "../../../../components/ui/button/Button";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { user } = useAuth();

  const isAuth = !!user?.userId;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-hero-text", {
        x: -40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.from(".animate-hero-img", {
        x: 40,
        scale: 0.95,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.4,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleButtonClick = () => {
    if (isAuth) {
      navigate(`/profile/userfeed/${user.userId}/${user.username}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center bg-bg-main overflow-hidden transition-colors duration-300"
    >
      <div className="mx-auto max-w-[1440px] w-full px-6 md:px-12 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start space-y-6 max-w-[620px] z-10">
          <h1 className="animate-hero-text text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-dark leading-[1.15]">
            {t("hero.title")}
          </h1>
          <p className="animate-hero-text text-[18px] md:text-[20px] font-normal leading-relaxed text-muted">
            {t("hero.subtitle")}
          </p>
          <div className="animate-hero-text pt-4">
            <Button
              className="px-8 py-4 text-[20px] bg-[#263238] rounded-xl"
              onClick={handleButtonClick}
            >
              {t("hero.cta")}
            </Button>
          </div>
        </div>

        <div className="animate-hero-img flex justify-center lg:justify-end w-full relative group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-radial from-muted/10 via-transparent to-transparent opacity-0 dark:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl" />
          <img
            src={heroImage}
            alt="Learning"
            className="w-full max-w-[580px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:drop-shadow-[0_10px_50px_rgba(255,255,255,0.02)] transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
