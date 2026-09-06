import React from 'react';
import { PenLine, ArrowRight, Heart } from 'lucide-react';
import { useRouter } from '../lib/router';

export const ContributionCTA: React.FC = () => {
  const { openWriteReview, navigate } = useRouter();

  return (
    <section className="w-full bg-[#171A3A] text-white rounded-3xl p-8 sm:p-12 md:p-14 relative overflow-hidden border-2 border-[#171A3A] shadow-[8px_8px_0px_#6C63FF]">
      {/* Editorial background grid subtle pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest text-[#A79BFF] mb-6 border border-white/15">
          <Heart className="w-3.5 h-3.5 text-[#E45757] fill-current" />
          <span>Student Community Commons</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Your experience could help someone choose better.
        </h2>

        <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed font-normal max-w-2xl">
          Share what you learned. Help the next student avoid the mistakes you made—or discover an opportunity they didn’t know about.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => openWriteReview()}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#6C63FF] hover:bg-white hover:text-[#171A3A] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            <span>Share your experience</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/reviews')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all border-2 border-white/30 cursor-pointer"
          >
            <span>Explore reviews</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-white/60">
          <span>Anonymous submissions supported</span>
          <span className="text-white/30">·</span>
          <span>Zero sponsored ranking influence</span>
          <span className="text-white/30">·</span>
          <span>Strictly moderated against fake entries</span>
        </div>
      </div>
    </section>
  );
};
