import SEO from "@/components/SEO";
import PublicLayout from "@/components/PublicLayout";
import Home from "@/components/home";
import About from "@/components/About";
import Activitas from "@/components/Activitas";
import Gallery from "@/components/galery";
import Contact from "@/components/Contact";
import Persyaratan from "@/components/Persyaratan";
import FAQ from "@/components/FAQ";
import Review from "@/components/Review";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Melukat di Pura Mengening Tampaksiring"
        description="Pura Mengening adalah tempat melukat di Tampaksiring, Gianyar, Bali. Rasakan ritual penyucian diri di mata air suci bersama pemandu Tasya Melukat, lengkap dengan booking online."
        keywords="Pura Mengening, melukat di Tampaksiring, melukat di Pura Mengening, wisata spiritual Bali, tempat melukat Bali, Tasya Melukat"
      />

      <PublicLayout>
        <Home />
        <About id="about" />
        <Activitas />
        <Persyaratan />
        <FAQ />
        <Gallery />
        <Review />
        <Contact />
      </PublicLayout>
    </>
  );
}
