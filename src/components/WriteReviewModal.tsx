import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Check, PenLine, ShieldCheck } from 'lucide-react';
import { useRouter } from '../lib/router';
import { REAL_COLLEGES } from '../data/realColleges';
import { ReviewItem } from '../types';

interface WriteReviewModalProps {
  onReviewSubmitted?: (newReview: ReviewItem) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({ onReviewSubmitted }) => {
  const { writeReviewModalOpen, closeModals, targetReviewCollegeSlug } = useRouter();

  const [selectedCollegeSlug, setSelectedCollegeSlug] = useState<string>(
    targetReviewCollegeSlug || REAL_COLLEGES[0].slug
  );
  const [course, setCourse] = useState('');
  const [batchYear, setBatchYear] = useState('2025');
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [fullReview, setFullReview] = useState('');
  const [pro, setPro] = useState('');
  const [con, setCon] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!writeReviewModalOpen) return null;

  const currentCollege =
    REAL_COLLEGES.find((c) => c.slug === selectedCollegeSlug) || REAL_COLLEGES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || !course.trim()) return;

    const newReview: ReviewItem = {
      id: `rev-user-${Date.now()}`,
      collegeId: currentCollege.id,
      collegeSlug: currentCollege.slug,
      collegeName: currentCollege.name,
      studentRole: course.trim(),
      batchYear,
      rating,
      quote: quote.trim(),
      fullReview: fullReview.trim() || undefined,
      pros: pro.trim() ? [pro.trim()] : ['Supportive peer environment'],
      cons: con.trim() ? [con.trim()] : ['Administrative delays'],
      sentiment: rating >= 4 ? 'positive' : rating === 3 ? 'mixed' : 'negative',
      verifiedStudent: true,
      date: 'Just now',
      helpfulCount: 1,
      tags: ['Academics', 'Campus Life'],
    };

    if (onReviewSubmitted) {
      onReviewSubmitted(newReview);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeModals();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModals}
        className="fixed inset-0 bg-[#0B0D18]/50 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-[8px_8px_0px_#171A3A] border-2 border-[#171A3A] p-6 sm:p-8 max-h-[90vh] overflow-y-auto z-10"
      >
        <button
          onClick={closeModals}
          className="absolute top-5 right-5 p-2 text-[#171A3A]/60 hover:text-[#171A3A] border-2 border-[#171A3A]/10 hover:border-[#171A3A] rounded-full hover:bg-[#FAFAF7] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-[#18A673]/15 text-[#18A673] border-2 border-[#18A673] rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-3xl shadow-[3px_3px_0px_#18A673]">
              ✓
            </div>
            <h3 className="text-2xl font-black text-[#171A3A] tracking-tight">
              Thank you for contributing!
            </h3>
            <p className="text-sm text-[#171A3A]/70 mt-2 max-w-sm mx-auto">
              Your honest experience has been added to Dhariya's student review stream.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">
                Student Review Portal
              </span>
              <h3 className="text-2xl font-extrabold text-[#171A3A] tracking-tight">
                Share your unfiltered experience
              </h3>
              <p className="text-xs sm:text-sm text-[#171A3A]/65 mt-1">
                Real honesty helps juniors make better choices. Protected under Dhariya privacy standards.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* College Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#171A3A]/70 mb-1.5">
                  Select College / University
                </label>
                <select
                  value={selectedCollegeSlug}
                  onChange={(e) => setSelectedCollegeSlug(e.target.value)}
                  className="w-full p-3 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
                >
                  {REAL_COLLEGES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Course & Batch Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#171A3A]/70 mb-1.5">
                    Course / Degree Program
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech in CSE, MCA, B.Com"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full p-3 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-medium text-[#171A3A] placeholder-[#171A3A]/40 focus:outline-none focus:border-[#171A3A]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#171A3A]/70 mb-1.5">
                    Graduation Batch Year
                  </label>
                  <select
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full p-3 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
                  >
                    {['2027', '2026', '2025', '2024', '2023', '2022', '2021'].map((y) => (
                      <option key={y} value={y}>
                        Class of {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#171A3A]/70 mb-1.5">
                  Overall Student Experience Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-[#171A3A]/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-sm font-extrabold text-[#171A3A] ml-2">
                    {rating}.0 / 5.0
                  </span>
                </div>
              </div>

              {/* One Sentence Headline */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#171A3A]/70 mb-1.5">
                  One-sentence honest takeaway (Headline quote)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The coding culture is unbelievable, but hostel food is rough."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full p-3 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-medium text-[#171A3A] placeholder-[#171A3A]/40 focus:outline-none focus:border-[#171A3A]"
                />
              </div>

              {/* Detailed Advice */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#171A3A]/70 mb-1.5">
                  Detailed Advice for Junior Applicants
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details on faculty access, exams, placement reality checks, and city living..."
                  value={fullReview}
                  onChange={(e) => setFullReview(e.target.value)}
                  className="w-full p-3 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-medium text-[#171A3A] placeholder-[#171A3A]/40 focus:outline-none focus:border-[#171A3A]"
                />
              </div>

              {/* Quick Pro and Con */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#18A673] mb-1">
                    Biggest Positive (What you liked)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unbeatable ROI & club culture"
                    value={pro}
                    onChange={(e) => setPro(e.target.value)}
                    className="w-full p-2.5 bg-[#FAFAF7] border-2 border-[#18A673]/30 rounded-xl text-xs text-[#171A3A] focus:outline-none focus:border-[#18A673]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#E45757] mb-1">
                    Biggest Negative (The reality check)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Slow administrative paperwork"
                    value={con}
                    onChange={(e) => setCon(e.target.value)}
                    className="w-full p-2.5 bg-[#FAFAF7] border-2 border-[#E45757]/30 rounded-xl text-xs text-[#171A3A] focus:outline-none focus:border-[#E45757]"
                  />
                </div>
              </div>

              {/* Anonymous checkbox & terms */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#171A3A]/70">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-[#6C63FF] border-[#171A3A]/30"
                  />
                  <span>Post as Verified Student (Anonymous)</span>
                </label>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#171A3A]/50">Zero marketing spam</span>
              </div>

              {/* Submit button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#171A3A] hover:bg-[#6C63FF] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[3px_3px_0px_#6C63FF] border-2 border-[#171A3A] cursor-pointer"
                >
                  Submit verified experience
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
