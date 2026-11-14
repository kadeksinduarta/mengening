import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/utils/supabase';
import { formatWhatsAppNumber, parseTanggal, toISODate } from '@/utils/booking';
import { ArrowRight, MessageCircle, Star, RotateCw, PenLine, TriangleAlert } from 'lucide-react';
import { id as idLocale } from 'react-day-picker/locale';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const QUEUE_LIMIT = 5;
const REVIEW_LIMIT = 3;
const FETCH_LIMIT = 1000;

const STATUS_META = {
    pending: { label: 'Menunggu', color: '#f59e0b', badge: 'border-amber-200 bg-amber-50 text-amber-800' },
    confirmed: { label: 'Dikonfirmasi', color: '#155dfc', badge: 'border-blue-200 bg-blue-50 text-blue-800' },
    done: { label: 'Selesai', color: '#009966', badge: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
    cancelled: { label: 'Dibatalkan', color: '#90a1b9', badge: 'border-slate-200 bg-slate-100 text-slate-700' },
};
const STATUS_ORDER = ['pending', 'confirmed', 'done', 'cancelled'];

const STATUS_CHART_CONFIG = Object.fromEntries(
    STATUS_ORDER.map((key) => [key, { label: STATUS_META[key].label, color: STATUS_META[key].color }])
);
const MONTH_CHART_CONFIG = { total: { label: 'Sesi', color: '#155dfc' } };

const ROW_LINK =
    'hover:bg-slate-50 outline-none focus-visible:bg-slate-50 focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-blue-600/40';

// Titik kecil di bawah angka tanggal yang punya sesi.
const SESSION_DOT =
    'relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-blue-600';

const formatTanggal = (value, today) => {
    const date = parseTanggal(value);
    if (!date || Number.isNaN(date.getTime())) return '-';

    const diffDays = Math.round((date - parseTanggal(today)) / 86400000);
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Besok';

    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
};

const statusOf = (booking) => booking.status || 'pending';

function SectionCard({ title, count, href, linkLabel, description, children }) {
    return (
        <Card className="gap-0 py-0">
            <CardHeader className="border-b border-slate-100 py-3">
                <CardTitle className="text-base font-semibold text-slate-900">
                    {title}
                    {count > 0 && (
                        <span className="ml-2 text-sm font-medium text-slate-600 tabular-nums">{count}</span>
                    )}
                </CardTitle>
                {description && <p className="text-sm text-slate-600">{description}</p>}
                {href && (
                    <CardAction>
                        <Button asChild variant="link" size="sm" className="h-11 px-1 text-blue-700">
                            <Link href={href}>
                                {linkLabel}
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </CardAction>
                )}
            </CardHeader>
            <CardContent className="px-0">{children}</CardContent>
        </Card>
    );
}

function SkeletonRows({ count }) {
    return (
        <ul className="divide-y divide-slate-100" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <li key={i} className="h-[72px] space-y-2 px-4 py-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </li>
            ))}
        </ul>
    );
}

function EmptyRow({ children }) {
    return <p className="px-4 py-6 text-sm text-slate-600">{children}</p>;
}

function StatTile({ label, value, caption, loading }) {
    return (
        <Card size="sm" className="gap-1">
            <CardContent className="space-y-1">
                <p className="text-sm text-slate-600">{label}</p>
                {loading ? (
                    <Skeleton className="h-8 w-16" />
                ) : (
                    <p className="text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
                )}
                <p className="text-sm text-slate-600">{caption}</p>
            </CardContent>
        </Card>
    );
}

function BookingRow({ booking, today, showDate = true }) {
    const status = statusOf(booking);
    const meta = STATUS_META[status];

    return (
        <li className="flex items-stretch">
            <Link
                href="/admin/booking"
                className={`flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3 ${ROW_LINK}`}
            >
                <span className="truncate text-sm font-semibold text-slate-900">{booking.name}</span>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                    <span className="tabular-nums">
                        {showDate ? formatTanggal(booking.tanggal, today) : ''}
                        {showDate && booking.jam ? ', ' : ''}
                        {booking.jam || ''}
                    </span>
                    {booking.tipe && <span>· {booking.tipe}</span>}
                    {meta && status !== 'confirmed' && (
                        <Badge variant="outline" className={meta.badge}>
                            {meta.label}
                        </Badge>
                    )}
                </span>
            </Link>
            {booking.phone && (
                <a
                    href={`https://wa.me/${formatWhatsAppNumber(booking.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Chat WhatsApp ${booking.name}`}
                    className={`flex w-14 shrink-0 items-center justify-center border-l border-slate-100 text-slate-600 hover:text-emerald-700 ${ROW_LINK}`}
                >
                    <MessageCircle size={20} aria-hidden="true" />
                </a>
            )}
        </li>
    );
}

