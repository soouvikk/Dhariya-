import React, { useState } from 'react';
import { MessageSquareQuote, PenLine, Filter, Search } from 'lucide-react';
import { ReviewItem } from '../types';
import { REAL_COLLEGES } from '../data/realColleges';
import { ReviewCard } from '../components/ReviewCard';
import { useRouter } from '../lib/router';

interface ReviewsPageProps {
  reviews: ReviewItem[];
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ reviews }) => {
  const { openWriteReview } = useRouter();
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'helpful' | 'recent'>('helpful');

  const filtered = reviews.filter((r) => {
    if (selectedCollegeId !== 'All' && r.collegeId !== selectedCollegeId) return false;
    if (selectedTag !== 'All' && !r.tags.includes(selectedTag)) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchText =
        r.quote.toLowerCase().includes(q) ||
        (r.fullReview && r.fullReview.toLowerCase().includes(q)) ||
        r.collegeName.toLowerCase().includes(q) ||
        r.studentRole.toLowerCase().includes(q);
      if (!matchText) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
    return 0;
  });

  return (
    <div className="w-full pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/10 text-xs font-bold text-[#6C63FF] mb-2 uppercase tracking-wider border border-[#6C63FF]/25">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Unfiltered Student Commons</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171A3A] tracking-tight">
              What Students Actually Said
            </h1>
            <p className="text-sm text-[#171A3A]/65 mt-1">
              Read authentic feedback on faculty, hostels, administration, and placements.
            </p>
          </div>

          <button
            onClick={() => openWriteReview()}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#171A3A] hover:bg-[#6C63FF] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[3px_3px_0px_#6C63FF] border-2 border-[#171A3A] cursor-pointer self-start sm:self-auto"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Contribute review</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 mb-8 shadow-[6px_6px_0px_#171A3A]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search keywords inside reviews */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-[#171A3A]/70 uppercase tracking-widest mb-1.5">
                Search Review Keywords
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#171A3A]/50 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. hostel, placements, professors..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-medium text-[#171A3A] placeholder-[#171A3A]/40 focus:outline-none focus:border-[#171A3A]"
                />
              </div>
            </div>

            {/* Filter by College */}
            <div>
              <label className="block text-[10px] font-bold text-[#171A3A]/70 uppercase tracking-widest mb-1.5">
                Filter by College
              </label>
              <select
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(e.target.value)}
                className="w-full p-2.5 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
              >
                <option value="All">All Colleges</option>
                {REAL_COLLEGES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort & Tag */}
            <div>
              <label className="block text-[10px] font-bold text-[#171A3A]/70 uppercase tracking-widest mb-1.5">
                Focus Category Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full p-2.5 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
              >
                <option value="All">All Topics</option>
                <option value="Placements">Placements</option>
                <option value="Campus Life">Campus Life</option>
                <option value="Academics">Academics</option>
                <option value="Administration">Administration</option>
                <option value="Hostel">Hostel & Food</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sorted.map((review) => (
              <ReviewCard key={review.id} review={review} showCollegeLink={true} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-[#171A3A] shadow-[6px_6px_0px_#171A3A] max-w-md mx-auto">
            <p className="text-sm font-semibold text-[#171A3A]/70">No reviews found matching your search.</p>
            <button
              onClick={() => {
                setSelectedCollegeId('All');
                setSelectedTag('All');
                setSearchFilter('');
              }}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-[#6C63FF] hover:underline cursor-pointer"
            >
              Clear filters →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
