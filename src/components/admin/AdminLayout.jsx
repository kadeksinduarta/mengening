import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from './AdminSidebar';
import { supabase } from '@/utils/supabase';
import { LogOut, User, Menu, X } from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState('Admin');
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsSidebarOpen(window.innerWidth >= 1024);
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            setCheckingSession(false);
        });

        // Ikut melempar keluar saat token kedaluwarsa atau admin logout dari tab lain.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) router.replace('/admin/login');
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/admin/login');
    };

    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    // Jangan render dashboard sebelum sesi terbukti sah — mencegah data admin
    // sempat terlihat sekejap oleh pengunjung yang sesinya sudah habis.
    if (checkingSession) {
        return <div className="min-h-screen bg-[#F9FBFC] font-sans" />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 ease-in-out transform border-r border-slate-100 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <AdminSidebar onClose={closeSidebarOnMobile} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-6 lg:px-8 border-b border-slate-100 sticky top-0 z-30">
                    <div className="flex items-center gap-3.5">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                        >
                            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-semibold text-slate-900 leading-tight">{adminName}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Administrator</span>
                        </div>
                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 border border-slate-200 shrink-0 font-bold text-sm">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                        <div className="h-6 w-px bg-slate-200"></div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-6 lg:p-8 flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
