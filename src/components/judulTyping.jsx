import { useState, useEffect } from "react";

function AnimatedText() {
  const text = "Temukan Kedamaian";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 150); // kecepatan ketik
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
      {displayText}
      <span className="animate-pulse text-blue-400">|</span>
    </h1>
  );
}

export default AnimatedText;
