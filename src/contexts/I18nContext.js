import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import id from "../locales/id.json";

const translations = { en, id };

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  // Default to Indonesian on both server and client so search engines and
  // social crawlers (which never run the effect below) see real Indonesian
  // content instead of a blank page or English copy that doesn't match the
  // target keywords (e.g. "pura mengening", "melukat di tampaksiring").
  const [language, setLanguage] = useState("id");

  useEffect(() => {
    // Check local storage for saved language preference on mount
    const savedLang = localStorage.getItem("language");
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    } else {
      // If no saved preference, check browser language
      const browserLang = navigator.language.split("-")[0];
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
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

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
