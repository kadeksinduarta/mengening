import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, ArrowRight, MoreVertical, Clock } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [data, setData] = useState({
        bookings_count: 0,
        blogs_count: 0,
        recent_bookings: []
    });

    const fetchStats = async () => {
        try {
            setLoading(true);
            const [{ count: bookingsCount }, { count: blogsCount }, { data: recentBookings }] = await Promise.all([
                supabase.from('bookings').select('*', { count: 'exact', head: true }),
                supabase.from('blogs').select('*', { count: 'exact', head: true }),
                supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(3)
            ]);

            setData({
                bookings_count: bookingsCount || 0,
                blogs_count: blogsCount || 0,
                recent_bookings: recentBookings || []
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Jam lokal hanya ada di browser. Dibaca setelah mount, bukan saat
        // render, supaya HTML server dan klien tidak berbeda.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentTime(new Date().toLocaleTimeString('id-ID'));
        fetchStats();
    }, []);


    const stats = [
        { title: 'Total Bookings', value: data.bookings_count, icon: Users, color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
        { title: 'Total Articles', value: data.blogs_count, icon: FileText, color: 'text-rose-600', bgColor: 'bg-rose-600' },
    ];

    return (
        <AdminLayout title="Home">
            <Head>
                <title>Dashboard Admin - Pura Mengening</title>
            </Head>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column: Stats and Activities */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                <Card className="hover:shadow-md hover:border-slate-300 transition-all duration-200 rounded-2xl border-slate-200/80 bg-white">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                                            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                                        </div>
                                        <div className={`${stat.bgColor} p-3.5 rounded-xl text-white shadow-md shadow-current/10 shrink-0`}>
                                            <stat.icon size={22} />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex items-center justify-between">
                                        <Link href={stat.title.includes('Bookings') ? '/admin/booking' : '/admin/blog'} className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-wider">
                                            View details
                                        </Link>
                                        <ArrowRight size={14} className="text-slate-400" />
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Activity Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
                            <p className="text-slate-400 text-xs font-medium">Latest Melukat ritual booking registrations</p>
                        </div>

                        <Card className="rounded-2xl border-slate-200/80 bg-white overflow-hidden">
                            <CardContent className="p-4 space-y-3">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-16 w-full bg-slate-50 animate-pulse rounded-xl"></div>
                                    ))
                                ) : data.recent_bookings.length > 0 ? (
                                    data.recent_bookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100 hover:border-slate-200 rounded-xl group transition-all duration-200">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                                                    {booking.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 text-sm truncate max-w-[150px] sm:max-w-none">
                                                        {booking.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-slate-100 text-slate-600 border-none font-semibold">
                                                            {booking.tipe}
                                                        </Badge>
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            {new Date(booking.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" asChild className="rounded-lg hover:bg-white border hover:border-slate-200 w-8 h-8 shrink-0">
                                                <Link href="/admin/booking">
                                                    <ArrowRight size={14} className="text-slate-500" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                                        No recent bookings yet.
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="justify-center py-3 border-t border-slate-100 bg-slate-50/50">
                                <Button variant="ghost" size="sm" asChild className="text-xs font-semibold text-slate-500 hover:text-blue-600 uppercase tracking-wider">
                                    <Link href="/admin/booking">See all bookings</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Calendar / Widgets */}
                <div className="space-y-6">
                    <Card className="rounded-2xl border-slate-200/80 bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="font-bold text-slate-900 text-base">System Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Database</p>
                                    <p className="text-sm font-bold text-emerald-900 mt-0.5">Connected</p>
                                </div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            </div>
                            <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Server Local Time</p>
                                <p className="text-sm font-bold text-blue-900 mt-0.5">{currentTime || '--:--:--'}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-2xl">
                            <Button asChild className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs py-5" size="lg">
                                <Link href="/admin/blog/create">
                                    <FileText size={16} className="mr-2" /> Write Article
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
