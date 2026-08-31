import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BlogCard from '@/component/BlogCard';
import Navbar from '@/components/Navbar';
import { supabase, getImageUrl } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogPage() {
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('blogs').select('*');
            if (error) throw error;
            const blogsWithUrl = (data || []).map((blog) => ({
                ...blog,
                image_url: getImageUrl(blog.image_url || blog.image), // Support both column names
            }));
            setBlogs(blogsWithUrl);
        } catch (err) {
            console.error(err);
            setMessage('Gagal memuat data blog');
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter((blog) =>
        blog.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <SEO
                title="Artikel & Berita"
                description="Temukan wawasan terbaru seputar Pura Mengening, ritual Melukat, dan budaya Bali. Baca artikel informatif tentang wisata spiritual di Bali bersama Tasya Melukat."
                keywords="artikel Pura Mengening, berita Bali, ritual Melukat, budaya Bali, wisata spiritual, Tasya Melukat"
            />

            <div className="min-h-screen bg-slate-50 font-sans">
                <Navbar />

                {/* Header Section */}
                <div className="bg-slate-900 text-white pt-40 pb-20 px-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                        >
                            Artikel & Berita
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto"
                        >
                            Temukan wawasan terbaru seputar Pura Mengening, ritual Melukat, dan budaya Bali.
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 flex justify-center"
                        >
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Cari artikel..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-12 py-6 rounded-full shadow-xl text-slate-800 bg-white border-0 focus-visible:ring-4 focus-visible:ring-blue-500/30"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-16">
                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {/* Error Message */}
                    {message && (
                        <p className="text-center text-red-500 font-medium py-10">{message}</p>
                    )}

                    {/* Blog Grid */}
                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredBlogs.map((blog) => (
                                <motion.div
                                    key={blog.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="hover:-translate-y-2 transition-transform duration-300"
                                >
                                    <Card className="overflow-hidden h-full cursor-pointer group shadow-md hover:shadow-xl transition-shadow" onClick={() => router.push(`/blog/${blog.id}`)  }>
                                        {blog.image_url && (
                                            <div className="overflow-hidden h-48">
                                                <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                        )}
                                        <CardContent className="p-5">
                                            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">{blog.category || 'Artikel'}</p>
                                            <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2 line-clamp-2">{blog.title}</h2>
                                            <p className="text-sm text-slate-500 line-clamp-3">{blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').substring(0, 100)}</p>
                                            <p className="text-xs text-slate-400 mt-3">{new Date(blog.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredBlogs.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            <p className="text-xl font-medium">Tidak ada artikel ditemukan</p>
                            <p className="mt-2 text-sm">Coba kata kunci pencarian lain.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
