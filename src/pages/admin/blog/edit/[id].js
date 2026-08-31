import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase, getImageUrl } from '@/utils/supabase';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, Image as ImageIcon,
    FileText, Type, Send, AlertCircle, CheckCircle,
    RefreshCw
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function EditBlog() {
    const router = useRouter();
    const { id } = router.query;
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
            if (error) throw error;
            const blog = data;
            setFormData({
                title: blog.title,
                content: blog.content,
                image: null,
            });
            if (blog.image_url || blog.image) {
                const img = blog.image_url || blog.image;
                setCurrentImage(img);
                setImagePreview(getImageUrl(img));
            }
        } catch (err) {
            console.error('Error fetching blog:', err);
            setError('Gagal mengambil data artikel.');
        } finally {
            setLoading(false);
        }
    };

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
        setSubmitting(true);
        setError('');

        try {
            let imageUrl = currentImage;
            if (formData.image) {
                const file = formData.image;
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `blogs/${fileName}`;
                
                const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
                if (uploadError) throw uploadError;
                imageUrl = filePath;
            }

            const { error: updateError } = await supabase.from('blogs').update({
                title: formData.title,
                content: formData.content,
                image_url: imageUrl,
                image: imageUrl
            }).eq('id', id);

            if (updateError) throw updateError;
            setSuccess(true);
            setTimeout(() => router.push('/admin/blog'), 2000);
        } catch (err) {
            console.error('Error updating blog:', err);
            setError('Gagal memperbarui artikel. Pastikan semua field terisi dengan benar.');
        } finally {
            setSubmitting(false);
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

    if (loading && !error) {
        return (
            <AdminLayout title="Edit Artikel">
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Article Content...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Edit Article">
            <Head>
                <title>Edit Article - Pura Admin</title>
            </Head>

            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to List
                </button>

                <form onSubmit={handleSubmit} className="space-y-6 pb-12">
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold">
                            <AlertCircle size={18} className="shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-600 text-sm font-semibold">
                            <CheckCircle size={18} className="shrink-0" />
                            <span>Changes saved successfully! Redirecting...</span>
                        </motion.div>
                    )}

                    {/* Main Content Card */}
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <Type size={12} className="text-slate-400" /> Article Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Article title..."
                                    className="w-full text-2xl md:text-3xl font-extrabold text-slate-800 placeholder:text-slate-300 focus:placeholder:text-slate-200 outline-none border-none bg-transparent transition-all"
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <ImageIcon size={12} className="text-slate-400" /> Cover Image
                                </label>

                                <div className="relative group">
                                    {imagePreview ? (
                                        <div className="relative h-64 rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                <label className="p-3 bg-white hover:bg-slate-50 text-slate-700 shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all rounded-lg flex items-center gap-1.5 text-xs font-semibold">
                                                    <RefreshCw size={14} />
                                                    Change Cover
                                                    <input type="file" name="image" onChange={handleChange} className="hidden" accept="image/*" />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 rounded-xl cursor-pointer transition-all group">
                                            <div className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm mb-2 group-hover:scale-105 transition-transform text-slate-400">
                                                <ImageIcon size={24} />
                                            </div>
                                            <p className="font-semibold text-slate-500 text-xs">Click to upload cover image</p>
                                            <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, or WEBP up to 5MB</p>
                                            <input type="file" name="image" onChange={handleChange} className="hidden" accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Editor */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <FileText size={12} className="text-slate-400" /> Article Content
                                </label>
                                <div className="prose-editor min-h-[350px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={handleContentChange}
                                        modules={quillModules}
                                        className="h-[280px] mb-12"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article ID: {id}</span>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    Discard Changes
                                </button>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-9 rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Save size={13} /> Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx global>{`
        .prose-editor .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border: 1px solid #E2E8F0 !important;
          font-family: inherit;
        }
        .prose-editor .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border: 1px solid #E2E8F0 !important;
          background: #F8FAFC;
          padding: 0.75rem !important;
        }
        .prose-editor .ql-editor {
          min-height: 280px;
          padding: 1.25rem !important;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #334155;
        }
      `}</style>
        </AdminLayout>
    );
}
