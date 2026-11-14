import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';
import { supabase } from '@/utils/supabase';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children, title }) {
    const router = useRouter();
    const [adminName, setAdminName] = useState('Admin');
    const [checkingSession, setCheckingSession] = useState(true);
    const [pendingCount, setPendingCount] = useState(0);
    const [loggingOut, setLoggingOut] = useState(false);
    const [sessionError, setSessionError] = useState(false);
    const [sessionAttempt, setSessionAttempt] = useState(0);

    // Sesi diambil dari Supabase, bukan dari flag di sessionStorage: flag hanya
    // menandakan "pernah login", sementara getSession() ikut memperhitungkan
    // token yang sudah kedaluwarsa atau dicabut.
    useEffect(() => {
        let active = true;

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!active) return;

            if (!session) {
                router.replace('/admin/login');
                return;
            }

            setAdminName(
                session.user.user_metadata?.full_name || session.user.email || 'Admin'
            );
            setSessionError(false);
            setCheckingSession(false);
        }).catch((err) => {
            // Tanpa ini, jaringan yang putus membuat layar kosong selamanya.
            console.error('Gagal memeriksa sesi admin:', err);
            if (active) setSessionError(true);
        });

        // Ikut melempar keluar saat token kedaluwarsa atau admin logout dari tab lain.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) router.replace('/admin/login');
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, [sessionAttempt]);

    // Jumlah booking yang menunggu konfirmasi, ditampilkan sebagai lencana di
    // menu Booking. Dimuat ulang saat pindah halaman dan saat tab kembali aktif.
    useEffect(() => {
        if (checkingSession) return;

        let active = true;
        const loadPending = async () => {
            const { count, error } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .or('status.eq.pending,status.is.null');
            if (active && !error) setPendingCount(count || 0);
        };

        loadPending();
        const onVisible = () => {
            if (document.visibilityState === 'visible') loadPending();
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            active = false;
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, [checkingSession, router.asPath]);

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error('Gagal keluar dari sesi:', err);
        }
        router.replace('/admin/login');
    };

    const retrySession = () => {
        setSessionError(false);
        setSessionAttempt((n) => n + 1);
    };

    // Jangan render dashboard sebelum sesi terbukti sah — mencegah data admin
    // sempat terlihat sekejap oleh pengunjung yang sesinya sudah habis.
    if (checkingSession) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans">
                {sessionError ? (
                    <div role="alert" className="max-w-sm space-y-3 text-center">
                        <p className="text-sm font-semibold text-slate-900">Sesi belum bisa diperiksa.</p>
                        <p className="text-sm text-slate-600">Periksa koneksi internet, lalu coba lagi.</p>
                        <div className="flex justify-center gap-2">
                            <Button onClick={retrySession} className="h-11 px-4">Coba lagi</Button>
                            <Button variant="outline" onClick={() => router.replace('/admin/login')} className="h-11 px-4">
                                Ke halaman masuk
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p role="status" className="text-sm text-slate-600">Memeriksa sesi…</p>
                )}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
                <AdminSidebar pendingCount={pendingCount} />
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4 lg:h-16 lg:px-8">
                    <h1 className="text-lg font-bold text-slate-900">{title}</h1>

                    <div className="hidden items-center gap-4 lg:flex">
                        <span className="max-w-48 truncate text-sm font-medium text-slate-900">{adminName}</span>
                        <Button variant="outline" onClick={handleLogout} disabled={loggingOut} className="h-9 gap-2 px-3">
                            <LogOut aria-hidden="true" /> Keluar
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-4 pb-24 lg:p-8">
                    {children}
                </main>
            </div>

            <AdminMobileNav
                pendingCount={pendingCount}
                adminName={adminName}
                onLogout={handleLogout}
                loggingOut={loggingOut}
            />
        </div>
    );
}
