import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from '@/contexts/I18nContext';
import {
    SITE_URL, SITE_NAME, ADDRESS, GEO, PHONE_E164, OPENING_HOURS,
} from '@/config/site';

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

    const siteName = SITE_NAME;
    const defaultTitle = t('seo.title');
    const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const defaultDescription = t('seo.description');
    const defaultKeywords = t('seo.keywords');
    const siteUrl = SITE_URL;
    const fullUrl = url ? `${siteUrl}${url}` : `${siteUrl}${router.asPath}`;
    const logoUrl = `${siteUrl}/Logo_Tasya.png`;
    const ogImage = image || logoUrl;

    // Alamat dan koordinat sebelumnya ditulis dua kali di objek ini —
    // TouristAttraction dan provider-nya — sehingga bisa saling bertentangan.
    const postalAddress = {
      "@type": "PostalAddress",
      "streetAddress": ADDRESS.street,
      "addressLocality": ADDRESS.locality,
      "addressRegion": ADDRESS.region,
      "postalCode": ADDRESS.postalCode,
      "addressCountry": ADDRESS.country
    };

    const geoCoordinates = {
      "@type": "GeoCoordinates",
      "latitude": GEO.latitude,
      "longitude": GEO.longitude
    };

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Pura Mengening Tampaksiring",
      "description": defaultDescription,
      "url": siteUrl,
      "image": logoUrl,
      "logo": logoUrl,
      "address": postalAddress,
      "geo": geoCoordinates,
      "telephone": PHONE_E164,
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": OPENING_HOURS.opens,
        "closes": OPENING_HOURS.closes
      },
      "provider": {
        "@type": "LocalBusiness",
        "name": "Tasya Melukat - Jasa Guide Pura Mengening",
        "image": logoUrl,
        "logo": logoUrl,
        "url": siteUrl,
        "telephone": PHONE_E164,
        "priceRange": "$$",
        "address": postalAddress,
        "geo": geoCoordinates,
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
