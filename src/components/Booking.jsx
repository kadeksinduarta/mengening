import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

function BookingSection() {
  const packages = [
    {
      title: "Paket Perorangan",
      price: "IDR 600.000",
      per: "/orang",
      features: [
        "Tiket Masuk Pura Mengening",
        "Loker & Tempat Ganti",
        "Kain Sarung Khusus Melukat",
        "Plastik Bag untuk Pakaian Basah",
        "Pendampingan Prosesi",
      ],
      recommended: true,
    },
  ];

  return (
    <section
      id="booking"
      className="py-28 bg-gradient-to-b from-blue-50 via-white to-blue-50 relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Judul */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Sparkles className="text-blue-600" size={32} />
          </div>
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3 block">Investasi Diri</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900 mb-6">
            Paket Melukat
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Sebuah langkah kecil untuk ketenangan batin yang tak ternilai harganya.
          </p>
        </motion.div>

        {/* Kartu Paket */}
        <div className="flex justify-center">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-[2.5rem] p-12 md:p-14 text-center shadow-2xl border-2 border-blue-100 max-w-lg w-full overflow-hidden group hover:shadow-3xl transition-all duration-500"
            >
              {pkg.recommended && (
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
              )}

              <div className="absolute top-6 right-6 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide">
                Populer
              </div>

              <h3 className="text-3xl font-semibold font-playfair mb-3 text-slate-800 mt-4">
                {pkg.title}
              </h3>
              <p className="text-slate-500 mb-10 text-sm">Pengalaman spiritual yang otentik.</p>

              <div className="flex items-baseline justify-center mb-10">
                <span className="text-sm font-semibold text-slate-500 mr-2">IDR</span>
                <span className="text-6xl font-bold text-slate-900 tracking-tight">600k</span>
                <span className="text-slate-400 ml-2 text-lg">{pkg.per}</span>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-10"></div>

              <ul className="text-left space-y-5 mb-12">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="bg-blue-100 p-1.5 rounded-full mr-4 shrink-0 mt-0.5">
                      <Check size={16} className="text-blue-600" strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/booking"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-100"
              >
                Pesan Sekarang
              </a>
              <p className="mt-5 text-xs text-slate-400">
                💳 Pembayaran aman & konfirmasi instan via WhatsApp
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-28 max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
            <p className="text-xl md:text-2xl font-playfair italic text-slate-700 mb-8 leading-relaxed">
              "Saya merasa sangat lega setelah melukat disini. Beban pikiran rasanya terangkat bersama air yang mengalir. Sangat direkomendasikan."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 bg-slate-200 rounded-full overflow-hidden ring-4 ring-blue-50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 text-base">Sarah W.</p>
                <p className="text-blue-600 text-sm font-medium">Wisatawan Domestik</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BookingSection;
