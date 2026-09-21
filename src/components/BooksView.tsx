import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';
import { Language, Book } from '../types';

interface BooksViewProps {
  language: Language;
  books: Book[];
  onOpenBookInReader: (bookId: string) => void;
  onSelectBookDetail?: (book: Book) => void;
}

export const BooksView: React.FC<BooksViewProps> = ({
  language,
  books,
  onOpenBookInReader,
  onSelectBookDetail,
}) => {
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const categories = [
    { id: 'ALL', nameAr: 'كافة المصنفات', nameEn: 'All Categories' },
    { id: 'AQIDAH', nameAr: 'العقيدة والتوحيد', nameEn: 'Creed & Theology' },
    { id: 'POLEMICS', nameAr: 'المنطق ومناظرة الفلسفة', nameEn: 'Philosophy & Polemics' },
    { id: 'FIQH', nameAr: 'الفقه والأصول', nameEn: 'Jurisprudence & Legal Theory' },
    { id: 'SIYASAH_SHARIYYAH', nameAr: 'السياسة الشرعية والقضاء', nameEn: 'Governance & Judiciary' },
    { id: 'SULUK', nameAr: 'التزكية والسلوك', nameEn: 'Spirituality & Ethics' },
  ];

  const filteredBooks = books.filter((book) => {
    if (selectedCategory !== 'ALL' && book.category !== selectedCategory) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      return (
        book.titleAr.includes(q) ||
        book.titleEn.toLowerCase().includes(q) ||
        book.descriptionAr.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-scholarly font-bold text-2xl sm:text-3xl text-[#2C1D13]">
              {isAr ? 'خزانة المصنفات والكتب المعتمدة' : 'Canonical Works & Treatises'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7365] mt-1">
              {isAr
                ? 'فهرس شامل لكتب ورسائل شيخ الإسلام ابن تيمية مع تفاصيل الطبعات والتحقيقات والفهارس'
                : 'Comprehensive catalog of works, critical editions, table of contents, and digital folios'}
            </p>
          </div>
          <div className="text-xs font-mono bg-[#EFEADE] text-[#422D1F] px-3 py-1.5 rounded-lg font-bold">
            {isAr ? `إجمالي المصنفات: ${books.length}` : `Total Works: ${books.length}`}
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث باسم الكتاب، المحقق، أو موضوع المصنف...'
                  : 'Search by title, editor, or topic...'
              }
              className="w-full text-xs sm:text-sm h-10 pl-9 pr-9 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg focus:outline-hidden focus:border-[#7A5835]"
            />
            <Search className={`w-4 h-4 text-[#7A7365] absolute top-3 ${isAr ? 'left-3' : 'right-3'}`} />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#422D1F] text-[#FFFDF7]'
                    : 'bg-[#F7F4EC] text-[#5A3E2B] border border-[#D8D3C5] hover:bg-[#EFEADE]'
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-4 flex flex-col justify-between shadow-2xs group"
          >
            <div className="space-y-3">
              {/* Category & Volumes Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EFEADE] text-[#5A3E2B] font-scholarly font-bold">
                  {book.categoryAr}
                </span>
                <span className="text-xs font-mono font-bold text-[#7A7365]">
                  {book.volumesCount} {isAr ? 'مجلدات' : 'Volumes'} • ~{book.totalPagesApprox} {isAr ? 'صفحة' : 'Pages'}
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="font-scholarly font-bold text-xl text-[#2C1D13] group-hover:text-[#9B783E] transition-colors">
                  {book.titleAr}
                </h3>
                <div className="text-xs text-[#8B7B69] font-brand tracking-wide">
                  {book.titleEn}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4A443B] leading-relaxed">
                {isAr ? book.descriptionAr : book.descriptionEn}
              </p>

              {/* Editions and Verified Sources */}
              {book.editions && book.editions.length > 0 && (
                <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#D8D3C5] text-xs space-y-1">
                  <div className="font-bold font-scholarly text-[#422D1F]">
                    {isAr ? 'الطبعة المعتمدة في الموسوعة:' : 'Canonical Edition:'}
                  </div>
                  <div className="text-[#6E6759] leading-normal">
                    {book.editions[0].editionName} — تحقيق: {book.editions[0].editor} ({book.editions[0].publisher})
                  </div>
                </div>
              )}

              {/* Table of Contents Preview */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#8B7B69] font-scholarly">
                  {isAr ? 'نماذج من أبواب الكتاب:' : 'Sample Chapters:'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {book.tableOfContents.slice(0, 3).map((ch) => (
                    <span
                      key={ch.id}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#FFFDF7] border border-[#D8D3C5] text-[#555]"
                    >
                      {ch.titleAr}
                    </span>
                  ))}
                  {book.tableOfContents.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-[#888]">
                      +{book.tableOfContents.length - 3} {isAr ? 'أبواب أخرى' : 'more'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-[#EFEADE] pt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-[#7A7365]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">{isAr ? 'طبعة محققة' : 'Critical Edition'}</span>
              </div>

              <div className="flex items-center gap-2">
                {onSelectBookDetail && (
                  <button
                    onClick={() => onSelectBookDetail(book)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#F7F4EC] hover:bg-[#EFEADE] text-[#422D1F] border border-[#D8D3C5] text-xs font-semibold transition-colors"
                  >
                    <span>{isAr ? 'بيانات الكتاب' : 'Book Info'}</span>
                  </button>
                )}

                <button
                  onClick={() => onOpenBookInReader(book.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-semibold transition-colors shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فتح القارئ' : 'Read'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
