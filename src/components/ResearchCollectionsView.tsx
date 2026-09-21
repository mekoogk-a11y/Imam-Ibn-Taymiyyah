import React, { useState, useEffect } from 'react';
import {
  FolderPlus,
  Bookmark,
  BookOpen,
  Trash2,
  Copy,
  Check,
  Plus,
  Quote,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  Layers,
  Search,
} from 'lucide-react';
import { Language, ResearchCollection, ReadingProgressRecord, Passage, Book } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { BackButton } from './BackButton';

interface ResearchCollectionsViewProps {
  language: Language;
  onOpenBookInReader: (bookId: string) => void;
  onOpenPassageInReader: (passage: Passage) => void;
  onBack: () => void;
  allPassages: Passage[];
  allBooks: Book[];
}

const DEFAULT_COLLECTIONS: ResearchCollection[] = [
  {
    id: 'col-tawhid-sifat',
    nameAr: 'بحث: منهج شيخ الإسلام في أسماء الله وصفاته',
    nameEn: 'Research: Divine Names and Attributes',
    descriptionAr: 'مجموعة نصوص ومسائل مستخلصة من العقيدة الواسطية والتدمرية ودرء التعارض لتحرير قواعد الإثبات بلا تمثيل.',
    colorTag: '#9B783E',
    createdAt: '2025-01-15',
    updatedAt: '2025-02-10',
    items: [
      {
        id: 'item-1',
        itemType: 'PASSAGE',
        targetId: 'PAS-WAS-01-005',
        titleAr: 'قاعدة الإثبات ونفي التمثيل والإلحاد',
        citation: 'ابن تيمية، العقيدة الواسطية، ص 5، مجمع الملك فهد، المدينة المنورة، 1425 هـ.',
        userNote: 'نص تأسيسي في نفي التحريف والتعطيل والتكييف والتمثيل.',
        dateAdded: '2025-01-15',
      },
      {
        id: 'item-2',
        itemType: 'BOOK',
        targetId: 'dar-taarud',
        titleAr: 'درء تعارض العقل والنقل',
        citation: 'تحقيق د. محمد رشاد سالم، جامعة الإمام محمد بن سعود الإسلامية، 1411 هـ.',
        userNote: 'كتاب محوري في نقض القانون الكلي للفخر الرازي.',
        dateAdded: '2025-01-16',
      },
    ],
  },
  {
    id: 'col-siyasah-adl',
    nameAr: 'بحث: نظرية العدل والسياسة الشرعية',
    nameEn: 'Research: Justice and Public Trusteeship',
    descriptionAr: 'دراسة وتحقيق نصوص أداء الأمانات واستعمال الأصلح والعدل مع المخالفين في منهاج السنة والسياسة الشرعية.',
    colorTag: '#422D1F',
    createdAt: '2025-02-01',
    updatedAt: '2025-02-18',
    items: [
      {
        id: 'item-3',
        itemType: 'PASSAGE',
        targetId: 'PAS-MS-04-092',
        titleAr: 'وجوب العدل والإنصاف مع المخالف وتحريم الظلم',
        citation: 'ابن تيمية، منهاج السنة النبوية، ج 4، ص 92، جامعة الإمام، 1406 هـ.',
        userNote: 'قاعدة ذهبية: العدل واجب لكل أحد على كل أحد في كل حال والظلم محرم مطلقاً.',
        dateAdded: '2025-02-01',
      },
      {
        id: 'item-4',
        itemType: 'PASSAGE',
        targetId: 'PAS-SS-01-015',
        titleAr: 'وجوب استعمال الأصلح والأكفأ في الولايات',
        citation: 'ابن تيمية، السياسة الشرعية في إصلاح الراعي والرعية، ص 15، دار عطاءات العلم، 1440 هـ.',
        userNote: 'الأمانة في اختيار الموظفين والقضاة والأمراء.',
        dateAdded: '2025-02-05',
      },
    ],
  },
];

const DEFAULT_READING_PROGRESS: ReadingProgressRecord[] = [
  {
    bookId: 'majmu-fatawa',
    bookTitleAr: 'مجموع الفتاوى (المجلد الأول: توحيد الألوهية)',
    currentVolume: 1,
    currentPage: 64,
    totalPagesApprox: 390,
    progressPercent: 16,
    lastReadTimestamp: 'اليوم',
  },
  {
    bookId: 'dar-taarud',
    bookTitleAr: 'درء تعارض العقل والنقل (الجزء الأول)',
    currentVolume: 1,
    currentPage: 120,
    totalPagesApprox: 450,
    progressPercent: 27,
    lastReadTimestamp: 'أمس',
  },
  {
    bookId: 'wasitiyyah',
    bookTitleAr: 'العقيدة الواسطية',
    currentVolume: 1,
    currentPage: 88,
    totalPagesApprox: 180,
    progressPercent: 49,
    lastReadTimestamp: 'منذ 3 أيام',
  },
];

