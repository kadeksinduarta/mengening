import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ExternalLink, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ADMIN_NAV, isNavActive, formatBadge } from './nav';

export default function AdminMobileNav({ pendingCount = 0, adminName, onLogout, loggingOut }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 h-14 gap-2 rounded-full bg-blue-700 px-5 text-base text-white shadow-md hover:bg-blue-800 lg:hidden"
                >
                    <Menu className="size-5" aria-hidden="true" />
                    Menu
                    {pendingCount > 0 && (
                        <span className="absolute -right-1 -top-1 min-w-6 rounded-full bg-amber-500 px-1.5 text-center text-xs font-semibold leading-6 text-slate-900 tabular-nums">
                            {formatBadge(pendingCount)}
                            <span className="sr-only"> booking menunggu</span>
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent side="bottom" className="max-h-[85vh] gap-0 rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
                <SheetHeader className="border-b border-slate-100 p-4">
                    <SheetTitle className="text-base font-semibold text-slate-900">Menu</SheetTitle>
                    <SheetDescription className="truncate text-slate-600">{adminName}</SheetDescription>
                </SheetHeader>

                <nav aria-label="Menu admin" className="flex-1 space-y-2 overflow-y-auto p-3">
                    {ADMIN_NAV.map((item) => {
                        const active = isNavActive(router.pathname, item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setOpen(false)}
                                aria-current={active ? 'page' : undefined}
                                className={`flex min-h-12 items-center gap-3 rounded-lg border px-4 text-base outline-none focus-visible:ring-3 focus-visible:ring-blue-600/40 ${active
                                    ? 'border-blue-200 bg-blue-50 font-semibold text-blue-800'
                                    : 'border-slate-200 bg-white text-slate-800'
                                    }`}
                            >
                                <item.icon size={20} aria-hidden="true" />
                                {item.title}
                                {item.badge && pendingCount > 0 && (
                                    <span className="ml-auto rounded-full bg-amber-500 px-2 py-0.5 text-sm font-semibold text-slate-900 tabular-nums">
                                        {formatBadge(pendingCount)}
                                        <span className="sr-only"> menunggu</span>
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-2 border-t border-slate-100 p-3">
                    <Button asChild variant="outline" className="h-12 w-full justify-start gap-3 px-4 text-base">
                        <a href="/" target="_blank" rel="noreferrer">
                            <ExternalLink aria-hidden="true" /> Lihat Website
                            <span className="sr-only">(tab baru)</span>
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onLogout}
                        disabled={loggingOut}
                        className="h-12 w-full justify-start gap-3 px-4 text-base text-red-700 hover:bg-red-50 hover:text-red-800"
                    >
                        <LogOut aria-hidden="true" /> Keluar
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
