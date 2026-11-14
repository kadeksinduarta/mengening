import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase, getImageUrl } from '@/utils/supabase';
import { Plus, Search, FileText, RotateCw, TriangleAlert, Trash2 } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const excerpt = (html) => (html || '').replace(/<[^>]*>/g, '').trim().substring(0, 140);

function Thumbnail({ blog }) {
    return blog.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={getImageUrl(blog.image_url)}
            alt=""
            width={96}
            height={64}
            className="h-16 w-24 shrink-0 rounded-md bg-slate-100 object-cover"
        />
    ) : (
        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <FileText size={20} aria-hidden="true" />
        </div>
    );
}

export default function BlogManagement() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const fetchBlogs = async () => {
        try {
            const { data, error: fetchError } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
            if (fetchError) throw fetchError;
            setBlogs(data || []);
            setError(false);
        } catch (err) {
            console.error('Error fetching blogs:', err);
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
        fetchBlogs();
    }, []);

    const retry = () => {
        setLoading(true);
        fetchBlogs();
    };

    const confirmDelete = async () => {
        if (!pendingDelete || deleting) return;
        const { id } = pendingDelete;

        setDeleting(true);
        setDeleteError('');
        try {
            const { data, error: deleteErr } = await supabase.from('blogs').delete().eq('id', id).select();
            if (deleteErr) throw deleteErr;
            if (!data || data.length === 0) {
                throw new Error('Artikel tidak terhapus. Anda mungkin tidak memiliki izin (RLS) untuk menghapus data ini.');
            }
            setBlogs((prev) => prev.filter((b) => b.id !== id));
        } catch (err) {
            console.error('Error deleting blog:', err);
            setDeleteError(err.message || 'Gagal menghapus artikel.');
        } finally {
            setDeleting(false);
            setPendingDelete(null);
        }
    };

    const query = searchTerm.trim().toLowerCase();
    const filteredBlogs = blogs.filter((b) => !query || (b.title || '').toLowerCase().includes(query));

    return (
        <AdminLayout title="Blog">
            <Head>
                <title>Kelola Blog - Pura Mengening</title>
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
                            aria-label="Cari artikel"
                            placeholder="Cari judul artikel"
                            className="h-11 bg-white pl-9 lg:h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button asChild className="h-11 bg-blue-700 px-4 text-white hover:bg-blue-800 sm:ml-auto lg:h-9">
                        <Link href="/admin/blog/create">
                            <Plus aria-hidden="true" /> Tulis artikel
                        </Link>
                    </Button>
                </div>

                {deleteError && (
                    <Alert variant="destructive" className="max-w-xl">
                        <TriangleAlert aria-hidden="true" />
                        <AlertTitle>Artikel belum terhapus.</AlertTitle>
                        <AlertDescription>
                            <p>{deleteError}</p>
                            <Button variant="outline" onClick={() => setDeleteError('')} className="mt-3 h-11 px-4 lg:h-9">
                                Tutup
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {error && !loading ? (
                    <Alert variant="destructive" className="max-w-md">
                        <TriangleAlert aria-hidden="true" />
                        <AlertTitle>Daftar artikel belum bisa dimuat.</AlertTitle>
                        <AlertDescription>
                            <p>Periksa koneksi internet, lalu coba lagi.</p>
                            <Button onClick={retry} variant="outline" className="mt-3 h-11 px-4">
                                <RotateCw aria-hidden="true" /> Coba lagi
                            </Button>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {!loading && blogs.length > 0 && (
                            <p className="text-sm text-slate-600" aria-live="polite">
                                <span className="tabular-nums">{filteredBlogs.length}</span>
                                {query && (
                                    <>
                                        {' '}dari <span className="tabular-nums">{blogs.length}</span>
                                    </>
                                )}{' '}
                                artikel
                            </p>
                        )}

                        <Card className="gap-0 py-0">
                            {loading ? (
                                <ul className="divide-y divide-slate-100" aria-hidden="true">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i} className="flex gap-4 p-4">
                                            <Skeleton className="h-16 w-24 shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-2/3" />
                                                <Skeleton className="h-3 w-full" />
                                                <Skeleton className="h-3 w-1/3" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : filteredBlogs.length > 0 ? (
                                <ul className="divide-y divide-slate-100">
                                    {filteredBlogs.map((blog) => (
                                        <li key={blog.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:gap-4">
                                            <div className="flex min-w-0 flex-1 gap-4">
                                                <Thumbnail blog={blog} />
                                                <div className="min-w-0 space-y-1">
                                                    <h2 className="line-clamp-2 text-sm font-semibold text-slate-900">{blog.title}</h2>
                                                    <p className="line-clamp-2 text-sm text-slate-600">{excerpt(blog.content)}</p>
                                                    <p className="text-sm text-slate-600 tabular-nums">
                                                        {new Date(blog.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <Button asChild variant="outline" className="h-11 flex-1 px-4 lg:h-9 lg:flex-none">
                                                    <Link href={`/admin/blog/edit/${blog.id}`}>Edit</Link>
                                                </Button>
                                                <Button asChild variant="outline" className="h-11 flex-1 px-4 lg:h-9 lg:flex-none">
                                                    <Link href={`/blog/${blog.id}`} target="_blank">
                                                        Pratinjau<span className="sr-only"> (tab baru)</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setPendingDelete(blog)}
                                                    aria-label={`Hapus artikel ${blog.title}`}
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
                                    {query ? (
                                        <>
                                            <p className="text-sm font-semibold text-slate-900">
                                                Tidak ada artikel yang cocok dengan &ldquo;{searchTerm.trim()}&rdquo;.
                                            </p>
                                            <Button variant="link" onClick={() => setSearchTerm('')} className="mt-1 h-11 text-blue-700">
                                                Hapus pencarian
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold text-slate-900">Belum ada artikel.</p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Artikel yang Anda tulis akan tampil di halaman blog situs.
                                            </p>
                                            <Button asChild className="mt-4 h-11 bg-blue-700 px-4 text-white hover:bg-blue-800">
                                                <Link href="/admin/blog/create">
                                                    <Plus aria-hidden="true" /> Tulis artikel pertama
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </div>

            <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus artikel ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            &ldquo;{pendingDelete?.title}&rdquo; akan dihapus permanen dari blog dan tidak bisa dikembalikan.
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
                            {deleting ? 'Menghapus…' : 'Hapus artikel'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
