import React from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  Bookmark,
  Languages,
  ShieldCheck,
  Menu,
  X,
  Compass,
  FileText,
  BookMarked,
  Layers,
  Info,
} from 'lucide-react';
import { Language, ActiveNavTab } from '../types';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  bookmarksCount: number;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  megaMenuOpen?: boolean;
  onToggleMegaMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  bookmarksCount,
  mobileMenuOpen,
  onToggleMobileMenu,
  megaMenuOpen = false,
  onToggleMegaMenu,
}) => {
  const isAr = language === 'ar';

  const navLinks: { tab: ActiveNavTab; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { tab: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: <Compass className="w-4 h-4" /> },
    { tab: 'topics', labelAr: 'الموسوعة', labelEn: 'Encyclopedia', icon: <Layers className="w-4 h-4" /> },
    { tab: 'books', labelAr: 'الكتب', labelEn: 'Books', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'search', labelAr: 'البحث', labelEn: 'Search', icon: <Search className="w-4 h-4" /> },
    { tab: 'biography', labelAr: 'السيرة', labelEn: 'Biography', icon: <BookMarked className="w-4 h-4" /> },
    { tab: 'topics', labelAr: 'الموضوعات', labelEn: 'Topics', icon: <Layers className="w-4 h-4" /> },
    { tab: 'manuscripts', labelAr: 'المصادر', labelEn: 'Sources', icon: <FileText className="w-4 h-4" /> },
    { tab: 'about', labelAr: 'حول الموسوعة', labelEn: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  // De-duplicate for desktop view
  const primaryDesktopLinks = [
    { tab: 'home' as ActiveNavTab, labelAr: 'الرئيسية', labelEn: 'Home', icon: <Compass className="w-4 h-4" /> },
    { tab: 'books' as ActiveNavTab, labelAr: 'الكتب', labelEn: 'Books', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'search' as ActiveNavTab, labelAr: 'البحث', labelEn: 'Search', icon: <Search className="w-4 h-4" /> },
    { tab: 'biography' as ActiveNavTab, labelAr: 'السيرة', labelEn: 'Biography', icon: <BookMarked className="w-4 h-4" /> },
    { tab: 'topics' as ActiveNavTab, labelAr: 'الموضوعات', labelEn: 'Topics', icon: <Layers className="w-4 h-4" /> },
    { tab: 'manuscripts' as ActiveNavTab, labelAr: 'المصادر', labelEn: 'Sources', icon: <FileText className="w-4 h-4" /> },
    { tab: 'about' as ActiveNavTab, labelAr: 'حول الموسوعة', labelEn: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#D8D3C5]">
      {/* Top Academic Banner */}
      <div className="bg-[#422D1F] text-[#F7F4EC] text-xs py-1.5 px-4 text-center border-b border-[#5A3E2B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#9B783E] animate-pulse" />
            <span className="font-scholarly font-medium">
              {isAr
                ? 'موسوعة شيخ الإسلام ابن تيمية • تراثٌ علمي موثّق • معرفةٌ متاحة • بحثٌ أيسر'
                : 'Ibn Taymiyyah Digital Encyclopedia • Documented Heritage • Accessible Knowledge • Better Research'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#D4AF37]">
            <span>{isAr ? '«اقرأ التراث، وابحث في المصادر، وتحقق من النص»' : 'Explore the heritage. Verify the text.'}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          className="cursor-pointer py-1 shrink-0"
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title={isAr ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
        >
          <BrandLogo size="md" />
        </div>

        {/* Desktop Search Trigger / Input */}
        <div className="hidden xl:flex flex-1 max-w-xs mx-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="w-full relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث في كتب ابن تيمية وعلومه...'
                  : "Search Ibn Taymiyyah's books and works..."
              }
              className="w-full h-9 pl-8 pr-8 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg text-xs text-[#090909] placeholder-[#7A7365] focus:outline-hidden focus:border-[#7A5835] focus:ring-1 focus:ring-[#7A5835] transition-all"
            />
            <button
              type="submit"
              className={`absolute top-2 ${isAr ? 'left-2.5' : 'right-2.5'} text-[#7A7365] hover:text-[#422D1F] p-0.5`}
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <span
              className={`absolute top-2 ${isAr ? 'right-2.5' : 'left-2.5'} text-[9px] text-[#9E9789] font-mono border border-[#D8D3C5] px-1 py-0.2 rounded bg-[#EFEADE]`}
            >
              Ctrl+K
            </span>
          </form>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* MegaMenu Directory Trigger */}
          {onToggleMegaMenu && (
            <button
              onClick={onToggleMegaMenu}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold font-scholarly transition-all ${
                megaMenuOpen
                  ? 'bg-[#9B783E] text-white shadow-xs'
                  : 'bg-[#EFEADE] text-[#422D1F] hover:bg-[#D8D3C5]'
              }`}
              title={isAr ? 'فتح دليل أقسام الموسوعة الشامل' : 'Open Comprehensive Directory'}
            >
              <Compass className={`w-3.5 h-3.5 ${megaMenuOpen ? 'animate-spin' : 'text-[#9B783E]'}`} />
              <span>{isAr ? 'فهرس الأقسام' : 'Directory'}</span>
            </button>
          )}

          {primaryDesktopLinks.map((link, idx) => {
            const isActive = activeTab === link.tab;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectTab(link.tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold font-scholarly transition-colors ${
                  isActive
                    ? 'bg-[#422D1F] text-[#FFFDF7]'
                    : 'text-[#343434] hover:bg-[#EFEADE] hover:text-[#090909]'
                }`}
              >
                {link.icon}
                <span>{isAr ? link.labelAr : link.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions (Language Switcher, Bookmarks, Admin, Mobile Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI Assistant Quick Button */}
          <button
            onClick={() => {
              onSelectTab('assistant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold font-scholarly transition-colors ${
              activeTab === 'assistant'
                ? 'bg-[#422D1F] text-[#FFFDF7]'
                : 'bg-[#F7F4EC] text-[#5A3E2B] border border-[#D8D3C5] hover:bg-[#EFEADE]'
            }`}
            title={isAr ? 'مساعد الباحث العلمي' : 'AI Assistant'}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9B783E]" />
            <span className="hidden xl:inline">{isAr ? 'مساعد الباحث' : 'AI Assistant'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#D8D3C5] bg-[#FFFDF7] text-xs font-semibold text-[#343434] hover:bg-[#EFEADE] hover:text-[#090909] transition-colors"
            title={isAr ? 'تبديل اللغة' : 'Switch Language'}
          >
            <Languages className="w-3.5 h-3.5 text-[#7A5835]" />
            <span className="font-semibold">{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Personal Library Bookmarks */}
          <button
            onClick={() => onSelectTab('library')}
            className={`relative p-2 rounded-md border border-[#D8D3C5] transition-colors ${
              activeTab === 'library'
                ? 'bg-[#422D1F] text-[#FFFDF7]'
                : 'bg-[#FFFDF7] text-[#343434] hover:bg-[#EFEADE]'
            }`}
            title={isAr ? 'مكتبتي والمفضلة' : 'My Library & Bookmarks'}
          >
            <Bookmark className="w-4 h-4" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9B783E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Admin / Scholarly Review Modal */}
          <button
            onClick={() => onSelectTab('admin')}
            className={`hidden md:flex items-center gap-1 p-2 rounded-md border border-[#D8D3C5] text-xs font-medium transition-colors ${
              activeTab === 'admin'
                ? 'bg-[#422D1F] text-[#FFFDF7]'
                : 'bg-[#FFFDF7] text-[#555] hover:bg-[#EFEADE]'
            }`}
            title={isAr ? 'لوحة الإشراف العلمي والتدقيق' : 'Scholarly Review & Admin'}
          >
            <ShieldCheck className="w-4 h-4 text-[#7A5835]" />
            <span className="hidden xl:inline">{isAr ? 'التدقيق' : 'Review'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-md border border-[#D8D3C5] bg-[#FFFDF7] text-[#343434]"
            aria-label={isAr ? 'القائمة' : 'Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Direct Header Drawer) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D8D3C5] bg-[#FFFDF7] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
              onToggleMobileMenu();
            }}
            className="relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isAr ? 'ابحث في كتب ابن تيمية وعلومه...' : "Search Ibn Taymiyyah's books and works..."}
              className="w-full h-10 pl-9 pr-9 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg text-sm text-[#090909] focus:outline-hidden"
            />
            <Search className={`w-4 h-4 text-[#7A7365] absolute top-3 ${isAr ? 'left-3' : 'right-3'}`} />
          </form>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {onToggleMegaMenu && (
              <button
                onClick={() => {
                  onToggleMobileMenu();
                  onToggleMegaMenu();
                }}
                className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-bold bg-[#EFEADE] text-[#422D1F] border border-[#D8D3C5]"
              >
                <Compass className="w-4 h-4 text-[#9B783E]" />
                <span>{isAr ? 'فتح الفهرس ودليل الأقسام الشامل' : 'Open Comprehensive Directory'}</span>
              </button>
            )}
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectTab(link.tab);
                  onToggleMobileMenu();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold font-scholarly transition-colors text-right ${
                  activeTab === link.tab
                    ? 'bg-[#422D1F] text-[#FFFDF7]'
                    : 'bg-[#F7F4EC] text-[#343434] hover:bg-[#EFEADE]'
                }`}
              >
                {link.icon}
                <span>{isAr ? link.labelAr : link.labelEn}</span>
              </button>
            ))}
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="pt-2 border-t border-[#EFEADE] flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onSelectTab('assistant');
                onToggleMobileMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-[#422D1F] text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isAr ? 'مساعد الباحث' : 'AI Assistant'}</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('admin');
                onToggleMobileMenu();
              }}
              className="py-2 px-3 rounded-lg border border-[#D8D3C5] bg-[#F7F4EC] text-[#422D1F] text-xs font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#7A5835]" />
              <span>{isAr ? 'لوحة التدقيق' : 'Review'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
