import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { College, PulseMetrics } from '../types';
import { REAL_COLLEGES } from '../data/realColleges';

interface StudentPulseProps {
  college?: College;
  allowSwitching?: boolean;
  onSelectCollege?: (col: College) => void;
  className?: string;
}

const PULSE_LABELS: { key: keyof PulseMetrics; label: string; description: string }[] = [
  { key: 'campusLife', label: 'Campus Life', description: 'Vibe, fests, clubs & social freedom' },
  { key: 'faculty', label: 'Faculty', description: 'Professor accessibility & teaching depth' },
  { key: 'placements', label: 'Placements', description: 'Recruiter volume & reality vs claims' },
  { key: 'infrastructure', label: 'Infrastructure', description: 'Labs, Wi-Fi, libraries & classrooms' },
  { key: 'hostel', label: 'Hostel & Living', description: 'Room condition, food, hygiene & availability' },
  { key: 'administration', label: 'Administration', description: 'Paperwork speed, exams & responsiveness' },
];

export const StudentPulse: React.FC<StudentPulseProps> = ({
  college: initialCollege,
  allowSwitching = true,
  onSelectCollege,
  className = '',
}) => {
  const [selectedCollege, setSelectedCollege] = useState<College>(
    initialCollege || REAL_COLLEGES[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sync if parent prop changes
  const activeCollege = initialCollege || selectedCollege;

  const handleCollegeChange = (col: College) => {
    setSelectedCollege(col);
    setDropdownOpen(false);
    if (onSelectCollege) onSelectCollege(col);
  };

  const getBarColor = (score: number) => {
    if (score >= 4.3) return 'bg-[#18A673]'; // Emerald
    if (score >= 3.8) return 'bg-[#6C63FF]'; // Accent Violet
    if (score >= 3.2) return 'bg-[#A79BFF]'; // Soft Lavender
    return 'bg-[#E45757]'; // Coral / Negative
  };

  const getScoreDescription = (score: number) => {
    if (score >= 4.5) return 'Exceptional';
    if (score >= 4.0) return 'Strong';
    if (score >= 3.5) return 'Satisfactory';
    if (score >= 3.0) return 'Needs Polish';
    return 'Pain Point';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* College Switcher (if permitted) */}
      {allowSwitching && (
        <div className="relative inline-block mb-6">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white border-2 border-[#171A3A] hover:border-[#6C63FF] rounded-xl shadow-[3px_3px_0px_#171A3A] transition-all text-left cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#6C63FF]" />
            <span className="text-sm font-extrabold text-[#171A3A]">{activeCollege.name}</span>
            <ChevronDown className="w-4 h-4 text-[#171A3A]/60" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-2 z-30 w-72 bg-white border-2 border-[#171A3A] rounded-2xl shadow-[6px_6px_0px_#171A3A] p-2 max-h-64 overflow-y-auto">
              <div className="px-2.5 py-1 text-[10px] font-bold text-[#171A3A]/50 uppercase tracking-widest">
                Select college to view pulse
              </div>
              {REAL_COLLEGES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCollegeChange(c)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                    c.id === activeCollege.id
                      ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                      : 'hover:bg-[#FAFAF7] text-[#0B0D18]'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[11px] text-[#171A3A]/60 shrink-0 ml-2">★ {c.rating}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pulse Metric Bars */}
      <div className="space-y-4">
        {PULSE_LABELS.map(({ key, label, description }) => {
          const score = activeCollege.pulse[key];
          const percentage = (score / 5) * 100;
          const barColor = getBarColor(score);
          const scoreText = getScoreDescription(score);

          return (
            <div key={key} className="group">
              <div className="flex items-baseline justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#171A3A] tracking-tight">{label}</span>
                  <span className="hidden sm:inline text-xs text-[#171A3A]/50 font-normal">· {description}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#171A3A]/50 group-hover:text-[#171A3A] transition-colors">
                    {scoreText}
                  </span>
                  <span className="font-mono font-extrabold text-sm text-[#171A3A] min-w-[28px] text-right">
                    {score.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2 w-full bg-[#171A3A]/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3 border-t border-[#171A3A]/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#171A3A]/50">
        <span>Scale 1.0 – 5.0 · Updated weekly from verified student entries</span>
        <span className="text-[#6C63FF]">Live sentiment</span>
      </div>
    </div>
  );
};
