import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown, Check, Scale } from 'lucide-react';
import { College } from '../types';
import { REAL_COLLEGES } from '../data/realColleges';
import { useRouter } from '../lib/router';

interface ComparisonProps {
  defaultCollegeA?: College;
  defaultCollegeB?: College;
  className?: string;
}

const COMPARISON_METRICS: { key: keyof College['pulse']; label: string }[] = [
  { key: 'campusLife', label: 'Campus Life' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'placements', label: 'Placements' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'hostel', label: 'Hostel' },
  { key: 'administration', label: 'Administration' },
];

export const Comparison: React.FC<ComparisonProps> = ({
  defaultCollegeA,
  defaultCollegeB,
  className = '',
}) => {
  const { navigate } = useRouter();

  // Pick two distinct colleges by default
  const [collegeA, setCollegeA] = useState<College>(defaultCollegeA || REAL_COLLEGES[0]);
  const [collegeB, setCollegeB] = useState<College>(
    defaultCollegeB || REAL_COLLEGES.find((c) => c.id !== (defaultCollegeA?.id || REAL_COLLEGES[0].id)) || REAL_COLLEGES[1]
  );

  const [dropdownAOpen, setDropdownAOpen] = useState(false);
  const [dropdownBOpen, setDropdownBOpen] = useState(false);

  const handleGoToFullComparison = () => {
    navigate(`/compare?c1=${collegeA.slug}&c2=${collegeB.slug}`);
  };

  return (
    <div className={`w-full bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[6px_6px_0px_#171A3A] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Scale className="w-4 h-4 text-[#6C63FF]" />
            <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest">Side-by-side</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171A3A] tracking-tight">Still deciding?</h2>
          <p className="text-sm text-[#171A3A]/70 mt-1">
            Compare student sentiment, ratings, and living realities head-to-head.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoToFullComparison}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#171A3A] hover:bg-[#6C63FF] text-white text-xs font-bold uppercase tracking-tight rounded-full transition-all shadow-xs cursor-pointer shrink-0"
        >
          <span>Compare in depth</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Column Selector & Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 pb-6 border-b border-[#171A3A]/10">
        {/* College A */}
        <div className="relative">
          <div className="text-[10px] font-bold text-[#171A3A]/60 uppercase tracking-widest mb-2">
            Option 01
          </div>
          <button
            type="button"
            onClick={() => {
              setDropdownAOpen(!dropdownAOpen);
              setDropdownBOpen(false);
            }}
            className="w-full flex items-center justify-between p-3.5 bg-[#FAFAF7] border-2 border-[#171A3A]/15 hover:border-[#171A3A] rounded-2xl transition-all text-left cursor-pointer"
          >
            <div>
              <div className="font-extrabold text-base sm:text-lg text-[#171A3A] tracking-tight">{collegeA.name}</div>
              <div className="text-xs text-[#171A3A]/60 mt-0.5">{collegeA.location}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-extrabold text-[#171A3A]">★ {collegeA.rating}</span>
              <ChevronDown className="w-4 h-4 text-[#171A3A]/60" />
            </div>
          </button>

          {dropdownAOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white border-2 border-[#171A3A] rounded-2xl shadow-[6px_6px_0px_#171A3A] p-2 max-h-60 overflow-y-auto">
              {REAL_COLLEGES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCollegeA(c);
                    setDropdownAOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    c.id === collegeA.id ? 'bg-[#6C63FF]/10 text-[#6C63FF]' : 'hover:bg-[#FAFAF7]'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[11px] text-[#171A3A]/60 shrink-0 ml-2">★ {c.rating}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* College B */}
        <div className="relative">
          <div className="text-[10px] font-bold text-[#171A3A]/60 uppercase tracking-widest mb-2">
            Option 02 (Compare against)
          </div>
          <button
            type="button"
            onClick={() => {
              setDropdownBOpen(!dropdownBOpen);
              setDropdownAOpen(false);
            }}
            className="w-full flex items-center justify-between p-3.5 bg-[#FAFAF7] border-2 border-[#171A3A]/15 hover:border-[#171A3A] rounded-2xl transition-all text-left cursor-pointer"
          >
            <div>
              <div className="font-extrabold text-base sm:text-lg text-[#171A3A] tracking-tight">{collegeB.name}</div>
              <div className="text-xs text-[#171A3A]/60 mt-0.5">{collegeB.location}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-extrabold text-[#171A3A]">★ {collegeB.rating}</span>
              <ChevronDown className="w-4 h-4 text-[#171A3A]/60" />
            </div>
          </button>

          {dropdownBOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white border-2 border-[#171A3A] rounded-2xl shadow-[6px_6px_0px_#171A3A] p-2 max-h-60 overflow-y-auto">
              {REAL_COLLEGES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCollegeB(c);
                    setDropdownBOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                    c.id === collegeB.id ? 'bg-[#6C63FF]/10 text-[#6C63FF]' : 'hover:bg-[#FAFAF7]'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[11px] text-[#171A3A]/60 shrink-0 ml-2">★ {c.rating}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Head to Head Pulse Bars */}
      <div className="mt-6 space-y-4">
        {COMPARISON_METRICS.map(({ key, label }) => {
          const scoreA = collegeA.pulse[key];
          const scoreB = collegeB.pulse[key];
          const delta = scoreA - scoreB;
          const aIsHigher = delta > 0.05;
          const bIsHigher = delta < -0.05;

          return (
            <div key={key} className="py-2">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-sm text-[#171A3A]">
                  {scoreA.toFixed(1)}
                  {aIsHigher && <span className="text-[10px] text-[#18A673] ml-1 font-semibold">▲</span>}
                </span>
                <span className="font-semibold text-xs text-[#171A3A]/70 uppercase tracking-wider">
                  {label}
                </span>
                <span className="font-bold text-sm text-[#171A3A]">
                  {scoreB.toFixed(1)}
                  {bIsHigher && <span className="text-[10px] text-[#18A673] ml-1 font-semibold">▲</span>}
                </span>
              </div>

              {/* Opposing duel bars */}
              <div className="grid grid-cols-2 gap-3 items-center">
                {/* Left Bar (College A) */}
                <div className="h-2 w-full bg-[#171A3A]/5 rounded-full overflow-hidden flex justify-end">
                  <motion.div
                    key={`barA-${collegeA.id}-${key}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(scoreA / 5) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${
                      aIsHigher ? 'bg-[#18A673]' : 'bg-[#6C63FF]'
                    }`}
                  />
                </div>

                {/* Right Bar (College B) */}
                <div className="h-2 w-full bg-[#171A3A]/5 rounded-full overflow-hidden flex justify-start">
                  <motion.div
                    key={`barB-${collegeB.id}-${key}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(scoreB / 5) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${
                      bIsHigher ? 'bg-[#18A673]' : 'bg-[#A79BFF]'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Snapshot quick summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#171A3A]/8 text-xs text-[#171A3A]/75">
        <div className="p-3 bg-[#FAFAF7] rounded-xl">
          <span className="font-bold text-[#171A3A] block mb-1">Median CTC & Fees ({collegeA.shortName}):</span>
          <span>{collegeA.placementStats.medianCtc} · {collegeA.tuitionTier}</span>
        </div>
        <div className="p-3 bg-[#FAFAF7] rounded-xl">
          <span className="font-bold text-[#171A3A] block mb-1">Median CTC & Fees ({collegeB.shortName}):</span>
          <span>{collegeB.placementStats.medianCtc} · {collegeB.tuitionTier}</span>
        </div>
      </div>
    </div>
  );
};
