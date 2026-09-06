import React from 'react';
import { useRouter } from '../lib/router';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, openWriteReview } = useRouter();

  return (
    <footer className="w-full bg-[#FAFAF7] border-t-2 border-[#171A3A] mt-16 sm:mt-24 pt-14 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#171A3A]/15">
          {/* Col 1: Brand Philosophy */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-black text-2xl tracking-tighter text-[#171A3A]">
                DHARIYA
              </span>
              <span className="w-2 h-2 rounded-full bg-[#6C63FF]" />
            </div>
            <p className="text-sm font-extrabold text-[#171A3A] mb-3 uppercase tracking-wider">
              Know before you choose.
            </p>
            <p className="text-sm text-[#171A3A]/70 max-w-md leading-relaxed font-normal">
              Real people. Real experiences. Better decisions. Dhariya helps students research colleges, courses, coaching institutes and education programs before making an important life decision.
            </p>

            <div className="mt-5 flex items-center gap-3 text-xs text-[#171A3A] bg-white p-3.5 rounded-2xl border-2 border-[#171A3A] shadow-[3px_3px_0px_#171A3A] max-w-md">
              <ShieldCheck className="w-4 h-4 text-[#18A673] shrink-0" />
              <span>
                <strong>Zero Sponsored Bias:</strong> Colleges cannot purchase higher ratings or suppress student sentiment on Dhariya.
              </span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#171A3A] mb-4">
              Platform
            </div>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-[#171A3A]/70 hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Explore Colleges
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/compare')}
                  className="text-[#171A3A]/70 hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Compare Options
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/reviews')}
                  className="text-[#171A3A]/70 hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Student Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => openWriteReview()}
                  className="text-[#171A3A]/70 hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Contribute Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/search?q=Bengal')}
                  className="text-[#171A3A]/70 hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  State Universities
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Trust */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#171A3A] mb-4">
              Trust & Policies
            </div>
            <ul className="space-y-2.5 text-xs font-semibold text-[#171A3A]/70">
              <li>
                <button
                  onClick={() => alert('Community Guidelines: Dhariya protects constructive student honesty while barring harassment, hate speech, and unverified commercial smear campaigns.')}
                  className="hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Community Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Review Policy: Verification requires active institutional email, admit cards, or degree certificates.')}
                  className="hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Review Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Privacy: Student identities are anonymized publicly by default unless the contributor chooses otherwise.')}
                  className="hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Terms of Service: Intended for personal research and educational decision guidance.')}
                  className="hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Contact: Reach the Dhariya student advocacy desk at hello@dhariya.in')}
                  className="hover:text-[#6C63FF] transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#171A3A]/60">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#6C63FF]" />
            <span>Prototype Demo · Data curated for demonstrative exploration and UI verification.</span>
          </div>

          <div className="font-semibold">
            © {new Date().getFullYear()} DHARIYA Technologies. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
