import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, Clock, HelpCircle } from 'lucide-react';
import { VerificationStatus } from '../types';

interface SourceVerificationProps {
  status: VerificationStatus;
  sourceName?: string;
  sourceUrl?: string;
  academicYear?: string;
  lastVerified?: string;
  className?: string;
  compact?: boolean;
}

export const SourceVerification: React.FC<SourceVerificationProps> = ({
  status,
  sourceName,
  sourceUrl,
  academicYear = '2026–27',
  lastVerified,
  className = '',
  compact = false,
}) => {
  const isVerified = status === 'VERIFIED';
  const isOutdated = status === 'OUTDATED';
  const isNeedsReview = status === 'NEEDS_REVIEW';

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
        {isVerified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#18A673]/10 text-[#18A673] border border-[#18A673]/30 font-bold text-[10px] uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified · {academicYear}</span>
          </span>
        )}
        {isOutdated && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 font-bold text-[10px] uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" />
            <span>May have changed</span>
          </span>
        )}
        {isNeedsReview && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/30 font-bold text-[10px] uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            <span>Review pending</span>
          </span>
        )}
        {!isVerified && !isOutdated && !isNeedsReview && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#171A3A]/5 text-[#171A3A]/60 border border-[#171A3A]/15 font-bold text-[10px] uppercase tracking-wider">
            <HelpCircle className="w-3 h-3" />
            <span>Unverified</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-4 text-xs border-2 transition-all ${
        isVerified
          ? 'bg-emerald-50/70 border-[#18A673]/40 text-[#171A3A]'
          : isOutdated
          ? 'bg-amber-50/80 border-amber-400 text-amber-950'
          : 'bg-[#FAFAF7] border-[#171A3A]/20 text-[#171A3A]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px]">
          {isVerified && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#18A673]" />
              <span className="text-[#18A673]">Verified Official Record</span>
            </>
          )}
          {isOutdated && (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-amber-800">Potentially Outdated · Check Portal</span>
            </>
          )}
          {isNeedsReview && (
            <>
              <Clock className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span className="text-[#6C63FF]">Under Annual Verification</span>
            </>
          )}
        </div>

        <div className="text-[11px] font-bold text-[#171A3A]/60">
          Academic Year: <span className="text-[#171A3A] font-extrabold">{academicYear}</span>
        </div>
      </div>

      {isOutdated && (
        <p className="text-[11px] text-amber-800 mb-2 font-medium leading-relaxed">
          ⚠ This information may have changed for the upcoming academic cycle. Always confirm latest notices on the official portal before applying.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#171A3A]/10 text-[11px] text-[#171A3A]/70">
        <div>
          {sourceName && (
            <span>
              Source: <strong className="text-[#171A3A]">{sourceName}</strong>
            </span>
          )}
          {lastVerified && (
            <span className="ml-2 text-[#171A3A]/50">· Checked {lastVerified}</span>
          )}
        </div>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#6C63FF] hover:underline"
          >
            <span>Check official source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
