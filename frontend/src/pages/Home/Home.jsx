import React from "react";
import Navbar from "../../components/layout/navbar/Navbar";
import Hero from "./sections/hero/Hero";
import Skills from "./sections/skills/Skills";
import AboutUs from "./sections/about/AboutUs";
import Pricing from "./sections/pricing/Pricing";
import Contact from "./sections/contact/Contact";
import Footer from "../../components/layout/footer/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Skills />
      <AboutUs />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
