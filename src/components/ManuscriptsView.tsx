import React, { useState } from 'react';
import {
  Scroll,
  Building2,
  MapPin,
  ExternalLink,
  Search,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { Language, ManuscriptRecord } from '../types';

interface ManuscriptsViewProps {
  language: Language;
  manuscripts: ManuscriptRecord[];
}

export const ManuscriptsView: React.FC<ManuscriptsViewProps> = ({
  language,
  manuscripts,
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = manuscripts.filter((m) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        m.titleAr.includes(q) ||
        m.titleEn.toLowerCase().includes(q) ||
        m.library.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.shelfmark.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-scholarly font-bold text-2xl sm:text-3xl text-[#2C1D13]">
              {isAr ? 'خزانة المخطوطات والوثائق الأصلية' : 'Manuscript & Archival Records'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7365] mt-1">
              {isAr
                ? 'فهرس النسخ الخطية المحفوظة في كبريات الخزائن العالمية (الظاهرية، السليمانية، برنستون، برلين)'
                : 'Catalog of manuscript codices preserved in global libraries with shelfmarks and dates'}
            </p>
          </div>
          <span className="text-xs font-mono bg-[#EFEADE] text-[#422D1F] px-3 py-1.5 rounded-lg font-bold">
            {manuscripts.length} {isAr ? 'مخطوطة موثقة' : 'Codices'}
          </span>
        </div>

        {/* Search */}
        <div className="relative pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث باسم المخطوط، المكتبة (الظاهرية، السليمانية)، أو رقم الحفظ...'
                : 'Search by manuscript title, library, or shelfmark...'
            }
            className="w-full text-xs sm:text-sm h-10 pl-9 pr-9 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg focus:outline-hidden focus:border-[#7A5835]"
          />
          <Search className={`w-4 h-4 text-[#7A7365] absolute top-5 ${isAr ? 'left-3' : 'right-3'}`} />
        </div>
      </div>

      {/* Manuscripts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ms) => (
          <article
            key={ms.id}
            className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-4 flex flex-col justify-between shadow-2xs group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EFEADE] pb-2 text-xs text-[#7A7365]">
                <div className="flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-[#9B783E]" />
                  <span>{ms.library}</span>
                </div>
                <span className="flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3" />
                  <span>{ms.city}, {ms.country}</span>
                </span>
              </div>

              <div>
                <h3 className="font-scholarly font-bold text-lg text-[#2C1D13] group-hover:text-[#9B783E] transition-colors leading-snug">
                  {ms.titleAr}
                </h3>
                <div className="text-xs text-[#7A7365] font-brand">{ms.titleEn}</div>
              </div>

              {/* Shelfmark & Details Box */}
              <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#D8D3C5] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#422D1F] font-scholarly">{isAr ? 'رقم الحفظ:' : 'Shelfmark:'}</span>
                  <span className="font-mono font-bold text-[#7A5835]">{ms.shelfmark}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#422D1F] font-scholarly">{isAr ? 'تاريخ النسخ:' : 'Copy Date:'}</span>
                  <span className="font-mono">{ms.copyistDateHijri}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#422D1F] font-scholarly">{isAr ? 'عدد اللوحات:' : 'Folios:'}</span>
                  <span className="font-mono">{ms.foliosCount} {isAr ? 'لوحة' : 'ff.'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#422D1F] font-scholarly">{isAr ? 'نوع الخط:' : 'Script:'}</span>
                  <span>{ms.scriptType}</span>
                </div>
              </div>

              <p className="font-scholarly text-xs text-[#555] leading-relaxed">
                {ms.descriptionAr}
              </p>
            </div>

            {/* Archive link */}
            <div className="border-t border-[#EFEADE] pt-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-emerald-800 font-medium">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'نسخة محققة' : 'Verified Codex'}</span>
              </div>
              <a
                href={ms.publicArchiveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#422D1F] hover:text-[#9B783E] font-medium"
              >
                <span>{isAr ? 'استعراض السجل الرقمي' : 'Digital Record'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
