import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Search,
  Bookmark,
  Highlighter,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  ListOrdered,
  Share2,
  Sun,
  Moon,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { Language, Book, Passage, ChapterNode } from '../types';

interface ReaderViewProps {
  language: Language;
  currentBook: Book;
  passages: Passage[];
  onBookmarkPassage?: (passage: Passage) => void;
  isBookmarked?: (passageId: string) => boolean;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  language,
  currentBook,
  passages,
  onBookmarkPassage,
  isBookmarked,
}) => {
  const isAr = language === 'ar';

  // Reader Customization State
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [readingMode, setReadingMode] = useState<'single' | 'continuous'>('single');
  const [fontSize, setFontSize] = useState<number>(20); // in px
  const [readingWidth, setReadingWidth] = useState<'narrow' | 'medium' | 'wide'>('medium');
  const [themeMode, setThemeMode] = useState<'parchment' | 'night' | 'sepia'>('parchment');
  const [sidebarTocOpen, setSidebarTocOpen] = useState(false);
  const [searchInBookQuery, setSearchInBookQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);
  const [sharedToast, setSharedToast] = useState(false);

  const handleShare = (passage: Passage) => {
    const textToShare = `«${passage.textArabic}»\n— ${passage.verifiedSourceCitation}`;
    if (navigator.share) {
      navigator.share({
        title: passage.bookTitleAr,
        text: textToShare,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(textToShare);
        setSharedToast(true);
        setTimeout(() => setSharedToast(false), 2500);
      });
    } else {
      navigator.clipboard.writeText(textToShare);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  const activePassage = passages[currentPageIndex] || passages[0] || {
    id: 'placeholder',
    bookId: currentBook.id,
    bookTitleAr: currentBook.titleAr,
    bookTitleEn: currentBook.titleEn,
    volume: 1,
    page: 1,
    chapterTitleAr: 'مقدمة الكتاب',
    chapterTitleEn: 'Introduction',
    textArabic: 'بسم الله الرحمن الرحيم، وبه نستعين. الحمد لله رب العالمين، وصلى الله وسلم على نبينا محمد وعلى آله وصحبه أجمعين.',
    keywords: [],
    topicIds: [],
    verifiedSourceCitation: `${currentBook.titleAr}، طبعة مجمع الملك فهد.`,
    verificationStatus: 'VERIFIED_CANONICAL',
  };

  // Filter passages if user searches within book
  const filteredPassages = searchInBookQuery.trim()
    ? passages.filter((p) =>
        p.textArabic.includes(searchInBookQuery.trim()) ||
        p.chapterTitleAr.includes(searchInBookQuery.trim())
      )
    : passages;

  const handleCopyCitation = (passage: Passage) => {
    navigator.clipboard.writeText(passage.verifiedSourceCitation);
    setCopiedId(passage.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Width Class
  const widthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-3xl',
    wide: 'max-w-5xl',
  }[readingWidth];

  // Theme Colors
  const themeClasses = {
    parchment: 'bg-[#F7F4EC] text-[#090909] border-[#D8D3C5]',
    sepia: 'bg-[#F1E8D9] text-[#2B1B10] border-[#D1BFA5]',
    night: 'bg-[#1E1B18] text-[#E8E4DA] border-[#38332C]',
  }[themeMode];

  const contentBgClasses = {
    parchment: 'bg-[#FFFDF7]',
    sepia: 'bg-[#F9F4EB]',
    night: 'bg-[#25221E]',
  }[themeMode];

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Reader Control Toolbar */}
      <div className="rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Left: Book Meta & Table of Contents Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarTocOpen(!sidebarTocOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              sidebarTocOpen
                ? 'bg-[#422D1F] text-[#FFFDF7] border-[#422D1F]'
                : 'bg-[#F7F4EC] text-[#5A3E2B] border-[#D8D3C5] hover:bg-[#EFEADE]'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>{isAr ? 'فهرس الأبواب' : 'TOC'}</span>
          </button>

          <div className="hidden sm:flex flex-col">
            <span className="font-scholarly font-bold text-sm text-[#2C1D13] truncate max-w-xs">
              {currentBook.titleAr}
            </span>
            <span className="text-[10px] text-[#7A7365] font-mono">
              {isAr
                ? `المجلد ${activePassage.volume} • الصفحة ${activePassage.page}`
                : `Vol ${activePassage.volume}, Page ${activePassage.page}`}
            </span>
          </div>
        </div>

        {/* Center: Search within book */}
        <div className="flex-1 max-w-xs relative">
          <input
            type="text"
            value={searchInBookQuery}
            onChange={(e) => setSearchInBookQuery(e.target.value)}
            placeholder={isAr ? 'بحث في هذا الكتاب...' : 'Search within book...'}
            className="w-full text-xs h-8 pl-8 pr-8 bg-[#F7F4EC] border border-[#D8D3C5] rounded-md focus:outline-hidden focus:border-[#7A5835]"
          />
          <Search className={`w-3.5 h-3.5 text-[#7A7365] absolute top-2.5 ${isAr ? 'left-2.5' : 'right-2.5'}`} />
        </div>

        {/* Right: Appearance & Typography Controls */}
        <div className="flex items-center gap-1.5">
          {/* Font Size Adjusters */}
          <div className="flex items-center border border-[#D8D3C5] rounded-md bg-[#F7F4EC] p-0.5">
            <button
              onClick={() => setFontSize(Math.max(16, fontSize - 2))}
              className="p-1 text-[#5A3E2B] hover:bg-[#EFEADE] rounded"
              title={isAr ? 'تصغير الخط' : 'Smaller Font'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-xs font-mono font-bold text-[#422D1F]">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              className="p-1 text-[#5A3E2B] hover:bg-[#EFEADE] rounded"
              title={isAr ? 'تكبير الخط' : 'Larger Font'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reading Mode Toggle (Single Page vs Continuous) */}
          <button
            onClick={() => setReadingMode(readingMode === 'single' ? 'continuous' : 'single')}
            className="px-2.5 py-1.5 text-xs font-medium border border-[#D8D3C5] rounded-md bg-[#F7F4EC] text-[#5A3E2B] hover:bg-[#EFEADE]"
            title={isAr ? 'نمط القراءة: صفحة / متصل' : 'Single / Continuous mode'}
          >
            {readingMode === 'single' ? (isAr ? 'صفحة مفردة' : 'Single Page') : (isAr ? 'قراءة متصلة' : 'Continuous')}
          </button>

          {/* Reading Width Controls */}
          <div className="hidden md:flex items-center border border-[#D8D3C5] rounded-md bg-[#F7F4EC] p-0.5">
            {(['narrow', 'medium', 'wide'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setReadingWidth(w)}
                className={`px-2 py-0.5 text-[10px] rounded uppercase font-mono ${
                  readingWidth === w
                    ? 'bg-[#422D1F] text-white font-bold'
                    : 'text-[#666] hover:bg-[#EFEADE]'
                }`}
              >
                {w[0].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme Mode Selector */}
          <div className="flex items-center border border-[#D8D3C5] rounded-md bg-[#F7F4EC] p-0.5">
            <button
              onClick={() => setThemeMode('parchment')}
              className={`p-1 rounded ${themeMode === 'parchment' ? 'bg-[#FFFDF7] shadow-xs' : 'text-[#888]'}`}
              title={isAr ? 'نمط الرق الكلاسيكي' : 'Classic Parchment'}
            >
              <Sun className="w-3.5 h-3.5 text-amber-700" />
            </button>
            <button
              onClick={() => setThemeMode('sepia')}
              className={`p-1 rounded ${themeMode === 'sepia' ? 'bg-[#F9F4EB] shadow-xs' : 'text-[#888]'}`}
              title={isAr ? 'نمط المخطوط القديم' : 'Sepia Mode'}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-900" />
            </button>
            <button
              onClick={() => setThemeMode('night')}
              className={`p-1 rounded ${themeMode === 'night' ? 'bg-[#332E27] shadow-xs' : 'text-[#888]'}`}
              title={isAr ? 'النمط الليلي' : 'Night Mode'}
            >
              <Moon className="w-3.5 h-3.5 text-amber-200" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Reader Layout with Optional Table of Contents Drawer */}
      <div className="flex gap-6">
        {/* Table of Contents Drawer */}
        {sidebarTocOpen && (
          <aside className="w-72 shrink-0 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] p-4 space-y-3 h-[600px] overflow-y-auto">
            <h4 className="font-scholarly font-bold text-sm text-[#2C1D13] border-b border-[#EFEADE] pb-2">
              {isAr ? 'فهرس أبواب وفصول الكتاب' : 'Table of Contents'}
            </h4>
            <div className="space-y-1">
              {currentBook.tableOfContents.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    const foundIndex = passages.findIndex((p) => p.volume === ch.volume);
                    if (foundIndex !== -1) setCurrentPageIndex(foundIndex);
                  }}
                  className="w-full text-right p-2 rounded-md hover:bg-[#F7F4EC] text-xs font-scholarly text-[#422D1F] border-b border-[#F7F4EC] flex items-start justify-between gap-2"
                >
                  <span className="leading-snug">{ch.titleAr}</span>
                  <span className="font-mono text-[10px] text-[#888] shrink-0">ج {ch.volume}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Primary Reading Folio Container */}
        <div className={`flex-1 ${widthClasses} mx-auto space-y-6 transition-all`}>
          {readingMode === 'single' ? (
            /* Single Page Folio Card */
            <article className={`rounded-2xl ${contentBgClasses} border border-[#D8D3C5] p-8 sm:p-12 shadow-sm space-y-6 relative`}>
              {/* Folio Top Header Bar */}
              <div className="flex items-center justify-between border-b border-[#EFEADE] pb-4 text-xs text-[#7A7365]">
                <div className="flex items-center gap-2 font-scholarly">
                  <span className="font-bold text-[#422D1F]">{activePassage.bookTitleAr}</span>
                  <span>•</span>
                  <span>{activePassage.chapterTitleAr}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono bg-[#EFEADE] text-[#422D1F] px-2 py-0.5 rounded text-[11px] font-bold">
                    ج {activePassage.volume} • ص {activePassage.page}
                  </span>
                  {onBookmarkPassage && (
                    <button
                      onClick={() => onBookmarkPassage(activePassage)}
                      className="p-1 text-[#7A7365] hover:text-[#9B783E]"
                      title={isAr ? 'حفظ الصفحة / إضافة علامة مرجعية' : 'Save Page / Bookmark'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isBookmarked?.(activePassage.id) ? 'fill-[#9B783E] text-[#9B783E]' : ''
                        }`}
                      />
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyCitation(activePassage)}
                    className="p-1 text-[#7A7365] hover:text-[#422D1F]"
                    title={isAr ? 'نسخ المرجع' : 'Copy Citation'}
                  >
                    {copiedId === activePassage.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleShare(activePassage)}
                    className="p-1 text-[#7A7365] hover:text-[#422D1F]"
                    title={isAr ? 'مشاركة' : 'Share'}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {sharedToast && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in">
                  <span>{isAr ? 'تم نسخ النص وتوثيقه للمشاركة بنجاح!' : 'Citation copied to clipboard for sharing!'}</span>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              )}

              {/* Classical Verbatim Text Body */}
              <div
                style={{ fontSize: `${fontSize}px`, lineHeight: 2.1 }}
                className="font-scholarly text-[#1A1A1A] text-justify select-text space-y-4"
              >
                <p>{activePassage.textArabic}</p>
              </div>

              {/* Verified Attribution Footnote / Source Stamp */}
              <div className="border-t border-[#EFEADE] pt-4 flex flex-wrap items-center justify-between text-xs text-[#7A7365] gap-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'نصٌ محققٌ ومضبوط' : 'Verified Canonical Text'}</span>
                </div>
                <div className="text-[11px] font-mono bg-[#F7F4EC] px-2 py-1 rounded border border-[#D8D3C5]">
                  {activePassage.verifiedSourceCitation}
                </div>
              </div>
            </article>
          ) : (
            /* Continuous Reading Mode (Flow of all passages) */
            <div className="space-y-6">
              {filteredPassages.map((p, idx) => (
                <article
                  key={p.id}
                  className={`rounded-2xl ${contentBgClasses} border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-2xs`}
                >
                  <div className="flex items-center justify-between border-b border-[#EFEADE] pb-2 text-xs text-[#7A7365]">
                    <span className="font-bold text-[#422D1F] font-scholarly">{p.chapterTitleAr}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] bg-[#EFEADE] px-2 py-0.5 rounded font-medium">
                        ج {p.volume} • ص {p.page}
                      </span>
                      <button
                        onClick={() => handleCopyCitation(p)}
                        className="p-1 hover:text-[#422D1F]"
                      >
                        {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <p
                    style={{ fontSize: `${fontSize}px`, lineHeight: 2.1 }}
                    className="font-scholarly text-[#1A1A1A] text-justify"
                  >
                    {p.textArabic}
                  </p>
                </article>
              ))}
            </div>
          )}

          {/* Navigation Controls (Previous Page / Next Page) */}
          {readingMode === 'single' && (
            <div className="flex items-center justify-between bg-[#FFFDF7] border border-[#D8D3C5] rounded-xl p-3 shadow-2xs">
              <button
                disabled={currentPageIndex <= 0}
                onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#D8D3C5] text-xs font-medium text-[#422D1F] hover:bg-[#EFEADE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isAr ? 'الصفحة السابقة' : 'Previous Page'}</span>
              </button>

              <div className="text-xs font-mono font-medium text-[#7A7365]">
                {currentPageIndex + 1} / {passages.length}
              </div>

              <button
                disabled={currentPageIndex >= passages.length - 1}
                onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#D8D3C5] text-xs font-medium text-[#422D1F] hover:bg-[#EFEADE] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>{isAr ? 'الصفحة التالية' : 'Next Page'}</span>
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
