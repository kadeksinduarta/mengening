import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/contexts/I18nContext";

function AnimatedText() {
  const { t } = useTranslation();
  const text = t("home.title") || "Temukan Kedamaian";
  // Start with the full title so the <h1> never renders empty for search
  // engines/social crawlers; the typing animation only replays afterwards.
  const [displayText, setDisplayText] = useState(text);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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