export const ResearchCollectionsView: React.FC<ResearchCollectionsViewProps> = ({
  language,
  onOpenBookInReader,
  onOpenPassageInReader,
  onBack,
  allPassages,
  allBooks,
}) => {
  const isAr = language === 'ar';
  const [collections, setCollections] = useState<ResearchCollection[]>(() => {
    const saved = localStorage.getItem('ibn_taymiyyah_research_collections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_COLLECTIONS;
  });

  const [readingProgress, setReadingProgress] = useState<ReadingProgressRecord[]>(() => {
    const saved = localStorage.getItem('ibn_taymiyyah_reading_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_READING_PROGRESS;
  });

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(collections[0]?.id || '');
  const [newCollectionModalOpen, setNewCollectionModalOpen] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    localStorage.setItem('ibn_taymiyyah_research_collections', JSON.stringify(collections));
  }, [collections]);

  const activeCollection = collections.find((c) => c.id === selectedCollectionId) || collections[0];

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    const newCol: ResearchCollection = {
      id: `col-${Date.now()}`,
      nameAr: newColName.trim(),
      descriptionAr: newColDesc.trim() || 'مجموعة بحثية مخصصة لتحقيق ودراسة نصوص ومصنفات شيخ الإسلام.',
      colorTag: '#422D1F',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      items: [],
    };

    setCollections((prev) => [newCol, ...prev]);
    setSelectedCollectionId(newCol.id);
    setNewColName('');
    setNewColDesc('');
    setNewCollectionModalOpen(false);
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm(isAr ? 'هل تريد بالتأكيد حذف هذه المجموعة البحثية؟' : 'Delete this collection?')) {
      const remaining = collections.filter((c) => c.id !== id);
      setCollections(remaining);
      if (selectedCollectionId === id && remaining.length > 0) {
        setSelectedCollectionId(remaining[0].id);
      }
    }
  };

  const handleRemoveItem = (colId: string, itemId: string) => {
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === colId) {
          return {
            ...c,
            items: c.items.filter((item) => item.id !== itemId),
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );
  };

  const handleCopyAllCitations = () => {
    if (!activeCollection) return;
    const text = activeCollection.items
      .map((item, idx) => `${idx + 1}. ${item.titleAr}\n   ${item.citation}\n   ${item.userNote ? `ملاحظة: ${item.userNote}` : ''}`)
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 font-scholarly">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          language={language}
          items={[
            { label: isAr ? 'أدوات الباحث والمكتبة' : 'Researcher Tools', tab: 'library' },
            { label: isAr ? 'مجموعاتي البحثية والمتابعة' : 'Research Collections', isCurrent: true },
          ]}
          onNavigateTab={() => onBack()}
        />
        <BackButton language={language} onBack={onBack} label={isAr ? 'العودة' : 'Back'} />
      </div>

      {/* Reading Progress Section */}
      <section className="bg-[#FFFDF7] rounded-2xl border border-[#D8D3C5] p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#EFEADE] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#9B783E]" />
            <h2 className="font-bold text-base sm:text-lg text-[#2C1D13]">
              {isAr ? 'متابعة القراءة وإنجاز الكتب' : 'Reading Progress & Tracking'}
            </h2>
          </div>
          <span className="text-xs text-[#7A7365]">
            {isAr ? 'تحديث تلقائي من جلسات القراءة' : 'Auto-synced'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {readingProgress.map((item) => (
            <div
              key={item.bookId}
              className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#7A7365]">
                  <span>{item.lastReadTimestamp}</span>
                  <span className="font-mono font-bold text-[#422D1F]">{item.progressPercent}%</span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#2C1D13] line-clamp-1">
                  {item.bookTitleAr}
                </h4>
                {/* Progress Bar */}
                <div className="w-full bg-[#EFEADE] rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#9B783E] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#7A7365]">
                  {isAr ? `بلغت الصفحة ${item.currentPage} من ${item.totalPagesApprox}` : `Page ${item.currentPage} of ${item.totalPagesApprox}`}
                </div>
              </div>

              <button
                onClick={() => onOpenBookInReader(item.bookId)}
                className="w-full py-1.5 px-3 rounded-lg bg-[#FFFDF7] hover:bg-[#422D1F] hover:text-white border border-[#D8D3C5] text-xs font-bold text-[#422D1F] flex items-center justify-center gap-1 transition-colors"
              >
                <span>{isAr ? 'متابعة القراءة الآن' : 'Continue Reading'}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Main Research Collections Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Collections List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#EFEADE] pb-2">
              <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#9B783E]" />
                <span>{isAr ? 'المجموعات البحثية' : 'My Collections'}</span>
              </h3>
              <button
                onClick={() => setNewCollectionModalOpen(true)}
                className="p-1 rounded-md bg-[#422D1F] text-white hover:bg-[#2C1D13] text-xs font-bold flex items-center gap-1"
                title={isAr ? 'إنشاء ملف بحث جديد' : 'New Collection'}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'جديدة' : 'New'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {collections.map((col) => {
                const isSelected = col.id === activeCollection?.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollectionId(col.id)}
                    className={`w-full text-right p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#422D1F] border-[#422D1F] text-[#FFFDF7] font-bold shadow-xs'
                        : 'bg-[#F7F4EC] border-[#D8D3C5] text-[#343434] hover:bg-[#EFEADE]'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <div className="truncate font-semibold">{col.nameAr}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-[#D8D3C5]' : 'text-[#7A7365]'
                        }`}
                      >
                        {col.items.length} {isAr ? 'عناصر ونصوص' : 'items'} • {col.createdAt}
                      </div>
                    </div>
                    <ChevronLeft
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-[#D4AF37]' : 'text-[#C8C2B3]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Selected Collection Items */}
        <div className="lg:col-span-8 space-y-4">
          {activeCollection ? (
            <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-6 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EFEADE] pb-3">
                <div className="space-y-1">
                  <h2 className="font-bold text-lg text-[#2C1D13]">
                    {activeCollection.nameAr}
                  </h2>
                  <p className="text-xs text-[#555] leading-relaxed">
                    {activeCollection.descriptionAr}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyAllCitations}
                    className="px-3 py-1.5 rounded-lg bg-[#EFEADE] hover:bg-[#D8D3C5] text-xs font-bold text-[#422D1F] flex items-center gap-1.5 transition-colors"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{isAr ? 'تم نسخ المراجع' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#9B783E]" />
                        <span>{isAr ? 'نسخ كافة العزوات' : 'Export Citations'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteCollection(activeCollection.id)}
                    className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200"
                    title={isAr ? 'حذف المجموعة' : 'Delete collection'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              {activeCollection.items.length > 0 ? (
                <div className="space-y-3">
                  {activeCollection.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] space-y-2 text-xs relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#422D1F] flex items-center gap-1.5">
                          <span className="font-mono text-[11px] bg-[#EFEADE] px-1.5 py-0.5 rounded text-[#9B783E]">
                            #{idx + 1}
                          </span>
                          <span>{item.titleAr}</span>
                        </span>

                        <button
                          onClick={() => handleRemoveItem(activeCollection.id, item.id)}
                          className="text-[#7A7365] hover:text-rose-600 p-1"
                          title={isAr ? 'إزالة من المجموعة' : 'Remove item'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#555] bg-[#FFFDF7] p-2 rounded border border-[#EFEADE]">
                        <span className="font-semibold text-[#7A7365]">{isAr ? 'العزو المعتمد: ' : 'Citation: '}</span>
                        {item.citation}
                      </div>

                      {item.userNote && (
                        <div className="text-[11px] text-[#422D1F] bg-[#FFF8E7] p-2 rounded border border-[#E4D1A0]">
                          <span className="font-bold">{isAr ? 'ملاحظة الباحث: ' : 'Note: '}</span>
                          {item.userNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-[#F7F4EC] border border-dashed border-[#D8D3C5] text-center space-y-3">
                  <FolderPlus className="w-8 h-8 text-[#9B783E] mx-auto opacity-70" />
                  <h4 className="font-bold text-sm text-[#422D1F]">
                    {isAr ? 'هذه المجموعة فارغة حالياً' : 'Collection is empty'}
                  </h4>
                  <p className="text-xs text-[#7A7365] max-w-sm mx-auto">
                    {isAr
                      ? 'أضف نصوصاً ومصنفات أثناء التصفح في القارئ الرقمي أو الفهارس بالضغط على زر الحفظ.'
                      : 'Add passages and treatises while browsing in the reader.'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] text-center">
              <p className="text-xs text-[#7A7365]">
                {isAr ? 'اختر مجموعة بحثية أو أنشئ مجموعة جديدة.' : 'Select or create a collection.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Collection Modal */}
      {newCollectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF7] rounded-2xl border border-[#D8D3C5] p-6 max-w-md w-full space-y-4 shadow-xl animate-in zoom-in-95">
            <h3 className="font-bold text-base text-[#422D1F] border-b border-[#EFEADE] pb-2">
              {isAr ? 'إنشاء ملف بحثي جديد' : 'New Research Collection'}
            </h3>

            <form onSubmit={handleCreateCollection} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#422D1F] font-bold mb-1">
                  {isAr ? 'عنوان الملف أو موضوع البحث:' : 'Collection Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder={isAr ? 'مثال: أبحاث نفي التشبيه والتمثيل' : 'E.g., Research on Divine Attributes'}
                  className="w-full p-2.5 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg text-[#090909] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#422D1F] font-bold mb-1">
                  {isAr ? 'وصف موجز للمشروع البحثي:' : 'Short Description:'}
                </label>
                <textarea
                  rows={3}
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  placeholder={isAr ? 'اكتب أهداف هذا البحث أو المسائل المراد جمع نصوصها...' : 'Notes and research goals...'}
                  className="w-full p-2.5 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg text-[#090909] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFEADE]">
                <button
                  type="button"
                  onClick={() => setNewCollectionModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D8D3C5] bg-[#F7F4EC] text-[#555] font-bold hover:bg-[#EFEADE]"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#422D1F] text-white font-bold hover:bg-[#2C1D13]"
                >
                  {isAr ? 'إنشاء الملف' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
