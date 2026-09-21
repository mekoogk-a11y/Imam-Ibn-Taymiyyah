import React, { useState, useMemo } from 'react';
import {
  Layers,
  BookOpen,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  Quote,
  Sparkles,
  ExternalLink,
  Tag,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Language, Topic, Passage } from '../types';
import { Breadcrumb } from './Breadcrumb';

interface HierarchicalTopicNode {
  id: string;
  nameAr: string;
  nameEn: string;
  level: number;
  descriptionAr: string;
  children?: HierarchicalTopicNode[];
  passagesCount?: number;
}

interface TopicsViewProps {
  language: Language;
  topics: Topic[];
  passages: Passage[];
  onSelectTopicForSearch: (topicId: string) => void;
  onOpenPassageInReader: (bookId: string, passageId: string) => void;
  onSelectTopicDetail?: (topic: Topic) => void;
  onAskAIWithTopic?: (topicName: string) => void;
}

export const TopicsView: React.FC<TopicsViewProps> = ({
  language,
  topics,
  passages,
  onSelectTopicForSearch,
  onOpenPassageInReader,
  onSelectTopicDetail,
  onAskAIWithTopic,
}) => {
  const isAr = language === 'ar';
  const [filterQuery, setFilterQuery] = useState('');
  const [activeViewMode, setActiveViewMode] = useState<'TREE' | 'CARDS'>('TREE');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    aqidah: true,
    fiqh: true,
    usul: true,
    hadith: true,
    tafsir: true,
    polemics: true,
  });

  const [selectedTopicId, setSelectedTopicId] = useState<string>('tawhid');

  // Complete hierarchical taxonomy structure
  const taxonomyData: HierarchicalTopicNode[] = useMemo(() => [
    {
      id: 'aqidah',
      nameAr: 'العقيدة وأصول الدين',
      nameEn: 'Creed & Foundations of Religion',
      level: 1,
      descriptionAr: 'المباحث الكبرى في معرفة الله وتوحيده، والغيبيات، واليوم الآخر، والنبوة، ومذهب سلف الأمة.',
      children: [
        {
          id: 'tawhid',
          nameAr: 'التوحيد والعبادة',
          nameEn: 'Tawhid & Essence of Worship',
          level: 2,
          descriptionAr: 'تحقيق توحيد الإلهية والربوبية وإفراد الله بالدعاء والنسك والاستعانة.',
          children: [
            { id: 'tawhid-uluhiyyah', nameAr: 'توحيد الألوهية وحقيقة العبادة', nameEn: 'Tawhid al-Uluhiyyah', level: 3, descriptionAr: 'تعريف العبادة الجامعة لكل ما يحبه الله ويرضاه من الأقوال والأعمال' },
            { id: 'tawhid-rububiyyah', nameAr: 'توحيد الربوبية والقدر وأفعال العباد', nameEn: 'Tawhid al-Rububiyyah', level: 3, descriptionAr: 'الخلق والرزق والإحياء والإماتة وسنن الله في كونه' },
            { id: 'shirk-wasail', nameAr: 'حماية جناب التوحيد وسد ذرائع الشرك', nameEn: 'Safeguarding Monotheism', level: 3, descriptionAr: 'النهي عن الغلو في القبور والمشاهد وشد الرحال' },
          ],
        },
        {
          id: 'asma-sifat',
          nameAr: 'أسماء الله وصفاته',
          nameEn: 'Divine Names & Attributes',
          level: 2,
          descriptionAr: 'إثبات ما أثبته الله لنفسه بلا تحريف ولا تعطيل ولا تكييف ولا تمثيل.',
          children: [
            { id: 'uluw-istiwa', nameAr: 'إثبات علو الله على خلقه واستوائه على عرشه', nameEn: 'Divine Transcendence', level: 3, descriptionAr: 'نصوص الاستواء والعلو وبطلان تأويلات الجهمية والمعطلة' },
            { id: 'kalam-quran', nameAr: 'إثبات صفة الكلام وأن القرآن كلام الله منزل غير مخلوق', nameEn: 'Quran as Uncreated Speech of God', level: 3, descriptionAr: 'تقرير مذهب السلف في القرآن بالحرف والصوت' },
            { id: 'qawaid-ithbat', nameAr: 'قواعد التشبيه والتمثيل والتكييف', nameEn: 'Rules of Divine Attributes', level: 3, descriptionAr: 'القول في بعض الصفات كالقول في البعض، ومذهب أهل الإثبات' },
          ],
        },
        {
          id: 'iman-islam',
          nameAr: 'الإيمان والإسلام ومسائل الأسماء والأحكام',
          nameEn: 'Faith, Islam & Rulings of Persons',
          level: 2,
          descriptionAr: 'حقيقة الإيمان: قول باللسان واعتقاد بالجنان وعمل بالأركان، يزيد وينقص.',
          children: [
            { id: 'ziyadat-iman', nameAr: 'زيادة الإيمان بالطاعة ونقصانه بالمعصية', nameEn: 'Fluctuation of Faith', level: 3, descriptionAr: 'نقد مقالات المرجئة والخوارج في حقيقة الإيمان' },
            { id: 'shurut-takfir', nameAr: 'ضوابط التكفير وموانعه (الجهل والتأويل والإكراه)', nameEn: 'Preconditions and Impediments of Takfir', level: 3, descriptionAr: 'الفرق بين المقالة والقائل، والتفريق بين المطلق والمعين' },
          ],
        },
      ],
    },
    {
      id: 'fiqh',
      nameAr: 'الفقه الإسلامي والأحكام الشرعية',
      nameEn: 'Islamic Jurisprudence & Legal Rulings',
      level: 1,
      descriptionAr: 'الأحكام الفرعية العملية المستنبطة من أدلتها التفصيلية في العبادات والمعاملات.',
      children: [
        {
          id: 'taharah-salah',
          nameAr: 'أحكام الطهارة والصلاة',
          nameEn: 'Purification & Prayer',
          level: 2,
          descriptionAr: 'المياه، شروط الصلاة، الأركان، صلاة الجماعة، ومسائل النية وأوقات النهي.',
          children: [
            { id: 'niyyah-salah', nameAr: 'مسألة التلفظ بالنية في الصلاة والوضوء', nameEn: 'Intention in Worship', level: 3, descriptionAr: 'تقرير أن النية محلها القلب ولا يشرع الجهر بها اتفاقاً' },
            { id: 'qasr-jam', nameAr: 'أحكام الجمع والقصر في السفر والمطر', nameEn: 'Shortening and Combining Prayers', level: 3, descriptionAr: 'ضوابط السفر المبيح للترخص ورفع الحرج' },
          ],
        },
        {
          id: 'buyu-muamalat',
          nameAr: 'فقه البيوع والمعاملات المالية',
          nameEn: 'Financial Contracts & Commerce',
          level: 2,
          descriptionAr: 'العقود، الشروط، الربا، المزارعة، والتحرير الفقهي للأصل في المعاملات الحل.',
          children: [
            { id: 'asl-muamalat', nameAr: 'الأصل في العقود والشروط الإباحة والحل', nameEn: 'Permissibility as Default in Contracts', level: 3, descriptionAr: 'قاعدة ابن تيمية الشهيرة في حرية الاشتراط ما لم يخالف نصاً' },
            { id: 'tahrim-riba', nameAr: 'تحريم الربا والغرر وحيل البيوع', nameEn: 'Prohibition of Usury & Deceptive Devices', level: 3, descriptionAr: 'نقض حيل الربا كبيوع العينة والتورق الصوري' },
          ],
        },
        {
          id: 'nikah-talaq',
          nameAr: 'أحكام النكاح والأسرة والطلاق',
          nameEn: 'Family Law & Divorce',
          level: 2,
          descriptionAr: 'عقد النكاح، الحقوق الزوجية، وتحقيق مسألة الطلاق الثلاث بلفظ واحد ويمين الطلاق.',
          children: [
            { id: 'talaq-thalath', nameAr: 'مسألة الطلاق الثلاث في مجلس واحد', nameEn: 'Triple Divorce in a Single Pronouncement', level: 3, descriptionAr: 'فتوى ابن تيمية بأن الثلاث بلفظ واحد تقع واحدة، استناداً لحديث ابن عباس' },
            { id: 'yamin-talaq', nameAr: 'يمين الطلاق والحلف به', nameEn: 'Divorce Oaths', level: 3, descriptionAr: 'كفارة يمين لمن قصد الحث أو المنع دون قصد إيقاع الفراق' },
          ],
        },
      ],
    },
    {
      id: 'usul',
      nameAr: 'أصول الفقه ومقاصد الشريعة',
      nameEn: 'Principles of Jurisprudence & Legal Objectives',
      level: 1,
      descriptionAr: 'قواعد الاستنباط، حجية الإجماع، القياس، نقد التقليد المذموم، ومقاصد رفع الحرج.',
      children: [
        {
          id: 'adillah-ijtihad',
          nameAr: 'الأدلة والاجتهاد والاتباع',
          nameEn: 'Evidences, Ijtihad & Following Sunnah',
          level: 2,
          descriptionAr: 'تقديم النص على الرأي، وحقيقة الإجماع المنضبط، والرد على التعصب المذهبي.',
          children: [
            { id: 'raf-malam', nameAr: 'رفع الملام عن الأئمة الأعلام وأعذار الفقهاء', nameEn: 'Vindicating the Great Imams', level: 3, descriptionAr: 'بيان أسباب اختلاف الفقهاء ومعاذيرهم في عدم الأخذ ببعض الأحاديث' },
            { id: 'ittiba-taqlid', nameAr: 'الفرق بين الاتباع المحمود والتقليد الأعمى', nameEn: 'Following vs Blind Imitation', level: 3, descriptionAr: 'وجوب الرجوع إلى الكتاب والسنة عند التنازع' },
          ],
        },
      ],
    },
    {
      id: 'polemics',
      nameAr: 'صريح المعقول وصحيح المنقول ومناظرة الفرق',
      nameEn: 'Reason, Revelation & Comparative Polemics',
      level: 1,
      descriptionAr: 'مواءمة العقل الصريح مع النص الصحيح ونقض أصول المنطق الكلامي والفلسفي.',
      children: [
        {
          id: 'aqil-naql',
          nameAr: 'درء تعارض العقل والنقل',
          nameEn: 'Harmony Between Reason & Revelation',
          level: 2,
          descriptionAr: 'تفنيد القانون الكلي للرازي وبيان أن العقل الصريح يشهد للنقل الصحيح.',
          children: [
            { id: 'naqd-razi', nameAr: 'نقض القانون الكلي وتفنيد تقديم العقل', nameEn: 'Refutation of the Universal Canon', level: 3, descriptionAr: 'أن العقل دال على صدق النقل فتقديمه عليه قدح في دلالة العقل نفسه' },
            { id: 'muharat-muhalat', nameAr: 'التفريق بين محارات العقول ومحالات العقول', nameEn: 'Perplexities vs Impossibilities of Reason', level: 3, descriptionAr: 'الشرع يأتي بما تعجز العقول عن استقلاله لا بما تجزم باستحالته' },
          ],
        },
      ],
    },
    {
      id: 'siyasah',
      nameAr: 'السياسة الشرعية ونظم الحكم والقضاء',
      nameEn: 'Islamic Governance & Judiciary',
      level: 1,
      descriptionAr: 'أداء الأمانات، اختيار الأصلح، القضاء العادل، والإنصاف مع المخالف.',
      children: [
        {
          id: 'adl-wilayat',
          nameAr: 'العدل والولايات العامة',
          nameEn: 'Justice & Public Trusteeship',
          level: 2,
          descriptionAr: 'العدل واجب لكل أحد على كل أحد في كل حال والظلم محرم مطلقاً.',
          children: [
            { id: 'istimal-aslah', nameAr: 'استعمال الأصلح والأكفأ في الولايات', nameEn: 'Appointing the Most Competent', level: 3, descriptionAr: 'تحريم المحاباة في الوظائف العامة والأمانة في القضاء والإمارة' },
            { id: 'insaf-mukhalif', nameAr: 'إقامة العدل والإنصاف مع المخالفين', nameEn: 'Fairness Towards Opponents', level: 3, descriptionAr: 'قول الحق والعدل في شأن المخالف والكافر والمبتدع' },
          ],
        },
      ],
    },
  ], []);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Find the selected topic info
  const currentTopicData = useMemo(() => {
    // Search in standard topics or tree
    const foundInTopics = topics.find((t) => t.id === selectedTopicId);
    if (foundInTopics) return foundInTopics;

    // Helper to find in tree
    const findInTree = (nodes: HierarchicalTopicNode[]): Topic | null => {
      for (const node of nodes) {
        if (node.id === selectedTopicId) {
          return {
            id: node.id,
            nameAr: node.nameAr,
            nameEn: node.nameEn,
            category: 'THEOLOGY',
            descriptionAr: node.descriptionAr,
            descriptionEn: node.nameEn,
            passagesCount: node.passagesCount || 12,
            booksCount: 4,
            keywords: [node.nameAr, node.nameEn],
            relatedBookIds: ['majmu-fatawa', 'dar-taarud'],
          };
        }
        if (node.children) {
          const res = findInTree(node.children);
          if (res) return res;
        }
      }
      return null;
    };

    return findInTree(taxonomyData) || topics[0];
  }, [topics, selectedTopicId, taxonomyData]);

  // Linked passages for current selection
  const linkedPassages = useMemo(() => {
    return passages.filter((p) =>
      p.topicIds?.includes(selectedTopicId) ||
      p.keywords?.some((k) => k.includes(currentTopicData.nameAr) || currentTopicData.nameAr.includes(k))
    );
  }, [passages, selectedTopicId, currentTopicData]);

  // Recursive tree rendering
  const renderTreeNode = (node: HierarchicalTopicNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[node.id];
    const isSelected = selectedTopicId === node.id;

    // Count passages for this topic or descendants
    const count = passages.filter(
      (p) =>
        p.topicIds?.includes(node.id) ||
        p.keywords?.some((k) => k.includes(node.nameAr))
    ).length;

    return (
      <div key={node.id} className="text-xs">
        <div
          className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
            isSelected
              ? 'bg-[#422D1F] text-[#FFFDF7] font-bold shadow-2xs'
              : 'hover:bg-[#EFEADE] text-[#2C1D13]'
          } ${node.level === 1 ? 'font-bold mt-1.5 bg-[#F7F4EC]' : node.level === 2 ? 'mr-3' : 'mr-6'}`}
          onClick={() => {
            setSelectedTopicId(node.id);
            if (hasChildren && !isExpanded) {
              toggleExpand(node.id);
            }
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0 pr-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className="p-0.5 hover:bg-black/10 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronLeft className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-3.5 h-3.5 inline-block" />
            )}

            {node.level === 1 ? (
              <FolderOpen className="w-4 h-4 text-[#9B783E] shrink-0" />
            ) : (
              <Tag className="w-3.5 h-3.5 text-[#7A5835] shrink-0" />
            )}

            <span className="truncate">{node.nameAr}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {count > 0 && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-[#9B783E] text-white' : 'bg-[#EFEADE] text-[#555]'
                }`}
              >
                {count}
              </span>
            )}
          </div>
        </div>

        {/* Render nested children */}
        {hasChildren && isExpanded && (
          <div className="space-y-1 mt-1 border-r border-[#D8D3C5] mr-2">
            {node.children!.map((child) => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16 font-scholarly">
      {/* Breadcrumb Header */}
      <Breadcrumb
        language={language}
        items={[
          { label: isAr ? 'الموسوعة' : 'Encyclopedia', tab: 'topics' },
          { label: isAr ? 'دليل الموضوعات الشامل' : 'All Topics Directory', isCurrent: true },
        ]}
        onNavigateTab={() => {}}
      />

      {/* Main Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEADE] text-[#422D1F] text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-[#9B783E]" />
              <span>{isAr ? 'الفهرس الموضوعي الهرمي الشامل' : 'Hierarchical Taxonomy'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1D13]">
              {isAr ? 'دليل الموضوعات والمسائل العلمية' : 'All Topics & Themes Directory'}
            </h1>
            <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
              {isAr
                ? 'فهرس مصنف هرمي يتيح التصفح المتسلسل لكافة أبواب العقيدة، الفقه، أصول الفقه، التفسير، الحديث، والسياسة الشرعية، وربطها مباشرة بالنصوص المحققة.'
                : 'Hierarchical topic directory connecting major disciplines, subcategories, and specific themes to canon passages.'}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] shrink-0 text-xs">
            <button
              onClick={() => setActiveViewMode('TREE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeViewMode === 'TREE'
                  ? 'bg-[#422D1F] text-white shadow-xs'
                  : 'text-[#555] hover:bg-[#EFEADE]'
              }`}
            >
              {isAr ? 'الفهرس الشجري الهرمي' : 'Tree View'}
            </button>
            <button
              onClick={() => setActiveViewMode('CARDS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeViewMode === 'CARDS'
                  ? 'bg-[#422D1F] text-white shadow-xs'
                  : 'text-[#555] hover:bg-[#EFEADE]'
              }`}
            >
              {isAr ? 'عرض بطاقات الموضوعات' : 'Cards View'}
            </button>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 absolute top-5 right-3 text-[#7A7365]" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={isAr ? 'تصفية الموضوعات والمباحث والمسائل...' : 'Filter topics...'}
            className="w-full text-xs pl-4 pr-9 py-2.5 bg-[#F7F4EC] border border-[#D8D3C5] rounded-xl text-[#090909] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Main 2-Column Interface: Taxonomy Tree + Selected Topic Details */}
      {activeViewMode === 'TREE' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Hierarchical Topic Tree */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-4 space-y-2 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
              <div className="text-xs font-bold text-[#422D1F] border-b border-[#EFEADE] pb-2 flex items-center justify-between">
                <span>{isAr ? 'التصنيف الهرمي العام' : 'Hierarchy Tree'}</span>
                <span className="text-[11px] text-[#7A7365]">مستويات متعددة</span>
              </div>

              <div className="space-y-1">
                {taxonomyData.map((rootNode) => renderTreeNode(rootNode))}
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Selected Topic Content & Passages */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-5 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EFEADE] pb-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-[#9B783E] font-mono block">
                    الموضوع المختار
                  </span>
                  <h2 className="font-bold text-lg text-[#2C1D13]">
                    {currentTopicData.nameAr}
                  </h2>
                  <p className="text-xs text-[#7A7365] font-mono">
                    {currentTopicData.nameEn}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onSelectTopicDetail && (
                    <button
                      onClick={() => onSelectTopicDetail(currentTopicData)}
                      className="px-3 py-1.5 rounded-lg bg-[#422D1F] hover:bg-[#2C1D13] text-white text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <span>{isAr ? 'صفحة الموضوع الكاملة' : 'Full Topic Page'}</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {onAskAIWithTopic && (
                    <button
                      onClick={() => onAskAIWithTopic(currentTopicData.nameAr)}
                      className="p-1.5 rounded-lg bg-[#F7F4EC] hover:bg-[#EFEADE] text-[#422D1F] border border-[#D8D3C5]"
                      title={isAr ? 'سؤال مساعد الباحث' : 'Ask AI Assistant'}
                    >
                      <Sparkles className="w-4 h-4 text-[#9B783E]" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#555] leading-relaxed">
                {currentTopicData.descriptionAr}
              </p>
            </div>

            {/* Verified Passages under this topic */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#422D1F] flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-[#9B783E]" />
                  <span>{isAr ? 'النصوص المعزوة المرتبطة بهذا الموضوع' : 'Documented Passages'}</span>
                </h3>
                <span className="text-xs text-[#7A7365]">
                  {linkedPassages.length} {isAr ? 'نصوص' : 'passages'}
                </span>
              </div>

              {linkedPassages.length > 0 ? (
                <div className="space-y-3">
                  {linkedPassages.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-2 shadow-2xs hover:border-[#9B783E] transition-all"
                    >
                      <div className="flex items-center justify-between text-xs text-[#7A7365] border-b border-[#EFEADE] pb-2">
                        <span className="font-bold text-[#422D1F]">
                          {p.bookTitleAr} — {p.chapterTitleAr}
                        </span>
                        <span className="font-mono text-[11px] bg-[#EFEADE] px-2 py-0.5 rounded text-[#5A3E2B]">
                          ج {p.volume} • ص {p.page}
                        </span>
                      </div>

                      <blockquote className="text-xs sm:text-sm text-[#1A1A1A] p-3 bg-[#F7F4EC] rounded-lg border-r-3 border-[#9B783E] leading-relaxed">
                        «{p.textArabic}»
                      </blockquote>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                        <span className="text-[11px] text-[#7A7365]">
                          {p.verifiedSourceCitation}
                        </span>

                        <button
                          onClick={() => onOpenPassageInReader(p.bookId, p.id)}
                          className="font-bold text-[#422D1F] hover:text-[#9B783E] flex items-center gap-0.5"
                        >
                          <span>{isAr ? 'عرض في القارئ' : 'In Reader'}</span>
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-[#FFFDF7] border border-dashed border-[#D8D3C5] text-center space-y-2">
                  <Layers className="w-7 h-7 text-[#9B783E] mx-auto opacity-70" />
                  <p className="text-xs text-[#7A7365]">
                    {isAr
                      ? 'يمكنك الاطلاع على مصنفات ومباحث هذا الموضوع بالنقر على زر صفحة الموضوع الكاملة أعلاه.'
                      : 'Explore full topic details by clicking the button above.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((t) => {
            const count = passages.filter((p) => p.topicIds?.includes(t.id)).length;
            return (
              <div
                key={t.id}
                className="bg-[#FFFDF7] rounded-xl border border-[#D8D3C5] p-5 space-y-3 flex flex-col justify-between hover:border-[#9B783E] transition-all shadow-2xs group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#EFEADE] text-[#5A3E2B] font-bold">
                      {t.category}
                    </span>
                    <span className="text-xs font-mono text-[#7A7365]">
                      {count} {isAr ? 'نصوص' : 'texts'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#2C1D13] group-hover:text-[#9B783E] transition-colors">
                    {t.nameAr}
                  </h3>
                  <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                    {t.descriptionAr}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFEADE] flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setSelectedTopicId(t.id);
                      setActiveViewMode('TREE');
                    }}
                    className="text-[#7A7365] hover:text-[#422D1F]"
                  >
                    {isAr ? 'عرض في الشجرة' : 'View in Tree'}
                  </button>

                  <button
                    onClick={() => onSelectTopicDetail?.(t)}
                    className="font-bold text-[#422D1F] hover:text-[#9B783E] flex items-center gap-1"
                  >
                    <span>{isAr ? 'استكشف الموضوع' : 'Explore'}</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
