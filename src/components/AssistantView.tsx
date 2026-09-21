import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Quote,
  CheckCircle2,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { Language, AIResearchResponse, Passage } from '../types';

interface AssistantViewProps {
  language: Language;
  initialQuery?: string;
  onOpenPassageInReader?: (bookId: string, passageId: string) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  language,
  initialQuery = '',
  onOpenPassageInReader,
}) => {
  const isAr = language === 'ar';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedQuoteIdx, setCopiedQuoteIdx] = useState<number | null>(null);

  const sampleInquiries = [
    {
      ar: 'ما موقف ابن تيمية من تقديم صريح المعقول على صحيح المنقول؟',
      en: "Ibn Taymiyyah's stance on reason vs. revelation",
    },
    {
      ar: 'كيف حدد ابن تيمية حقيقة العبادة وتوحيد الألوهية؟',
      en: 'Definition of worship and Tawhid of divinity',
    },
    {
      ar: 'ما هو ضابط إقامة العدل والإنصاف مع المخالفين وأهل البدع؟',
      en: 'Principles of justice and fairness towards opponents',
    },
    {
      ar: 'ما حكم التلفظ بالنية في الصلاة عند ابن تيمية وسائر الأئمة؟',
      en: 'Ruling on vocalizing intention before prayer',
    },
    {
      ar: 'ما هو الأصل في العقود والشروط والمعاملات المالية؟',
      en: 'Default presumption in commercial contracts and terms',
    },
  ];

  const handleSearchSubmit = async (searchPrompt?: string) => {
    const q = (searchPrompt || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/research-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: q, language }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Failed to query research assistant:', err);
      setError(
        isAr
          ? 'تعذر الاتصال بمحرك التحقيق المساعد، يرجى إعادة المحاولة.'
          : 'Failed to connect to the scholarly research engine.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQuote = (citation: string, idx: number) => {
    navigator.clipboard.writeText(citation);
    setCopiedQuoteIdx(idx);
    setTimeout(() => setCopiedQuoteIdx(null), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header & Scholarly Rules Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#422D1F] text-[#D4AF37] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-scholarly font-bold text-2xl text-[#2C1D13]">
              {isAr ? 'مساعد الباحث العلمي (RAG)' : 'Scholarly Research Assistant'}
            </h2>
            <p className="text-xs text-[#7A7365]">
              {isAr
                ? 'محرك استنطاق وبحث رصين مقيد حصرياً بالنصوص المفهرسة مع منع الاختلاق قطعاً'
                : 'Zero-hallucination research assistant grounded strictly in verified canonical records'}
            </p>
          </div>
        </div>

        {/* Strict Verification Charter */}
        <div className="p-3.5 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] text-xs text-[#5A3E2B] flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#9B783E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold font-scholarly">
              {isAr ? 'ميثاق الأمانة والضبط العلمي:' : 'Scholarly Integrity Charter:'}
            </span>
            <p className="text-[11px] text-[#6E6759] leading-relaxed">
              {isAr
                ? 'يلتزم المساعد العلمي بعدم اختلاق أي استشهاد، أو نسبة قول دون عزو للمجلد والصفحة. وإذا كانت المسألة غير واردة في النصوص المتاحة، يُقر النظام: «لم يتم العثور على نص موثّق في المصادر المتاحة».'
                : 'The AI never fabricates quotes, volumes, or pages. If no source exists in the database, it clearly states: "No verified text was found in the available sources."'}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
          className="space-y-3 pt-2"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب سؤالك العلمي أو المسألة التي ترغب في استخراج رأي ابن تيمية ونصوصه فيها...'
                  : "Enter your scholarly inquiry to retrieve Ibn Taymiyyah's verified rulings..."
              }
              className="w-full p-4 pl-12 pr-12 bg-[#F7F4EC] border-2 border-[#D8D3C5] focus:border-[#7A5835] rounded-xl text-sm sm:text-base text-[#090909] focus:outline-hidden transition-all shadow-inner resize-none font-scholarly"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute bottom-3.5 left-3.5 px-4 py-2 bg-[#422D1F] hover:bg-[#2C1D13] disabled:opacity-50 text-[#FFFDF7] rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  <span>{isAr ? 'جارٍ التحقيق...' : 'Searching...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isAr ? 'استخراج النصوص' : 'Analyze Corpus'}</span>
                </>
              )}
            </button>
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-[#8B7B69] font-medium font-scholarly">
              {isAr ? 'أسئلة ومسائل مقترحة للتحقيق:' : 'Sample scholarly inquiries:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleInquiries.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(sample.ar);
                    handleSearchSubmit(sample.ar);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-[#F7F4EC] hover:bg-[#EFEADE] text-[#5A3E2B] border border-[#D8D3C5] transition-colors text-right"
                >
                  {isAr ? sample.ar : sample.en}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Response Box */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 1. Synthesis & Scholarly Analysis */}
          <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFEADE] pb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#9B783E]" />
                <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
                  {isAr ? 'البيان والتحرير العلمي' : 'Scholarly Synthesis & Analysis'}
                </h3>
              </div>

              {/* Confidence & Coverage Badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#EFEADE] text-[#422D1F]">
                  {isAr ? 'التغطية العلمية:' : 'Coverage:'} {result.coveragePercentage}%
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-800 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{result.verifiedDatabasePassagesCount} {isAr ? 'نصوص موثقة' : 'Verified Texts'}</span>
                </span>
              </div>
            </div>

            {/* Insufficient Evidence Warning Banner */}
            {result.coveragePercentage === 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold font-scholarly block text-sm">
                    {isAr ? 'الأدلة المتاحة غير كافية للوصول إلى إجابة موثقة.' : 'Available evidence is insufficient for a verified answer.'}
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {isAr
                      ? 'لم يتم العثور على نص موثّق في المصادر المتاحة. وتماشياً مع ميثاق النزاهة العلمية يمتنع المساعد عن التخمين أو صياغة أقوال لم تثبت في الأصول.'
                      : 'No verified text was found in the available sources. The assistant refrains from conjecture or unverified citations.'}
                  </p>
                </div>
              </div>
            )}

            {/* Structured Analytical Text */}
            <div className="space-y-2">
              <span className="text-xs font-bold font-scholarly text-[#9B783E] block uppercase tracking-wider">
                {isAr ? 'التحليل والبيان العلمي:' : 'Scholarly Analysis & Summary:'}
              </span>
              <div className="prose-scholarly text-base sm:text-lg text-[#1A1A1A] leading-loose whitespace-pre-line text-justify">
                {result.answerAr}
              </div>
            </div>

            {/* Scholarly Disclaimer Footer */}
            <div className="border-t border-[#EFEADE] pt-4 text-xs text-[#7A7365] flex items-center justify-between">
              <span>{result.disclaimerAr}</span>
              <span className="font-mono text-[10px]">{new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* 2. Direct Verbatim Quotations Section (Separated explicitly as requested) */}
          {result.quotations && result.quotations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-[#9B783E]" />
                <h4 className="font-scholarly font-bold text-base text-[#2C1D13]">
                  {isAr ? 'النصوص الحرفية المعتمدة المستخرجة:' : 'Exact Extracted Passages:'}
                </h4>
              </div>

              <div className="grid gap-4">
                {result.quotations.map((quote, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-3 relative shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-[#EFEADE] pb-2 text-xs text-[#7A7365]">
                      <div className="flex items-center gap-2 font-scholarly font-bold text-[#422D1F]">
                        <span>{quote.bookTitleAr}</span>
                        <span>•</span>
                        <span>{quote.chapterTitleAr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] bg-[#EFEADE] px-2 py-0.5 rounded font-bold">
                          ج {quote.volume} • ص {quote.page}
                        </span>
                        <button
                          onClick={() => handleCopyQuote(quote.verifiedCitation, idx)}
                          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-[#D8D3C5] hover:bg-[#EFEADE] text-[#5A3E2B]"
                        >
                          {copiedQuoteIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">{isAr ? 'تم' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isAr ? 'نسخ' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-scholarly font-bold text-[#9B783E] block">
                        {isAr ? 'النص الأصلي:' : 'Original Text:'}
                      </span>
                      <blockquote className="font-scholarly text-base sm:text-lg text-[#1A1A1A] leading-relaxed p-3.5 bg-[#F7F4EC] rounded-lg border-r-3 border-[#9B783E]">
                        «{quote.textArabic}»
                      </blockquote>
                    </div>

                    <div className="text-[11px] font-mono text-[#7A7365] pt-1 flex items-center gap-1.5">
                      <strong className="text-[#422D1F] font-scholarly font-bold">{isAr ? 'المصدر:' : 'Source:'}</strong>
                      <span>{quote.verifiedCitation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
