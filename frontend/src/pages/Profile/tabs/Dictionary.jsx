import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Volume2,
  X,
  Trash2,
  Loader2,
  Globe,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

// Настройка axios с токеном
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const Dictionary = () => {
  const { t, i18n } = useTranslation();
  const [searchWord, setSearchWord] = useState("");
  const [wordData, setWordData] = useState(null);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [savedWords, setSavedWords] = useState([]);
  const [activeTab, setActiveTab] = useState("search");
  const [loadingSaved, setLoadingSaved] = useState(true);

  const token = localStorage.getItem("token");

  // Проверка токена
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
    }
  }, []);

  // Загрузка сохраненных слов с сервера
  const fetchSavedWords = async () => {
    if (!token) {
      setLoadingSaved(false);
      return;
    }

    try {
      const response = await axios.get("/api/dictionary", getAuthHeaders());
      setSavedWords(response.data.words);
    } catch (error) {
      console.error("Error fetching saved words:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(t("dictionary.loadError", "Error loading saved words"));
      }
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchSavedWords();
  }, []);

  // Функция для перевода слова через API
  const translateWord = async (word, targetLang) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${targetLang}`,
      );
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return word;
    }
  };

  // Получение переводов на 3 языка
  const getTranslations = async (word) => {
    const [ru, uz] = await Promise.all([
      translateWord(word, "ru"),
      translateWord(word, "uz"),
    ]);

    return {
      ru: ru,
      uz: uz,
      en: word,
    };
  };

  // Поиск слова в API
  const searchDictionary = async (e) => {
    e.preventDefault();
    if (!searchWord.trim()) {
      toast.error(t("dictionary.enterWord", "Please enter a word"));
      return;
    }

    setLoading(true);
    setWordData(null);
    setTranslations({});

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord.toLowerCase().trim()}`,
      );

      if (!response.ok) {
        throw new Error("Word not found");
      }

      const data = await response.json();
      setWordData(data[0]);

      const translationsData = await getTranslations(searchWord.trim());
      setTranslations(translationsData);

      toast.success(t("dictionary.wordFound", "Word found!"));
    } catch (error) {
      toast.error(t("dictionary.wordNotFound", "Word not found"));
      setWordData(null);
    } finally {
      setLoading(false);
    }
  };

  // Добавление слова на сервер
  const addToSaved = async () => {
    if (!wordData) return;
    if (!token) {
      toast.error("Please login to save words");
      return;
    }

    const exists = savedWords.some((w) => w.word === wordData.word);
    if (exists) {
      toast.error(t("dictionary.alreadySaved", "Word already saved"));
      return;
    }

    try {
      const newWord = {
        word: wordData.word,
        phonetic: wordData.phonetic || "",
        definition: wordData.meanings[0]?.definitions[0]?.definition || "",
        example: wordData.meanings[0]?.definitions[0]?.example || "",
        audio_url: wordData.phonetics?.find((p) => p.audio)?.audio || "",
        translations: translations,
      };

      console.log("Sending word to server:", newWord);
      console.log("Headers:", getAuthHeaders());

      const response = await axios.post(
        "/api/dictionary",
        newWord,
        getAuthHeaders(),
      );

      console.log("Server response:", response.data);

      setSavedWords([response.data.word, ...savedWords]);
      toast.success(t("dictionary.wordSaved", "Word saved to dictionary"));
    } catch (error) {
      console.error("Error saving word:", error);
      console.error("Error response:", error.response);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(
          error.response?.data?.error ||
            t("dictionary.saveError", "Error saving word"),
        );
      }
    }
  };

  // Удаление слова с сервера
  const removeSavedWord = async (id) => {
    if (!token) return;

    try {
      await axios.delete(`/api/dictionary/${id}`, getAuthHeaders());

      setSavedWords(savedWords.filter((w) => w.id !== id));
      toast.success(t("dictionary.wordRemoved", "Word removed"));
    } catch (error) {
      console.error("Error deleting word:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(t("dictionary.deleteError", "Error deleting word"));
      }
    }
  };

  // Очистка всех слов на сервере
  const clearAllWords = async () => {
    if (!token) return;

    if (
      window.confirm(t("dictionary.confirmClear", "Clear all saved words?"))
    ) {
      try {
        await axios.delete("/api/dictionary/clear", getAuthHeaders());

        setSavedWords([]);
        toast.success(t("dictionary.allCleared", "All words cleared"));
      } catch (error) {
        console.error("Error clearing words:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(t("dictionary.clearError", "Error clearing words"));
        }
      }
    }
  };

  // Озвучка слова
  const speakWord = (word, lang = "en-US") => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playAudio = (audioUrl, word) => {
    if (audioUrl) {
      new Audio(audioUrl).play();
    } else if (word) {
      speakWord(word);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Tabs */}
      <div
        className="flex gap-2 border-b pb-3"
        style={{ borderColor: "var(--color-muted)" }}
      >
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "search"
              ? "bg-blue-600 text-white"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          <Search size={16} />
          {t("dictionary.search", "Search")}
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "saved"
              ? "bg-blue-600 text-white"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          <Bookmark size={16} />
          {t("dictionary.saved", "Saved")} ({savedWords.length})
        </button>
        <button
          onClick={fetchSavedWords}
          className="px-4 py-2 rounded-lg transition-all ml-auto"
          style={{ backgroundColor: "var(--color-input-bg)" }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <form onSubmit={searchDictionary} className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder={t(
                "dictionary.searchPlaceholder",
                "Enter English word...",
              )}
              className="flex-1 px-5 py-3 rounded-xl outline-none transition-all min-w-[200px]"
              style={{
                backgroundColor: "var(--color-input-bg)",
                color: "var(--color-dark)",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-dark)",
                color: "var(--color-bg-main)",
              }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                t("dictionary.search", "Search")
              )}
            </button>
          </form>

          {wordData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 space-y-4"
              style={{ backgroundColor: "var(--color-input-bg)" }}
            >
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-3xl font-bold">{wordData.word}</h2>
                    <button
                      onClick={() =>
                        playAudio(
                          wordData.phonetics?.find((p) => p.audio)?.audio,
                          wordData.word,
                        )
                      }
                      className="p-2 rounded-lg transition-all hover:scale-105"
                      style={{ backgroundColor: "var(--color-bg-main)" }}
                    >
                      <Volume2 size={20} />
                    </button>
                    <button
                      onClick={addToSaved}
                      className="p-2 rounded-lg transition-all hover:scale-105"
                      style={{ backgroundColor: "var(--color-bg-main)" }}
                    >
                      <BookmarkCheck size={20} className="text-green-500" />
                    </button>
                  </div>
                  {wordData.phonetic && (
                    <p className="text-sm opacity-60 mt-1">
                      {wordData.phonetic}
                    </p>
                  )}
                </div>
              </div>

              {translations && Object.keys(translations).length > 0 && (
                <div
                  className="border-t pt-4"
                  style={{ borderColor: "var(--color-muted)" }}
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe size={16} />
                    {t("dictionary.translations", "Translations")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: "var(--color-bg-main)" }}
                    >
                      <p className="text-xs opacity-60">English</p>
                      <p className="font-medium mt-1">{translations.en}</p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: "var(--color-bg-main)" }}
                    >
                      <p className="text-xs opacity-60">Русский</p>
                      <p className="font-medium mt-1">{translations.ru}</p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: "var(--color-bg-main)" }}
                    >
                      <p className="text-xs opacity-60">O'zbekcha</p>
                      <p className="font-medium mt-1">{translations.uz}</p>
                    </div>
                  </div>
                </div>
              )}

              {wordData.meanings?.map((meaning, idx) => (
                <div
                  key={idx}
                  className="border-t pt-4"
                  style={{ borderColor: "var(--color-muted)" }}
                >
                  <p className="text-sm font-semibold mb-2 capitalize">
                    {meaning.partOfSpeech}
                  </p>
                  {meaning.definitions.slice(0, 2).map((def, defIdx) => (
                    <div key={defIdx} className="ml-4 mb-3">
                      <p className="text-sm">• {def.definition}</p>
                      {def.example && (
                        <p className="text-xs italic opacity-60 mt-1">
                          "{def.example}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Saved Words Tab */}
      {activeTab === "saved" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {loadingSaved ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto mb-4" size={40} />
              <p className="opacity-60">
                {t("dictionary.loading", "Loading...")}
              </p>
            </div>
          ) : savedWords.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark size={48} className="mx-auto mb-4 opacity-30" />
              <p className="opacity-60">
                {t("dictionary.noWords", "No saved words yet")}
              </p>
              <p className="text-sm opacity-40 mt-2">
                {t(
                  "dictionary.searchHint",
                  "Search and save words you want to learn",
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  onClick={clearAllWords}
                  className="px-4 py-2 rounded-lg text-sm text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  {t("dictionary.clearAll", "Clear All")}
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {savedWords.map((word, idx) => (
                  <motion.div
                    key={word.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl transition-all hover:scale-[1.01]"
                    style={{ backgroundColor: "var(--color-input-bg)" }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">{word.word}</h3>
                          {word.phonetic && (
                            <span className="text-xs opacity-60">
                              {word.phonetic}
                            </span>
                          )}
                          <button
                            onClick={() => playAudio(word.audio_url, word.word)}
                            className="p-1 rounded transition-all hover:scale-110"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>

                        {word.translations && (
                          <div className="flex gap-3 mt-2 flex-wrap">
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: "var(--color-bg-main)",
                              }}
                            >
                              🇬🇧 {word.translations.en}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: "var(--color-bg-main)",
                              }}
                            >
                              🇷🇺 {word.translations.ru}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: "var(--color-bg-main)",
                              }}
                            >
                              🇺🇿 {word.translations.uz}
                            </span>
                          </div>
                        )}

                        {word.definition && (
                          <p className="text-sm mt-2 opacity-80">
                            {word.definition}
                          </p>
                        )}
                        {word.example && (
                          <p className="text-xs italic opacity-60 mt-1">
                            "{word.example}"
                          </p>
                        )}
                        <p className="text-xs opacity-40 mt-2">
                          {new Date(word.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeSavedWord(word.id)}
                        className="p-2 rounded-lg transition-all hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dictionary;
