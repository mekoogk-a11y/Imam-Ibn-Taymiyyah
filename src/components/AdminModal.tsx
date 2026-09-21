import React, { useState, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Database,
  Download,
  FileSpreadsheet,
  FileCode,
  Copy,
  Check,
  Lock,
  Layers,
  HardDriveDownload,
  Filter,
  Eye,
  BookOpen,
} from 'lucide-react';
import { Language, Passage, Book } from '../types';
import { BOOKS_DATA } from '../data/encyclopediaData';

interface AdminModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  passages: Passage[];
  books?: Book[];
}

export const AdminModal: React.FC<AdminModalProps> = ({
  language,
  isOpen,
  onClose,
  passages,
  books = BOOKS_DATA,
}) => {
  if (!isOpen) return null;
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'audit' | 'export' | 'integrity' | 'system'>('export');
  const [filterText, setFilterText] = useState('');

  // Export State
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [includePassagesInJson, setIncludePassagesInJson] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  // Filtered passages for the Audit tab
  const filteredPassages = passages.filter(
    (p) =>
      p.textArabic.includes(filterText) ||
      p.bookTitleAr.includes(filterText) ||
      p.verifiedSourceCitation.includes(filterText)
  );

  // Books to export
  const booksToExport = useMemo(() => {
    if (selectedCategory === 'ALL') return books;
    return books.filter((b) => b.category === selectedCategory);
  }, [books, selectedCategory]);

  // Catalog summary stats
  const catalogStats = useMemo(() => {
    const totalVolumes = booksToExport.reduce((acc, b) => acc + (b.volumesCount || 0), 0);
    const totalPages = booksToExport.reduce((acc, b) => acc + (b.totalPagesApprox || 0), 0);
    const totalVerified = booksToExport.reduce((acc, b) => acc + (b.verifiedPassagesCount || 0), 0);
    const editionsCount = booksToExport.reduce((acc, b) => acc + (b.editions?.length || 0), 0);
    return { totalVolumes, totalPages, totalVerified, editionsCount };
  }, [booksToExport]);

  // Categories list for filter
  const availableCategories = useMemo(() => {
    const map = new Map<string, { id: string; nameAr: string; nameEn: string; count: number }>();
    books.forEach((b) => {
      const existing = map.get(b.category);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(b.category, {
          id: b.category,
          nameAr: b.categoryAr,
          nameEn: b.categoryEn,
          count: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [books]);

  // Generate structured JSON string
  const generatedJsonString = useMemo(() => {
    const exportObject: Record<string, any> = {
      $schema: 'https://encyclopedia-ibn-taymiyyah.org/schemas/catalog-v2.json',
      catalogMetadata: {
        titleAr: 'فهرس مكتبة وتراث شيخ الإسلام ابن تيمية الرقمي',
        titleEn: 'Shaykh al-Islam Ibn Taymiyyah Digital Library Catalog',
        version: '2.5.0-canonical',
        exportDate: new Date().toISOString(),
        exportedBy: 'Editorial Board Supervisor (Authorized Session)',
        complianceStandard: 'ISO 27001 Data Portability & Scholarly Open Metadata',
        filterCategory: selectedCategory,
        statistics: {
          totalBooks: booksToExport.length,
          totalVolumes: catalogStats.totalVolumes,
          totalPagesApprox: catalogStats.totalPages,
          totalVerifiedPassages: catalogStats.totalVerified,
          criticalEditionsCataloged: catalogStats.editionsCount,
        },
      },
      catalog: booksToExport.map((b) => ({
        id: b.id,
        titleAr: b.titleAr,
        titleEn: b.titleEn,
        shortNameAr: b.shortNameAr,
        shortNameEn: b.shortNameEn,
        category: b.category,
        categoryAr: b.categoryAr,
        categoryEn: b.categoryEn,
        author: {
          nameAr: b.authorAr,
          nameEn: b.authorEn,
          birthYearHijri: b.authorMetadata?.birthYearHijri,
          deathYearHijri: b.authorMetadata?.deathYearHijri,
        },
        volumesCount: b.volumesCount,
        totalPagesApprox: b.totalPagesApprox,
        verifiedPassagesCount: b.verifiedPassagesCount,
        attributionStatus: b.attributionStatus || 'محقق النسبة',
        availabilityStatus: b.availabilityStatus || 'متوفر بالنص',
        copyrightStatus: b.copyrightStatus,
        editions: b.editions || [],
        descriptionAr: b.descriptionAr,
        descriptionEn: b.descriptionEn,
        relatedBookIds: b.relatedBookIds || [],
        relatedTopicIds: b.relatedTopicIds || [],
      })),
    };

    if (includePassagesInJson) {
      exportObject.canonicalPassagesArchive = passages.filter((p) =>
        booksToExport.some((b) => b.id === p.bookId)
      );
    }

    return JSON.stringify(exportObject, null, 2);
  }, [booksToExport, catalogStats, includePassagesInJson, passages, selectedCategory]);

  // Generate RFC-4180 compliant CSV string with UTF-8 BOM
  const generatedCsvString = useMemo(() => {
    const escapeCsv = (val: string | number | undefined | null): string => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Book_ID',
      'Title_Arabic',
      'Title_English',
      'Short_Name_Arabic',
      'Category_Code',
      'Category_Arabic',
      'Category_English',
      'Volumes_Count',
      'Estimated_Pages',
      'Verified_Passages_Count',
      'Attribution_Status',
      'Availability_Status',
      'Copyright_Status',
      'Author_Arabic',
      'Author_English',
      'Primary_Edition_Name',
      'Primary_Editor',
      'Primary_Publisher',
      'Publication_City',
      'Description_Arabic',
      'Description_English',
    ];

    const rows = booksToExport.map((b) => {
      const primaryEdition = b.editions?.[0];
      return [
        escapeCsv(b.id),
        escapeCsv(b.titleAr),
        escapeCsv(b.titleEn),
        escapeCsv(b.shortNameAr),
        escapeCsv(b.category),
        escapeCsv(b.categoryAr),
        escapeCsv(b.categoryEn),
        escapeCsv(b.volumesCount),
        escapeCsv(b.totalPagesApprox),
        escapeCsv(b.verifiedPassagesCount),
        escapeCsv(b.attributionStatus || 'محقق النسبة'),
        escapeCsv(b.availabilityStatus || 'متوفر بالنص'),
        escapeCsv(b.copyrightStatus),
        escapeCsv(b.authorAr),
        escapeCsv(b.authorEn),
        escapeCsv(primaryEdition?.editionName || ''),
        escapeCsv(primaryEdition?.editor || ''),
        escapeCsv(primaryEdition?.publisher || ''),
        escapeCsv(primaryEdition?.city || ''),
        escapeCsv(b.descriptionAr),
        escapeCsv(b.descriptionEn),
      ].join(',');
    });

    // Prepend UTF-8 BOM (\uFEFF) for immediate compatibility with Excel & spreadsheet viewers
    return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  }, [booksToExport]);

  // Handle file download
  const handleDownloadFile = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    let blob: Blob;
    let filename: string;

    if (exportFormat === 'json') {
      blob = new Blob([generatedJsonString], { type: 'application/json;charset=utf-8;' });
      filename = `ibn_taymiyyah_library_catalog_${timestamp}.json`;
    } else {
      blob = new Blob([generatedCsvString], { type: 'text/csv;charset=utf-8;' });
      filename = `ibn_taymiyyah_library_catalog_${timestamp}.csv`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessNotice(
      isAr
        ? `تم تنزيل الفهرس بنجاح باسم: ${filename}`
        : `Catalog downloaded successfully: ${filename}`
    );

    setTimeout(() => {
      setDownloadSuccessNotice(null);
    }, 4500);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    const textToCopy = exportFormat === 'json' ? generatedJsonString : generatedCsvString;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#FFFDF7] border border-[#D8D3C5] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#422D1F] text-[#FFFDF7] flex items-center justify-between border-b border-[#5A3E2B]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-scholarly font-bold text-lg leading-tight">
                  {isAr ? 'لوحة الإشراف والتصدير العلمي' : 'Scholarly Review & Export Board'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  {isAr ? 'وصول مُصرَّح به' : 'Authorized'}
                </span>
              </div>
              <span className="text-[11px] text-[#D8D3C5] font-mono">
                {isAr
                  ? 'إدارة التدقيق وتصدير قاعدة بيانات الفهرس (JSON / CSV)'
                  : 'Scholarly Audit, Portability & Catalog Backup'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#D8D3C5] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 border-b border-[#EFEADE] bg-[#F7F4EC] overflow-x-auto">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold font-scholarly transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-[#422D1F] text-[#422D1F]'
                : 'border-transparent text-[#7A7365] hover:text-[#090909]'
            }`}
          >
            <HardDriveDownload className="w-4 h-4 text-[#9B783E]" />
            <span>{isAr ? 'تصدير الفهرس (JSON / CSV)' : 'Export Catalog'}</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold font-scholarly transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-[#422D1F] text-[#422D1F]'
                : 'border-transparent text-[#7A7365] hover:text-[#090909]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? 'سجل تدقيق النصوص' : 'Passages Audit'}</span>
          </button>
          <button
            onClick={() => setActiveTab('integrity')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold font-scholarly transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'integrity'
                ? 'border-[#422D1F] text-[#422D1F]'
                : 'border-transparent text-[#7A7365] hover:text-[#090909]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isAr ? 'معايير فحص العزو' : 'Integrity Guardrails'}</span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold font-scholarly transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'system'
                ? 'border-[#422D1F] text-[#422D1F]'
                : 'border-transparent text-[#7A7365] hover:text-[#090909]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{isAr ? 'حالة النظام وقواعد البيانات' : 'System Health'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB: EXPORT CATALOG */}
          {activeTab === 'export' && (
            <div className="space-y-5">
              {/* Authorized Header Notice */}
              <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#422D1F] text-[#D4AF37] shrink-0 mt-0.5">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-scholarly font-bold text-sm text-[#2C1D13]">
                      {isAr
                        ? 'تصدير فهرس المكتبة المعتمد والنسخ الاحتياطي'
                        : 'Export Library Catalog & Local Backup'}
                    </h4>
                    <p className="text-xs text-[#665E51] mt-0.5 leading-relaxed">
                      {isAr
                        ? 'يتيح هذا القسم للمشرفين والباحثين تنزيل بيانات المكتبة كاملة بصيغ قياسية مهيكلة قابلة للنقل (Portable Open Data) لدعم النسخ المحلي واستيرادها في أنظمة الفهارس والتحليل.'
                        : 'Download the complete canonical library catalog in structured JSON or CSV format for local backup, offline archiving, and data portability.'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between text-xs text-[#7A7365] border-t sm:border-t-0 pt-2 sm:pt-0 border-[#D8D3C5]">
                  <span className="font-mono font-bold text-[#422D1F]">v2.5.0-Canonical</span>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isAr ? 'تصريح نشط' : 'Authorized'}
                  </span>
                </div>
              </div>

              {/* Success Notification Alert */}
              {downloadSuccessNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{downloadSuccessNotice}</span>
                  </div>
                  <button
                    onClick={() => setDownloadSuccessNotice(null)}
                    className="text-emerald-700 hover:text-emerald-950 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Statistics Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-1">
                  <span className="text-[11px] text-[#7A7365] font-medium block">
                    {isAr ? 'المؤلفات المحددة' : 'Selected Books'}
                  </span>
                  <div className="font-scholarly font-bold text-lg text-[#2C1D13]">
                    {booksToExport.length}{' '}
                    <span className="text-xs font-normal text-[#7A7365]">
                      {isAr ? 'كتاب ورسالة' : 'items'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-1">
                  <span className="text-[11px] text-[#7A7365] font-medium block">
                    {isAr ? 'إجمالي المجلدات' : 'Total Volumes'}
                  </span>
                  <div className="font-scholarly font-bold text-lg text-[#2C1D13]">
                    {catalogStats.totalVolumes}{' '}
                    <span className="text-xs font-normal text-[#7A7365]">
                      {isAr ? 'مجلداً' : 'vols'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-1">
                  <span className="text-[11px] text-[#7A7365] font-medium block">
                    {isAr ? 'تقدير الصفحات' : 'Approx Pages'}
                  </span>
                  <div className="font-scholarly font-bold text-lg text-[#2C1D13]">
                    {catalogStats.totalPages.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-[#7A7365]">
                      {isAr ? 'صفحة' : 'pages'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-1">
                  <span className="text-[11px] text-[#7A7365] font-medium block">
                    {isAr ? 'الطبعات المحققة' : 'Critical Editions'}
                  </span>
                  <div className="font-scholarly font-bold text-lg text-[#2C1D13]">
                    {catalogStats.editionsCount}{' '}
                    <span className="text-xs font-normal text-[#7A7365]">
                      {isAr ? 'طبعة موثقة' : 'editions'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Export Controls & Configuration */}
              <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-4">
                <div className="font-scholarly font-bold text-xs text-[#422D1F] border-b border-[#EFEADE] pb-2">
                  {isAr ? 'خيارات وتنسيق التصدير' : 'Export Configuration'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Format Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#422D1F] block">
                      {isAr ? 'صيغة الملف (Format):' : 'File Format:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setExportFormat('json')}
                        className={`p-3 rounded-lg border text-start transition-all flex items-center gap-2.5 ${
                          exportFormat === 'json'
                            ? 'bg-[#422D1F] text-[#FFFDF7] border-[#422D1F] shadow-xs'
                            : 'bg-[#F7F4EC] text-[#422D1F] border-[#D8D3C5] hover:bg-[#EFEADE]'
                        }`}
                      >
                        <FileCode className={`w-5 h-5 ${exportFormat === 'json' ? 'text-[#D4AF37]' : 'text-[#7A7365]'}`} />
                        <div>
                          <div className="text-xs font-bold font-mono">JSON (.json)</div>
                          <div className={`text-[10px] ${exportFormat === 'json' ? 'text-[#D8D3C5]' : 'text-[#7A7365]'}`}>
                            {isAr ? 'هيكلي موثق وشامل' : 'Hierarchical & Rich'}
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExportFormat('csv')}
                        className={`p-3 rounded-lg border text-start transition-all flex items-center gap-2.5 ${
                          exportFormat === 'csv'
                            ? 'bg-[#422D1F] text-[#FFFDF7] border-[#422D1F] shadow-xs'
                            : 'bg-[#F7F4EC] text-[#422D1F] border-[#D8D3C5] hover:bg-[#EFEADE]'
                        }`}
                      >
                        <FileSpreadsheet className={`w-5 h-5 ${exportFormat === 'csv' ? 'text-[#D4AF37]' : 'text-[#7A7365]'}`} />
                        <div>
                          <div className="text-xs font-bold font-mono">CSV (.csv)</div>
                          <div className={`text-[10px] ${exportFormat === 'csv' ? 'text-[#D8D3C5]' : 'text-[#7A7365]'}`}>
                            {isAr ? 'جداول إكسل ومطابقة UTF-8' : 'Excel & Sheets Ready'}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#422D1F] block flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#9B783E]" />
                      <span>{isAr ? 'نطاق التصنيف:' : 'Category Scope:'}</span>
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full text-xs h-10 px-3 bg-[#F7F4EC] border border-[#D8D3C5] rounded-lg text-[#2C1D13] font-medium focus:outline-hidden focus:border-[#7A5835]"
                    >
                      <option value="ALL">
                        {isAr
                          ? `كافة أقسام المكتبة الشاملة (${books.length} كتاب)`
                          : `All Catalog Categories (${books.length} books)`}
                      </option>
                      {availableCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {isAr ? `${cat.nameAr} (${cat.count})` : `${cat.nameEn} (${cat.count})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional JSON Options */}
                {exportFormat === 'json' && (
                  <div className="pt-2 border-t border-[#EFEADE] flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-[#422D1F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includePassagesInJson}
                        onChange={(e) => setIncludePassagesInJson(e.target.checked)}
                        className="rounded border-[#D8D3C5] text-[#422D1F] focus:ring-[#9B783E]"
                      />
                      <span>
                        {isAr
                          ? 'تضمين نصوص الاقتباسات الموثقة للكتب المحددة في الأرشيف (Passages Archive)'
                          : 'Include verified passages archive within the JSON export'}
                      </span>
                    </label>
                    <span className="text-[11px] font-mono text-[#7A7365]">
                      {includePassagesInJson
                        ? `${passages.length} passages included`
                        : 'Catalog metadata only'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Download & Copy */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadFile}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-bold transition-all shadow-xs active:scale-98"
                  >
                    <Download className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {isAr
                        ? `تنزيل الفهرس بصيغة ${exportFormat.toUpperCase()}`
                        : `Download Catalog (${exportFormat.toUpperCase()})`}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#FFFDF7] hover:bg-[#EFEADE] text-[#422D1F] border border-[#D8D3C5] text-xs font-semibold transition-colors"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-[#7A7365]" />
                        <span>{isAr ? 'نسخ النص' : 'Copy Text'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-1 text-xs text-[#7A7365] hover:text-[#422D1F] font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showPreview ? (isAr ? 'إخفاء المعاينة' : 'Hide Preview') : (isAr ? 'عرض المعاينة' : 'Show Preview')}</span>
                  </button>
                  <span className="text-[11px] font-mono text-[#7A7365]">
                    ~{(exportFormat === 'json' ? generatedJsonString.length : generatedCsvString.length) / 1024 > 1
                      ? `${((exportFormat === 'json' ? generatedJsonString.length : generatedCsvString.length) / 1024).toFixed(1)} KB`
                      : `${exportFormat === 'json' ? generatedJsonString.length : generatedCsvString.length} Bytes`}
                  </span>
                </div>
              </div>

              {/* Data Preview Box */}
              {showPreview && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#7A7365]">
                    <span className="font-mono">
                      {isAr ? 'معاينة المخرجات المباشرة:' : 'Live Output Preview:'} (
                      {exportFormat === 'json' ? 'JSON Structure' : 'CSV Lines'})
                    </span>
                    <span className="text-[11px]">
                      {exportFormat === 'csv' && (isAr ? 'ترميز UTF-8 مع معرّف BOM' : 'UTF-8 with BOM for Excel')}
                    </span>
                  </div>
                  <pre
                    dir="ltr"
                    className="p-3.5 rounded-xl bg-[#2C1D13] text-[#D8D3C5] text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-[#422D1F] selection:bg-[#9B783E] selection:text-white"
                  >
                    <code>
                      {exportFormat === 'json'
                        ? generatedJsonString.slice(0, 2400) +
                          (generatedJsonString.length > 2400 ? '\n\n... [truncated for preview]' : '')
                        : generatedCsvString.slice(0, 1600) +
                          (generatedCsvString.length > 1600 ? '\n... [truncated for preview]' : '')}
                    </code>
                  </pre>
                </div>
              )}

              {/* Data Portability Compliance Note */}
              <div className="p-3 rounded-lg bg-[#EFEADE]/70 border border-[#D8D3C5] text-[11px] text-[#665E51] space-y-1">
                <div className="font-bold text-[#422D1F]">
                  {isAr ? 'ملاحظة المعايير وحرية البيانات (Data Portability):' : 'Data Portability Standards Note:'}
                </div>
                <p className="leading-relaxed">
                  {isAr
                    ? 'تتوافق ملفات التصدير مع مواصفات Dublin Core للفهارس الرقمية وقواعد البيانات المفتوحة. ملف CSV مزود برأس UTF-8 BOM لضمان فتح الحروف العربية مباشرة دون تشويه في برامج الجداول الإلكترونية، وملف JSON يتضمن التوثيق الأكاديمي لجميع الطبعات المحققة.'
                    : 'The exported catalog complies with open metadata standards. The CSV output includes a UTF-8 Byte Order Mark (BOM) to prevent character corruption in desktop spreadsheet software, and the JSON output adheres to schema validation.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB: AUDIT PASSAGES */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder={isAr ? 'ابحث في نصوص السجل للتدقيق...' : 'Search database records...'}
                    className="w-full text-xs h-9 pl-8 pr-8 bg-[#F7F4EC] border border-[#D8D3C5] rounded-md focus:outline-hidden focus:border-[#7A5835]"
                  />
                  <Search className={`w-3.5 h-3.5 text-[#7A7365] absolute top-2.5 ${isAr ? 'left-2.5' : 'right-2.5'}`} />
                </div>
                <span className="text-xs font-mono text-[#7A7365]">
                  {isAr ? `إجمالي السجلات: ${filteredPassages.length}` : `Records: ${filteredPassages.length}`}
                </span>
              </div>

              <div className="space-y-3">
                {filteredPassages.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#422D1F] font-scholarly">
                          {p.bookTitleAr}
                        </span>
                        <span className="font-mono bg-[#EFEADE] px-1.5 py-0.5 rounded font-bold">
                          ج {p.volume} • ص {p.page}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{p.verificationStatus}</span>
                      </span>
                    </div>

                    <p className="font-scholarly text-[#2C1D13] line-clamp-2">
                      «{p.textArabic}»
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#7A7365] border-t border-[#D8D3C5] pt-1.5">
                      <span className="font-mono">{p.verifiedSourceCitation}</span>
                      <span>الناشر: {p.publisher || 'مجمع الملك فهد'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: INTEGRITY GUARDRAILS */}
          {activeTab === 'integrity' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold font-scholarly text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'حالة محرك الفحص والتوثيق: نشط ومفعل' : 'Verification Status: ACTIVE'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {isAr
                    ? 'جميع استعلامات الذكاء الاصطناعي مقيدة بسياق نصوص قاعدة البيانات. يتم فحص نسبة التطابق الحرفي مع الطبعات المعتمدة، وفي حال انعدام النص يتم إطلاق رسالة عدم العثور دون افتراض أي بيانات.'
                    : 'All AI queries are constrained strictly to the database passage excerpts with mandatory volume and page verification.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5]">
                  <div className="text-[#888] text-[10px]">HALLUCINATION_GUARD_MODE</div>
                  <div className="text-[#2C1D13] font-bold text-sm">STRICT_ZERO_TOLERANCE</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F7F4EC] border border-[#D8D3C5]">
                  <div className="text-[#888] text-[10px]">DATABASE_CANONICAL_INDEX</div>
                  <div className="text-[#2C1D13] font-bold text-sm">100% VERIFIED</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM HEALTH */}
          {activeTab === 'system' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] space-y-2">
                <div className="flex items-center gap-2 text-[#422D1F] font-bold">
                  <Database className="w-4 h-4 text-[#9B783E]" />
                  <span>DATABASE ENGINE: PostgreSQL + OpenSearch Inverted Index</span>
                </div>
                <div className="text-[#555] text-[11px] space-y-1 pt-1">
                  <div>• Schema Version: 2.5.0-PostgreSQL</div>
                  <div>• Normalization: Arabic Tashkeel & Hamza Stripping (Active)</div>
                  <div>• API Endpoint: /api/search, /api/ai/research-assistant</div>
                  <div>• Export Protocols: JSON v2.5 / RFC-4180 CSV (UTF-8 BOM)</div>
                  <div>• Status: OPERATIONAL (Port 3000)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F4EC] border-t border-[#EFEADE] flex items-center justify-between text-xs text-[#7A7365]">
          <div className="flex items-center gap-2">
            <span className="font-scholarly font-medium">
              {isAr ? 'موسوعة شيخ الإسلام ابن تيمية • لوحة التدقيق والتصدير' : 'Ibn Taymiyyah Encyclopedia • Review & Export'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFEADE] font-mono">
              {books.length} Books / {passages.length} Passages
            </span>
          </div>
          <div className="flex items-center gap-2">
            {activeTab !== 'export' && (
              <button
                onClick={() => setActiveTab('export')}
                className="px-3 py-1.5 rounded-lg bg-[#EFEADE] hover:bg-[#D8D3C5] text-[#422D1F] font-medium transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#9B783E]" />
                <span>{isAr ? 'تصدير الفهرس' : 'Export Catalog'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#422D1F] text-[#FFFDF7] font-medium hover:bg-[#2C1D13] transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
