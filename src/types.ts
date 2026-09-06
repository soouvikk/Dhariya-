export type VerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'OUTDATED' | 'UNVERIFIED';

export type CategoryType = 'UR' | 'EWS' | 'OBC' | 'SC' | 'ST' | 'PwD' | 'General';

export interface OfficialSource {
  id: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: 'official_admission_portal' | 'official_gazette' | 'exam_authority' | 'nirf_ranking' | 'institution_website';
  academicYear: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export interface CategoryRule {
  category: CategoryType;
  minimumMarks?: string;
  relaxationNotes?: string;
  seatReservationPercentage?: number;
}

export interface ProgramEligibility {
  qualification: string;
  requiredSubjects: string[];
  minimumMarks: string;
  ageRequirement?: string;
  entranceRequirement: string;
  categoryRules: CategoryRule[];
  academicYear: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
}

export interface FeeComponent {
  name: string; // e.g. Tuition, Admission, Examination, Laboratory, Library, Development, Hostel, Mess
  amount: number;
  currency: string;
  frequency: 'Per Semester' | 'Per Year' | 'One-Time';
  category?: CategoryType;
  academicYear: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerified?: string;
}

export interface ProgramFeeStructure {
  totalAnnualFee: string;
  tuitionFee: string;
  oneTimeCharges?: string;
  components: FeeComponent[];
  categoryFees?: Partial<Record<CategoryType, string>>;
  academicYear: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: 'Government' | 'Institutional' | 'Merit' | 'Need-Based' | 'Category-Specific' | 'Other';
  eligibilityCriteria: string;
  category?: string;
  incomeCriteria?: string;
  academicCriteria?: string;
  benefit: string;
  applicationProcess: string;
  deadline?: string;
  academicYear: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
}

export interface HostelInfo {
  available: boolean;
  hostelFees: string;
  messFees: string;
  roomTypes: string[];
  eligibility: string;
  genderAccommodation: 'Co-ed / Separate Wings' | 'Boys and Girls Separate' | 'Boys Only' | 'Girls Only' | string;
  applicationProcess: string;
  isEstimate: boolean;
  academicYear: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  notes?: string;
}

export interface OfficialPlacementData {
  placementRate: string;
  medianCtc: string;
  averageCtc?: string;
  highestCtc: string;
  topRecruiters: string[];
  nirfYear?: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
}

export interface StudentPlacementExperience {
  realityCheckNote: string;
  internshipOpportunities: string;
  departmentDifferences: string;
  recruitmentExperience: string;
  prepAdvice?: string;
}

export interface PlacementProfile {
  official: OfficialPlacementData;
  studentExperience: StudentPlacementExperience;
}

export interface EntranceExam {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  conductingBody: string;
  level: 'National' | 'State' | 'Institutional';
  degreeLevel: 'UG' | 'PG' | 'Dual';
  eligibilitySummary: string;
  participatingPrograms: string[];
  participatingCollegeCount: number;
  applicationInfo: string;
  importantDates: { event: string; date: string }[];
  officialWebsite: string;
  sourceName: string;
  sourceUrl: string;
  academicYear: string;
  lastVerified: string;
  verificationStatus: VerificationStatus;
}

export interface Course {
  id: string;
  slug: string;
  name: string;
  code: string;
  degreeLevel: 'Undergraduate' | 'Postgraduate' | 'Diploma' | 'Doctoral';
  duration: string;
  overview: string;
  generalEligibility: string;
  requiredSubjects: string[];
  applicableEntranceExams: string[];
  averageFeeRange: string;
  careerOpportunities: string[];
  collegesOfferingCount: number;
  popularSpecializations: string[];
  relevantOffersCount: number;
}

export interface CollegeProgram {
  id: string;
  collegeId: string;
  courseSlug: string;
  name: string;
  code?: string;
  degreeLevel: 'Undergraduate' | 'Postgraduate' | 'Diploma';
  duration: string;
  eligibility: ProgramEligibility;
  entranceExams: {
    examSlug: string;
    examName: string;
    cutoffNote?: string;
  }[];
  feeStructure: ProgramFeeStructure;
  seats?: number;
  scholarshipIds?: string[];
}

export type OfferType =
  | 'course_discount'
  | 'coaching_discount'
  | 'certification'
  | 'student_discount'
  | 'scholarship'
  | 'coupon_code'
  | 'cashback'
  | 'referral';

export interface Offer {
  id: string;
  slug: string;
  title: string;
  provider: string;
  providerUrl?: string;
  type: OfferType;
  discountValue: string;
  couponCode?: string;
  eligibility: string;
  validUntil?: string;
  description: string;
  verificationStatus: VerificationStatus;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
  applicableCourses?: string[];
  directRedeemUrl?: string;
}

export interface PulseMetrics {
  campusLife: number;
  faculty: number;
  placements: number;
  infrastructure: number;
  hostel: number;
  administration: number;
}

export interface ReviewItem {
  id: string;
  collegeId: string;
  collegeSlug: string;
  collegeName: string;
  studentRole: string; // e.g., "B.Tech Computer Science"
  batchYear: string; // e.g., "2025"
  rating: number; // 1 to 5
  quote: string;
  fullReview?: string;
  pros: string[];
  cons: string[];
  sentiment: 'positive' | 'mixed' | 'negative';
  verifiedStudent: boolean;
  date: string;
  helpfulCount: number;
  tags: string[];
  programSlug?: string;
  sourceVerification?: VerificationStatus;
}

export interface CourseOffering {
  name: string;
  level: 'Undergraduate' | 'Postgraduate' | 'Diploma';
  duration: string;
  annualFeeRange: string;
  popularSpecializations?: string[];
}

export interface College {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  location: string;
  state: string;
  type: 'Public State' | 'Public Central' | 'Autonomous' | 'Private' | 'Institute of National Importance';
  establishedYear: number;
  rating: number; // e.g. 4.4
  sentiment: 'Mostly Positive' | 'Highly Recommended' | 'Mixed Sentiment';
  reviewCount: number;
  popularCourse: string;
  featured?: boolean;
  campusAcreage?: string;
  tuitionTier: 'Affordable (Govt)' | 'Moderate' | 'Premium';
  
