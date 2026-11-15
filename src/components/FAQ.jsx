import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const { t } = useTranslation();

    // The translations store an array of objects
    // We provide a fallback just in case the translation isn't loaded yet
    const faqs = t("faq.items") || [];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-gradient-to-b from-white to-brand-wash font-sans">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-tint rounded-full mb-6">
                        <HelpCircle className="text-brand" size={32} />
                    </div>
                    <span className="text-brand font-semibold tracking-wider text-sm uppercase mb-3 block">
                        {t("faq.sectionTitle")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-ink mb-6">
                        {t("faq.heading")}
                    </h2>
                    <p className="text-body text-lg max-w-2xl mx-auto font-light">
                        {t("faq.subtitle")}
                    </p>
                </motion.div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {Array.isArray(faqs) && faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-sm border border-rule overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-surface-alt transition-colors duration-200"
                            >
                                <span className="font-semibold text-ink text-base md:text-lg pr-4">
                                    {faq.q}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="shrink-0"
                                >
                                    <ChevronDown className="text-brand" size={24} />
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
                                            <p className="text-body leading-relaxed">
                                                {faq.a}
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
                    <p className="text-body mb-6">
                        {t("faq.moreQuestions")}
                    </p>
                    <a
                        href="#contact"
                        className="inline-block px-8 py-4 bg-brand text-white rounded-xl font-semibold hover:bg-brand-strong transition-colors shadow-lg shadow-brand-bright/30"
                    >
                        {t("faq.contactBtn")}
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
