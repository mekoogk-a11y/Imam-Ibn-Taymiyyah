import React, { useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  BookMarked,
  Layers,
  Users,
  FileText,
  FileQuestion,
  Sparkles,
  Bookmark,
  FolderPlus,
  Compass,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Library,
  BookCopy,
  Scroll,
  Headphones,
  Award,
  History,
  Scale,
  MapPin,
} from 'lucide-react';
import { Language, ActiveNavTab } from '../types';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectTab: (tab: ActiveNavTab) => void;
  activeTab?: ActiveNavTab;
  onQuickSearch?: (query: string) => void;
  onSelectBookCategory?: (category: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  language,
  onSelectTab,
  activeTab,
  onQuickSearch,
  onSelectBookCategory,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;

  // Handle ESC key and outside click to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (tab: ActiveNavTab, callback?: () => void) => {
    onSelectTab(tab);
    if (callback) callback();
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090909]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        ref={menuRef}
        id="mega-menu-panel"
        className="w-full max-h-[92vh] overflow-y-auto bg-[#FFFDF7] border-b border-[#D8D3C5] shadow-2xl font-scholarly animate-in slide-in-from-top-4 duration-200"
      >
        {/* Top Header Bar of Mega Menu */}
        <div className="bg-[#422D1F] text-[#FFFDF7] px-6 py-3 border-b border-[#5A3E2B]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <div>
                <h3 className="text-sm font-bold tracking-wide">
                  {isAr ? 'دليل أقسام الموسوعة الشامل' : 'Comprehensive Encyclopedia Directory'}
                </h3>
                <p className="text-[11px] text-[#D8D3C5]">
                  {isAr
                    ? 'فهرس رقمي متقدم لمصنفات وبحوث وفتاوى وتراث شيخ الإسلام'
                    : 'Advanced navigation for books, research, fatwas, and scholarly legacy'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('sitemap')}
                className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded bg-[#5A3E2B] hover:bg-[#7A5835] text-xs text-[#FFFDF7] transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isAr ? 'خريطة الموقع الكاملة' : 'Full Sitemap'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-[#5A3E2B] hover:bg-[#7A5835] text-[#FFFDF7] transition-colors"
                title={isAr ? 'إغلاق القائمة (Esc)' : 'Close menu (Esc)'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Content Grid (8 Professional Columns/Cards) */}
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1: الكتب والمؤلفات */}
            <div className="space-y-3 bg-[#F7F4EC]/50 p-4 rounded-xl border border-[#D8D3C5]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C5] text-[#422D1F]">
                <BookOpen className="w-4 h-4 text-[#9B783E]" />
                <h4 className="font-bold text-sm">
                  {isAr ? 'الكتب والمؤلفات' : 'Books & Treatises'}
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#343434]">
                <li>
                  <button
                    onClick={() => navigateTo('books')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium group"
                  >
                    <span>{isAr ? 'جميع الكتب والمؤلفات' : 'All Books & Catalog'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#7A7365] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('majmu-fatawa')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium group text-[#422D1F]"
                  >
                    <span className="flex items-center gap-1.5">
                      <BookCopy className="w-3.5 h-3.5 text-[#9B783E]" />
                      <strong>{isAr ? 'مجموع الفتاوى (37 مجلداً)' : 'Majmu al-Fatawa (37 Vols)'}</strong>
                    </span>
                    <span className="text-[10px] bg-[#EFEADE] px-1.5 py-0.5 rounded font-mono text-[#5A3E2B]">خاص</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('topics')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'الكتب حسب الموضوع' : 'Books by Topic'}</span>
                    <ArrowIcon className="w-3 h-3 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('books', () => onSelectBookCategory?.('AQIDAH'))}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'كتب العقيدة والتوحيد' : 'Creed & Theology'}</span>
                    <ArrowIcon className="w-3 h-3 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('books', () => onSelectBookCategory?.('POLEMICS'))}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'كتب المنطق والردود' : 'Logic & Polemics'}</span>
                    <ArrowIcon className="w-3 h-3 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('books')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group text-[#7A7365]"
                  >
                    <span>{isAr ? 'المصنفات متعددة الأجزاء' : 'Multi-Volume Works'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: البحث العلمي المتقدم */}
            <div className="space-y-3 bg-[#F7F4EC]/50 p-4 rounded-xl border border-[#D8D3C5]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C5] text-[#422D1F]">
                <Search className="w-4 h-4 text-[#9B783E]" />
                <h4 className="font-bold text-sm">
                  {isAr ? 'البحث العلمي' : 'Scholarly Search'}
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#343434]">
                <li>
                  <button
                    onClick={() => navigateTo('search')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium group"
                  >
                    <span>{isAr ? 'البحث في جميع المحتوى' : 'Global Content Search'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('search', () => onQuickSearch?.('العقل والنقل'))}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'البحث بالعبارة الصريحة' : 'Exact Phrase Search'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('search')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'البحث المتقدم والفلاتر' : 'Advanced Filters & Index'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('search', () => onQuickSearch?.('مجموع الفتاوى'))}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'البحث بالمصدر والطبعة' : 'Search by Edition/Source'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('assistant')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium text-[#422D1F] group"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isAr ? 'مساعد الباحث العلمي (RAG)' : 'AI Research Assistant'}</span>
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: السيرة والتاريخ */}
            <div className="space-y-3 bg-[#F7F4EC]/50 p-4 rounded-xl border border-[#D8D3C5]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C5] text-[#422D1F]">
                <History className="w-4 h-4 text-[#9B783E]" />
                <h4 className="font-bold text-sm">
                  {isAr ? 'السيرة والتاريخ' : 'Biography & History'}
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#343434]">
                <li>
                  <button
                    onClick={() => navigateTo('biography')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium group"
                  >
                    <span>{isAr ? 'السيرة الكاملة لشيخ الإسلام' : 'Full Scholarly Biography'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('timeline')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'الخط الزمني للأحداث (661-728 هـ)' : 'Chronological Timeline'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('scholars')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'الشيوخ والتلاميذ والمحيط العلمي' : 'Teachers & Disciples'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('graph')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'شبكة العلاقات المعرفية' : 'Scholarly Knowledge Graph'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: فهرس الموضوعات الشامل */}
            <div className="space-y-3 bg-[#F7F4EC]/50 p-4 rounded-xl border border-[#D8D3C5]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C5] text-[#422D1F]">
                <Layers className="w-4 h-4 text-[#9B783E]" />
                <h4 className="font-bold text-sm">
                  {isAr ? 'دليل الموضوعات' : 'Topics Directory'}
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#343434]">
                <li>
                  <button
                    onClick={() => navigateTo('topics')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium group"
                  >
                    <span>{isAr ? 'جميع الموضوعات العلمية' : 'All Topics Directory (/topics)'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('topics')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'العقيدة وأسماء الله وصفاته' : 'Creed & Divine Attributes'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('topics')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'صريح المعقول وصحيح المنقول' : 'Reason & Revelation'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('topics')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'السياسة الشرعية والقضاء والعدل' : 'Public Policy & Justice'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: العلماء والشخصيات */}
            <div className="space-y-3 bg-[#F7F4EC]/50 p-4 rounded-xl border border-[#D8D3C5]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C5] text-[#422D1F]">
                <Users className="w-4 h-4 text-[#9B783E]" />
                <h4 className="font-bold text-sm">
                  {isAr ? 'العلماء والشخصيات' : 'Scholars & Network'}
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#343434]">
                <li>
                  <button
                    onClick={() => navigateTo('scholars')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium group"
                  >
                    <span>{isAr ? 'دليل الشيوخ والتلاميذ' : 'Scholars Directory'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('scholars')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'ابن قيم الجوزية' : 'Ibn al-Qayyim'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('scholars')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'الإمام الذهبي وابن كثير' : 'Al-Dhahabi & Ibn Kathir'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 6: المصادر والمخطوطات */}
            <div className="space-y-3 bg-[#F7F4EC]/50 p-4 rounded-xl border border-[#D8D3C5]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C5] text-[#422D1F]">
                <Scroll className="w-4 h-4 text-[#9B783E]" />
                <h4 className="font-bold text-sm">
                  {isAr ? 'المصادر والمخطوطات' : 'Manuscripts & Sources'}
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#343434]">
                <li>
                  <button
                    onClick={() => navigateTo('manuscripts')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium group"
                  >
                    <span>{isAr ? 'خزانة المخطوطات الأصلية' : 'Original Manuscripts Archive'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('manuscripts')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'الطبعات والتحقيقات المعتمدة' : 'Canonical Critical Editions'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('about')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'معايير التوثيق والعزو' : 'Verification Methodology'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 7: الفتاوى والدراسات والصوتيات */}
            <div className="space-y-3 bg-[#F7F4EC]/50 p-4 rounded-xl border border-[#D8D3C5]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D3C5] text-[#422D1F]">
                <FileText className="w-4 h-4 text-[#9B783E]" />
                <h4 className="font-bold text-sm">
                  {isAr ? 'الفتاوى والمحتوى' : 'Fatwas & Content'}
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#343434]">
                <li>
                  <button
                    onClick={() => navigateTo('fatwas')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right font-medium group"
                  >
                    <span>{isAr ? 'قاعدة الفتاوى والمسائل' : 'Fatwas & Responsa'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#7A7365] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('articles')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'الأبحاث والدراسات المحكمة' : 'Scholarly Articles'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('audio')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#EFEADE] text-right group"
                  >
                    <span>{isAr ? 'الدروس والشروح الصوتية' : 'Audio Lectures'}</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 8: أدوات الباحث والمكتبة الشخصية */}
            <div className="space-y-3 bg-[#422D1F] text-[#FFFDF7] p-4 rounded-xl border border-[#5A3E2B]">
              <div className="flex items-center gap-2 pb-2 border-b border-[#5A3E2B]">
                <Bookmark className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="font-bold text-sm">
                  {isAr ? 'أدوات الباحث ومكتبي' : 'Researcher Tools'}
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#F7F4EC]">
                <li>
                  <button
                    onClick={() => navigateTo('library')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#5A3E2B] text-right font-medium group"
                  >
                    <span>{isAr ? 'مكتبتي والعلامات المرجعية' : 'My Bookmarks & Quotes'}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 group-hover:opacity-100" />
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('research-collections')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#5A3E2B] text-right font-medium group text-[#D4AF37]"
                  >
                    <span className="flex items-center gap-1.5">
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'مجموعاتي البحثية' : 'Research Collections'}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('sitemap')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#5A3E2B] text-right group text-[#D8D3C5]"
                  >
                    <span>{isAr ? 'فهرس وخريطة الموسوعة' : 'Encyclopedia Index / Sitemap'}</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('about')}
                    className="flex items-center justify-between w-full p-1.5 rounded hover:bg-[#5A3E2B] text-right group text-[#D8D3C5]"
                  >
                    <span>{isAr ? 'عن الموسوعة وفريق العمل' : 'About & Editorial Board'}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Quick Jump Footer */}
          <div className="mt-6 pt-4 border-t border-[#D8D3C5] flex flex-wrap items-center justify-between gap-3 text-xs text-[#7A7365]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#422D1F]">
                {isAr ? 'اختصارات سريعة:' : 'Quick links:'}
              </span>
              <button
                onClick={() => navigateTo('majmu-fatawa')}
                className="px-2 py-0.5 rounded bg-[#EFEADE] text-[#422D1F] hover:bg-[#D8D3C5] font-semibold"
              >
                {isAr ? 'مجموع الفتاوى' : 'Majmu al-Fatawa'}
              </button>
              <button
                onClick={() => navigateTo('books', () => onQuickSearch?.('درء تعارض'))}
                className="px-2 py-0.5 rounded bg-[#EFEADE] text-[#422D1F] hover:bg-[#D8D3C5]"
              >
                {isAr ? 'درء تعارض العقل والنقل' : 'Dar al-Taarud'}
              </button>
              <button
                onClick={() => navigateTo('books', () => onQuickSearch?.('منهاج السنة'))}
                className="px-2 py-0.5 rounded bg-[#EFEADE] text-[#422D1F] hover:bg-[#D8D3C5]"
              >
                {isAr ? 'منهاج السنة النبوية' : 'Minhaj al-Sunnah'}
              </button>
            </div>

            <div className="text-[11px]">
              {isAr
                ? 'اضغط ESC أو انقر خارج القائمة للإغلاق'
                : 'Press ESC or click outside to close'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
