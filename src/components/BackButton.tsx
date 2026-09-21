import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, ActiveNavTab } from '../types';

interface BackButtonProps {
  language: Language;
  onBack: () => void;
  label?: string;
  fallbackTab?: ActiveNavTab;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  language,
  onBack,
  label,
  className = '',
}) => {
  const isAr = language === 'ar';
  const defaultLabel = isAr ? 'الرجوع' : 'Back';
  const Icon = isAr ? ArrowRight : ArrowLeft;

  return (
    <button
      onClick={onBack}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8D3C5] bg-[#FFFDF7] text-xs font-bold font-scholarly text-[#422D1F] hover:bg-[#EFEADE] hover:border-[#9B783E] transition-all shadow-2xs group ${className}`}
      title={label || defaultLabel}
    >
      <Icon className="w-3.5 h-3.5 text-[#9B783E] group-hover:-translate-x-0.5 transition-transform" />
      <span>{label || defaultLabel}</span>
    </button>
  );
};
