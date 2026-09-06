import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { REAL_COLLEGES } from './src/data/realColleges';
import { REAL_COURSES } from './src/data/realCourses';
import { REAL_EXAMS } from './src/data/realExams';
import { REAL_OFFERS } from './src/data/realOffers';
import { REAL_REVIEWS } from './src/data/realReviews';
import { executeSearchEngineQuery } from './src/services/api';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory server-side review store
  let serverReviews = [...REAL_REVIEWS];

  // ==========================================
  // API ROUTES (FIRST)
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Dhariya Education Search Engine', timestamp: new Date().toISOString() });
  });

  // Unified Multi-Entity Search Engine with intent detection
  app.get('/api/search', (req, res) => {
    const query = (req.query.q as string) || '';
    const results = executeSearchEngineQuery(query);
    res.json(results);
  });

  // Colleges List & Filters
  app.get('/api/colleges', (req, res) => {
    const { q, state, course, type, sentiment, minRating } = req.query;
    let colleges = [...REAL_COLLEGES];

    if (q && typeof q === 'string') {
      const search = q.toLowerCase();
      colleges = colleges.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.shortName.toLowerCase().includes(search) ||
          c.location.toLowerCase().includes(search) ||
          c.popularCourse.toLowerCase().includes(search)
      );
    }
    if (state && state !== 'all') {
      colleges = colleges.filter((c) => c.state === state);
    }
    if (type && type !== 'all') {
      colleges = colleges.filter((c) => c.type === type);
    }
    if (sentiment && sentiment !== 'all') {
      colleges = colleges.filter((c) => c.sentiment === sentiment);
    }
    if (minRating) {
      const min = parseFloat(minRating as string);
      if (!isNaN(min)) {
        colleges = colleges.filter((c) => c.rating >= min);
      }
    }

    res.json(colleges);
  });

  // College Profile by Slug
  app.get('/api/colleges/:slug', (req, res) => {
    const slug = req.params.slug;
    const college = REAL_COLLEGES.find((c) => c.slug === slug);
    if (!college) {
      return res.status(404).json({ error: 'College not found in verified registry' });
    }
    res.json(college);
  });

  // Courses List
  app.get('/api/courses', (req, res) => {
    res.json(REAL_COURSES);
  });

  // Course Details by Slug
  app.get('/api/courses/:slug', (req, res) => {
    const slug = req.params.slug;
    const course = REAL_COURSES.find((c) => c.slug === slug);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    // Gather colleges offering this course
    const offeringColleges = REAL_COLLEGES.filter(
      (c) =>
        c.popularCourse.toLowerCase().includes(course.code.toLowerCase()) ||
        c.courses.some((co) => co.name.toLowerCase().includes(course.code.toLowerCase())) ||
        (c.programs && c.programs.some((p) => p.courseSlug === course.slug))
    );
    res.json({ ...course, offeringColleges });
  });

  // Entrance Exams List
  app.get('/api/exams', (req, res) => {
    res.json(REAL_EXAMS);
  });

  // Entrance Exam Details by Slug
  app.get('/api/exams/:slug', (req, res) => {
    const slug = req.params.slug;
    const exam = REAL_EXAMS.find((e) => e.slug === slug);
    if (!exam) {
      return res.status(404).json({ error: 'Entrance exam not found' });
    }
    res.json(exam);
  });

  // Offers & Coupons List
  app.get('/api/offers', (req, res) => {
    const type = req.query.type as string;
    if (type && type !== 'all') {
      return res.json(REAL_OFFERS.filter((o) => o.type === type));
    }
    res.json(REAL_OFFERS);
  });

  // URL Matcher for Educational Offers / Coupons
  app.post('/api/offers/match', (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    const clean = url.toLowerCase();
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

    res.json({
      matchedOffers: matched.length > 0 ? matched : REAL_OFFERS.slice(0, 3),
      searchKeywords: [clean.replace(/^https?:\/\//, '').split('/')[0]],
    });
  });

  // Reviews List
  app.get('/api/reviews', (req, res) => {
    const collegeSlug = req.query.collegeSlug as string;
    if (collegeSlug) {
      return res.json(serverReviews.filter((r) => r.collegeSlug === collegeSlug));
    }
    res.json(serverReviews);
  });

  // Submit Review
  app.post('/api/reviews', (req, res) => {
    const reviewData = req.body;
    const newReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0,
      sourceVerification: 'VERIFIED',
    };
    serverReviews = [newReview, ...serverReviews];
    res.status(201).json(newReview);
  });

  // Vote Review
  app.post('/api/reviews/:id/vote', (req, res) => {
    const id = req.params.id;
    const rev = serverReviews.find((r) => r.id === id);
    if (!rev) {
      return res.status(404).json({ error: 'Review not found' });
    }
    rev.helpfulCount += 1;
    res.json({ success: true, helpfulCount: rev.helpfulCount });
  });

  // ==========================================
  // VITE / STATIC MIDDLEWARE (AFTER API ROUTES)
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dhariya Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
