import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiAuth, getImageUrl } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Trash2, ExternalLink,
    MessageCircle, MoreHorizontal, Calendar,
    User, Mail, Phone, MapPin, CheckCircle, Clock, X
} from 'lucide-react';

export default function BookingManagement() {
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await apiAuth.get('/dashboard/booking');
            setBookings(response.data.data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
            try {
                await apiAuth.delete(`/dashboard/booking/${id}`);
                setBookings(bookings.filter(b => b.id !== id));
            } catch (err) {
                console.error('Error deleting booking:', err);
                alert('Gagal menghapus booking.');
            }
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm)
    );

    const openDetail = (booking) => {
        setSelectedBooking(booking);
        setShowDetail(true);
    };

    return (
        <AdminLayout title="Manajemen Booking">
            <Head>
                <title>Kelola Booking - Pura Mengening</title>
            </Head>

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="relative flex-1 max-w-lg group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-blue-500 outline-none shadow-sm group-hover:shadow-md transition-all font-bold text-slate-700 placeholder:text-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-7 py-4 bg-white border border-slate-100 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-slate-50 shadow-sm transition-all">
                        <Filter size={18} /> Filter
                    </button>
                    <button
                        onClick={fetchBookings}
                        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Bookings Table / Cards */}
            <div className="bg-white lg:bg-transparent rounded-[2.5rem] lg:rounded-none border lg:border-none border-slate-100 shadow-sm lg:shadow-none overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase tracking-[0.2em] border-b border-slate-100">
                                    <th className="px-10 py-6 font-black">Customer</th>
                                    <th className="px-8 py-6 font-black">Schedule</th>
                                    <th className="px-8 py-6 font-black">Type</th>
                                    <th className="px-8 py-6 font-black">Payment</th>
                                    <th className="px-10 py-6 font-black text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    [1, 2, 3, 4].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-10 py-8"><div className="h-12 w-48 bg-slate-100 rounded-2xl"></div></td>
                                            <td className="px-8 py-8"><div className="h-12 w-32 bg-slate-100 rounded-2xl"></div></td>
                                            <td className="px-8 py-8"><div className="h-8 w-24 bg-slate-100 rounded-full"></div></td>
                                            <td className="px-8 py-8"><div className="h-8 w-28 bg-slate-100 rounded-full"></div></td>
                                            <td className="px-10 py-8"><div className="h-12 w-32 mx-auto bg-slate-100 rounded-2xl"></div></td>
                                        </tr>
                                    ))
                                ) : filteredBookings.length > 0 ? (
                                    filteredBookings.map((b) => (
                                        <tr key={b.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center font-black text-blue-600 text-lg group-hover:scale-110 transition-transform">
                                                        {b.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-base">{b.name}</p>
                                                        <p className="text-xs text-slate-400 font-bold tracking-tight">{b.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2.5 text-sm text-slate-900 font-black">
                                                        <Calendar size={16} className="text-blue-500" />
                                                        {new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                                                        <Clock size={16} />
                                                        {b.jam} WIB
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b.tipe === 'Perorangan' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'
                                                    }`}>
                                                    {b.tipe}
                                                </span>
                                            </td>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${b.payment_method === 'Cash' ? 'bg-blue-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></div>
                                                    <span className="text-sm font-black text-slate-900">{b.payment_method}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => openDetail(b)}
                                                        className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-2xl transition-all"
                                                        title="View Details"
                                                    >
                                                        <ExternalLink size={20} />
                                                    </button>
                                                    <a
                                                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-lg rounded-2xl transition-all"
                                                        title="WhatsApp"
                                                    >
                                                        <MessageCircle size={20} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(b.id)}
                                                        className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-lg rounded-2xl transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                                                    <Users size={40} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg">No bookings found</p>
                                                    <p className="text-slate-400 text-sm font-bold">Try adjusting your search or filters</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-white rounded-[2rem] border border-slate-100 animate-pulse"></div>
                        ))
                    ) : filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => (
                            <div key={b.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-600 text-base">
                                        {b.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900 text-base">{b.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • {b.jam}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${b.tipe === 'Perorangan' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {b.tipe}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${b.payment_method === 'Cash' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{b.payment_method}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openDetail(b)} className="p-3 bg-slate-50 text-slate-400 rounded-xl"><ExternalLink size={18} /></button>
                                        <a href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><MessageCircle size={18} /></a>
                                        <button onClick={() => handleDelete(b.id)} className="p-3 bg-slate-50 text-rose-400 rounded-xl"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white rounded-[2rem] border border-slate-100">
                            <p className="font-black text-slate-400 text-sm">No bookings found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetail && selectedBooking && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60]"
                            onClick={() => setShowDetail(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-3xl max-h-[90vh] bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl z-[70] overflow-hidden border border-white flex flex-col"
                        >
                            <div className="bg-slate-900 p-8 lg:p-12 text-white relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                                <button
                                    onClick={() => setShowDetail(false)}
                                    className="absolute right-6 top-6 lg:right-10 lg:top-10 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all z-10"
                                >
                                    <X size={20} className="lg:w-6 lg:h-6" />
                                </button>

                                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 relative z-10">
                                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-600 rounded-2xl lg:rounded-[2.5rem] flex items-center justify-center text-2xl lg:text-4xl font-black shadow-2xl shadow-blue-600/40">
                                        {selectedBooking.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1 lg:space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Booking Record</span>
                                        </div>
                                        <h2 className="text-2xl lg:text-4xl font-black leading-tight tracking-tight">{selectedBooking.name}</h2>
                                        <p className="text-slate-400 font-bold flex items-center gap-2.5 text-sm lg:text-lg">
                                            <Mail size={16} className="text-blue-500 lg:w-[18px]" /> {selectedBooking.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 lg:p-16 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                                    <div className="space-y-8 lg:space-y-10">
                                        <h3 className="text-[10px] lg:text-[11px] uppercase tracking-[0.3em] text-slate-300 font-black flex items-center gap-3">
                                            <div className="w-6 h-px bg-slate-200"></div>
                                            Contact Information
                                        </h3>
                                        <div className="space-y-6 lg:space-y-8">
                                            <div className="flex items-center gap-5 lg:gap-6 group">
                                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-xl lg:rounded-[1.25rem] flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                                    <Phone size={20} className="lg:w-[22px]" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">WhatsApp Number</p>
                                                    <p className="text-lg lg:text-xl font-black text-slate-900">{selectedBooking.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-5 lg:gap-6 group">
                                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-xl lg:rounded-[1.25rem] flex items-center justify-center text-slate-400 shrink-0 border border-slate-100 shadow-sm">
                                                    <MapPin size={20} className="lg:w-[22px]" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Origin Address</p>
                                                    <p className="text-base lg:text-lg font-black text-slate-900 leading-snug">{selectedBooking.alamat}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8 lg:space-y-10">
                                        <h3 className="text-[10px] lg:text-[11px] uppercase tracking-[0.3em] text-slate-300 font-black flex items-center gap-3">
                                            <div className="w-6 h-px bg-slate-200"></div>
                                            Ritual Details
                                        </h3>
                                        <div className="space-y-6 lg:space-y-8">
                                            <div className="flex items-center gap-5 lg:gap-6 group">
                                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-xl lg:rounded-[1.25rem] flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                                    <Calendar size={20} className="lg:w-[22px]" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Schedule</p>
                                                    <p className="text-base lg:text-lg font-black text-slate-900">
                                                        {new Date(selectedBooking.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        <span className="text-blue-600 ml-2">@ {selectedBooking.jam}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 lg:gap-6 group">
                                                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-50 rounded-xl lg:rounded-[1.25rem] flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                                    <CheckCircle size={20} className="lg:w-[22px]" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Type & Payment</p>
                                                    <p className="text-base lg:text-lg font-black text-slate-900">
                                                        {selectedBooking.tipe} <span className="text-slate-300 font-medium mx-2">•</span> {selectedBooking.payment_method}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedBooking.catatan && (
                                    <div className="mt-12 lg:mt-16 p-6 lg:p-8 bg-slate-50 rounded-2xl lg:rounded-[2rem] border border-slate-100 relative">
                                        <MessageCircle size={32} className="text-slate-200 absolute -top-4 -left-4 bg-white rounded-full p-1 shadow-sm hidden lg:block" />
                                        <p className="text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-3">Customer Notes</p>
                                        <p className="text-base lg:text-lg text-slate-700 italic font-medium leading-relaxed">"{selectedBooking.catatan}"</p>
                                    </div>
                                )}

                                {selectedBooking.bukti_transfer && (
                                    <div className="mt-12">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                            <div className="w-6 h-px bg-slate-200"></div>
                                            Bukti Transfer
                                        </p>
                                        <div className="relative group max-w-sm">
                                            <div className="absolute inset-0 bg-blue-600/10 rounded-2xl lg:rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all"></div>
                                            <img
                                                src={getImageUrl(selectedBooking.bukti_transfer)}
                                                alt="Bukti Transfer"
                                                className="relative w-full rounded-2xl lg:rounded-[2.5rem] border-4 border-white shadow-xl group-hover:scale-[1.02] transition-transform cursor-zoom-in"
                                                onClick={() => window.open(getImageUrl(selectedBooking.bukti_transfer), '_blank')}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-12 lg:mt-16 pt-8 lg:pt-10 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-end gap-4 lg:gap-5">
                                    <button
                                        onClick={() => setShowDetail(false)}
                                        className="w-full lg:w-auto px-10 py-4 lg:py-5 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 rounded-2xl transition-all order-2 lg:order-1"
                                    >
                                        Close Modal
                                    </button>
                                    <a
                                        href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full lg:w-auto px-12 py-4 lg:py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] lg:text-xs rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 order-1 lg:order-2"
                                    >
                                        <MessageCircle size={20} /> Open WhatsApp
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
