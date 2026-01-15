import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiAuth } from '@/utils/api';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, Image as ImageIcon,
    FileText, Type, Send, AlertCircle, CheckCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreateBlog() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleContentChange = (content) => {
        setFormData({ ...formData, content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const form = new FormData();
            form.append('title', formData.title);
            form.append('content', formData.content);
            if (formData.image) form.append('image', formData.image);

            await apiAuth.post('/dashboard/blog', form);
            setSuccess(true);
            setTimeout(() => router.push('/admin/blog'), 2000);
        } catch (err) {
            console.error('Error creating blog:', err);
            setError('Gagal membuat artikel. Pastikan semua field terisi dengan benar.');
        } finally {
            setLoading(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    return (
        <AdminLayout title="Tulis Artikel Baru">
            <Head>
                <title>Buat Artikel - Pura Admin</title>
            </Head>

            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] mb-8 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Kembali
                </button>

                <form onSubmit={handleSubmit} className="space-y-10 pb-20">
                    {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-center gap-4 text-rose-600 font-bold">
                            <AlertCircle size={24} />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-4 text-emerald-600 font-bold">
                            <CheckCircle size={24} />
                            Artikel berhasil diterbitkan! Mengalihkan...
                        </motion.div>
                    )}

                    {/* Main Content Card */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-10 md:p-14 space-y-12">
                            {/* Title Input */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
                                    <Type size={14} className="text-blue-500" /> Article Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Masukkan judul artikel yang menarik..."
                                    className="w-full text-3xl md:text-4xl font-black text-slate-900 placeholder:text-slate-100 focus:placeholder:text-slate-50 outline-none border-none bg-transparent transition-all"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-6">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
                                    <ImageIcon size={14} className="text-blue-500" /> Cover Image
                                </label>

                                <div className="relative group">
                                    {imagePreview ? (
                                        <div className="relative h-80 rounded-[2.5rem] overflow-hidden">
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                            <button
                                                type="button"
                                                onClick={() => { setFormData({ ...formData, image: null }); setImagePreview(null); }}
                                                className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl text-rose-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all font-black"
                                            >
                                                Remove Image
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-80 border-4 border-dashed border-slate-50 rounded-[2.5rem] cursor-pointer hover:bg-slate-50 hover:border-blue-100 transition-all group">
                                            <div className="p-6 bg-white rounded-3xl shadow-lg shadow-slate-200/50 mb-4 group-hover:scale-110 transition-transform">
                                                <ImageIcon size={40} className="text-slate-200" />
                                            </div>
                                            <p className="font-black text-slate-400 text-sm uppercase tracking-widest">Click to upload cover</p>
                                            <p className="text-[10px] text-slate-300 font-bold mt-2">Recommended size: 1200x800px</p>
                                            <input type="file" name="image" onChange={handleChange} className="hidden" accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Editor */}
                            <div className="space-y-6">
                                <label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
                                    <FileText size={14} className="text-blue-500" /> Article Content
                                </label>
                                <div className="prose-editor min-h-[400px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={handleContentChange}
                                        modules={quillModules}
                                        placeholder="Tuliskan isi artikel Anda di sini..."
                                        className="h-[350px] mb-12"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sticky Actions Footer */}
                        <div className="bg-slate-50 p-10 flex items-center justify-between border-t border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Autosaved a few seconds ago</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-8 py-4 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:bg-white rounded-2xl transition-all"
                                >
                                    Save as Draft
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-10 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Send size={18} /> Publish Post
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx global>{`
        .prose-editor .ql-container {
          border-bottom-left-radius: 2rem;
          border-bottom-right-radius: 2rem;
          border: 1px solid #F1F5F9 !important;
          font-family: inherit;
        }
        .prose-editor .ql-toolbar {
          border-top-left-radius: 2rem;
          border-top-right-radius: 2rem;
          border: 1px solid #F1F5F9 !important;
          background: #F8FAFC;
          padding: 1.5rem !important;
        }
        .prose-editor .ql-editor {
          min-height: 350px;
          padding: 2rem !important;
          font-size: 1.125rem;
          line-height: 1.75;
          color: #1E293B;
        }
        .prose-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #E2E8F0;
        }
      `}</style>
        </AdminLayout>
    );
}
