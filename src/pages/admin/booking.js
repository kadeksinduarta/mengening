import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase, getImageUrl } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Trash2, ExternalLink,
    MessageCircle, MoreHorizontal, Calendar,
    User, Users, Mail, Phone, MapPin, CheckCircle, Clock, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

const formatWhatsAppNumber = (phone) => {
    const digits = (phone || '').replace(/[^0-9]/g, '');
    if (digits.startsWith('0')) return `62${digits.slice(1)}`;
    if (digits.startsWith('62')) return digits;
    return `62${digits}`;
};

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
            const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
            try {
                const { error } = await supabase.from('bookings').delete().eq('id', id);
                if (error) throw error;
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
        <AdminLayout title="Bookings">
            <Head>
                <title>Manage Bookings - Pura Mengening</title>
            </Head>

            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                    <Input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl font-medium text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" className="gap-1.5 text-xs font-semibold rounded-xl border-slate-200/80 bg-white" onClick={fetchBookings}>
                        Refresh Data
                    </Button>
                </div>
            </div>

            {/* Bookings Table / Cards */}
            <Card className="rounded-xl border-slate-200/80 overflow-hidden bg-white shadow-sm">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="font-bold text-slate-500 text-xs py-4">Customer</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs py-4">Schedule</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs py-4">Type</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs py-4">Payment</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs py-4 text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <TableRow key={i} className="hover:bg-transparent border-b border-slate-100 animate-pulse">
                                        <TableCell className="py-4"><div className="h-10 w-44 bg-slate-100 rounded-lg"></div></TableCell>
                                        <TableCell className="py-4"><div className="h-10 w-28 bg-slate-100 rounded-lg"></div></TableCell>
                                        <TableCell className="py-4"><div className="h-6 w-20 bg-slate-100 rounded-full"></div></TableCell>
                                        <TableCell className="py-4"><div className="h-6 w-24 bg-slate-100 rounded-full"></div></TableCell>
                                        <TableCell className="py-4"><div className="h-9 w-28 ml-auto bg-slate-100 rounded-lg"></div></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((b) => (
                                    <TableRow key={b.id} className="border-b border-slate-100/85 hover:bg-slate-50/40 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                                                    {b.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 text-sm">{b.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium truncate max-w-[180px]">{b.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-800 font-semibold">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                                    <Clock size={12} className="text-slate-400" /> {b.jam}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant={b.tipe === 'Perorangan' ? 'secondary' : 'outline'}
                                                className={`text-[10px] font-semibold border-none ${b.tipe === 'Perorangan' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {b.tipe}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${b.payment_method === 'Cash' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                                <span className="text-xs font-semibold text-slate-700">{b.payment_method}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => openDetail(b)} title="View Details" className="h-8 w-8 hover:bg-slate-100 rounded-lg">
                                                    <ExternalLink size={14} className="text-slate-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg">
                                                    <a href={`https://wa.me/${formatWhatsAppNumber(b.phone)}`} target="_blank" rel="noreferrer">
                                                        <MessageCircle size={14} />
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">No bookings found</p>
                                                <p className="text-slate-400 text-xs font-medium">Try adjusting your search query</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-3 bg-slate-50/50">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-36 bg-white rounded-xl border border-slate-100 animate-pulse"></div>
                        ))
                    ) : filteredBookings.length > 0 ? (
                        filteredBookings.map((b) => (
                            <div key={b.id} className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                                        {b.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm truncate">{b.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                <Calendar size={10} /> {new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <span className="text-[10px] text-slate-300">•</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{b.jam}</span>
                                        </div>
                                    </div>
                                    <Badge variant={b.tipe === 'Perorangan' ? 'secondary' : 'outline'}
                                        className={`text-[9px] font-semibold border-none ${b.tipe === 'Perorangan' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {b.tipe}
                                    </Badge>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${b.payment_method === 'Cash' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                        <span className="text-[11px] font-semibold text-slate-600">{b.payment_method}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Button variant="ghost" size="icon" onClick={() => openDetail(b)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 border border-slate-100"><ExternalLink size={14} /></Button>
                                        <Button variant="ghost" size="icon" asChild className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            <a href={`https://wa.me/${formatWhatsAppNumber(b.phone)}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /></a>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)} className="w-8 h-8 rounded-lg bg-slate-50 text-red-500 border border-slate-100"><Trash2 size={14} /></Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center bg-white rounded-xl border border-slate-200/60 shadow-sm">
                            <p className="font-semibold text-slate-400 text-xs">No bookings found</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetail && selectedBooking && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                            onClick={() => setShowDetail(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-xl z-[70] overflow-hidden border border-slate-200/80 flex flex-col font-sans"
                        >
                            {/* Modal Header */}
                            <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden shrink-0">
                                <button
                                    onClick={() => setShowDetail(false)}
                                    className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors z-10"
                                >
                                    <X size={16} />
                                </button>

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/10">
                                        {selectedBooking.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="space-y-0.5">
                                        <Badge className="bg-blue-500 text-[9px] font-bold uppercase tracking-wider border-none px-2 py-0.5">Booking Details</Badge>
                                        <h3 className="text-xl font-bold tracking-tight mt-1">{selectedBooking.name}</h3>
                                        <p className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                                            <Mail size={12} className="text-slate-400" /> {selectedBooking.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Contact Column */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Information</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                                                    <Phone size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Phone / WhatsApp</p>
                                                    <p className="text-sm font-semibold text-slate-800">{selectedBooking.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                                                    <MapPin size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Origin Address</p>
                                                    <p className="text-sm font-semibold text-slate-800 leading-snug">{selectedBooking.alamat}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ritual Column */}
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ritual Details</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                                                    <Calendar size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Schedule</p>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {new Date(selectedBooking.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        <span className="text-blue-600 font-bold ml-1.5">@ {selectedBooking.jam}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                                                    <CheckCircle size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Type & Payment</p>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {selectedBooking.tipe} <span className="text-slate-300 font-normal mx-1.5">•</span> {selectedBooking.payment_method}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedBooking.catatan && (
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                                            <MessageCircle size={10} /> Customer Notes
                                        </p>
                                        <p className="text-xs text-slate-600 italic font-medium leading-relaxed">"{selectedBooking.catatan}"</p>
                                    </div>
                                )}

                                {selectedBooking.bukti_transfer && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bukti Transfer</p>
                                        <div className="relative group max-w-xs border border-slate-200/80 rounded-xl overflow-hidden shadow-sm bg-slate-50">
                                            <img
                                                src={getImageUrl(selectedBooking.bukti_transfer)}
                                                alt="Bukti Transfer"
                                                className="w-full h-auto max-h-48 object-contain cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-200"
                                                onClick={() => window.open(getImageUrl(selectedBooking.bukti_transfer), '_blank')}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-2.5 shrink-0">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDetail(false)}
                                    className="w-full sm:w-auto px-5 font-semibold text-xs rounded-xl border-slate-200"
                                >
                                    Close Details
                                </Button>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto px-5 bg-blue-600 hover:bg-blue-500 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
                                >
                                    <a
                                        href={`https://wa.me/${formatWhatsAppNumber(selectedBooking.phone)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MessageCircle size={14} /> Open WhatsApp
                                    </a>
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
