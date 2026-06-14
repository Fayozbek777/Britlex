import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Award,
  Download,
  Calendar,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const Certificates = () => {
  const { t } = useTranslation();

  const certificates = [
    {
      id: 1,
      name: "English for Beginners",
      level: "A1 - Beginner",
      date: "15.01.2025",
      grade: "98%",
      status: "issued",
      image: "🎓",
    },
    {
      id: 2,
      name: "Intermediate English",
      level: "B1 - Intermediate",
      date: "20.02.2025",
      grade: "95%",
      status: "issued",
      image: "📜",
    },
    {
      id: 3,
      name: "Business English",
      level: "B2 - Upper Intermediate",
      date: "10.03.2025",
      grade: "92%",
      status: "pending",
      image: "⭐",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--color-dark)" }}
        >
          {t("certificates.title", "My Certificates")}
        </h2>
        <div
          className="px-3 py-1.5 rounded-full text-sm"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          {certificates.filter((c) => c.status === "issued").length} /{" "}
          {certificates.length} {t("certificates.issued", "issued")}
        </div>
      </div>

      {/* Certificates List */}
      <div className="grid gap-4">
        {certificates.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="p-5 rounded-2xl transition-all"
            style={{
              backgroundColor: "var(--color-input-bg)",
              borderLeft:
                cert.status === "issued"
                  ? "4px solid #10b981"
                  : "4px solid #f59e0b",
            }}
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: "var(--color-bg-main)" }}
                >
                  {cert.image}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{cert.name}</h3>
                  <p className="text-sm opacity-60">{cert.level}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="opacity-60" />
                      <span className="text-xs opacity-60">{cert.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={12} className="opacity-60" />
                      <span className="text-xs opacity-60">{cert.grade}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cert.status === "issued" ? (
                  <>
                    <button
                      className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:scale-105"
                      style={{ backgroundColor: "#10b981", color: "white" }}
                    >
                      <Download size={16} />
                      {t("certificates.download", "Download")}
                    </button>
                    <button
                      className="p-2 rounded-xl transition-all hover:scale-105"
                      style={{ backgroundColor: "var(--color-bg-main)" }}
                    >
                      <ExternalLink size={18} className="opacity-60" />
                    </button>
                  </>
                ) : (
                  <div
                    className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                    style={{ backgroundColor: "#f59e0b20", color: "#f59e0b" }}
                  >
                    <CheckCircle size={16} />
                    {t("certificates.pending", "Pending")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {certificates.length === 0 && (
        <div className="text-center py-12">
          <Award size={48} className="mx-auto mb-4 opacity-30" />
          <p className="opacity-60">
            {t("certificates.noCertificates", "No certificates yet")}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Certificates;
