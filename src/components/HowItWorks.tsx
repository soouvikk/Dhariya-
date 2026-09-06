import React from 'react';
import { motion } from 'motion/react';

const STEPS = [
  {
    step: '01',
    title: 'Search',
    subtitle: 'Cut through marketing portals',
    description: 'Search any state university, premier autonomous college, or program across India without sponsored ad rankings.',
  },
  {
    step: '02',
    title: 'Understand',
    subtitle: 'Real positives & real negatives',
    description: 'Inspect verified category pulses, honest student quotes, infrastructure realities, and AI-synthesized takeaways.',
  },
  {
    step: '03',
    title: 'Decide',
    subtitle: 'Side-by-side conviction',
    description: 'Compare campuses directly on living costs, actual recruiter depth, faculty access, and peer culture before locking in admission.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="w-full py-12 sm:py-16">
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest block mb-2">
          Methodology & Trust
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171A3A] tracking-tight leading-tight">
          How Dhariya helps you know before you choose.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
        {STEPS.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.12 }}
            className="group flex flex-col justify-between border-t-2 border-[#171A3A] pt-6"
          >
            <div>
              <div className="font-mono text-4xl sm:text-5xl font-black text-[#171A3A] group-hover:text-[#6C63FF] mb-3 tracking-tighter transition-colors">
                {item.step}
              </div>

              <h3 className="text-2xl font-extrabold text-[#171A3A] tracking-tight mb-1">
                {item.title}
              </h3>

              <div className="text-[10px] font-bold text-[#171A3A]/60 uppercase tracking-widest mb-3">
                {item.subtitle}
              </div>

              <p className="text-sm text-[#171A3A]/75 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#171A3A]/10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#171A3A]/50 group-hover:text-[#6C63FF] transition-colors">
              <span>Verified peer transparency</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
