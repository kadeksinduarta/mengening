import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Gallery() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Filtered high-quality images only
  const images = [
    { src: "Gallery1.jpg", alt: "Gapura Pura Mengening", span: "col-span-1 md:col-span-2 row-span-2" },
    { src: "Gallery8.jpg", alt: "Suasana Hening", span: "col-span-1" },
    { src: "Gallery9.jpg", alt: "Pancuran Air Suci", span: "col-span-1" },
    { src: "Gallery11.jpg", alt: "Persiapan Canang", span: "col-span-1" },
    { src: "Gallery12.jpg", alt: "Meditasi Khusyuk", span: "col-span-1 md:col-span-2" },
    { src: "Gallery14.jpeg", alt: "Keasrian Alam", span: "col-span-1" },
  ];

  return (
    <section
      id="gallery"
      className="py-24 bg-slate-50"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Judul */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3 block">Galeri Foto</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900 mb-6">
            Momen Kedamaian
          </h2>
          <p className="text-slate-600 text-lg font-light max-w-2xl mx-auto">
            Lihatlah bagaimana kedamaian menyatu dengan alam dan tradisi di Pura Mengening.
          </p>
        </div>

        {/* Grid Gambar Bento Grid Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[250px]">
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-3xl shadow-sm group ${img.span || 'col-span-1'}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition-colors duration-500 z-10"></div>
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition duration-500 z-20">
                <p className="text-white font-medium text-lg drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition duration-500">
                  {img.alt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="text-center mt-16">
          <a
            href="/booking"
            className="inline-block px-10 py-4 border border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition duration-300"
          >
            Lihat Paket Ritual
          </a>
        </div>
      </div>
    </section>
  );
}

export default Gallery;
