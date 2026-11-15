import Image from "next/image";
import { useTranslation } from "@/contexts/I18nContext";

// Empat langkah ritual sebagai empat lembar kertas yang ditempel berurutan.
// Tepi kiri tiap lembar bergeser sedikit, jadi tumpukannya terbaca sebagai
// langkah demi langkah. Foto dan teks langkah sama dengan Activitas lama.
const STEPS = [
  { key: "step1", image: "/Gallery11.webp", paper: "bg-lime text-stone", numeral: "text-brick" },
  { key: "step2", image: "/Gallery12.webp", paper: "bg-mist-water text-stone", numeral: "text-water" },
  { key: "step3", image: "/Gallery8.webp", paper: "bg-mist-clay text-stone", numeral: "text-brick" },
  { key: "step4", image: "/Gallery13.webp", paper: "bg-lime text-stone", numeral: "text-water" },
];

export default function Ritual() {
  const { t } = useTranslation();

  return (
    <section id="ritual" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-stone md:text-6xl">
            {t("activities.heading")}
          </h2>
          <p className="mt-5 max-w-2xl text-xl text-stone">{t("activities.subtitle")}</p>
        </div>

        <ol className="mt-14 flex flex-col">
          {STEPS.map((step, index) => {
            const title = t(`activities.${step.key}.title`);
            return (
              <li
                key={step.key}
                className={`paste-sheet grid gap-8 p-6 md:grid-cols-12 md:items-center md:gap-12 md:p-10 ${step.paper} ${
                  index > 0 ? "-mt-6 pt-12 md:-mt-8 md:pt-16" : ""
                } ${index < STEPS.length - 1 ? "pb-14 md:pb-[4.5rem]" : ""}`}
                style={{
                  marginLeft: `min(${index * 24}px, 6vw)`,
                  position: "relative",
                  zIndex: index + 1,
                }}
              >
                <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-full bg-stone md:col-span-5 md:justify-self-start">
                  <Image
                    src={step.image}
                    alt={title}
                    fill
                    sizes="(min-width: 768px) 384px, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="md:col-span-7">
                  <h3 className="flex items-baseline gap-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                    <span aria-hidden="true" className={`text-6xl md:text-8xl ${step.numeral}`}>
                      {index + 1}
                    </span>
                    <span>
                      <span className="sr-only">{t("landing.step")} {index + 1}: </span>
                      {title}
                    </span>
                  </h3>
                  <p className="mt-6 max-w-xl text-xl">{t(`activities.${step.key}.desc`)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
