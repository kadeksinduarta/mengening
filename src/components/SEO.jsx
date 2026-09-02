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

    const siteName = 'Tasya Melukat - Wisata Spiritual Pura Mengening Bali';
    const defaultTitle = t('seo.title');
    const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const defaultDescription = t('seo.description');
    const defaultKeywords = t('seo.keywords');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puramengening.com';
    const fullUrl = url ? `${siteUrl}${url}` : `${siteUrl}${router.asPath}`;
    const logoUrl = `${siteUrl}/Logo_Tasya.png`;
    const ogImage = image || logoUrl;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Pura Mengening Tampaksiring",
      "description": defaultDescription,
      "url": siteUrl,
      "image": logoUrl,
      "logo": logoUrl,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Jalan Tirta No.25M, Sareseda",
        "addressLocality": "Tampaksiring",
        "addressRegion": "Bali",
        "postalCode": "80552",
        "addressCountry": "ID"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -8.42002469161896,
        "longitude": 115.309451875886
      },
      "telephone": "+6285857864840",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "08:00",
        "closes": "17:00"
      },
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tasya Melukat - Jasa Guide Pura Mengening",
        "image": logoUrl,
        "logo": logoUrl,
        "url": siteUrl,
        "telephone": "+6285857864840",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jalan Tirta No.25M, Sareseda",
          "addressLocality": "Tampaksiring",
          "addressRegion": "Bali",
          "postalCode": "80552",
          "addressCountry": "ID"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -8.42002469161896,
          "longitude": 115.309451875886
        },
        "areaServed": "Bali, Indonesia",
        "serviceType": "Wisata Spiritual Melukat"
      }
    };

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="author" content="Tasya Melukat" />
            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#38bdf8" />
            <link rel="icon" type="image/png" href="/Logo_Tasya.png?v=3" />
            <link rel="apple-touch-icon" sizes="180x180" href="/Logo_Tasya.png?v=3" />
            <link rel="shortcut icon" href="/Logo_Tasya.png?v=3" />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="id_ID" />
            <meta property="og:locale:alternate" content="en_US" />

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
