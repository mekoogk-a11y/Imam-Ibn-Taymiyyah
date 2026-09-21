import React, { useState } from 'react';
import {
  Bookmark,
  Highlighter,
  Download,
  Trash2,
  BookOpen,
  Copy,
  Check,
  Plus,
  FileDown,
} from 'lucide-react';
import { Language, Passage, Book } from '../types';

interface LibraryViewProps {
  language: Language;
  bookmarkedPassages: Passage[];
  onRemoveBookmark: (passageId: string) => void;
  onOpenPassageInReader: (bookId: string, passageId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  language,
  bookmarkedPassages,
  onRemoveBookmark,
  onOpenPassageInReader,
}) => {
  const isAr = language === 'ar';
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleNoteChange = (passageId: string, text: string) => {
    setPersonalNotes((prev) => ({ ...prev, [passageId]: text }));
  };

  const handleCopyCitation = (citation: string, id: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportMarkdown = () => {
    let md = `# مفضلة الباحث - موسوعة شيخ الإسلام ابن تيمية\n\nتاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}\n\n`;
    bookmarkedPassages.forEach((p, idx) => {
      md += `## [${idx + 1}] ${p.bookTitleAr} - ${p.chapterTitleAr}\n`;
      md += `**المجلد:** ${p.volume} | **الصفحة:** ${p.page}\n\n`;
      md += `> «${p.textArabic}»\n\n`;
      md += `**التوثيق المعتمد:** ${p.verifiedSourceCitation}\n\n`;
      if (personalNotes[p.id]) {
        md += `**حاشية الباحث:** ${personalNotes[p.id]}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ibn_taymiyyah_research_notes_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-scholarly font-bold text-2xl sm:text-3xl text-[#2C1D13]">
              {isAr ? 'خزانة الباحث والمكتبة الشخصية' : 'Personal Scholarly Library'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7365] mt-1">
              {isAr
                ? 'إدارة النصوص المحفوظة، الحواشي والتعليقات الخاصة، وتصدير مذكرات البحث بصيغة Markdown'
                : 'Manage saved passages, personal annotations, and export scholarly notes'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedPassages.length > 0 && (
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-bold transition-colors"
              >
                <FileDown className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'تصدير الملاحظات (Markdown)' : 'Export Markdown'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bookmarked Passages */}
      {bookmarkedPassages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-3">
          <Bookmark className="w-10 h-10 text-[#9B783E] mx-auto opacity-40" />
          <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
            {isAr ? 'لا توجد نصوص محفوظة في مكتبتك حالياً' : 'No saved passages in your library'}
          </h3>
          <p className="text-xs text-[#7A7365] max-w-sm mx-auto">
            {isAr
              ? 'يمكنك حفظ أي نص أو فتوى أثناء تصفح القارئ الرقمي أو البحث العلمي بالضغط على أيقونة الإشارة المرجعية.'
              : 'Bookmark passages in the digital reader or search view to review and annotate them here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookmarkedPassages.map((p) => (
            <article
              key={p.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-4 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFEADE] pb-3 text-xs text-[#7A7365]">
                <div className="flex items-center gap-2 font-scholarly font-bold text-[#422D1F]">
                  <span>{p.bookTitleAr}</span>
                  <span>•</span>
                  <span>{p.chapterTitleAr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-[#EFEADE] text-[#422D1F] px-2 py-0.5 rounded font-bold">
                    ج {p.volume} • ص {p.page}
                  </span>
                  <button
                    onClick={() => onRemoveBookmark(p.id)}
                    className="p-1 text-[#888] hover:text-rose-600 transition-colors"
                    title={isAr ? 'إزالة من المحفوظات' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <blockquote className="font-scholarly text-base sm:text-lg text-[#1A1A1A] leading-relaxed text-justify p-4 bg-[#F7F4EC] rounded-xl border-r-3 border-[#9B783E]">
                «{p.textArabic}»
              </blockquote>

              {/* Personal Annotation / Marginalia Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold font-scholarly text-[#5A3E2B]">
                  {isAr ? 'حاشية وتعليق الباحث الخاص:' : 'Personal Scholar Note:'}
                </label>
                <textarea
                  rows={2}
                  value={personalNotes[p.id] || ''}
                  onChange={(e) => handleNoteChange(p.id, e.target.value)}
                  placeholder={isAr ? 'اكتب ملاحظتك أو تعليقك على هذا النص هنا...' : 'Write your research note...'}
                  className="w-full text-xs p-3 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5] focus:border-[#7A5835] focus:outline-hidden font-scholarly"
                />
              </div>

              <div className="border-t border-[#EFEADE] pt-3 flex items-center justify-between text-xs text-[#7A7365]">
                <span className="font-mono text-[11px]">{p.verifiedSourceCitation}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCitation(p.verifiedSourceCitation, p.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#D8D3C5] text-[#5A3E2B] hover:bg-[#EFEADE]"
                  >
                    {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isAr ? 'نسخ المرجع' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => onOpenPassageInReader(p.bookId, p.id)}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-[#422D1F] text-[#FFFDF7] hover:bg-[#2C1D13] font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isAr ? 'فتح في القارئ' : 'Open'}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
