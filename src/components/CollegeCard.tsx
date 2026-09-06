import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Sparkles, BookOpen, Users, Star, CheckCircle } from 'lucide-react';
import { College } from '../types';
import { useRouter } from '../lib/router';
import { CollegeImage } from './CollegeImage';

interface CollegeCardProps {
  college: College;
  featured?: boolean;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college, featured = false }) => {
  const { navigate } = useRouter();

  const handleCardClick = () => {
    navigate(`/colleges/${college.slug}`);
  };

  const getSentimentBadge = (sentiment: College['sentiment']) => {
    switch (sentiment) {
      case 'Highly Recommended':
        return 'text-[#18A673] bg-[#18A673]/10 border-[#18A673]/20';
      case 'Mostly Positive':
        return 'text-[#18A673] bg-[#18A673]/10 border-[#18A673]/20';
      case 'Mixed Sentiment':
        return 'text-[#E45757] bg-[#E45757]/10 border-[#E45757]/20';
      default:
        return 'text-[#6C63FF] bg-[#6C63FF]/10 border-[#6C63FF]/20';
    }
  };

  if (featured) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={handleCardClick}
        className="group relative bg-white border-2 border-[#171A3A] hover:border-[#6C63FF] rounded-3xl cursor-pointer shadow-[6px_6px_0px_#171A3A] hover:shadow-[8px_8px_0px_#6C63FF] transition-all overflow-hidden flex flex-col justify-between"
      >
        <div className="relative">
          <CollegeImage
            coverImageUrl={college.coverImageUrl}
            logoUrl={college.logoUrl}
            collegeName={college.name}
            shortName={college.shortName}
            aspect="wide"
            className="rounded-t-[22px]"
          />

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#6C63FF] bg-[#6C63FF]/10 px-3 py-1 rounded-full border border-[#6C63FF]/25">
                  Featured Institution
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#18A673] bg-[#18A673]/10 px-2.5 py-0.5 rounded-full border border-[#18A673]/20">
                  <CheckCircle className="w-3 h-3" />
                  Verified 2026
                </span>
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getSentimentBadge(
                  college.sentiment
                )}`}
              >
                {college.sentiment}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171A3A] group-hover:text-[#6C63FF] transition-colors tracking-tight">
                {college.name}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#171A3A]/60 mt-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#171A3A]/40 shrink-0" />
              <span>{college.location}</span>
              <span className="mx-1 text-[#171A3A]/20">·</span>
              <span className="text-[#171A3A]/60">{college.type}</span>
              <span className="mx-1 text-[#171A3A]/20">·</span>
              <span className="text-[#171A3A]/80 font-bold">{college.tuitionTier}</span>
            </div>

            {/* Rating & Review Count */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#171A3A]/10">
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold text-[#171A3A]">{college.rating}</span>
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
              <span className="text-xs text-[#171A3A]/40">·</span>
              <span className="text-xs text-[#171A3A]/70 font-semibold uppercase tracking-tight">
                {college.reviewCount.toLocaleString()} verified student experiences
              </span>
            </div>

            {/* AI Take preview */}
            <p className="text-sm text-[#171A3A]/80 mt-3.5 line-clamp-2 leading-relaxed font-normal italic">
              "{college.aiSummary.take}"
            </p>

            {/* Key tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#FAFAF7] border border-[#171A3A]/15 text-[#171A3A] font-semibold px-3 py-1 rounded-lg">
                <BookOpen className="w-3 h-3 text-[#6C63FF]" />
                <span>{college.popularCourse}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-[#FAFAF7] border border-[#171A3A]/15 text-[#171A3A] font-semibold px-3 py-1 rounded-lg">
                <span>Median: {college.placementStats.medianCtc}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-[#171A3A]/10 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#171A3A]/60 group-hover:text-[#6C63FF] transition-colors">
            Explore verified details & eligibility
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-tight text-[#171A3A] group-hover:text-[#6C63FF] transition-colors">
            <span>View experiences</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </motion.div>
    );
  }

  // Standard Card Format
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={handleCardClick}
      className="group bg-white border-2 border-[#171A3A] hover:border-[#6C63FF] rounded-3xl cursor-pointer shadow-[4px_4px_0px_#171A3A] hover:shadow-[6px_6px_0px_#6C63FF] transition-all flex flex-col justify-between overflow-hidden"
    >
      <div>
        <div className="relative">
          <CollegeImage
            coverImageUrl={college.coverImageUrl}
            logoUrl={college.logoUrl}
            collegeName={college.name}
            shortName={college.shortName}
            aspect="video"
            className="rounded-t-[22px] max-h-36"
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getSentimentBadge(
                college.sentiment
              )}`}
            >
              {college.sentiment}
            </span>
            <div className="flex items-center gap-1 text-xs font-extrabold text-[#171A3A]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>{college.rating}</span>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-[#171A3A] group-hover:text-[#6C63FF] transition-colors tracking-tight leading-snug">
            {college.name}
          </h3>

          <div className="flex items-center gap-1 text-xs text-[#171A3A]/60 mt-1 truncate font-medium">
            <MapPin className="w-3 h-3 text-[#171A3A]/40 shrink-0" />
            <span className="truncate">{college.location}</span>
            <span className="text-[#171A3A]/30">·</span>
            <span className="text-[#171A3A]/70 font-semibold">{college.tuitionTier}</span>
          </div>

          <div className="mt-3 text-xs text-[#171A3A]/70 flex items-center justify-between font-medium">
            <span className="font-bold text-[#171A3A]">{college.reviewCount} experiences</span>
            <span className="text-[#171A3A]/30">·</span>
            <span className="text-xs text-[#171A3A]/80 font-bold truncate max-w-[140px]">
              {college.popularCourse}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-4 pt-3 border-t border-[#171A3A]/15 flex items-center justify-between text-xs font-bold uppercase tracking-tight text-[#171A3A] group-hover:text-[#6C63FF] transition-colors">
        <span>View experiences</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};
