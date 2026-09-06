import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from '../lib/router';

export const SignInModal: React.FC = () => {
  const { signInModalOpen, closeModals } = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'input' | 'sent'>('input');

  if (!signInModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStep('sent');
      setTimeout(() => {
        closeModals();
        setStep('input');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModals}
        className="fixed inset-0 bg-[#0B0D18]/50 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-[8px_8px_0px_#171A3A] border-2 border-[#171A3A] p-6 sm:p-8 z-10"
      >
        <button
          onClick={closeModals}
          className="absolute top-5 right-5 p-2 text-[#171A3A]/60 hover:text-[#171A3A] border-2 border-[#171A3A]/10 hover:border-[#171A3A] rounded-full hover:bg-[#FAFAF7] transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'sent' ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 bg-[#18A673]/15 text-[#18A673] border-2 border-[#18A673] rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-2xl shadow-[3px_3px_0px_#18A673]">
              ✓
            </div>
            <h3 className="text-xl font-black text-[#171A3A]">Check your inbox</h3>
            <p className="text-xs text-[#171A3A]/70 mt-1.5">
              We sent a passwordless magic link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-black text-lg tracking-tighter text-[#171A3A]">
                DHARIYA
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] font-bold uppercase tracking-wider border border-[#6C63FF]/20">
                Student Access
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-[#171A3A] tracking-tight">
              Sign in to Dhariya
            </h3>
            <p className="text-xs text-[#171A3A]/65 mt-1 leading-relaxed">
              Use your student (.edu/.ac.in) or personal email. Student domain emails receive instant "Verified Student" badge on reviews.
            </p>

            <form onSubmit={handleSendOtp} className="mt-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#171A3A]/70 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#171A3A]/50 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.ac.in or personal"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAFAF7] border-2 border-[#171A3A]/15 rounded-xl text-xs font-medium text-[#171A3A] placeholder-[#171A3A]/40 focus:outline-none focus:border-[#171A3A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#171A3A] hover:bg-[#6C63FF] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[3px_3px_0px_#6C63FF] border-2 border-[#171A3A] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue with Magic Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#171A3A]/10 flex items-start gap-2.5 text-[10px] font-medium text-[#171A3A]/60">
              <ShieldCheck className="w-4 h-4 text-[#18A673] shrink-0 mt-0.5" />
              <span>
                Your email is used solely for verification. We never share student identities with colleges or recruiters.
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
