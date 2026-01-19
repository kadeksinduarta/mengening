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

export default function HomePage() {
  return (
    <>
      <SEO
        title="Wisata Spiritual dan Budaya Bali"
        description="Kunjungi Pura Mengening, destinasi wisata spiritual dan budaya di Bali. Nikmati keindahan alam, aktivitas spiritual, dan pengalaman budaya yang mendalam bersama Tasya Melukat."
        keywords="Pura Mengening, wisata Bali, wisata spiritual, budaya Bali, temple Bali, Melukat Bali, Tasya Melukat"
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
      <Contact />
      <Footer />
    </>
  );
}
