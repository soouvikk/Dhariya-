import {
  College,
  Course,
  EntranceExam,
  Offer,
  ReviewItem,
  FilterState,
  SearchEngineResponse,
  TrendingTopic,
  SearchResultItem,
} from '../types';
import { REAL_COLLEGES } from '../data/realColleges';
import { REAL_COURSES } from '../data/realCourses';
import { REAL_EXAMS } from '../data/realExams';
import { REAL_OFFERS } from '../data/realOffers';
import { REAL_REVIEWS } from '../data/realReviews';

// In-memory runtime state for submitted reviews and votes
let runtimeReviews: ReviewItem[] = [...REAL_REVIEWS];

/**
 * Intelligent Education Search Engine Matcher
 * Parses user search query, determines query intent, and returns verified multi-category records.
 */
export function executeSearchEngineQuery(query: string): SearchEngineResponse {
  const q = query.trim().toLowerCase();
  const results: SearchResultItem[] = [];

  // Determine intent
  let intentType: SearchEngineResponse['intent']['type'] = 'GENERAL_EDUCATION_QUERY';
  if (q.includes('fee') || q.includes('cost') || q.includes('tuition') || q.includes('price')) {
    intentType = 'FEE_QUERY';
  } else if (q.includes('eligib') || q.includes('cutoff') || q.includes('marks') || q.includes('criteria')) {
    intentType = 'ELIGIBILITY_QUERY';
  } else if (q.includes('scholarship') || q.includes('waiver') || q.includes('grant') || q.includes('svmcm')) {
    intentType = 'SCHOLARSHIP_QUERY';
  } else if (q.includes('hostel') || q.includes('mess') || q.includes('room') || q.includes('stay')) {
    intentType = 'HOSTEL_QUERY';
  } else if (q.includes('placement') || q.includes('salary') || q.includes('package') || q.includes('ctc') || q.includes('highest')) {
    intentType = 'PLACEMENT_QUERY';
  } else if (q.includes('exam') || q.includes('wbjee') || q.includes('jee') || q.includes('jeca') || q.includes('cuet') || q.includes('cat') || q.includes('neet')) {
    intentType = 'EXAM_SEARCH';
  } else if (q.includes('coupon') || q.includes('offer') || q.includes('discount') || q.includes('voucher') || q.includes('free')) {
    intentType = 'OFFER_QUERY';
  } else if (q.includes('bca') || q.includes('btech') || q.includes('mca') || q.includes('mba') || q.includes('engineering') || q.includes('course')) {
    intentType = 'COURSE_SEARCH';
  } else if (q.length > 0) {
    intentType = 'COLLEGE_SEARCH';
  }

  // Match Colleges
  REAL_COLLEGES.forEach((college) => {
    const matchName = college.name.toLowerCase().includes(q) || college.shortName.toLowerCase().includes(q);
    const matchLoc = college.location.toLowerCase().includes(q) || college.state.toLowerCase().includes(q);
    const matchCourses = college.courses.some((c) => c.name.toLowerCase().includes(q));
    const matchPros = college.pros.some((p) => p.text.toLowerCase().includes(q));

    if (q === '' || matchName || matchLoc || matchCourses || matchPros) {
      results.push({
        id: `col-${college.slug}`,
        category: 'COLLEGE',
        title: college.name,
        subtitle: `${college.location} · ${college.tuitionTier} · Est. ${college.establishedYear}`,
        snippet: college.aiSummary.take,
        url: `/college/${college.slug}`,
        verified: true,
        academicYear: '2026–27',
        badge: college.sentiment,
        metadata: {
          rating: college.rating,
          reviewCount: college.reviewCount,
          tuitionTier: college.tuitionTier,
          popularCourse: college.popularCourse,
          slug: college.slug,
          logoUrl: college.logoUrl,
          coverImageUrl: college.coverImageUrl,
        },
      });
    }
  });

  // Match Courses
  REAL_COURSES.forEach((course) => {
    if (
      q === '' ||
      course.name.toLowerCase().includes(q) ||
      course.code.toLowerCase().includes(q) ||
      course.slug.toLowerCase().includes(q) ||
      course.requiredSubjects.some((s) => s.toLowerCase().includes(q))
    ) {
      results.push({
        id: `course-${course.slug}`,
        category: 'COURSE',
        title: `${course.name} (${course.code})`,
        subtitle: `${course.degreeLevel} · ${course.duration} · Avg Fees: ${course.averageFeeRange}`,
        snippet: course.overview,
        url: `/courses/${course.slug}`,
        verified: true,
        academicYear: '2026–27',
        badge: `${course.collegesOfferingCount}+ Verified Colleges`,
        metadata: {
          slug: course.slug,
          exams: course.applicableEntranceExams,
        },
      });
    }
  });

  // Match Exams
  REAL_EXAMS.forEach((exam) => {
    if (
      q === '' ||
      exam.name.toLowerCase().includes(q) ||
      exam.shortName.toLowerCase().includes(q) ||
      exam.slug.toLowerCase().includes(q) ||
      exam.participatingPrograms.some((p) => p.toLowerCase().includes(q))
    ) {
      results.push({
        id: `exam-${exam.slug}`,
        category: 'EXAM',
        title: `${exam.name} (${exam.shortName})`,
        subtitle: `Conducted by ${exam.conductingBody} · ${exam.level} Level`,
        snippet: exam.eligibilitySummary,
        url: `/exams/${exam.slug}`,
        verified: exam.verificationStatus === 'VERIFIED',
        academicYear: exam.academicYear,
        badge: `${exam.participatingCollegeCount} Participating Colleges`,
        metadata: {
          slug: exam.slug,
          officialWebsite: exam.officialWebsite,
        },
      });
    }
  });

  // Match Offers & Coupons
  REAL_OFFERS.forEach((offer) => {
    if (
      q === '' ||
      offer.title.toLowerCase().includes(q) ||
      offer.provider.toLowerCase().includes(q) ||
      offer.type.toLowerCase().includes(q) ||
      (offer.couponCode && offer.couponCode.toLowerCase().includes(q))
    ) {
      results.push({
        id: `offer-${offer.slug}`,
        category: 'OFFER',
        title: offer.title,
        subtitle: `${offer.provider} · ${offer.discountValue}`,
        snippet: offer.description,
        url: `/offers?offer=${offer.slug}`,
        verified: offer.verificationStatus === 'VERIFIED',
        badge: offer.couponCode ? `Coupon: ${offer.couponCode}` : 'Direct Waiver',
        metadata: {
          slug: offer.slug,
          code: offer.couponCode,
          directRedeemUrl: offer.directRedeemUrl,
        },
      });
    }
  });

  return {
    query,
    intent: {
      type: intentType,
      confidence: 0.94,
      detectedEntities: {
        keyword: q,
      },
    },
    results,
    totalResults: results.length,
  };
}

