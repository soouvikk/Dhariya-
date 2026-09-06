import React, { useState, useMemo } from 'react';
import { Search, Filter, X, SlidersHorizontal, RotateCcw, ArrowRight, Star, BookOpen, GraduationCap } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { CollegeCard } from '../components/CollegeCard';
import { REAL_COLLEGES } from '../data/realColleges';
import { REAL_COURSES } from '../data/realCourses';
import { REAL_EXAMS } from '../data/realExams';
import { College, FilterState } from '../types';
import { useRouter } from '../lib/router';

interface SearchResultsPageProps {
  initialQuery?: string;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ initialQuery = '' }) => {
  const { navigate, route } = useRouter();

  // Active query from props or URL query string
  const currentQuery = route.query.q !== undefined ? route.query.q : initialQuery;

  // Cross-entity matches
  const matchedCourses = useMemo(() => {
    const q = currentQuery.trim().toLowerCase();
    if (!q) return [];
    return REAL_COURSES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.overview.toLowerCase().includes(q)
    ).slice(0, 2);
  }, [currentQuery]);

  const matchedExams = useMemo(() => {
    const q = currentQuery.trim().toLowerCase();
    if (!q) return [];
    return REAL_EXAMS.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.shortName.toLowerCase().includes(q) ||
        e.participatingPrograms.some((p) => p.toLowerCase().includes(q))
    ).slice(0, 2);
  }, [currentQuery]);

  // Filter states
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'reviews'>('relevance');

  // Filtered colleges calculation
  const filteredColleges = useMemo(() => {
    const q = currentQuery.trim().toLowerCase();

    return REAL_COLLEGES.filter((col) => {
      // 1. Text Search matching
      if (q) {
        const matchesName = col.name.toLowerCase().includes(q);
        const matchesShort = col.shortName.toLowerCase().includes(q);
        const matchesLocation = col.location.toLowerCase().includes(q);
        const matchesPopular = col.popularCourse.toLowerCase().includes(q);
        const matchesCourses = col.courses.some((c) => c.name.toLowerCase().includes(q));

        if (!matchesName && !matchesShort && !matchesLocation && !matchesPopular && !matchesCourses) {
          return false;
        }
      }

      // 2. State filter
      if (selectedState !== 'All' && col.state !== selectedState) {
        return false;
      }

      // 3. Institution Type filter
      if (selectedType !== 'All' && col.type !== selectedType) {
        return false;
      }

      // 4. Rating filter
      if (minRating > 0 && col.rating < minRating) {
        return false;
      }

      // 5. Sentiment filter
      if (selectedSentiment !== 'All' && col.sentiment !== selectedSentiment) {
        return false;
      }

      // 6. Course filter
      if (selectedCourse !== 'All') {
        const hasCourse =
          col.popularCourse.toLowerCase().includes(selectedCourse.toLowerCase()) ||
          col.courses.some((c) => c.name.toLowerCase().includes(selectedCourse.toLowerCase()));
        if (!hasCourse) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0; // relevance preserves original priority order
    });
  }, [currentQuery, selectedState, selectedCourse, selectedType, minRating, selectedSentiment, sortBy]);

  const resetFilters = () => {
    setSelectedState('All');
    setSelectedCourse('All');
    setSelectedType('All');
    setMinRating(0);
    setSelectedSentiment('All');
    setSortBy('relevance');
  };

  const hasActiveFilters =
    selectedState !== 'All' ||
    selectedCourse !== 'All' ||
    selectedType !== 'All' ||
    minRating > 0 ||
    selectedSentiment !== 'All';

  return (
    <div className="w-full pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search header bar */}
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest block mb-1.5">
            Dhariya Research Explorer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171A3A] tracking-tight mb-4">
            {currentQuery ? `Results for “${currentQuery}”` : 'Discover Colleges & Programs'}
          </h1>
          <SearchBar
            variant="compact"
            initialQuery={currentQuery}
            onSearchSubmit={(newQ) => navigate(`/search?q=${encodeURIComponent(newQ)}`)}
          />
        </div>

        {/* Filter controls row */}
        <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 mb-8 shadow-[6px_6px_0px_#171A3A]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#171A3A]/15 text-xs text-[#171A3A]/70">
            <div className="flex items-center gap-2 font-black text-[#171A3A] uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-[#6C63FF]" />
              <span>Filters</span>
              <span className="text-xs font-normal text-[#171A3A]/60">
                ({filteredColleges.length} results)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-[#E45757] hover:underline font-bold uppercase tracking-wider cursor-pointer text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset filters</span>
                </button>
              )}

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl px-3 py-1 text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rating</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
            {/* Location / State */}
            <div>
              <label className="block text-[10px] font-bold text-[#171A3A]/70 uppercase tracking-widest mb-1.5">
                State / Region
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl p-2.5 text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
              >
                <option value="All">All States</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-[10px] font-bold text-[#171A3A]/70 uppercase tracking-widest mb-1.5">
                Course Stream
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl p-2.5 text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
              >
                <option value="All">All Courses</option>
                <option value="B.Tech">B.Tech / Engineering</option>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
                <option value="B.Com">Commerce (B.Com)</option>
                <option value="Economics">Economics / Arts</option>
                <option value="Law">Law (LL.B)</option>
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="block text-[10px] font-bold text-[#171A3A]/70 uppercase tracking-widest mb-1.5">
                Min Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl p-2.5 text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+ ★ (Top Tier)</option>
                <option value={4.0}>4.0+ ★ (Strong)</option>
                <option value={3.5}>3.5+ ★ (Average)</option>
              </select>
            </div>

            {/* Institution Type */}
            <div>
              <label className="block text-[10px] font-bold text-[#171A3A]/70 uppercase tracking-widest mb-1.5">
                Institution Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl p-2.5 text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
              >
                <option value="All">All Types</option>
                <option value="Public State">Public State</option>
                <option value="Institute of National Importance">INI (IIT / NIT)</option>
                <option value="Autonomous">Autonomous</option>
                <option value="Private">Private</option>
              </select>
            </div>

            {/* Student Sentiment */}
            <div>
              <label className="block text-[10px] font-bold text-[#171A3A]/70 uppercase tracking-widest mb-1.5">
                Student Sentiment
              </label>
              <select
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value)}
                className="w-full bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl p-2.5 text-xs font-bold text-[#171A3A] focus:outline-none focus:border-[#171A3A]"
              >
                <option value="All">All Sentiments</option>
                <option value="Highly Recommended">Highly Recommended</option>
                <option value="Mostly Positive">Mostly Positive</option>
                <option value="Mixed Sentiment">Mixed Sentiment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Matched Courses and Exams Shortcuts */}
        {(matchedCourses.length > 0 || matchedExams.length > 0) && (
          <div className="mb-8 space-y-3">
            {matchedCourses.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-[#6C63FF]/5 border-2 border-[#6C63FF]/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6C63FF] text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#6C63FF]/15 text-[#6C63FF]">
                        Course Curriculum
                      </span>
                      <h4 className="font-extrabold text-[#171A3A] text-sm">
                        {c.name} ({c.code})
                      </h4>
                    </div>
                    <p className="text-xs text-[#171A3A]/70 line-clamp-1 mt-0.5">
                      {c.overview}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/courses')}
                  className="px-3.5 py-1.5 bg-[#171A3A] hover:bg-[#6C63FF] text-white rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Explore Curriculum</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}

            {matchedExams.map((e) => (
              <div
                key={e.id}
                className="p-4 bg-amber-50/70 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        Entrance Exam
                      </span>
                      <h4 className="font-extrabold text-[#171A3A] text-sm">
                        {e.name} ({e.shortName})
                      </h4>
                    </div>
                    <p className="text-xs text-[#171A3A]/70 line-clamp-1 mt-0.5">
                      Conducting Body: {e.conductingBody} · {e.level} Level
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/exams')}
                  className="px-3.5 py-1.5 bg-[#171A3A] hover:bg-[#6C63FF] text-white rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Exam Details & Dates</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Results grid */}
        {filteredColleges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((col) => (
              <CollegeCard key={col.id} college={col} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-[#171A3A] shadow-[6px_6px_0px_#171A3A] max-w-lg mx-auto">
            <Search className="w-8 h-8 text-[#171A3A]/40 mx-auto mb-3" />
            <h3 className="text-xl font-black text-[#171A3A]">No matching colleges found</h3>
            <p className="text-xs sm:text-sm text-[#171A3A]/60 mt-1 mb-5">
              We couldn't find any institutions matching your exact combination of search query and filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 bg-[#171A3A] hover:bg-[#6C63FF] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-[3px_3px_0px_#6C63FF] border-2 border-[#171A3A] transition-all cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
