import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { sendTelegramMessage } from "../../../api/telegram";

const Modal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    if (!input.startsWith("+998 ")) {
      if (input.length < 5) {
        setPhone("+998 ");
        return;
      }
      input = "+998 " + input.replace(/^\+998\s?/, "");
    }
    const digits = input.slice(5).replace(/\D/g, "");
    const zipped = digits.substring(0, 9);

    let formatted = "+998 ";
    if (zipped.length > 0) formatted += zipped.substring(0, 2);
    if (zipped.length > 2) formatted += " " + zipped.substring(2, 5);
    if (zipped.length > 5) formatted += " " + zipped.substring(5, 7);
    if (zipped.length > 7) formatted += " " + zipped.substring(7, 9);

    setPhone(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phone.length < 17) {
      alert(t("modal.phoneError"));
      return;
    }

    setLoading(true);

    try {
      const response = await sendTelegramMessage(name, phone);

      if (response.status === 200) {
        setName("");
        setPhone("+998 ");
        onClose();
        alert(t("modal.successMessage"));
      }
    } catch (error) {
      console.error("Ошибка при отправке через Python бэкенд:", error);
      const errorMsg = error.response?.data?.error || error.message;
      alert(`${t("modal.errorMessage")} (${errorMsg})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md bg-bg-main text-dark p-8 rounded-[2rem] shadow-2xl border border-muted/10 z-10 transition-colors duration-300"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-muted hover:text-dark hover:bg-input-bg transition-all cursor-pointer"
          >
            <X size={20} />
          </button>

          <h3 className="text-2xl font-bold mb-6 pr-8 text-dark">
            {t("modal.profileTitle")}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col p-4 bg-input-bg rounded-2xl transition-colors duration-300">
              <label className="text-xs text-muted mb-1 font-medium">
                {t("modal.nameLabel")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("modal.namePlaceholder")}
                className="w-full bg-transparent text-lg font-semibold text-dark outline-none placeholder:text-muted/60"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col p-4 bg-input-bg rounded-2xl transition-colors duration-300">
              <label className="text-xs text-muted mb-1 font-medium">
                {t("modal.phoneLabel")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 90 123 45 67"
                className="w-full bg-transparent text-lg font-semibold text-dark outline-none"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-4 bg-[#263238] dark:bg-white text-white dark:text-[#12181b] font-bold rounded-2xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                t("modal.closeBtn")
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
