import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, PenLine, User, Menu, X, ArrowRight, Sparkles, Scale, Compass, MessageSquareQuote, BookOpen, GraduationCap, Tag } from 'lucide-react';
import { useRouter } from '../lib/router';

export const Navbar: React.FC = () => {
  const { route, navigate, openWriteReview, openSignIn } = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const executeNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearchQuery.trim())}`);
      setSearchModalOpen(false);
      setNavSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-[#FAFAF7]/90 backdrop-blur-md border-b border-[#171A3A]/10 shadow-xs'
            : 'py-5 sm:py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('/')}
              className="group flex items-center gap-1.5 text-left cursor-pointer focus:outline-none"
            >
              <span className="font-extrabold text-2xl tracking-tighter text-[#171A3A] group-hover:text-[#6C63FF] transition-colors">
                DHARIYA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] mt-1" />
            </button>
          </div>

          {/* Desktop Center Navigation - Editorial Uppercase Wide Tracking */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[12px] font-bold uppercase tracking-widest text-[#171A3A]">
            <button
              onClick={() => handleNavClick('/')}
              className={`hover:text-[#6C63FF] transition-colors cursor-pointer ${
                route.path === '/' ? 'text-[#6C63FF] font-black' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => handleNavClick('/courses')}
              className={`hover:text-[#6C63FF] transition-colors cursor-pointer ${
                route.path.startsWith('/courses') ? 'text-[#6C63FF] font-black' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => handleNavClick('/exams')}
              className={`hover:text-[#6C63FF] transition-colors cursor-pointer ${
                route.path.startsWith('/exams') ? 'text-[#6C63FF] font-black' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Exams
            </button>
            <button
              onClick={() => handleNavClick('/offers')}
              className={`hover:text-[#6C63FF] transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                route.path === '/offers' ? 'text-[#6C63FF] font-black' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <span>Offers</span>
              <span className="px-1.5 py-0.2 rounded-sm bg-[#18A673]/15 text-[#18A673] text-[9px] font-black tracking-normal">
                SAVE
              </span>
            </button>
            <button
              onClick={() => handleNavClick('/compare')}
              className={`hover:text-[#6C63FF] transition-colors cursor-pointer ${
                route.path === '/compare' ? 'text-[#6C63FF] font-black' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => handleNavClick('/reviews')}
              className={`hover:text-[#6C63FF] transition-colors cursor-pointer ${
                route.path === '/reviews' ? 'text-[#6C63FF] font-black' : 'opacity-80 hover:opacity-100'
              }`}
            >
              Reviews
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-[#171A3A] hover:text-[#6C63FF] transition-colors cursor-pointer"
              title="Search colleges and courses"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Write a Review CTA - Editorial Pill */}
            <button
              onClick={() => openWriteReview()}
              className="bg-[#171A3A] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight hover:bg-[#6C63FF] transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <PenLine className="w-3.5 h-3.5 text-[#A79BFF]" />
              <span>Write a Review</span>
            </button>

            {/* Sign In button - Editorial Underline Link */}
            <button
              onClick={() => openSignIn()}
              className="text-xs font-bold uppercase tracking-tight border-b-2 border-[#171A3A] pb-0.5 hover:text-[#6C63FF] hover:border-[#6C63FF] transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-[#171A3A] bg-white/80 border border-[#171A3A]/10 rounded-full"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#171A3A] bg-white/80 border border-[#171A3A]/10 rounded-full"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] z-30 bg-[#FAFAF7] border-b border-[#171A3A]/10 shadow-xl p-5 md:hidden"
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('/')}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-left text-sm font-medium text-[#171A3A]"
              >
                <Compass className="w-4 h-4 text-[#6C63FF]" />
                <span>Explore Colleges</span>
              </button>
              <button
                onClick={() => handleNavClick('/courses')}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-left text-sm font-medium text-[#171A3A]"
              >
                <BookOpen className="w-4 h-4 text-[#6C63FF]" />
                <span>Degrees & Courses</span>
              </button>
              <button
                onClick={() => handleNavClick('/exams')}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-left text-sm font-medium text-[#171A3A]"
              >
                <GraduationCap className="w-4 h-4 text-[#6C63FF]" />
                <span>Entrance Exams</span>
              </button>
              <button
                onClick={() => handleNavClick('/offers')}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white text-left text-sm font-medium text-[#171A3A]"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-[#18A673]" />
                  <span>Student Offers & Coupons</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#18A673]/15 text-[#18A673] text-[10px] font-bold">
                  SAVE
                </span>
              </button>
              <button
                onClick={() => handleNavClick('/compare')}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-left text-sm font-medium text-[#171A3A]"
              >
                <Scale className="w-4 h-4 text-[#6C63FF]" />
                <span>Compare Colleges</span>
              </button>
              <button
                onClick={() => handleNavClick('/reviews')}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-left text-sm font-medium text-[#171A3A]"
              >
                <MessageSquareQuote className="w-4 h-4 text-[#6C63FF]" />
                <span>Student Review Feed</span>
              </button>

              <div className="h-px bg-[#171A3A]/10 my-1" />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWriteReview();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-[#171A3A] bg-white border border-[#171A3A]/15 rounded-xl"
                >
                  <PenLine className="w-3.5 h-3.5 text-[#6C63FF]" />
                  <span>Write Review</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignIn();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-[#171A3A] rounded-xl"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>

              <div className="pt-2 text-center text-[11px] text-[#171A3A]/50">
                Dhariya — Real people. Real experiences.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Quick Search Overlay */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchModalOpen(false)}
              className="fixed inset-0 bg-[#0B0D18]/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#171A3A]/10 overflow-hidden z-10"
            >
              <form onSubmit={executeNavSearch} className="p-3 border-b border-[#171A3A]/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-[#6C63FF] shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  placeholder="Type college or course name..."
                  className="w-full text-base text-[#0B0D18] placeholder-[#171A3A]/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1.5 text-[#171A3A]/40 hover:text-[#171A3A] rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
              <div className="p-4 bg-[#FAFAF7]">
                <div className="text-xs font-semibold text-[#171A3A]/50 uppercase tracking-wider mb-2">
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Jadavpur University', 'University of Calcutta', 'BCA', 'MCA', 'IIT Kharagpur', 'Presidency'].map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(item)}`);
                          setSearchModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-white border border-[#171A3A]/10 hover:border-[#6C63FF] hover:text-[#6C63FF] rounded-lg text-xs font-medium text-[#171A3A] transition-colors"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
