import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Search,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Building,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { REAL_EXAMS } from '../data/realExams';
import { EntranceExam } from '../types';
import { useRouter } from '../lib/router';

export const ExamsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'All' | 'National' | 'State'>('All');
  const [degreeFilter, setDegreeFilter] = useState<'All' | 'UG' | 'PG'>('All');

  const filteredExams = REAL_EXAMS.filter((exam) => {
    const matchesSearch =
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.conductingBody.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.participatingPrograms.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = levelFilter === 'All' || exam.level === levelFilter;
    const matchesDegree = degreeFilter === 'All' || exam.degreeLevel === degreeFilter;

    return matchesSearch && matchesLevel && matchesDegree;
  });

  return (
    <div className="w-full pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/10 text-xs font-semibold text-[#6C63FF] mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Verified Testing Bodies & Cutoff Windows</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A3A] tracking-tight">
            Entrance Exams & Deadlines
          </h1>
          <p className="text-sm sm:text-base text-[#171A3A]/70 mt-2 leading-relaxed">
            Direct statutory intelligence on national and state-level engineering, MCA, MBA, and medical entrance tests. Links directly to official gazetted portals.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-[#171A3A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exam (JEE, WBJEE, CAT, GATE)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#171A3A] rounded-xl shadow-[3px_3px_0px_#171A3A] text-sm text-[#0B0D18] placeholder:text-[#171A3A]/40 focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Level selector */}
            <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-[#171A3A] rounded-xl shadow-xs">
              {(['All', 'National', 'State'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    levelFilter === lvl
                      ? 'bg-[#171A3A] text-white'
                      : 'text-[#171A3A]/70 hover:text-[#171A3A]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Degree selector */}
            <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-[#171A3A] rounded-xl shadow-xs">
              {(['All', 'UG', 'PG'] as const).map((deg) => (
                <button
                  key={deg}
                  onClick={() => setDegreeFilter(deg)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    degreeFilter === deg
                      ? 'bg-[#6C63FF] text-white'
                      : 'text-[#171A3A]/70 hover:text-[#171A3A]'
                  }`}
                >
                  {deg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map((exam) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#171A3A] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#171A3A] text-white">
                      {exam.level} Level
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/30">
                      {exam.degreeLevel} Admissions
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#18A673]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified {exam.academicYear}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-[#171A3A] tracking-tight mb-1">
                  {exam.name}
                </h3>
                <div className="text-xs font-semibold text-[#171A3A]/60 mb-4">
                  Conducting Body: <span className="text-[#171A3A] font-bold">{exam.conductingBody}</span>
                </div>

                {/* Eligibility Excerpt */}
                <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15 mb-4">
                  <span className="text-[10px] font-bold text-[#171A3A]/50 uppercase tracking-widest block mb-1">
                    Statutory Eligibility Criteria
                  </span>
                  <p className="text-xs text-[#171A3A]/80 font-medium leading-relaxed">
                    {exam.eligibilitySummary}
                  </p>
                </div>

                {/* Key Timeline Dates */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#171A3A] mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#6C63FF]" />
                    <span>Key Examination Milestones:</span>
                  </div>
                  <div className="space-y-1.5">
                    {exam.importantDates.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white border border-[#171A3A]/10"
                      >
                        <span className="text-[#171A3A]/70 font-medium">{item.event}</span>
                        <span className="font-mono font-bold text-[#171A3A] text-[11px]">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participating Programs */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-[#171A3A]/50 uppercase tracking-widest block mb-1.5">
                    Admitting Degrees ({exam.participatingCollegeCount}+ institutions)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exam.participatingPrograms.map((prog, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#171A3A]/10 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={exam.officialWebsite}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs font-bold text-[#171A3A] hover:text-[#6C63FF] flex items-center gap-1 transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(exam.shortName)}`)}
                  className="px-4 py-2 bg-[#171A3A] hover:bg-[#6C63FF] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_#6C63FF] cursor-pointer"
                >
                  <span>Accepting Colleges</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
