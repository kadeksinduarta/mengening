import { Plus } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";

// Dua belas pertanyaan yang sama dengan FAQ lama, dikelompokkan menurut tahap
// keputusan: paham, siap, memesan. Angka adalah indeks di faq.items; semua
// 12 butir muncul tepat satu kali. Memakai <details> bawaan: bisa dibuka dengan
// keyboard, bisa dicari dengan Ctrl+F saat terbuka, dan tanpa JavaScript.
const GROUPS = [
  [0, 1, 5, 9],
  [2, 3, 4, 6, 11],
  [7, 8, 10],
];

export default function Faq() {
  const { t } = useTranslation();
  const items = t("faq.items");
  const titles = t("landing.faqGroups");
  if (!Array.isArray(items)) return null;

  return (
    <section id="faq" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-stone md:text-6xl">
          {t("faq.heading")}
        </h2>
        <p className="mt-5 max-w-2xl text-xl text-stone">{t("faq.subtitle")}</p>

        <div className="mt-14 space-y-14">
          {GROUPS.map((indexes, group) => (
            <div key={group} className="grid gap-6 md:grid-cols-12 md:gap-14">
              <h3 className="text-3xl font-extrabold leading-tight text-stone md:sticky md:top-28 md:col-span-4 md:self-start">
                {Array.isArray(titles) ? titles[group] : ""}
              </h3>
              <div className="on-paper bg-lime text-stone md:col-span-8">
                {indexes.map((index, row) => {
                  const item = items[index];
                  if (!item) return null;
                  return (
                    <details
                      key={index}
                      className={`group/item ${row > 0 ? "border-t-2 border-stone/20" : ""}`}
                    >
                      <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 px-6 py-4 text-xl font-bold">
                        {item.q}
                        <Plus
                          size={24}
                          aria-hidden="true"
                          className="shrink-0 transition-transform duration-200 group-open/item:rotate-45"
                        />
                      </summary>
                      <p className="px-6 pb-6 text-xl">{item.a}</p>
                    </details>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
