import Image from "next/image";
import { useTranslation } from "@/contexts/I18nContext";

// Tiga foto yang tidak dipakai di bagian lain, jadi tidak ada foto kembar.
// Tinggi sel ditentukan rasio foto (3:4), bukan baris grid, sehingga galeri
// tidak lagi kolaps di bawah 768px seperti versi lama. Keterangan selalu
// tampak, tidak hanya saat hover.
const PHOTOS = [
  { src: "/Gallery1.webp", altKey: "gallery.alt1", big: true },
  { src: "/Gallery9.webp", altKey: "gallery.alt3" },
  { src: "/Gallery14.webp", altKey: "landing.photoGuests" },
];

export default function Moments() {
  const { t } = useTranslation();

  return (
    <section id="galeri" className="px-6 py-20 md:py-28" aria-label={t("landing.momentsAria")}>
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-stone md:text-6xl">
            {t("gallery.heading")}
          </h2>
          <p className="mt-5 text-xl text-stone">{t("gallery.subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {PHOTOS.map((photo) => {
            const caption = t(photo.altKey);
            return (
              <figure
                key={photo.src}
                className={`on-paper flex flex-col bg-lime text-stone ${
                  photo.big ? "col-span-2 md:row-span-2" : ""
                }`}
              >
                <div
                  className={`relative w-full ${
                    photo.big ? "aspect-[4/3] md:aspect-auto md:min-h-[24rem] md:flex-1" : "aspect-[3/4]"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={caption}
                    fill
                    sizes={photo.big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-4 py-3 text-lg font-bold">{caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
