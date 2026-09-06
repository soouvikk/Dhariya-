import { TrendingTopic } from '../types';

/**
 * DEMO DATASET
 * Curated for Dhariya prototype research and discovery flows.
 * In production, these will stream from Dhariya's analytics & database backend.
 */

export const DEMO_TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'mca',
    title: 'MCA',
    category: 'Course',
    trendDirection: 'up',
    searchGrowthNote: 'High interest in NIT/State university MCA entrance',
    targetQuery: 'MCA',
  },
  {
    id: 'bca',
    title: 'BCA',
    category: 'Course',
    trendDirection: 'up',
    searchGrowthNote: 'Shift toward integrated BCA-MCA tracks',
    targetQuery: 'BCA',
  },
  {
    id: 'mba',
    title: 'MBA',
    category: 'Course',
    trendDirection: 'stable',
    searchGrowthNote: 'ROI-conscious applicants researching Tier 1 vs Tier 2',
    targetQuery: 'MBA',
  },
  {
    id: 'engineering',
    title: 'B.Tech / CSE',
    category: 'Course',
    trendDirection: 'up',
    searchGrowthNote: 'Focus on core placement statistics vs marketed averages',
    targetQuery: 'B.Tech',
  },
  {
    id: 'data-science',
    title: 'Data Science & AI',
    category: 'Domain',
    trendDirection: 'up',
    searchGrowthNote: 'Students checking specialized curriculum depth',
    targetQuery: 'Data Science',
  },
  {
    id: 'online-degrees',
    title: 'Online & Hybrid Programs',
    category: 'Domain',
    trendDirection: 'up',
    searchGrowthNote: 'Credibility and placement reality checks',
    targetQuery: 'Online',
  },
];

export const POPULAR_SEARCH_SUGGESTIONS = [
  { label: 'Jadavpur University', type: 'College', subtext: 'Kolkata, West Bengal', slug: 'jadavpur-university' },
  { label: 'University of Calcutta', type: 'College', subtext: 'Kolkata, West Bengal', slug: 'university-of-calcutta' },
  { label: 'BCA Programs', type: 'Course', subtext: 'Top colleges & fee benchmarks', slug: 'bca' },
  { label: 'MCA (Master of Computer Apps)', type: 'Course', subtext: 'State vs Central options', slug: 'mca' },
  { label: 'MBA Programs', type: 'Course', subtext: 'Authentic ROI & peer feedback', slug: 'mba' },
  { label: 'Presidency University', type: 'College', subtext: 'Kolkata, West Bengal', slug: 'presidency-university' },
  { label: 'IIT Kharagpur', type: 'College', subtext: 'Kharagpur, West Bengal', slug: 'iit-kharagpur' },
  { label: 'St. Xavier’s College', type: 'College', subtext: 'Kolkata, West Bengal', slug: 'st-xaviers-kolkata' },
  { label: 'Delhi Technological University (DTU)', type: 'College', subtext: 'New Delhi', slug: 'dtu-delhi' },
  { label: 'RV College of Engineering', type: 'College', subtext: 'Bengaluru, Karnataka', slug: 'rvce-bengaluru' },
];
