import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/contexts/I18nContext";
import { whatsappLink } from "@/config/site";

// Footer beranda. Tautan Instagram dan kebijakan privasi sama dengan Footer
// lama; Footer lama tetap dipakai halaman lain. Padding bawah memberi ruang
// bagi bilah pesan di ponsel.
export default function HomeFooter() {
  const { t } = useTranslation();
  const link =
    "inline-flex min-h-11 items-center text-lg underline decoration-lime/40 hover:decoration-lime";

  return (
    <footer className="on-dark bg-stone px-6 pb-28 pt-14 text-lime md:pb-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image
            src="/Logo_Tasya.png"
            alt="Tasya Melukat"
            width={244}
            height={111}
            className="h-14 w-auto brightness-0 invert"
          />
          <p className="mt-4 text-lg">{t("footer.location")}</p>
        </div>

        <nav aria-label={t("landing.footer.nav")} className="md:col-span-3">
          <p className="font-paper-display text-xl font-extrabold">{t("landing.footer.nav")}</p>
          <ul className="mt-2">
            <li><a href="#ritual" className={link}>{t("landing.nav.ritual")}</a></li>
            <li><a href="#faq" className={link}>{t("landing.nav.faq")}</a></li>
            <li><Link href="/blog" className={link}>{t("nav.blog")}</Link></li>
            <li><Link href="/kebijakan-privasi" className={link}>{t("footer.privacy")}</Link></li>
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="font-paper-display text-xl font-extrabold">{t("landing.footer.follow")}</p>
          <ul className="mt-2">
            <li>
              <a
                href="https://www.instagram.com/aprl_tasyya"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(t("footer.waMsg"))}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-7xl text-base text-lime/80">
        &copy; {new Date().getFullYear()} Tasya Melukat Mengening. {t("footer.rights")}
      </p>
    </footer>
  );
}
