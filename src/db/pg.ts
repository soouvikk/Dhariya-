import { PGlite } from '@electric-sql/pglite';

let pgInstance: PGlite | null = null;
let initPromise: Promise<PGlite> | null = null;

/**
 * Get or initialize the singleton PostgreSQL database instance
 */
export async function getDb(): Promise<PGlite> {
  if (pgInstance) {
    return pgInstance;
  }

  if (!initPromise) {
    initPromise = (async () => {
      // In-memory or persisted WASM PostgreSQL instance
      const db = new PGlite();
      await setupSchema(db);
      pgInstance = db;
      return db;
    })();
  }

  return initPromise;
}

/**
 * Parameterized SQL query helper
 * Completely protects against SQL injection using standard PostgreSQL parameterized placeholders ($1, $2, ...)
 */
export async function query<T = any>(
  sqlText: string,
  params: any[] = []
): Promise<{ rows: T[]; rowCount: number }> {
  const db = await getDb();
  try {
    const result = await db.query<T>(sqlText, params);
    return {
      rows: result.rows || [],
      rowCount: result.rows ? result.rows.length : 0,
    };
  } catch (error: any) {
    console.error('PostgreSQL Query Error:', error.message, '\nQuery:', sqlText);
    throw error;
  }
}

/**
 * Initialize all PostgreSQL normalized schemas, constraints, foreign keys, and indexes
 */
