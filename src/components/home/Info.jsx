import { useTranslation } from "@/contexts/I18nContext";

// Enam hal yang perlu diketahui sebelum datang, sebagai satu daftar bertulang
// punggung garis. Teks sama dengan Persyaratan lama. Aturan adat (menstruasi)
// ditulis sebagai baris biasa, bukan kartu peringatan.
const ROWS = ["guest", "activity", "equipment", "accessibility", "reschedule", "special"];

export default function Info() {
  const { t } = useTranslation();

  return (
    <section id="info" className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:sticky md:top-28 md:col-span-4 md:self-start">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-stone md:text-6xl">
            {t("requirements.heading")}
          </h2>
          <p className="mt-5 text-xl text-stone">{t("requirements.subtitle")}</p>
        </div>

        <dl className="on-paper bg-lime px-6 text-stone md:col-span-8 md:px-10">
          {ROWS.map((row, index) => (
            <div
              key={row}
              className={`grid gap-2 py-7 md:grid-cols-12 md:gap-8 ${
                index > 0 ? "border-t-2 border-stone/20" : ""
              }`}
            >
              <dt className="font-paper-display text-2xl font-extrabold leading-snug md:col-span-4">
                {t(`requirements.${row}.title`)}
              </dt>
              <dd className="text-xl md:col-span-8">{t(`requirements.${row}.desc`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
