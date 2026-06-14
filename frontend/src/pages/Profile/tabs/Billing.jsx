import React from "react";
import { useTranslation } from "react-i18next";
import { FiCheckCircle, FiClock, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";

const Billing = () => {
  const { t } = useTranslation();

  const payments = [
    {
      id: 1,
      month: "Yanvar 2026",
      amount: "780 000 so'm",
      status: "paid",
      date: "15.01.2026",
    },
    {
      id: 2,
      month: "Fevral 2026",
      amount: "780 000 so'm",
      status: "paid",
      date: "14.02.2026",
    },
    {
      id: 3,
      month: "Mart 2026",
      amount: "780 000 so'm",
      status: "pending",
      date: "15.03.2026",
    },
    {
      id: 4,
      month: "Aprel 2026",
      amount: "780 000 so'm",
      status: "upcoming",
      date: "15.04.2026",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold" style={{ color: "var(--color-dark)" }}>
        {t("billing.title", "To'lovlar")}
      </h2>

      <div className="space-y-3">
        {payments.map((payment, idx) => (
          <motion.div
            key={payment.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ backgroundColor: "var(--color-input-bg)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                {payment.status === "paid" ? (
                  <FiCheckCircle className="text-green-500" size={20} />
                ) : payment.status === "pending" ? (
                  <FiClock className="text-yellow-500" size={20} />
                ) : (
                  <FiCalendar className="text-blue-500" size={20} />
                )}
              </div>
              <div>
                <p className="font-semibold">{payment.month}</p>
                <p className="text-xs opacity-60">{payment.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">{payment.amount}</p>
              <p className="text-xs opacity-60">
                {payment.status === "paid" && t("billing.paid", "To'langan")}
                {payment.status === "pending" &&
                  t("billing.pending", "Kutilmoqda")}
                {payment.status === "upcoming" &&
                  t("billing.upcoming", "Kelgusi")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className="pt-4 border-t"
        style={{ borderColor: "var(--color-muted)" }}
      >
        <div className="flex justify-between items-center">
          <span className="opacity-60">{t("billing.total", "Jami")}</span>
          <span className="text-xl font-bold">2 340 000 so'm</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Billing;
