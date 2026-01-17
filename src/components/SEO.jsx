import Head from 'next/head';
import { useRouter } from 'next/router';

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
}) => {
    const router = useRouter();
    const siteName = 'Tasya Melukat - Pura Mengening';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDescription = 'Pengalaman Melukat yang sakral dan mendamaikan di Pura Mengening, Tampaksiring, Bali. Hubungi Tasya Melukat untuk jadwal dan informasi selengkapnya.';
    const defaultKeywords = 'Melukat, Pura Mengening, Tampaksiring, Bali, Wisata Budaya, Ritual Bali, Tasya Melukat';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puramengening.com';
    const fullUrl = url ? `${siteUrl}${url}` : `${siteUrl}${router.asPath}`;
    const ogImage = image || `${siteUrl}/Logo_Tasya.png`;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/Logo_Tasya.png" />
            <link rel="apple-touch-icon" href="/Logo_Tasya.png" />
            <link rel="shortcut icon" href="/Logo_Tasya.png" />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={ogImage} />

            {/* Canonical Link */}
            <link rel="canonical" href={fullUrl} />
        </Head>
    );
};

export default SEO;
