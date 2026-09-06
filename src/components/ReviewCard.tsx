import React, { useState } from 'react';
import { ThumbsUp, CheckCircle2, Star, Quote } from 'lucide-react';
import { ReviewItem } from '../types';
import { useRouter } from '../lib/router';

interface ReviewCardProps {
  review: ReviewItem;
  showCollegeLink?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, showCollegeLink = false }) => {
  const { navigate } = useRouter();
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [hasVoted, setHasVoted] = useState(false);

  const toggleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount((c) => c + 1);
      setHasVoted(true);
    } else {
      setHelpfulCount((c) => c - 1);
      setHasVoted(false);
    }
  };

  return (
    <article className="group bg-white border-2 border-[#171A3A] hover:border-[#6C63FF] rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all shadow-[4px_4px_0px_#171A3A] hover:shadow-[6px_6px_0px_#6C63FF]">
      <div>
        {/* Header: Student Role, Batch Year & Verification */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-[#171A3A]">
                {review.studentRole}
              </span>
              <span className="text-xs text-[#171A3A]/30">·</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] bg-[#6C63FF]/10 px-2.5 py-0.5 rounded-full border border-[#6C63FF]/20">
                Class of {review.batchYear}
              </span>
            </div>

            {showCollegeLink && (
              <button
                type="button"
                onClick={() => navigate(`/colleges/${review.collegeSlug}`)}
                className="text-xs text-[#171A3A]/70 hover:text-[#6C63FF] transition-colors mt-1 font-bold uppercase tracking-tight block"
              >
                {review.collegeName} →
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {review.verifiedStudent && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#18A673] bg-[#18A673]/10 px-2.5 py-0.5 rounded-full border border-[#18A673]/25"
                title="Identity verified via student ID or university domain"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Verified</span>
              </span>
            )}
            <div className="flex items-center gap-1 text-xs font-extrabold text-[#171A3A] ml-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>{review.rating}.0</span>
            </div>
          </div>
        </div>

        {/* Big Editorial Quote */}
        <p className="font-serif text-base sm:text-lg text-[#0B0D18] italic font-medium leading-snug tracking-tight mb-3">
          “{review.quote}”
        </p>

        {/* Full Review Text (if available) */}
        {review.fullReview && (
          <p className="text-sm text-[#171A3A]/75 leading-relaxed font-normal mb-4">
            {review.fullReview}
          </p>
        )}

        {/* Pros & Cons pills if available */}
        {(review.pros.length > 0 || review.cons.length > 0) && (
          <div className="space-y-1.5 pt-3 border-t border-[#171A3A]/10">
            {review.pros[0] && (
              <div className="flex items-baseline gap-2 text-xs text-[#171A3A]/80 font-medium">
                <span className="text-[#18A673] font-extrabold">✓</span>
                <span>{review.pros[0]}</span>
              </div>
            )}
            {review.cons[0] && (
              <div className="flex items-baseline gap-2 text-xs text-[#171A3A]/80 font-medium">
                <span className="text-[#E45757] font-extrabold">✕</span>
                <span>{review.cons[0]}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: Date, Tags & Helpful Button */}
      <div className="mt-5 pt-3 border-t border-[#171A3A]/10 flex items-center justify-between text-xs text-[#171A3A]/50 font-medium">
        <div className="flex items-center gap-2">
          <span>{review.date}</span>
          {review.tags && review.tags.length > 0 && (
            <span className="hidden sm:inline-block text-[#171A3A]/30">·</span>
          )}
          <span className="hidden sm:inline-block text-[#171A3A]/60 font-semibold uppercase text-[10px] tracking-wider">
            {review.tags.slice(0, 2).join(', ')}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleHelpful}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2 border-[#171A3A] cursor-pointer ${
            hasVoted
              ? 'bg-[#6C63FF] text-white shadow-[2px_2px_0px_#171A3A]'
              : 'bg-[#FAFAF7] hover:bg-white text-[#171A3A] shadow-[2px_2px_0px_#171A3A]'
          }`}
        >
          <ThumbsUp className={`w-3 h-3 ${hasVoted ? 'fill-current' : ''}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </article>
  );
};
