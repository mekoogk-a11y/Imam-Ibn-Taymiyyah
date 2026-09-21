import React, { useState } from 'react';
import {
  FileQuestion,
  Search,
  Filter,
  Copy,
  Check,
  CheckCircle2,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { Language, FatwaRecord } from '../types';

interface FatwasViewProps {
  language: Language;
  fatwas: FatwaRecord[];
  onOpenBookInReader?: (bookId: string) => void;
}

export const FatwasView: React.FC<FatwasViewProps> = ({
  language,
  fatwas,
  onOpenBookInReader,
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topics = [
    { id: 'ALL', nameAr: 'كافة المسائل والفتاوى', nameEn: 'All Fatwas' },
    { id: 'prayer', nameAr: 'الصلاة والعبادات', nameEn: 'Prayer & Worship' },
    { id: 'justice', nameAr: 'العدل وأهل البدع', nameEn: 'Justice & Heresies' },
    { id: 'contracts', nameAr: 'المعاملات المالية والشروط', nameEn: 'Commercial Law' },
  ];

  const filtered = fatwas.filter((f) => {
    if (selectedTopic !== 'ALL' && f.topicId !== selectedTopic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        f.questionAr.includes(q) ||
        f.answerAr.includes(q) ||
        f.topicAr.includes(q)
      );
    }
    return true;
  });

  const handleCopyCitation = (citation: string, id: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-scholarly font-bold text-2xl sm:text-3xl text-[#2C1D13]">
              {isAr ? 'قاعدة الفتاوى والمسائل الفقهية' : 'Canonical Fatwa & Responsa Database'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7365] mt-1">
              {isAr
                ? 'فتاوى محررة وموثقة برقم المجلد والصفحة من مجموع الفتاوى والفتاوى الكبرى'
                : 'Documented legal responsa and fatwas attributed directly to volume and page numbers'}
            </p>
          </div>
          <div className="text-xs font-mono bg-[#EFEADE] text-[#422D1F] px-3 py-1.5 rounded-lg font-bold">
            {isAr ? `إجمالي الفتاوى المحققة: ${fatwas.length}` : `Verified Fatwas: ${fatwas.length}`}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في نصوص الأسئلة والأجوبة والفتاوى...' : 'Search fatwas by keyword...'}
              className="w-full text-xs sm:text-sm h-10 pl-9 pr-9 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg focus:outline-hidden focus:border-[#7A5835]"
            />
            <Search className={`w-4 h-4 text-[#7A7365] absolute top-3 ${isAr ? 'left-3' : 'right-3'}`} />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedTopic === t.id
                    ? 'bg-[#422D1F] text-[#FFFDF7]'
                    : 'bg-[#F7F4EC] text-[#5A3E2B] border border-[#D8D3C5] hover:bg-[#EFEADE]'
                }`}
              >
                {isAr ? t.nameAr : t.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fatwas List */}
      <div className="space-y-6">
        {filtered.map((fatwa) => (
          <article
            key={fatwa.id}
            className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-5 shadow-2xs"
          >
            {/* Header: Topic & Citation */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFEADE] pb-3 text-xs text-[#7A7365]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#422D1F] bg-[#EFEADE] px-2.5 py-0.5 rounded-full font-scholarly">
                  {fatwa.topicAr}
                </span>
                <span className="font-mono font-medium">
                  {fatwa.bookId} • ج {fatwa.volume} • ص {fatwa.page}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-emerald-800 text-[11px] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'توثيق معتمد' : 'Verified Canonical'}</span>
                </span>
                <button
                  onClick={() => handleCopyCitation(fatwa.verifiedCitation, fatwa.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#D8D3C5] text-[#5A3E2B] hover:bg-[#EFEADE] text-xs transition-colors"
                >
                  {copiedId === fatwa.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">{isAr ? 'تم النسخ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{isAr ? 'نسخ المرجع' : 'Copy Citation'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 bg-[#F7F4EC] rounded-xl border-r-4 border-[#7A5835] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold font-scholarly text-[#7A5835]">
                <HelpCircle className="w-4 h-4" />
                <span>{isAr ? 'نص المسألة أو السؤال:' : 'Inquiry / Question:'}</span>
              </div>
              <p className="font-scholarly font-bold text-base sm:text-lg text-[#2C1D13] leading-relaxed">
                {fatwa.questionAr}
              </p>
            </div>

            {/* Answer Section */}
            <div className="space-y-2">
              <div className="text-xs font-bold font-scholarly text-[#422D1F]">
                {isAr ? 'جواب شيخ الإسلام ابن تيمية المحقق:' : 'Verified Legal Answer:'}
              </div>
              <blockquote className="prose-scholarly text-base sm:text-lg text-[#1A1A1A] leading-loose text-justify p-4 rounded-xl bg-[#FFFDF7] border border-[#EFEADE]">
                «{fatwa.answerAr}»
              </blockquote>
            </div>

            {/* Footnote Citation */}
            <div className="border-t border-[#EFEADE] pt-3 flex items-center justify-between text-xs text-[#7A7365]">
              <span className="font-mono text-[11px]">{fatwa.verifiedCitation}</span>
              {onOpenBookInReader && (
                <button
                  onClick={() => onOpenBookInReader(fatwa.bookId)}
                  className="flex items-center gap-1 font-medium text-[#422D1F] hover:text-[#9B783E]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isAr ? 'قراءة في مجموع الفتاوى' : 'Open in Corpus'}</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
