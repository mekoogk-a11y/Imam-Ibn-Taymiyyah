export type Language = 'ar' | 'en';

export type ActiveNavTab =
  | 'home'
  | 'books'
  | 'reader'
  | 'search'
  | 'fatwas'
  | 'biography'
  | 'timeline'
  | 'topics'
  | 'topic-detail'
  | 'scholars'
  | 'graph'
  | 'articles'
  | 'sources'
  | 'manuscripts'
  | 'audio'
  | 'library'
  | 'assistant'
  | 'admin'
  | 'about'
  | 'majmu-fatawa'
  | 'book-detail'
  | 'research-collections'
  | 'sitemap'
  | 'not-found'
  | '404';

export type AttributionStatus =
  | 'محقق النسبة'
  | 'منسوب إليه'
  | 'مختلف في نسبته'
  | 'مختصر أو مستخرج'
  | 'ضمن مجموع الفتاوى'
  | 'رسالة مستقلة';

export type AvailabilityStatus =
  | 'متوفر بالنص'
  | 'متوفر PDF'
  | 'بيانات الكتاب فقط'
  | 'قيد الإضافة'
  | 'يحتاج إلى تحقيق';

export type VerificationStatus =
  | 'VERIFIED_CANONICAL'
  | 'VERIFIED_SECONDARY'
  | 'UNDER_REVIEW'
  | 'UNVERIFIED';

export type CopyrightStatus =
  | 'PUBLIC_DOMAIN'
  | 'RESEARCH_OPEN'
  | 'METADATA_ONLY'
  | 'RESTRICTED';

export interface BookEdition {
  id: string;
  bookId: string;
  editionName: string;
  editor: string;
  publisher: string;
  publicationYearHijri?: number;
  publicationYearGregorian?: number;
  city: string;
  volumesCount: number;
  digitalSource: string;
  isCanonical: boolean;
}

export interface ChapterNode {
  id: string;
  bookId: string;
  volume: number;
  startPage: number;
  endPage?: number;
  titleAr: string;
  titleEn: string;
  children?: ChapterNode[];
}

export interface Book {
  id: string;
  titleAr: string;
  titleEn: string;
  shortNameAr: string;
  shortNameEn: string;
  category: string;
  categoryAr: string;
  categoryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  authorAr: string;
  authorEn: string;
  authorMetadata: {
    name: string;
    birthYearHijri: number;
    deathYearHijri: number;
  };
  volumesCount: number;
  totalPagesApprox: number;
  verifiedPassagesCount: number;
  editions: BookEdition[];
  tableOfContents: ChapterNode[];
  coverColor: string;
  accentPattern: string;
  legalDownloadUrl?: string;
  copyrightStatus: CopyrightStatus;
  attributionStatus?: AttributionStatus;
  availabilityStatus?: AvailabilityStatus;
  relatedBookIds: string[];
  relatedTopicIds: string[];
}

export interface Passage {
  id: string;
  bookId: string;
  bookTitleAr: string;
  bookTitleEn: string;
  volume: number;
  page: number;
  chapterTitleAr: string;
  chapterTitleEn: string;
  textArabic: string;
  textEnglish?: string;
  keywords: string[];
  topicIds: string[];
  verifiedSourceCitation: string;
  hadithCitations?: string[];
  quranCitations?: string[];
  verificationStatus: VerificationStatus;
  editionId?: string;
  publisher?: string;
}

export interface Fatwa {
  id: string;
  questionAr: string;
  questionEn?: string;
  questioner?: string;
  answerAr: string;
  answerEn?: string;
  bookId: string;
  bookTitleAr?: string;
  volume: number;
  page: number;
  topicId: string;
  topicAr: string;
  topicEn?: string;
  verifiedCitation: string;
  edition?: string;
  verificationStatus: string;
}

export type FatwaRecord = Fatwa;

export interface Topic {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: string;
  passagesCount: number;
  booksCount: number;
  parentTopicId?: string;
  keywords: string[];
  relatedBookIds?: string[];
}

export interface BiographyStage {
  id: string;
  periodHijri: string;
  periodGregorian?: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr?: string;
  fullTextAr?: string;
  fullTextEn?: string;
  locationAr: string;
  locationEn?: string;
  primarySources?: string[];
  sources?: string[];
}

export interface TimelineEvent {
  id: string;
  yearHijri: number;
  yearGregorian: number;
  monthHijri?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn?: string;
  locationAr: string;
  locationEn?: string;
  category: string;
  categoryAr?: string;
  categoryEn?: string;
  primarySources: string[];
}

export interface Scholar {
  id: string;
  nameAr: string;
  nameEn: string;
  kunyaAr?: string;
  birthYearHijri?: number;
  deathYearHijri?: number;
  birthHijri?: number;
  deathHijri?: number;
  role: 'TEACHER' | 'STUDENT' | 'CONTEMPORARY' | 'BIOGRAPHER';
  roleAr?: string;
  roleEn?: string;
  bioAr: string;
  bioEn?: string;
  relationshipDetailsAr: string;
  relationshipDetailsEn?: string;
  majorWorks?: string[];
  documentedCitations?: string[];
}

