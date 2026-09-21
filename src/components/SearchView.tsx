import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Copy,
  Check,
  CheckCircle2,
  Layers,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Info,
  X,
  FileText,
} from 'lucide-react';
import { Language, Book, Topic, Passage } from '../types';

interface SearchViewProps {
  language: Language;
  books: Book[];
  topics: Topic[];
  allPassages: Passage[];
  initialQuery?: string;
  onOpenPassageInReader: (bookId: string, passageId: string) => void;
  onAskAI: (query: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  language,
  books,
  topics,
  allPassages,
  initialQuery = '',
  onOpenPassageInReader,
  onAskAI,
}) => {
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedBookId, setSelectedBookId] = useState<string>('ALL');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSourceModal, setActiveSourceModal] = useState<Passage | null>(null);

  // Normalize Arabic for scholarly full-text search
  const normalize = (txt: string) => {
    return txt
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/[ىي]/g, 'ي')
      .replace(/ة/g, 'ه')
      .trim()
      .toLowerCase();
  };

  const handleCopyCitation = (citation: string, id: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Perform client-side verified full-text search
  const results = allPassages.filter((passage) => {
    if (selectedBookId !== 'ALL' && passage.bookId !== selectedBookId) return false;
    if (selectedTopicId !== 'ALL' && !passage.topicIds.includes(selectedTopicId)) return false;

    if (!searchQuery.trim()) return true;

    const normQuery = normalize(searchQuery);
    const normText = normalize(passage.textArabic);
    const normChapter = normalize(passage.chapterTitleAr);
    const normBook = normalize(passage.bookTitleAr);

    return (
      normText.includes(normQuery) ||
      normChapter.includes(normQuery) ||
      normBook.includes(normQuery) ||
      passage.keywords.some((k) => normalize(k).includes(normQuery))
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Search Header Bar */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-scholarly font-bold text-2xl text-[#2C1D13]">
              {isAr ? 'محرك البحث في تراث ابن تيمية' : 'Ibn Taymiyyah Scholarly Search'}
            </h2>
            <p className="text-xs text-[#7A7365]">
              {isAr
                ? 'فهرس نصوص دقيق موثق بالمجلد والصفحة ورقم الفصل والناشر'
                : 'Verified scholarly full-text search with canonical attribution'}
            </p>
          </div>

          {searchQuery && (
            <button
              onClick={() => onAskAI(searchQuery)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#422D1F] text-[#FFFDF7] text-xs font-medium hover:bg-[#2C1D13] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isAr ? 'استجواب مساعد الباحث حول هذه المسألة' : 'Ask AI Assistant'}</span>
            </button>
          )}
        </div>

        {/* Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث في كتب ابن تيمية وعلومه...'
                : "Search Ibn Taymiyyah's books and works..."
            }
            className="w-full h-12 pl-12 pr-12 bg-[#F7F4EC] border-2 border-[#D8D3C5] focus:border-[#7A5835] rounded-xl text-base text-[#090909] focus:outline-hidden transition-all shadow-inner font-scholarly"
          />
          <Search className={`w-5 h-5 text-[#8B7B69] absolute top-3.5 ${isAr ? 'left-4' : 'right-4'}`} />
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#EFEADE]">
          <div className="flex items-center gap-1 text-xs text-[#7A7365] font-scholarly">
            <Filter className="w-3.5 h-3.5 text-[#9B783E]" />
            <span>{isAr ? 'تصفية النتائج:' : 'Filter by:'}</span>
          </div>

          {/* Book Filter */}
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="text-xs bg-[#F7F4EC] border border-[#D8D3C5] rounded-md px-2.5 py-1.5 text-[#422D1F] focus:outline-hidden font-scholarly"
          >
            <option value="ALL">{isAr ? 'كافة المصنفات والكتب' : 'All Works'}</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.titleAr} ({b.volumesCount} {isAr ? 'مجلد' : 'Vols'})
              </option>
            ))}
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="text-xs bg-[#F7F4EC] border border-[#D8D3C5] rounded-md px-2.5 py-1.5 text-[#422D1F] focus:outline-hidden font-scholarly"
          >
            <option value="ALL">{isAr ? 'كافة الموضوعات والأبواب' : 'All Topics'}</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nameAr}
              </option>
            ))}
          </select>

          <span className="text-xs text-[#7A7365] font-mono mr-auto">
            {isAr ? `النتائج المطابقة: ${results.length}` : `Matched: ${results.length}`}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-3">
            <Search className="w-8 h-8 text-[#9B783E] mx-auto opacity-50" />
            <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
              {isAr
                ? 'لم يتم العثور على نص موثّق في المصادر المتاحة.'
                : 'No verified text was found in the available sources.'}
            </h3>
            <p className="text-xs text-[#7A7365] max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'يلتزم النظام الصرامة التوثيقية بعدم اختلاق أو تخمين أي نصوص غير مقيدة في المصادر المحققة.'
                : 'The encyclopedia enforces strict academic integrity and never invents or approximates unverified texts.'}
            </p>
          </div>
        ) : (
          results.map((p) => {
            const associatedBook = books.find((b) => b.id === p.bookId);

            return (
              <div
                key={p.id}
                className="p-6 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-4 shadow-2xs"
              >
                {/* Result Meta Grid: Book Title, Author, Volume, Page, Chapter */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEADE] pb-3 text-xs text-[#7A7365]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#422D1F] font-scholarly text-sm">
                      {isAr ? 'عنوان الكتاب:' : 'Book:'} {p.bookTitleAr}
                    </span>
                    <span>•</span>
                    <span className="text-[#5A3E2B]">
                      {isAr ? 'المؤلف:' : 'Author:'} شيخ الإسلام ابن تيمية
                    </span>
                    <span>•</span>
                    <span>
                      {isAr ? 'الفصل:' : 'Chapter:'} {p.chapterTitleAr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-[#EFEADE] text-[#422D1F] px-2 py-0.5 rounded text-[11px] font-bold">
                      {isAr ? 'الجزء:' : 'Vol:'} {p.volume} • {isAr ? 'الصفحة:' : 'Page:'} {p.page}
                    </span>
                    <span className="inline-flex items-center gap-1 text-emerald-800 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? 'موثق' : 'Verified'}</span>
                    </span>
                  </div>
                </div>

                {/* Matching Passage Text */}
                <div className="space-y-1">
                  <span className="text-[11px] font-scholarly font-bold text-[#7A7365] block">
                    {isAr ? 'النص المطابق:' : 'Matching Text:'}
                  </span>
                  <p className="font-scholarly text-base sm:text-lg text-[#1A1A1A] leading-relaxed text-justify">
                    «{p.textArabic}»
                  </p>
                </div>

                {/* Keywords Chips */}
                {p.keywords && p.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {p.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#F7F4EC] text-[#5A3E2B] border border-[#D8D3C5]"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Actions: Citation, Copy Citation, View Source, Open in Reader */}
                <div className="border-t border-[#EFEADE] pt-3 flex flex-wrap items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-1 text-[11px] text-[#7A7365]">
                    <strong className="text-[#422D1F]">{isAr ? 'المصدر:' : 'Source:'}</strong>
                    <span className="font-mono">{p.verifiedSourceCitation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Source Button */}
                    <button
                      onClick={() => setActiveSourceModal(p)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#D8D3C5] text-[#5A3E2B] hover:bg-[#EFEADE] transition-colors text-xs"
                      title={isAr ? 'عرض تفاصيل المصدر والطبعة' : 'View Source Details'}
                    >
                      <Info className="w-3.5 h-3.5 text-[#9B783E]" />
                      <span>{isAr ? 'عرض المصدر' : 'View Source'}</span>
                    </button>

                    {/* Copy Citation Button */}
                    <button
                      onClick={() => handleCopyCitation(p.verifiedSourceCitation, p.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#D8D3C5] text-[#5A3E2B] hover:bg-[#EFEADE] transition-colors text-xs"
                      title={isAr ? 'نسخ المرجع' : 'Copy Citation'}
                    >
                      {copiedId === p.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{isAr ? 'تم النسخ' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نسخ المرجع' : 'Copy Citation'}</span>
                        </>
                      )}
                    </button>

                    {/* Open in Reader Button */}
                    <button
                      onClick={() => onOpenPassageInReader(p.bookId, p.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-[#422D1F] text-[#FFFDF7] hover:bg-[#2C1D13] transition-colors text-xs font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isAr ? 'مطالعة في موضعها' : 'Open in Reader'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Source Details Modal (When user clicks 'عرض المصدر') */}
      {activeSourceModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 shadow-xl space-y-4 text-[#090909]">
            <div className="flex items-center justify-between border-b border-[#EFEADE] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#9B783E]" />
                <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
                  {isAr ? 'بيانات التوثيق والمصدر المعتمد' : 'Verified Source Documentation'}
                </h3>
              </div>
              <button
                onClick={() => setActiveSourceModal(null)}
                className="p-1 rounded-md text-[#7A7365] hover:text-[#090909]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5] space-y-1.5 font-scholarly">
                <div>
                  <span className="text-[#7A7365]">{isAr ? 'المصنف:' : 'Work:'} </span>
                  <strong className="text-sm text-[#422D1F]">{activeSourceModal.bookTitleAr}</strong>
                </div>
                <div>
                  <span className="text-[#7A7365]">{isAr ? 'المؤلف:' : 'Author:'} </span>
                  <span>شيخ الإسلام أبو العباس أحمد بن عبد الحليم ابن تيمية الحراني رحمه الله</span>
                </div>
                <div>
                  <span className="text-[#7A7365]">{isAr ? 'الفصل / الباب:' : 'Chapter:'} </span>
                  <span>{activeSourceModal.chapterTitleAr}</span>
                </div>
                <div className="flex gap-4 pt-1 font-mono">
                  <span>{isAr ? 'المجلد:' : 'Volume:'} {activeSourceModal.volume}</span>
                  <span>{isAr ? 'الصفحة:' : 'Page:'} {activeSourceModal.page}</span>
                </div>
              </div>

              <div className="space-y-1 font-scholarly">
                <span className="text-[#7A7365] font-bold block">{isAr ? 'صيغة الإحالة المعتمدة:' : 'Official Scholarly Citation:'}</span>
                <div className="p-3 rounded-lg bg-[#EFEADE] text-[#2C1D13] font-mono text-[11px] select-all">
                  {activeSourceModal.verifiedSourceCitation}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  handleCopyCitation(activeSourceModal.verifiedSourceCitation, activeSourceModal.id);
                  setActiveSourceModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#422D1F] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ المرجع وإغلاق' : 'Copy & Close'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
