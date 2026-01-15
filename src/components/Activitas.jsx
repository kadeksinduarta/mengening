import { motion } from "framer-motion";

const canangImage = "../Gallery11.jpg";
const meditasiImage = "../Gallery12.jpg";
const melukatImage = "../Gallery8.jpg";
const sembahyangImage = "../Gallery13.jpg";

const steps = [
  {
    id: "01",
    title: "Membuat Canang",
    image: canangImage,
    desc: `Prosesi dimulai dengan membuat canang sari, persembahan kecil penuh makna sebagai wujud syukur dan keharmonisan. Aktivitas ini menenangkan hati dan menyiapkan diri untuk penyucian.`,
    side: "left",
  },
  {
    id: "02",
    title: "Meditasi",
    image: meditasiImage,
    desc: `Meditasi singkat dilakukan sebelum melukat untuk menenangkan batin dan menyatukan niat. Ditemani suara alam, napas perlahan, dan pikiran yang terbuka untuk menerima energi positif.`,
    side: "right",
  },
  {
    id: "03",
    title: "Melukat",
    image: melukatImage,
    desc: `Melukat di pancuran suci Mengening adalah inti dari penyucian diri. Air yang mengalir diyakini membersihkan pikiran, hati, dan karma buruk, membawa rasa lega dan keseimbangan spiritual.`,
    side: "left",
  },
  {
    id: "04",
    title: "Sembahyang Penutup",
    image: sembahyangImage,
    desc: `Usai melukat, dilanjutkan dengan sembahyang penutup sebagai ungkapan terima kasih atas berkah dan pembersihan yang diterima. Momen ini memperkuat ketenangan dan rasa syukur.`,
    side: "right",
  },
];

export default function Activitas() {
  return (
    <section
      id="activities"
      className="py-24 bg-slate-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Judul */}
        <div className="text-center mb-24">
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3 block">Prosesi Ritual</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900 mb-6">
            Urutan Kegiatan
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Rasakan setiap langkah penyucian diri di Pura Mengening, dari persiapan hingga doa penutup.
          </p>
        </div>

        {/* Garis Tengah Desktop */}
        <div className="hidden md:block absolute left-1/2 top-40 bottom-20 w-px bg-slate-200 transform -translate-x-1/2"></div>

        {/* Timeline Items */}
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={`flex flex-col md:flex-row items-center mb-20 relative ${step.side === "right" ? "md:flex-row-reverse" : ""
              }`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Center Dot */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-blue-600 rounded-full z-20 shadow-md"></div>

            {/* Gambar */}
            <div className={`md:w-1/2 px-6 flex justify-center ${step.side === 'right' ? 'md:justify-start' : 'md:justify-end'}`}>
              <div className="relative group w-full max-w-md aspect-[4/3] overflow-hidden rounded-2xl shadow-lg border border-white">
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className={`md:w-1/2 px-6 mt-8 md:mt-0 text-center md:text-left ${step.side === 'right' ? 'md:text-right' : ''}`}>
              <span className="text-6xl font-playfair text-slate-100 font-bold absolute -top-10 hidden md:block select-none -z-10"
                style={{ left: step.side === 'left' ? '2rem' : 'auto', right: step.side === 'right' ? '2rem' : 'auto' }}>
                {step.id}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-playfair text-slate-800 mb-4">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
