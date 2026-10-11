import React from 'react';
import {
  Sparkles,
  Video,
  TrendingUp,
  FolderOpen,
  Library,
  Download,
  KeyRound,
  Settings,
  Layers
} from 'lucide-react';
import { PrimaryMenu, UtilityModal } from '../../types';

interface SidebarProps {
  activeMenu: PrimaryMenu;
  onSelectMenu: (menu: PrimaryMenu) => void;
  onOpenUtility: (utility: UtilityModal) => void;
  savedProjectsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  onOpenUtility,
  savedProjectsCount
}) => {
  return (
    <aside className="w-64 bg-[#0e1117] border-r border-[#1e2533] flex flex-col justify-between shrink-0 select-none">
      {/* Upper Area: Primary Workspace Menus */}
      <div className="p-3">
        {/* Workspace Brand / Header */}
        <div className="px-3 py-3 mb-3 flex items-center gap-2.5 border-b border-[#1a2230]">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight leading-tight">
              Khmer AI Studio
            </h1>
            <p className="text-[11px] text-slate-400 font-khmer">
              ប្រព័ន្ធផលិតវីដេអូកម្ពុជា
            </p>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-3 mb-2 text-[10px] font-semibold text-slate-400 tracking-wider">
          PRIMARY WORKSPACE
        </div>

        {/* 3 PRIMARY MENUS */}
        <nav className="space-y-1">
          {/* Menu 1: TOPIC GENERATOR */}
          <button
            onClick={() => onSelectMenu('topics')}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeMenu === 'topics'
                ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-medium'
                : 'text-slate-300 hover:text-slate-100 hover:bg-[#151a24] border border-transparent'
            }`}
          >
            <Sparkles className={`w-4 h-4 mt-0.5 shrink-0 ${activeMenu === 'topics' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs font-semibold">1. TOPIC GENERATOR</div>
              <div className="text-[11px] text-slate-400 font-khmer leading-tight mt-0.5">
                បង្កើត ១០០ ប្រធានបទ
              </div>
            </div>
          </button>

          {/* Menu 2: AI CONTENT PRODUCTION */}
          <button
            onClick={() => onSelectMenu('production')}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeMenu === 'production'
                ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-medium'
                : 'text-slate-300 hover:text-slate-100 hover:bg-[#151a24] border border-transparent'
            }`}
          >
            <Video className={`w-4 h-4 mt-0.5 shrink-0 ${activeMenu === 'production' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs font-semibold">2. CONTENT PRODUCTION</div>
              <div className="text-[11px] text-slate-400 font-khmer leading-tight mt-0.5">
                ស្គ្រីបខ្មែរ & Google Flow
              </div>
            </div>
          </button>

          {/* Menu 3: VIRAL CONTENT RESEARCH */}
          <button
            onClick={() => onSelectMenu('research')}
            className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeMenu === 'research'
                ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-medium'
                : 'text-slate-300 hover:text-slate-100 hover:bg-[#151a24] border border-transparent'
            }`}
          >
            <TrendingUp className={`w-4 h-4 mt-0.5 shrink-0 ${activeMenu === 'research' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs font-semibold">3. VIRAL RESEARCH</div>
              <div className="text-[11px] text-slate-400 font-khmer leading-tight mt-0.5">
                ស្រាវជ្រាវ & កែច្នៃមាតិកា
              </div>
            </div>
          </button>
        </nav>
      </div>

      {/* Lower Area: Supporting Utilities (as requested) */}
      <div className="p-3 border-t border-[#1a2230] space-y-1">
        <div className="px-3 mb-1 text-[10px] font-semibold text-slate-400 tracking-wider">
          UTILITIES & STORAGE
        </div>

        <button
          onClick={() => onOpenUtility('saved-projects')}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-slate-300 hover:text-slate-100 hover:bg-[#151a24] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-khmer">គម្រោងដែលបានរក្សាទុក</span>
          </div>
          <span className="text-[11px] font-mono-tabular text-slate-400">
            {savedProjectsCount}
          </span>
        </button>

        <button
          onClick={() => onOpenUtility('content-library')}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-slate-300 hover:text-slate-100 hover:bg-[#151a24] transition-colors"
        >
          <Library className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-khmer">បណ្ណាល័យ B-Roll & Hooks</span>
        </button>

        <button
          onClick={() => onOpenUtility('export-history')}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-slate-300 hover:text-slate-100 hover:bg-[#151a24] transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-khmer">មជ្ឈមណ្ឌលទាញយក (Export)</span>
        </button>

        <button
          onClick={() => onOpenUtility('api-connections')}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-slate-300 hover:text-slate-100 hover:bg-[#151a24] transition-colors"
        >
          <KeyRound className="w-3.5 h-3.5 text-slate-400" />
          <span>API & Claude / Gemini</span>
        </button>

        <button
          onClick={() => onOpenUtility('settings')}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-slate-300 hover:text-slate-100 hover:bg-[#151a24] transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-khmer">ការកំណត់កម្មវិធី (Settings)</span>
        </button>
      </div>
    </aside>
  );
};
