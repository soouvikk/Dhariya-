import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Star,
  Scale,
  PenLine,
  Share2,
  Check,
  Building,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { College, ReviewItem } from '../types';
import { REAL_COLLEGES } from '../data/realColleges';
import { DhariyaAPI } from '../services/api';
import { StudentPulse } from '../components/StudentPulse';
import { ProsCons } from '../components/ProsCons';
import { AISummary } from '../components/AISummary';
import { ReviewFeed } from '../components/ReviewFeed';
import { CollegeCard } from '../components/CollegeCard';
import { CollegeImage } from '../components/CollegeImage';
import { useRouter } from '../lib/router';

interface CollegeProfilePageProps {
  slug: string;
  reviews: ReviewItem[];
}

type TabType = 'overview' | 'reviews' | 'proscons' | 'courses' | 'placements' | 'campuslife' | 'hostel';

export const CollegeProfilePage: React.FC<CollegeProfilePageProps> = ({ slug, reviews }) => {
  const { navigate, openWriteReview } = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [college, setCollege] = useState<College>(() => {
    return REAL_COLLEGES.find((c) => c.slug === slug) || REAL_COLLEGES[0];
  });

  useEffect(() => {
    let isMounted = true;
    DhariyaAPI.getCollegeBySlug(slug).then((res) => {
      if (isMounted && res) {
        setCollege(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Filter reviews for this college
  const collegeReviews = reviews.filter((r) => r.collegeSlug === college.slug);

  // Related colleges (same state or similar type)
  const relatedColleges = REAL_COLLEGES.filter(
    (c) => c.id !== college.id && (c.state === college.state || c.type === college.type)
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleQuickCompare = () => {
    const defaultOther = REAL_COLLEGES.find((c) => c.id !== college.id) || REAL_COLLEGES[1];
    navigate(`/compare?c1=${college.slug}&c2=${defaultOther.slug}`);
  };

  return (
    <div className="w-full pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#171A3A]/50 mb-4">
          <button onClick={() => navigate('/')} className="hover:text-[#6C63FF] transition-colors">
            Colleges
          </button>
          <span>/</span>
          <span className="text-[#171A3A]/70">{college.state}</span>
          <span>/</span>
          <span className="font-semibold text-[#171A3A] truncate">{college.shortName}</span>
        </div>

        {/* HERO RESEARCH HEADER */}
        <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#171A3A] mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              {/* College photo preview if available */}
              <div className="mb-6 rounded-2xl overflow-hidden border-2 border-[#171A3A] shadow-[4px_4px_0px_#171A3A] max-h-64 sm:max-h-80 w-full relative">
                <CollegeImage
                  src={college.coverImageUrl}
                  alt={college.name}
                  collegeName={college.name}
                  type="cover"
                  className="w-full h-56 sm:h-72 object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 text-[#171A3A] border-2 border-[#171A3A] shadow-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#18A673]" />
                    <span>Dhariya Verified Data</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/30">
                  {college.type}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#18A673]/10 text-[#18A673] border border-[#18A673]/30">
                  {college.sentiment}
                </span>
                <span className="text-xs font-semibold text-[#171A3A]/60">Est. {college.establishedYear}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A3A] tracking-tight">
                {college.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#171A3A]/70 mt-2 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#171A3A]/50" />
                  <span>{college.location}</span>
                </span>
                {college.campusAcreage && (
                  <>
                    <span>·</span>
                    <span>Campus: {college.campusAcreage}</span>
                  </>
                )}
                <span>·</span>
                <span className="font-bold text-[#171A3A]">{college.tuitionTier}</span>
              </div>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-4 mt-5 pt-5 border-t border-[#171A3A]/15">
                <div className="flex items-center gap-1.5">
                  <span className="text-3xl font-black text-[#171A3A]">{college.rating}</span>
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.floor(college.rating) ? 'fill-current' : 'opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-6 w-px bg-[#171A3A]/20" />

                <div className="text-xs sm:text-sm text-[#171A3A]/80 font-medium">
                  <span className="font-bold text-[#171A3A]">
                    {college.reviewCount.toLocaleString()}
                  </span>{' '}
                  student experiences analyzed
                </div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap lg:flex-col items-center sm:items-stretch gap-3 shrink-0 self-start lg:w-48 mt-4 lg:mt-0">
              <button
                type="button"
                onClick={handleQuickCompare}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-[#171A3A] text-[#171A3A] hover:bg-[#FAFAF7] text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[3px_3px_0px_#171A3A] cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#6C63FF]" />
                <span>Compare College</span>
              </button>

              <button
                type="button"
                onClick={() => openWriteReview(college.slug)}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#171A3A] hover:bg-[#6C63FF] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-[3px_3px_0px_#6C63FF] border-2 border-[#171A3A] cursor-pointer"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-[#171A3A]/70 hover:text-[#171A3A] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#18A673]" />
                    <span className="text-[#18A673]">Link copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Research</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RESEARCH TABS */}
          <div className="flex items-center gap-2 mt-8 pt-5 border-t border-[#171A3A]/15 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'reviews', label: `Reviews (${collegeReviews.length})` },
              { id: 'proscons', label: 'Pros & Cons' },
              { id: 'courses', label: 'Courses & Fees' },
              { id: 'placements', label: 'Placements' },
              { id: 'campuslife', label: 'Campus Life' },
              { id: 'hostel', label: 'Hostel & Living' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2 border-[#171A3A] whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#171A3A] text-white shadow-[2px_2px_0px_#6C63FF]'
                    : 'bg-white text-[#171A3A] hover:bg-[#FAFAF7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* AI Summary Highlight */}
            <AISummary college={college} />

            {/* Signature Student Pulse */}
            <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#171A3A]">
              <div className="mb-6">
                <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">
                  Living Dimensions
                </span>
                <h3 className="text-2xl font-black text-[#171A3A] tracking-tight">
                  Student Pulse at {college.shortName}
                </h3>
              </div>
              <StudentPulse college={college} allowSwitching={false} />
            </div>

            {/* Pros & Cons Balanced Split */}
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">
                  The Reality Check
                </span>
                <h3 className="text-2xl font-black text-[#171A3A] tracking-tight">
                  The good. The bad. The consensus.
                </h3>
              </div>
              <ProsCons college={college} />
            </div>

            {/* Quick Excerpts Feed */}
            <ReviewFeed
              reviews={collegeReviews}
              collegeSlug={college.slug}
              title={`What students say about ${college.shortName}`}
              subtitle="Verified peer feedback on academics, fests, and administration."
            />
          </div>
        )}

        {/* TAB 2: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <ReviewFeed
              reviews={collegeReviews}
              collegeSlug={college.slug}
              title={`Student Reviews (${collegeReviews.length})`}
              subtitle={`Authentic submissions from verified alumni and current students of ${college.name}.`}
            />
          </div>
        )}

        {/* TAB 3: PROS & CONS */}
        {activeTab === 'proscons' && (
          <div className="space-y-8">
            <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#171A3A]">
              <h3 className="text-2xl font-black text-[#171A3A] tracking-tight mb-2">
                Unvarnished Pros & Cons
              </h3>
              <p className="text-sm text-[#171A3A]/70 leading-relaxed mb-8">
                Compiled from verified feedback across graduating batches. Dhariya algorithmically suppresses promotional PR language and flags outlier grievances.
              </p>
              <ProsCons college={college} />
            </div>
          </div>
        )}

        {/* TAB 4: COURSES & ESTIMATED FEES */}
        {activeTab === 'courses' && (
          <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#171A3A]">
            <div className="mb-6">
              <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">
                Academic Programs
              </span>
              <h3 className="text-2xl font-black text-[#171A3A] tracking-tight">
                Popular Courses & Fee Estimates
              </h3>
              <p className="text-sm text-[#171A3A]/70 mt-1">
                Approximate state government or autonomous tuition fees. Note: Hostel & mess charges vary.
              </p>
            </div>

            <div className="divide-y divide-[#171A3A]/15">
              {college.courses.map((course, idx) => (
                <div key={idx} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#6C63FF]" />
                      <h4 className="font-extrabold text-base text-[#171A3A]">{course.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A3A]/60 mt-1">
                      <span>{course.level}</span>
                      <span>·</span>
                      <span>{course.duration}</span>
                      {course.popularSpecializations && (
                        <>
                          <span>·</span>
                          <span className="text-[#6C63FF] font-bold">
                            Focus: {course.popularSpecializations.join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-base font-mono font-bold text-[#171A3A]">{course.annualFeeRange}</span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#171A3A]/50">Tuition Estimate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PLACEMENTS */}
        {activeTab === 'placements' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#171A3A]">
              <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">
                Recruiter Reality
              </span>
              <h3 className="text-2xl font-black text-[#171A3A] tracking-tight mb-2">
                Placement Stats & Reality Check
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                <div className="p-5 bg-[#FAFAF7] rounded-2xl border-2 border-[#171A3A]/15 shadow-[3px_3px_0px_#171A3A]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#171A3A]/60 mb-1">Median CTC</div>
                  <div className="text-3xl font-mono font-bold text-[#171A3A]">
                    {college.placementStats.medianCtc}
                  </div>
                  <div className="text-[11px] text-[#171A3A]/60 mt-1">Across all graduating streams</div>
                </div>

                {college.placementStats.highestCtc && (
                  <div className="p-5 bg-[#FAFAF7] rounded-2xl border-2 border-[#171A3A]/15 shadow-[3px_3px_0px_#171A3A]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#171A3A]/60 mb-1">Highest Package</div>
                    <div className="text-3xl font-mono font-bold text-[#6C63FF]">
                      {college.placementStats.highestCtc}
                    </div>
                    <div className="text-[11px] text-[#171A3A]/60 mt-1">International or off-campus peak</div>
                  </div>
                )}

                <div className="p-5 bg-[#FAFAF7] rounded-2xl border-2 border-[#171A3A]/15 shadow-[3px_3px_0px_#171A3A]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#171A3A]/60 mb-1">Top Recruiter Sectors</div>
                  <div className="text-sm font-bold text-[#171A3A] mt-1">
                    {college.placementStats.topSectors.join(' · ')}
                  </div>
                </div>
              </div>

              {/* Reality check disclaimer box */}
              <div className="p-5 bg-white border-2 border-[#171A3A] shadow-[4px_4px_0px_#6C63FF] rounded-2xl">
                <div className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider mb-1">
                  Student Reality Check:
                </div>
                <p className="text-sm text-[#171A3A]/80 leading-relaxed font-medium">
                  {college.placementStats.realityCheckNote}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CAMPUS LIFE */}
        {activeTab === 'campuslife' && (
          <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#171A3A]">
            <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">
              Everyday Experience
            </span>
            <h3 className="text-2xl font-black text-[#171A3A] tracking-tight mb-2">
              Campus Culture, Fests & Traditions
            </h3>
            <p className="text-sm text-[#171A3A]/70 mb-6">
              What sets the social vibe, student unions, and campus memories apart at {college.shortName}.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {college.campusLifeHighlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15 shadow-[2px_2px_0px_#171A3A] flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-[#6C63FF] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-[#171A3A]">
                    ★
                  </span>
                  <span className="text-sm font-semibold text-[#171A3A] leading-relaxed">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TAB 7: HOSTEL & LIVING REALITIES */}
        {activeTab === 'hostel' && (
          <div className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_#171A3A]">
            <span className="text-[10px] font-bold text-[#6C63FF] uppercase tracking-widest block mb-1">
              Residential Ground Truth
            </span>
            <h3 className="text-2xl font-black text-[#171A3A] tracking-tight mb-2">
              Hostel Accommodation, Mess & Living
            </h3>
            <p className="text-sm text-[#171A3A]/70 mb-6">
              Uncensored realities regarding room allotment, food hygiene, curfew regulations, and nearby PG alternatives.
            </p>

            {college.hostelInfo ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15">
                    <span className="text-[10px] font-bold text-[#171A3A]/50 uppercase tracking-widest block mb-1">
                      Campus Allotment
                    </span>
                    <span className="font-extrabold text-[#171A3A] text-lg">
                      {college.hostelInfo.available ? 'Available' : 'No On-Campus Hostels'}
                    </span>
                    <span className="block text-xs text-[#171A3A]/60 mt-1 font-medium">
                      {college.hostelInfo.occupancyStatus || 'Merit & distance prioritized'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15">
                    <span className="text-[10px] font-bold text-[#171A3A]/50 uppercase tracking-widest block mb-1">
                      Annual Fee
                    </span>
                    <span className="font-extrabold text-[#171A3A] text-lg font-mono">
                      {college.hostelInfo.annualFee}
                    </span>
                    <span className="block text-xs text-[#171A3A]/60 mt-1 font-medium">
                      Rent + Maintenance
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15">
                    <span className="text-[10px] font-bold text-[#171A3A]/50 uppercase tracking-widest block mb-1">
                      Accommodation
                    </span>
                    <span className="font-extrabold text-[#171A3A] text-lg">
                      {college.hostelInfo.genderAccommodation}
                    </span>
                    <span className="block text-xs text-[#171A3A]/60 mt-1 font-medium">
                      Separate security per wing
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15">
                    <span className="text-[10px] font-bold text-[#171A3A]/50 uppercase tracking-widest block mb-1">
                      Mess Rating
                    </span>
                    <span className="font-extrabold text-[#171A3A] text-lg">
                      ★ {college.hostelInfo.messRating}/5.0
                    </span>
                    <span className="block text-xs text-[#171A3A]/60 mt-1 font-medium">
                      Food hygiene & taste
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/15">
                  <h4 className="text-xs font-bold text-[#171A3A] uppercase tracking-wider mb-2">
                    Curfew, Rules & Entry Regulations
                  </h4>
                  <p className="text-sm text-[#171A3A]/80 font-medium leading-relaxed">
                    {college.hostelInfo.curfewRules}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border-2 border-[#171A3A] shadow-[4px_4px_0px_#6C63FF]">
                  <h4 className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider mb-2">
                    Student Verdict & Local Housing Advice
                  </h4>
                  <p className="text-sm text-[#171A3A] font-semibold leading-relaxed">
                    "{college.hostelInfo.studentVerdict}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FAFAF7] rounded-2xl border-2 border-[#171A3A]/15">
                <Home className="w-8 h-8 text-[#171A3A]/40 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#171A3A]">
                  Detailed hostel census for {college.shortName} is currently being verified.
                </p>
                <p className="text-xs text-[#171A3A]/60 mt-1">
                  We only publish audited residential data provided by verified residents. Check back shortly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* RELATED COLLEGES */}
        <div className="mt-16 pt-12 border-t-2 border-[#171A3A]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#171A3A] tracking-tight">
                Similar Colleges Students Compare
              </h3>
              <p className="text-xs text-[#171A3A]/60 font-medium mt-0.5">
                Peers researching {college.shortName} also looked at these options
              </p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-xs font-bold uppercase tracking-wider text-[#6C63FF] hover:underline cursor-pointer"
            >
              Explore all →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedColleges.map((rel) => (
              <CollegeCard key={rel.id} college={rel} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
