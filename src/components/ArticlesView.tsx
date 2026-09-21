import React, { useState } from 'react';
import { FileSpreadsheet, ExternalLink, Calendar, User, Search, BookOpen } from 'lucide-react';
import { Language, AcademicArticle } from '../types';

interface ArticlesViewProps {
  language: Language;
  articles: AcademicArticle[];
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  language,
  articles,
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = articles.filter((art) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        art.titleAr.includes(q) ||
        art.titleEn.toLowerCase().includes(q) ||
        art.authorAr.includes(q) ||
        (art.abstractAr && art.abstractAr.includes(q)) ||
        (art.summaryAr && art.summaryAr.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-scholarly font-bold text-2xl sm:text-3xl text-[#2C1D13]">
              {isAr ? 'الدراسات والبحوث الأكاديمية المحكمة' : 'Peer-Reviewed Academic Studies'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7365] mt-1">
              {isAr
                ? 'أبحاث ودراسات علمية معاصرة في مناهج شيخ الإسلام ابن تيمية وأصول الاستدلال والتوثيق'
                : 'Scholarly papers on methodology, epistemological synthesis, and ethics of disagreement'}
            </p>
          </div>
          <span className="text-xs font-mono bg-[#EFEADE] text-[#422D1F] px-3 py-1.5 rounded-lg font-bold">
            {articles.length} {isAr ? 'دراسات محكمة' : 'Studies'}
          </span>
        </div>

        <div className="relative pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث في عنوان البحث، الباحث، أو المستخلص...' : 'Search articles...'}
            className="w-full text-xs sm:text-sm h-10 pl-9 pr-9 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg focus:outline-hidden focus:border-[#7A5835]"
          />
          <Search className={`w-4 h-4 text-[#7A7365] absolute top-5 ${isAr ? 'left-3' : 'right-3'}`} />
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map((article) => (
          <article
            key={article.id}
            className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-4 shadow-2xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFEADE] pb-3 text-xs text-[#7A7365]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#422D1F] font-scholarly">{article.authorAr}</span>
                <span>•</span>
                <span>{article.journal}</span>
              </div>
              <span className="font-mono bg-[#EFEADE] text-[#422D1F] px-2 py-0.5 rounded text-[11px] font-bold">
                {article.year} م
              </span>
            </div>

            <div>
              <h3 className="font-scholarly font-bold text-xl text-[#2C1D13] leading-snug">
                {article.titleAr}
              </h3>
              <div className="text-xs text-[#7A7365] font-brand mt-0.5">{article.titleEn}</div>
            </div>

            <p className="font-scholarly text-sm text-[#4A443B] leading-relaxed text-justify bg-[#F7F4EC] p-4 rounded-xl border border-[#D8D3C5]">
              {article.abstractAr || article.summaryAr}
            </p>

            {article.keywords && article.keywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {article.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#FFFDF7] text-[#5A3E2B] border border-[#D8D3C5]"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-[#EFEADE] pt-3 flex items-center justify-between text-xs text-[#7A7365]">
              <span className="font-mono text-[11px]">{article.citation}</span>
              <span className="font-mono text-[11px] text-[#7A5835] font-bold">DOI: {article.doi}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
