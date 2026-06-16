import { useState, useEffect } from "react";
import { useTranslation } from "@/contexts/I18nContext";

function AnimatedText() {
  const { t } = useTranslation();
  const text = t("home.title") || "Temukan Kedamaian";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 150); // kecepatan ketik
    return () => clearInterval(interval);
  }, [text]); // re-run animation when language changes

  return (
    <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
      {displayText}
      <span className="animate-pulse text-blue-400">|</span>
    </h1>
  );
}

export default AnimatedText;
