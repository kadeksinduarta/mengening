import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiAuth, getImageUrl } from '@/utils/api';
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

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await apiAuth.get('/dashboard/blog');
            setBlogs(response.data.data || []);
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            try {
                await apiAuth.delete(`/dashboard/blog/${id}`);
                setBlogs(blogs.filter(b => b.id !== id));
            } catch (err) {
                console.error('Error deleting blog:', err);
                alert('Gagal menghapus artikel.');
            }
        }
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Manajemen Blog">
            <Head>
                <title>Kelola Blog - Pura Mengening</title>
            </Head>

            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="relative flex-1 max-w-lg group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search articles by title..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 focus:border-blue-500 outline-none shadow-sm group-hover:shadow-md transition-all font-bold text-slate-700 placeholder:text-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link
                    href="/admin/blog/create"
                    className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all active:scale-95"
                >
                    <PlusCircle size={20} /> Create New Article
                </Link>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-pulse">
                            <div className="h-60 bg-slate-50"></div>
                            <div className="p-10 space-y-5">
                                <div className="h-4 w-1/4 bg-slate-50 rounded-lg"></div>
                                <div className="h-10 w-full bg-slate-50 rounded-xl"></div>
                                <div className="h-24 w-full bg-slate-50 rounded-[2rem]"></div>
                            </div>
                        </div>
                    ))
                ) : filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 flex flex-col"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={blog.image_url ? getImageUrl(blog.image_url) : '/placeholder-blog.jpg'}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="px-5 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-xl border border-white/50">
                                        {new Date(blog.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="absolute top-6 right-6 flex gap-3">
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-3 bg-white/90 backdrop-blur-md rounded-xl text-slate-400 hover:text-rose-600 transition-all shadow-xl hover:scale-110 active:scale-95 border border-white/50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-10 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <Calendar size={13} className="text-blue-500/60" />
                                        {new Date(blog.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
                                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                        <Clock size={13} />
                                        {new Date(blog.created_at).getHours()}:00
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-5 line-clamp-2 min-h-[4.5rem] group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
                                    {blog.title}
                                </h3>

                                <p className="text-slate-400 text-sm font-bold line-clamp-3 mb-10 leading-relaxed italic opacity-80">
                                    "{blog.content.replace(/<[^>]*>/g, '').substring(0, 140)}..."
                                </p>

                                <div className="mt-auto pt-10 border-t border-dashed border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href={`/blog/${blog.id}`}
                                            target="_blank"
                                            className="px-6 py-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-blue-50"
                                        >
                                            Preview
                                        </Link>
                                        <Link
                                            href={`/admin/blog/edit/${blog.id}`}
                                            className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                        >
                                            Edit Post
                                        </Link>
                                    </div>
                                    <MoreHorizontal size={24} className="text-slate-100" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-8 border border-slate-100 shadow-inner">
                            <FileText size={48} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Your blog is empty</h3>
                        <p className="text-slate-400 font-bold max-w-sm mx-auto mb-12 leading-relaxed">Start creating beautiful and inspiring content about Pura Mengening and the Melukat ritual.</p>
                        <Link
                            href="/admin/blog/create"
                            className="px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/40 hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 flex items-center gap-4"
                        >
                            <PlusCircle size={22} /> Write First Article
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
