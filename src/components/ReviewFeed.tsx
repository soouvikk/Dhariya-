import React, { useState } from 'react';
import { PenLine, Filter, Sparkles } from 'lucide-react';
import { ReviewItem } from '../types';
import { ReviewCard } from './ReviewCard';
import { useRouter } from '../lib/router';

interface ReviewFeedProps {
  reviews: ReviewItem[];
  collegeSlug?: string;
  showCollegeLink?: boolean;
  title?: string;
  subtitle?: string;
}

const TAG_FILTERS = ['All', 'Placements', 'Campus Life', 'Academics', 'Administration', 'Hostel'];

export const ReviewFeed: React.FC<ReviewFeedProps> = ({
  reviews,
  collegeSlug,
  showCollegeLink = false,
  title = 'What students actually said',
  subtitle = 'Unedited student feedback across courses and batch years.',
}) => {
  const { openWriteReview } = useRouter();
  const [activeTag, setActiveTag] = useState('All');
  const [sortBy, setSortBy] = useState<'helpful' | 'recent'>('helpful');

  const filtered = reviews.filter((r) => {
    if (activeTag === 'All') return true;
    return r.tags.includes(activeTag);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
    return 0; // default order is chronological in mock data
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171A3A] tracking-tight">{title}</h2>
          <p className="text-sm text-[#171A3A]/60 mt-1">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => openWriteReview(collegeSlug)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#171A3A] hover:bg-[#6C63FF] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[3px_3px_0px_#6C63FF] border-2 border-[#171A3A] shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>Add review</span>
        </button>
      </div>

      {/* Filter pills & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#171A3A]/15">
        <div className="flex flex-wrap items-center gap-2">
          {TAG_FILTERS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2 border-[#171A3A] cursor-pointer ${
                activeTag === tag
                  ? 'bg-[#171A3A] text-white shadow-[2px_2px_0px_#6C63FF]'
                  : 'bg-white text-[#171A3A] hover:bg-[#FAFAF7]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171A3A]/70">
          <span>Sort:</span>
          <button
            onClick={() => setSortBy('helpful')}
            className={`cursor-pointer ${
              sortBy === 'helpful' ? 'text-[#6C63FF] underline decoration-2 underline-offset-4' : 'text-[#171A3A]/60 hover:text-[#171A3A]'
            }`}
          >
            Most Helpful
          </button>
          <span>·</span>
          <button
            onClick={() => setSortBy('recent')}
            className={`cursor-pointer ${
              sortBy === 'recent' ? 'text-[#6C63FF] underline decoration-2 underline-offset-4' : 'text-[#171A3A]/60 hover:text-[#171A3A]'
            }`}
          >
            Recent
          </button>
        </div>
      </div>

      {/* Grid of Reviews */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sorted.map((review) => (
            <ReviewCard key={review.id} review={review} showCollegeLink={showCollegeLink} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border-2 border-[#171A3A] shadow-[4px_4px_0px_#171A3A]">
          <p className="text-sm font-semibold text-[#171A3A]/70">No reviews found under "{activeTag}" yet.</p>
          <button
            onClick={() => setActiveTag('All')}
            className="mt-2 text-xs font-bold uppercase tracking-wider text-[#6C63FF] hover:underline cursor-pointer"
          >
            Show all reviews →
          </button>
        </div>
      )}
    </div>
  );
};
