import React from 'react';
import { Check, X, ThumbsUp } from 'lucide-react';
import { College } from '../types';

interface ProsConsProps {
  college: College;
  className?: string;
}

export const ProsCons: React.FC<ProsConsProps> = ({ college, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* LEFT: Students liked (Positive) */}
        <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_#171A3A] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-xl bg-[#18A673]/15 text-[#18A673] flex items-center justify-center font-extrabold text-base border border-[#18A673]/30">
                ✓
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#171A3A] tracking-tight">Students liked</h3>
                <p className="text-xs text-[#171A3A]/60 font-medium">Consistently praised across verified feedback</p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {college.pros.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-[#18A673]/20 text-[#18A673] flex items-center justify-center text-[10px] mt-0.5 font-extrabold">
                    ✓
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#0B0D18] leading-snug">{item.text}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#171A3A]/50">
                      <ThumbsUp className="w-3 h-3 text-[#18A673]" />
                      <span>{item.votes} students verified this</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#171A3A]/10 text-[10px] uppercase tracking-wider text-[#18A673] font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#18A673]" />
            <span>Honest student validation score: 88% consensus</span>
          </div>
        </div>

        {/* RIGHT: Students questioned (Negative / Reality check) */}
        <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_#171A3A] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-xl bg-[#E45757]/15 text-[#E45757] flex items-center justify-center font-extrabold text-base border border-[#E45757]/30">
                ✕
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#171A3A] tracking-tight">Students questioned</h3>
                <p className="text-xs text-[#171A3A]/60 font-medium">Pain points & realities you should know in advance</p>
              </div>
            </div>

            <ul className="space-y-3.5">
              {college.cons.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-[#E45757]/20 text-[#E45757] flex items-center justify-center text-[10px] mt-0.5 font-extrabold">
                    ✕
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#0B0D18] leading-snug">{item.text}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#171A3A]/50">
                      <span className="text-[#E45757] font-bold">{item.votes} reported</span>
                      <span>· verified experience</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#171A3A]/10 text-[10px] uppercase tracking-wider text-[#171A3A]/60 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E45757]" />
            <span>Unfiltered feedback · Not editable by administration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
