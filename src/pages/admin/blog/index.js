import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase, getImageUrl } from '@/utils/supabase';
import { motion } from 'framer-motion';
import {
    Plus, Search, Edit2, Trash2,
    Eye, FileText, Calendar,
    MoreHorizontal, PlusCircle, Clock
} from 'lucide-react';

export default function BlogManagement() {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBlogs = async () => {
        try {
            const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setBlogs(data || []);
        } catch (err) {
            console.error('Error fetching blogs:', err);
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


    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            try {
                const { data, error } = await supabase.from('blogs').delete().eq('id', id).select();
                if (error) throw error;
                if (!data || data.length === 0) {
                    throw new Error('Artikel tidak terhapus. Anda mungkin tidak memiliki izin (RLS) untuk menghapus data ini.');
                }
                setBlogs(blogs.filter(b => b.id !== id));
            } catch (err) {
                console.error('Error deleting blog:', err);
                alert(err.message || 'Gagal menghapus artikel.');
            }
        }
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Blog Posts">
            <Head>
                <title>Manage Blog - Pura Mengening</title>
            </Head>

            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
                    <input
                        type="text"
                        placeholder="Search articles by title..."
                        className="flex h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 focus-visible:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50 font-medium text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link
                    href="/admin/blog/create"
                    className="inline-flex items-center justify-center gap-1.5 px-4 h-9 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors shrink-0"
                >
                    <Plus size={16} /> Create Article
                </Link>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden animate-pulse">
                            <div className="h-48 bg-slate-100"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                                <div className="h-6 w-full bg-slate-100 rounded"></div>
                                <div className="h-12 w-full bg-slate-100 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col"
                        >
                            <div className="relative h-48 overflow-hidden bg-slate-50 shrink-0">
                                <img
                                    src={blog.image_url ? getImageUrl(blog.image_url) : '/placeholder-blog.jpg'}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-slate-700 shadow-sm border border-slate-200/50">
                                        {new Date(blog.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-2 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-600 backdrop-blur-md rounded-lg transition-all shadow-sm border border-slate-200/50"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={11} />
                                            {new Date(blog.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>

                                    <h4 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                                        {blog.title}
                                    </h4>

                                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                                        {blog.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/blog/${blog.id}`}
                                            target="_blank"
                                            className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg text-[11px] font-semibold transition-colors border border-slate-200/60"
                                        >
                                            Preview
                                        </Link>
                                        <Link
                                            href={`/admin/blog/edit/${blog.id}`}
                                            className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold transition-colors shadow-sm"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="lg:hidden p-2 text-slate-400 hover:text-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center p-6">
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-inner">
                            <FileText size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-1">Your blog is empty</h4>
                        <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto mb-6">Start creating beautiful and inspiring content about Pura Mengening and the Melukat ritual.</p>
                        <Link
                            href="/admin/blog/create"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                        >
                            <Plus size={16} /> Write First Article
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
