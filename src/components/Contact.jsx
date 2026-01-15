import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

function Contact() {
  return (
    <section
      id="contact"
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3 block">Hubungi Kami</span>
          <h2 className="text-4xl font-bold font-playfair text-slate-900 mb-6">Lokasi & Kontak</h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-light">
            Kami menantikan kedatangan Anda untuk merasakan kedamaian di Pura Mengening.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-[2rem] p-10 lg:p-12 shadow-xl border border-slate-100"
          >
            <h3 className="text-2xl font-bold font-playfair mb-8 text-slate-800">
              Pura Tirta Empul Mengening
            </h3>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Alamat</h4>
                  <p className="text-slate-600 leading-relaxed font-light">
                    Jalan Tirta No.25M, Sareseda, Tampaksiring, <br /> Kabupaten Gianyar, Bali 80552
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Email</h4>
                  <a href="mailto:info@mengening.com" className="text-slate-600 hover:text-blue-600 transition-colors font-light">
                    info.tasya@melukat.com
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">WhatsApp</h4>
                  <a href="https://wa.me/6285857864840" className="text-slate-600 hover:text-blue-600 transition-colors font-light">
                    +62 8585 7864 840
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Jam Operasional</h4>
                  <p className="text-slate-600 font-light">Buka Setiap Hari, 08:00 - 17:00 WITA</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.812934435289!2d115.309451875886!3d-8.42002469161896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd218c195331a15%3A0x976a2d7f7fe96771!2sPura%20Mengening!5e0!3m2!1sid!2sid!4v1762316859713!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pura Tirta Empul Mengening Map"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
