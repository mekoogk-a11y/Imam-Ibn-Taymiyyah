import React, { useState } from 'react';
import { CheckSquare, Plus, CheckCircle2, Clock, AlertTriangle, Shield } from 'lucide-react';
import { Language } from '../types';

interface TaskItem {
  id: string;
  title: string;
  titleAr: string;
  caseId: string;
  assignedTo: string;
  dueDate: string;
  priority: 'High' | 'Normal' | 'Low';
  completed: boolean;
}

interface TasksViewProps {
  language: Language;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'TSK-01',
    title: 'Cross-verify Sentinel-2 multispectral pass with ground photos of Atbara Bridge',
    titleAr: 'تقاطع مسار القمر الصناعي سينتينل-2 مع الصور الميدانية لجسر عطبرة',
    caseId: 'BAS-2026-0001',
    assignedTo: 'Tariq Al-Mansoor',
    dueDate: '2026-09-21',
    priority: 'High',
    completed: true,
  },
  {
    id: 'TSK-02',
    title: 'Resolve contradiction between Chamber of Commerce and Transport Union logs',
    titleAr: 'حسم التناقض القائم بين تقرير الغرفة التجارية وسجلات نقابة الشاحنات',
    caseId: 'BAS-2026-0001',
    assignedTo: 'Tariq Al-Mansoor',
    dueDate: '2026-09-22',
    priority: 'High',
    completed: false,
  },
  {
    id: 'TSK-03',
    title: 'Acquire official bill of lading cargo manifest for bulk carrier MV Al-Baraka',
    titleAr: 'الحصول على بوليصة الشحن الرسمية ومانيفست الحمولة لناقلة الصب إم في البركة',
    caseId: 'BAS-2026-0001',
    assignedTo: 'Tariq Al-Mansoor',
    dueDate: '2026-09-23',
    priority: 'Normal',
    completed: false,
  },
];

export const TasksView: React.FC<TasksViewProps> = ({ language }) => {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-[#D8D3C5] bg-[#FFFDF7] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#111111] text-[#FFFDF7] rounded">
              {language === 'ar' ? 'مهام التحقق الاستخباراتي' : 'ANALYTICAL OSINT ACTION ITEMS'}
            </span>
            <span className="text-xs text-[#5E5A50] font-mono-num">
              LEAD ANALYST DISPATCH
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#090909]">
            {language === 'ar' ? 'إدارة مهام التدقيق والجمع الميداني' : 'Investigative & Corroboration Tasks'}
          </h1>
          <p className="text-xs text-[#5E5A50] mt-1">
            {language === 'ar'
              ? 'متابعة متطلبات الجمع المفتوح، تدقيق الأدلة، وجدولة مهام التحقق لكل قضية.'
              : 'Actionable verification items, collection requirements, and corroboration checklists.'}
          </p>
        </div>
      </div>

      {/* Task List */}
      <div className="p-5 rounded-xl border border-[#D8D3C5] bg-[#FFFDF7] space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              task.completed
                ? 'bg-[#F7F4EC]/60 border-[#D8D3C5]/60 opacity-70'
                : 'bg-[#FFFDF7] border-[#D8D3C5] hover:border-[#111111]'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="mt-1 w-4 h-4 rounded accent-[#111111] cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono-num text-[11px] font-bold text-[#111111]">
                    {task.id}
                  </span>
                  <span className="text-[10px] text-[#5E5A50] font-mono-num">
                    CASE: {task.caseId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                      task.priority === 'High'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-[#EFEADE] text-[#111111]'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <h3
                  className={`text-xs font-bold ${
                    task.completed ? 'line-through text-[#5E5A50]' : 'text-[#090909]'
                  }`}
                >
                  {language === 'ar' ? task.titleAr : task.title}
                </h3>
              </div>
            </div>

            <div className="text-end text-[11px] text-[#5E5A50] shrink-0 font-mono-num">
              <span>{language === 'ar' ? 'الاستحقاق:' : 'Due:'} {task.dueDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
