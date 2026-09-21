import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Quote,
  CheckCircle2,
  Calendar,
  Share2,
  FileQuestion,
  Layers,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Language, ActiveNavTab, Book, Passage } from '../types';
import { BrandLogo } from './BrandLogo';

interface HomeViewProps {
  language: Language;
  onSelectTab: (tab: ActiveNavTab) => void;
  onSearch: (q: string) => void;
  onOpenBook: (bookId: string) => void;
  books: Book[];
  samplePassage: Passage;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onSelectTab,
  onSearch,
  onOpenBook,
  books,
  samplePassage,
}) => {
  const isAr = language === 'ar';
  const [localQuery, setLocalQuery] = useState('');
  const [copiedCitation, setCopiedCitation] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery);
      onSelectTab('search');
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(samplePassage.verifiedSourceCitation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const quickSearchPrompts = [
    { ar: 'حقيقة العبادة وتوحيد الألوهية', en: 'Essence of Worship' },
    { ar: 'موافقة صريح المعقول لصحيح المنقول', en: 'Reason & Revelation' },
    { ar: 'إقامة العدل والإنصاف مع المخالف', en: 'Justice for Opponents' },
    { ar: 'حكم التلفظ بالنية في الصلاة', en: 'Vocalizing Intention' },
    { ar: 'الأصل في المعاملات والشروط', en: 'Financial Contracts' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="relative rounded-2xl bg-gradient-to-b from-[#FFFDF7] to-[#EFEADE] border border-[#D8D3C5] p-6 sm:p-10 lg:p-12 text-center overflow-hidden shadow-xs">
        {/* Subtle Geometric Background Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full border-16 border-[#422D1F]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFEADE] border border-[#D8D3C5] text-[#5A3E2B] text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#9B783E]" />
            <span className="font-scholarly font-bold">
              {isAr ? 'منصة البحث والتحقيق الأكاديمي الرقمي' : 'Scholarly Academic Research Platform'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-scholarly font-bold text-[#2C1D13] leading-tight tracking-tight">
            {isAr ? 'موسوعة شيخ الإسلام ابن تيمية' : 'Ibn Taymiyyah Digital Encyclopedia'}
          </h1>

          <p className="text-base sm:text-lg text-[#343434] font-naskh leading-relaxed max-w-2xl mx-auto">
            {isAr
              ? 'منصة رقمية للبحث والقراءة والتعرّف على التراث العلمي الموثق لشيخ الإسلام ابن تيمية رحمه الله.'
              : 'A digital platform for exploring and researching the documented scholarly heritage of Ibn Taymiyyah.'}
          </p>

          {/* Action Buttons: Primary & Secondary */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                onSelectTab('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-xl bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-sm font-bold font-scholarly transition-all shadow-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'ابدأ البحث' : 'Start Searching'}</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('books');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-xl bg-[#FFFDF7] hover:bg-[#EFEADE] text-[#422D1F] border border-[#D8D3C5] text-sm font-bold font-scholarly transition-all shadow-2xs flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#9B783E]" />
              <span>{isAr ? 'استكشف الكتب' : 'Explore Books'}</span>
            </button>
          </div>

          {/* Main Prominent Scholarly Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mt-4">
            <div className="relative flex items-center bg-[#FFFDF7] border-2 border-[#9B783E]/60 focus-within:border-[#5A3E2B] rounded-xl shadow-md p-1.5 transition-all">
              <Search className="w-5 h-5 text-[#8B7B69] mx-3 shrink-0" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث في كتب ابن تيمية وعلومه...'
                    : "Search Ibn Taymiyyah's books and works..."
                }
                className="w-full bg-transparent text-sm sm:text-base text-[#090909] placeholder-[#7A7365] focus:outline-hidden py-2"
              />
              <button
                type="submit"
                className="shrink-0 px-5 py-2.5 bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>{isAr ? 'بحث' : 'Search'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* Quick Search Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-[#7A7365] font-scholarly">
              {isAr ? 'أبرز موضوعات البحث:' : 'Popular Inquiries:'}
            </span>
            {quickSearchPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  onSearch(prompt.ar);
                  onSelectTab('search');
                }}
                className="text-xs px-2.5 py-1 rounded-md bg-[#FFFDF7] hover:bg-[#EFEADE] text-[#5A3E2B] border border-[#D8D3C5] transition-colors"
              >
                {isAr ? prompt.ar : prompt.en}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Key Scholarly Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            num: '37',
            labelAr: 'مجلداً في مجموع الفتاوى',
            labelEn: 'Volumes of Majmu al-Fatawa',
            subAr: 'محققة ومرتبة موضوعياً',
          },
          {
            num: '11',
            labelAr: 'مجلداً في درء التعارض',
            labelEn: 'Volumes of Dar al-Taarud',
            subAr: 'في مواءمة العقل والنقل',
          },
          {
            num: '10,000+',
            labelAr: 'نص موثق برقم الصفحة',
            labelEn: 'Page-Attributed Passages',
            subAr: 'عزو معتمد للطبعات المحققة',
          },
          {
            num: '100%',
            labelAr: 'صرامة توثيقية بلا اختلاق',
            labelEn: 'Zero Hallucination Rigor',
            subAr: 'لا استشهاد دون عزو صريح',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] text-center space-y-1 hover:border-[#9B783E] transition-colors shadow-2xs"
          >
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-[#422D1F]">
              {stat.num}
            </div>
            <div className="font-scholarly font-bold text-xs sm:text-sm text-[#090909]">
              {isAr ? stat.labelAr : stat.labelEn}
            </div>
            <div className="text-[11px] text-[#7A7365]">{stat.subAr}</div>
          </div>
        ))}
      </section>

      {/* 3. Verified Passage of the Day */}
      <section className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#EFEADE] pb-4">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-[#9B783E]" />
            <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
              {isAr ? 'نصٌ علميٌ موثّق' : 'Verified Canonical Passage'}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#F4E8C1] text-[#5A3E2B] font-mono font-medium">
              ج {samplePassage.volume} • ص {samplePassage.page}
            </span>
          </div>
          <button
            onClick={handleCopyCitation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#D8D3C5] text-xs text-[#5A3E2B] hover:bg-[#EFEADE] transition-colors"
          >
            {copiedCitation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">
                  {isAr ? 'تم نسخ المرجع' : 'Citation Copied'}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ المرجع' : 'Copy Citation'}</span>
              </>
            )}
          </button>
        </div>

        {/* Verbatim Classical Arabic Text */}
        <blockquote className="prose-scholarly text-base sm:text-lg text-[#1A1A1A] p-4 bg-[#F7F4EC] rounded-xl border-r-4 border-[#9B783E]">
          «{samplePassage.textArabic}»
        </blockquote>

        {/* Structured Citation Details */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#6A6356] pt-2 gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium text-[#2C1D13]">{samplePassage.bookTitleAr}</span>
            <span>—</span>
            <span>{samplePassage.chapterTitleAr}</span>
          </div>
          <div className="text-[11px] text-[#7A7365] bg-[#EFEADE] px-2 py-1 rounded">
            {samplePassage.verifiedSourceCitation}
          </div>
        </div>
      </section>

      {/* 4. Core Scholarly Works Catalog Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-scholarly font-bold text-[#2C1D13]">
              {isAr ? 'المصنفات والمؤلفات الكبرى' : 'Major Works and Treatises'}
            </h2>
            <p className="text-xs text-[#7A7365]">
              {isAr
                ? 'فهرس المصنفات المعتمدة مع بيانات التحقيق والطبعات المتاحة للقراءة'
                : 'Canonical library of verified editions and digitized treatises'}
            </p>
          </div>
          <button
            onClick={() => onSelectTab('books')}
            className="text-xs font-medium text-[#7A5835] hover:text-[#422D1F] flex items-center gap-1"
          >
            <span>{isAr ? 'عرض كافة الكتب' : 'View All Works'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.slice(0, 6).map((book) => (
            <div
              key={book.id}
              className="p-5 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-3 flex flex-col justify-between group shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EFEADE] text-[#5A3E2B] font-medium font-scholarly">
                    {book.categoryAr}
                  </span>
                  <span className="text-xs font-mono text-[#7A7365]">
                    {book.volumesCount} {isAr ? 'مجلدات' : 'Vols'}
                  </span>
                </div>
                <h3 className="font-scholarly font-bold text-lg text-[#2C1D13] group-hover:text-[#9B783E] transition-colors leading-snug">
                  {book.titleAr}
                </h3>
                <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                  {isAr ? book.descriptionAr : book.descriptionEn}
                </p>
              </div>

              <div className="border-t border-[#EFEADE] pt-3 flex items-center justify-between text-xs">
                <span className="text-[#888] text-[11px]">
                  {book.editions[0]?.publisher || 'مجمع الملك فهد'}
                </span>
                <button
                  onClick={() => onOpenBook(book.id)}
                  className="font-medium text-[#5A3E2B] group-hover:text-[#9B783E] flex items-center gap-1 transition-colors"
                >
                  <span>{isAr ? 'اقرأ واستكشف' : 'Read Work'}</span>
                  {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Scholarly Research Pathways Bento Grid */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-scholarly font-bold text-[#2C1D13]">
          {isAr ? 'مسارات البحث والتحقيق العلمي' : 'Scholarly Research Pathways'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pathway 1: AI Scholarly Assistant */}
          <div
            onClick={() => onSelectTab('assistant')}
            className="cursor-pointer p-5 rounded-xl bg-[#F4E8C1]/40 border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#422D1F] text-[#D4AF37] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-scholarly font-bold text-base text-[#2C1D13] group-hover:text-[#9B783E]">
              {isAr ? 'مساعد الباحث (RAG)' : 'AI Research Assistant'}
            </h3>
            <p className="text-xs text-[#555] leading-relaxed">
              {isAr
                ? 'استجوب نصوص ابن تيمية بنظام RAG صارم يستند حصرياً للنصوص المفهرسة.'
                : 'Query the verified corpus with strict documentary verification rules.'}
            </p>
          </div>

          {/* Pathway 2: Fatwa & Responsa Database */}
          <div
            onClick={() => onSelectTab('fatwas')}
            className="cursor-pointer p-5 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#EFEADE] text-[#5A3E2B] flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
            <h3 className="font-scholarly font-bold text-base text-[#2C1D13] group-hover:text-[#9B783E]">
              {isAr ? 'قاعدة الفتاوى والمسائل' : 'Fatwa Database'}
            </h3>
            <p className="text-xs text-[#555] leading-relaxed">
              {isAr
                ? 'فتاوى محققة في أبواب العبادات والمعاملات والعقائد مع التوثيق بالأجزاء.'
                : 'Verified questions and answers indexed by volume, page, and topic.'}
            </p>
          </div>

          {/* Pathway 3: Interactive Timeline */}
          <div
            onClick={() => onSelectTab('timeline')}
            className="cursor-pointer p-5 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#EFEADE] text-[#5A3E2B] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-scholarly font-bold text-base text-[#2C1D13] group-hover:text-[#9B783E]">
              {isAr ? 'الخط الزمني الموثّق' : 'Chronological Timeline'}
            </h3>
            <p className="text-xs text-[#555] leading-relaxed">
              {isAr
                ? 'تتبع محطات حياته ومناظراته وغزوة شقحب ووفاته بسجلات المؤرخين المعاصرين.'
                : 'Trace major historical events from 661 to 728 AH backed by primary sources.'}
            </p>
          </div>

          {/* Pathway 4: Scholarly Knowledge Graph */}
          <div
            onClick={() => onSelectTab('graph')}
            className="cursor-pointer p-5 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-2 group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-[#EFEADE] text-[#5A3E2B] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="font-scholarly font-bold text-base text-[#2C1D13] group-hover:text-[#9B783E]">
              {isAr ? 'شبكة المعرفة العلمية' : 'Scholarly Knowledge Graph'}
            </h3>
            <p className="text-xs text-[#555] leading-relaxed">
              {isAr
                ? 'استكشف العلاقات بين الكتب والموضوعات والشيوخ (ابن القيم، ابن كثير، الذهبي).'
                : 'Explore semantic connections between books, topics, disciples, and teachers.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
