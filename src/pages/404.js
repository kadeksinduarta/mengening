import Link from 'next/link';
import SEO from '@/components/SEO';
import PublicLayout from '@/components/PublicLayout';
import { ArrowLeft, Search } from 'lucide-react';
import { useTranslation } from '@/contexts/I18nContext';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <>
            <SEO title={t('notFound.title')} />

            <PublicLayout solidNav>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center px-6 pt-28 pb-16 font-sans">
                    <div className="max-w-lg w-full text-center">
                        <p className="text-7xl md:text-8xl font-playfair font-bold text-blue-600/20 leading-none">
                            404
                        </p>

                        <h1 className="mt-4 text-2xl md:text-3xl font-playfair font-bold text-slate-900">
                            {t('notFound.title')}
                        </h1>

                        <p className="mt-4 text-slate-600 leading-relaxed">
                            {t('notFound.body')}
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/20"
                            >
                                <ArrowLeft size={18} />
                                {t('notFound.home')}
                            </Link>
                            <Link
                                href="/blog"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 bg-white text-slate-700 hover:border-slate-300 rounded-xl font-semibold transition-colors"
                            >
                                <Search size={18} className="text-slate-400" />
                                {t('notFound.articles')}
                            </Link>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        </>
    );
}
