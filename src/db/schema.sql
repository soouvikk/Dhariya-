-- ====================================================================
-- DHARIYA EDUCATION PLATFORM - POSTGRESQL RELATIONAL SCHEMA
-- Database: PostgreSQL 14+
-- Entities:
--   colleges, programs, courses, entrance_exams, program_exams,
--   eligibility, category_rules, fee_structures, category_fees,
--   scholarships, hostels, placements, reviews, review_votes,
--   student_pulse, official_sources, offers, coupons, referrals, users
-- ====================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE verification_status_enum AS ENUM ('VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'UNVERIFIED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE category_enum AS ENUM ('UR', 'EWS', 'OBC', 'SC', 'ST', 'PwD', 'General');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE offer_type_enum AS ENUM (
        'course_discount',
        'coaching_discount',
        'certification',
        'student_discount',
        'scholarship',
        'coupon_code',
        'cashback',
        'referral'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE degree_level_enum AS ENUM ('Undergraduate', 'Postgraduate', 'Diploma', 'Doctoral');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    avatar_url TEXT,
    is_student_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. OFFICIAL SOURCES
CREATE TABLE IF NOT EXISTS official_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    source_type VARCHAR(100) NOT NULL, -- e.g. official_admission_portal, nirf_ranking
    academic_year VARCHAR(30) NOT NULL,
    last_verified DATE NOT NULL,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COLLEGES
CREATE TABLE IF NOT EXISTS colleges (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    institution_type VARCHAR(100) NOT NULL, -- 'Public State', 'Institute of National Importance', etc.
    established_year INT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 0.0,
    sentiment VARCHAR(50) DEFAULT 'Mostly Positive',
    review_count INT DEFAULT 0,
    popular_course VARCHAR(150),
    featured BOOLEAN DEFAULT FALSE,
    campus_acreage VARCHAR(100),
    tuition_tier VARCHAR(50) NOT NULL, -- 'Affordable (Govt)', 'Moderate', 'Premium'
    logo_url TEXT,
    cover_image_url TEXT,
    gallery TEXT[],
    image_source TEXT,
    image_alt TEXT,
    official_website TEXT,
    recognition TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COURSES (First-class global entities, e.g. BCA, MCA, B.Tech, MBA)
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    degree_level degree_level_enum NOT NULL,
    duration VARCHAR(50) NOT NULL,
    overview TEXT NOT NULL,
    general_eligibility TEXT NOT NULL,
    required_subjects TEXT[] DEFAULT '{}',
    applicable_entrance_exams TEXT[] DEFAULT '{}',
    average_fee_range VARCHAR(100),
    career_opportunities TEXT[] DEFAULT '{}',
    popular_specializations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ENTRANCE EXAMS (First-class global entities, e.g. JEE Main, WBJEE, JECA, CUET UG)
CREATE TABLE IF NOT EXISTS entrance_exams (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    conducting_body VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL, -- 'National', 'State', 'Institutional'
    degree_level VARCHAR(50) NOT NULL, -- 'UG', 'PG', 'Dual'
    eligibility_summary TEXT NOT NULL,
    participating_programs TEXT[] DEFAULT '{}',
    application_info TEXT NOT NULL,
    important_dates JSONB DEFAULT '[]'::jsonb,
    official_website TEXT NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    academic_year VARCHAR(30) NOT NULL,
    last_verified DATE NOT NULL,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. COLLEGE PROGRAMS (College offering a Course)
CREATE TABLE IF NOT EXISTS programs (
    id VARCHAR(100) PRIMARY KEY,
    college_id VARCHAR(100) NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    course_slug VARCHAR(150) NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    degree_level degree_level_enum NOT NULL,
    duration VARCHAR(50) NOT NULL,
    seats INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PROGRAM EXAMS (Program to Entrance Exam mapping with cutoff note)
CREATE TABLE IF NOT EXISTS program_exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id VARCHAR(100) NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    exam_slug VARCHAR(150) NOT NULL REFERENCES entrance_exams(slug) ON DELETE CASCADE,
    cutoff_note TEXT,
    academic_year VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ELIGIBILITY (Program specific)
CREATE TABLE IF NOT EXISTS eligibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id VARCHAR(100) NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    qualification TEXT NOT NULL,
    required_subjects TEXT[] DEFAULT '{}',
    minimum_marks VARCHAR(100) NOT NULL,
    age_requirement VARCHAR(100),
    entrance_requirement TEXT NOT NULL,
    academic_year VARCHAR(30) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    last_verified DATE NOT NULL,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. CATEGORY RULES (UR, EWS, OBC, SC, ST, PwD relaxations for program eligibility)
CREATE TABLE IF NOT EXISTS category_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eligibility_id UUID NOT NULL REFERENCES eligibility(id) ON DELETE CASCADE,
    category category_enum NOT NULL,
    minimum_marks VARCHAR(100),
    relaxation_notes TEXT,
    seat_reservation_percentage NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. FEE STRUCTURES (Program specific)
CREATE TABLE IF NOT EXISTS fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id VARCHAR(100) NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    total_annual_fee VARCHAR(100) NOT NULL,
    tuition_fee VARCHAR(100) NOT NULL,
    one_time_charges VARCHAR(100),
    academic_year VARCHAR(30) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    last_verified DATE NOT NULL,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. CATEGORY FEES & FEE COMPONENTS
CREATE TABLE IF NOT EXISTS category_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    category category_enum NOT NULL,
    fee_amount VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    component_name VARCHAR(150) NOT NULL, -- Tuition, Admission, Lab, Library, etc.
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    frequency VARCHAR(50) NOT NULL, -- 'Per Semester', 'Per Year', 'One-Time'
    academic_year VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. SCHOLARSHIPS
CREATE TABLE IF NOT EXISTS scholarships (
    id VARCHAR(100) PRIMARY KEY,
    college_id VARCHAR(100) REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'Government', 'Institutional', 'Merit', etc.
    eligibility_criteria TEXT NOT NULL,
    category VARCHAR(100),
    income_criteria TEXT,
    academic_criteria TEXT,
    benefit TEXT NOT NULL,
    application_process TEXT NOT NULL,
    deadline VARCHAR(100),
    academic_year VARCHAR(30) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    last_verified DATE NOT NULL,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. HOSTELS
CREATE TABLE IF NOT EXISTS hostels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id VARCHAR(100) NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    hostel_fees VARCHAR(100) NOT NULL,
    mess_fees VARCHAR(100) NOT NULL,
    room_types TEXT[] DEFAULT '{}',
    eligibility TEXT NOT NULL,
    gender_accommodation VARCHAR(100) NOT NULL,
    application_process TEXT NOT NULL,
    is_estimate BOOLEAN DEFAULT FALSE,
    academic_year VARCHAR(30) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    last_verified DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. PLACEMENTS (Official Data & Student Experience strictly separated)
CREATE TABLE IF NOT EXISTS placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id VARCHAR(100) NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    -- Official Placement Data
    official_placement_rate VARCHAR(50) NOT NULL,
    official_median_ctc VARCHAR(50) NOT NULL,
    official_average_ctc VARCHAR(50),
    official_highest_ctc VARCHAR(50) NOT NULL,
    official_top_recruiters TEXT[] DEFAULT '{}',
    official_nirf_year VARCHAR(30),
    official_source_name VARCHAR(255) NOT NULL,
    official_source_url TEXT NOT NULL,
    official_last_verified DATE NOT NULL,
    official_verification_status verification_status_enum DEFAULT 'VERIFIED',
    -- Student Placement Experience
    student_reality_check_note TEXT NOT NULL,
    student_internship_opportunities TEXT NOT NULL,
    student_department_differences TEXT NOT NULL,
    student_recruitment_experience TEXT NOT NULL,
    student_prep_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. STUDENT PULSE (6 Dimensions)
CREATE TABLE IF NOT EXISTS student_pulse (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id VARCHAR(100) NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    campus_life NUMERIC(3,2) NOT NULL,
    faculty NUMERIC(3,2) NOT NULL,
    placements NUMERIC(3,2) NOT NULL,
    infrastructure NUMERIC(3,2) NOT NULL,
    hostel NUMERIC(3,2) NOT NULL,
    administration NUMERIC(3,2) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. REVIEWS & VOTES
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY,
    college_id VARCHAR(100) NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    student_role VARCHAR(150) NOT NULL,
    batch_year VARCHAR(20) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    quote TEXT NOT NULL,
    full_review TEXT,
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    sentiment VARCHAR(20) NOT NULL, -- 'positive', 'mixed', 'negative'
    verified_student BOOLEAN DEFAULT FALSE,
    date_display VARCHAR(50) NOT NULL,
    helpful_count INT DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    program_slug VARCHAR(150),
    source_verification verification_status_enum DEFAULT 'VERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id VARCHAR(100) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

-- 18. OFFERS, COUPONS & REFERRALS (First-class entity)
CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_url TEXT,
    offer_type offer_type_enum NOT NULL,
    discount_value VARCHAR(100) NOT NULL,
    coupon_code VARCHAR(100),
    eligibility TEXT NOT NULL,
    valid_until VARCHAR(50),
    description TEXT NOT NULL,
    verification_status verification_status_enum DEFAULT 'VERIFIED',
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT NOT NULL,
    last_verified DATE NOT NULL,
    applicable_courses TEXT[] DEFAULT '{}',
    direct_redeem_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id VARCHAR(100) NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    discount_percentage INT,
    discount_flat_inr INT,
    valid_from DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id VARCHAR(100) NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    referrer_benefit TEXT NOT NULL,
    referee_benefit TEXT NOT NULL,
    referral_code VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. INDEXES FOR HIGH-SPEED SEARCH & RETRIEVAL
CREATE INDEX IF NOT EXISTS idx_colleges_slug ON colleges(slug);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(institution_type);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_entrance_exams_slug ON entrance_exams(slug);
CREATE INDEX IF NOT EXISTS idx_programs_college ON programs(college_id);
CREATE INDEX IF NOT EXISTS idx_programs_course ON programs(course_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_college ON reviews(college_id);
CREATE INDEX IF NOT EXISTS idx_offers_type ON offers(offer_type);
CREATE INDEX IF NOT EXISTS idx_offers_slug ON offers(slug);
