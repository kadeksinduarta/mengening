import { SITE_URL } from '@/config/site';

const ROBOTS = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${SITE_URL}/sitemap.xml
`;

export default function Robots() {
    return null;
}

export async function getServerSideProps({ res }) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(ROBOTS);
    res.end();

    return { props: {} };
}
