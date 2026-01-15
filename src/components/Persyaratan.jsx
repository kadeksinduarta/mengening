import {
  Users,
  Activity,
  Package,
  Accessibility,
  CalendarX,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Persyaratan() {
  const items = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Persyaratan Tamu",
      desc: "Tamu berusia 18 tahun ke atas diutamakan. Untuk anak-anak, wajib didampingi orang tua. Maksimal 10 orang per sesi.",
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Level Aktivitas",
      desc: "Aktivitas ringan hingga sedang. Melibatkan berjalan menuruni anak tangga menuju area mata air.",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Perlengkapan",
      desc: "Kami menyediakan sarung dan selendang. Mohon bawa pakaian ganti kering dan handuk pribadi.",
    },
    {
      icon: <Accessibility className="w-8 h-8" />,
      title: "Aksesibilitas",
      desc: "Area pura memiliki banyak anak tangga. Mohon hubungi kami jika Anda memiliki kebutuhan khusus.",
    },
    {
      icon: <CalendarX className="w-8 h-8" />,
      title: "Reschedule",
      desc: "Perubahan jadwal diperbolehkan maksimal 1x24 jam sebelum waktu kedatangan yang telah dipesan.",
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Ketentuan Khusus",
      desc: "Wanita yang sedang datang bulan (menstruasi) dilarang memasuki area suci pura demi menjaga kesucian.",
    },
  ];

  return (
    <section id="persyaratan" className="py-28 bg-gradient-to-b from-white to-slate-50 font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3 block">Info Penting</span>
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-slate-900 mb-6">
            Hal Yang Perlu Diketahui
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Demi kenyamanan dan kekhusyukan bersama, mohon perhatikan beberapa poin berikut sebelum berkunjung.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white border-2 border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm flex items-center justify-center mb-6 text-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
