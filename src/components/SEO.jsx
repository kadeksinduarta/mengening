import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from '@/contexts/I18nContext';

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website'
}) => {
    const router = useRouter();
    const { t } = useTranslation();

    const siteName = 'Tasya Melukat - Pura Mengening';
    const defaultTitle = t('seo.title');
    const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const defaultDescription = t('seo.description');
    const defaultKeywords = t('seo.keywords');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puramengening.com';
    const fullUrl = url ? `${siteUrl}${url}` : `${siteUrl}${router.asPath}`;
    const ogImage = image || `${siteUrl}/Logo_Tasya.png`;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Pura Mengening",
      "description": defaultDescription,
      "url": siteUrl,
      "image": ogImage,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Tampaksiring",
        "addressRegion": "Bali",
        "addressCountry": "ID"
      },
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tasya Melukat - Jasa Guide Pura Mengening",
        "image": ogImage,
        "priceRange": "$$"
      }
    };

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/jpeg" href="/Logo_Tasya.png?v=2" />
            <link rel="apple-touch-icon" href="/Logo_Tasya.png?v=2" />
            <link rel="shortcut icon" href="/Logo_Tasya.png?v=2" />

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

            {/* Structured Data */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </Head>
    );
};

export default SEO;
