import React from 'react';
import {
  ShieldCheck,
  Compass,
  BookOpen,
  Search,
  BookMarked,
  Layers,
  FileText,
  Info,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { Language, ActiveNavTab } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: ActiveNavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectTab }) => {
  const isAr = language === 'ar';

  const usefulLinks: { tab: ActiveNavTab; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { tab: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: <Compass className="w-3.5 h-3.5 text-[#9B783E]" /> },
    { tab: 'majmu-fatawa', labelAr: 'مجموع الفتاوى (37 مجلداً)', labelEn: 'Majmu al-Fatawa', icon: <BookOpen className="w-3.5 h-3.5 text-[#9B783E]" /> },
    { tab: 'books', labelAr: 'الكتب والمؤلفات', labelEn: 'Books', icon: <BookOpen className="w-3.5 h-3.5 text-[#9B783E]" /> },
    { tab: 'topics', labelAr: 'دليل الموضوعات (/topics)', labelEn: 'Topics Directory', icon: <Layers className="w-3.5 h-3.5 text-[#9B783E]" /> },
    { tab: 'search', labelAr: 'البحث الشامل', labelEn: 'Search', icon: <Search className="w-3.5 h-3.5 text-[#9B783E]" /> },
    { tab: 'biography', labelAr: 'السيرة والخط الزمني', labelEn: 'Biography', icon: <BookMarked className="w-3.5 h-3.5 text-[#9B783E]" /> },
    { tab: 'research-collections', labelAr: 'مجموعاتي البحثية والمتابعة', labelEn: 'Collections', icon: <FileText className="w-3.5 h-3.5 text-[#9B783E]" /> },
    { tab: 'sitemap', labelAr: 'خريطة الموقع والفهرس', labelEn: 'Sitemap', icon: <Compass className="w-3.5 h-3.5 text-[#9B783E]" /> },
    { tab: 'about', labelAr: 'حول الموسوعة والمنهج', labelEn: 'About', icon: <Info className="w-3.5 h-3.5 text-[#9B783E]" /> },
  ];

  return (
    <footer
      id="main-encyclopedia-footer"
      className="relative bg-[#FFFDF7] text-[#090909] border-t border-[#D8D3C5] pt-14 pb-8 overflow-hidden font-scholarly"
    >
      {/* Subtle Islamic Geometric Watermark Pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035] select-none flex items-center justify-around"
      >
        <svg width="600" height="600" viewBox="0 0 100 100" fill="none" stroke="#422D1F" strokeWidth="0.5">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="28" strokeDasharray="1 2" />
          <polygon points="50,15 85,50 50,85 15,50" />
        </svg>
        <svg width="600" height="600" viewBox="0 0 100 100" fill="none" stroke="#422D1F" strokeWidth="0.5">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
          <circle cx="50" cy="50" r="38" />
          <polygon points="50,15 85,50 50,85 15,50" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main 3-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo size="md" />

            <div className="inline-block px-3 py-1 rounded-md bg-[#EFEADE] border border-[#D8D3C5] text-xs font-semibold text-[#422D1F]">
              {isAr
                ? 'تراثٌ علمي موثّق • معرفةٌ متاحة • بحثٌ أيسر'
                : 'Documented Heritage • Accessible Knowledge • Better Research'}
            </div>

            <p className="text-xs text-[#343434] leading-relaxed text-justify max-w-lg">
              {isAr
                ? 'منصة رقمية موثقة متخصصة في حفظ وفهرسة وتحقيق آثار شيخ الإسلام أحمد بن عبد الحليم ابن تيمية رحمه الله، تهدف إلى إتاحة المصادر الأصيلة للباحثين وفق أدق معايير التوثيق والعزو العلمي.'
                : 'A dedicated academic research platform preserving and indexing the verified corpus of Shaykh al-Islam Ibn Taymiyyah, empowering researchers worldwide with strict attribution and accessible tools.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#5A3E2B]">
              <ShieldCheck className="w-4 h-4 text-[#9B783E]" />
              <span className="font-bold">
                {isAr ? 'عزوٌ معتمد للطبعات والمخطوطات المعتبرة' : 'Attributed to canonical prints and original manuscripts'}
              </span>
            </div>
          </div>

          {/* Useful Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-[#422D1F] border-b border-[#EFEADE] pb-2">
              {isAr ? 'روابط مفيدة' : 'Useful Links'}
            </h4>
            <ul className="space-y-2 text-xs text-[#343434]">
              {usefulLinks.map((link) => (
                <li key={link.tab}>
                  <button
                    onClick={() => {
                      onSelectTab(link.tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 hover:text-[#7A5835] hover:font-bold transition-colors py-0.5 text-right w-full"
                  >
                    {link.icon}
                    <span>{isAr ? link.labelAr : link.labelEn}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact, WhatsApp & Developer Credits (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bold text-sm text-[#422D1F] border-b border-[#EFEADE] pb-2">
              {isAr ? 'التواصل والتطوير' : 'Contact & Development'}
            </h4>

            {/* Developer Credit Card */}
            <div className="p-3.5 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] space-y-2 text-xs">
              <div className="text-[#090909]">
                <span className="text-[#7A7365] block text-[11px]">
                  {isAr ? 'تصميم وتطوير:' : 'Designed & Developed by:'}
                </span>
                <strong className="text-sm text-[#422D1F] block mt-0.5">
                  {isAr ? 'كمال جعفر زكريا' : 'Kamal Gafar Zakaria'}
                </strong>
              </div>

              {/* Clickable WhatsApp Link & Number */}
              <div className="pt-1 flex items-center justify-between gap-2 border-t border-[#EFEADE]">
                <div className="flex items-center gap-1.5 text-xs text-[#090909] font-mono">
                  {/* WhatsApp SVG Icon */}
                  <svg className="w-4 h-4 text-[#25D366] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.19 8.19 0 01-5.82 2.41c-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.02.79.81-2.94-.19-.3a8.19 8.19 0 01-1.26-4.56c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.98.69.45-.04 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                  </svg>
                  <span>{isAr ? 'واتساب:' : 'WhatsApp:'}</span>
                  <a
                    href="https://wa.me/249919980435"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#1F7A40] hover:underline"
                    title={isAr ? 'تواصل معنا مباشرة عبر واتساب' : 'Contact us directly on WhatsApp'}
                  >
                    00249919980435
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action Button */}
            <a
              id="footer-whatsapp-action-button"
              href="https://wa.me/249919980435"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent" />
              <span>{isAr ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Legal / Content Verification Notice Banner */}
        <div className="p-3.5 rounded-xl bg-[#EFEADE] border border-[#D8D3C5] text-xs text-[#343434] leading-relaxed flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Info className="w-4 h-4 text-[#9B783E] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-[11px]">
            {isAr
              ? 'الموسوعة منصة رقمية للبحث والوصول إلى المصادر والمعلومات العلمية المتاحة، ويجب الرجوع إلى المصادر الأصلية للتحقق من النصوص والإحالات.'
              : 'This encyclopedia is a digital research platform. Users should refer to original sources when verifying quotations, references, and scholarly information.'}
          </p>
        </div>

        {/* Bottom Copyright & Rights Bar */}
        <div className="pt-6 border-t border-[#D8D3C5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7365]">
          <div className="text-center sm:text-right">
            <p className="text-[11px] text-[#343434]">
              {isAr
                ? '© جميع الحقوق محفوظة لمؤسسة الهدى والنور لتكنولوجيا التطبيقات والمواقع الإسلامية.'
                : '© All Rights Reserved to Al-Huda and Al-Noor Technology for Islamic Applications and Websites.'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#7A7365] font-mono">
            <span>موسوعة شيخ الإسلام ابن تيمية</span>
            <span>•</span>
            <span>v2.5.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
