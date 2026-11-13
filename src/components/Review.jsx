import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useTranslation } from '@/contexts/I18nContext';

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <label key={star} className="cursor-pointer p-0.5">
          <input
            type="radio"
            name="rating"
            value={star}
            checked={value === star}
            onChange={() => onChange(star)}
            onFocus={() => setHovered(star)}
            className="sr-only"
            required
          />
          <Star
            onMouseEnter={() => setHovered(star)}
            className={`w-7 h-7 transition-colors ${
              star <= display
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-slate-300'
            }`}
            strokeWidth={1.5}
          />
        </label>
      ))}
    </div>
  );
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

// Menerima t dan language: sebelumnya fungsi ini selalu mengembalikan teks
// Inggris dan memformat tanggal dengan 'en-US', bahkan saat situs berbahasa
// Indonesia.
function timeAgo(dateString, t, language) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return t('review.today');
  if (diffDays === 1) return t('review.dayAgo');
  if (diffDays < 30) return t('review.daysAgo').replace('{n}', diffDays);
  return date.toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID', {
    month: 'short',
    year: 'numeric',
  });
}

function ReviewCard({ review, t, language }) {
  return (
    <div className="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col gap-4 shrink-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-slate-200'
              }`}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <Quote className="w-6 h-6 text-blue-100 shrink-0" strokeWidth={1.5} />
      </div>

      <p className="text-slate-600 text-sm leading-relaxed line-clamp-5 flex-1">
        {review.message}
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
          {initials(review.name)}
        </div>
        <div className="min-w-0">
          <p className="text-slate-900 font-semibold text-sm truncate">{review.name}</p>
          <p className="text-slate-400 text-xs">{timeAgo(review.created_at, t, language)}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewCarousel({ reviews, emptyLabel, t, language }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    updateEdges();
  }, [reviews]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const cardWidth = card ? card.getBoundingClientRect().width + 16 : 300;
    el.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-12 px-6 text-center">
        <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-slate-500 text-sm">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        {reviews.map((review) => (
          <div key={review.id} data-card className="snap-start">
            <ReviewCard review={review} t={t} language={language} />
          </div>
        ))}
      </div>

      {reviews.length > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Previous reviews"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Next reviews"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

const Review = () => {
  const { t, language } = useTranslation();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select('id, name, message, rating, created_at')
        .order('created_at', { ascending: false });

      if (!isMounted) return;
      if (fetchError) {
        setError(t('review.errorLoad'));
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const { averageRating, totalReviews } = useMemo(() => {
    if (reviews.length === 0) return { averageRating: 0, totalReviews: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return { averageRating: sum / reviews.length, totalReviews: reviews.length };
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || rating === 0) {
      setError(t('review.errorRequired'));
      setJustSubmitted(false);
      return;
    }
    setError('');
    setSubmitting(true);

    // Tanpa .select(). Review baru belum disetujui, sehingga policy SELECT
    // publik tidak bisa melihatnya — returning row akan kosong dan ditafsirkan
    // sebagai kegagalan, padahal insert-nya berhasil. Pengunjung lalu mengirim
    // ulang dan ulasannya terduplikasi.
    const { error: insertError } = await supabase
      .from('reviews')
      .insert({ name: name.trim(), message: message.trim(), rating });

    setSubmitting(false);

    if (insertError) {
      console.error('Gagal mengirim review:', insertError.message, insertError.code);
      setError(
        insertError.code === '23514'
          ? t('review.errorLength')
          : t('review.errorSubmit')
      );
      return;
    }

    // Tidak ditambahkan ke daftar: ulasan baru tampil setelah admin menyetujui.
    setName('');
    setMessage('');
    setRating(0);
    setJustSubmitted(true);
  };

  return (
    <section id="review" className="py-24 bg-gradient-to-b from-blue-50 to-white font-sans relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <MessageCircle className="text-blue-600" size={32} />
          </div>
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t('review.sectionTitle')}
          </span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900 mb-6">
            {t('review.heading')}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light mb-6">
            {t('review.subtitle')}
          </p>

          {totalReviews > 0 && (
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-transparent text-slate-200'
                    }`}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-slate-900 font-semibold text-sm">{averageRating.toFixed(1)}</span>
              <span className="text-slate-400 text-sm">
                ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-slate-100 mb-16"
        >
          <h3 className="text-xl font-bold font-playfair text-slate-900 mb-6 text-center">
            {t('review.formTitle')}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={t('review.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <textarea
              placeholder={t('review.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={600}
              className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />

            <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-slate-600">{t('review.ratingLabel')}</span>
              <StarRating value={rating} onChange={setRating} />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {justSubmitted && !error && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{t('review.successMsg')}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              {submitting ? t('review.submittingBtn') : t('review.submitBtn')}
            </button>
          </form>
        </motion.div>

        {/* Reviews list */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold font-playfair text-slate-900 mb-6">
            {t('review.listHeading')}
          </h3>
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[280px] sm:min-w-[320px] h-48 bg-white border border-slate-100 rounded-2xl animate-pulse shrink-0" />
              ))}
            </div>
          ) : (
            <ReviewCarousel reviews={reviews} emptyLabel={t('review.emptyState')} t={t} language={language} />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Review;
