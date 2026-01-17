import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { api, getImageUrl } from '@/utils/api';

export default function BlogDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [blog, setBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (id) {
            window.scrollTo(0, 0);
            fetchBlogDetail();
            fetchAllBlogs();
        }
    }, [id]);

    const fetchBlogDetail = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/blog/${id}`);
            const data = res.data.data || res.data;
            if (data) {
                setBlog({
                    ...data,
                    image_url: getImageUrl(data.image_url),
                });
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setMessage('Gagal memuat data blog');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllBlogs = async () => {
        try {
            const res = await api.get(`/blog`);
            const list = res.data.data || [];
            const formatted = list.map((b) => ({
                ...b,
                image_url: getImageUrl(b.image_url),
            }));
            setBlogs(formatted);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800">Artikel tidak ditemukan</h2>
                <button onClick={() => router.push('/blog')} className="mt-4 text-blue-600 hover:underline">
                    Kembali ke Daftar Artikel
                </button>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={blog.title}
                description={blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 160)}
                keywords={`Pura Mengening, ${blog.title}, wisata Bali, budaya Bali, Tasya Melukat`}
                image={blog.image_url}
                type="article"
            />

            <div className="min-h-screen bg-slate-50 font-sans">
                <Navbar />

                {/* Hero Header */}
                <div className="bg-slate-900 text-white min-h-[40vh] relative flex items-end">
                    <div className="absolute inset-0 w-full h-full">
                        {blog.image_url && (
                            <>
                                <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover opacity-30" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                            </>
                        )}
                    </div>
                    <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-12 pt-32">
                        <button onClick={() => router.push('/blog')} className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors">
                            <ArrowLeft size={18} className="mr-2" /> Kembali ke Blog
                        </button>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl"
                        >
                            {blog.title}
                        </motion.h1>
                        <div className="flex flex-wrap gap-6 mt-6 text-slate-300 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <User size={18} className="text-blue-400" />
                                {blog.author || 'Admin'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-blue-400" />
                                {blog.published_date
                                    ? new Date(blog.published_date).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : '-'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-blue-400" />
                                5 min read
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Main Content */}
                        <div className="lg:col-span-2 w-full max-w-full">
                            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100 w-full">
                                <div
                                    className="prose prose-lg prose-slate max-w-none prose-img:rounded-xl prose-a:text-blue-600 hover:prose-a:text-blue-700 break-words w-full"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />

                                {/* Share / Footer of Article */}
                                <div className="mt-12 pt-8 border-t border-slate-100">
                                    <p className="text-slate-500 italic text-center">
                                        Terima kasih telah membaca. Jangan lupa bagikan artikel ini jika bermanfaat!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-8 min-w-0">
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 sticky top-24">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                    Artikel Lainnya
                                </h3>
                                <div className="space-y-6">
                                    {blogs
                                        .filter((b) => b.id !== blog.id)
                                        .slice(0, 5)
                                        .map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => router.push(`/blog/${item.id}`)}
                                                className="group flex gap-4 items-start w-full text-left"
                                            >
                                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                                                    {item.image_url && (
                                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-xs text-slate-500 mt-2 block">
                                                        {new Date(item.published_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                </div>

                                <button
                                    onClick={() => router.push('/blog')}
                                    className="block w-full mt-6 text-center text-sm font-semibold text-blue-600 py-3 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors"
                                >
                                    Lihat Semua Artikel
                                </button>
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
        </>
    );
}
