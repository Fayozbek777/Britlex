import axios from "axios";

export const sendTelegramMessage = async (name, phone) => {
  return await axios.post("/api/telegram", { name, phone });
};
