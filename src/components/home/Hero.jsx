import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { useTranslation } from "@/contexts/I18nContext";
import { whatsappLink } from "@/config/site";

// Mata air di jendela lengkung. Poster selalu ada; video hanya dimuat di layar
// lebar, tanpa preferensi gerak berkurang, dan tanpa mode hemat data. Ponsel
// tidak mengunduh 1,3 MB untuk sebuah latar.
function SpringWindow() {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [withVideo, setWithVideo] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection?.saveData === true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (wide && !calm && !saveData) setWithVideo(true);
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="absolute inset-x-[42px] top-[42px] bottom-0 overflow-hidden rounded-t-full bg-stone">
      <Image
        src="/hero-poster.webp"
        alt={t("landing.hero.poster")}
        fill
        priority
        sizes="(min-width: 1024px) 400px, 80vw"
        className="object-cover"
      />
      {withVideo && (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? t("landing.hero.pause") : t("landing.hero.play")}
            className="absolute bottom-3 left-1/2 flex size-11 -translate-x-1/2 items-center justify-center bg-lime text-stone"
          >
            {playing ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
          </button>
        </>
      )}
    </div>
  );
}

// Lengkung bersarang di atas anak tangga: tangga batu menurun ke mata air itu
// nyata (lihat teks "Level Aktivitas"). Tiap lapis adalah selembar kertas datar
// yang ditempel di atas lapis sebelumnya, simetris cermin, tanpa bayangan.
function PastedArch() {
  const layer = "absolute bottom-0 rounded-t-full paste-layer";
  const steps = [
    { width: "100%", color: "bg-ground" },
    { width: "88%", color: "bg-brick" },
    { width: "76%", color: "bg-ground" },
    { width: "64%", color: "bg-water" },
  ];

  return (
    <div className="mx-auto w-full max-w-[28rem]">
      <div className="relative aspect-[4/4.6]">
        <div className={`${layer} inset-x-0 top-0 bg-brick`} style={{ "--i": 0 }} />
        <div className={`${layer} inset-x-[14px] top-[14px] bg-lime`} style={{ "--i": 1 }} />
        <div className={`${layer} inset-x-[28px] top-[28px] bg-water`} style={{ "--i": 2 }} />
        <div className="paste-layer absolute inset-0" style={{ "--i": 0 }}>
          <SpringWindow />
        </div>
      </div>
      <div className="flex flex-col items-center">
        {steps.map((step, index) => (
          <div
            key={step.width}
            className={`h-[18px] paste-layer ${step.color}`}
            style={{ width: step.width, "--i": 4 + index }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const facts = t("landing.hero.facts");

  return (
    <section className="px-6 pb-16 pt-6 md:pb-28 md:pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-7">
          <h1 className="font-paper-display text-5xl font-extrabold leading-[0.98] tracking-tight text-stone sm:text-6xl lg:text-[5.25rem]">
            {t("landing.hero.title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone md:mt-7 md:text-xl">{t("landing.hero.lead")}</p>

          <ul className="mt-5 space-y-1.5 text-lg text-stone md:mt-7 md:space-y-2">
            {Array.isArray(facts) &&
              facts.map((fact) => (
                <li key={fact} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 bg-water" />
                  {fact}
                </li>
              ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-10">
            <Link
              id="hero-cta"
              href="/booking"
              className="inline-flex min-h-14 items-center bg-kuning px-9 text-xl font-bold text-stone hover:bg-lime"
            >
              {t("landing.hero.book")}
            </Link>
            <a
              href={whatsappLink(t("footer.waMsg"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-lg font-bold text-stone underline decoration-stone/40 hover:decoration-stone"
            >
              {t("landing.hero.ask")}
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <PastedArch />
        </div>
      </div>
    </section>
  );
}
