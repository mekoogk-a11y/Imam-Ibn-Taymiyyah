import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Language, ActiveNavTab } from '../types';

export interface BreadcrumbItem {
  label: string;
  tab?: ActiveNavTab;
  bookId?: string;
  topicId?: string;
  onClick?: () => void;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  language: Language;
  items: BreadcrumbItem[];
  onNavigateTab: (tab: ActiveNavTab) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  language,
  items,
  onNavigateTab,
  className = '',
}) => {
  const isAr = language === 'ar';
  const SeparatorIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <nav
      aria-label="مسار التنقل / Breadcrumb"
      className={`flex items-center text-xs font-scholarly text-[#7A7365] overflow-x-auto py-2 px-1 scrollbar-none ${className}`}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        {/* Home Root */}
        <li>
          <button
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-1 hover:text-[#422D1F] transition-colors p-1 rounded hover:bg-[#EFEADE]"
            title={isAr ? 'الصفحة الرئيسية' : 'Home'}
          >
            <Home className="w-3.5 h-3.5 text-[#9B783E]" />
            <span className="hidden sm:inline">{isAr ? 'الرئيسية' : 'Home'}</span>
          </button>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isCurrent;

          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" className="text-[#C8C2B3]">
                <SeparatorIcon className="w-3.5 h-3.5 shrink-0" />
              </li>
              <li>
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-bold text-[#422D1F] max-w-[220px] sm:max-w-[340px] truncate inline-block align-bottom"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else if (item.tab) {
                        onNavigateTab(item.tab);
                      }
                    }}
                    className="hover:text-[#422D1F] hover:underline underline-offset-2 transition-colors p-0.5 rounded"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
