import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  BookCopy,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  Quote,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language, Passage, Book } from '../types';
import { Breadcrumb } from './Breadcrumb';
import { BackButton } from './BackButton';

interface MajmuFatawaViewProps {
  language: Language;
  onOpenPassageInReader: (passage: Passage) => void;
  onOpenBookInReader: (bookId: string) => void;
  passages: Passage[];
  book?: Book;
  onNavigateHome: () => void;
}

interface VolumeInfo {
  vol: number;
  titleAr: string;
  category: string;
  pagesCount: number;
  descriptionAr: string;
}

export const MajmuFatawaView: React.FC<MajmuFatawaViewProps> = ({
  language,
  onOpenPassageInReader,
  onOpenBookInReader,
  passages,
  book,
  onNavigateHome,
}) => {
  const isAr = language === 'ar';
  const [selectedVolume, setSelectedVolume] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // The 37 volumes of Majmu' al-Fatawa according to the canonical King Fahd Complex / Ibn Qasim edition
  const volumesData: VolumeInfo[] = useMemo(() => [
    { vol: 1, titleAr: 'توحيد الألوهية والعبادة', category: 'العقيدة', pagesCount: 390, descriptionAr: 'حقيقة العبادة، التوحيد، الشرك، ووجوب إفراد الله تعالى بالطاعة والمحبة' },
    { vol: 2, titleAr: 'توحيد الربوبية والقدر', category: 'العقيدة', pagesCount: 512, descriptionAr: 'مسائل القدر، الحكمة والتعليل، وأفعال العباد والقضاء' },
    { vol: 3, titleAr: 'مجمل توحيد الأسماء والصفات (الواسطية)', category: 'العقيدة', pagesCount: 440, descriptionAr: 'العقيدة الواسطية ومناظراتها وأصول أهل السنة في أسماء الله وصفاته' },
    { vol: 4, titleAr: 'مفصل توحيد الأسماء والصفات', category: 'العقيدة', pagesCount: 580, descriptionAr: 'تحقيق نصوص الاستواء، العلو، النزول، والمعية، والرد على المؤولة' },
    { vol: 5, titleAr: 'توحيد الأسماء والصفات (الحموية والتدمرية)', category: 'العقيدة', pagesCount: 590, descriptionAr: 'الفتوى الحموية الكبرى والقواعد التدمرية في الأسماء والصفات والشرع والقدر' },
    { vol: 6, titleAr: 'المنطق وعلم الكلام (1)', category: 'الردود والمنطق', pagesCount: 620, descriptionAr: 'نقد مقالات المتكلمين والفلاسفة في الإلهيات والحدود والبرهان' },
    { vol: 7, titleAr: 'كتاب الإيمان', category: 'العقيدة', pagesCount: 690, descriptionAr: 'حقيقة الإيمان والإسلام، وزيادته ونقصانه، ونقد مقالات المرجئة والخوارج' },
    { vol: 8, titleAr: 'القدر ومقالات الفرق', category: 'العقيدة', pagesCount: 550, descriptionAr: 'مناقشة شبهات القدرية والجبرية ونصوص العدل الإلهي' },
    { vol: 9, titleAr: 'المنطق (بغية المرتاد)', category: 'الردود والمنطق', pagesCount: 350, descriptionAr: 'نقض أصول المنطقيين وقضية السبعينية والاتحادية' },
    { vol: 10, titleAr: 'علم السلوك والتصوف (1)', category: 'السلوك والتزكية', pagesCount: 780, descriptionAr: 'أمراض القلوب وشفاؤها، الزهد والورع، وحقائق التوكل والإخلاص' },
    { vol: 11, titleAr: 'علم السلوك والتصوف (2)', category: 'السلوك والتزكية', pagesCount: 720, descriptionAr: 'الفرق بين أولياء الرحمن وأولياء الشيطان والكرامات والأحوال' },
    { vol: 12, titleAr: 'القرآن الكريم (كلام الله)', category: 'القرآن والتفسير', pagesCount: 600, descriptionAr: 'إثبات أن القرآن كلام الله منزل غير مخلوق والرد على الجهمية' },
    { vol: 13, titleAr: 'مقدمة في أصول التفسير', category: 'القرآن والتفسير', pagesCount: 420, descriptionAr: 'قواعد التفسير الصحيح، وتفسير القرآن بالقرآن والسنة وأقوال الصحابة' },
    { vol: 14, titleAr: 'تفسير سور القرآن (1)', category: 'القرآن والتفسير', pagesCount: 510, descriptionAr: 'تفسير الفاتحة والبقرة وآل عمران' },
    { vol: 15, titleAr: 'تفسير سور القرآن (2)', category: 'القرآن والتفسير', pagesCount: 480, descriptionAr: 'تفسير سورة النور والقصص والإسراء' },
    { vol: 16, titleAr: 'تفسير سور القرآن (3)', category: 'القرآن والتفسير', pagesCount: 610, descriptionAr: 'تفسير سورة الإخلاص والمعوذتين وقصار المفصل' },
    { vol: 17, titleAr: 'تفسير سور القرآن (4)', category: 'القرآن والتفسير', pagesCount: 530, descriptionAr: 'تحقيق الآيات المشكلة واستنباطات الأصول الفقهية والعقدية' },
    { vol: 18, titleAr: 'الحديث النبوي الشريف', category: 'الحديث', pagesCount: 400, descriptionAr: 'قواعد الحديث، حجية خبر الواحد، وتخريج الأحاديث المشهورة' },
    { vol: 19, titleAr: 'أصول الفقه (1) - الإجماع والاتباع', category: 'أصول الفقه', pagesCount: 320, descriptionAr: 'حجية الإجماع، شروط الاتباع، والرد على الغلو في التقليد' },
    { vol: 20, titleAr: 'أصول الفقه (2) - مقاصد الشريعة والقياس', category: 'أصول الفقه', pagesCount: 590, descriptionAr: 'القياس الصحيح، رفع الحرج، ومصالح العباد ومقاصد الشريعة' },
    { vol: 21, titleAr: 'فقه الطهارة', category: 'الفقه', pagesCount: 650, descriptionAr: 'أحكام المياه والنجاسات والوضوء والغسل والتيمم والحيض' },
    { vol: 22, titleAr: 'فقه الصلاة (1)', category: 'الفقه', pagesCount: 640, descriptionAr: 'شروط الصلاة، الأركان، السنن، ومسائل النية وأوقات الصلاة' },
    { vol: 23, titleAr: 'فقه الصلاة (2)', category: 'الفقه', pagesCount: 450, descriptionAr: 'صلاة الجماعة، الجمع والقصر، وصلاة الخوف والعيدين والاستسقاء' },
    { vol: 24, titleAr: 'فقه الصلاة (3) والجنائز', category: 'الفقه', pagesCount: 400, descriptionAr: 'أحكام الجنائز والقبور وزيارتها الشرعية والبدعية' },
    { vol: 25, titleAr: 'فقه الزكاة والصيام', category: 'الفقه', pagesCount: 350, descriptionAr: 'مصارف الزكاة، صدقة الفطر، ومفطرات الصائم ورؤية الهلال' },
    { vol: 26, titleAr: 'فقه الحج والعمرة', category: 'الفقه', pagesCount: 310, descriptionAr: 'مناسك الحج والعمرة، المواقيت، الفدية، والأماكن المشروعة' },
    { vol: 27, titleAr: 'الزيارة وأحكام المشاهد', category: 'الفقه', pagesCount: 530, descriptionAr: 'المسجد الأقصى والمسجد النبوي وحرمة شد الرحال لغير المساجد الثلاثة' },
    { vol: 28, titleAr: 'الجهاد والأمر بالمعروف', category: 'الفقه', pagesCount: 690, descriptionAr: 'أحكام الجهاد، قتال التتار، والأمر بالمعروف والنهي عن المنكر' },
    { vol: 29, titleAr: 'فقه البيوع والمعاملات (1)', category: 'الفقه', pagesCount: 580, descriptionAr: 'العقود، الشروط، الربا، والغرر، والأصل في المعاملات الحل' },
    { vol: 30, titleAr: 'فقه البيوع والمعاملات (2)', category: 'الفقه', pagesCount: 450, descriptionAr: 'المزارعة، المساقاة، الإجارة، والضمان، والصلح' },
    { vol: 31, titleAr: 'الأوقاف والوصايا والفرائض', category: 'الفقه', pagesCount: 410, descriptionAr: 'شروط الواقفين، وصايا الأموال، والمواريث الفقهية' },
    { vol: 32, titleAr: 'فقه النكاح', category: 'الفقه', pagesCount: 390, descriptionAr: 'عقد النكاح، الكفاءة، الصداق، وعشرة النساء والحقوق الزوجية' },
    { vol: 33, titleAr: 'فقه الطلاق والخلع', category: 'الفقه', pagesCount: 260, descriptionAr: 'الطلاق الثلاث بلفظ واحد، يمين الطلاق، والخلع وأحكامه' },
    { vol: 34, titleAr: 'الظهار والإيلاء واللعان والحدود', category: 'الفقه', pagesCount: 270, descriptionAr: 'الظهار، اللعان، أحكام الحدود والتعازير والسرقة والمسكر' },
    { vol: 35, titleAr: 'الجنايات والقضاء والشهادات', category: 'الفقه', pagesCount: 460, descriptionAr: 'القصاص، الديات، شروط القاضي، الإثبات، والحسبة' },
    { vol: 36, titleAr: 'الفهارس العامة (1)', category: 'الفهارس', pagesCount: 500, descriptionAr: 'فهارس الآيات والأحاديث والآثار والرجال والأعلام' },
    { vol: 37, titleAr: 'الفهارس العامة (2)', category: 'الفهارس', pagesCount: 550, descriptionAr: 'فهارس الموضوعات والمسائل والكتب والأشعار' },
  ], []);

  // Filtered passages belonging to Majmu' al-Fatawa
  const majmuPassages = useMemo(() => {
    return passages.filter((p) => p.bookId === 'majmu-fatawa');
  }, [passages]);

  // Passages in selected volume
  const volumePassages = useMemo(() => {
    return majmuPassages.filter((p) => p.volume === selectedVolume);
  }, [majmuPassages, selectedVolume]);

  const currentVolumeData = useMemo(() => {
    return volumesData.find((v) => v.vol === selectedVolume) || volumesData[0];
  }, [volumesData, selectedVolume]);

  const categories = ['ALL', 'العقيدة', 'الفقه', 'القرآن والتفسير', 'أصول الفقه', 'الردود والمنطق', 'السلوك والتزكية', 'الحديث', 'الفهارس'];

  const filteredVolumes = useMemo(() => {
    return volumesData.filter((v) => {
      if (categoryFilter !== 'ALL' && v.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.titleAr.includes(q) ||
          v.descriptionAr.includes(q) ||
          v.vol.toString() === q
        );
      }
      return true;
    });
  }, [volumesData, categoryFilter, searchQuery]);

  const handleCopyCitation = (citation: string, id: string) => {
    navigator.clipboard.writeText(citation);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-16 font-scholarly">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center justify-between">
        <Breadcrumb
          language={language}
          items={[
            { label: isAr ? 'الكتب والمؤلفات' : 'Books', tab: 'books' },
            { label: isAr ? 'مجموع الفتاوى' : 'Majmu al-Fatawa', isCurrent: true },
          ]}
          onNavigateTab={() => onNavigateHome()}
        />
        <BackButton language={language} onBack={onNavigateHome} label={isAr ? 'العودة' : 'Back'} />
      </div>

      {/* Hero Banner for Majmu' al-Fatawa */}
      <section className="relative rounded-2xl bg-gradient-to-b from-[#FFFDF7] to-[#EFEADE] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#422D1F] text-[#D4AF37] text-xs font-bold">
              <BookCopy className="w-3.5 h-3.5" />
              <span>{isAr ? 'أعظم مصنفات شيخ الإسلام ابن تيمية' : 'The Monumental Corpus'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#2C1D13]">
              {isAr ? 'مجموع الفتاوى لشيخ الإسلام ابن تيمية' : 'Majmu al-Fatawa of Shaykh al-Islam Ibn Taymiyyah'}
            </h1>
            <p className="text-xs sm:text-sm text-[#343434] leading-relaxed">
              {isAr
                ? 'موسوعة علمية فقهية عقدية كبرى في 37 مجلداً، جمعها ورتبها الشيخ عبد الرحمن بن قاسم وابنه محمد رحمهما الله، محققة ومقابلة على أصول خطية نفيسة برعاية مجمع الملك فهد لطباعة المصحف الشريف.'
                : 'A monumental 37-volume theological and jurisprudential compendium compiled by Shaykh Abd al-Rahman ibn Qasim and his son Muhammad, published canonical edition by King Fahd Complex.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenBookInReader('majmu-fatawa')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'تصفح وقراءة في القارئ الرقمي' : 'Open in Digital Reader'}</span>
            </button>
          </div>
        </div>

        {/* Quick Metadata Pill Grid */}
        <div className="pt-2 border-t border-[#D8D3C5] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#FFFDF7] p-2.5 rounded-lg border border-[#D8D3C5]">
            <span className="text-[#7A7365] block text-[11px]">{isAr ? 'عدد المجلدات:' : 'Volumes:'}</span>
            <strong className="text-[#422D1F] font-mono">37 مجلداً كاملاً</strong>
          </div>
          <div className="bg-[#FFFDF7] p-2.5 rounded-lg border border-[#D8D3C5]">
            <span className="text-[#7A7365] block text-[11px]">{isAr ? 'الجامع والمحقق:' : 'Editor:'}</span>
            <strong className="text-[#422D1F]">الشيخ عبد الرحمن بن قاسم</strong>
          </div>
          <div className="bg-[#FFFDF7] p-2.5 rounded-lg border border-[#D8D3C5]">
            <span className="text-[#7A7365] block text-[11px]">{isAr ? 'الطبعة المعتمدة:' : 'Edition:'}</span>
            <strong className="text-[#422D1F]">مجمع الملك فهد (1425 هـ)</strong>
          </div>
          <div className="bg-[#FFFDF7] p-2.5 rounded-lg border border-[#D8D3C5]">
            <span className="text-[#7A7365] block text-[11px]">{isAr ? 'عدد الصفحات التقريبي:' : 'Total Pages:'}</span>
            <strong className="text-[#422D1F] font-mono">~18,500 صفحة</strong>
          </div>
        </div>
      </section>

      {/* Main 2-Column Interface: Volume Browser & Selected Volume View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Volume Selector & Filter */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#EFEADE] pb-2">
              <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#9B783E]" />
                <span>{isAr ? 'فهرس الأجزاء والمجلدات' : 'Volumes Directory'}</span>
              </h3>
              <span className="text-xs font-mono text-[#7A7365]">
                {filteredVolumes.length} / 37
              </span>
            </div>

            {/* Filter by Category */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-[11px] px-2 py-0.5 rounded-md transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#422D1F] text-white font-bold'
                      : 'bg-[#F7F4EC] text-[#555] hover:bg-[#EFEADE]'
                  }`}
                >
                  {cat === 'ALL' ? (isAr ? 'الكل' : 'All') : cat}
                </button>
              ))}
            </div>

            {/* Search Volume by Number or Title */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute top-2.5 right-2.5 text-[#7A7365]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث برقم المجلد أو الموضوع...' : 'Filter volumes...'}
                className="w-full text-xs pl-3 pr-8 py-2 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg text-[#090909] focus:outline-hidden"
              />
            </div>

            {/* Scrollable Volume List */}
            <div className="max-h-[520px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {filteredVolumes.map((item) => {
                const isSelected = item.vol === selectedVolume;
                return (
                  <button
                    key={item.vol}
                    onClick={() => setSelectedVolume(item.vol)}
                    className={`w-full text-right p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#422D1F] border-[#422D1F] text-[#FFFDF7] font-bold shadow-xs'
                        : 'bg-[#FFFDF7] border-[#D8D3C5] text-[#343434] hover:bg-[#F7F4EC]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-md font-mono flex items-center justify-center text-xs shrink-0 ${
                          isSelected ? 'bg-[#9B783E] text-white' : 'bg-[#EFEADE] text-[#422D1F]'
                        }`}
                      >
                        {item.vol}
                      </span>
                      <div className="truncate">
                        <div className="truncate font-semibold">{item.titleAr}</div>
                        <div
                          className={`text-[10px] ${
                            isSelected ? 'text-[#D8D3C5]' : 'text-[#7A7365]'
                          }`}
                        >
                          {item.category} • {item.pagesCount} ص
                        </div>
                      </div>
                    </div>

                    <ChevronLeft
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-[#D4AF37] translate-x-0.5' : 'text-[#C8C2B3]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Selected Volume Details & Passages */}
        <div className="lg:col-span-7 space-y-4">
          {/* Selected Volume Header Card */}
          <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#EFEADE] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-lg bg-[#422D1F] text-[#D4AF37] font-mono font-bold text-sm flex items-center justify-center">
                  ج {currentVolumeData.vol}
                </span>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-[#2C1D13]">
                    {currentVolumeData.titleAr}
                  </h2>
                  <span className="text-[11px] text-[#7A7365]">
                    مجموع الفتاوى • المجلد {currentVolumeData.vol} من 37
                  </span>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded bg-[#EFEADE] text-[#5A3E2B] font-medium font-scholarly">
                {currentVolumeData.category}
              </span>
            </div>

            <p className="text-xs text-[#555] leading-relaxed">
              {currentVolumeData.descriptionAr}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-[#EFEADE]">
              <span className="text-[#7A7365]">
                {isAr ? 'التحقيق: الشيخ ابن قاسم • الطبعة: مجمع الملك فهد' : 'Ed: Ibn Qasim, King Fahd Complex'}
              </span>

              <button
                onClick={() => onOpenBookInReader('majmu-fatawa')}
                className="font-bold text-[#422D1F] hover:text-[#9B783E] flex items-center gap-1 transition-colors"
              >
                <span>{isAr ? 'قراءة المجلد في القارئ' : 'Read Volume'}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Passages in this volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-2">
                <Quote className="w-4 h-4 text-[#9B783E]" />
                <span>{isAr ? 'النصوص المحققة المفهرسة في هذا المجلد' : 'Verified Indexed Passages'}</span>
              </h3>
              <span className="text-xs text-[#7A7365]">
                {volumePassages.length} {isAr ? 'نصوص معزوة' : 'passages'}
              </span>
            </div>

            {volumePassages.length > 0 ? (
              <div className="space-y-3">
                {volumePassages.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs text-[#7A7365] border-b border-[#EFEADE] pb-2">
                      <span className="font-semibold text-[#422D1F]">
                        {p.chapterTitleAr}
                      </span>
                      <span className="font-mono bg-[#EFEADE] px-2 py-0.5 rounded text-[11px] text-[#5A3E2B]">
                        ج {p.volume} • ص {p.page}
                      </span>
                    </div>

                    <blockquote className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed p-3 bg-[#F7F4EC] rounded-lg border-r-3 border-[#9B783E]">
                      «{p.textArabic}»
                    </blockquote>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <span className="text-[11px] text-[#7A7365]">
                        {p.verifiedSourceCitation}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyCitation(p.verifiedSourceCitation, p.id)}
                          className="flex items-center gap-1 text-[11px] text-[#5A3E2B] hover:text-[#9B783E] px-2 py-1 rounded bg-[#F7F4EC]"
                        >
                          {copiedId === p.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">{isAr ? 'تم النسخ' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isAr ? 'نسخ العزو' : 'Copy'}</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onOpenPassageInReader(p)}
                          className="font-bold text-[#422D1F] hover:text-[#9B783E] flex items-center gap-0.5"
                        >
                          <span>{isAr ? 'عرض بالسياق' : 'In Context'}</span>
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-[#FFFDF7] border border-dashed border-[#D8D3C5] text-center space-y-3">
                <BookOpen className="w-8 h-8 text-[#9B783E] mx-auto opacity-70" />
                <h4 className="font-bold text-sm text-[#422D1F]">
                  {isAr
                    ? `المجلد ${selectedVolume}: ${currentVolumeData.titleAr}`
                    : `Volume ${selectedVolume}`}
                </h4>
                <p className="text-xs text-[#7A7365] max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'يمكنك الانتقال المباشر لقراءة هذا الجزء وفهرس مباحثه وأبوابه عبر القارئ الرقمي للموسوعة.'
                    : 'Browse this volume and its analytical chapters directly inside the digital reader.'}
                </p>
                <button
                  onClick={() => onOpenBookInReader('majmu-fatawa')}
                  className="px-4 py-2 rounded-lg bg-[#422D1F] text-[#FFFDF7] text-xs font-bold hover:bg-[#2C1D13] inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isAr ? 'فتح المجلد في القارئ' : 'Open in Reader'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
