import { supabase } from '@/utils/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://puramengening.com';

const STATIC_ROUTES = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/booking', priority: '0.9', changefreq: 'weekly' },
    { path: '/blog', priority: '0.8', changefreq: 'daily' },
];

function generateSitemap(blogs) {
    const staticUrls = STATIC_ROUTES.map(
        ({ path, priority, changefreq }) => `
    <url>
        <loc>${SITE_URL}${path}</loc>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`
    ).join('');

    const blogUrls = blogs
        .map(
            (blog) => `
    <url>
        <loc>${SITE_URL}/blog/${blog.id}</loc>
        <lastmod>${new Date(blog.updated_at || blog.created_at).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`
        )
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${blogUrls}
</urlset>`;
}

export default function Sitemap() {
    return null;
}

export async function getServerSideProps({ res }) {
    let blogs = [];
    try {
        const { data } = await supabase.from('blogs').select('id, created_at, updated_at');
        blogs = data || [];
    } catch (err) {
        console.error('Failed to fetch blogs for sitemap:', err);
    }

    const sitemap = generateSitemap(blogs);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return { props: {} };
}
