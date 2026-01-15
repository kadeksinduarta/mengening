import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "Apa itu Melukat?",
            answer: "Melukat adalah ritual penyucian diri dalam tradisi Hindu Bali yang dilakukan dengan air suci. Ritual ini bertujuan untuk membersihkan diri dari energi negatif, pikiran buruk, dan beban spiritual. Di Pura Mengening, melukat dilakukan di mata air alami yang dipercaya memiliki kekuatan spiritual untuk memurnikan jiwa dan raga."
        },
        {
            question: "Apakah saya harus beragama Hindu untuk melakukan Melukat?",
            answer: "Tidak. Melukat terbuka untuk siapa saja dari berbagai latar belakang agama. Yang terpenting adalah niat baik, sikap menghormati, dan kesediaan untuk mengikuti tata cara ritual dengan khusyuk. Banyak wisatawan dari berbagai negara dan agama yang merasakan manfaat spiritual dari ritual ini."
        },
        {
            question: "Berapa lama durasi ritual Melukat?",
            answer: "Durasi ritual Melukat biasanya berkisar antara 30-45 menit, tergantung pada jumlah peserta dan tingkat kekhusyukan. Namun, kami menyarankan Anda mengalokasikan waktu sekitar 2 jam untuk keseluruhan pengalaman, termasuk persiapan, ganti pakaian, dan waktu untuk merenung setelah ritual."
        },
        {
            question: "Apa yang harus saya bawa?",
            answer: "Anda hanya perlu membawa pakaian ganti kering, handuk pribadi, dan sandal yang nyaman. Kami sudah menyediakan sarung dan selendang khusus untuk ritual. Disarankan juga membawa plastik untuk pakaian basah, meskipun kami juga menyediakan plastik bag dalam paket."
        },
        {
            question: "Bagaimana pakaian yang tepat untuk Melukat?",
            answer: "Untuk ritual, Anda akan menggunakan sarung dan selendang yang kami sediakan. Pakaian dalam sebaiknya yang sederhana dan sopan (kaos dan celana pendek). Hindari pakaian yang terlalu ketat atau transparan. Setelah ritual, Anda bisa berganti dengan pakaian kering yang Anda bawa."
        },
        {
            question: "Apakah wanita yang sedang menstruasi boleh melakukan Melukat?",
            answer: "Menurut adat Hindu Bali, wanita yang sedang menstruasi tidak diperkenankan memasuki area suci pura. Hal ini bukan diskriminasi, melainkan bagian dari kepercayaan spiritual tentang kesucian. Kami mohon pengertiannya dan Anda dapat menjadwalkan ulang kunjungan di waktu yang lebih tepat."
        },
        {
            question: "Apakah anak-anak boleh ikut Melukat?",
            answer: "Ya, anak-anak boleh ikut dengan catatan harus didampingi orang tua atau wali. Untuk keamanan dan kenyamanan, kami merekomendasikan usia minimal 7 tahun. Orang tua bertanggung jawab penuh atas keselamatan anak selama ritual berlangsung."
        },
        {
            question: "Bagaimana cara pembayaran?",
            answer: "Kami menerima pembayaran Cash di lokasi atau Transfer Bank sebelum kedatangan. Untuk pembayaran transfer, Anda akan mendapatkan informasi rekening setelah mengisi form booking. Mohon upload bukti transfer untuk konfirmasi booking Anda."
        },
        {
            question: "Apakah bisa reschedule atau cancel booking?",
            answer: "Ya, perubahan jadwal (reschedule) dapat dilakukan maksimal 1x24 jam sebelum waktu kedatangan yang telah dipesan. Untuk pembatalan (cancel), mohon hubungi kami melalui WhatsApp. Kebijakan refund akan disesuaikan dengan waktu pembatalan."
        },
        {
            question: "Apa manfaat spiritual dari Melukat?",
            answer: "Melukat dipercaya dapat membersihkan energi negatif, mengurangi beban pikiran, meningkatkan ketenangan batin, dan membantu Anda merasa lebih ringan secara spiritual. Banyak peserta merasakan kedamaian mendalam, kejernihan pikiran, dan perasaan 'fresh start' setelah ritual. Namun, manfaat yang dirasakan bisa berbeda untuk setiap individu."
        },
        {
            question: "Apakah ada pemandu selama ritual?",
            answer: "Ya, setiap peserta akan didampingi oleh pemandu yang berpengalaman. Pemandu akan menjelaskan setiap tahapan ritual, membantu Anda melakukan gerakan dan doa yang benar, serta memastikan Anda merasa nyaman sepanjang proses. Jangan ragu untuk bertanya jika ada yang kurang jelas."
        },
        {
            question: "Bagaimana jika saya tidak bisa berenang?",
            answer: "Tidak perlu khawatir! Ritual Melukat tidak memerlukan kemampuan berenang. Air di area ritual tidak dalam, hanya setinggi pinggang hingga dada orang dewasa. Anda akan berdiri di bawah pancuran air suci, bukan berenang. Pemandu juga akan selalu mendampingi Anda."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-gradient-to-b from-white to-blue-50 font-sans">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                        <HelpCircle className="text-blue-600" size={32} />
                    </div>
                    <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3 block">
                        Pertanyaan Umum
                    </span>
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900 mb-6">
                        FAQ Tentang Melukat
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light">
                        Temukan jawaban atas pertanyaan yang sering diajukan seputar ritual Melukat di Pura Mengening.
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors duration-200"
                            >
                                <span className="font-semibold text-slate-900 text-base md:text-lg pr-4">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="shrink-0"
                                >
                                    <ChevronDown className="text-blue-600" size={24} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 md:px-8 pb-6 pt-2">
                                            <p className="text-slate-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-16"
                >
                    <p className="text-slate-600 mb-6">
                        Masih ada pertanyaan lain? Jangan ragu untuk menghubungi kami!
                    </p>
                    <a
                        href="#contact"
                        className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        Hubungi Kami
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
