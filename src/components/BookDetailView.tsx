import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Copy,
  Check,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  BookCopy,
  Quote,
  Sparkles,
  Info,
} from 'lucide-react';
import { Language, Book, Passage } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { BackButton } from './BackButton';

interface BookDetailViewProps {
  language: Language;
  book: Book;
  passages: Passage[];
  onOpenBookInReader: (bookId: string) => void;
  onOpenPassageInReader: (passage: Passage) => void;
  onSelectBook: (bookId: string) => void;
  onSearchWithinBook: (bookId: string, query: string) => void;
  onBack: () => void;
}

export const BookDetailView: React.FC<BookDetailViewProps> = ({
  language,
  book,
  passages,
  onOpenBookInReader,
  onOpenPassageInReader,
  onSelectBook,
  onSearchWithinBook,
  onBack,
}) => {
  const isAr = language === 'ar';
  const [internalQuery, setInternalQuery] = useState('');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedPassageId, setCopiedPassageId] = useState<string | null>(null);

  const bookPassages = passages.filter((p) => p.bookId === book.id);
  const canonicalEdition = book.editions.find((e) => e.isCanonical) || book.editions[0];

  const handleCopyBookCitation = () => {
    const citation = `${book.titleAr}، تأليف شيخ الإسلام ابن تيمية (ت 728 هـ)، ${
      canonicalEdition ? `تحقيق: ${canonicalEdition.editor}، ${canonicalEdition.publisher}` : ''
    }، عدد المجلدات: ${book.volumesCount}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handleCopyPassageCitation = (citation: string, id: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedPassageId(id);
    setTimeout(() => setCopiedPassageId(null), 2500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (internalQuery.trim()) {
      onSearchWithinBook(book.id, internalQuery.trim());
    }
  };

  return (
    <div className="space-y-8 pb-16 font-scholarly">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          language={language}
          items={[
            { label: isAr ? 'المصنفات والكتب' : 'Books Catalog', onClick: onBack },
            { label: book.titleAr, isCurrent: true },
          ]}
          onNavigateTab={() => onBack()}
        />
        <BackButton language={language} onBack={onBack} label={isAr ? 'العودة للكتب' : 'Back to Books'} />
      </div>

      {/* Main Book Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
        {/* Subtle Decorative Geometric Background */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#422D1F]">
            <polygon points="50,5 95,50 50,95 5,50" />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Book Spine / Cover Mockup (3 cols) */}
          <div className="md:col-span-3 flex flex-col items-center">
            <div
              className="w-full max-w-[200px] aspect-[2/3] rounded-xl shadow-lg border-2 border-[#D8D3C5] p-4 flex flex-col justify-between text-[#F7F4EC] relative overflow-hidden"
              style={{ backgroundColor: book.coverColor || '#422D1F' }}
            >
              {/* Gold Geometric Inset Border */}
              <div className="absolute inset-2 border border-[#D4AF37]/40 rounded-lg pointer-events-none" />

              <div className="text-center pt-2 relative z-10">
                <span className="text-[10px] text-[#D4AF37] block font-mono">
                  {isAr ? 'موسوعة شيخ الإسلام' : 'Ibn Taymiyyah Library'}
                </span>
                <span className="text-[10px] text-[#EFEADE]/80 block">
                  {book.volumesCount} {isAr ? 'مجلدات' : 'Volumes'}
                </span>
              </div>

              <div className="text-center py-2 relative z-10">
                <h3 className="text-base sm:text-lg font-bold leading-tight text-[#FFFDF7]">
                  {book.titleAr}
                </h3>
                <span className="text-[10px] text-[#D4AF37] block mt-1">
                  تأليف شيخ الإسلام ابن تيمية
                </span>
              </div>

              <div className="text-center pb-1 text-[9px] text-[#D8D3C5] relative z-10 border-t border-[#D4AF37]/30 pt-1">
                {canonicalEdition?.publisher || 'طبعة محققة معتمدة'}
              </div>
            </div>

            {/* Verification Pill */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEADE] border border-[#D8D3C5] text-xs font-bold text-[#422D1F]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9B783E]" />
              <span>{book.attributionStatus || 'محقق النسبة لشيخ الإسلام'}</span>
            </div>
          </div>

          {/* Book Metadata & Action Controls (9 cols) */}
          <div className="md:col-span-9 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#EFEADE] text-[#5A3E2B] font-bold">
                {book.categoryAr}
              </span>
              <span className="text-xs font-mono text-[#7A7365]">
                {book.volumesCount} {isAr ? 'مجلدات' : 'Vols'} • ~{book.totalPagesApprox} {isAr ? 'صفحة' : 'pages'}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1D13] leading-snug">
                {book.titleAr}
              </h1>
              <p className="text-xs sm:text-sm text-[#7A7365] mt-1 font-mono">
                {book.titleEn}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#343434] leading-relaxed text-justify">
              {book.descriptionAr}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenBookInReader(book.id)}
                className="px-6 py-2.5 rounded-xl bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'اقرأ الكتاب الآن في القارئ' : 'Read in Digital Reader'}</span>
              </button>

              <button
                onClick={handleCopyBookCitation}
                className="px-4 py-2.5 rounded-xl bg-[#FFFDF7] hover:bg-[#EFEADE] text-[#422D1F] border border-[#D8D3C5] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              >
                {copiedCitation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{isAr ? 'تم نسخ التوثيق' : 'Citation Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#9B783E]" />
                    <span>{isAr ? 'نسخ بيانات العزو والتوثيق' : 'Copy Citation'}</span>
                  </>
                )}
              </button>

              {book.legalDownloadUrl && (
                <a
                  href={book.legalDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#F7F4EC] hover:bg-[#EFEADE] text-[#5A3E2B] border border-[#D8D3C5] text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-[#9B783E]" />
                  <span>{isAr ? 'تحميل النسخة المصورة (PDF)' : 'Download PDF Archive'}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}
            </div>

            {/* In-Book Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="relative flex items-center bg-[#F7F4EC] border border-[#D8D3C5] rounded-xl p-1">
                <Search className="w-4 h-4 text-[#7A7365] mx-2 shrink-0" />
                <input
                  type="text"
                  value={internalQuery}
                  onChange={(e) => setInternalQuery(e.target.value)}
                  placeholder={
                    isAr
                      ? `ابحث في نصوص ومسائل كتاب «${book.shortNameAr || book.titleAr}»...`
                      : `Search within ${book.shortNameAr}...`
                  }
                  className="w-full bg-transparent text-xs text-[#090909] placeholder-[#7A7365] focus:outline-hidden py-1.5"
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-1.5 bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-bold rounded-lg transition-colors"
                >
                  {isAr ? 'بحث في الكتاب' : 'Search Work'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Canonical Editions and Table of Contents (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Contents (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#EFEADE] pb-3">
              <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9B783E]" />
                <span>{isAr ? 'فهرس الأبواب والمجلدات والمباحث' : 'Table of Contents'}</span>
              </h3>
              <span className="text-xs font-mono text-[#7A7365]">
                {book.tableOfContents.length} {isAr ? 'أبواب ومجلدات' : 'entries'}
              </span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {book.tableOfContents.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5] text-xs flex items-center justify-between hover:bg-[#EFEADE] transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <span className="font-mono text-[10px] text-[#9B783E] block">
                      المجلد {item.volume} • ص {item.startPage}
                    </span>
                    <h4 className="font-bold text-[#2C1D13] truncate">
                      {item.titleAr}
                    </h4>
                  </div>

                  <button
                    onClick={() => onOpenBookInReader(book.id)}
                    className="shrink-0 px-2.5 py-1 rounded bg-[#FFFDF7] border border-[#D8D3C5] text-[11px] font-bold text-[#422D1F] hover:bg-[#422D1F] hover:text-white transition-colors"
                  >
                    {isAr ? 'قراءة' : 'Read'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Passages from this book */}
          {bookPassages.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2">
                <Quote className="w-4 h-4 text-[#9B783E]" />
                <span>{isAr ? 'نصوص معزوة محققة من هذا المصنف' : 'Verified Excerpts'}</span>
              </h3>

              <div className="space-y-3">
                {bookPassages.map((passage) => (
                  <div
                    key={passage.id}
                    className="p-4 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs text-[#7A7365] border-b border-[#EFEADE] pb-2">
                      <span className="font-bold text-[#422D1F]">
                        {passage.chapterTitleAr}
                      </span>
                      <span className="font-mono text-[11px] bg-[#EFEADE] px-2 py-0.5 rounded">
                        ج {passage.volume} • ص {passage.page}
                      </span>
                    </div>

                    <blockquote className="text-xs sm:text-sm text-[#1A1A1A] p-3 bg-[#F7F4EC] rounded-lg border-r-3 border-[#9B783E] leading-relaxed">
                      «{passage.textArabic}»
                    </blockquote>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                      <span className="text-[11px] text-[#7A7365]">
                        {passage.verifiedSourceCitation}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyPassageCitation(passage.verifiedSourceCitation, passage.id)}
                          className="flex items-center gap-1 text-[11px] text-[#5A3E2B] hover:text-[#9B783E] px-2 py-1 rounded bg-[#F7F4EC]"
                        >
                          {copiedPassageId === passage.id ? (
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
                          onClick={() => onOpenPassageInReader(passage)}
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
            </div>
          )}
        </div>

        {/* Canonical Editions & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-5 space-y-3">
            <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2 border-b border-[#EFEADE] pb-2">
              <ShieldCheck className="w-4 h-4 text-[#9B783E]" />
              <span>{isAr ? 'الطبعات والتحقيقات المعتمدة' : 'Critical Editions'}</span>
            </h3>

            <div className="space-y-3">
              {book.editions.map((ed) => (
                <div
                  key={ed.id}
                  className="p-3.5 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-[#422D1F] text-xs">{ed.editionName}</strong>
                    {ed.isCanonical && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#9B783E] text-white font-bold">
                        طبعة معتمدة
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-[#555] text-[11px]">
                    <div>
                      <span className="text-[#7A7365]">{isAr ? 'المحقق: ' : 'Editor: '}</span>
                      <strong className="text-[#2C1D13]">{ed.editor}</strong>
                    </div>
                    <div>
                      <span className="text-[#7A7365]">{isAr ? 'الناشر والمدينة: ' : 'Publisher: '}</span>
                      <span>{ed.publisher} - {ed.city}</span>
                    </div>
                    {ed.publicationYearHijri && (
                      <div>
                        <span className="text-[#7A7365]">{isAr ? 'سنة الطبع: ' : 'Year: '}</span>
                        <span className="font-mono">{ed.publicationYearHijri} هـ / {ed.publicationYearGregorian} م</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[#7A7365]">{isAr ? 'المصدر الرقمي: ' : 'Digital Source: '}</span>
                      <span>{ed.digitalSource}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scholarly Research Note */}
          <div className="p-4 rounded-xl bg-[#EFEADE] border border-[#D8D3C5] text-xs text-[#422D1F] space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-[#9B783E]" />
              <span>{isAr ? 'تنبيه علمي وتوثيقي' : 'Scholarly Notice'}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-justify">
              {isAr
                ? 'تلتزم موسوعة شيخ الإسلام ابن تيمية بالعزو الدقيق إلى الطبعات الخطية والتحقيقات المعتبرة لدى أهل العلم. يُنصح بمقابلة النصوص على أصولها المطبوعة عند إعداد البحوث والأطروحات الأكاديمية.'
                : 'All quotations and references strictly adhere to recognized critical prints. Scholars and researchers are encouraged to verify citations against original printed editions for academic theses.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
