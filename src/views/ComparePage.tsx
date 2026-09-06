import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, ChevronDown, Check, X, ArrowRight, Star, GraduationCap, Building2 } from 'lucide-react';
import { REAL_COLLEGES } from '../data/realColleges';
import { College, PulseMetrics } from '../types';
import { useRouter } from '../lib/router';

const PULSE_KEYS: { key: keyof PulseMetrics; label: string }[] = [
  { key: 'campusLife', label: 'Campus Life' },
  { key: 'faculty', label: 'Faculty & Pedagogy' },
  { key: 'placements', label: 'Placement Depth' },
  { key: 'infrastructure', label: 'Campus Infrastructure' },
  { key: 'hostel', label: 'Hostel Quality' },
  { key: 'administration', label: 'Administration Speed' },
];

export const ComparePage: React.FC = () => {
  const { route, navigate } = useRouter();

  const c1Slug = route.query.c1 || 'jadavpur-university';
  const c2Slug = route.query.c2 || 'university-of-calcutta';

  const [college1, setCollege1] = useState<College>(
    () => REAL_COLLEGES.find((c) => c.slug === c1Slug) || REAL_COLLEGES[0]
  );
  const [college2, setCollege2] = useState<College>(
    () => REAL_COLLEGES.find((c) => c.slug === c2Slug) || REAL_COLLEGES[1]
  );

  const [drop1Open, setDrop1Open] = useState(false);
  const [drop2Open, setDrop2Open] = useState(false);

  return (
    <div className="w-full pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/10 text-xs font-semibold text-[#6C63FF] mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side College Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171A3A] tracking-tight">
            Compare Institutions Honestly
          </h1>
          <p className="text-sm text-[#171A3A]/60 mt-1.5 leading-relaxed">
            Select any two colleges to see real student sentiment scores, verified positives, honest pain points, and placement realities side by side.
          </p>
        </div>

        {/* COMPARISON CARDS / SELECTORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* College 1 Box */}
          <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 shadow-[6px_6px_0px_#171A3A] relative">
            <div className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest mb-2">
              Institution A
            </div>
            <button
              onClick={() => setDrop1Open(!drop1Open)}
              className="w-full flex items-center justify-between p-3.5 bg-[#FAFAF7] border-2 border-[#171A3A]/15 hover:border-[#171A3A] rounded-2xl transition-all text-left cursor-pointer"
            >
              <div>
                <div className="font-extrabold text-xl text-[#171A3A]">{college1.name}</div>
                <div className="text-xs text-[#171A3A]/60 mt-0.5">{college1.location}</div>
              </div>
              <ChevronDown className="w-5 h-5 text-[#171A3A]/50 shrink-0" />
            </button>

            {drop1Open && (
              <div className="absolute left-6 right-6 top-[110px] z-30 bg-white border-2 border-[#171A3A] rounded-2xl shadow-[6px_6px_0px_#171A3A] p-2 max-h-64 overflow-y-auto">
                {REAL_COLLEGES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCollege1(c);
                      setDrop1Open(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                      c.id === college1.id ? 'bg-[#6C63FF]/10 text-[#6C63FF]' : 'hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-xs text-[#171A3A]/60 shrink-0">★ {c.rating}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-[#171A3A]/70 pt-3 border-t border-[#171A3A]/15 font-semibold">
              <span>★ {college1.rating} ({college1.reviewCount} reviews)</span>
              <button
                onClick={() => navigate(`/colleges/${college1.slug}`)}
                className="text-[#6C63FF] font-bold uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* College 2 Box */}
          <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 shadow-[6px_6px_0px_#171A3A] relative">
            <div className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest mb-2">
              Institution B
            </div>
            <button
              onClick={() => setDrop2Open(!drop2Open)}
              className="w-full flex items-center justify-between p-3.5 bg-[#FAFAF7] border-2 border-[#171A3A]/15 hover:border-[#171A3A] rounded-2xl transition-all text-left cursor-pointer"
            >
              <div>
                <div className="font-extrabold text-xl text-[#171A3A]">{college2.name}</div>
                <div className="text-xs text-[#171A3A]/60 mt-0.5">{college2.location}</div>
              </div>
              <ChevronDown className="w-5 h-5 text-[#171A3A]/50 shrink-0" />
            </button>

            {drop2Open && (
              <div className="absolute left-6 right-6 top-[110px] z-30 bg-white border-2 border-[#171A3A] rounded-2xl shadow-[6px_6px_0px_#171A3A] p-2 max-h-64 overflow-y-auto">
                {REAL_COLLEGES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCollege2(c);
                      setDrop2Open(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                      c.id === college2.id ? 'bg-[#6C63FF]/10 text-[#6C63FF]' : 'hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-xs text-[#171A3A]/60 shrink-0">★ {c.rating}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-[#171A3A]/70 pt-3 border-t border-[#171A3A]/15 font-semibold">
              <span>★ {college2.rating} ({college2.reviewCount} reviews)</span>
              <button
                onClick={() => navigate(`/colleges/${college2.slug}`)}
                className="text-[#6C63FF] font-bold uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* COMPARISON SPEC TABLE */}
        <div className="bg-white border-2 border-[#171A3A] rounded-3xl overflow-hidden shadow-[6px_6px_0px_#171A3A] mb-10">
          <div className="p-5 sm:p-6 bg-[#FAFAF7] border-b-2 border-[#171A3A] flex items-center justify-between">
            <h3 className="font-black text-lg text-[#171A3A] uppercase tracking-wider">Student Pulse Ratings (1.0 – 5.0)</h3>
            <span className="text-xs font-bold uppercase tracking-wider text-[#171A3A]/60">Live verified scores</span>
          </div>

          <div className="divide-y divide-[#171A3A]/15">
            {PULSE_KEYS.map(({ key, label }) => {
              const score1 = college1.pulse[key];
              const score2 = college2.pulse[key];
              const winner = score1 > score2 ? 'c1' : score1 < score2 ? 'c2' : 'tie';

              return (
                <div key={key} className="p-4 sm:p-5 grid grid-cols-12 items-center text-sm gap-2">
                  <div className="col-span-4 sm:col-span-3 font-bold uppercase tracking-wider text-[#171A3A]/80 text-[11px] sm:text-xs">
                    {label}
                  </div>

                  <div className="col-span-4 sm:col-span-4 flex items-center gap-2">
                    <span
                      className={`font-mono font-bold text-base ${
                        winner === 'c1' ? 'text-[#18A673]' : 'text-[#171A3A]'
                      }`}
                    >
                      {score1.toFixed(1)}
                    </span>
                    {winner === 'c1' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#18A673] bg-[#18A673]/10 border border-[#18A673]/30 px-1.5 py-0.5 rounded">
                        Higher
                      </span>
                    )}
                  </div>

                  <div className="col-span-4 sm:col-span-5 flex items-center gap-2">
                    <span
                      className={`font-mono font-bold text-base ${
                        winner === 'c2' ? 'text-[#18A673]' : 'text-[#171A3A]'
                      }`}
                    >
                      {score2.toFixed(1)}
                    </span>
                    {winner === 'c2' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#18A673] bg-[#18A673]/10 border border-[#18A673]/30 px-1.5 py-0.5 rounded">
                        Higher
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FINANCIAL & RECRUITER REALITY COMPARISON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 shadow-[6px_6px_0px_#171A3A]">
            <h3 className="text-base font-extrabold text-[#171A3A] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#6C63FF]" />
              <span>Placement & Fees ({college1.shortName})</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#171A3A]/15">
                <span className="text-[#171A3A]/70 font-medium">Median CTC</span>
                <span className="font-mono font-bold text-[#171A3A]">{college1.placementStats.medianCtc}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#171A3A]/15">
                <span className="text-[#171A3A]/70 font-medium">Tuition Tier</span>
                <span className="font-bold text-[#171A3A]">{college1.tuitionTier}</span>
              </div>
              <div className="py-1 text-xs text-[#171A3A]/80 leading-relaxed">
                <strong className="text-[#171A3A] uppercase tracking-wider block mb-0.5">Recruiter Reality:</strong>
                {college1.placementStats.realityCheckNote}
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 shadow-[6px_6px_0px_#171A3A]">
            <h3 className="text-base font-extrabold text-[#171A3A] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#6C63FF]" />
              <span>Placement & Fees ({college2.shortName})</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#171A3A]/15">
                <span className="text-[#171A3A]/70 font-medium">Median CTC</span>
                <span className="font-mono font-bold text-[#171A3A]">{college2.placementStats.medianCtc}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#171A3A]/15">
                <span className="text-[#171A3A]/70 font-medium">Tuition Tier</span>
                <span className="font-bold text-[#171A3A]">{college2.tuitionTier}</span>
              </div>
              <div className="py-1 text-xs text-[#171A3A]/80 leading-relaxed">
                <strong className="text-[#171A3A] uppercase tracking-wider block mb-0.5">Recruiter Reality:</strong>
                {college2.placementStats.realityCheckNote}
              </div>
            </div>
          </div>
        </div>

        {/* AI COMPARATIVE SYNTHESIS */}
        <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#6C63FF]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6C63FF]" />
            <h3 className="text-base font-extrabold text-[#171A3A] uppercase tracking-wider">Dhariya Comparative Synthesis</h3>
          </div>
          <p className="text-sm sm:text-base text-[#171A3A]/80 leading-relaxed font-normal">
            Choose <strong>{college1.shortName}</strong> if you prioritize {college1.aiSummary.keyHighlight.toLowerCase()} and value {college1.pros[0]?.text.toLowerCase() || 'peer intellect'}. Choose <strong>{college2.shortName}</strong> if you lean towards {college2.aiSummary.keyHighlight.toLowerCase()} or specific postgraduate track advantages.
          </p>
        </div>
      </div>
    </div>
  );
};
