import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, AlertCircle, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AdminLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        let active = true;

        // Sesi Supabase adalah sumber kebenarannya, bukan flag di sessionStorage.
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (active && session) router.replace('/admin');
        });

        return () => { active = false; };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInfo('');

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) throw signInError;

            // supabase-js menyimpan dan menyegarkan sesinya sendiri; menyalinnya
            // ke sessionStorage hanya menciptakan sumber kebenaran kedua yang
            // bisa bertahan setelah sesi aslinya habis.
            router.replace('/admin');
        } catch (err) {
            console.error('Login error:', err.message);
            setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError('');
        setInfo('');

        if (!formData.email.trim()) {
            setError('Isi dulu email Anda, lalu klik "Lupa Password?" lagi.');
            return;
        }

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
            formData.email.trim()
        );

        if (resetError) {
            setError(resetError.message);
            return;
        }

        setInfo('Tautan pengaturan ulang password sudah dikirim. Periksa kotak masuk email Anda.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background decorative glows */}
            <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

            <Head>
                <title>Login Admin - Pura Mengening</title>
            </Head>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <motion.div 
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 mb-4"
                    >
                        <Globe className="text-white" size={26} />
                    </motion.div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Pura Admin</h1>
                    <p className="text-slate-400 mt-2 text-sm">Masuk untuk mengelola konten dan jadwal Melukat.</p>
                </div>

                <Card className="rounded-3xl border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-black/40">
                    <CardHeader className="space-y-1.5 pb-6">
                        <CardTitle className="text-xl text-white font-bold">Masuk ke Dashboard</CardTitle>
                        <CardDescription className="text-slate-400">Gunakan kredensial admin Anda.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
                                >
                                    <AlertCircle size={18} className="shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            {info && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
                                >
                                    <AlertCircle size={18} className="shrink-0" />
                                    <span>{info}</span>
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Email</Label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                        <User size={18} />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-11 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl"
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-300 text-xs font-bold uppercase tracking-wider">Password</Label>
                                    <button
                                        type="button"
                                        onClick={handleResetPassword}
                                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                                    >
                                        Lupa Password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                                        <Lock size={18} />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-11 pr-12 bg-slate-950/40 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 rounded-xl transition-all shadow-lg shadow-blue-600/20"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Masuk Sekarang
                                        <motion.span
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.span>
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-600 text-xs mt-8">
                    &copy; 2026 Pura Mengening. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
