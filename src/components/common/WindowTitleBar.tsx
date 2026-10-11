import React, { useState } from 'react';
import { Minus, Square, X, Sparkles, ShieldCheck } from 'lucide-react';

interface WindowTitleBarProps {
  currentProjectTitle?: string;
  isOnline?: boolean;
}

export const WindowTitleBar: React.FC<WindowTitleBarProps> = ({
  currentProjectTitle,
  isOnline = true,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div className="h-9 bg-[#080a0e] border-b border-[#1c222e] flex items-center justify-between px-3 select-none text-xs text-slate-400">
      {/* Left: App Title and Icon */}
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-3 h-3" />
        </div>
        <span className="font-semibold text-slate-200 tracking-wide text-xs">
          KHMER AI CONTENT STUDIO
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-400 truncate max-w-xs font-khmer">
          {currentProjectTitle || 'គម្រោងថ្មី (New Production)'}
        </span>
      </div>

      {/* Center: System Status & Model Indicator */}
      <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
        <span>Enterprise Desktop Mode</span>
        <span className="text-slate-700">·</span>
        <span className="text-slate-500">Khmer Unicode 5.0 Compliant</span>
      </div>

      {/* Right: Windows Window Controls (Minimize, Maximize, Close) */}
      <div className="flex items-center gap-1 -mr-1">
        <button
          onClick={() => {}}
          title="Minimize Window"
          className="w-8 h-7 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors rounded-xs"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsMaximized(!isMaximized)}
          title={isMaximized ? "Restore Window" : "Maximize Window"}
          className="w-8 h-7 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors rounded-xs"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={() => {}}
          title="Close Window"
          className="w-8 h-7 flex items-center justify-center hover:bg-rose-600 text-slate-400 hover:text-white transition-colors rounded-xs"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
