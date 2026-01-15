import { motion } from "framer-motion";
import AnimatedText from "./judulTyping.jsx";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover scale-105"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video-melukat-mengening-fixx.mp4" type="video/mp4" />
      </video>

      {/* Overlay: Enhanced gradient for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/60 to-slate-900/70"></div>

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8 text-white max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <AnimatedText />
        </motion.div>

        <motion.p
          className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-100 leading-relaxed font-light tracking-wide max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Rasakan kedamaian sejati dan penyucian jiwa melalui ritual suci Melukat di mata air alami Pura Mengening.
        </motion.p>

        <motion.div
          className="mt-14 flex flex-col sm:flex-row gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <a
            href="/booking"
            className="group px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl shadow-white/20 hover:shadow-white/30 hover:scale-105 active:scale-100"
          >
            <span className="flex items-center gap-2">
              Mulai Booking
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>
          <a
            href="#about"
            className="px-10 py-5 bg-transparent border-2 border-white/40 text-white rounded-full font-semibold text-lg hover:bg-white/20 hover:border-white/60 transition-all duration-300 backdrop-blur-sm hover:scale-105 active:scale-100"
          >
            Pelajari Lebih Lanjut
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs uppercase tracking-[0.25em] text-white/70 font-medium">Jelajahi</span>
          <motion.div
            className="w-[2px] h-16 bg-gradient-to-b from-white/80 to-transparent rounded-full"
            animate={{
              scaleY: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        </motion.div>
      </div>
    </div>
  );
}
