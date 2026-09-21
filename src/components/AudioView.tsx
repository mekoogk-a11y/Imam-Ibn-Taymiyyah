import React, { useState } from 'react';
import { Headphones, Play, Pause, Clock, User, CheckCircle2 } from 'lucide-react';
import { Language, AudioRecord } from '../types';

interface AudioViewProps {
  language: Language;
  audioItems: AudioRecord[];
}

export const AudioView: React.FC<AudioViewProps> = ({
  language,
  audioItems,
}) => {
  const isAr = language === 'ar';
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-scholarly font-bold text-2xl sm:text-3xl text-[#2C1D13]">
              {isAr ? 'المكتبة الصوتية والشروح المقروءة' : 'Scholarly Audio Library'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7365] mt-1">
              {isAr
                ? 'تسجيلات صوتية وقراءات محققة لمتون ورسائل شيخ الإسلام ابن تيمية وشروح كبار المحققين'
                : 'Verified audio recitations of Ibn Taymiyyah treatises and classical commentary sessions'}
            </p>
          </div>
          <span className="text-xs font-mono bg-[#EFEADE] text-[#422D1F] px-3 py-1.5 rounded-lg font-bold">
            {audioItems.length} {isAr ? 'تسجيلات صوتية' : 'Recordings'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {audioItems.map((item) => {
          const isPlaying = playingId === item.id;
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-4 shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#EFEADE] pb-2 text-xs text-[#7A7365]">
                  <div className="flex items-center gap-1.5 font-bold font-scholarly text-[#422D1F]">
                    <User className="w-3.5 h-3.5" />
                    <span>{item.scholarAr}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{item.duration}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-scholarly font-bold text-xl text-[#2C1D13] leading-snug">
                    {item.titleAr}
                  </h3>
                  <div className="text-xs text-[#7A7365] font-brand mt-0.5">{item.titleEn}</div>
                </div>

                <p className="font-scholarly text-xs text-[#555] leading-relaxed">
                  {item.descriptionAr}
                </p>
              </div>

              {/* Audio Player Control Widget */}
              <div className="p-3 bg-[#F7F4EC] rounded-xl border border-[#D8D3C5] flex items-center justify-between gap-3">
                <button
                  onClick={() => togglePlay(item.id)}
                  className="w-10 h-10 rounded-full bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] flex items-center justify-center transition-colors shrink-0 shadow-xs"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="h-1.5 w-full bg-[#D8D3C5] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-[#9B783E] rounded-full transition-all duration-300 ${
                        isPlaying ? 'w-2/5 animate-pulse' : 'w-0'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#7A7365]">
                    <span>{isPlaying ? '08:45' : '00:00'}</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
