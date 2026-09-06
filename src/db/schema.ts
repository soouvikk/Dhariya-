/**
 * DHARIYA POSTGRESQL SCHEMA DEFINITIONS
 * Types and table contracts reflecting /src/db/schema.sql
 */

export const DB_TABLES = {
  COLLEGES: 'colleges',
  PROGRAMS: 'programs',
  COURSES: 'courses',
  ENTRANCE_EXAMS: 'entrance_exams',
  PROGRAM_EXAMS: 'program_exams',
  ELIGIBILITY: 'eligibility',
  CATEGORY_RULES: 'category_rules',
  FEE_STRUCTURES: 'fee_structures',
  CATEGORY_FEES: 'category_fees',
  FEE_COMPONENTS: 'fee_components',
  SCHOLARSHIPS: 'scholarships',
  HOSTELS: 'hostels',
  PLACEMENTS: 'placements',
  REVIEWS: 'reviews',
  REVIEW_VOTES: 'review_votes',
  STUDENT_PULSE: 'student_pulse',
  OFFICIAL_SOURCES: 'official_sources',
  OFFERS: 'offers',
  COUPONS: 'coupons',
  REFERRALS: 'referrals',
  USERS: 'users',
} as const;

export type DbTableName = typeof DB_TABLES[keyof typeof DB_TABLES];
