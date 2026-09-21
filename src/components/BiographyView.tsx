import React, { useState } from 'react';
import {
  Calendar,
  UserCheck,
  Quote,
  CheckCircle2,
  MapPin,
  Clock,
  BookOpen,
  Shield,
  Search,
  Filter,
} from 'lucide-react';
import { Language, BiographyStage, TimelineEvent, ScholarProfile } from '../types';

interface BiographyViewProps {
  language: Language;
  profile: ScholarProfile;
  stages: BiographyStage[];
  timeline: TimelineEvent[];
  mode?: 'biography' | 'timeline';
}

export const BiographyView: React.FC<BiographyViewProps> = ({
  language,
  profile,
  stages,
  timeline,
  mode = 'biography',
}) => {
  const isAr = language === 'ar';
  const [activeSubTab, setActiveSubTab] = useState<'biography' | 'timeline'>(mode);
  const [timelineFilter, setTimelineFilter] = useState<string>('ALL');

  const filteredTimeline = timeline.filter((evt) => {
    if (timelineFilter !== 'ALL' && evt.category !== timelineFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Profile Card */}
      <section className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-10 space-y-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEADE] text-[#422D1F] text-xs font-bold font-scholarly">
              <span>{profile.titleHonorificAr}</span>
            </div>
            <h1 className="font-scholarly font-bold text-3xl sm:text-4xl text-[#2C1D13] leading-tight">
              {profile.fullNameAr}
            </h1>
            <div className="text-sm text-[#7A7365] font-brand tracking-wider">
              {profile.fullNameEn}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] space-y-2 text-xs text-[#5A3E2B] md:min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="font-bold font-scholarly">{isAr ? 'المولد:' : 'Birth:'}</span>
              <span className="font-mono">
                {profile.birthHijri} هـ ({profile.birthGregorian} م) — {profile.birthPlaceAr}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold font-scholarly">{isAr ? 'الوفاة:' : 'Death:'}</span>
              <span className="font-mono">
                {profile.deathHijri} هـ ({profile.deathGregorian} م) — {profile.deathPlaceAr}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold font-scholarly">{isAr ? 'المدفن:' : 'Burial:'}</span>
              <span>{profile.burialPlaceAr}</span>
            </div>
          </div>
        </div>

        {/* Contemporary Historians Testimonies Grid */}
        <div className="space-y-3 pt-4 border-t border-[#EFEADE]">
          <h3 className="font-scholarly font-bold text-base text-[#422D1F] flex items-center gap-2">
            <Quote className="w-4 h-4 text-[#9B783E]" />
            <span>{isAr ? 'شهادات كبار أئمة ومؤرخي عصره الموثقة:' : 'Contemporary Historian Testimonies:'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(profile.contemporaryTestimonies || [
              {
                scholarNameAr: 'الحافظ الذهبي (ت 748 هـ)',
                sourceBookAr: 'تذكرة الحفاظ ج 4 ص 1496',
                quoteAr: 'هو شيخنا الإمام، بارع في علوم الحديث، فقيه النفس، مفسر مقرئ، أصولي نحوي، بحر العلوم، أحد الأعلام في الشجاعة والجهاد والكرم والزهد.'
              },
              {
                scholarNameAr: 'الحافظ ابن كثير (ت 774 هـ)',
                sourceBookAr: 'البداية والنهاية ج 14 ص 135',
                quoteAr: 'صار إماماً يُشار إليه بالبنان، فصيح اللسان، واسع البيان، لا يثبت أحد لمناظرته ولا يجادله إلا أسكته بالبرهان والنقل الصحيح.'
              }
            ]).map((testimony, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F7F4EC] border border-[#D8D3C5] space-y-2 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between font-bold text-[#422D1F]">
                  <span className="font-scholarly text-sm">{testimony.scholarNameAr}</span>
                  <span className="text-[11px] font-mono text-[#7A7365]">{testimony.sourceBookAr}</span>
                </div>
                <blockquote className="font-scholarly text-sm text-[#1A1A1A] leading-relaxed">
                  «{testimony.quoteAr}»
                </blockquote>
              </div>
            ))}
          </div>
        </div>

        {/* View Switcher Tabs (Biography Stages vs Interactive Timeline) */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setActiveSubTab('biography')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'biography'
                ? 'bg-[#422D1F] text-[#FFFDF7]'
                : 'bg-[#EFEADE] text-[#5A3E2B] hover:bg-[#D8D3C5]'
            }`}
          >
            {isAr ? 'فصول ومراحل السيرة العلمية' : 'Biography Stages'}
          </button>
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'timeline'
                ? 'bg-[#422D1F] text-[#FFFDF7]'
                : 'bg-[#EFEADE] text-[#5A3E2B] hover:bg-[#D8D3C5]'
            }`}
          >
            {isAr ? 'الخط الزمني التاريخي (661 - 728 هـ)' : 'Interactive Timeline (661-728 AH)'}
          </button>
        </div>
      </section>

      {/* SubTab 1: Biography Stages */}
      {activeSubTab === 'biography' && (
        <div className="space-y-6">
          {stages.map((stage) => (
            <article
              key={stage.id}
              className="p-6 sm:p-8 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] space-y-4 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFEADE] pb-3 text-xs text-[#7A7365]">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-[#EFEADE] text-[#422D1F] px-2.5 py-0.5 rounded font-bold">
                    {stage.periodHijri}
                  </span>
                  <span className="font-bold text-sm text-[#422D1F] font-scholarly">
                    {stage.titleAr}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#888]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{stage.locationAr}</span>
                </div>
              </div>

              <div className="prose-scholarly text-base sm:text-lg text-[#1A1A1A] leading-loose text-justify">
                {stage.contentAr || stage.fullTextAr}
              </div>

              {/* Primary Sources Citations */}
              <div className="border-t border-[#EFEADE] pt-3 flex flex-wrap items-center gap-2 text-xs text-[#7A7365]">
                <span className="font-bold font-scholarly text-[#422D1F]">
                  {isAr ? 'المصادر التوثيقية لهذا الفصل:' : 'Primary Historical Sources:'}
                </span>
                {(stage.primarySources || stage.sources || []).map((src: string, i: number) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#F7F4EC] border border-[#D8D3C5]"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* SubTab 2: Interactive Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          {/* Timeline Filter */}
          <div className="flex flex-wrap items-center gap-2 bg-[#FFFDF7] p-3 rounded-xl border border-[#D8D3C5]">
            <span className="text-xs text-[#7A7365] font-scholarly font-bold">
              {isAr ? 'تصفية الوقائع:' : 'Filter events:'}
            </span>
            {[
              { id: 'ALL', nameAr: 'كافة الوقائع' },
              { id: 'HISTORICAL', nameAr: 'المحطات التاريخية والمعارك' },
              { id: 'WRITING', nameAr: 'التأليف والمصنفات' },
              { id: 'DEBATE', nameAr: 'المناظرات والمجالس' },
              { id: 'IMPRISONMENT', nameAr: 'المحن والاعتقال' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTimelineFilter(f.id)}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${
                  timelineFilter === f.id
                    ? 'bg-[#422D1F] text-[#FFFDF7] font-bold'
                    : 'bg-[#F7F4EC] text-[#5A3E2B] hover:bg-[#EFEADE]'
                }`}
              >
                {f.nameAr}
              </button>
            ))}
          </div>

          {/* Timeline Vertical Track */}
          <div className="relative border-r-2 border-[#D8D3C5] mr-4 sm:mr-8 space-y-8 pr-6 sm:pr-10 py-2">
            {filteredTimeline.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Node Bullet */}
                <div className="absolute -right-[31px] sm:-right-[47px] top-1.5 w-4 h-4 rounded-full bg-[#9B783E] border-4 border-[#FFFDF7] shadow-xs group-hover:scale-125 transition-transform" />

                {/* Event Card */}
                <div className="p-5 rounded-xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-2.5 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFEADE] pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#422D1F] bg-[#EFEADE] px-2 py-0.5 rounded">
                        {evt.yearHijri} هـ ({evt.yearGregorian} م)
                      </span>
                      <span className="font-scholarly font-bold text-base text-[#2C1D13]">
                        {evt.titleAr}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7A7365] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{evt.locationAr}</span>
                    </span>
                  </div>

                  <p className="font-scholarly text-sm sm:text-base text-[#333] leading-relaxed">
                    {evt.descriptionAr}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#7A7365]">
                    <span className="font-bold">{isAr ? 'المصادر:' : 'Sources:'}</span>
                    {evt.primarySources.map((s, i) => (
                      <span key={i} className="bg-[#F7F4EC] px-1.5 py-0.5 rounded border border-[#D8D3C5]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
