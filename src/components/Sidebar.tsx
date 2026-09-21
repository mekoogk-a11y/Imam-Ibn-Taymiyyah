import React from 'react';
import {
  Compass,
  BookOpen,
  BookMarked,
  Search,
  FileQuestion,
  UserCheck,
  Calendar,
  Layers,
  Users,
  Share2,
  FileSpreadsheet,
  Scroll,
  Headphones,
  Bookmark,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { Language, ActiveNavTab } from '../types';

interface SidebarProps {
  language: Language;
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  counts?: {
    books: number;
    passages: number;
    fatwas: number;
    topics: number;
    scholars: number;
    manuscripts: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  language,
  activeTab,
  onSelectTab,
  counts = {
    books: 6,
    passages: 6,
    fatwas: 3,
    topics: 7,
    scholars: 6,
    manuscripts: 3,
  },
}) => {
  const isAr = language === 'ar';

  const sections: {
    categoryAr: string;
    categoryEn: string;
    items: {
      tab: ActiveNavTab;
      labelAr: string;
      labelEn: string;
      icon: React.ReactNode;
      badge?: string | number;
      isHighlighted?: boolean;
    }[];
  }[] = [
    {
      categoryAr: 'المطالعة والتصفح',
      categoryEn: 'Reading & Browsing',
      items: [
        {
          tab: 'home',
          labelAr: 'الرئيسية',
          labelEn: 'Home',
          icon: <Compass className="w-4 h-4" />,
        },
        {
          tab: 'books',
          labelAr: 'الكتب والمؤلفات',
          labelEn: 'Books & Works',
          icon: <BookOpen className="w-4 h-4" />,
          badge: counts.books,
        },
        {
          tab: 'majmu-fatawa',
          labelAr: 'مجموع الفتاوى (37 مجلداً)',
          labelEn: 'Majmu al-Fatawa',
          icon: <BookMarked className="w-4 h-4 text-[#D4AF37]" />,
          isHighlighted: true,
        },
        {
          tab: 'reader',
          labelAr: 'قارئ الكتب الرقمي',
          labelEn: 'Digital Reader',
          icon: <BookMarked className="w-4 h-4 text-[#9B783E]" />,
        },
        {
          tab: 'fatwas',
          labelAr: 'الفتاوى والمسائل',
          labelEn: 'Fatwas & Responsa',
          icon: <FileQuestion className="w-4 h-4" />,
          badge: counts.fatwas,
        },
      ],
    },
    {
      categoryAr: 'البحث والاستقصاء',
      categoryEn: 'Search & Inquiry',
      items: [
        {
          tab: 'search',
          labelAr: 'البحث العلمي المتقدم',
          labelEn: 'Scholarly Search',
          icon: <Search className="w-4 h-4" />,
        },
        {
          tab: 'assistant',
          labelAr: 'مساعد الباحث (RAG)',
          labelEn: 'AI Assistant',
          icon: <Sparkles className="w-4 h-4 text-[#9B783E]" />,
          isHighlighted: true,
        },
        {
          tab: 'topics',
          labelAr: 'شجرة الموضوعات',
          labelEn: 'Topic Taxonomy',
          icon: <Layers className="w-4 h-4" />,
          badge: counts.topics,
        },
      ],
    },
    {
      categoryAr: 'السيرة والتاريخ والصلات',
      categoryEn: 'Biography & Networks',
      items: [
        {
          tab: 'biography',
          labelAr: 'السيرة العلمية',
          labelEn: 'Biography',
          icon: <UserCheck className="w-4 h-4" />,
        },
        {
          tab: 'timeline',
          labelAr: 'الخط الزمني التفاعلي',
          labelEn: 'Interactive Timeline',
          icon: <Calendar className="w-4 h-4" />,
        },
        {
          tab: 'scholars',
          labelAr: 'الشيوخ والتلاميذ',
          labelEn: 'Teachers & Students',
          icon: <Users className="w-4 h-4" />,
          badge: counts.scholars,
        },
        {
          tab: 'graph',
          labelAr: 'شبكة المعرفة العلمية',
          labelEn: 'Knowledge Graph',
          icon: <Share2 className="w-4 h-4" />,
        },
      ],
    },
    {
      categoryAr: 'التوثيق والوسائط',
      categoryEn: 'Sources & Archives',
      items: [
        {
          tab: 'manuscripts',
          labelAr: 'المخطوطات والوثائق',
          labelEn: 'Manuscripts Archive',
          icon: <Scroll className="w-4 h-4" />,
          badge: counts.manuscripts,
        },
        {
          tab: 'articles',
          labelAr: 'المقالات والدراسات',
          labelEn: 'Academic Studies',
          icon: <FileSpreadsheet className="w-4 h-4" />,
        },
        {
          tab: 'audio',
          labelAr: 'المكتبة الصوتية',
          labelEn: 'Audio Library',
          icon: <Headphones className="w-4 h-4" />,
        },
        {
          tab: 'library',
          labelAr: 'مكتبتي ومفضلتي',
          labelEn: 'Personal Library',
          icon: <Bookmark className="w-4 h-4" />,
        },
        {
          tab: 'research-collections',
          labelAr: 'مجموعاتي البحثية والمتابعة',
          labelEn: 'Research Collections',
          icon: <Bookmark className="w-4 h-4 text-[#9B783E]" />,
        },
        {
          tab: 'sitemap',
          labelAr: 'خريطة الموقع والفهرس',
          labelEn: 'Sitemap',
          icon: <Compass className="w-4 h-4" />,
        },
        {
          tab: 'about',
          labelAr: 'حول الموسوعة والمنهج',
          labelEn: 'About & Methodology',
          icon: <Info className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 h-full bg-[#FFFDF7] border-l border-[#D8D3C5] flex flex-col justify-between overflow-y-auto">
      <div className="p-3 space-y-5">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 py-1 text-[11px] font-semibold text-[#8B7B69] uppercase tracking-wider font-scholarly">
              {isAr ? section.categoryAr : section.categoryEn}
            </h4>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => onSelectTab(item.tab)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#422D1F] text-[#FFFDF7] shadow-xs'
                        : item.isHighlighted
                        ? 'bg-[#F4E8C1]/60 text-[#422D1F] hover:bg-[#F4E8C1]'
                        : 'text-[#343434] hover:bg-[#EFEADE] hover:text-[#090909]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#D4AF37]' : ''}>{item.icon}</span>
                      <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                          isActive
                            ? 'bg-[#5A3E2B] text-[#FFFDF7]'
                            : 'bg-[#EFEADE] text-[#555]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Scholarly Integrity Badge at Sidebar Bottom */}
      <div className="p-3.5 m-3 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5] text-[11px] text-[#555] space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-[#422D1F]">
          <ShieldCheck className="w-4 h-4 text-[#9B783E]" />
          <span>{isAr ? 'ميثاق التوثيق العلمي' : 'Scholarly Integrity Pledge'}</span>
        </div>
        <p className="text-[10px] leading-relaxed text-[#6E6759]">
          {isAr
            ? 'كافة الاستشهادات وأرقام الصفحات والمجلدات معزوة لطبعات معتمدة ولا مجال للاختلاق.'
            : 'All citations, volumes & pages are anchored in certified editions with zero fabrication.'}
        </p>
      </div>
    </aside>
  );
};