async function setupSchema(db: PGlite) {
  const ddl = `
    -- 1. USERS & AUTH
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'CONTRIBUTOR', 'MODERATOR', 'EDITOR', 'ADMIN', 'SUPER_ADMIN')),
      avatar_url TEXT,
      is_student_verified BOOLEAN DEFAULT FALSE,
      institution_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otp_codes (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code_hash TEXT NOT NULL,
      purpose TEXT NOT NULL CHECK (purpose IN ('LOGIN', 'VERIFICATION', 'PASSWORD_RESET')),
      attempts INT DEFAULT 0,
      max_attempts INT DEFAULT 5,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. OFFICIAL SOURCES
    CREATE TABLE IF NOT EXISTS official_sources (
      id TEXT PRIMARY KEY,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      source_type TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      last_verified DATE NOT NULL,
      verification_status TEXT DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'UNVERIFIED')),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. COLLEGES
    CREATE TABLE IF NOT EXISTS colleges (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      location TEXT NOT NULL,
      address TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      institution_type TEXT NOT NULL,
      established_year INT NOT NULL,
      rating NUMERIC(3,2) DEFAULT 0.0,
      sentiment TEXT DEFAULT 'Mostly Positive',
      review_count INT DEFAULT 0,
      popular_course TEXT,
      featured BOOLEAN DEFAULT FALSE,
      campus_acreage TEXT,
      tuition_tier TEXT NOT NULL,
      logo_url TEXT,
      cover_image_url TEXT,
      gallery TEXT[] DEFAULT '{}',
      image_source TEXT,
      image_alt TEXT,
      image_updated_at TIMESTAMP WITH TIME ZONE,
      official_website TEXT NOT NULL,
      recognition TEXT,
      source_id TEXT REFERENCES official_sources(id) ON DELETE SET NULL,
      academic_year TEXT NOT NULL DEFAULT '2026–27',
      verification_status TEXT DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'UNVERIFIED')),
      last_verified DATE NOT NULL DEFAULT CURRENT_DATE,
      ai_take TEXT,
      ai_highlight TEXT,
      pros JSONB DEFAULT '[]'::jsonb,
      cons JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. COURSES (Generic First-Class Academic Program Concepts)
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      degree_level TEXT NOT NULL CHECK (degree_level IN ('Undergraduate', 'Postgraduate', 'Diploma', 'Doctoral')),
      duration TEXT NOT NULL,
      overview TEXT NOT NULL,
      general_eligibility TEXT NOT NULL,
      required_subjects TEXT[] DEFAULT '{}',
      applicable_entrance_exams TEXT[] DEFAULT '{}',
      average_fee_range TEXT,
      career_opportunities TEXT[] DEFAULT '{}',
      popular_specializations TEXT[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. PROGRAM OFFERINGS (Specific implementation of a generic Course at a College)
    CREATE TABLE IF NOT EXISTS program_offerings (
      id TEXT PRIMARY KEY,
      college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
      course_slug TEXT NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
      name TEXT NOT NULL,
      code TEXT,
      degree_level TEXT NOT NULL,
      duration TEXT NOT NULL,
      seats INT,
      intake TEXT,
      admission_process TEXT,
      verification_status TEXT DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'UNVERIFIED')),
      academic_year TEXT NOT NULL DEFAULT '2026–27',
      source_id TEXT REFERENCES official_sources(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. ENTRANCE EXAMS
    CREATE TABLE IF NOT EXISTS entrance_exams (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      conducting_body TEXT NOT NULL,
      level TEXT NOT NULL,
      degree_level TEXT NOT NULL,
      eligibility_summary TEXT NOT NULL,
      participating_programs TEXT[] DEFAULT '{}',
      application_info TEXT NOT NULL,
      important_dates JSONB DEFAULT '[]'::jsonb,
      official_website TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      last_verified DATE NOT NULL,
      verification_status TEXT DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'UNVERIFIED')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 7. PROGRAM EXAMS (Link program offering to applicable entrance exam with cutoff notes)
    CREATE TABLE IF NOT EXISTS program_exams (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL REFERENCES program_offerings(id) ON DELETE CASCADE,
      exam_slug TEXT NOT NULL REFERENCES entrance_exams(slug) ON DELETE CASCADE,
      cutoff_note TEXT,
      academic_year TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. ELIGIBILITY & CATEGORY RULES (Program-specific)
    CREATE TABLE IF NOT EXISTS eligibility (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL REFERENCES program_offerings(id) ON DELETE CASCADE,
      qualification TEXT NOT NULL,
      required_subjects TEXT[] DEFAULT '{}',
      minimum_marks TEXT NOT NULL,
      age_requirement TEXT,
      entrance_requirement TEXT NOT NULL,
      notes TEXT,
      academic_year TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      last_verified DATE NOT NULL,
      verification_status TEXT DEFAULT 'VERIFIED',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS category_rules (
      id TEXT PRIMARY KEY,
      eligibility_id TEXT NOT NULL REFERENCES eligibility(id) ON DELETE CASCADE,
      category TEXT NOT NULL CHECK (category IN ('UR', 'EWS', 'OBC', 'SC', 'ST', 'PwD', 'General')),
      minimum_marks TEXT,
      relaxation_notes TEXT,
      seat_reservation_percentage NUMERIC(5,2),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 9. FEES & COMPONENTS
    CREATE TABLE IF NOT EXISTS fee_structures (
      id TEXT PRIMARY KEY,
      program_id TEXT NOT NULL REFERENCES program_offerings(id) ON DELETE CASCADE,
      total_annual_fee TEXT NOT NULL,
      tuition_fee TEXT NOT NULL,
      one_time_charges TEXT,
      academic_year TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      last_verified DATE NOT NULL,
      verification_status TEXT DEFAULT 'VERIFIED',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fee_components (
      id TEXT PRIMARY KEY,
      fee_structure_id TEXT NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
      component_name TEXT NOT NULL,
      amount NUMERIC(10,2) NOT NULL,
      currency TEXT DEFAULT 'INR',
      frequency TEXT NOT NULL,
      academic_year TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS category_fees (
      id TEXT PRIMARY KEY,
      fee_structure_id TEXT NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
      category TEXT NOT NULL CHECK (category IN ('UR', 'EWS', 'OBC', 'SC', 'ST', 'PwD', 'General')),
      fee_amount TEXT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 10. SCHOLARSHIPS
    CREATE TABLE IF NOT EXISTS scholarships (
      id TEXT PRIMARY KEY,
      college_id TEXT REFERENCES colleges(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      provider TEXT NOT NULL,
      type TEXT NOT NULL,
      eligibility_criteria TEXT NOT NULL,
      category TEXT,
      income_criteria TEXT,
      academic_criteria TEXT,
      benefit TEXT NOT NULL,
      application_process TEXT NOT NULL,
      deadline TEXT,
      academic_year TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      last_verified DATE NOT NULL,
      verification_status TEXT DEFAULT 'VERIFIED',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 11. HOSTELS & LIVING REALITIES
    CREATE TABLE IF NOT EXISTS hostels (
      id TEXT PRIMARY KEY,
      college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
      available BOOLEAN NOT NULL DEFAULT TRUE,
      hostel_fees TEXT NOT NULL,
      mess_fees TEXT NOT NULL,
      room_types TEXT[] DEFAULT '{}',
      eligibility TEXT NOT NULL,
      gender_accommodation TEXT NOT NULL,
      application_process TEXT NOT NULL,
      is_estimate BOOLEAN DEFAULT FALSE,
      academic_year TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      last_verified DATE NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 12. PLACEMENTS (Official Statistics Strictly Separated from Student Experience)
    CREATE TABLE IF NOT EXISTS placements (
      id TEXT PRIMARY KEY,
      college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
      official_placement_rate TEXT NOT NULL,
      official_median_ctc TEXT NOT NULL,
      official_average_ctc TEXT,
      official_highest_ctc TEXT NOT NULL,
      official_top_recruiters TEXT[] DEFAULT '{}',
      official_nirf_year TEXT,
      official_source_name TEXT NOT NULL,
      official_source_url TEXT NOT NULL,
      official_last_verified DATE NOT NULL,
      official_verification_status TEXT DEFAULT 'VERIFIED',
      student_reality_check_note TEXT NOT NULL,
      student_internship_opportunities TEXT NOT NULL,
      student_department_differences TEXT NOT NULL,
      student_recruitment_experience TEXT NOT NULL,
      student_prep_advice TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 13. REVIEWS & REVIEW VOTES
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      program_offering_id TEXT REFERENCES program_offerings(id) ON DELETE SET NULL,
      academic_year TEXT NOT NULL DEFAULT '2026–27',
      student_role TEXT NOT NULL,
      batch_year TEXT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      quote TEXT NOT NULL,
      full_review TEXT,
      pros TEXT[] DEFAULT '{}',
      cons TEXT[] DEFAULT '{}',
      sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'mixed', 'negative')),
      verified_student BOOLEAN DEFAULT FALSE,
      date_display TEXT NOT NULL,
      helpful_count INT DEFAULT 0,
      tags TEXT[] DEFAULT '{}',
      program_slug TEXT,
      moderation_status TEXT DEFAULT 'APPROVED' CHECK (moderation_status IN ('APPROVED', 'PENDING', 'REJECTED')),
      source_verification TEXT DEFAULT 'VERIFIED' CHECK (source_verification IN ('VERIFIED', 'NEEDS_REVIEW', 'OUTDATED', 'UNVERIFIED')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, college_id, academic_year)
    );

    CREATE TABLE IF NOT EXISTS review_votes (
      id TEXT PRIMARY KEY,
      review_id TEXT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      voted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(review_id, user_id)
    );

    -- 14. STUDENT PULSE (6 Dimensions)
    CREATE TABLE IF NOT EXISTS student_pulse (
      id TEXT PRIMARY KEY,
      college_id TEXT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
      campus_life NUMERIC(3,2) NOT NULL,
      faculty NUMERIC(3,2) NOT NULL,
      placements NUMERIC(3,2) NOT NULL,
      infrastructure NUMERIC(3,2) NOT NULL,
      hostel NUMERIC(3,2) NOT NULL,
      administration NUMERIC(3,2) NOT NULL,
      sample_size INT NOT NULL DEFAULT 0,
      calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 15. OFFERS & COUPONS (First-Class Education Deals & Student Subsidies)
    CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_url TEXT,
      offer_type TEXT NOT NULL CHECK (offer_type IN (
        'course_discount', 'coaching_discount', 'certification', 'student_discount',
        'scholarship', 'coupon_code', 'cashback', 'referral'
      )),
      discount_value TEXT NOT NULL,
      eligibility TEXT NOT NULL,
      valid_until TEXT,
      description TEXT NOT NULL,
      verification_status TEXT DEFAULT 'VERIFIED',
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      last_verified DATE NOT NULL,
      applicable_courses TEXT[] DEFAULT '{}',
      direct_redeem_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      discount_type TEXT DEFAULT 'percentage',
      discount_value TEXT NOT NULL,
      usage_limit INT,
      times_used INT DEFAULT 0,
      valid_from DATE,
      valid_until DATE,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
      referrer_benefit TEXT NOT NULL,
      referee_benefit TEXT NOT NULL,
      referral_code TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 16. SAVED ITEMS & COMPARISONS
    CREATE TABLE IF NOT EXISTS saved_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entity_type TEXT NOT NULL CHECK (entity_type IN ('college', 'course', 'exam', 'offer', 'scholarship')),
      entity_id TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, entity_type, entity_id)
    );

    CREATE TABLE IF NOT EXISTS comparisons (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entity_type TEXT NOT NULL DEFAULT 'college',
      entity_ids TEXT[] NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 17. AUDIT LOGS & VERIFICATION TASKS
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT,
      actor_email TEXT,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT,
      details JSONB DEFAULT '{}'::jsonb,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS verification_tasks (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      field_name TEXT NOT NULL,
      detected_value TEXT,
      current_value TEXT,
      source_url TEXT,
      status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'DISMISSED')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 18. PERFORMANCE INDEXES
    CREATE INDEX IF NOT EXISTS idx_colleges_slug ON colleges(slug);
    CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
    CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
    CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(institution_type);
    CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
    CREATE INDEX IF NOT EXISTS idx_entrance_exams_slug ON entrance_exams(slug);
    CREATE INDEX IF NOT EXISTS idx_programs_college ON program_offerings(college_id);
    CREATE INDEX IF NOT EXISTS idx_programs_course ON program_offerings(course_slug);
    CREATE INDEX IF NOT EXISTS idx_reviews_college ON reviews(college_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_mod ON reviews(moderation_status);
    CREATE INDEX IF NOT EXISTS idx_offers_type ON offers(offer_type);
    CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(is_active);
    CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_items(user_id);
  `;

  await db.exec(ddl);
}
