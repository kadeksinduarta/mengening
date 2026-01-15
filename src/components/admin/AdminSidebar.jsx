import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, FileText, Settings, ExternalLink, Globe } from 'lucide-react';

export default function AdminSidebar({ onClose }) {
    const router = useRouter();

    const menuItems = [
        { title: 'Home', icon: LayoutDashboard, path: '/admin' },
        { title: 'Manage Bookings', icon: Users, path: '/admin/booking' },
        { title: 'Manage Blog', icon: FileText, path: '/admin/blog' },
    ];

    const isActive = (path) => {
        if (path === '/admin') {
            return router.pathname === '/admin';
        }
        return router.pathname.startsWith(path);
    };

    return (
        <div className="flex flex-col h-full py-8 border-r border-slate-100 bg-white">
            <div className="px-8 mb-12">
                <Link
                    href="/admin"
                    className="flex items-center gap-3"
                    onClick={onClose}
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                        <Globe className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Pura Admin</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${isActive(item.path)
                            ? 'bg-blue-50 text-blue-600 font-bold'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <item.icon size={22} className={isActive(item.path) ? 'text-blue-600' : 'text-slate-400'} />
                        <span className="text-[15px]">{item.title}</span>
                    </Link>
                ))}
            </nav>

            <div className="px-6 mt-auto">
                <div className="bg-slate-50 rounded-3xl p-6">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4 font-bold">Quick Links</p>
                    <div className="space-y-3">
                        <a
                            href="/"
                            target="_blank"
                            className="flex items-center justify-between text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            Lihat Website
                            <ExternalLink size={14} />
                        </a>
                        <button
                            onClick={() => { }}
                            className="flex items-center justify-between w-full text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
                        >
                            Settings
                            <Settings size={14} />
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-6">
                    &copy; 2026 Pura Mengening
                </p>
            </div>
        </div>
    );
}
