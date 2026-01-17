import SEO from '@/components/SEO';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, MapPin, User, Mail, Phone, FileText,
    CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Check
} from 'lucide-react';

export default function BookingForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        tanggal: '',
        jam: '',
        alamat: '',
        tipe: 'Perorangan',
        payment_method: 'Cash',
        bukti_transfer: null,
        catatan: '',
    });

    const steps = [
        { number: 1, title: 'Data Diri', icon: User },
        { number: 2, title: 'Jadwal & Detail', icon: Calendar },
        { number: 3, title: 'Konfirmasi', icon: CheckCircle },
    ];

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'bukti_transfer') {
            setFormData({ ...formData, bukti_transfer: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateStep = (step) => {
        if (step === 1) {
            return formData.name && formData.email && formData.phone;
        }
        if (step === 2) {
            return formData.tanggal && formData.jam && formData.alamat;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
            setMessage('');
        } else {
            setMessage('Mohon lengkapi semua field yang wajib diisi.');
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        setMessage('');
    };

    const createWhatsAppMessage = () => {
        const tipeText = formData.tipe === 'Perorangan' ? 'Perorangan' :
            formData.tipe === 'Rombongan' ? 'Rombongan/Keluarga' : 'Instansi';

        const paymentText = formData.payment_method === 'Cash' ? 'Cash (Bayar di Lokasi)' : 'Transfer Bank';

        let message = `\u{1F64F} *Booking Melukat - Pura Mengening*\n\n`;
        message += `Halo, saya ingin melakukan booking Melukat dengan detail sebagai berikut:\n\n`;
        message += `\u{1F464} *Data Diri:*\n`;
        message += `• Nama: ${formData.name}\n`;
        message += `• Email: ${formData.email}\n`;
        message += `• WhatsApp: ${formData.phone}\n\n`;
        message += `\u{1F4C5} *Jadwal Kunjungan:*\n`;
        message += `• Tanggal: ${new Date(formData.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
        message += `• Jam: ${formData.jam}\n`;
        message += `• Alamat Asal: ${formData.alamat}\n\n`;
        message += `\u{1F4CB} *Detail Booking:*\n`;
        message += `• Tipe Kunjungan: ${tipeText}\n`;
        message += `• Metode Pembayaran: ${paymentText}\n`;

        if (formData.catatan) {
            message += `\n\u{1F4AC} *Catatan Tambahan:*\n${formData.catatan}\n`;
        }

        message += `\n\nMohon konfirmasi ketersediaan untuk jadwal tersebut. Terima kasih! \u{1F64F}`;

        return encodeURIComponent(message);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'bukti_transfer' && value === null) return;
                form.append(key, value);
            });

            await api.post('/booking', form);
            setSubmitted(true);

            // Redirect to WhatsApp after 2 seconds
            setTimeout(() => {
                const whatsappMessage = createWhatsAppMessage();
                const whatsappNumber = '6281234567890'; // GANTI DENGAN NOMOR WHATSAPP YANG BENAR
                window.location.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
            }, 2000);
        } catch (error) {
            console.log('Error:', error.response?.data);
            setMessage('Terjadi kesalahan saat mengirim booking. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <>
                <SEO title="Booking Berhasil" />
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50 px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                        >
                            <CheckCircle className="text-green-600" size={48} />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Booking Berhasil!</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Terima kasih telah melakukan pemesanan. Anda akan segera diarahkan ke WhatsApp untuk konfirmasi booking.
                        </p>
                        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                            <p className="text-sm text-blue-800 font-medium">
                                💬 Pesan WhatsApp otomatis telah disiapkan dengan detail booking Anda.
                                Silakan kirim pesan tersebut untuk konfirmasi.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="inline-block w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Kembali ke Beranda
                        </button>
                    </motion.div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO
                title="Form Booking Melukat"
                description="Lakukan reservasi untuk ritual Melukat di Pura Mengening bersama Tasya Melukat. Isi form booking untuk pengalaman spiritual yang mendalam di Bali."
                keywords="booking Pura Mengening, reservasi Melukat, booking wisata Bali, Tasya Melukat"
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors font-medium group"
                    >
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Website
                    </button>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between max-w-2xl mx-auto">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${currentStep >= step.number
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                            : 'bg-slate-200 text-slate-400'
                                            }`}>
                                            {currentStep > step.number ? (
                                                <Check size={20} />
                                            ) : (
                                                <step.icon size={20} />
                                            )}
                                        </div>
                                        <p className={`mt-3 text-sm font-semibold ${currentStep >= step.number ? 'text-blue-600' : 'text-slate-400'
                                            }`}>
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-300 ${currentStep > step.number ? 'bg-blue-600' : 'bg-slate-200'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white relative z-10">Form Booking Melukat</h1>
                            <p className="text-blue-100 mt-3 relative z-10 text-lg">
                                {currentStep === 1 && "Lengkapi data diri Anda"}
                                {currentStep === 2 && "Pilih jadwal dan detail kunjungan"}
                                {currentStep === 3 && "Periksa kembali informasi Anda"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 sm:p-12">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8"
                                >
                                    <AlertCircle size={20} />
                                    <p className="font-medium">{message}</p>
                                </motion.div>
                            )}

                            <AnimatePresence mode="wait">
                                {/* Step 1: Data Diri */}
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <User size={20} className="text-blue-600" />
                                            </div>
                                            Data Diri
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Nama Lengkap <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                                                    placeholder="Masukkan nama lengkap"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full pl-14 pr-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                                                        placeholder="email@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Nomor WhatsApp <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="w-full pl-14 pr-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                                                        placeholder="0812xxxx"
                                                        required
                                                    />
                                                </div>
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Nomor ini akan digunakan untuk konfirmasi booking via WhatsApp
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Jadwal & Detail */}
                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <Calendar size={20} className="text-blue-600" />
                                            </div>
                                            Jadwal & Detail
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                        Tanggal <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="tanggal"
                                                        value={formData.tanggal}
                                                        onChange={handleChange}
                                                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-600"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                        Jam Perkiraan <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Clock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="time"
                                                            name="jam"
                                                            value={formData.jam}
                                                            onChange={handleChange}
                                                            className="w-full pl-14 pr-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-600"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Alamat Asal <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <MapPin size={18} className="absolute left-5 top-5 text-slate-400" />
                                                    <textarea
                                                        name="alamat"
                                                        className="w-full pl-14 pr-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 min-h-[100px]"
                                                        placeholder="Masukkan alamat lengkap atau kota asal..."
                                                        value={formData.alamat}
                                                        onChange={handleChange}
                                                        required
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                        Tipe Kunjungan
                                                    </label>
                                                    <select
                                                        name="tipe"
                                                        value={formData.tipe}
                                                        onChange={handleChange}
                                                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white"
                                                    >
                                                        <option value="Perorangan">Perorangan</option>
                                                        <option value="Rombongan">Rombongan / Keluarga</option>
                                                        <option value="Instansi">Instansi</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                        Metode Pembayaran
                                                    </label>
                                                    <select
                                                        name="payment_method"
                                                        value={formData.payment_method}
                                                        onChange={handleChange}
                                                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white"
                                                    >
                                                        <option value="Cash">Cash (Bayar di Lokasi)</option>
                                                        <option value="Transfer">Transfer Bank</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {formData.payment_method === 'Transfer' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100"
                                                >
                                                    <p className="text-sm text-blue-800 font-medium mb-4">
                                                        Silakan transfer ke: <br />
                                                        <strong className="text-lg">BCA 1234567890 an. Pura Mengening</strong>
                                                    </p>
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                        Upload Bukti Transfer
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="bukti_transfer"
                                                        onChange={handleChange}
                                                        accept="image/*"
                                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
                                                    />
                                                </motion.div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Catatan Tambahan (Opsional)
                                                </label>
                                                <textarea
                                                    name="catatan"
                                                    value={formData.catatan}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 min-h-[80px]"
                                                    placeholder="Contoh: Saya membutuhkan pemandu berbahasa Inggris..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Konfirmasi */}
                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <CheckCircle size={20} className="text-blue-600" />
                                            </div>
                                            Konfirmasi Booking
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100">
                                                <h4 className="font-bold text-slate-900 mb-4 text-lg">📋 Ringkasan Booking</h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                                        <span className="text-slate-600">Nama</span>
                                                        <span className="font-semibold text-slate-900">{formData.name}</span>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                                        <span className="text-slate-600">Email</span>
                                                        <span className="font-semibold text-slate-900">{formData.email}</span>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                                        <span className="text-slate-600">WhatsApp</span>
                                                        <span className="font-semibold text-slate-900">{formData.phone}</span>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                                        <span className="text-slate-600">Tanggal</span>
                                                        <span className="font-semibold text-slate-900">
                                                            {formData.tanggal && new Date(formData.tanggal).toLocaleDateString('id-ID', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                                        <span className="text-slate-600">Jam</span>
                                                        <span className="font-semibold text-slate-900">{formData.jam}</span>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                                        <span className="text-slate-600">Tipe Kunjungan</span>
                                                        <span className="font-semibold text-slate-900">{formData.tipe}</span>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-slate-200">
                                                        <span className="text-slate-600">Pembayaran</span>
                                                        <span className="font-semibold text-slate-900">
                                                            {formData.payment_method === 'Cash' ? 'Cash (Bayar di Lokasi)' : 'Transfer Bank'}
                                                        </span>
                                                    </div>
                                                    {formData.catatan && (
                                                        <div className="py-2">
                                                            <span className="text-slate-600 block mb-1">Catatan</span>
                                                            <span className="font-medium text-slate-900">{formData.catatan}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
                                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                                    <CheckCircle size={20} />
                                                    Langkah Selanjutnya
                                                </h4>
                                                <ol className="space-y-2 text-sm text-blue-800">
                                                    <li className="flex items-start gap-2">
                                                        <span className="font-bold">1.</span>
                                                        <span>Klik tombol "Konfirmasi Booking" di bawah</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="font-bold">2.</span>
                                                        <span>Anda akan diarahkan ke WhatsApp dengan pesan otomatis berisi detail booking</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="font-bold">3.</span>
                                                        <span>Kirim pesan tersebut untuk konfirmasi akhir dengan tim kami</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <span className="font-bold">4.</span>
                                                        <span>Tim kami akan membalas untuk konfirmasi ketersediaan jadwal</span>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="flex gap-4 mt-10">
                                {currentStep > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft size={20} />
                                        Kembali
                                    </button>
                                )}
                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        Lanjutkan
                                        <ArrowRight size={20} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={20} />
                                                Konfirmasi Booking
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
