import Image from "next/image";
import { useTranslation } from "@/contexts/I18nContext";
import { GUIDE_PHOTO, whatsappLink } from "@/config/site";

// Siapa yang memandu. Selama GUIDE_PHOTO belum diisi, foto yang tampil adalah
// foto pura dengan keterangan yang jujur, bukan potret yang diklaim sebagai Tasya.
export default function Guide() {
  const { t } = useTranslation();
  const photo = GUIDE_PHOTO || "/Gallery.webp";
  const alt = GUIDE_PHOTO ? t("landing.guide.heading") : t("landing.guide.photoAlt");
  const caption = GUIDE_PHOTO ? t("landing.guide.heading") : t("landing.guide.caption");

  return (
    <section id="pemandu" className="px-6 py-20 md:py-28">
      <div className="on-paper mx-auto grid max-w-7xl gap-10 bg-lime p-6 text-stone md:grid-cols-12 md:items-center md:gap-14 md:p-12">
        <figure className="md:col-span-5">
          <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-t-full bg-stone">
            <Image
              src={photo}
              alt={alt}
              fill
              sizes="(min-width: 768px) 440px, 90vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 max-w-md text-base font-bold">{caption}</figcaption>
        </figure>

        <div className="md:col-span-7">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("landing.guide.title")}
          </h2>
          <blockquote className="mt-6 font-paper-display text-2xl font-bold leading-snug text-brick md:text-3xl">
            {t("about.quote")}
          </blockquote>
          <p className="mt-6 max-w-xl text-xl">{t("about.p1")}</p>
          <a
            href={whatsappLink(t("footer.waMsg"))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 items-center text-lg font-bold underline decoration-stone/40 hover:decoration-stone"
          >
            {t("landing.guide.ask")}
          </a>
        </div>
      </div>
    </section>
  );
}
