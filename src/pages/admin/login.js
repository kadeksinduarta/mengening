import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const FOCUS_RING = 'focus-visible:border-blue-600 focus-visible:ring-blue-600/40';

// Supabase menjawab dalam bahasa Inggris; panel admin berbahasa Indonesia.
function pesanGalat(err) {
    const message = err?.message || '';
    if (/invalid login credentials/i.test(message)) {
        return 'Email atau password tidak cocok. Periksa lagi, atau pakai "Lupa password?".';
    }
    if (/email not confirmed/i.test(message)) {
        return 'Email ini belum dikonfirmasi. Buka tautan konfirmasi di kotak masuk Anda.';
    }
    if (/rate limit|too many/i.test(message)) {
        return 'Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi.';
    }
    if (/failed to fetch|network/i.test(message)) {
        return 'Tidak bisa terhubung. Periksa koneksi internet, lalu coba lagi.';
    }
    return message || 'Login gagal. Periksa kembali email dan password Anda.';
}

export default function AdminLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [resetting, setResetting] = useState(false);
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
            setError(pesanGalat(err));
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError('');
        setInfo('');

        if (!formData.email.trim()) {
            setError('Isi dulu email Anda, lalu klik "Lupa password?" lagi.');
            return;
        }

        setResetting(true);
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
            formData.email.trim()
        );
        setResetting(false);

        if (resetError) {
            setError(pesanGalat(resetError));
            return;
        }

        setInfo('Tautan pengaturan ulang password sudah dikirim. Periksa kotak masuk email Anda.');
    };

    const busy = loading || resetting;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10 font-sans">
            <Head>
                <title>Masuk Admin - Tasya Melukat</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <main className="w-full max-w-sm">
                <div className="mb-8 flex justify-center">
                    <img
                        src="/Logo_Tasya.png"
                        alt="Tasya Melukat"
                        width={244}
                        height={111}
                        className="h-auto w-32"
                    />
                </div>

                <Card className="bg-white py-6 shadow-sm ring-slate-200 [--card-spacing:--spacing(6)]">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-slate-900">
                            <h1>Masuk ke panel admin</h1>
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Kelola booking, ulasan, dan blog.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div aria-live="polite" className="space-y-3 empty:hidden">
                                {error && (
                                    <Alert variant="destructive" className="border-red-200 bg-red-50 px-3 py-3">
                                        <AlertCircle aria-hidden="true" />
                                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                                    </Alert>
                                )}
                                {info && (
                                    <Alert className="border-emerald-200 bg-emerald-50 px-3 py-3">
                                        <CheckCircle2 aria-hidden="true" className="text-emerald-700" />
                                        <AlertDescription className="text-emerald-800">{info}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-900">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    inputMode="email"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    aria-invalid={error ? true : undefined}
                                    className={`h-11 border-slate-200 bg-white px-3 text-slate-900 placeholder:text-slate-500 ${FOCUS_RING}`}
                                    placeholder="nama@email.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-900">
                                        Password
                                    </Label>
                                    <button
                                        type="button"
                                        onClick={handleResetPassword}
                                        disabled={busy}
                                        className="-my-2 inline-flex min-h-11 items-center rounded-md px-1 text-sm font-medium text-blue-700 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-blue-600/40 disabled:opacity-50"
                                    >
                                        {resetting ? 'Mengirim…' : 'Lupa password?'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        aria-invalid={error ? true : undefined}
                                        className={`h-11 border-slate-200 bg-white px-3 pr-12 text-slate-900 ${FOCUS_RING}`}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                        aria-pressed={showPassword}
                                        className="absolute top-0 right-0 size-11 text-slate-600 hover:text-slate-900 focus-visible:ring-blue-600/40"
                                    >
                                        {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={busy}
                                className="h-11 w-full bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-600/40"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 aria-hidden="true" className="animate-spin" />
                                        Memeriksa…
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-slate-700 outline-none hover:text-slate-900 hover:underline focus-visible:ring-3 focus-visible:ring-blue-600/40"
                    >
                        <ArrowLeft size={16} aria-hidden="true" />
                        Kembali ke website
                    </Link>
                </div>
            </main>
        </div>
    );
}