  // Real Image Hierarchy
  logoUrl?: string;
  coverImageUrl?: string;
  gallery?: string[];
  imageSource?: string;
  imageAlt?: string;

  officialWebsite?: string;
  recognition?: string;

  pulse: PulseMetrics;
  aiSummary: {
    take: string;
    basedOnExperiences: number;
    lastAnalyzed: string;
    keyHighlight: string;
  };
  pros: { text: string; votes: number }[];
  cons: { text: string; votes: number }[];
  courses: CourseOffering[];
  programs?: CollegeProgram[];

  placementStats: {
    medianCtc: string;
    highestCtc?: string;
    topSectors: string[];
    realityCheckNote: string;
  };
  placementProfile?: PlacementProfile;
  hostel?: HostelInfo;
  scholarships?: Scholarship[];
  officialSources?: OfficialSource[];

  campusLifeHighlights: string[];
}

export interface TrendingTopic {
  id: string;
  title: string;
  category: 'Course' | 'College' | 'Exam' | 'Domain';
  trendDirection: 'up' | 'stable';
  searchGrowthNote?: string;
  targetQuery: string;
}

export interface FilterState {
  searchQuery: string;
  state: string;
  course: string;
  minRating: number;
  type: string;
  sentiment: string;
  sortBy: 'relevance' | 'rating' | 'reviews' | 'name';
}

export type SearchIntentType =
  | 'COLLEGE_SEARCH'
  | 'COURSE_SEARCH'
  | 'EXAM_SEARCH'
  | 'ELIGIBILITY_QUERY'
  | 'FEE_QUERY'
  | 'SCHOLARSHIP_QUERY'
  | 'HOSTEL_QUERY'
  | 'PLACEMENT_QUERY'
  | 'COMPARISON_QUERY'
  | 'OFFER_QUERY'
  | 'COUPON_QUERY'
  | 'GENERAL_EDUCATION_QUERY';

export type SearchResultCategory =
  | 'COLLEGE'
  | 'COURSE'
  | 'PROGRAM'
  | 'EXAM'
  | 'SCHOLARSHIP'
  | 'REVIEW'
  | 'OFFER';

export interface SearchResultItem {
  id: string;
  category: SearchResultCategory;
  title: string;
  subtitle: string;
  snippet?: string;
  url: string;
  verified: boolean;
  academicYear?: string;
  lastChecked?: string;
  badge?: string;
  metadata?: Record<string, any>;
}

export interface SearchEngineResponse {
  query: string;
  intent: {
    type: SearchIntentType;
    confidence: number;
    detectedEntities: {
      college?: string;
      course?: string;
      exam?: string;
      location?: string;
      maxFee?: number;
      keyword?: string;
    };
  };
  results: SearchResultItem[];
  totalResults: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'CONTRIBUTOR' | 'MODERATOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
  avatarUrl?: string;
  isStudentVerified: boolean;
  institutionName?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface SavedItem {
  id: string;
  userId: string;
  entityType: 'college' | 'course' | 'exam' | 'offer';
  entityId: string;
  createdAt: string;
}

