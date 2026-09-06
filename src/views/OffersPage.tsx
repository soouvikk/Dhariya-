import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Tag,
  Search,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Percent,
  Sparkles,
  Gift,
  Award,
} from 'lucide-react';
import { REAL_OFFERS } from '../data/realOffers';
import { Offer } from '../types';

export const OffersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'student_discount', label: 'Student Packs' },
    { id: 'coaching_discount', label: 'Test Prep & Coaching' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'hardware_discount', label: 'Laptops & Hardware' },
    { id: 'certification', label: 'Certifications' },
  ];

  const filteredOffers = REAL_OFFERS.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offer.couponCode && offer.couponCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || offer.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className="w-full pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18A673]/10 text-xs font-semibold text-[#18A673] mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>Verified Student Benefits, Subsidies & Grants</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A3A] tracking-tight">
            Education Offers & Savings
          </h1>
          <p className="text-sm sm:text-base text-[#171A3A]/70 mt-2 leading-relaxed">
            Curated, 100% verified discounts on test preparation, hardware, software toolkits, scholarships, and certified learning programs exclusively for college students.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-[#171A3A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discounts, coupons, Apple, GitHub..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#171A3A] rounded-xl shadow-[3px_3px_0px_#171A3A] text-sm text-[#0B0D18] placeholder:text-[#171A3A]/40 focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border-2 border-[#171A3A] whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#171A3A] text-white shadow-[2px_2px_0px_#18A673]'
                    : 'bg-white text-[#171A3A] hover:bg-[#FAFAF7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Verified Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-[#171A3A] rounded-3xl p-6 shadow-[6px_6px_0px_#171A3A] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#18A673]/10 text-[#18A673] border border-[#18A673]/30">
                    {offer.discountValue}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#171A3A]/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#18A673]" />
                    <span>Verified</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#171A3A] tracking-tight mb-1">
                  {offer.title}
                </h3>
                <div className="text-xs font-bold text-[#6C63FF] mb-3">
                  By {offer.provider}
                </div>

                <p className="text-xs text-[#171A3A]/75 leading-relaxed mb-4">
                  {offer.description}
                </p>

                {/* Eligibility Pill */}
                <div className="p-3.5 rounded-2xl bg-[#FAFAF7] border-2 border-[#171A3A]/10 text-xs mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#171A3A]/50 block mb-1">
                    Eligibility Requirement
                  </span>
                  <p className="font-medium text-[#171A3A]/90">{offer.eligibility}</p>
                </div>
              </div>

              {/* Bottom Actions & Coupon Box */}
              <div>
                {offer.couponCode && (
                  <div className="mb-4 flex items-center justify-between p-2 rounded-xl bg-amber-50 border-2 border-amber-300">
                    <div className="pl-2">
                      <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">
                        Code
                      </span>
                      <span className="font-mono font-black text-sm text-[#171A3A]">
                        {offer.couponCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(offer.couponCode!)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-bold text-[#171A3A] hover:bg-amber-100 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedCode === offer.couponCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#18A673]" />
                          <span className="text-[#18A673]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="pt-3 border-t border-[#171A3A]/10 flex items-center justify-between text-xs">
                  <span className="text-[#171A3A]/50 font-medium">{offer.validUntil}</span>
                  <a
                    href={offer.directRedeemUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2 bg-[#171A3A] hover:bg-[#18A673] text-white rounded-full font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-xs"
                  >
                    <span>Claim Offer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
