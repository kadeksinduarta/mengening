import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, FileText, Settings, ExternalLink, Globe, Star } from 'lucide-react';

export default function AdminSidebar({ onClose }) {
    const router = useRouter();

    const menuItems = [
        { title: 'Overview', icon: LayoutDashboard, path: '/admin' },
        { title: 'Manage Bookings', icon: Users, path: '/admin/booking' },
        { title: 'Manage Blog', icon: FileText, path: '/admin/blog' },
        { title: 'Manage Reviews', icon: Star, path: '/admin/review' },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return router.pathname === '/admin';
        }
        return router.pathname.startsWith(path);
    };

    return (
        <div className="flex flex-col h-full py-6 border-r border-slate-100 bg-white">
            {/* Logo */}
            <div className="px-6 mb-10">
                <Link
                    href="/admin"
                    className="flex items-center gap-3 group"
                    onClick={onClose}
                >
                    <div className="w-25 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                       <img src="/Logo_Tasya.png" alt="Tasya Melukat" className="w-25 rounded-xl" />
                    </div>
                </Link>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 space-y-1">
                <div className="px-3 mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation</p>
                </div>
                {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                                ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={18} className={active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                            <span className="text-sm">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Info */}
            <div className="px-4 mt-auto">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Links</p>
                    <div className="space-y-2.5">
                        <a
                            href="/"
                            target="_blank"
                            className="flex items-center justify-between text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium group"
                        >
                            <span className="flex items-center gap-2">
                                <Globe size={14} className="text-slate-400 group-hover:text-blue-500" />
                                Lihat Website
                            </span>
                            <ExternalLink size={12} className="text-slate-400" />
                        </a>
                        <button
                            onClick={() => { }}
                            className="flex items-center justify-between w-full text-xs text-slate-600 hover:text-blue-600 transition-colors font-medium group"
                        >
                            <span className="flex items-center gap-2">
                                <Settings size={14} className="text-slate-400 group-hover:text-blue-500" />
                                Settings
                            </span>
                            <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-mono">v1.0</span>
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-5 font-medium">
                    &copy; 2026 Pura Mengening
                </p>
            </div>
        </div>
    );
}