export type ScholarRecord = Scholar;

export interface ScholarProfile {
  fullNameAr: string;
  fullNameEn: string;
  kunyaAr?: string;
  kunyaEn?: string;
  titleAr?: string;
  titleEn?: string;
  titleHonorificAr?: string;
  birthHijri: number;
  birthGregorian: number;
  birthPlaceAr: string;
  birthPlaceEn?: string;
  deathHijri: number;
  deathGregorian: number;
  deathPlaceAr: string;
  deathPlaceEn?: string;
  burialPlaceAr: string;
  burialPlaceEn?: string;
  contemporaryTestimonies?: {
    scholarNameAr: string;
    sourceBookAr: string;
    quoteAr: string;
  }[];
}

export interface KnowledgeNode {
  id: string;
  labelAr: string;
  labelEn: string;
  type: 'BOOK' | 'TOPIC' | 'SCHOLAR' | 'LOCATION' | 'CONCEPT' | 'EVENT';
  color?: string;
  descriptionAr?: string;
  x?: number;
  y?: number;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship?: string;
  type?: string;
  labelAr: string;
  labelEn: string;
  sourceCitation?: string;
}

export interface SourceEdition {
  id: string;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  editorAr: string;
  publisher: string;
  city: string;
  yearHijri?: number;
  yearGregorian?: number;
  volumes: number;
  verificationStatus: 'VERIFIED_PRINT' | 'MANUSCRIPT_ARCHIVE';
  notesAr: string;
  notesEn: string;
}

export interface Manuscript {
  id: string;
  titleAr: string;
  titleEn: string;
  library: string;
  city: string;
  country: string;
  shelfmark: string;
  foliosCount: number;
  copyistDateHijri?: string;
  scriptType: string;
  descriptionAr: string;
  descriptionEn?: string;
  digitalScanAvailable: boolean;
  publicArchiveUrl?: string;
}

export type ManuscriptRecord = Manuscript;

export interface AcademicArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn?: string;
  academicAffiliation?: string;
  publicationYear?: number;
  year?: number;
  journal: string;
  abstractAr?: string;
  summaryAr?: string;
  summaryEn?: string;
  fullTextAr?: string;
  relatedBookIds?: string[];
  citationsCount?: number;
  peerReviewed?: boolean;
  citation?: string;
  doi?: string;
  keywords?: string[];
}

export interface AudioLecture {
  id: string;
  titleAr: string;
  titleEn: string;
  scholarAr: string;
  duration: string;
  categoryAr?: string;
  categoryEn?: string;
  descriptionAr: string;
  descriptionEn?: string;
  audioUrl?: string;
  hasTranscript?: boolean;
}

export type AudioRecord = AudioLecture;

export interface UserBookmark {
  id: string;
  itemType: 'BOOK' | 'PASSAGE' | 'FATWA' | 'ARTICLE';
  targetId: string;
  titleAr: string;
  titleEn: string;
  citation: string;
  dateAdded: string;
  userNote?: string;
}

export interface UserHighlight {
  id: string;
  passageId: string;
  textSnippet: string;
  color: 'yellow' | 'green' | 'blue' | 'amber';
  note?: string;
  dateAdded: string;
}

export interface AIResearchResponse {
  answerAr: string;
  answerEn?: string;
  quotations: {
    textArabic: string;
    bookTitleAr: string;
    volume: number;
    page: number;
    chapterTitleAr: string;
    verifiedCitation: string;
    publisher?: string;
  }[];
  researchCoverage: 'COMPREHENSIVE' | 'SUBSTANTIAL' | 'PARTIAL' | 'INSUFFICIENT_EVIDENCE';
  coveragePercentage: number;
  verifiedDatabasePassagesCount: number;
  disclaimerAr: string;
  disclaimerEn: string;
  timestamp: string;
}

export interface ResearchCollectionItem {
  id: string;
  itemType: 'BOOK' | 'PASSAGE' | 'FATWA' | 'ARTICLE' | 'NOTE';
  targetId: string;
  titleAr: string;
  titleEn?: string;
  citation: string;
  userNote?: string;
  dateAdded: string;
}

export interface ResearchCollection {
  id: string;
  nameAr: string;
  nameEn?: string;
  descriptionAr: string;
  descriptionEn?: string;
  colorTag: string;
  createdAt: string;
  updatedAt: string;
  items: ResearchCollectionItem[];
}

export interface ReadingProgressRecord {
  bookId: string;
  bookTitleAr: string;
  currentVolume: number;
  currentPage: number;
  totalPagesApprox: number;
  progressPercent: number;
  lastReadTimestamp: string;
}

export interface HierarchicalTopic {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  descriptionAr: string;
  descriptionEn?: string;
  parentTopicId?: string;
  subTopics?: HierarchicalTopic[];
  relatedBookIds?: string[];
  passagesCount?: number;
  fatwasCount?: number;
}

