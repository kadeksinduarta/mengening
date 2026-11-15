import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/contexts/I18nContext";
import { whatsappLink } from "@/config/site";

// Dua jalur memesan di zona jempol. Di ponsel menggantikan tombol WhatsApp
// mengambang yang dulu menimpa menu dan berkedip tanpa henti.
export default function MobileBar() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  // Hero sudah punya tombol Pesan; bilah baru muncul setelah tombol itu keluar layar.
  useEffect(() => {
    const cta = document.getElementById("hero-cta");
    if (!cta) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting));
    observer.observe(cta);
    return () => observer.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t-2 border-stone/10 bg-white p-3 md:hidden">
      <Link
        href="/booking"
        className="flex min-h-12 flex-1 items-center justify-center bg-kuning text-lg font-bold text-stone"
      >
        {t("landing.hero.book")}
      </Link>
      <a
        href={whatsappLink(t("footer.waMsg"))}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-12 flex-1 items-center justify-center bg-ground text-lg font-bold text-lime"
      >
        WhatsApp
      </a>
    </div>
  );
}
