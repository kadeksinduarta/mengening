import Link from "next/link";
import { useTranslation } from "@/contexts/I18nContext";
import { CONTACT_EMAIL, GEO, PHONE_E164, whatsappLink } from "@/config/site";

const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.812934435289!2d115.309451875886!3d-8.42002469161896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd218c195331a15%3A0x976a2d7f7fe96771!2sPura%20Mengening!5e0!3m2!1sid!2sid!4v1762316859713!5m2!1sid!2sid";
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${GEO.latitude},${GEO.longitude}`;

// "+6285857864840" -> "+62 8585 7864 840"
const phoneLabel = PHONE_E164.replace(/^\+62(\d{4})(\d{4})(\d+)$/, "+62 $1 $2 $3");

// Penutup: satu ajakan memesan dengan alurnya, lalu lokasi dan kontak. Alurnya
// mengikuti FAQ ("Bagaimana cara pembayaran?") dan tidak menambah klaim baru.
export default function Closing() {
  const { t } = useTranslation();
  const flow = t("landing.closing.flow");
  const addressLines = t("contact.addressText").split(/<br\s*\/?>/);

  return (
    <section id="kontak" className="px-6 pb-20 pt-6 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="bg-mist-water p-6 text-stone md:p-14">
          <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-7xl">
            {t("landing.closing.title")}
          </h2>

          <ol className="mt-10 grid gap-6 text-xl md:grid-cols-3 md:gap-10">
            {Array.isArray(flow) &&
              flow.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span aria-hidden="true" className="font-paper-display text-4xl font-extrabold text-water">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/booking"
              className="inline-flex min-h-14 items-center bg-kuning px-10 text-xl font-bold text-stone hover:bg-lime"
            >
              {t("landing.closing.book")}
            </Link>
            <a
              href={whatsappLink(t("footer.waMsg"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center bg-stone px-10 text-xl font-bold text-lime hover:bg-water"
            >
              {t("landing.closing.wa")}
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-12">
          <dl className="on-paper space-y-7 bg-lime p-6 text-stone md:col-span-5 md:p-10">
            <div>
              <dt className="font-paper-display text-xl font-extrabold">{t("contact.addressTitle")}</dt>
              <dd className="mt-1 text-xl">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line.trim()}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="font-paper-display text-xl font-extrabold">{t("contact.hoursTitle")}</dt>
              <dd className="mt-1 text-xl">{t("contact.hoursText")}</dd>
            </div>
            <div>
              <dt className="font-paper-display text-xl font-extrabold">{t("contact.waTitle")}</dt>
              <dd className="mt-1 text-xl">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline decoration-stone/40 hover:decoration-stone"
                >
                  {phoneLabel}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-paper-display text-xl font-extrabold">{t("contact.emailTitle")}</dt>
              <dd className="mt-1 text-xl">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex min-h-11 items-center break-all underline decoration-stone/40 hover:decoration-stone"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
          </dl>

          <div className="on-paper flex flex-col bg-lime text-stone md:col-span-7">
            <iframe
              src={MAP_EMBED}
              title={t("landing.closing.mapTitle")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border-0 md:aspect-auto md:min-h-[22rem] md:flex-1"
            />
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center px-6 text-lg font-bold underline decoration-stone/40 hover:decoration-stone"
            >
              {t("landing.closing.mapLink")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
