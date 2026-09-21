import React from 'react';
import { Home, Search, BookOpen, Layers, Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, ActiveNavTab } from '../types';

interface NotFoundViewProps {
  language: Language;
  onSelectTab: (tab: ActiveNavTab) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  language,
  onSelectTab,
}) => {
  const isAr = language === 'ar';

  return (
    <div className="py-16 sm:py-24 text-center font-scholarly space-y-6 max-w-2xl mx-auto px-4">
      {/* 404 Large Number & Icon */}
      <div className="space-y-2">
        <span className="font-mono text-6xl sm:text-8xl font-bold text-[#9B783E]/40 tracking-widest block">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1D13]">
          {isAr ? 'الصفحة المطلوبة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7365] leading-relaxed max-w-md mx-auto">
          {isAr
            ? 'عذراً، الرابط الذي طلبته قد تم نقله أو أن العنوان غير صحيح. يمكنك استخدام خيارات البحث أو الانتقال لأحد الأقسام الرئيسية أدناه.'
            : 'Sorry, the requested page could not be found or has been moved. Use the navigation buttons below to continue your research.'}
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-2.5 rounded-xl bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Home className="w-4 h-4 text-[#D4AF37]" />
          <span>{isAr ? 'العودة للصفحة الرئيسية' : 'Return Home'}</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-[#FFFDF7] hover:bg-[#EFEADE] text-[#422D1F] border border-[#D8D3C5] text-xs font-bold flex items-center gap-2 transition-all"
        >
          <Search className="w-4 h-4 text-[#9B783E]" />
          <span>{isAr ? 'البحث الشامل' : 'Search Encyclopedia'}</span>
        </button>

        <button
          onClick={() => {
            onSelectTab('books');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-[#F7F4EC] hover:bg-[#EFEADE] text-[#5A3E2B] border border-[#D8D3C5] text-xs font-bold flex items-center gap-2 transition-all"
        >
          <BookOpen className="w-4 h-4 text-[#9B783E]" />
          <span>{isAr ? 'استعراض خزانة الكتب' : 'Browse Books'}</span>
        </button>
      </div>

      {/* Quick Links Suggestions */}
      <div className="pt-8 border-t border-[#D8D3C5] space-y-3">
        <span className="text-xs text-[#7A7365] font-bold block">
          {isAr ? 'أقسام يُنصح بزيارتها:' : 'Recommended Sections:'}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            onClick={() => onSelectTab('majmu-fatawa')}
            className="px-3 py-1 rounded-lg bg-[#EFEADE] hover:bg-[#D8D3C5] text-[#422D1F] font-bold"
          >
            {isAr ? 'مجموع الفتاوى' : 'Majmu al-Fatawa'}
          </button>
          <button
            onClick={() => onSelectTab('topics')}
            className="px-3 py-1 rounded-lg bg-[#EFEADE] hover:bg-[#D8D3C5] text-[#422D1F] font-bold"
          >
            {isAr ? 'دليل الموضوعات' : 'Topics Directory'}
          </button>
          <button
            onClick={() => onSelectTab('biography')}
            className="px-3 py-1 rounded-lg bg-[#EFEADE] hover:bg-[#D8D3C5] text-[#422D1F] font-bold"
          >
            {isAr ? 'سيرة شيخ الإسلام' : 'Biography'}
          </button>
          <button
            onClick={() => onSelectTab('sitemap')}
            className="px-3 py-1 rounded-lg bg-[#EFEADE] hover:bg-[#D8D3C5] text-[#422D1F] font-bold"
          >
            {isAr ? 'خريطة الموقع' : 'Sitemap'}
          </button>
        </div>
      </div>
    </div>
  );
};
