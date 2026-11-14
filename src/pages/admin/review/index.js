import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/utils/supabase';
import { Search, Plus, Pencil, Trash2, Star, Check, EyeOff, RotateCw, TriangleAlert } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const NAME_MAX = 80;
const MESSAGE_MAX = 600;

function StarPicker({ value, onChange }) {
    return (
        <div role="group" aria-label="Rating" className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    aria-pressed={star === value}
                    aria-label={`${star} bintang`}
                    className="flex size-11 items-center justify-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-blue-600/40"
                >
                    <Star
                        className={`size-7 ${star <= value ? 'fill-amber-400 text-amber-500' : 'fill-transparent text-slate-400'}`}
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                </button>
            ))}
        </div>
    );
}

function StarDisplay({ rating }) {
    return (
        <span className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    className={star <= rating ? 'fill-amber-400 text-amber-500' : 'fill-transparent text-slate-300'}
                    strokeWidth={1.5}
                    aria-hidden="true"
                />
            ))}
            <span className="sr-only">{rating} dari 5 bintang</span>
        </span>
    );
}

const emptyForm = { name: '', message: '', rating: 0 };

export default function ReviewManagement() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingOnly, setPendingOnly] = useState(false);
    const [savingId, setSavingId] = useState(null);
    const [actionError, setActionError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchReviews = async () => {
        try {
            const { data, error: fetchError } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setReviews(data || []);
            setError(false);
        } catch (err) {
            console.error('Error fetching reviews:', err);
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
        fetchReviews();
    }, []);

    const retry = () => {
        setLoading(true);
        fetchReviews();
    };

    const openCreateForm = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError('');
        setShowForm(true);
    };

    const openEditForm = (review) => {
        setEditingId(review.id);
        setForm({ name: review.name || '', message: review.message || '', rating: review.rating || 0 });
        setFormError('');
        setShowForm(true);
    };

    const handleFormOpenChange = (open) => {
        if (!open && saving) return;
        setShowForm(open);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        if (!form.name.trim() || !form.message.trim() || form.rating === 0) {
            setFormError('Nama, ulasan, dan rating wajib diisi.');
            return;
        }
        setFormError('');
        setSaving(true);

        try {
            const payload = {
                name: form.name.trim(),
                message: form.message.trim(),
                rating: form.rating,
            };

            if (editingId) {
                const { data, error: updateError } = await supabase
                    .from('reviews')
                    .update(payload)
                    .eq('id', editingId)
                    .select();
                if (updateError) throw updateError;
                if (!data || data.length === 0) {
                    throw new Error('Perubahan tidak tersimpan. Anda mungkin tidak memiliki izin (RLS) untuk mengubah data ini.');
                }
                setReviews((prev) => prev.map((r) => (r.id === editingId ? data[0] : r)));
            } else {
                const { data, error: insertError } = await supabase
                    .from('reviews')
                    .insert(payload)
                    .select();
                if (insertError) throw insertError;
                if (!data || data.length === 0) {
                    throw new Error('Ulasan tidak tersimpan. Anda mungkin tidak memiliki izin (RLS) untuk menambah data ini.');
                }
                setReviews((prev) => [data[0], ...prev]);
            }

            setShowForm(false);
        } catch (err) {
            console.error('Error saving review:', err);
            setFormError(err.message || 'Gagal menyimpan ulasan.');
        } finally {
            setSaving(false);
        }
    };

    const setApproved = async (id, approved) => {
        const previous = reviews;
        setActionError('');
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)));
        setSavingId(id);

        const { error: updateError } = await supabase.from('reviews').update({ approved }).eq('id', id);

        setSavingId(null);
        if (updateError) {
            console.error('Gagal mengubah status review:', updateError.message, updateError.code);
            setReviews(previous);
            setActionError('Gagal mengubah status ulasan. Coba lagi.');
        }
    };

    const confirmDelete = async () => {
        if (!pendingDelete || deleting) return;
        const { id } = pendingDelete;

        setDeleting(true);
        setActionError('');
        try {
            const { data, error: deleteError } = await supabase.from('reviews').delete().eq('id', id).select();
            if (deleteError) throw deleteError;
            if (!data || data.length === 0) {
                throw new Error('Ulasan tidak terhapus. Anda mungkin tidak memiliki izin (RLS) untuk menghapus data ini.');
            }
            setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('Error deleting review:', err);
            setActionError(err.message || 'Gagal menghapus ulasan.');
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    const pendingCount = reviews.filter((r) => !r.approved).length;

    const query = searchTerm.trim().toLowerCase();
    const filteredReviews = reviews.filter((r) =>
        (!pendingOnly || !r.approved) &&
        (!query ||
            (r.name || '').toLowerCase().includes(query) ||
            (r.message || '').toLowerCase().includes(query))
    );

    const averageRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length)
            .toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
        : null;

    const hasFilter = query !== '' || pendingOnly;
    const clearFilters = () => {
        setSearchTerm('');
        setPendingOnly(false);
    };

    return (
        <AdminLayout title="Ulasan">
            <Head>
                <title>Kelola Ulasan - Pura Mengening</title>
            </Head>

            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1 sm:max-w-md">
                        <Search
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <Input
                            type="search"
                            aria-label="Cari ulasan"
                            placeholder="Cari nama atau isi ulasan"
                            className="h-11 bg-white pl-9 lg:h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                        <Button
                            variant={pendingOnly ? 'default' : 'outline'}
                            aria-pressed={pendingOnly}
                            onClick={() => setPendingOnly((v) => !v)}
                            className={`h-11 flex-1 px-3 sm:flex-none lg:h-9 ${pendingOnly ? '' : 'bg-white'}`}
                        >
                            Menunggu
                            <span className="tabular-nums">{loading ? '' : pendingCount}</span>
                        </Button>
                        <Button onClick={openCreateForm} className="h-11 flex-1 bg-blue-700 px-4 text-white hover:bg-blue-800 sm:flex-none lg:h-9">
                            <Plus aria-hidden="true" /> Tambah ulasan
                        </Button>
                    </div>
                </div>

                {actionError && (
                    <Alert variant="destructive" className="max-w-xl">
                        <TriangleAlert aria-hidden="true" />
                        <AlertTitle>Perubahan belum berhasil.</AlertTitle>
                        <AlertDescription>
                            <p>{actionError}</p>
                            <Button variant="outline" onClick={() => setActionError('')} className="mt-3 h-11 px-4 lg:h-9">
                                Tutup
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {error && !loading ? (
                    <Alert variant="destructive" className="max-w-md">
                        <TriangleAlert aria-hidden="true" />
                        <AlertTitle>Daftar ulasan belum bisa dimuat.</AlertTitle>
                        <AlertDescription>
                            <p>Periksa koneksi internet, lalu coba lagi.</p>
                            <Button onClick={retry} variant="outline" className="mt-3 h-11 px-4">
                                <RotateCw aria-hidden="true" /> Coba lagi
                            </Button>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {!loading && reviews.length > 0 && (
                            <p className="text-sm text-slate-600" aria-live="polite">
                                <span className="tabular-nums">{filteredReviews.length}</span>
                                {hasFilter && (
                                    <>
                                        {' '}dari <span className="tabular-nums">{reviews.length}</span>
                                    </>
                                )}{' '}
                                ulasan
                                {averageRating && (
                                    <>
                                        , rata-rata <span className="tabular-nums">{averageRating}</span> bintang
                                    </>
                                )}
                            </p>
                        )}

                        <Card className="gap-0 py-0">
                            {loading ? (
                                <ul className="divide-y divide-slate-100" aria-hidden="true">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i} className="space-y-3 p-4">
                                            <Skeleton className="h-4 w-1/3" />
                                            <Skeleton className="h-3 w-full" />
                                            <Skeleton className="h-3 w-2/3" />
                                        </li>
                                    ))}
                                </ul>
                            ) : filteredReviews.length > 0 ? (
                                <ul className="divide-y divide-slate-100">
                                    {filteredReviews.map((r) => (
                                        <li key={r.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:gap-6">
                                            <div className="min-w-0 flex-1 space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                    <h2 className="truncate text-sm font-semibold text-slate-900">{r.name}</h2>
                                                    <StarDisplay rating={r.rating} />
                                                    <span className="text-sm text-slate-600 tabular-nums">
                                                        {new Date(r.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                    {r.approved ? (
                                                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
                                                            Tayang
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                                                            Menunggu
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="line-clamp-3 break-words text-sm text-slate-700">{r.message}</p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                {r.approved ? (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setApproved(r.id, false)}
                                                        disabled={savingId === r.id}
                                                        className="h-11 flex-1 px-3 lg:h-9 lg:flex-none"
                                                    >
                                                        <EyeOff aria-hidden="true" /> Sembunyikan
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() => setApproved(r.id, true)}
                                                        disabled={savingId === r.id}
                                                        className="h-11 flex-1 bg-emerald-700 px-3 text-white hover:bg-emerald-800 lg:h-9 lg:flex-none"
                                                    >
                                                        <Check aria-hidden="true" /> Setujui
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => openEditForm(r)}
                                                    aria-label={`Edit ulasan dari ${r.name}`}
                                                    className="size-11 lg:size-9"
                                                >
                                                    <Pencil aria-hidden="true" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setPendingDelete(r)}
                                                    aria-label={`Hapus ulasan dari ${r.name}`}
                                                    className="size-11 text-red-700 hover:bg-red-50 hover:text-red-800 lg:size-9"
                                                >
                                                    <Trash2 aria-hidden="true" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="px-4 py-14 text-center">
                                    {reviews.length === 0 ? (
                                        <>
                                            <p className="text-sm font-semibold text-slate-900">Belum ada ulasan.</p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Ulasan dari tamu muncul di sini untuk dimoderasi. Anda juga bisa menambahkannya sendiri.
                                            </p>
                                            <Button onClick={openCreateForm} className="mt-4 h-11 bg-blue-700 px-4 text-white hover:bg-blue-800">
                                                <Plus aria-hidden="true" /> Tambah ulasan
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {query
                                                    ? 'Tidak ada ulasan yang cocok.'
                                                    : 'Tidak ada ulasan yang menunggu. Semua sudah dimoderasi.'}
                                            </p>
                                            <Button variant="link" onClick={clearFilters} className="mt-1 h-11 text-blue-700">
                                                Hapus pencarian dan filter
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </div>

            {/* Tambah / ubah ulasan */}
            <Sheet open={showForm} onOpenChange={handleFormOpenChange}>
                <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
                    <SheetHeader className="border-b border-slate-100 p-4">
                        <SheetTitle className="text-lg font-semibold text-slate-900">
                            {editingId ? 'Ubah ulasan' : 'Tambah ulasan'}
                        </SheetTitle>
                        <SheetDescription className="text-slate-600">
                            {editingId
                                ? 'Perubahan langsung tampil bila ulasan sudah tayang.'
                                : 'Ulasan baru menunggu persetujuan sebelum tampil di situs.'}
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                        <div className="flex-1 space-y-5 overflow-y-auto p-4">
                            <div className="space-y-2">
                                <Label htmlFor="review-name" className="text-sm font-medium text-slate-900">Nama</Label>
                                <Input
                                    id="review-name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    maxLength={NAME_MAX}
                                    autoComplete="off"
                                    className="h-11 lg:h-9"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="review-message" className="text-sm font-medium text-slate-900">Isi ulasan</Label>
                                <Textarea
                                    id="review-message"
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    rows={5}
                                    maxLength={MESSAGE_MAX}
                                    className="resize-none"
                                />
                                <p className="text-right text-sm text-slate-600 tabular-nums">
                                    {form.message.length}/{MESSAGE_MAX}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-900">Rating</p>
                                <StarPicker value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
                            </div>

                            {formError && (
                                <Alert variant="destructive">
                                    <TriangleAlert aria-hidden="true" />
                                    <AlertTitle>{formError}</AlertTitle>
                                </Alert>
                            )}
                        </div>

                        <SheetFooter className="flex-row justify-end gap-2 border-t border-slate-100 p-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleFormOpenChange(false)}
                                disabled={saving}
                                className="h-11 px-4"
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={saving} className="h-11 bg-blue-700 px-4 text-white hover:bg-blue-800">
                                {saving ? 'Menyimpan…' : editingId ? 'Simpan perubahan' : 'Tambah ulasan'}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Konfirmasi hapus */}
            <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus ulasan ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ulasan dari {pendingDelete?.name} akan dihapus permanen dan tidak bisa dikembalikan.
                            Bila hanya ingin menyembunyikannya dari situs, pilih Sembunyikan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting} className="h-11 lg:h-9">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={(e) => {
                                e.preventDefault();
                                confirmDelete();
                            }}
                            disabled={deleting}
                            className="h-11 lg:h-9"
                        >
                            {deleting ? 'Menghapus…' : 'Hapus ulasan'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
