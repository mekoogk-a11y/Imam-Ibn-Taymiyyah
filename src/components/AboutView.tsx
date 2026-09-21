import React from 'react';
import { ShieldCheck, CheckCircle2, BookOpen, Scale, Award, HeartHandshake, GitBranch } from 'lucide-react';
import { Language } from '../types';

interface AboutViewProps {
  language: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-10 space-y-4 shadow-2xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEADE] text-[#422D1F] text-xs font-bold font-scholarly">
          <ShieldCheck className="w-4 h-4 text-[#9B783E]" />
          <span>{isAr ? 'المنهج العلمي وميثاق التوثيق' : 'Scholarly Methodology & Charter'}</span>
        </div>

        <h1 className="font-scholarly font-bold text-3xl sm:text-4xl text-[#2C1D13] leading-tight">
          {isAr ? 'حول موسوعة شيخ الإسلام ابن تيمية' : 'About Ibn Taymiyyah Digital Encyclopedia'}
        </h1>

        <p className="font-scholarly text-base sm:text-lg text-[#4A443B] leading-relaxed text-justify">
          {isAr
            ? 'مشروع رقمي علمي دولي غير ربحي يهدف إلى جمع وتوثيق ورقمنة التراث العلمي والفكري لشيخ الإسلام أحمد بن عبد الحليم بن عبد السلام ابن تيمية رحمه الله، مع تقديم أدوات متقدمة للتحقيق والاستدلال خالية تماماً من اختلاق النصوص أو تزييف الإحالات.'
            : 'An international academic open-source platform dedicated to preserving, indexing, and researching the canonical intellectual heritage of Taqi al-Din Ahmad ibn Taymiyyah with zero hallucination guarantee.'}
        </p>
      </div>

      {/* Core Scholarly Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#EFEADE] text-[#422D1F] flex items-center justify-center font-bold">
            <Scale className="w-5 h-5 text-[#9B783E]" />
          </div>
          <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
            {isAr ? 'الصرامة التوثيقية التامة' : 'Zero Fabrication Policy'}
          </h3>
          <p className="text-xs text-[#555] leading-relaxed">
            {isAr
              ? 'يُحظر في خوارزميات النظام والمساعد الذكي اختلاق أي استشهاد، أو توليد أرقام صفحات وهمية.'
              : 'Strict algorithmic guardrails prevent inventing citations or hallucinatory volume/page references.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#EFEADE] text-[#422D1F] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5 text-[#9B783E]" />
          </div>
          <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
            {isAr ? 'اعتماد الطبعات المحققة' : 'Critical Editions'}
          </h3>
          <p className="text-xs text-[#555] leading-relaxed">
            {isAr
              ? 'تعتمد الموسوعة الطبعات الموثقة (مجمع الملك فهد بتحقيق ابن قاسم، ومشاريع تحقيق آثار شيخ الإسلام).'
              : 'Attributed directly to authenticated editions (King Fahd Complex, Ibn Qasim, Dar Alam al-Fawaid).'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#EFEADE] text-[#422D1F] flex items-center justify-center font-bold">
            <GitBranch className="w-5 h-5 text-[#9B783E]" />
          </div>
          <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
            {isAr ? 'المعرفة المفتوحة (Open Source)' : 'Open Knowledge'}
          </h3>
          <p className="text-xs text-[#555] leading-relaxed">
            {isAr
              ? 'الكود المصدري وقاعدة البيانات مفتوحة للباحثين والمطورين لخدمة تراث الأمة وحفظ نصوصه.'
              : 'Built under MIT Open Source licensing to foster collaborative global academic scholarship.'}
          </p>
        </div>
      </div>

      {/* Canonical Editions Catalog */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-4 shadow-2xs">
        <h3 className="font-scholarly font-bold text-xl text-[#2C1D13] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{isAr ? 'أصول الطبعات المحققة المعتمدة في الموسوعة:' : 'Approved Critical Editions:'}</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-[#4A443B]">
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#D8D3C5]">
            <span className="font-bold text-[#422D1F] font-scholarly">
              مجموع الفتاوى (37 مجلداً):
            </span>{' '}
            جمع وترتيب الشيخ عبد الرحمن بن محمد بن قاسم وابنه محمد، طبعة مجمع الملك فهد لطباعة المصحف الشريف بالمدينة النبوية (1425 هـ / 2004 م).
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#D8D3C5]">
            <span className="font-bold text-[#422D1F] font-scholarly">
              درء تعارض العقل والنقل (11 مجلداً):
            </span>{' '}
            تحقيق الدكتور محمد رشاد سالم، جامعة الإمام محمد بن سعود الإسلامية (1411 هـ / 1991 م).
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#D8D3C5]">
            <span className="font-bold text-[#422D1F] font-scholarly">
              منهاج السنة النبوية (9 مجلدات):
            </span>{' '}
            تحقيق الدكتور محمد رشاد سالم، جامعة الإمام محمد بن سعود الإسلامية (1406 هـ / 1986 م).
          </div>
          <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#D8D3C5]">
            <span className="font-bold text-[#422D1F] font-scholarly">
              جامع المسائل ومجموع آثار شيخ الإسلام:
            </span>{' '}
            تحقيق الشيخ محمد عزير شمس وإشراف الشيخ بكر بن عبد الله أبو زيد، دار عالم الفوائد.
          </div>
        </div>
      </div>
    </div>
  );
};
