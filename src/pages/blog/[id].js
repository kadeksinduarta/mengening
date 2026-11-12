import SEO from '@/components/SEO';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';
import { supabase, getImageUrl } from '@/utils/supabase';

export async function getStaticPaths() {
    const { data, error } = await supabase.from('blogs').select('id');

    if (error) {
        console.error('Gagal memuat daftar id blog:', error.message, error.code);
    }

    return {
        paths: (data || []).map((blog) => ({ params: { id: String(blog.id) } })),
        // Artikel yang dibuat setelah build tetap bisa dibuka tanpa rebuild.
        fallback: 'blocking',
    };
}

export async function getStaticProps({ params }) {
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !data) {
        if (error) console.error('Gagal memuat artikel:', error.message, error.code);
        return { notFound: true };
    }

    const blog = {
        ...data,
        image_url: getImageUrl(data.image_url || data.image),
    };

    // Sidebar hanya butuh judul dan gambar. Mengambil seluruh artikel lengkap
    // dengan kolom content akan ikut terkirim ke HTML halaman ini.
    const { data: others } = await supabase
        .from('blogs')
        .select('id, title, image_url, image, created_at')
        .neq('id', params.id)
        .order('created_at', { ascending: false })
        .limit(5);

    const blogs = (others || []).map((b) => ({
        ...b,
        image_url: getImageUrl(b.image_url || b.image),
    }));

    return {
        props: { blog, blogs },
        revalidate: 600,
    };
}

export default function BlogDetail({ blog, blogs }) {
    const router = useRouter();

    return (
        <>
            <SEO
                title={blog.title}
                description={blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 160)}
                keywords={`Pura Mengening, ${blog.title}, wisata Bali, budaya Bali, Tasya Melukat`}
                image={blog.image_url}
                type="article"
            />

            <PublicLayout>
            <div className="min-h-screen bg-slate-50 font-sans">

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
                                    {blogs.map((item) => (
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
                                                        {new Date(item.published_date || item.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
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
            </PublicLayout>
        </>
    );
}
