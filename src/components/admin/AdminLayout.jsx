import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from './AdminSidebar';
import { LogOut, User, Menu, X } from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState('Admin');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);

        const token = sessionStorage.getItem('token');
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');

        if (!token) {
            router.push('/admin/login');
        } else if (user.name) {
            setAdminName(user.name);
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        router.push('/admin/login');
    };

    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    if (!mounted) {
        return <div className="min-h-screen bg-[#F9FBFC] font-sans" />;
    }

    return (
        <div className="min-h-screen bg-[#F9FBFC] flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <AdminSidebar onClose={closeSidebarOnMobile} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white/80 backdrop-blur-md h-20 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-900">{adminName}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Administrator</span>
                        </div>
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 border border-slate-200">
                            <User size={24} />
                        </div>
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        <button
                            onClick={handleLogout}
                            className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                            title="Logout"
                        >
                            <LogOut size={22} />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-8 md:p-10 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
