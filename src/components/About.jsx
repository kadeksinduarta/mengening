import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-28 bg-white overflow-hidden"
    >
      {/* Bagian kiri: Foto */}
      <motion.div
        className="md:w-1/2 flex justify-center mb-12 md:mb-0 relative"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="absolute top-6 -left-6 w-full h-full border-2 border-blue-100 rounded-3xl z-0"></div>
        <div className="relative z-10 w-full max-w-md">
          <img
            src="/Gallery.jpg"
            alt="Melukat di Pura Mengening"
            className="w-full h-full object-cover rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500"
          />
          {/* Decoration Quote */}
          <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-50 max-w-xs hidden md:block">
            <p className="font-playfair italic text-slate-800 text-xl leading-relaxed">"Air suci yang membasuh jiwa."</p>
            <div className="w-12 h-1 bg-blue-600 mt-4 rounded-full"></div>
          </div>
        </div>
      </motion.div>

      {/* Bagian kanan: Deskripsi */}
      <motion.div
        className="md:w-1/2 md:pl-24 text-center md:text-left"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3 block">Tentang Kami</span>
        <h2 className="text-4xl md:text-5xl font-bold font-playfair text-slate-900 mb-10 leading-tight">
          Tasya Melukat <br />
          <span className="text-blue-600">Pura Mengening</span>
        </h2>

        <div className="space-y-7 text-slate-600 leading-relaxed text-lg font-light">
          <p>
            Pura Mengening dikenal sebagai tempat suci yang memancarkan energi ketenangan.
            Setiap tetes air suci di sini dipercaya mampu membasuh tidak hanya raga,
            namun juga menjernihkan pikiran dan hati.
          </p>

          <p>
            Bayangkan kesegaran mata air alami yang menyentuh wajah,
            mengembalikan senyum tulus yang mungkin sempat hilang.
            Momen <span className="text-blue-600 font-semibold">"hening"</span> yang Anda rasakan adalah
            tujuan utama dari perjalanan spiritual ini.
          </p>

          <p>
            Ini bukan sekadar ritual melukat biasa. Ini adalah perjalanan batin
            untuk menyelaraskan kembali diri dengan alam semesta dan Sang Pencipta.
          </p>
        </div>

        <motion.a
          href="#booking"
          className="inline-block mt-10 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Mulai Perjalanan Spiritual Anda
        </motion.a>
      </motion.div>
    </section>
  );
}
