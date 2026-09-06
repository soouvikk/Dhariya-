import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { College } from '../types';

interface AISummaryProps {
  college: College;
  className?: string;
}

export const AISummary: React.FC<AISummaryProps> = ({ college, className = '' }) => {
  return (
    <div
      className={`relative bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_#6C63FF] ${className}`}
    >
      {/* Subtle indicator tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6C63FF]" />
          <h3 className="text-lg font-extrabold text-[#171A3A] tracking-tight">Dhariya’s Take</h3>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6C63FF] bg-[#6C63FF]/10 px-3 py-1 rounded-full border border-[#6C63FF]/25">
          AI synthesis · {college.aiSummary.basedOnExperiences.toLocaleString()} experiences
        </span>
      </div>

      <blockquote className="font-serif text-base sm:text-lg text-[#0B0D18] italic font-normal leading-relaxed pl-1">
        “{college.aiSummary.take}”
      </blockquote>

      <div className="mt-5 pt-3 border-t border-[#171A3A]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#171A3A]/60">
        <span className="font-semibold text-[#171A3A]">
          Key takeaway: <span className="text-[#6C63FF] font-bold">{college.aiSummary.keyHighlight}</span>
        </span>
        <span className="text-[11px] font-medium">{college.aiSummary.lastAnalyzed}</span>
      </div>
    </div>
  );
};
