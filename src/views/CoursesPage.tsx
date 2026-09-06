import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, ArrowRight, GraduationCap, Briefcase, IndianRupee, ShieldCheck, ChevronRight, Filter } from 'lucide-react';
import { REAL_COURSES } from '../data/realCourses';
import { Course } from '../types';
import { useRouter } from '../lib/router';

export const CoursesPage: React.FC = () => {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'All' | 'Undergraduate' | 'Postgraduate'>('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = REAL_COURSES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.careerOpportunities.some((job) => job.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = levelFilter === 'All' || c.degreeLevel === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="w-full pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/10 text-xs font-semibold text-[#6C63FF] mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Curriculum & Pathway Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A3A] tracking-tight">
            Explore Courses & Curricula
          </h1>
          <p className="text-sm sm:text-base text-[#171A3A]/70 mt-2 leading-relaxed">
            Understand duration, statutory eligibility cutoffs, realistic annual fee brackets, career outcomes, and matching entrance exams before shortlisting.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#171A3A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title, code, or career outcome..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#171A3A] rounded-xl shadow-[3px_3px_0px_#171A3A] text-sm text-[#0B0D18] placeholder:text-[#171A3A]/40 focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          {/* Level Filter Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            {(['All', 'Undergraduate', 'Postgraduate'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2 border-[#171A3A] whitespace-nowrap cursor-pointer ${
                  levelFilter === level
                    ? 'bg-[#171A3A] text-white shadow-[2px_2px_0px_#6C63FF]'
                    : 'bg-white text-[#171A3A] hover:bg-[#FAFAF7]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 shadow-[6px_6px_0px_#171A3A] flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#171A3A] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/30">
                    {course.degreeLevel}
                  </span>
                  <span className="text-xs font-bold text-[#171A3A]/60 font-mono">
                    {course.duration}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-xl font-black text-[#171A3A] tracking-tight">
                    {course.code}
                  </h3>
                  <span className="text-xs font-medium text-[#171A3A]/60 truncate">
                    {course.name}
                  </span>
                </div>

                <p className="text-xs text-[#171A3A]/70 line-clamp-3 leading-relaxed mb-4">
                  {course.overview}
                </p>

                {/* Key Metrics */}
                <div className="space-y-2 py-3 border-y border-[#171A3A]/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#171A3A]/60 font-medium">Avg Annual Fees</span>
                    <span className="font-mono font-bold text-[#171A3A]">{course.averageFeeRange}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#171A3A]/60 font-medium">Key Entrance Tests</span>
                    <span className="font-bold text-[#6C63FF] truncate max-w-[170px] text-right">
                      {course.applicableEntranceExams.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Career Trajectory Excerpt */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-[#171A3A]/50 uppercase tracking-widest block mb-1.5">
                    Career Pathways
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.careerOpportunities.slice(0, 3).map((job, jIdx) => (
                      <span
                        key={jIdx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FAFAF7] text-[#171A3A] border border-[#171A3A]/10"
                      >
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-[#171A3A]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className="text-xs font-bold text-[#6C63FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Curriculum Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(course.code)}`)}
                  className="px-3.5 py-1.5 bg-[#171A3A] hover:bg-[#6C63FF] text-white rounded-full text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Find Colleges</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for detailed curriculum breakdown */}
        <AnimatePresence>
          {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[8px_8px_0px_#171A3A] max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/30">
                      {selectedCourse.degreeLevel} · {selectedCourse.duration}
                    </span>
                    <h2 className="text-2xl font-black text-[#171A3A] tracking-tight mt-2">
                      {selectedCourse.name} ({selectedCourse.code})
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(null)}
                    className="p-1.5 rounded-full border-2 border-[#171A3A] hover:bg-[#FAFAF7] text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-[#171A3A]/80 leading-relaxed mb-6">
                  {selectedCourse.overview}
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15">
                    <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider block mb-1">
                      Statutory Minimum Eligibility
                    </span>
                    <p className="text-sm font-medium text-[#171A3A]">{selectedCourse.generalEligibility}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCourse.requiredSubjects.map((sub, idx) => (
                        <span key={idx} className="text-xs font-bold px-2 py-0.5 rounded bg-white border border-[#171A3A]/20">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15">
                    <span className="text-xs font-bold text-[#171A3A] uppercase tracking-wider block mb-2">
                      Applicable National & State Entrance Exams
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.applicableEntranceExams.map((exam, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedCourse(null);
                            navigate(`/exams`);
                          }}
                          className="text-xs font-bold px-3 py-1 rounded-full bg-white border-2 border-[#171A3A] hover:border-[#6C63FF] text-[#171A3A] transition-all cursor-pointer"
                        >
                          {exam} →
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15">
                    <span className="text-xs font-bold text-[#171A3A] uppercase tracking-wider block mb-2">
                      Career Outlets & Industry Roles
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-[#171A3A]">
                      {selectedCourse.careerOpportunities.map((career, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#18A673]" />
                          <span>{career}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(null)}
                    className="px-5 py-2.5 rounded-full border-2 border-[#171A3A] text-xs font-bold uppercase tracking-wider hover:bg-[#FAFAF7]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const code = selectedCourse.code;
                      setSelectedCourse(null);
                      navigate(`/search?q=${encodeURIComponent(code)}`);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#171A3A] hover:bg-[#6C63FF] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[3px_3px_0px_#6C63FF]"
                  >
                    <span>Browse Colleges Offering {selectedCourse.code}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
