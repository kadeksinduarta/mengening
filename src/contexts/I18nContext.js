import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import id from "../locales/id.json";

const translations = { en, id };

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language is English
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage for saved language preference on mount
    const savedLang = localStorage.getItem("language");
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      // If no saved preference, check browser language but default to en
      const browserLang = navigator.language.split("-")[0];
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
    setMounted(true);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];
    for (let k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key if translation not found
      }
    }
    return value;
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
