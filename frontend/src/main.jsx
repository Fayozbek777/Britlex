import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/theme/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";
import Lenis from "lenis";
import "./i18n/index.js";
import "./index.css";
import App from "./App.jsx";
import "lenis/dist/lenis.css";

const SmoothScrollProvider = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      smoothHandheld: true,
    });

    // ФИКС: Привязываем чистый инстанс напрямую к глобальному объекту window
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.lenis = null; // Чистим за собой
    };
  }, []);

  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Toaster />
        <SmoothScrollProvider>
          <App />
        </SmoothScrollProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
