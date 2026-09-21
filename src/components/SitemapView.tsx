import React from 'react';
import {
  Compass,
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
  Scroll,
  Headphones,
  Info,
  ChevronLeft,
  ChevronRight,
  BookCopy,
} from 'lucide-react';
import { Language, ActiveNavTab } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { BackButton } from './BackButton';

interface SitemapViewProps {
  language: Language;
  onSelectTab: (tab: ActiveNavTab) => void;
  onBack: () => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({
  language,
  onSelectTab,
  onBack,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;

  const sitemapSections: {
    titleAr: string;
    titleEn: string;
    icon: React.ReactNode;
    links: { labelAr: string; labelEn: string; tab: ActiveNavTab; descAr: string }[];
  }[] = [
    {
      titleAr: 'المصنفات والمؤلفات',
      titleEn: 'Books & Canonical Works',
      icon: <BookOpen className="w-5 h-5 text-[#9B783E]" />,
      links: [
        { labelAr: 'خزانة المصنفات والكتب', labelEn: 'All Books Catalog', tab: 'books', descAr: 'فهرس شامل لكافة مؤلفات ورسائل شيخ الإسلام مع تفاصيل الطبعات والتحقيقات' },
        { labelAr: 'مجموع الفتاوى (37 مجلداً)', labelEn: 'Majmu al-Fatawa (37 Vols)', tab: 'majmu-fatawa', descAr: 'الموسوعة الكبرى المبوبّة في أبواب التوحيد والفقه والتفسير والسلوك' },
        { labelAr: 'القارئ الرقمي للمصادر', labelEn: 'Digital Reader', tab: 'reader', descAr: 'واجهة قراءة متقدمة مع ترقيم الصفحات ونصوص الطبعات المحققة' },
      ],
    },
    {
      titleAr: 'البحث والتحقيق العلمي',
      titleEn: 'Scholarly Search & Retrieval',
      icon: <Search className="w-5 h-5 text-[#9B783E]" />,
      links: [
        { labelAr: 'البحث الشامل في الموسوعة', labelEn: 'Global Search', tab: 'search', descAr: 'محرك بحث متقدم بالعبارات الدقيقة وتصفية الأجزاء والمجلدات' },
        { labelAr: 'مساعد الباحث الذكي (RAG)', labelEn: 'AI Research Assistant', tab: 'assistant', descAr: 'استجواب علمي مؤصل يستند حصرياً لنصوص ابن تيمية المحققة مع مؤشر التغطية' },
      ],
    },
    {
      titleAr: 'السيرة والتاريخ والعلماء',
      titleEn: 'Biography, Timeline & Scholars',
      icon: <BookMarked className="w-5 h-5 text-[#9B783E]" />,
      links: [
        { labelAr: 'السيرة الموثقة لشيخ الإسلام', labelEn: 'Documented Biography', tab: 'biography', descAr: 'نشأته، علمه، مناظراته، جهاده في معركة شقحب، ومحنه حتى وفاته بسجن القلعة' },
        { labelAr: 'الخط الزمني التاريخي (661-728 هـ)', labelEn: 'Historical Timeline', tab: 'timeline', descAr: 'تسلسل زمني لأبرز الأحداث والمصنفات استناداً لمؤرخي العصر' },
        { labelAr: 'دليل الشيوخ والتلاميذ', labelEn: 'Scholars & Disciples', tab: 'scholars', descAr: 'ابن القيم، الحافظ الذهبي، ابن كثير، ابن عبد الهادي، وغيرهم' },
        { labelAr: 'شبكة العلاقات المعرفية', labelEn: 'Knowledge Graph', tab: 'graph', descAr: 'مخطط بياني يربط بين الكتب والمصنفات والشيوخ والمسائل' },
      ],
    },
    {
      titleAr: 'دليل الموضوعات والفهارس',
      titleEn: 'Topics Directory & Indexes',
      icon: <Layers className="w-5 h-5 text-[#9B783E]" />,
      links: [
        { labelAr: 'فهرس الموضوعات الشامل (/topics)', labelEn: 'All Topics Directory', tab: 'topics', descAr: 'دليل شجري لكافة المباحث العقدية والفقهية والأصولية والحديثية' },
      ],
    },
    {
      titleAr: 'المصادر والوثائق والمخطوطات',
      titleEn: 'Manuscripts & Primary Sources',
      icon: <Scroll className="w-5 h-5 text-[#9B783E]" />,
      links: [
        { labelAr: 'خزانة المخطوطات الأصلية', labelEn: 'Original Manuscripts', tab: 'manuscripts', descAr: 'بيانات المخطوطات النادرة وأرقام حفظها في مكتبات دمشق وإسطنبول والرياض' },
        { labelAr: 'الأبحاث والدراسات المحكمة', labelEn: 'Academic Articles', tab: 'articles', descAr: 'أبحاث ودراسات محكمة في فكر ومنهج شيخ الإسلام' },
        { labelAr: 'الدروس والشروح الصوتية', labelEn: 'Audio Lectures', tab: 'audio', descAr: 'محاضرات وشروح علمية لمصنفات ابن تيمية' },
      ],
    },
    {
      titleAr: 'المسائل والفتاوى',
      titleEn: 'Fatwas & Juristic Inquiries',
      icon: <FileQuestion className="w-5 h-5 text-[#9B783E]" />,
      links: [
        { labelAr: 'قاعدة الفتاوى والمسائل المحققة', labelEn: 'Fatwa Database', tab: 'fatwas', descAr: 'فتاوى محققة في أبواب العبادات والمعاملات والعقائد مع التوثيق بالأجزاء' },
      ],
    },
    {
      titleAr: 'أدوات الباحث والمكتبة الشخصية',
      titleEn: 'Researcher Tools & Workspace',
      icon: <Bookmark className="w-5 h-5 text-[#9B783E]" />,
      links: [
        { labelAr: 'مكتبتي والعلامات المرجعية', labelEn: 'My Bookmarks', tab: 'library', descAr: 'النصوص والفوائد المحفوظة مع إمكانية التصدير والنسخ' },
        { labelAr: 'مجموعاتي البحثية ومتابعة القراءة', labelEn: 'Research Collections', tab: 'research-collections', descAr: 'تنظيم ملفات الأبحاث الخاصة، متابعة نسبة إنجاز الكتب، وتدوين الملاحظات' },
      ],
    },
    {
      titleAr: 'عن الموسوعة والتوثيق',
      titleEn: 'About & Scholarly Integrity',
      icon: <Info className="w-5 h-5 text-[#9B783E]" />,
      links: [
        { labelAr: 'عن الموسوعة وفريق العمل', labelEn: 'About Encyclopedia', tab: 'about', descAr: 'الرؤية والرسالة، معايير التوثيق والعزو، واللجنة الاستشارية' },
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-16 font-scholarly">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          language={language}
          items={[
            { label: isAr ? 'خريطة الموقع والفهرس' : 'Sitemap', isCurrent: true },
          ]}
          onNavigateTab={() => onBack()}
        />
        <BackButton language={language} onBack={onBack} label={isAr ? 'العودة' : 'Back'} />
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-2 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEADE] text-[#422D1F] text-xs font-bold">
          <Compass className="w-3.5 h-3.5 text-[#9B783E]" />
          <span>{isAr ? 'الفهرس العام الشامل' : 'Comprehensive Site Index'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-[#2C1D13]">
          {isAr ? 'خريطة موسوعة شيخ الإسلام ابن تيمية' : 'Ibn Taymiyyah Encyclopedia Sitemap'}
        </h1>
        <p className="text-xs sm:text-sm text-[#555] max-w-3xl leading-relaxed">
          {isAr
            ? 'فهرس شامل وروابط مباشرة لكافة أقسام ومنصات ومصنفات الموسوعة لتسهيل وصول الباحثين والقراء للعلوم والمصادر.'
            : 'Comprehensive index providing direct access to all sections, catalogs, and primary sources.'}
        </p>
      </div>

      {/* 2-Column Grid of Sitemap Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sitemapSections.map((section, idx) => (
          <div
            key={idx}
            className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-6 space-y-4 shadow-2xs hover:border-[#9B783E] transition-all"
          >
            <div className="flex items-center gap-2.5 border-b border-[#EFEADE] pb-3 text-[#422D1F]">
              {section.icon}
              <h2 className="font-bold text-base text-[#2C1D13]">
                {isAr ? section.titleAr : section.titleEn}
              </h2>
            </div>

            <div className="space-y-3">
              {section.links.map((link, lIdx) => (
                <button
                  key={lIdx}
                  onClick={() => {
                    onSelectTab(link.tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-right p-3 rounded-lg bg-[#F7F4EC] hover:bg-[#EFEADE] border border-[#D8D3C5] transition-all text-xs flex items-start justify-between group"
                >
                  <div className="space-y-0.5 pr-1">
                    <h3 className="font-bold text-[#422D1F] group-hover:text-[#9B783E] transition-colors">
                      {isAr ? link.labelAr : link.labelEn}
                    </h3>
                    <p className="text-[11px] text-[#555] leading-relaxed">
                      {link.descAr}
                    </p>
                  </div>
                  <ArrowIcon className="w-4 h-4 text-[#7A7365] shrink-0 mt-1 group-hover:text-[#422D1F] group-hover:-translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