function ReviewRow({ review }) {
    return (
        <li>
            <Link href="/admin/review" className={`block px-4 py-3 ${ROW_LINK}`}>
                <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-slate-900">{review.name}</span>
                    <span className="flex shrink-0 items-center gap-1 text-sm text-slate-600 tabular-nums">
                        <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                        <span>
                            {review.rating}
                            <span className="sr-only"> dari 5</span>
                        </span>
                    </span>
                </span>
                <span className="mt-1 line-clamp-2 text-sm text-slate-600">{review.message}</span>
            </Link>
        </li>
    );
}

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [today, setToday] = useState('');
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [bookings, setBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [blogsCount, setBlogsCount] = useState(0);

    const fetchDashboard = async () => {
        try {
            const [bookingsRes, reviewsRes, blogsRes] = await Promise.all([
                supabase
                    .from('bookings')
                    .select('id, name, phone, tipe, tanggal, jam, status')
                    .order('tanggal', { ascending: true })
                    .limit(FETCH_LIMIT),
                supabase
                    .from('reviews')
                    .select('id, name, rating, message, approved')
                    .order('created_at', { ascending: false })
                    .limit(FETCH_LIMIT),
                supabase.from('blogs').select('*', { count: 'exact', head: true }),
            ]);

            const failed = [bookingsRes, reviewsRes, blogsRes].find((result) => result.error);
            if (failed) throw failed.error;

            setBookings(bookingsRes.data || []);
            setReviews(reviewsRes.data || []);
            setBlogsCount(blogsRes.count || 0);
            setError(false);
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Tanggal lokal hanya ada di browser, jadi dibaca setelah mount supaya
        // HTML server dan klien tidak berbeda.
        const now = new Date();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setToday(toISODate(now));
        setSelectedDate(now);
        fetchDashboard();
    }, []);

    const retry = () => {
        setLoading(true);
        fetchDashboard();
    };

    const stats = useMemo(() => {
        const pendingBookings = bookings.filter((b) => statusOf(b) === 'pending');
        const activeBookings = bookings.filter((b) => statusOf(b) !== 'cancelled');
        const pendingReviews = reviews.filter((r) => !r.approved);
        const approvedReviews = reviews.filter((r) => r.approved && r.rating);

        const monthKey = today.slice(0, 7);
        const sessionsThisMonth = activeBookings.filter((b) => (b.tanggal || '').startsWith(monthKey)).length;

        const averageRating = approvedReviews.length
            ? approvedReviews.reduce((sum, r) => sum + Number(r.rating), 0) / approvedReviews.length
            : null;

        const statusData = STATUS_ORDER.map((key) => ({
            status: key,
            count: bookings.filter((b) => statusOf(b) === key).length,
            fill: STATUS_META[key].color,
        })).filter((row) => row.count > 0);

        // Enam bulan: tiga yang lalu, bulan ini, dan dua bulan ke depan.
        const base = today ? parseTanggal(today) : new Date();
        const monthData = Array.from({ length: 6 }, (_, i) => {
            const date = new Date(base.getFullYear(), base.getMonth() - 3 + i, 1);
            const key = toISODate(date).slice(0, 7);
            return {
                label: date.toLocaleDateString('id-ID', { month: 'short' }),
                full: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
                total: activeBookings.filter((b) => (b.tanggal || '').startsWith(key)).length,
            };
        });

        return {
            pendingBookings,
            pendingReviews,
            sessionsThisMonth,
            averageRating,
            approvedReviewsCount: approvedReviews.length,
            statusData,
            monthData,
        };
    }, [bookings, reviews, today]);

    const sessionDates = useMemo(() => {
        const seen = new Set();
        return bookings
            .filter((b) => statusOf(b) !== 'cancelled' && b.tanggal)
            .filter((b) => {
                const key = String(b.tanggal).slice(0, 10);
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            })
            .map((b) => parseTanggal(b.tanggal))
            .filter((date) => date && !Number.isNaN(date.getTime()));
    }, [bookings]);

    const selectedKey = selectedDate ? toISODate(selectedDate) : '';
    const dayAgenda = bookings
        .filter((b) => statusOf(b) !== 'cancelled' && String(b.tanggal || '').slice(0, 10) === selectedKey)
        .sort((a, b) => String(a.jam || '').localeCompare(String(b.jam || '')));

    const statusTotal = stats.statusData.reduce((sum, row) => sum + row.count, 0);
    const queueBookings = stats.pendingBookings.slice(0, QUEUE_LIMIT);
    const queueReviews = stats.pendingReviews.slice(0, REVIEW_LIMIT);

    return (
        <AdminLayout title="Beranda">
            <Head>
                <title>Dashboard Admin - Pura Mengening</title>
            </Head>

            {error && !loading ? (
                <Alert variant="destructive" className="max-w-md">
                    <TriangleAlert aria-hidden="true" />
                    <AlertTitle>Data dashboard belum bisa dimuat.</AlertTitle>
                    <AlertDescription>
                        <p>Periksa koneksi internet, lalu coba lagi.</p>
                        <Button onClick={retry} variant="outline" className="mt-3 h-11 px-4">
                            <RotateCw aria-hidden="true" /> Coba lagi
                        </Button>
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                        <p className="text-sm text-slate-600">
                            <span className="tabular-nums">{loading ? '-' : blogsCount}</span> artikel di blog
                        </p>
                        <Button asChild variant="link" className="h-11 px-1 text-blue-700">
                            <Link href="/admin/blog/create">
                                <PenLine aria-hidden="true" />
                                Tulis artikel baru
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <StatTile
                            label="Total booking"
                            value={bookings.length}
                            caption="sejak awal"
                            loading={loading}
                        />
                        <StatTile
                            label="Menunggu konfirmasi"
                            value={stats.pendingBookings.length}
                            caption="perlu dibalas"
                            loading={loading}
                        />
                        <StatTile
                            label="Sesi bulan ini"
                            value={stats.sessionsThisMonth}
                            caption="tanpa yang dibatalkan"
                            loading={loading}
                        />
                        <StatTile
                            label="Rata-rata rating"
                            value={stats.averageRating === null ? '-' : stats.averageRating.toFixed(1)}
                            caption={`dari ${stats.approvedReviewsCount} ulasan tayang`}
                            loading={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                        <div className="space-y-6 lg:col-span-3">
                            <SectionCard
                                title="Booking menunggu konfirmasi"
                                count={stats.pendingBookings.length}
                                href="/admin/booking"
                                linkLabel="Semua booking"
                            >
                                {loading ? (
                                    <SkeletonRows count={3} />
                                ) : queueBookings.length > 0 ? (
                                    <>
                                        <ul className="divide-y divide-slate-100">
                                            {queueBookings.map((booking) => (
                                                <BookingRow key={booking.id} booking={booking} today={today} />
                                            ))}
                                        </ul>
                                        {stats.pendingBookings.length > QUEUE_LIMIT && (
                                            <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
                                                Dan {stats.pendingBookings.length - QUEUE_LIMIT} booking lain di halaman Booking.
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <EmptyRow>Tidak ada booking yang menunggu. Semua sudah ditangani.</EmptyRow>
                                )}
                            </SectionCard>

                            <SectionCard
                                title="Ulasan menunggu persetujuan"
                                count={stats.pendingReviews.length}
                                href="/admin/review"
                                linkLabel="Semua ulasan"
                            >
                                {loading ? (
                                    <SkeletonRows count={2} />
                                ) : queueReviews.length > 0 ? (
                                    <>
                                        <ul className="divide-y divide-slate-100">
                                            {queueReviews.map((review) => (
                                                <ReviewRow key={review.id} review={review} />
                                            ))}
                                        </ul>
                                        {stats.pendingReviews.length > REVIEW_LIMIT && (
                                            <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
                                                Dan {stats.pendingReviews.length - REVIEW_LIMIT} ulasan lain di halaman Ulasan.
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <EmptyRow>Tidak ada ulasan yang perlu dimoderasi.</EmptyRow>
                                )}
                            </SectionCard>
                        </div>

                        <div className="lg:col-span-2">
                            <SectionCard title="Kalender sesi" description="Titik biru menandai tanggal yang punya sesi.">
                                <div className="px-2 pt-2">
                                    <Calendar
                                        mode="single"
                                        locale={idLocale}
                                        selected={selectedDate}
                                        onSelect={(date) => date && setSelectedDate(date)}
                                        modifiers={{ hasSession: sessionDates }}
                                        modifiersClassNames={{ hasSession: SESSION_DOT }}
                                        className="w-full p-0 [--cell-size:--spacing(10)]"
                                        classNames={{ root: 'w-full' }}
                                    />
                                </div>
                                <div className="mt-2 border-t border-slate-100">
                                    <h3 className="px-4 pt-3 text-sm font-semibold text-slate-900">
                                        {selectedDate
                                            ? selectedDate.toLocaleDateString('id-ID', {
                                                  weekday: 'long',
                                                  day: 'numeric',
                                                  month: 'long',
                                              })
                                            : 'Pilih tanggal'}
                                    </h3>
                                    {loading ? (
                                        <SkeletonRows count={1} />
                                    ) : dayAgenda.length > 0 ? (
                                        <ul className="mt-1 divide-y divide-slate-100">
                                            {dayAgenda.map((booking) => (
                                                <BookingRow
                                                    key={booking.id}
                                                    booking={booking}
                                                    today={today}
                                                    showDate={false}
                                                />
                                            ))}
                                        </ul>
                                    ) : (
                                        <EmptyRow>Tidak ada sesi pada tanggal ini.</EmptyRow>
                                    )}
                                </div>
                            </SectionCard>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                        <div className="lg:col-span-3">
                            <SectionCard title="Sesi per bulan" description="Tiga bulan lalu sampai dua bulan ke depan, tanpa yang dibatalkan.">
                                <div className="px-4 pt-4">
                                    {loading ? (
                                        <Skeleton className="h-56 w-full" />
                                    ) : (
                                        <>
                                            <ChartContainer config={MONTH_CHART_CONFIG} className="h-56 w-full">
                                                <BarChart data={stats.monthData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                                                    <CartesianGrid vertical={false} stroke="#e2e8f0" />
                                                    <XAxis
                                                        dataKey="label"
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tick={{ fill: '#45556c', fontSize: 12 }}
                                                    />
                                                    <YAxis
                                                        allowDecimals={false}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        tick={{ fill: '#45556c', fontSize: 12 }}
                                                    />
                                                    <ChartTooltip
                                                        cursor={{ fill: '#f1f5f9' }}
                                                        content={
                                                            <ChartTooltipContent
                                                                labelFormatter={(_, payload) => payload?.[0]?.payload?.full}
                                                            />
                                                        }
                                                    />
                                                    <Bar
                                                        dataKey="total"
                                                        fill="var(--color-total)"
                                                        radius={[4, 4, 0, 0]}
                                                        maxBarSize={36}
                                                    />
                                                </BarChart>
                                            </ChartContainer>
                                            <table className="sr-only">
                                                <caption>Jumlah sesi per bulan</caption>
                                                <tbody>
                                                    {stats.monthData.map((row) => (
                                                        <tr key={row.full}>
                                                            <th scope="row">{row.full}</th>
                                                            <td>{row.total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                </div>
                            </SectionCard>
                        </div>

                        <div className="lg:col-span-2">
                            <SectionCard title="Status booking" description="Semua booking berdasarkan status.">
                                <div className="px-4 pt-4">
                                    {loading ? (
                                        <Skeleton className="mx-auto size-44 rounded-full" />
                                    ) : statusTotal === 0 ? (
                                        <p className="py-4 text-sm text-slate-600">Belum ada booking.</p>
                                    ) : (
                                        <>
                                            <div className="relative mx-auto h-44 w-44">
                                                <ChartContainer config={STATUS_CHART_CONFIG} className="h-44 w-44 aspect-square">
                                                    <PieChart>
                                                        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
                                                        <Pie
                                                            data={stats.statusData}
                                                            dataKey="count"
                                                            nameKey="status"
                                                            innerRadius={52}
                                                            outerRadius={84}
                                                            paddingAngle={2}
                                                            stroke="#ffffff"
                                                            strokeWidth={2}
                                                        />
                                                    </PieChart>
                                                </ChartContainer>
                                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-semibold text-slate-900 tabular-nums">
                                                        {statusTotal}
                                                    </span>
                                                    <span className="text-sm text-slate-600">booking</span>
                                                </div>
                                            </div>
                                            <ul className="mt-4 space-y-2 pb-4 text-sm">
                                                {stats.statusData.map((row) => (
                                                    <li key={row.status} className="flex items-center gap-2">
                                                        <span
                                                            className="size-3 shrink-0 rounded-sm"
                                                            style={{ backgroundColor: row.fill }}
                                                            aria-hidden="true"
                                                        />
                                                        <span className="text-slate-700">{STATUS_META[row.status].label}</span>
                                                        <span className="ml-auto font-semibold text-slate-900 tabular-nums">
                                                            {row.count}
                                                        </span>
                                                        <span className="w-12 text-right text-slate-600 tabular-nums">
                                                            {Math.round((row.count / statusTotal) * 100)}%
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </SectionCard>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
