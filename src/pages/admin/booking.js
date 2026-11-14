import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase, getPaymentProofUrl } from '@/utils/supabase';
import { formatWhatsAppNumber, parseTanggal } from '@/utils/booking';
import { Search, MessageCircle, RotateCw, TriangleAlert, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

const STATUSES = {
    pending:   { label: 'Menunggu',     className: 'border-amber-200 bg-amber-50 text-amber-800' },
    confirmed: { label: 'Dikonfirmasi', className: 'border-blue-200 bg-blue-50 text-blue-800' },
    done:      { label: 'Selesai',      className: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
    cancelled: { label: 'Dibatalkan',   className: 'border-slate-200 bg-slate-100 text-slate-700' },
};

const STATUS_ORDER = ['pending', 'confirmed', 'done', 'cancelled'];

const statusOf = (booking) => booking.status || 'pending';

const formatTanggal = (value, options) => {
    const date = parseTanggal(value);
    if (!date || Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', options);
};

const SHORT_DATE = { day: 'numeric', month: 'short', year: 'numeric' };
const LONG_DATE = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

function StatusSelect({ booking, onChange, saving, className = '' }) {
    const status = statusOf(booking);

    return (
        <Select value={status} onValueChange={(value) => onChange(booking.id, value)} disabled={saving}>
            <SelectTrigger
                aria-label={`Status booking ${booking.name}`}
                className={`h-11 min-w-36 font-medium lg:h-9 ${STATUSES[status].className} ${className}`}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
                {STATUS_ORDER.map((key) => (
                    <SelectItem key={key} value={key}>{STATUSES[key].label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function WhatsAppButton({ booking, className = '' }) {
    return (
        <Button
            asChild
            variant="outline"
            size="icon"
            className={`size-11 text-emerald-700 hover:text-emerald-800 lg:size-9 ${className}`}
        >
            <a
                href={`https://wa.me/${formatWhatsAppNumber(booking.phone)}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Chat WhatsApp ${booking.name}`}
            >
                <MessageCircle aria-hidden="true" />
            </a>
        </Button>
    );
}

function DetailItem({ label, children }) {
    return (
        <div className="space-y-0.5">
            <dt className="text-sm text-slate-600">{label}</dt>
            <dd className="text-sm font-medium text-slate-900">{children}</dd>
        </div>
    );
}

export default function BookingManagement() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [savingId, setSavingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    // Disimpan bersama id booking-nya supaya signed URL milik booking sebelumnya
    // tidak pernah sempat tampil di detail booking yang baru dibuka.
    const [proof, setProof] = useState({ id: null, url: null });

    const fetchBookings = async () => {
        try {
            const { data, error: fetchError } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setBookings(data || []);
            setError(false);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Mengambil data saat mount memang pola yang benar untuk halaman admin
        // ini: sesinya hidup di klien, jadi tidak bisa dipindah ke
        // getServerSideProps. setState-nya terjadi setelah await, bukan
        // sinkron, sehingga kekhawatiran render beruntun tidak berlaku.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBookings();
    }, []);

    // Tombol Muat ulang butuh indikator loading; muat pertama tidak, karena
    // state loading memang sudah bernilai true sejak awal.
    const refreshBookings = () => {
        setLoading(true);
        fetchBookings();
    };

    // Signed URL hanya berumur 60 detik, jadi dibuat ulang setiap detail booking dibuka.
    useEffect(() => {
        let cancelled = false;
        const filePath = selectedBooking?.bukti_transfer;
        if (!filePath) return;

        getPaymentProofUrl(filePath).then((url) => {
            if (!cancelled) setProof({ id: selectedBooking.id, url });
        });

        return () => { cancelled = true; };
    }, [selectedBooking]);

    const proofUrl = proof.id === selectedBooking?.id ? proof.url : null;

    const updateStatus = async (id, status) => {
        const previous = bookings;
        // Diperbarui optimistis supaya pilihan tidak terasa menggantung,
        // lalu dikembalikan kalau servernya menolak.
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        setSavingId(id);

        const { error: updateError } = await supabase.from('bookings').update({ status }).eq('id', id);

        setSavingId(null);
        if (updateError) {
            console.error('Gagal mengubah status booking:', updateError.message, updateError.code);
            setBookings(previous);
            alert('Gagal mengubah status. Coba lagi.');
            return;
        }

        setSelectedBooking((current) =>
            current && current.id === id ? { ...current, status } : current
        );
    };

    const query = searchTerm.trim().toLowerCase();
    const filteredBookings = bookings.filter((b) =>
        (statusFilter === 'all' || statusOf(b) === statusFilter) &&
        (!query ||
            (b.name || '').toLowerCase().includes(query) ||
            (b.email || '').toLowerCase().includes(query) ||
            (b.phone || '').includes(query))
    );

    const hasFilter = query !== '' || statusFilter !== 'all';
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
    };

    const openDetail = (booking) => {
        setSelectedBooking(booking);
        setShowDetail(true);
    };

    return (
        <AdminLayout title="Booking">
            <Head>
                <title>Kelola Booking - Pura Mengening</title>
            </Head>

            <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1 sm:max-w-md">
                        <Search
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <Input
                            type="search"
                            aria-label="Cari booking"
                            placeholder="Cari nama, email, atau telepon"
                            className="h-11 bg-white pl-9 lg:h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger aria-label="Filter status" className="h-11 flex-1 bg-white sm:min-w-44 sm:flex-none lg:h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="all">Semua status</SelectItem>
                                {STATUS_ORDER.map((key) => (
                                    <SelectItem key={key} value={key}>{STATUSES[key].label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={refreshBookings}
                            disabled={loading}
                            className="h-11 bg-white px-3 lg:h-9"
                        >
                            <RotateCw className={loading ? 'animate-spin' : ''} aria-hidden="true" />
                            Muat ulang
                        </Button>
                    </div>
                </div>

                {error && !loading ? (
                    <Alert variant="destructive" className="max-w-md">
                        <TriangleAlert aria-hidden="true" />
                        <AlertTitle>Daftar booking belum bisa dimuat.</AlertTitle>
                        <AlertDescription>
                            <p>Periksa koneksi internet, lalu coba lagi.</p>
                            <Button onClick={refreshBookings} variant="outline" className="mt-3 h-11 px-4">
                                <RotateCw aria-hidden="true" /> Coba lagi
                            </Button>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {!loading && (
                            <p className="text-sm text-slate-600" aria-live="polite">
                                <span className="tabular-nums">{filteredBookings.length}</span>
                                {hasFilter && (
                                    <>
                                        {' '}dari <span className="tabular-nums">{bookings.length}</span>
                                    </>
                                )}{' '}
                                booking
                            </p>
                        )}

                        <Card className="gap-0 py-0">
                            {/* Tampilan tabel (desktop) */}
                            <div className="hidden overflow-x-auto lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="h-11 px-4 text-slate-700">Tamu</TableHead>
                                            <TableHead className="h-11 text-slate-700">Jadwal</TableHead>
                                            <TableHead className="h-11 text-slate-700">Tipe</TableHead>
                                            <TableHead className="h-11 text-slate-700">Pembayaran</TableHead>
                                            <TableHead className="h-11 text-slate-700">Status</TableHead>
                                            <TableHead className="h-11 px-4 text-right text-slate-700">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            [1, 2, 3, 4].map((i) => (
                                                <TableRow key={i} className="hover:bg-transparent" aria-hidden="true">
                                                    <TableCell className="px-4 py-3"><Skeleton className="h-9 w-44" /></TableCell>
                                                    <TableCell className="py-3"><Skeleton className="h-9 w-28" /></TableCell>
                                                    <TableCell className="py-3"><Skeleton className="h-5 w-20" /></TableCell>
                                                    <TableCell className="py-3"><Skeleton className="h-5 w-20" /></TableCell>
                                                    <TableCell className="py-3"><Skeleton className="h-9 w-36" /></TableCell>
                                                    <TableCell className="px-4 py-3"><Skeleton className="ml-auto h-9 w-28" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredBookings.length > 0 ? (
                                            filteredBookings.map((b) => (
                                                <TableRow key={b.id}>
                                                    <TableCell className="px-4 py-3">
                                                        <p className="text-sm font-semibold text-slate-900">{b.name}</p>
                                                        <p className="max-w-[220px] truncate text-sm text-slate-600">{b.email}</p>
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <p className="text-sm font-medium text-slate-900">{formatTanggal(b.tanggal, SHORT_DATE)}</p>
                                                        <p className="text-sm text-slate-600 tabular-nums">{b.jam}</p>
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <Badge variant="outline" className="text-slate-700">{b.tipe}</Badge>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-sm text-slate-700">{b.payment_method}</TableCell>
                                                    <TableCell className="py-3">
                                                        <StatusSelect booking={b} onChange={updateStatus} saving={savingId === b.id} />
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="outline" onClick={() => openDetail(b)} className="h-9 px-3">
                                                                Detail
                                                            </Button>
                                                            <WhatsAppButton booking={b} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell colSpan={6} className="py-14 text-center">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {hasFilter ? 'Tidak ada booking yang cocok.' : 'Belum ada booking.'}
                                                    </p>
                                                    {hasFilter && (
                                                        <Button variant="link" onClick={clearFilters} className="mt-1 text-blue-700">
                                                            Hapus pencarian dan filter
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Tampilan daftar (ponsel dan tablet) */}
                            <div className="lg:hidden">
                                {loading ? (
                                    <ul className="divide-y divide-slate-100" aria-hidden="true">
                                        {[1, 2, 3].map((i) => (
                                            <li key={i} className="space-y-3 px-4 py-4">
                                                <Skeleton className="h-4 w-1/2" />
                                                <Skeleton className="h-3 w-2/3" />
                                                <Skeleton className="h-11 w-full" />
                                            </li>
                                        ))}
                                    </ul>
                                ) : filteredBookings.length > 0 ? (
                                    <ul className="divide-y divide-slate-100">
                                        {filteredBookings.map((b) => (
                                            <li key={b.id} className="space-y-3 px-4 py-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900">{b.name}</p>
                                                        <p className="text-sm text-slate-600 tabular-nums">
                                                            {formatTanggal(b.tanggal, SHORT_DATE)}, {b.jam}
                                                        </p>
                                                        <p className="text-sm text-slate-600">{b.payment_method}</p>
                                                    </div>
                                                    <Badge variant="outline" className="shrink-0 text-slate-700">{b.tipe}</Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <StatusSelect
                                                        booking={b}
                                                        onChange={updateStatus}
                                                        saving={savingId === b.id}
                                                        className="flex-1"
                                                    />
                                                    <Button variant="outline" onClick={() => openDetail(b)} className="h-11 px-4">
                                                        Detail
                                                    </Button>
                                                    <WhatsAppButton booking={b} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="px-4 py-12 text-center">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {hasFilter ? 'Tidak ada booking yang cocok.' : 'Belum ada booking.'}
                                        </p>
                                        {hasFilter && (
                                            <Button variant="link" onClick={clearFilters} className="mt-1 h-11 text-blue-700">
                                                Hapus pencarian dan filter
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </>
                )}
            </div>

            {/* Detail booking */}
            <Sheet open={showDetail} onOpenChange={setShowDetail}>
                <SheetContent side="right" className="w-full gap-0 sm:max-w-lg">
                    {selectedBooking && (
                        <>
                            <SheetHeader className="border-b border-slate-100 p-4">
                                <SheetTitle className="text-lg font-semibold text-slate-900">{selectedBooking.name}</SheetTitle>
                                <SheetDescription className="text-slate-600">{selectedBooking.email}</SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-900">Status</p>
                                    <StatusSelect
                                        booking={selectedBooking}
                                        onChange={updateStatus}
                                        saving={savingId === selectedBooking.id}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-slate-600">
                                        Mengubah status tidak menghapus data tamu.
                                    </p>
                                </div>

                                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <DetailItem label="Telepon / WhatsApp">{selectedBooking.phone}</DetailItem>
                                    <DetailItem label="Alamat asal">{selectedBooking.alamat || '-'}</DetailItem>
                                    <DetailItem label="Jadwal">
                                        {formatTanggal(selectedBooking.tanggal, LONG_DATE)}
                                        {selectedBooking.jam && (
                                            <span className="tabular-nums">, pukul {selectedBooking.jam}</span>
                                        )}
                                    </DetailItem>
                                    <DetailItem label="Tipe dan pembayaran">
                                        {selectedBooking.tipe}, {selectedBooking.payment_method}
                                    </DetailItem>
                                </dl>

                                {selectedBooking.catatan && (
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-slate-900">Catatan tamu</p>
                                        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                                            {selectedBooking.catatan}
                                        </p>
                                    </div>
                                )}

                                {selectedBooking.bukti_transfer && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-slate-900">Bukti transfer</p>
                                        {proofUrl ? (
                                            <a
                                                href={proofUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-slate-50 outline-none focus-visible:ring-3 focus-visible:ring-blue-600/40"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={proofUrl}
                                                    alt="Bukti transfer, buka di tab baru"
                                                    className="h-auto max-h-56 w-full object-contain"
                                                />
                                            </a>
                                        ) : (
                                            <p className="flex h-20 max-w-xs items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600">
                                                <FileText size={16} aria-hidden="true" /> Memuat bukti transfer
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <SheetFooter className="border-t border-slate-100 p-4">
                                <Button asChild className="h-11 w-full bg-emerald-700 text-white hover:bg-emerald-800">
                                    <a
                                        href={`https://wa.me/${formatWhatsAppNumber(selectedBooking.phone)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MessageCircle aria-hidden="true" /> Buka WhatsApp
                                    </a>
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </AdminLayout>
    );
}
