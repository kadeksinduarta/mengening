import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

// Header beranda. Navbar lama tetap dipakai halaman lain; beranda punya
// header sendiri karena dunia visualnya (font, palet) hanya dimuat di sini.
export default function HomeHeader() {
  const { t, language, changeLanguage } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#ritual", label: t("landing.nav.ritual") },
    { href: "#pemandu", label: t("landing.nav.guide") },
    { href: "#faq", label: t("landing.nav.faq") },
    { href: "/blog", label: t("nav.blog") },
  ];

  const switchLanguage = () => changeLanguage(language === "id" ? "en" : "id");

  const languageButton = (
    <button
      type="button"
      onClick={switchLanguage}
      lang={language === "id" ? "en" : "id"}
      aria-label={t("landing.nav.switchTo")}
      className="min-h-11 min-w-11 px-3 text-base font-bold tracking-wide text-stone underline decoration-stone/40 hover:decoration-stone"
    >
      {t("landing.nav.switchShort")}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 border-b-2 border-stone/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Tasya Melukat">
          <Image
            src="/Logo_Tasya.png"
            alt=""
            width={244}
            height={111}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav aria-label={t("landing.nav.menuLabel")} className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center px-4 text-base font-bold text-stone underline decoration-transparent hover:decoration-stone"
            >
              {link.label}
            </a>
          ))}
          {languageButton}
          <Link
            href="/booking"
            className="ml-3 inline-flex min-h-11 items-center bg-kuning px-6 text-base font-bold text-stone hover:bg-lime"
          >
            {t("nav.bookNow")}
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          {languageButton}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="home-menu"
            aria-label={open ? t("landing.nav.menuClose") : t("landing.nav.menuOpen")}
            className="flex size-11 items-center justify-center text-stone"
          >
            {open ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="home-menu"
          aria-label={t("landing.nav.menuLabel")}
          className="border-t-2 border-stone/10 bg-white px-6 pb-8 pt-4 md:hidden"
        >
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-paper-display text-3xl font-extrabold text-stone"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