/**
 * Dhariya Education Platform API Client
 */
export const DhariyaAPI = {
  /**
   * Search across Colleges, Courses, Exams, and Offers
   */
  async search(query: string): Promise<SearchEngineResponse> {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback directly to client query engine
    }
    return executeSearchEngineQuery(query);
  },

  /**
   * Get filtered list of verified Colleges
   */
  async getColleges(filters?: Partial<FilterState>): Promise<College[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.searchQuery) queryParams.set('q', filters.searchQuery);
      if (filters?.state) queryParams.set('state', filters.state);
      if (filters?.course) queryParams.set('course', filters.course);
      if (filters?.type) queryParams.set('type', filters.type);
      if (filters?.sentiment) queryParams.set('sentiment', filters.sentiment);
      if (filters?.minRating) queryParams.set('minRating', String(filters.minRating));

      const res = await fetch(`/api/colleges?${queryParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    let colleges = [...REAL_COLLEGES];
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      colleges = colleges.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.shortName.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.popularCourse.toLowerCase().includes(q)
      );
    }
    if (filters?.state && filters.state !== 'all') {
      colleges = colleges.filter((c) => c.state === filters.state);
    }
    if (filters?.type && filters.type !== 'all') {
      colleges = colleges.filter((c) => c.type === filters.type);
    }
    if (filters?.sentiment && filters.sentiment !== 'all') {
      colleges = colleges.filter((c) => c.sentiment === filters.sentiment);
    }
    if (filters?.minRating && filters.minRating > 0) {
      colleges = colleges.filter((c) => c.rating >= (filters.minRating ?? 0));
    }
    return colleges;
  },

  /**
   * Get complete College profile by slug
   */
  async getCollegeBySlug(slug: string): Promise<College | null> {
    try {
      const res = await fetch(`/api/colleges/${encodeURIComponent(slug)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const found = REAL_COLLEGES.find((c) => c.slug === slug);
    return found || null;
  },

  /**
   * Get all first-class Courses
   */
  async getCourses(): Promise<Course[]> {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return REAL_COURSES;
  },

  /**
   * Get Course by slug
   */
  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(slug)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return REAL_COURSES.find((c) => c.slug === slug) || null;
  },

  /**
   * Get all first-class Entrance Exams
   */
  async getExams(): Promise<EntranceExam[]> {
    try {
      const res = await fetch('/api/exams');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return REAL_EXAMS;
  },

  /**
   * Get Entrance Exam by slug
   */
  async getExamBySlug(slug: string): Promise<EntranceExam | null> {
    try {
      const res = await fetch(`/api/exams/${encodeURIComponent(slug)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return REAL_EXAMS.find((e) => e.slug === slug) || null;
  },

  /**
   * Get all verified educational Offers & Coupons
   */
  async getOffers(type?: string): Promise<Offer[]> {
    try {
      const res = await fetch(`/api/offers${type ? `?type=${type}` : ''}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    if (type && type !== 'all') {
      return REAL_OFFERS.filter((o) => o.type === type);
    }
    return REAL_OFFERS;
  },

  /**
   * Match coupon or discount for a pasted education or course URL
   */
  async matchOffersForUrl(targetUrl: string): Promise<{ matchedOffers: Offer[]; searchKeywords: string[] }> {
    try {
      const res = await fetch('/api/offers/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const clean = targetUrl.toLowerCase();
    const matched = REAL_OFFERS.filter((o) => {
      if (clean.includes('coursera') && o.provider.toLowerCase().includes('coursera')) return true;
      if (clean.includes('pw') && o.provider.toLowerCase().includes('physicswallah')) return true;
      if (clean.includes('unacademy') && o.provider.toLowerCase().includes('unacademy')) return true;
      if (clean.includes('github') && o.title.toLowerCase().includes('github')) return true;
      if (clean.includes('apple') && o.provider.toLowerCase().includes('apple')) return true;
      if (clean.includes('aws') && o.provider.toLowerCase().includes('aws')) return true;
      if (clean.includes('hostel') || clean.includes('stanza') || clean.includes('pg')) {
        return o.title.toLowerCase().includes('hostel') || o.title.toLowerCase().includes('living');
      }
      return false;
    });

    return {
      matchedOffers: matched.length > 0 ? matched : REAL_OFFERS.slice(0, 3),
      searchKeywords: [clean.replace(/^https?:\/\//, '').split('/')[0]],
    };
  },

  /**
   * Get reviews with optional college or course filter
   */
  async getReviews(collegeSlug?: string): Promise<ReviewItem[]> {
    try {
      const url = collegeSlug ? `/api/reviews?collegeSlug=${encodeURIComponent(collegeSlug)}` : '/api/reviews';
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    if (collegeSlug) {
      return runtimeReviews.filter((r) => r.collegeSlug === collegeSlug);
    }
    return runtimeReviews;
  },

  /**
   * Submit a student review
   */
  async submitReview(review: Omit<ReviewItem, 'id' | 'date' | 'helpfulCount'>): Promise<ReviewItem> {
    const newReview: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0,
      sourceVerification: 'VERIFIED',
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const saved = await res.json();
        runtimeReviews = [saved, ...runtimeReviews];
        return saved;
      }
    } catch {
      // Fallback
    }

    runtimeReviews = [newReview, ...runtimeReviews];
    return newReview;
  },

  /**
   * Upvote a review as helpful
   */
  async voteReviewHelpful(reviewId: string): Promise<{ success: boolean; helpfulCount: number }> {
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(reviewId)}/vote`, {
        method: 'POST',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const r = runtimeReviews.find((item) => item.id === reviewId);
    if (r) {
      r.helpfulCount += 1;
      return { success: true, helpfulCount: r.helpfulCount };
    }
    return { success: false, helpfulCount: 0 };
  },

  /**
   * Trending topics
   */
  async getTrendingTopics(): Promise<TrendingTopic[]> {
    return [
      { id: 'mca', title: 'MCA Entrance (JECA / NIMCET)', category: 'Course', trendDirection: 'up', searchGrowthNote: 'High interest in NIT/State university MCA entrance', targetQuery: 'MCA' },
      { id: 'btech', title: 'B.Tech / CSE Curricula', category: 'Course', trendDirection: 'up', searchGrowthNote: 'Focus on core placement statistics vs marketed averages', targetQuery: 'B.Tech' },
      { id: 'svmcm', title: 'SVMCM Scholarship 2026', category: 'Exam', trendDirection: 'up', searchGrowthNote: 'State government merit-cum-means renewals', targetQuery: 'SVMCM' },
      { id: 'wbjee', title: 'WBJEE Cutoffs & Portals', category: 'Exam', trendDirection: 'up', searchGrowthNote: 'Jadavpur & Calcutta University ranks', targetQuery: 'WBJEE' },
      { id: 'bca', title: 'BCA Program Benchmarks', category: 'Course', trendDirection: 'up', searchGrowthNote: 'Shift toward integrated BCA-MCA tracks', targetQuery: 'BCA' },
      { id: 'mba', title: 'MBA ROI Reality Check', category: 'Course', trendDirection: 'stable', searchGrowthNote: 'Students analyzing Tier 1 vs Tier 2 fee-to-placement ratio', targetQuery: 'MBA' },
      { id: 'coupons', title: 'Student Tech Discounts', category: 'Domain', trendDirection: 'up', searchGrowthNote: 'GitHub Pack & Coursera waivers', targetQuery: 'Coupons' },
    ];
  },
};
