import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Home from '@/components/home';
import About from '@/components/About';
import Activitas from '@/components/Activitas';
import Booking from '@/components/Booking';
import Gallery from '@/components/galery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Persyaratan from '@/components/Persyaratan';
import FAQ from '@/components/FAQ';
import WhatsappButton from '@/component/WhatsappButton';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Pura Mengening - Wisata Spiritual dan Budaya Bali</title>
        <meta
          name="description"
          content="Kunjungi Pura Mengening, destinasi wisata spiritual dan budaya di Bali. Nikmati keindahan alam, aktivitas spiritual, dan pengalaman budaya yang mendalam."
        />
        <meta name="keywords" content="Pura Mengening, wisata Bali, wisata spiritual, budaya Bali, temple Bali" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://puramengening.com/" />
        <meta property="og:title" content="Pura Mengening - Wisata Spiritual dan Budaya Bali" />
        <meta property="og:description" content="Kunjungi Pura Mengening, destinasi wisata spiritual dan budaya di Bali. Nikmati keindahan alam, aktivitas spiritual, dan pengalaman budaya yang mendalam." />
        <meta property="og:image" content="/assets/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://puramengening.com/" />
        <meta property="twitter:title" content="Pura Mengening - Wisata Spiritual dan Budaya Bali" />
        <meta property="twitter:description" content="Kunjungi Pura Mengening, destinasi wisata spiritual dan budaya di Bali. Nikmati keindahan alam, aktivitas spiritual, dan pengalaman budaya yang mendalam." />
        <meta property="twitter:image" content="/assets/og-image.jpg" />

        <link rel="canonical" href="https://puramengening.com/" />
      </Head>

      <Navbar />
      <Home />
      <About id="about" />
      <Activitas />
      <Booking />
      <Persyaratan />
      <FAQ />
      <Gallery />
      <WhatsappButton />
      <Contact />
      <Footer />
    </>
  );
}
