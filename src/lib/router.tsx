import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

interface RouterContextType {
  route: RouteState;
  navigate: (url: string) => void;
  openWriteReview: (collegeSlug?: string) => void;
  openSignIn: () => void;
  writeReviewModalOpen: boolean;
  signInModalOpen: boolean;
  closeModals: () => void;
  targetReviewCollegeSlug?: string;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function parseUrl(rawUrl: string): RouteState {
  const [pathPart, queryPart] = rawUrl.split('?');
  const query: Record<string, string> = {};
  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    searchParams.forEach((val, key) => {
      query[key] = val;
    });
  }

  const cleanPath = pathPart || '/';
  const params: Record<string, string> = {};

  // Check for /colleges/:slug or /college/:slug
  if (cleanPath.startsWith('/colleges/')) {
    const slug = cleanPath.replace('/colleges/', '').split('/')[0];
    if (slug) params.slug = decodeURIComponent(slug);
  } else if (cleanPath.startsWith('/college/')) {
    const slug = cleanPath.replace('/college/', '').split('/')[0];
    if (slug) params.slug = decodeURIComponent(slug);
  }

  // Check for /courses/:slug
  if (cleanPath.startsWith('/courses/')) {
    const slug = cleanPath.replace('/courses/', '').split('/')[0];
    if (slug) params.slug = decodeURIComponent(slug);
  }

  // Check for /exams/:slug
  if (cleanPath.startsWith('/exams/')) {
    const slug = cleanPath.replace('/exams/', '').split('/')[0];
    if (slug) params.slug = decodeURIComponent(slug);
  }

  return {
    path: cleanPath,
    params,
    query,
  };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window !== 'undefined') {
      const full = window.location.pathname + window.location.search;
      return parseUrl(full || '/');
    }
    return { path: '/', params: {}, query: {} };
  });

  const [writeReviewModalOpen, setWriteReviewModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [targetReviewCollegeSlug, setTargetReviewCollegeSlug] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handlePopState = () => {
      const full = window.location.pathname + window.location.search;
      setRoute(parseUrl(full || '/'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (url: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', url);
      setRoute(parseUrl(url));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openWriteReview = (collegeSlug?: string) => {
    setTargetReviewCollegeSlug(collegeSlug);
    setWriteReviewModalOpen(true);
  };

  const openSignIn = () => {
    setSignInModalOpen(true);
  };

  const closeModals = () => {
    setWriteReviewModalOpen(false);
    setSignInModalOpen(false);
    setTargetReviewCollegeSlug(undefined);
  };

  return (
    <RouterContext.Provider
      value={{
        route,
        navigate,
        openWriteReview,
        openSignIn,
        writeReviewModalOpen,
        signInModalOpen,
        closeModals,
        targetReviewCollegeSlug,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return ctx;
};
