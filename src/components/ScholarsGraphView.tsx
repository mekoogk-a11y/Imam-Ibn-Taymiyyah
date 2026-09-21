import React, { useState } from 'react';
import {
  Users,
  Share2,
  BookOpen,
  UserCheck,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Language, ScholarRecord, KnowledgeNode, KnowledgeEdge } from '../types';

interface ScholarsGraphViewProps {
  language: Language;
  scholars: ScholarRecord[];
  graphNodes: KnowledgeNode[];
  graphEdges: KnowledgeEdge[];
  onOpenBookInReader?: (bookId: string) => void;
}

export const ScholarsGraphView: React.FC<ScholarsGraphViewProps> = ({
  language,
  scholars,
  graphNodes,
  graphEdges,
  onOpenBookInReader,
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'scholars' | 'graph'>('scholars');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(graphNodes[0] || null);

  const filteredScholars = scholars.filter((s) => {
    if (roleFilter !== 'ALL' && s.role !== roleFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      return (
        s.nameAr.includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.bioAr.includes(q)
      );
    }
    return true;
  });

  const nodeColorMap: Record<string, { fill: string; stroke: string; label: string }> = {
    BOOK: { fill: '#3B5998', stroke: '#2A4374', label: isAr ? 'مصنف / كتاب' : 'Book' },
    TOPIC: { fill: '#9B783E', stroke: '#7A5835', label: isAr ? 'موضوع / باب' : 'Topic' },
    SCHOLAR: { fill: '#2E7D32', stroke: '#1B5E20', label: isAr ? 'عالم / تلميذ' : 'Scholar' },
    EVENT: { fill: '#C62828', stroke: '#8E0000', label: isAr ? 'حدث تاريخي' : 'Event' },
    LOCATION: { fill: '#5D4037', stroke: '#3E2723', label: isAr ? 'موقع جغرافي' : 'Location' },
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-scholarly font-bold text-2xl sm:text-3xl text-[#2C1D13]">
              {isAr ? 'الصلات العلمية وشبكة المعرفة التيمية' : 'Scholarly Network & Knowledge Graph'}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A7365] mt-1">
              {isAr
                ? 'فهرس الشيوخ والتلاميذ والمؤرخين، مع شبكة بصرية تفاعلية تربط المصنفات بالأعلام والموضوعات'
                : 'Catalog of teachers, disciples, and historians paired with an interactive visual knowledge network'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('scholars')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'scholars'
                  ? 'bg-[#422D1F] text-[#FFFDF7]'
                  : 'bg-[#F7F4EC] text-[#5A3E2B] border border-[#D8D3C5] hover:bg-[#EFEADE]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isAr ? 'سجل الأعلام والشيوخ' : 'Scholars Catalog'}</span>
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'graph'
                  ? 'bg-[#422D1F] text-[#FFFDF7]'
                  : 'bg-[#F7F4EC] text-[#5A3E2B] border border-[#D8D3C5] hover:bg-[#EFEADE]'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>{isAr ? 'شبكة المعرفة البصرية' : 'Visual Knowledge Graph'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Scholars Catalog */}
      {activeTab === 'scholars' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#D8D3C5]">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={isAr ? 'ابحث باسم العالم، التلميذ، أو الشيخ...' : 'Search scholars by name...'}
                className="w-full text-xs sm:text-sm h-9 pl-9 pr-9 bg-[#F7F4EC] border border-[#D8D3C5] rounded-md focus:outline-hidden focus:border-[#7A5835]"
              />
              <Search className={`w-4 h-4 text-[#7A7365] absolute top-2.5 ${isAr ? 'left-3' : 'right-3'}`} />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', nameAr: 'كافة الأعلام' },
                { id: 'STUDENT', nameAr: 'تلاميذ ابن تيمية' },
                { id: 'TEACHER', nameAr: 'شيوخ ابن تيمية' },
                { id: 'BIOGRAPHER', nameAr: 'المؤرخون وكتاب السير' },
                { id: 'CONTEMPORARY', nameAr: 'المعاصرون' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRoleFilter(r.id)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                    roleFilter === r.id
                      ? 'bg-[#422D1F] text-[#FFFDF7]'
                      : 'bg-[#F7F4EC] text-[#5A3E2B] border border-[#D8D3C5] hover:bg-[#EFEADE]'
                  }`}
                >
                  {r.nameAr}
                </button>
              ))}
            </div>
          </div>

          {/* Scholars Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredScholars.map((scholar) => (
              <div
                key={scholar.id}
                className="p-6 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] hover:border-[#9B783E] transition-all space-y-4 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-[#EFEADE] pb-3">
                  <div className="space-y-0.5">
                    <h3 className="font-scholarly font-bold text-lg text-[#2C1D13]">
                      {scholar.nameAr}
                    </h3>
                    <div className="text-xs text-[#7A7365] font-brand tracking-wider">
                      {scholar.nameEn}
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold bg-[#EFEADE] text-[#422D1F] px-2.5 py-1 rounded">
                    ت {scholar.deathYearHijri} هـ
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold font-scholarly text-[#422D1F]">
                    {isAr ? 'طبيعة الصلة بشيخ الإسلام:' : 'Relationship:'}
                  </div>
                  <p className="text-xs sm:text-sm text-[#555] leading-relaxed bg-[#F7F4EC] p-3 rounded-lg border border-[#D8D3C5]">
                    {scholar.relationshipDetailsAr}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold font-scholarly text-[#422D1F]">
                    {isAr ? 'الترجمة والتعريف الموجز:' : 'Biography:'}
                  </div>
                  <p className="font-scholarly text-sm text-[#333] leading-relaxed text-justify">
                    {scholar.bioAr}
                  </p>
                </div>

                <div className="border-t border-[#EFEADE] pt-3 flex items-center justify-between text-xs text-[#7A7365]">
                  <span className="font-medium text-[#422D1F]">
                    {scholar.role === 'STUDENT'
                      ? 'تلميذ وملازم لشيخ الإسلام'
                      : scholar.role === 'TEACHER'
                      ? 'من كبار شيوخ الإسناد'
                      : 'مؤرخ وموثق للسيرة'}
                  </span>
                  <span className="text-[11px] font-mono">
                    {scholar.birthYearHijri ? `${scholar.birthYearHijri} - ${scholar.deathYearHijri} هـ` : `ت ${scholar.deathYearHijri} هـ`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Visual Knowledge Graph */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#D8D3C5]">
            <div className="flex flex-wrap items-center gap-4 text-xs font-scholarly">
              <span className="font-bold text-[#422D1F]">{isAr ? 'دليل العقد والعلاقات:' : 'Legend:'}</span>
              {Object.entries(nodeColorMap).map(([type, cfg]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cfg.fill, borderColor: cfg.stroke }}
                  />
                  <span>{cfg.label}</span>
                </div>
              ))}
            </div>

            <span className="text-[11px] text-[#7A7365]">
              {isAr ? 'اضغط على أي عقدة لاستعراض تفاصيلها وعلاقاتها' : 'Click any node to view details'}
            </span>
          </div>

          {/* Interactive Graph Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SVG Visual Canvas */}
            <div className="lg:col-span-2 rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-4 h-[520px] relative overflow-hidden flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 700 480" className="w-full h-full">
                {/* Connections (Edges) */}
                {graphEdges.map((edge, idx) => {
                  const srcIndex = graphNodes.findIndex((n) => n.id === edge.source);
                  const tgtIndex = graphNodes.findIndex((n) => n.id === edge.target);
                  const src = graphNodes[srcIndex];
                  const tgt = graphNodes[tgtIndex];
                  if (!src || !tgt) return null;

                  const getPos = (node: KnowledgeNode, index: number) => {
                    if (node.x !== undefined && node.y !== undefined) {
                      return { x: node.x, y: node.y };
                    }
                    if (node.id === 'node-ibn-taymiyyah') {
                      return { x: 350, y: 240 };
                    }
                    const total = graphNodes.length;
                    const angle = (index / (total || 1)) * 2 * Math.PI;
                    const radius = node.type === 'BOOK' ? 170 : node.type === 'SCHOLAR' ? 130 : 190;
                    return {
                      x: 350 + Math.cos(angle) * radius,
                      y: 240 + Math.sin(angle) * radius,
                    };
                  };

                  const srcPos = getPos(src, srcIndex);
                  const tgtPos = getPos(tgt, tgtIndex);

                  return (
                    <g key={idx} className="transition-opacity hover:opacity-100">
                      <line
                        x1={srcPos.x}
                        y1={srcPos.y}
                        x2={tgtPos.x}
                        y2={tgtPos.y}
                        stroke="#D8D3C5"
                        strokeWidth="2"
                        strokeDasharray={edge.type === 'REFERS_TO' ? '4 4' : undefined}
                      />
                      {/* Edge Label */}
                      <text
                        x={(srcPos.x + tgtPos.x) / 2}
                        y={(srcPos.y + tgtPos.y) / 2 - 5}
                        fontSize="9"
                        fill="#8B7B69"
                        textAnchor="middle"
                        className="font-scholarly select-none"
                      >
                        {edge.labelAr}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {graphNodes.map((node, index) => {
                  const cfg = nodeColorMap[node.type] || { fill: '#666', stroke: '#444' };
                  const isSelected = selectedNode?.id === node.id;
                  const radius = node.type === 'BOOK' ? 24 : node.type === 'SCHOLAR' ? 22 : 18;

                  const pos =
                    node.x !== undefined && node.y !== undefined
                      ? { x: node.x, y: node.y }
                      : node.id === 'node-ibn-taymiyyah'
                      ? { x: 350, y: 240 }
                      : {
                          x: 350 + Math.cos((index / (graphNodes.length || 1)) * 2 * Math.PI) * (node.type === 'BOOK' ? 170 : 130),
                          y: 240 + Math.sin((index / (graphNodes.length || 1)) * 2 * Math.PI) * (node.type === 'BOOK' ? 170 : 130),
                        };

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer group"
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={radius}
                        fill={cfg.fill}
                        stroke={isSelected ? '#D4AF37' : cfg.stroke}
                        strokeWidth={isSelected ? 4 : 2}
                        className="transition-transform group-hover:scale-110"
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        fontSize="10"
                        fontWeight="bold"
                        fill="#FFFDF7"
                        textAnchor="middle"
                        className="select-none font-scholarly pointer-events-none"
                      >
                        {node.labelAr.slice(0, 8)}..
                      </text>
                      <title>{node.labelAr}</title>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Node Details Card */}
            <div className="rounded-2xl bg-[#FFFDF7] border border-[#D8D3C5] p-6 space-y-4 shadow-2xs flex flex-col justify-between">
              {selectedNode ? (
                <div className="space-y-4">
                  <div className="space-y-1 border-b border-[#EFEADE] pb-3">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#EFEADE] text-[#422D1F]">
                      {nodeColorMap[selectedNode.type]?.label}
                    </span>
                    <h3 className="font-scholarly font-bold text-xl text-[#2C1D13]">
                      {selectedNode.labelAr}
                    </h3>
                  </div>

                  <p className="font-scholarly text-sm text-[#4A443B] leading-relaxed">
                    {selectedNode.descriptionAr}
                  </p>

                  {/* Connected Edges */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold font-scholarly text-[#422D1F]">
                      {isAr ? 'الصلات والروابط المباشرة:' : 'Direct Connections:'}
                    </div>
                    <div className="space-y-1.5">
                      {graphEdges
                        .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                        .map((e, i) => {
                          const otherId = e.source === selectedNode.id ? e.target : e.source;
                          const otherNode = graphNodes.find((n) => n.id === otherId);
                          return (
                            <div
                              key={i}
                              onClick={() => otherNode && setSelectedNode(otherNode)}
                              className="cursor-pointer p-2 rounded-lg bg-[#F7F4EC] hover:bg-[#EFEADE] border border-[#D8D3C5] text-xs flex items-center justify-between transition-colors"
                            >
                              <span className="font-scholarly font-medium text-[#2C1D13]">
                                {otherNode?.labelAr}
                              </span>
                              <span className="text-[10px] text-[#8B7B69] font-mono">
                                {e.labelAr}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#7A7365] text-xs">
                  {isAr ? 'اضغط على أي عقدة لاستعراض تفاصيلها' : 'Select a node in the graph'}
                </div>
              )}

              {selectedNode?.type === 'BOOK' && onOpenBookInReader && (
                <button
                  onClick={() => onOpenBookInReader(selectedNode.id)}
                  className="w-full mt-4 py-2.5 rounded-xl bg-[#422D1F] hover:bg-[#2C1D13] text-[#FFFDF7] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isAr ? 'فتح الكتاب في القارئ' : 'Open Book in Reader'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
