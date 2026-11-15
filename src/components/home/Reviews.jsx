import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useTranslation } from "@/contexts/I18nContext";

// Logika data sama dengan Review.jsx lama (memuat ulasan yang disetujui dan
// mengirim ulasan baru). Yang berubah hanya penyajiannya:
//  - daftar ulasan hanya tampil bila ada isinya; tidak ada kartu "belum ada ulasan"
//  - form kirim berada di bawah daftar dan tertutup, bukan di atasnya
//  - galat memuat tidak ditampilkan ke publik
function timeAgo(dateString, t, language) {
  const date = new Date(dateString);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) return t("review.today");
  if (diffDays === 1) return t("review.dayAgo");
  if (diffDays < 30) return t("review.daysAgo").replace("{n}", diffDays);
  return date.toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
    month: "short",
    year: "numeric",
  });
}

function Stars({ value }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={20}
          aria-hidden="true"
          className={n <= value ? "fill-brick text-brick" : "fill-transparent text-stone/40"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

function ReviewSheet({ review, t, language }) {
  return (
    <li className="on-paper flex flex-col gap-4 bg-lime p-6 text-stone">
      <Stars value={review.rating} />
      <p className="text-lg">{review.message}</p>
      <p className="mt-auto font-bold">
        {review.name}
        <span className="ml-3 text-base font-normal text-stone/70">
          {timeAgo(review.created_at, t, language)}
        </span>
      </p>
    </li>
  );
}

function ReviewForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !message.trim() || rating === 0) {
      setError(t("review.errorRequired"));
      setSent(false);
      return;
    }
    setError("");
    setSubmitting(true);

    // Tanpa .select(): ulasan baru belum disetujui sehingga policy SELECT publik
    // tidak bisa melihatnya. Returning row akan kosong dan terbaca sebagai gagal,
    // padahal insert-nya berhasil, lalu pengunjung mengirim ulang.
    const { error: insertError } = await supabase
      .from("reviews")
      .insert({ name: name.trim(), message: message.trim(), rating });

    setSubmitting(false);

    if (insertError) {
      console.error("Gagal mengirim review:", insertError.message, insertError.code);
      setError(insertError.code === "23514" ? t("review.errorLength") : t("review.errorSubmit"));
      return;
    }

    setName("");
    setMessage("");
    setRating(0);
    setSent(true);
  };

  const field =
    "w-full border-2 border-stone bg-lime px-4 py-3 text-lg text-stone placeholder:text-stone/60";

  return (
    <form onSubmit={handleSubmit} className="on-paper mt-6 space-y-5 bg-lime p-6 text-stone md:p-8">
      <div>
        <label htmlFor="review-name" className="mb-2 block font-bold">
          {t("review.namePlaceholder")}
        </label>
        <input
          id="review-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
          autoComplete="name"
          className={field}
        />
      </div>

      <fieldset>
        <legend className="mb-2 font-bold">{t("review.ratingLabel")}</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="flex size-11 cursor-pointer items-center justify-center">
              <input
                type="radio"
                name="rating"
                value={star}
                checked={rating === star}
                onChange={() => setRating(star)}
                className="peer sr-only"
              />
              <Star
                size={30}
                aria-hidden="true"
                strokeWidth={1.5}
                className={`peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-stone ${
                  star <= rating ? "fill-brick text-brick" : "fill-transparent text-stone/50"
                }`}
              />
              <span className="sr-only">{star} / 5</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="review-message" className="mb-2 block font-bold">
          {t("review.messagePlaceholder")}
        </label>
        <textarea
          id="review-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          maxLength={600}
          className={field}
        />
      </div>

      {error && (
        <p role="alert" className="font-bold text-brick">
          {error}
        </p>
      )}
      {sent && (
        <p role="status" className="font-bold">
          {t("review.successMsg")}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-12 items-center bg-stone px-8 text-lg font-bold text-lime disabled:opacity-60"
      >
        {submitting ? t("review.submittingBtn") : t("review.submitBtn")}
      </button>
    </form>
  );
}

export default function Reviews() {
  const { t, language } = useTranslation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("reviews")
      .select("id, name, message, rating, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) {
          console.error("Gagal memuat ulasan:", error.message);
          return;
        }
        setReviews(data || []);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const featured = reviews.slice(0, 3);
  const rest = reviews.slice(3);

  return (
    <section id="ulasan" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        {reviews.length > 0 && (
          <>
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-stone md:text-6xl">
              {t("review.heading")}
            </h2>
            <p className="mt-5 max-w-2xl text-xl text-stone">{t("review.subtitle")}</p>

            <ul className="mt-12 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
              {featured.map((review) => (
                <ReviewSheet key={review.id} review={review} t={t} language={language} />
              ))}
            </ul>

            {rest.length > 0 && (
              <details className="mt-6">
                <summary className="inline-flex min-h-11 cursor-pointer items-center font-bold text-stone underline decoration-stone/40 hover:decoration-stone">
                  {t("review.listHeading")} ({rest.length})
                </summary>
                <ul className="mt-6 grid gap-6 md:grid-cols-3">
                  {rest.map((review) => (
                    <ReviewSheet key={review.id} review={review} t={t} language={language} />
                  ))}
                </ul>
              </details>
            )}
          </>
        )}

        <details className={reviews.length > 0 ? "mt-14" : ""}>
          <summary className="inline-flex min-h-11 cursor-pointer items-center text-xl font-bold text-stone underline decoration-stone/40 hover:decoration-stone">
            {reviews.length > 0 ? t("review.formTitle") : t("landing.reviews.prompt")}
            <span className="sr-only"> ({t("landing.reviews.open")})</span>
          </summary>
          <ReviewForm />
        </details>
      </div>
    </section>
  );
}
