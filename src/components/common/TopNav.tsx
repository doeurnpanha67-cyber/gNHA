import React from 'react';
import { PlusCircle, Save } from 'lucide-react';
import { PrimaryMenu } from '../../types';

interface TopNavProps {
  activeMenu: PrimaryMenu;
  projectName: string;
  onNewProject: () => void;
  onSaveCurrent: () => void;
  hasUnsavedChanges: boolean;
  onSearchInput: (term: string) => void;
  searchTerm: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeMenu,
  projectName,
  onNewProject,
  onSaveCurrent,
  hasUnsavedChanges,
  onSearchInput,
  searchTerm
}) => {
  const getMenuLabel = () => {
    switch (activeMenu) {
      case 'topics':
        return '1. Topic Generator (១០០ គំនិតមាតិកា)';
      case 'production':
        return '2. AI Content Production (ស្គ្រីបខ្មែរ & Google Flow)';
      case 'research':
        return '3. Viral Content Research (ការស្រាវជ្រាវ)';
      default:
        return 'Workspace';
    }
  };

  return (
    <header className="h-14 bg-[#0c0e13] border-b border-[#1c222e] flex items-center justify-between px-6 gap-8 shrink-0">
      {/* Zone 1: Breadcrumb & Current Context (Single-line wordmark/title) */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xs font-semibold text-indigo-400 whitespace-nowrap shrink-0">
          {getMenuLabel()}
        </span>
        <span className="text-slate-700 shrink-0">/</span>
        <span className="text-xs text-slate-300 font-khmer truncate max-w-sm">
          {projectName || 'គម្រោងថ្មី (New Draft)'}
        </span>
        {hasUnsavedChanges && (
          <span className="text-[10px] text-amber-400 font-mono-tabular shrink-0">
            [មិនទាន់រក្សាទុក]
          </span>
        )}
      </div>

      {/* Zone 2: Search input for active workspace view */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchInput(e.target.value)}
            placeholder="ស្វែងរកប្រធានបទ ឬពាក្យគន្លឹះ (Search topics or keywords)..."
            className="w-full bg-[#131720] border border-[#232b3a] focus:border-indigo-500 rounded-lg px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors font-khmer"
          />
        </div>
      </div>

      {/* Zone 3: Primary Actions (Save & New Project) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onSaveCurrent}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#171d27] hover:bg-[#202836] border border-[#263142] rounded-lg transition-colors whitespace-nowrap"
          title="Save Current Project"
        >
          <Save className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-khmer">រក្សាទុក</span>
        </button>

        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          title="Start Fresh Production Project"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="font-khmer">គម្រោងថ្មី</span>
        </button>
      </div>
    </header>
  );
};
