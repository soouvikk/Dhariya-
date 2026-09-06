import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Compass, MessageSquareQuote, CheckCircle } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { TrendingTopics } from '../components/TrendingTopics';
import { CollegeCard } from '../components/CollegeCard';
import { StudentPulse } from '../components/StudentPulse';
import { ProsCons } from '../components/ProsCons';
import { AISummary } from '../components/AISummary';
import { ReviewCard } from '../components/ReviewCard';
import { Comparison } from '../components/Comparison';
import { HowItWorks } from '../components/HowItWorks';
import { ContributionCTA } from '../components/ContributionCTA';
import { REAL_COLLEGES } from '../data/realColleges';
import { DhariyaAPI } from '../services/api';
import { ReviewItem, College } from '../types';
import { useRouter } from '../lib/router';

interface HomePageProps {
  reviews: ReviewItem[];
}

export const HomePage: React.FC<HomePageProps> = ({ reviews }) => {
  const { navigate } = useRouter();
  const [colleges, setColleges] = useState<College[]>(REAL_COLLEGES);

  useEffect(() => {
    let isMounted = true;
    DhariyaAPI.getColleges().then((data) => {
      if (isMounted && data && data.length > 0) {
        setColleges(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredCollege = colleges.find((c) => c.featured) || colleges[0] || REAL_COLLEGES[0];
  const otherColleges = colleges.filter((c) => c.id !== featuredCollege.id);

  // Pick top 4 reviews for homepage student voices section
  const studentVoiceReviews = reviews.slice(0, 4);

  return (
    <div className="w-full">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Subtle micro tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#171A3A]/15 text-[11px] font-bold uppercase tracking-widest text-[#171A3A] mb-6 shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#18A673]" />
            <span>Independent Student Intelligence · India</span>
          </motion.div>

          {/* Main Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#171A3A] tracking-tighter leading-[1.05] text-balance"
          >
            Before you choose.
            <br />
            <span className="text-[#171A3A]">See what students know.</span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mt-6 text-base sm:text-xl text-[#171A3A]/75 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Real experiences, honest opinions, and useful comparisons for your next education decision.
          </motion.p>

          {/* Central Search Interaction */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 sm:mt-10 max-w-2xl mx-auto"
          >
            <SearchBar variant="hero" />

            {/* Hero Microcopy (Understated, strictly honest, no fake metrics) */}
            <div className="mt-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider text-[#171A3A]/60">
              <span>Real experiences</span>
              <span className="text-[#171A3A]/20">·</span>
              <span className="text-[#18A673]">Honest positives</span>
              <span className="text-[#171A3A]/20">·</span>
              <span className="text-[#E45757]">Honest negatives</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRENDING TOPICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <TrendingTopics />
      </section>

      {/* 3. DISCOVERY SECTION (Editorial Asymmetric Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Compass className="w-4 h-4 text-[#6C63FF]" />
              <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest">
                Discovery Stream
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171A3A] tracking-tight">
              Explore what students are talking about
            </h2>
            <p className="text-sm text-[#171A3A]/60 mt-1">
              Colleges with active student discussions, transparent ratings, and recent verified feedback.
            </p>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#171A3A] border-b border-[#171A3A] pb-0.5 hover:text-[#6C63FF] hover:border-[#6C63FF] transition-all cursor-pointer self-start sm:self-auto"
          >
            <span>View all colleges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Asymmetric layout: Large featured card on left or top + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Featured Large Card (takes 7 columns on large screens) */}
          <div className="lg:col-span-7 flex flex-col">
            <CollegeCard college={featuredCollege} featured={true} />
          </div>

          {/* 2 Medium Cards on right (takes 5 columns) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {otherColleges.slice(0, 2).map((col) => (
              <CollegeCard key={col.id} college={col} />
            ))}
          </div>
        </div>

        {/* Follow up row of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {otherColleges.slice(2, 5).map((col) => (
            <CollegeCard key={col.id} college={col} />
          ))}
        </div>
      </section>

      {/* 4. STUDENT PULSE + DHARIYA'S TAKE (Signature Deep Dive) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[6px_6px_0px_#171A3A]">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest block mb-1.5">
              Signature Insight
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171A3A] tracking-tight">
              Student Pulse
            </h2>
            <p className="text-sm sm:text-base text-[#171A3A]/70 mt-1">
              What students are feeling about a college right now. Real metrics across 6 key living dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Interactive Pulse Meters */}
            <div className="lg:col-span-7 bg-[#FAFAF7] p-6 sm:p-8 rounded-2xl border border-[#171A3A]/15 shadow-xs">
              <StudentPulse allowSwitching={true} />
            </div>

            {/* Right: Dhariya's Take (AI Insight Layer) */}
            <div className="lg:col-span-5 space-y-6">
              <AISummary college={featuredCollege} />

              <div className="bg-[#FAFAF7] border border-[#171A3A]/15 rounded-2xl p-6">
                <div className="text-xs font-bold text-[#171A3A] uppercase tracking-widest mb-2">
                  Why Pulse Matters
                </div>
                <p className="text-xs text-[#171A3A]/70 leading-relaxed font-normal">
                  Traditional rankings look at research papers published a decade ago. Dhariya's Student Pulse captures everyday reality: whether hostels have water, how fast administration stamps documents, and true recruiter conversion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE GOOD. THE BAD. THE REALITY. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider block mb-1.5">
            Dhariya Differentiator
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171A3A] tracking-tight">
            The good. The bad. The reality.
          </h2>
          <p className="text-sm text-[#171A3A]/60 mt-1">
            Every college has genuine strengths and uncomfortable realities. We present both with equal honesty.
          </p>
        </div>

        <ProsCons college={featuredCollege} />
      </section>

      {/* 6. STUDENT VOICES (Human Reviews Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquareQuote className="w-4 h-4 text-[#6C63FF]" />
              <span className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider">
                Student Voices
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171A3A] tracking-tight">
              What students actually said
            </h2>
            <p className="text-sm text-[#171A3A]/60 mt-1">
              Short, verified review excerpts from students living the reality today.
            </p>
          </div>

          <button
            onClick={() => navigate('/reviews')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171A3A] hover:text-[#6C63FF] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Browse all student voices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentVoiceReviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} showCollegeLink={true} />
          ))}
        </div>
      </section>

      {/* 7. COLLEGE COMPARISON (Head to Head) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <Comparison defaultCollegeA={featuredCollege} defaultCollegeB={otherColleges[0]} />
      </section>

      {/* 8. HOW DHARIYA WORKS (Editorial Sequence) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <HowItWorks />
      </section>

      {/* 9. CONTRIBUTION INVITATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <ContributionCTA />
      </section>
    </div>
  );
};
