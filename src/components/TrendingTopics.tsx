import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { DEMO_TRENDING_TOPICS } from '../data/courses';
import { useRouter } from '../lib/router';

export const TrendingTopics: React.FC = () => {
  const { navigate } = useRouter();

  const handleTopicClick = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#6C63FF]" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#171A3A]">
            What students are researching
          </h2>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#171A3A]/40 hidden sm:inline">Active student queries</span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {DEMO_TRENDING_TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => handleTopicClick(topic.targetQuery)}
            className="group shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#171A3A]/15 hover:border-[#171A3A] hover:shadow-[3px_3px_0px_#171A3A] transition-all cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-extrabold text-[#171A3A] group-hover:text-[#6C63FF] transition-colors">
              {topic.title}
            </span>

            {topic.trendDirection === 'up' && (
              <span className="text-[11px] font-bold text-[#18A673] flex items-center">
                ↑
              </span>
            )}

            <ArrowUpRight className="w-3.5 h-3.5 text-[#171A3A]/40 group-hover:text-[#6C63FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
};
