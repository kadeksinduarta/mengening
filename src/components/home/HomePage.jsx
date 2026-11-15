import SEO from "@/components/SEO";
import { useTranslation } from "@/contexts/I18nContext";
import { displayFont, bodyFont } from "@/components/home/fonts";
import HomeHeader from "@/components/home/HomeHeader";
import Hero from "@/components/home/Hero";
import Ritual from "@/components/home/Ritual";
import Guide from "@/components/home/Guide";
import Info from "@/components/home/Info";
import Moments from "@/components/home/Moments";
import Reviews from "@/components/home/Reviews";
import Faq from "@/components/home/Faq";
import Closing from "@/components/home/Closing";
import HomeFooter from "@/components/home/HomeFooter";
import MobileBar from "@/components/home/MobileBar";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title="Melukat di Pura Mengening Tampaksiring"
        description="Pura Mengening adalah tempat melukat di Tampaksiring, Gianyar, Bali. Rasakan ritual penyucian diri di mata air suci bersama pemandu Tasya Melukat, lengkap dengan booking online."
        keywords="Pura Mengening, melukat di Tampaksiring, melukat di Pura Mengening, wisata spiritual Bali, tempat melukat Bali, Tasya Melukat"
      />

      <div className={`${displayFont.variable} ${bodyFont.variable} home-world min-h-screen`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-kuning focus:px-4 focus:py-3 focus:font-bold focus:text-stone"
        >
          {t("landing.skip")}
        </a>
        <HomeHeader />
        <main id="main">
          <Hero />
          <Ritual />
          <Guide />
          <Info />
          <Moments />
          <Reviews />
          <Faq />
          <Closing />
        </main>
        <HomeFooter />
        <MobileBar />
      </div>
    </>
  );
}
