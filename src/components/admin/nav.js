import { LayoutDashboard, CalendarDays, FileText, Star } from 'lucide-react';

export const ADMIN_NAV = [
    { title: 'Beranda', icon: LayoutDashboard, path: '/admin' },
    { title: 'Booking', icon: CalendarDays, path: '/admin/booking', badge: true },
    { title: 'Blog', icon: FileText, path: '/admin/blog' },
    { title: 'Ulasan', icon: Star, path: '/admin/review' },
];

export const isNavActive = (pathname, path) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path);

export const formatBadge = (count) => (count > 9 ? '9+' : String(count));
