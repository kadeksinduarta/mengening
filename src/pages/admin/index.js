import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, ArrowRight, MoreVertical, Clock } from 'lucide-react';
import Link from 'next/link';
import { apiAuth } from '@/utils/api';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [data, setData] = useState({
        bookings_count: 0,
        blogs_count: 0,
        recent_bookings: []
    });

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString('id-ID'));
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await apiAuth.get('/dashboard/stats');
            setData(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { title: 'Total Bookings', value: data.bookings_count, icon: Users, color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
        { title: 'Total Articles', value: data.blogs_count, icon: FileText, color: 'text-rose-600', bgColor: 'bg-rose-600' },
    ];

    return (
        <AdminLayout title="Home">
            <Head>
                <title>Dashboard Admin - Pura Mengening</title>
            </Head>

            <div className="flex flex-col xl:flex-row gap-10">
                {/* Left Column: Stats and Activities */}
                <div className="flex-1 space-y-12">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                            >
                                <div className="flex items-start gap-6 mb-10">
                                    <div className={`${stat.bgColor} p-4 rounded-2xl text-white shadow-lg shadow-current/20`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                                    </div>
                                </div>
                                <div className="mt-auto pt-6 border-t border-dashed border-slate-100 flex items-center justify-between">
                                    <Link href={stat.title.includes('Bookings') ? '/admin/booking' : '/admin/blog'} className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                                        View details
                                    </Link>
                                    <ArrowRight size={18} className="text-slate-300" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Activity Section */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-1">Recent Bookings</h2>
                            <p className="text-slate-400 text-sm font-bold">Latest ritual booking registrations</p>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-4">
                            <div className="space-y-4">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-24 w-full bg-slate-50 animate-pulse rounded-[2rem]"></div>
                                    ))
                                ) : data.recent_bookings.length > 0 ? (
                                    data.recent_bookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-5 lg:p-7 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] lg:rounded-[2rem] group hover:bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-500">
                                            <div className="flex items-center gap-4 lg:gap-6">
                                                <div className="w-10 h-10 lg:w-16 lg:h-16 bg-blue-100 rounded-xl lg:rounded-2xl flex items-center justify-center text-blue-600 text-base lg:text-2xl font-black shrink-0">
                                                    {booking.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-900 text-sm lg:text-lg truncate max-w-[140px] lg:max-w-none">
                                                        {booking.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                                                        <span className="w-1 h-1 bg-blue-400 rounded-full shrink-0"></span>
                                                        <span className="truncate">{booking.tipe}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <Link href="/admin/booking" className="p-2.5 lg:p-3 text-slate-300 hover:text-blue-600 transition-colors bg-white border border-slate-100 rounded-xl shadow-sm shrink-0">
                                                <ArrowRight size={18} className="lg:w-5 lg:h-5" />
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-slate-400 font-bold">
                                        No recent bookings yet.
                                    </div>
                                )}
                            </div>
                            <div className="p-8 text-center border-t border-slate-50 mt-4">
                                <Link href="/admin/booking" className="text-sm font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                                    See all bookings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Calendar Widget */}
                <div className="w-full xl:w-96">
                    <div className="bg-white p-9 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-8">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-black text-slate-900 text-xl tracking-tight">System Status</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Backend API</p>
                                <p className="text-lg font-black text-emerald-900">Connected</p>
                            </div>
                            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Last Update</p>
                                <p className="text-lg font-black text-blue-900">{currentTime || '--:--:--'}</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-dashed border-slate-100">
                            <Link
                                href="/admin/blog/create"
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-black shadow-xl transition-all"
                            >
                                <FileText size={18} /> Quick Article
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
