import React, { useState } from 'react';
import {
  FolderOpen,
  Library,
  Download,
  KeyRound,
  Settings,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  ShieldCheck,
  FileText,
  Camera,
  Coins
} from 'lucide-react';
import {
  UtilityModal,
  CompleteContentPackage,
  ProjectSummary,
  AppSettings
} from '../../types';
import { StorageService } from '../../services/storageService';
import { ExportService } from '../../services/exportService';

interface UtilityModalsProps {
  activeModal: UtilityModal;
  onClose: () => void;
  currentPackage: CompleteContentPackage | null;
  onOpenProject: (pkg: CompleteContentPackage) => void;
  settings: AppSettings;
  onSettingsUpdated: (newSettings: AppSettings) => void;
}

export const UtilityModals: React.FC<UtilityModalsProps> = ({
  activeModal,
  onClose,
  currentPackage,
  onOpenProject,
  settings,
  onSettingsUpdated
}) => {
  const [projects, setProjects] = useState<ProjectSummary[]>(() => StorageService.getProjects());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Settings local state
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  if (!activeModal) return null;

  const handleDuplicate = (id: string) => {
    const dup = StorageService.duplicateProject(id);
    if (dup) {
      setProjects(StorageService.getProjects());
    }
  };

  const handleDelete = (id: string) => {
    StorageService.deleteProject(id);
    setProjects(StorageService.getProjects());
  };

  const handleSaveSettings = () => {
    StorageService.saveSettings(localSettings);
    onSettingsUpdated(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-[#11151f] border border-[#222c3e] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#1c2434] flex items-center justify-between bg-[#0e121a]">
          <div className="flex items-center gap-2">
            {activeModal === 'saved-projects' && <FolderOpen className="w-4 h-4 text-indigo-400" />}
            {activeModal === 'content-library' && <Library className="w-4 h-4 text-indigo-400" />}
            {activeModal === 'export-history' && <Download className="w-4 h-4 text-indigo-400" />}
            {activeModal === 'api-connections' && <KeyRound className="w-4 h-4 text-indigo-400" />}
            {activeModal === 'settings' && <Settings className="w-4 h-4 text-indigo-400" />}

            <h3 className="text-sm font-bold text-slate-100 font-khmer">
              {activeModal === 'saved-projects' && 'គម្រោងដែលបានរក្សាទុក (Saved Projects)'}
              {activeModal === 'content-library' && 'បណ្ណាល័យមាតិកា (Content Library)'}
              {activeModal === 'export-history' && 'មជ្ឈមណ្ឌលទាញយក (Export Center)'}
              {activeModal === 'api-connections' && 'ការតភ្ជាប់ API & សុវត្ថិភាព (API Connections)'}
              {activeModal === 'settings' && 'ការកំណត់កម្មវិធី (Application Settings)'}
            </h3>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg p-1">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* 1. SAVED PROJECTS */}
          {activeModal === 'saved-projects' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-khmer">ចំនួនគម្រោងសរុប៖ {projects.length}</span>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-khmer">
                  មិនទាន់មានគម្រោងត្រូវបានរក្សាទុកនៅឡើយទេ...
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-xl bg-[#0d1118] border border-[#1d2637] flex items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-100 font-khmer text-xs truncate">
                          {proj.title}
                        </h4>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{proj.category}</span>
                          <span className="text-slate-600">&bull;</span>
                          <span>{proj.platform}</span>
                          <span className="text-slate-600">&bull;</span>
                          <span className="font-mono-tabular">{proj.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onOpenProject(proj.data);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs font-khmer"
                        >
                          បើកគម្រោង
                        </button>
                        <button
                          onClick={() => handleDuplicate(proj.id)}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#1a2230]"
                          title="ចម្លងគម្រោង (Duplicate)"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10"
                          title="លុបគម្រោង (Delete)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. CONTENT LIBRARY */}
          {activeModal === 'content-library' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-khmer">
                បណ្តុំគំរូ B-Roll Prompts, Hook Templates និងរចនាសម្ព័ន្ធស្គ្រីបខ្មែរដែលបានចងក្រងទុកជាមុន។
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0d1118] border border-[#1d2637] space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">
                    Hook Pattern: Pattern Interrupt
                  </span>
                  <p className="font-khmer text-slate-200">
                    "តើអ្នកដឹងទេថា... រឿងពិតនៅពីក្រោយនេះ នឹងធ្វើឱ្យអ្នកភ្ញាក់ផ្អើល!"
                  </p>
                  <span className="text-[10px] text-slate-500 block">Retention rate +38%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0d1118] border border-[#1d2637] space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">
                    Google Flow B-Roll: Macro Texture
                  </span>
                  <p className="text-slate-300 font-mono text-[11px]">
                    "Cinematic macro lens shot of ancient Cambodian sandstone, warm morning volumetric rays..."
                  </p>
                  <span className="text-[10px] text-slate-500 block">Aspect: 9:16 vertical</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. EXPORT CENTER */}
          {activeModal === 'export-history' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 font-khmer">
                ទាញយកឯកសារផលិតមាតិកាគ្រប់ទម្រង់សម្រាប់គម្រោងបច្ចុប្បន្ន ({currentPackage ? currentPackage.titleKhmer : 'មិនទាន់មានគម្រោងសកម្ម'})
              </p>

              {currentPackage ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const srt = ExportService.generateSrt(currentPackage.script);
                      ExportService.downloadFile(srt, `${currentPackage.titleEnglish}_subtitles.srt`, 'text/plain');
                    }}
                    className="p-3 rounded-xl bg-[#0d1118] hover:bg-[#151c27] border border-[#1d2637] flex items-center gap-3 text-left transition-colors"
                  >
                    <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">SRT Subtitles (.srt)</div>
                      <div className="text-[11px] text-slate-400 font-khmer">អក្សររត់ក្រោមវីដេអូខ្មែរតាមម៉ោងច្បាស់លាស់</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const txt = ExportService.generateTxt(currentPackage);
                      ExportService.downloadFile(txt, `${currentPackage.titleEnglish}_script_package.txt`, 'text/plain');
                    }}
                    className="p-3 rounded-xl bg-[#0d1118] hover:bg-[#151c27] border border-[#1d2637] flex items-center gap-3 text-left transition-colors"
                  >
                    <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">Full Text Document (.txt)</div>
                      <div className="text-[11px] text-slate-400 font-khmer">កញ្ចប់ស្គ្រីប និងព័ត៌មានលម្អិតទាំងអស់</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const prompts = ExportService.generateFlowPromptsText(currentPackage.flowPrompts);
                      ExportService.downloadFile(prompts, `${currentPackage.titleEnglish}_flow_prompts.txt`, 'text/plain');
                    }}
                    className="p-3 rounded-xl bg-[#0d1118] hover:bg-[#151c27] border border-[#1d2637] flex items-center gap-3 text-left transition-colors"
                  >
                    <Camera className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">Google Flow Prompts (.txt)</div>
                      <div className="text-[11px] text-slate-400 font-khmer">បណ្តុំ Prompts សម្រាប់ Google Flow / Veo</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const json = JSON.stringify(currentPackage, null, 2);
                      ExportService.downloadFile(json, `${currentPackage.titleEnglish}_project.json`, 'application/json');
                    }}
                    className="p-3 rounded-xl bg-[#0d1118] hover:bg-[#151c27] border border-[#1d2637] flex items-center gap-3 text-left transition-colors"
                  >
                    <Download className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-200">Structured JSON (.json)</div>
                      <div className="text-[11px] text-slate-400 font-khmer">ទិន្នន័យគម្រោងសម្រាប់ផ្ទុក ឬផ្ទេរ</div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 font-khmer">
                  សូមជ្រើសរើស ឬបង្កើតកញ្ចប់មាតិកាក្នុង Menu 2 ជាមុនសិន។
                </div>
              )}
            </div>
          )}

          {/* 4. API CONNECTIONS */}
          {activeModal === 'api-connections' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl flex items-center gap-2.5 text-xs text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  កូនសោសម្ងាត់ (API Keys) ទាំងអស់ត្រូវបានរក្សាទុកដោយសុវត្ថិភាពក្នុងកុំព្យូទ័ររបស់អ្នក
                  ហើយមិនត្រូវបានបញ្ចេញជាសាធារណៈឡើយ។
                </span>
              </div>

              {/* Engine Selector */}
              <div>
                <label className="block text-slate-400 mb-1">AI Engine Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, aiEngine: 'gemini' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      localSettings.aiEngine === 'gemini'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-[#141923] border-[#222a3a] text-slate-400'
                    }`}
                  >
                    Google Gemini 2.5 Flash / Pro (ស្រាប់)
                  </button>
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, aiEngine: 'claude' })}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      localSettings.aiEngine === 'claude'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-[#141923] border-[#222a3a] text-slate-400'
                    }`}
                  >
                    Anthropic Claude 3.5 Sonnet
                  </button>
                </div>
              </div>

              {/* Anthropic Claude API Key */}
              <div>
                <label className="block text-slate-400 mb-1">
                  Anthropic API Key (Claude)
                </label>
                <input
                  type="password"
                  value={localSettings.anthropicApiKey}
                  onChange={(e) => setLocalSettings({ ...localSettings, anthropicApiKey: e.target.value })}
                  placeholder="sk-ant-api03-..."
                  className="w-full bg-[#161c28] border border-[#232b3c] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                />
              </div>

              {/* Google Gemini API Key */}
              <div>
                <label className="block text-slate-400 mb-1">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={localSettings.geminiApiKey}
                  onChange={(e) => setLocalSettings({ ...localSettings, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#161c28] border border-[#232b3c] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                />
              </div>

              {/* YouTube Data API Key */}
              <div>
                <label className="block text-slate-400 mb-1">
                  YouTube Data API v3 Key (Optional for Viral Discovery)
                </label>
                <input
                  type="password"
                  value={localSettings.youtubeApiKey}
                  onChange={(e) => setLocalSettings({ ...localSettings, youtubeApiKey: e.target.value })}
                  placeholder="AIzaSy... (For live YouTube trending feed)"
                  className="w-full bg-[#161c28] border border-[#232b3c] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                />
              </div>

              {/* Token Usage & Cost Estimator */}
              <div className="p-3.5 bg-[#0d1017] border border-[#1b2230] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-semibold text-slate-300">Estimated Token & API Usage</span>
                    <div className="text-[11px] text-slate-500 font-mono-tabular">
                      Tokens: {localSettings.tokenUsageCount.toLocaleString()} &bull; Cost: ~${localSettings.estimatedCostUsd} USD
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. SETTINGS */}
          {activeModal === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Khmer Font Scale (ទំហំអក្សរខ្មែរ)</label>
                <select
                  value={localSettings.khmerFontSize}
                  onChange={(e) => setLocalSettings({ ...localSettings, khmerFontSize: e.target.value as any })}
                  className="w-full bg-[#161c28] border border-[#232b3c] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none"
                >
                  <option value="normal">ធម្មតា (Standard 14px-15px)</option>
                  <option value="large">ធំល្មម (Large 16px)</option>
                  <option value="extra-large">ធំខ្លាំង (Extra Large 18px)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Default Platform (វេទិកាលំនាំដើម)</label>
                <select
                  value={localSettings.defaultPlatform}
                  onChange={(e) => setLocalSettings({ ...localSettings, defaultPlatform: e.target.value as any })}
                  className="w-full bg-[#161c28] border border-[#232b3c] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none"
                >
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook Reels">Facebook Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="YouTube Long-form">YouTube Long-form</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Auto-Save Cadence (ការរក្សាទុកស្វ័យប្រវត្តិ)</label>
                <select
                  value={localSettings.autoSaveIntervalSec}
                  onChange={(e) => setLocalSettings({ ...localSettings, autoSaveIntervalSec: Number(e.target.value) })}
                  className="w-full bg-[#161c28] border border-[#232b3c] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none"
                >
                  <option value={15}>រៀងរាល់ ១៥ វិនាទី</option>
                  <option value={30}>រៀងរាល់ ៣០ វិនាទី</option>
                  <option value={60}>រៀងរាល់ ១ នាទី</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#1c2434] bg-[#0e121a] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs text-slate-300 bg-[#161c28] hover:bg-[#20293b]"
          >
            បិទ (Close)
          </button>
          {(activeModal === 'api-connections' || activeModal === 'settings') && (
            <button
              onClick={handleSaveSettings}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm"
            >
              រក្សាទុកការកំណត់ (Save)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
