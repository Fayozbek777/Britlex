import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FiUser,
  FiPhone,
  FiLock,
  FiCreditCard,
  FiSave,
  FiCamera,
  FiTrash2,
  FiPlus,
  FiX,
  FiShield,
  FiKey,
} from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const Settings = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  // Profile state
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [savedCards, setSavedCards] = useState([]);

  const token = localStorage.getItem("token");

  // Load cards from backend
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get("/api/cards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedCards(response.data.cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  // Format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    }
    return value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const getCardBrand = (number) => {
    const clean = number.replace(/\s/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (clean.startsWith("5")) return "MasterCard";
    if (clean.startsWith("3")) return "American Express";
    return "Card";
  };

  // Update profile on backend
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        "/api/profile",
        { username, email, phone, avatar },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update user in context and localStorage
      login(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Change password on backend
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error changing password");
    } finally {
      setLoading(false);
    }
  };

  // Save card to backend
  const handleSaveCard = async () => {
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      toast.error("Please enter valid card number");
      return;
    }
    if (!cardName) {
      toast.error("Please enter cardholder name");
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      toast.error("Please enter valid expiry date");
      return;
    }

    setLoading(true);
    try {
      const newCard = {
        card_number: cardNumber,
        card_name: cardName,
        card_expiry: cardExpiry,
        card_brand: getCardBrand(cardNumber),
        last4: cardNumber.slice(-4),
      };

      const response = await axios.post("/api/cards", newCard, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedCards([...savedCards, response.data.card]);
      setCardNumber("");
      setCardName("");
      setCardExpiry("");
      setCardCvv("");

      toast.success("Card saved successfully!");
    } catch (error) {
      toast.error("Error saving card");
    } finally {
      setLoading(false);
    }
  };

  // Delete card from backend
  const handleDeleteCard = async (id) => {
    try {
      await axios.delete(`/api/cards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedCards(savedCards.filter((card) => card.id !== id));
      toast.success("Card removed");
    } catch (error) {
      toast.error("Error deleting card");
    }
  };

  const sections = [
    { id: "profile", icon: FiUser, label: "Profile" },
    { id: "security", icon: FiShield, label: "Security" },
    { id: "payments", icon: FiCreditCard, label: "Payment Methods" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  activeSection === section.id
                    ? "bg-[#263238] dark:bg-white text-white dark:text-[#263238]"
                    : "hover:bg-[var(--color-input-bg)]"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold">Profile Information</h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{ backgroundColor: "var(--color-input-bg)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{ backgroundColor: "var(--color-input-bg)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                    size={16}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 XX XXX XX XX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  />
                </div>
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--color-dark)",
                  color: "var(--color-bg-main)",
                }}
              >
                <FiSave size={18} />
                Save Changes
              </button>
            </motion.div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiKey size={20} />
                Change Password
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{ backgroundColor: "var(--color-input-bg)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{ backgroundColor: "var(--color-input-bg)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{ backgroundColor: "var(--color-input-bg)" }}
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full py-2.5 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: "var(--color-dark)",
                  color: "var(--color-bg-main)",
                }}
              >
                Change Password
              </button>
            </motion.div>
          )}

          {/* Payments Section */}
          {activeSection === "payments" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold">Payment Methods</h2>

              {/* Saved Cards */}
              {savedCards.length > 0 && (
                <div className="space-y-3">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                    >
                      <div className="flex items-center gap-3">
                        <FiCreditCard size={24} />
                        <div>
                          <p className="font-medium">{card.card_brand}</p>
                          <p className="text-sm opacity-60">
                            •••• {card.last4}
                          </p>
                          <p className="text-xs opacity-40">
                            Expires {card.card_expiry}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-all"
                      >
                        <FiTrash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Card */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="JOHN DOE"
                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) =>
                        setCardExpiry(formatExpiry(e.target.value))
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) =>
                        setCardCvv(
                          e.target.value.replace(/[^0-9]/g, "").slice(0, 4),
                        )
                      }
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                      style={{ backgroundColor: "var(--color-input-bg)" }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveCard}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "var(--color-dark)",
                    color: "var(--color-bg-main)",
                  }}
                >
                  <FiSave size={18} />
                  Save Card
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
