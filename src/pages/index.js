import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Home from "@/components/home";
import About from "@/components/About";
import Activitas from "@/components/Activitas";
// import Booking from "@/components/Booking";
import Gallery from "@/components/galery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Persyaratan from "@/components/Persyaratan";
import FAQ from "@/components/FAQ";
import WhatsappButton from "@/component/WhatsappButton";
import Review from "@/components/Review";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Melukat di Pura Mengening Tampaksiring"
        description="Pura Mengening adalah tempat melukat di Tampaksiring, Gianyar, Bali. Rasakan ritual penyucian diri di mata air suci bersama pemandu Tasya Melukat, lengkap dengan booking online."
        keywords="Pura Mengening, melukat di Tampaksiring, melukat di Pura Mengening, wisata spiritual Bali, tempat melukat Bali, Tasya Melukat"
      />

      <Navbar />
      <Home />
      <About id="about" />
      <Activitas />
      {/* <Booking /> */}
      <Persyaratan />
      <FAQ />
      <Gallery />
      <WhatsappButton />
      <Review />
      <Contact />
      <Footer />
    </>
  );
}
