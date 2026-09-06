import React, { useState } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WriteReviewModal } from './components/WriteReviewModal';
import { SignInModal } from './components/SignInModal';
import { HomePage } from './views/HomePage';
import { CollegeProfilePage } from './views/CollegeProfilePage';
import { SearchResultsPage } from './views/SearchResultsPage';
import { ComparePage } from './views/ComparePage';
import { ReviewsPage } from './views/ReviewsPage';
import { CoursesPage } from './views/CoursesPage';
import { ExamsPage } from './views/ExamsPage';
import { OffersPage } from './views/OffersPage';
import { REAL_REVIEWS } from './data/realReviews';
import { ReviewItem } from './types';

function AppContent() {
  const { route } = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>(REAL_REVIEWS);

  const handleReviewSubmitted = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const renderCurrentView = () => {
    if (route.path.startsWith('/colleges/') || route.path.startsWith('/college/')) {
      const slug = route.params.slug || 'jadavpur-university';
      return <CollegeProfilePage slug={slug} reviews={reviews} />;
    }

    if (route.path === '/search') {
      return <SearchResultsPage initialQuery={route.query.q || ''} />;
    }

    if (route.path === '/compare') {
      return <ComparePage />;
    }

    if (route.path === '/reviews') {
      return <ReviewsPage reviews={reviews} />;
    }

    if (route.path.startsWith('/courses')) {
      return <CoursesPage />;
    }

    if (route.path.startsWith('/exams')) {
      return <ExamsPage />;
    }

    if (route.path.startsWith('/offers')) {
      return <OffersPage />;
    }

    // Default to HomePage
    return <HomePage reviews={reviews} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#0B0D18] selection:bg-[#6C63FF]/20 selection:text-[#171A3A]">
      <Navbar />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
      <WriteReviewModal onReviewSubmitted={handleReviewSubmitted} />
      <SignInModal />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
