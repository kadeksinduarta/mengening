import SEO from '@/components/SEO';
import PublicLayout from '@/components/PublicLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase, PAYMENTS_BUCKET } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, MapPin, User, Mail, Phone, FileText,
    CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Check
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Pilihan jam dibatasi ke jam operasional (08:00-17:00, tiap 30 menit).
// Input type="time" melaporkan nilai kosong selama menitnya belum diisi,
// sehingga form terlihat sudah terisi padahal ditolak validasi.
const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
    const minutes = 8 * 60 + i * 30;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});

const FIELD_LABELS = {
    name: 'Nama Lengkap',
    email: 'Email',
    phone: 'Nomor WhatsApp',
    tanggal: 'Tanggal',
    jam: 'Jam Perkiraan',
    alamat: 'Alamat Asal',
};

const REQUIRED_BY_STEP = {
    1: ['name', 'email', 'phone'],
    2: ['tanggal', 'jam', 'alamat'],
};

export default function BookingForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [missingFields, setMissingFields] = useState([]);

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

    const isValidPhone = (phone) => {
        const digits = (phone || '').replace(/[^0-9]/g, '');
        const national = digits.startsWith('62') ? digits.slice(2)
            : digits.startsWith('0') ? digits.slice(1)
            : digits;
        return /^8[0-9]{9,12}$/.test(national);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        // Field yang baru disentuh tidak lagi ditandai merah.
        setMissingFields((prev) => prev.filter((field) => field !== name));

        if (name === 'bukti_transfer') {
            setFormData({ ...formData, bukti_transfer: files[0] });
        } else if (name === 'phone') {
            const cleaned = value.replace(/[^0-9+]/g, '');
            setFormData({ ...formData, phone: cleaned });
            setPhoneError(cleaned && !isValidPhone(cleaned) ? 'Nomor WhatsApp tidak valid. Contoh: 081234567890' : '');
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const getMissingFields = (step) =>
        (REQUIRED_BY_STEP[step] || []).filter(
            (field) => !String(formData[field] || '').trim()
        );

    const nextStep = () => {
        const missing = getMissingFields(currentStep);

        if (missing.length > 0) {
            setMissingFields(missing);
            setMessage(
                `Mohon lengkapi ${missing.map((field) => FIELD_LABELS[field]).join(', ')}.`
            );
            return;
        }

        if (currentStep === 1 && !isValidPhone(formData.phone)) {
            setMissingFields(['phone']);
            setMessage('Nomor WhatsApp tidak valid. Contoh: 081234567890.');
            return;
        }

        setMissingFields([]);
        setMessage('');
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setMissingFields([]);
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
            let buktiUrl = null;
            if (formData.bukti_transfer) {
                const file = formData.bukti_transfer;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `bukti_transfer/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(PAYMENTS_BUCKET)
                    .upload(filePath, file);
                if (uploadError) throw uploadError;
                buktiUrl = filePath;
            }

            const { error: insertError } = await supabase.from('bookings').insert([{
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                tanggal: formData.tanggal,
                jam: formData.jam,
                alamat: formData.alamat,
                tipe: formData.tipe,
                payment_method: formData.payment_method,
                bukti_transfer: buktiUrl,
                catatan: formData.catatan
            }]);
            
            if (insertError) throw insertError;
            setSubmitted(true);

            // Redirect to WhatsApp after 2 seconds
            setTimeout(() => {
                const whatsappMessage = createWhatsAppMessage();
                const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285857864840';
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
                <PublicLayout solidNav>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50 px-4 pt-24">
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
                </PublicLayout>
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

            <PublicLayout solidNav>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
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
                                                <Label className="mb-2 block">
                                                    Nama Lengkap <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    aria-invalid={missingFields.includes('name')}
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan nama lengkap"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-2 block">
                                                    Email <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        aria-invalid={missingFields.includes('email')}
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="pl-10"
                                                        placeholder="email@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="mb-2 block">
                                                    Nomor WhatsApp <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        type="tel"
                                                        inputMode="numeric"
                                                        name="phone"
                                                        aria-invalid={missingFields.includes('phone')}
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="pl-10"
                                                        placeholder="081234567890"
                                                        maxLength={15}
                                                        required
                                                    />
                                                </div>
                                                {phoneError ? (
                                                    <p className="mt-2 text-xs text-red-500">{phoneError}</p>
                                                ) : (
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        Nomor ini akan digunakan untuk konfirmasi booking via WhatsApp
                                                    </p>
                                                )}
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
                                                    <Label className="mb-2 block">
                                                        Tanggal <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        name="tanggal"
                                                        aria-invalid={missingFields.includes('tanggal')}
                                                        value={formData.tanggal}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="mb-2 block">
                                                        Jam Perkiraan <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                        <select
                                                            name="jam"
                                                            value={formData.jam}
                                                            onChange={handleChange}
                                                            aria-invalid={missingFields.includes('jam')}
                                                            className="h-8 w-full appearance-none rounded-lg border border-input bg-transparent pl-10 pr-3 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"
                                                            required
                                                        >
                                                            <option value="">Pilih jam kedatangan</option>
                                                            {TIME_SLOTS.map((slot) => (
                                                                <option key={slot} value={slot}>
                                                                    {slot} WITA
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="mb-2 block">
                                                    Alamat Asal <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                                                    <Textarea
                                                        name="alamat"
                                                        aria-invalid={missingFields.includes('alamat')}
                                                        className="pl-10 min-h-[100px]"
                                                        placeholder="Masukkan alamat lengkap atau kota asal..."
                                                        value={formData.alamat}
                                                        onChange={handleChange}
                                                        required
                                                    />
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
                                                        <strong className="text-lg">Bank Mandiri 1450016415263 an. NI KOMANG TASYA APRI</strong>
                                                    </p>
                                                    <Label className="mb-2 block">
                                                        Upload Bukti Transfer
                                                    </Label>
                                                    <Input
                                                        type="file"
                                                        name="bukti_transfer"
                                                        onChange={handleChange}
                                                        accept="image/*"
                                                    />
                                                </motion.div>
                                            )}

                                            <div>
                                                <Label className="mb-2 block">
                                                    Catatan Tambahan (Opsional)
                                                </Label>
                                                <Textarea
                                                    name="catatan"
                                                    value={formData.catatan}
                                                    onChange={handleChange}
                                                    className="min-h-[80px]"
                                                    placeholder="Contoh: Saya membutuhkan pemandu berbahasa Inggris..."
                                                />
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

                            <div className="flex gap-4 mt-10">
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={prevStep}
                                        className="flex-1"
                                    >
                                        <ArrowLeft size={16} className="mr-2" />
                                        Kembali
                                    </Button>
                                )}
                                {currentStep < 3 ? (
                                    <Button
                                        type="button"
                                        size="lg"
                                        onClick={nextStep}
                                        className="flex-1"
                                    >
                                        Lanjutkan
                                        <ArrowRight size={16} className="ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={loading}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={16} className="mr-2" />
                                                Konfirmasi Booking
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </PublicLayout>
        </>
    );
}
