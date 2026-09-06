import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowUpRight, GraduationCap, BookOpen, Sparkles, Tag, School } from 'lucide-react';
import { useRouter } from '../lib/router';
import { REAL_COLLEGES } from '../data/realColleges';
import { REAL_COURSES } from '../data/realCourses';
import { REAL_EXAMS } from '../data/realExams';
import { REAL_OFFERS } from '../data/realOffers';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  initialQuery?: string;
  onSearchSubmit?: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = 'hero',
  initialQuery = '',
  onSearchSubmit,
  className = '',
}) => {
  const { navigate } = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync when initialQuery changes externally
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Compute matched colleges, courses, exams, & offers
  const trimmed = query.trim().toLowerCase();

  const matchedColleges = trimmed.length > 0
    ? REAL_COLLEGES.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.shortName.toLowerCase().includes(trimmed) ||
          c.location.toLowerCase().includes(trimmed) ||
          c.popularCourse.toLowerCase().includes(trimmed) ||
          c.courses.some((course) => course.name.toLowerCase().includes(trimmed))
      ).slice(0, 3)
    : REAL_COLLEGES.slice(0, 2);

  const matchedCourses = trimmed.length > 0
    ? REAL_COURSES.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.code.toLowerCase().includes(trimmed) ||
          c.slug.toLowerCase().includes(trimmed)
      ).slice(0, 2)
    : REAL_COURSES.slice(0, 2);

  const matchedExams = trimmed.length > 0
    ? REAL_EXAMS.filter(
        (e) =>
          e.name.toLowerCase().includes(trimmed) ||
          e.shortName.toLowerCase().includes(trimmed) ||
          e.slug.toLowerCase().includes(trimmed)
      ).slice(0, 2)
    : [];

  const matchedOffers = trimmed.length > 0
    ? REAL_OFFERS.filter(
        (o) =>
          o.title.toLowerCase().includes(trimmed) ||
          o.provider.toLowerCase().includes(trimmed) ||
          (o.couponCode && o.couponCode.toLowerCase().includes(trimmed))
      ).slice(0, 1)
    : [];

  const allSuggestions = [
    ...matchedColleges.map((c) => ({
      id: `col-${c.slug}`,
      title: c.name,
      subtitle: `${c.location} · ${c.tuitionTier} · Est. ${c.establishedYear}`,
      type: 'college' as const,
      url: `/colleges/${c.slug}`,
      rating: c.rating,
      sentiment: c.sentiment,
    })),
    ...matchedCourses.map((c) => ({
      id: `course-${c.slug}`,
      title: `${c.name} (${c.code})`,
      subtitle: `${c.degreeLevel} · Avg: ${c.averageFeeRange} · ${c.collegesOfferingCount}+ Colleges`,
      type: 'course' as const,
      url: `/courses/${c.slug}`,
      rating: undefined,
      sentiment: undefined,
    })),
    ...matchedExams.map((e) => ({
      id: `exam-${e.slug}`,
      title: `${e.name} (${e.shortName})`,
      subtitle: `${e.level} Entrance · ${e.participatingCollegeCount} Colleges`,
      type: 'exam' as const,
      url: `/exams/${e.slug}`,
      rating: undefined,
      sentiment: undefined,
    })),
    ...matchedOffers.map((o) => ({
      id: `offer-${o.slug}`,
      title: o.title,
      subtitle: `${o.provider} · ${o.discountValue}`,
      type: 'offer' as const,
      url: `/offers`,
      rating: undefined,
      sentiment: undefined,
    })),
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
        handleSelectSuggestion(allSuggestions[selectedIndex]);
      } else if (query.trim()) {
        executeSearch(query.trim());
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const executeSearch = (searchVal: string) => {
    setIsFocused(false);
    if (onSearchSubmit) {
      onSearchSubmit(searchVal);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleSelectSuggestion = (item: (typeof allSuggestions)[number]) => {
    setIsFocused(false);
    if (item.url) {
      navigate(item.url);
    } else {
      executeSearch(item.title);
    }
  };

  const isHero = variant === 'hero';

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <motion.div
        animate={{
          scale: isFocused && isHero ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`relative flex items-center bg-white border-2 border-[#171A3A] rounded-2xl transition-all ${
          isHero
            ? isFocused
              ? 'shadow-[6px_6px_0px_#6C63FF] border-[#6C63FF] p-2.5 sm:p-3 min-h-[64px]'
              : 'shadow-[6px_6px_0px_#171A3A] hover:shadow-[8px_8px_0px_#171A3A] p-2.5 sm:p-3 min-h-[64px]'
            : isFocused
            ? 'shadow-[3px_3px_0px_#6C63FF] border-[#6C63FF] p-1.5 min-h-[46px]'
            : 'shadow-[3px_3px_0px_#171A3A] p-1.5 min-h-[46px]'
        }`}
      >
        <div className={`flex items-center justify-center text-[#171A3A]/50 pl-3 ${isHero ? 'text-xl' : 'text-base'}`}>
          <Search className={isHero ? 'w-5 h-5 text-[#171A3A]' : 'w-4 h-4 text-[#171A3A]'} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search a college, course, or education program..."
          className={`w-full bg-transparent pl-3 pr-8 text-[#0B0D18] font-medium placeholder:text-[#171A3A]/40 placeholder:font-normal focus:outline-none ${
            isHero ? 'text-base sm:text-lg' : 'text-sm'
          }`}
          aria-label="Search colleges, courses, or programs"
          autoComplete="off"
          spellCheck="false"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1.5 mr-1 text-[#171A3A]/40 hover:text-[#171A3A] transition-colors rounded-full hover:bg-[#FAFAF7]"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isHero && !query && (
          <span className="hidden sm:inline-block bg-[#FAFAF7] px-2.5 py-1 rounded text-[10px] font-bold uppercase text-[#171A3A]/50 border border-[#171A3A]/15 mr-2 shrink-0">
            Enter ↵
          </span>
        )}

        <button
          type="button"
          onClick={() => executeSearch(query || 'Jadavpur University')}
          className={`flex items-center justify-center font-bold uppercase tracking-tight rounded-xl transition-all cursor-pointer ${
            isHero
              ? 'px-5 py-2.5 text-xs bg-[#171A3A] text-white hover:bg-[#6C63FF] shadow-xs'
              : 'px-3 py-1.5 text-xs bg-[#171A3A] text-white hover:bg-[#6C63FF]'
          }`}
        >
          <span>Search</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-1 hidden sm:inline-block" />
        </button>
      </motion.div>

      {/* Quick category hints below hero search - Editorial Uppercase Wide */}
      {isHero && (
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-[11px] font-bold uppercase tracking-widest text-[#171A3A]/60">
          <button
            type="button"
            onClick={() => executeSearch('University')}
            className="hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            Colleges
          </button>
          <span className="text-[#171A3A]/20">·</span>
          <button
            type="button"
            onClick={() => executeSearch('Course')}
            className="hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            Courses
          </button>
          <span className="text-[#171A3A]/20">·</span>
          <button
            type="button"
            onClick={() => executeSearch('Coaching')}
            className="hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            Coaching
          </button>
          <span className="text-[#171A3A]/20">·</span>
          <button
            type="button"
            onClick={() => executeSearch('Online')}
            className="hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            Online Programs
          </button>
        </div>
      )}

      {/* Interactive Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.99 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-full mt-3 z-50 bg-white border-2 border-[#171A3A] rounded-2xl shadow-[6px_6px_0px_#171A3A] overflow-hidden backdrop-blur-md"
          >
            <div className="p-2 border-b border-[#171A3A]/5 bg-[#FAFAF7]/60 flex items-center justify-between text-[11px] font-medium text-[#171A3A]/60 px-3">
              <span>{trimmed ? 'Matching Colleges & Courses' : 'Suggested for you'}</span>
              <span className="hidden sm:inline text-[#171A3A]/40">Use ↑↓ to navigate · Enter to select</span>
            </div>

            <div className="max-h-[340px] overflow-y-auto p-1.5">
              {allSuggestions.length > 0 ? (
                allSuggestions.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#6C63FF]/10 text-[#171A3A]' : 'hover:bg-[#FAFAF7] text-[#0B0D18]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            item.type === 'college'
                              ? 'bg-[#171A3A]/5 text-[#171A3A]'
                              : item.type === 'course'
                              ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                              : item.type === 'exam'
                              ? 'bg-[#E58A00]/10 text-[#E58A00]'
                              : 'bg-[#18A673]/10 text-[#18A673]'
                          }`}
                        >
                          {item.type === 'college' && <School className="w-4 h-4" />}
                          {item.type === 'course' && <BookOpen className="w-4 h-4" />}
                          {item.type === 'exam' && <GraduationCap className="w-4 h-4" />}
                          {item.type === 'offer' && <Tag className="w-4 h-4" />}
                        </div>
                        <div className="truncate">
                          <div className="text-sm font-medium tracking-tight text-[#0B0D18] flex items-center gap-2">
                            <span>{item.title}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-[#FAFAF7] text-[#171A3A]/60 border border-[#171A3A]/10">
                              {item.type}
                            </span>
                            {item.rating && (
                              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#FAFAF7] text-[#171A3A] border border-[#171A3A]/10">
                                ★ {item.rating}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#171A3A]/50 truncate mt-0.5">{item.subtitle}</div>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        <span className="text-xs text-[#6C63FF] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100">
                          <span>{item.type === 'college' ? 'Explore' : 'Search'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm text-[#171A3A]/60">
                  <p>No direct matches found for "{query}".</p>
                  <button
                    type="button"
                    onClick={() => executeSearch(query)}
                    className="mt-2 text-xs font-semibold text-[#6C63FF] hover:underline"
                  >
                    Press Enter to search all institutions & programs →
                  </button>
                </div>
              )}
            </div>

            {/* Quick shortcuts */}
            <div className="p-2.5 bg-[#FAFAF7] border-t border-[#171A3A]/5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#171A3A]/70">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#6C63FF]" />
                <span>Popular right now:</span>
              </span>
              <div className="flex items-center gap-2">
                {['Jadavpur University', 'University of Calcutta', 'BCA', 'MCA'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setQuery(sug);
                      executeSearch(sug);
                    }}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#171A3A]/10 hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors text-[11px]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
