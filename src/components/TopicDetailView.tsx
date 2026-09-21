import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Quote,
  FileQuestion,
  FileText,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  BookCopy,
} from 'lucide-react';
import { Language, Topic, Book, Passage, Fatwa, AcademicArticle } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { BackButton } from './BackButton';

interface TopicDetailViewProps {
  language: Language;
  topic: Topic;
  allBooks: Book[];
  allPassages: Passage[];
  allFatwas: Fatwa[];
  allArticles: AcademicArticle[];
  onOpenBookInReader: (bookId: string) => void;
  onOpenPassageInReader: (passage: Passage) => void;
  onSelectTopic: (topicId: string) => void;
  onAskAIWithTopic: (topicTitle: string) => void;
  onSearchWithinTopic: (query: string) => void;
  onBack: () => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  language,
  topic,
  allBooks,
  allPassages,
  allFatwas,
  allArticles,
  onOpenBookInReader,
  onOpenPassageInReader,
  onSelectTopic,
  onAskAIWithTopic,
  onSearchWithinTopic,
  onBack,
}) => {
  const isAr = language === 'ar';
  const [copiedPassageId, setCopiedPassageId] = useState<string | null>(null);
  const [topicSearch, setTopicSearch] = useState('');

  // Related books
  const relatedBooks = allBooks.filter((b) =>
    topic.relatedBookIds?.includes(b.id) || b.relatedTopicIds?.includes(topic.id)
  );

  // Related passages
  const relatedPassages = allPassages.filter((p) =>
    p.topicIds?.includes(topic.id)
  );

  // Related fatwas
  const relatedFatwas = allFatwas.filter((f) =>
    f.topicAr?.includes(topic.nameAr) || topic.nameAr.includes(f.topicAr) || f.topicId === topic.id
  );

  // Related articles
  const relatedArticles = allArticles.filter((a) =>
    a.keywords?.some((k) => k.includes(topic.nameAr) || topic.nameAr.includes(k))
  );

  const handleCopyPassageCitation = (citation: string, id: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedPassageId(id);
    setTimeout(() => setCopiedPassageId(null), 2500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topicSearch.trim()) {
      onSearchWithinTopic(`${topic.nameAr} ${topicSearch.trim()}`);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-scholarly">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          language={language}
          items={[
            { label: isAr ? 'دليل الموضوعات' : 'Topics Directory', onClick: onBack },
            { label: topic.nameAr, isCurrent: true },
          ]}
          onNavigateTab={() => onBack()}
        />
        <BackButton language={language} onBack={onBack} label={isAr ? 'العودة للموضوعات' : 'Back to Topics'} />
      </div>

      {/* Main Topic Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEADE] text-[#422D1F] text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-[#9B783E]" />
              <span>{isAr ? 'الموضوع والمبحث العلمي' : 'Scholarly Subject'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#2C1D13]">
              {topic.nameAr}
            </h1>
            <p className="text-xs sm:text-sm text-[#7A7365] font-mono">
              {topic.nameEn}
            </p>
            <p className="text-xs sm:text-sm text-[#343434] leading-relaxed">
              {topic.descriptionAr}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <button
              onClick={() => onAskAIWithTopic(topic.nameAr)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'استفسر من مساعد الباحث' : 'Ask AI Research Assistant'}</span>
            </button>
          </div>
        </div>

        {/* Quick Search within this Topic */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="relative flex items-center bg-[#F7F4EC] border border-[#D8D3C5] rounded-xl p-1">
            <Search className="w-4 h-4 text-[#7A7365] mx-2 shrink-0" />
            <input
              type="text"
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              placeholder={
                isAr
                  ? `ابحث في نصوص ومصنفات موضوع «${topic.nameAr}»...`
                  : `Search within ${topic.nameEn}...`
              }
              className="w-full bg-transparent text-xs text-[#090909] placeholder-[#7A7365] focus:outline-hidden py-1.5"
            />
            <button
              type="submit"
              className="shrink-0 px-4 py-1.5 bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-bold rounded-lg transition-colors"
            >
              {isAr ? 'بحث في الموضوع' : 'Search Topic'}
            </button>
          </div>
        </form>
      </div>

      {/* Grid: Related Books (4 cols) & Related Passages (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Related Books Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-5 space-y-3">
            <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2 border-b border-[#EFEADE] pb-2">
              <BookOpen className="w-4 h-4 text-[#9B783E]" />
              <span>{isAr ? 'المصنفات المرتبطة بهذا الموضوع' : 'Related Works'}</span>
            </h3>

            {relatedBooks.length > 0 ? (
              <div className="space-y-2">
                {relatedBooks.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5] text-xs space-y-1 hover:bg-[#EFEADE] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#2C1D13]">{b.titleAr}</h4>
                      <span className="font-mono text-[10px] text-[#7A7365]">
                        {b.volumesCount} مجلدات
                      </span>
                    </div>
                    <p className="text-[11px] text-[#555] line-clamp-2">
                      {b.descriptionAr}
                    </p>
                    <button
                      onClick={() => onOpenBookInReader(b.id)}
                      className="text-[11px] font-bold text-[#422D1F] hover:text-[#9B783E] inline-flex items-center gap-1 pt-1"
                    >
                      <span>{isAr ? 'قراءة الكتاب' : 'Read Work'}</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A7365]">
                {isAr ? 'راجع فهارس مجموع الفتاوى والكتب الكبرى.' : 'See Majmu al-Fatawa catalog.'}
              </p>
            )}
          </div>

          {/* Related Fatwas and Responsa */}
          {relatedFatwas.length > 0 && (
            <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-5 space-y-3">
              <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2 border-b border-[#EFEADE] pb-2">
                <FileQuestion className="w-4 h-4 text-[#9B783E]" />
                <span>{isAr ? 'فتاوى ومسائل في هذا الباب' : 'Related Responsa'}</span>
              </h3>

              <div className="space-y-2">
                {relatedFatwas.slice(0, 4).map((f) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5] text-xs space-y-1"
                  >
                    <h4 className="font-bold text-[#2C1D13]">{f.questionAr}</h4>
                    <p className="text-[11px] text-[#555] line-clamp-2">{f.answerAr}</p>
                    <div className="text-[10px] text-[#7A7365] pt-1">
                      ج {f.volume} • ص {f.page}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Passages Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2">
              <Quote className="w-4 h-4 text-[#9B783E]" />
              <span>{isAr ? 'النصوص المحققة المعزوة في هذا الموضوع' : 'Documented Passages'}</span>
            </h3>
            <span className="text-xs text-[#7A7365]">
              {relatedPassages.length} {isAr ? 'نصوص معزوة' : 'passages'}
            </span>
          </div>

          {relatedPassages.length > 0 ? (
            <div className="space-y-4">
              {relatedPassages.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-3 shadow-2xs hover:border-[#9B783E] transition-all"
                >
                  <div className="flex items-center justify-between text-xs text-[#7A7365] border-b border-[#EFEADE] pb-2">
                    <span className="font-bold text-[#422D1F]">
                      {p.bookTitleAr} — {p.chapterTitleAr}
                    </span>
                    <span className="font-mono text-[11px] bg-[#EFEADE] px-2 py-0.5 rounded text-[#5A3E2B]">
                      ج {p.volume} • ص {p.page}
                    </span>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-[#1A1A1A] p-3.5 bg-[#F7F4EC] rounded-lg border-r-3 border-[#9B783E] leading-relaxed">
                    «{p.textArabic}»
                  </blockquote>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                    <span className="text-[11px] text-[#7A7365]">
                      {p.verifiedSourceCitation}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyPassageCitation(p.verifiedSourceCitation, p.id)}
                        className="flex items-center gap-1 text-[11px] text-[#5A3E2B] hover:text-[#9B783E] px-2 py-1 rounded bg-[#F7F4EC]"
                      >
                        {copiedPassageId === p.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">{isAr ? 'تم النسخ' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{isAr ? 'نسخ العزو' : 'Copy'}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onOpenPassageInReader(p)}
                        className="font-bold text-[#422D1F] hover:text-[#9B783E] flex items-center gap-0.5"
                      >
                        <span>{isAr ? 'عرض بالسياق' : 'In Context'}</span>
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#FFFDF7] border border-dashed border-[#D8D3C5] text-center space-y-3">
              <Layers className="w-8 h-8 text-[#9B783E] mx-auto opacity-70" />
              <h4 className="font-bold text-sm text-[#422D1F]">
                {isAr ? 'نصوص هذا الموضوع مفهرسة في مصنفات شيخ الإسلام' : 'Corpus indexed under this topic'}
              </h4>
              <p className="text-xs text-[#7A7365] max-w-md mx-auto">
                {isAr
                  ? 'يمكنك استعراض الكتب المرتبطة أعلاه أو إجراء بحث شامل بالنص الكامل عن هذا الموضوع في كافة الأجزاء.'
                  : 'Search the full database to find every occurrence of this topic across all volumes.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
