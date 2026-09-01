import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Plus, Edit2, Trash2, Star,
    MessageSquareQuote, X, AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;

    return (
        <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onClick={() => onChange(star)}
                    className="p-0.5"
                >
                    <Star
                        className={`w-6 h-6 transition-colors ${star <= display
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-transparent text-slate-300'
                            }`}
                        strokeWidth={1.5}
                    />
                </button>
            ))}
        </div>
    );
}

function StarDisplay({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-200'
                        }`}
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
}

const emptyForm = { name: '', message: '', rating: 0 };

export default function ReviewManagement() {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setReviews(data || []);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (review) => {
        setEditingId(review.id);
        setForm({ name: review.name, message: review.message, rating: review.rating });
        setFormError('');
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.message.trim() || form.rating === 0) {
            setFormError('Nama, pesan, dan rating wajib diisi.');
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
                const { data, error } = await supabase
                    .from('reviews')
                    .update(payload)
                    .eq('id', editingId)
                    .select();
                if (error) throw error;
                if (!data || data.length === 0) {
                    throw new Error('Perubahan tidak tersimpan. Anda mungkin tidak memiliki izin (RLS) untuk mengubah data ini.');
                }
                setReviews((prev) => prev.map((r) => (r.id === editingId ? data[0] : r)));
            } else {
                const { data, error } = await supabase
                    .from('reviews')
                    .insert(payload)
                    .select();
                if (error) throw error;
                if (!data || data.length === 0) {
                    throw new Error('Review tidak tersimpan. Anda mungkin tidak memiliki izin (RLS) untuk menambah data ini.');
                }
                setReviews((prev) => [data[0], ...prev]);
            }

            setShowModal(false);
        } catch (err) {
            console.error('Error saving review:', err);
            setFormError(err.message || 'Gagal menyimpan review.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus review ini?')) return;
        try {
            const { data, error } = await supabase.from('reviews').delete().eq('id', id).select();
            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error('Review tidak terhapus. Anda mungkin tidak memiliki izin (RLS) untuk menghapus data ini.');
            }
            setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('Error deleting review:', err);
            alert(err.message || 'Gagal menghapus review.');
        }
    };

    const filteredReviews = reviews.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const averageRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <AdminLayout title="Reviews">
            <Head>
                <title>Manage Reviews - Pura Mengening</title>
            </Head>

            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                    <Input
                        type="text"
                        placeholder="Search by name or message..."
                        className="pl-9 bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl font-medium text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 px-3.5 h-9 bg-white border border-slate-200 rounded-xl">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{averageRating}</span>
                        <span className="text-xs text-slate-400">avg / {reviews.length} reviews</span>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-1.5 px-4 h-9 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors shrink-0"
                    >
                        <Plus size={16} /> Add Review
                    </button>
                </div>
            </div>

            {/* Reviews Table / Cards */}
            <Card className="rounded-xl border-slate-200/80 overflow-hidden bg-white shadow-sm">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                                <TableHead className="font-bold text-slate-500 text-xs py-4">Reviewer</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs py-4">Rating</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs py-4">Message</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs py-4">Date</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs py-4 text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [1, 2, 3, 4].map((i) => (
                                    <TableRow key={i} className="hover:bg-transparent border-b border-slate-100 animate-pulse">
                                        <TableCell className="py-4"><div className="h-10 w-40 bg-slate-100 rounded-lg"></div></TableCell>
                                        <TableCell className="py-4"><div className="h-5 w-20 bg-slate-100 rounded-lg"></div></TableCell>
                                        <TableCell className="py-4"><div className="h-5 w-64 bg-slate-100 rounded-lg"></div></TableCell>
                                        <TableCell className="py-4"><div className="h-5 w-20 bg-slate-100 rounded-lg"></div></TableCell>
                                        <TableCell className="py-4"><div className="h-9 w-20 ml-auto bg-slate-100 rounded-lg"></div></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredReviews.length > 0 ? (
                                filteredReviews.map((r) => (
                                    <TableRow key={r.id} className="border-b border-slate-100/85 hover:bg-slate-50/40 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                                                    {r.name.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="font-semibold text-slate-800 text-sm">{r.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4"><StarDisplay rating={r.rating} /></TableCell>
                                        <TableCell className="py-4 max-w-xs">
                                            <p className="text-sm text-slate-600 truncate">{r.message}</p>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-xs font-medium text-slate-500">
                                                {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => openEditModal(r)} className="h-8 w-8 hover:bg-slate-100 rounded-lg">
                                                    <Edit2 size={14} className="text-slate-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
                                                <MessageSquareQuote size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">No reviews found</p>
                                                <p className="text-slate-400 text-xs font-medium">Try adjusting your search, or add one manually</p>
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
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-white rounded-xl border border-slate-100 animate-pulse"></div>
                        ))
                    ) : filteredReviews.length > 0 ? (
                        filteredReviews.map((r) => (
                            <div key={r.id} className="bg-white rounded-xl border border-slate-200/60 p-4 space-y-3 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                                        {r.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm truncate">{r.name}</p>
                                        <StarDisplay rating={r.rating} />
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                        {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2">{r.message}</p>
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(r)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 border border-slate-100"><Edit2 size={14} /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="w-8 h-8 rounded-lg bg-slate-50 text-red-500 border border-slate-100"><Trash2 size={14} /></Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center bg-white rounded-xl border border-slate-200/60 shadow-sm">
                            <p className="font-semibold text-slate-400 text-xs">No reviews found</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
                            onClick={closeModal}
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-white rounded-2xl shadow-xl z-[70] overflow-hidden border border-slate-200/80 flex flex-col font-sans"
                        >
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingId ? 'Edit Review' : 'Add Review'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Name</Label>
                                    <Input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Reviewer's name"
                                        className="rounded-xl border-slate-200"
                                        maxLength={80}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Message</Label>
                                    <Textarea
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Review message"
                                        rows={4}
                                        className="rounded-xl border-slate-200 resize-none"
                                        maxLength={600}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rating</Label>
                                    <StarPicker value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
                                </div>

                                {formError && (
                                    <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                                        <AlertCircle size={14} className="shrink-0" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-2.5 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeModal}
                                        className="px-4 font-semibold text-xs rounded-xl border-slate-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 bg-blue-600 hover:bg-blue-500 font-semibold text-xs rounded-xl disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Review'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
