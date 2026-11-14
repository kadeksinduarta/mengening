import Link from 'next/link';
import { useRouter } from 'next/router';
import { ExternalLink } from 'lucide-react';
import { ADMIN_NAV, isNavActive, formatBadge } from './nav';

export default function AdminSidebar({ pendingCount = 0 }) {
    const router = useRouter();

    return (
        <div className="flex h-full flex-col border-r border-slate-100 bg-white py-6">
            <div className="mb-8 px-6">
                <Link href="/admin" className="block rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-blue-600/40">
                    <img src="/Logo_Tasya.png" alt="Tasya Melukat" width={244} height={111} className="h-auto w-28" />
                </Link>
            </div>

            <nav aria-label="Menu admin" className="flex-1 space-y-1 px-4">
                {ADMIN_NAV.map((item) => {
                    const active = isNavActive(router.pathname, item.path);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            aria-current={active ? 'page' : undefined}
                            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-blue-600/40 ${active
                                ? 'bg-blue-50 font-semibold text-blue-800'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={18} aria-hidden="true" />
                            <span className="text-sm">{item.title}</span>
                            {item.badge && pendingCount > 0 && (
                                <span className="ml-auto rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-slate-900 tabular-nums">
                                    {formatBadge(pendingCount)}
                                    <span className="sr-only"> menunggu</span>
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-4">
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-slate-700 outline-none hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-3 focus-visible:ring-blue-600/40"
                >
                    <ExternalLink size={18} aria-hidden="true" />
                    Lihat Website
                    <span className="sr-only">(tab baru)</span>
                </a>
            </div>
        </div>
    );
}
