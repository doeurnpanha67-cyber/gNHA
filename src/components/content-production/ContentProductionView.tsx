import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Camera,
  Scissors,
  Volume2,
  ShieldAlert,
  Play,
  Download,
  Printer,
  ChevronDown,
  Layers,
  Wand2
} from 'lucide-react';
import {
  CompleteContentPackage,
  TopicItem,
  TargetPlatform,
  VideoDurationOption,
  VideoFormat,
  ContentType,
  NarrationStyle,
  PresenterType,
  VisualStyle,
  GoogleFlowPrompt
} from '../../types';
import { ContentProductionEngine } from '../../services/contentProductionEngine';
import { ExportService } from '../../services/exportService';

interface ContentProductionViewProps {
  currentPackage: CompleteContentPackage | null;
  onPackageUpdated: (pkg: CompleteContentPackage) => void;
  selectedTopicForProduction?: TopicItem | null;
}

export const ContentProductionView: React.FC<ContentProductionViewProps> = ({
  currentPackage,
  onPackageUpdated,
  selectedTopicForProduction
}) => {
  // Step 1 Configuration State
  const [topic, setTopic] = useState<TopicItem>(
    selectedTopicForProduction || {
      id: 'TOPIC-001',
      titleKhmer: 'ហេតុអ្វីបានជាគ្រឹះប្រាសាទអង្គរវត្តមិនដែលស្រុតចុះ បើទោះជាសង់លើដីខ្សាច់?',
      titleEnglish: 'Why Angkor Wat Foundations Never Sink Despite Being Built on Sand',
      category: 'Cambodian history and culture',
      hookIdea: 'តើអ្នកដឹងទេថា ប្រាសាទអង្គរវត្តដ៏មហិមា អណ្តែតលើទឹកដូចកប៉ាល់យក្ស?',
      whyInteresting: 'ប្រព័ន្ធទឹកក្រោមដីទ្រទ្រង់គ្រឹះយ៉ាងអស្ចារ្យដោយមិនដែលស្រុត',
      targetAudience: 'យុវជន អ្នកស្រឡាញ់ប្រវត្តិសាស្ត្រ និងសាធារណជនទូទៅ',
      suggestedDuration: '60s',
      suggestedVisualApproach: '3D architectural cross-section of temple foundations and ground water',
      contentPotential: 'Very High',
      researchRequirements: 'ឯកសារបច្ចេកទេសអាជ្ញាធរជាតិអប្សរា និងរបាយការណ៍ UNESCO'
    }
  );

  const [platform, setPlatform] = useState<TargetPlatform>('TikTok');
  const [duration, setDuration] = useState<VideoDurationOption>('60s');
  const [customSeconds, setCustomSeconds] = useState<number>(60);
  const [format, setFormat] = useState<VideoFormat>('9:16');
  const [contentType, setContentType] = useState<ContentType>('documentary');
  const [narrationStyle, setNarrationStyle] = useState<NarrationStyle>('conversational');
  const [targetAudience, setTargetAudience] = useState<string>('យុវជន និងសាធារណជនទូទៅ');
  const [presenter, setPresenter] = useState<PresenterType>('voice-over only');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('cinematic');
  const [bRollCount, setBRollCount] = useState<number>(6);

  // Status & active sub-tab
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'hooks' | 'script' | 'qc' | 'google-flow' | 'editing' | 'audio' | 'fact-check'
  >('script');

  // Copy indicator states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected scene for inline editing/rewrite
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [proofreadFeedback, setProofreadFeedback] = useState<string | null>(null);

  // TTS preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Handle generation of complete package
  const handleGenerateComplete = async () => {
    setIsGenerating(true);
    try {
      // Simulate high-tier AI generation pipeline
      await new Promise(res => setTimeout(res, 800));

      const newPackage = ContentProductionEngine.generateCompletePackage({
        topic,
        targetPlatform: platform,
        videoDuration: duration,
        customDurationSeconds: duration === 'custom' ? customSeconds : undefined,
        videoFormat: format,
        contentType,
        narrationStyle,
        presenter,
        visualStyle,
        bRollSceneCount: bRollCount
      });

      onPackageUpdated(newPackage);
    } catch (e) {
      console.error('Error generating package', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRewriteSentence = (
    action: 'spelling' | 'natural' | 'simplify' | 'engaging' | 'shorten' | 'expand' | 'fact_check'
  ) => {
    if (!currentPackage || !currentPackage.script[activeSceneIdx]) return;
    const currentScene = currentPackage.script[activeSceneIdx];
    const { rewrittenText, explanation } = ContentProductionEngine.rewriteScriptText(
      currentScene.narrationKhmer,
      action
    );

    const updatedScript = [...currentPackage.script];
    updatedScript[activeSceneIdx] = {
      ...currentScene,
      narrationKhmer: rewrittenText
    };

    onPackageUpdated({
      ...currentPackage,
      script: updatedScript,
      updatedAt: new Date().toISOString()
    });

    setProofreadFeedback(explanation);
    setTimeout(() => setProofreadFeedback(null), 4000);
  };

  const handleTweakFlowPrompt = (
    promptIdx: number,
    tweak: 'angle' | 'lighting' | 'style' | 'alternative'
  ) => {
    if (!currentPackage || !currentPackage.flowPrompts[promptIdx]) return;
    const currentPrompt = currentPackage.flowPrompts[promptIdx];
    const updated = ContentProductionEngine.refineFlowPrompt(currentPrompt, tweak);

    const updatedPrompts = [...currentPackage.flowPrompts];
    updatedPrompts[promptIdx] = updated;

    onPackageUpdated({
      ...currentPackage,
      flowPrompts: updatedPrompts,
      updatedAt: new Date().toISOString()
    });
  };

  const handlePlayVoicePreview = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'km-KH';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt không hỗ trợ Web Speech Synthesis.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#090c10]">
      {/* STEP 1: Content Configuration Bar (Collapsible / Compact) */}
      <div className="bg-[#0f131c] border-b border-[#1c2331] p-4 shrink-0">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                STEP 1: CONTENT CONFIGURATION & TOPIC
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-sm font-bold text-slate-100 font-khmer truncate">
                  {topic.titleKhmer}
                </h2>
                <span className="text-xs text-slate-400 font-mono-tabular shrink-0">
                  ({topic.category})
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerateComplete}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-md shrink-0"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? 'កំពុងបង្កើតកញ្ចប់មាតិកាពេញលេញ...'
                  : 'GENERATE COMPLETE CONTENT (បង្កើតកញ្ចប់មាតិកា)'}
              </span>
            </button>
          </div>

          {/* Configuration Inputs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2.5 pt-1 text-xs">
            {/* Target Platform */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as TargetPlatform)}
                className="w-full bg-[#151a24] border border-[#232b3c] rounded px-2 py-1 text-xs text-slate-200 outline-none"
              >
                <option value="TikTok">TikTok</option>
                <option value="Facebook Reels">Facebook Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="YouTube Long-form">YouTube Long-form</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as VideoDurationOption)}
                className="w-full bg-[#151a24] border border-[#232b3c] rounded px-2 py-1 text-xs text-slate-200 outline-none"
              >
                <option value="30s">30s (Short)</option>
                <option value="60s">60s (Standard)</option>
                <option value="90s">90s</option>
                <option value="3m">3 Minutes</option>
                <option value="5m">5 Minutes</option>
                <option value="custom">Custom...</option>
              </select>
            </div>

            {/* Video Format Aspect Ratio */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as VideoFormat)}
                className="w-full bg-[#151a24] border border-[#232b3c] rounded px-2 py-1 text-xs text-slate-200 outline-none"
              >
                <option value="9:16">9:16 (Vertical)</option>
                <option value="16:9">16:9 (Landscape)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full bg-[#151a24] border border-[#232b3c] rounded px-2 py-1 text-xs text-slate-200 outline-none"
              >
                <option value="documentary">Documentary</option>
                <option value="educational">Educational</option>
                <option value="storytelling">Storytelling</option>
                <option value="explainer">Explainer</option>
                <option value="news commentary">News Commentary</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>

            {/* Narration Style */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                Narration Style
              </label>
              <select
                value={narrationStyle}
                onChange={(e) => setNarrationStyle(e.target.value as NarrationStyle)}
                className="w-full bg-[#151a24] border border-[#232b3c] rounded px-2 py-1 text-xs text-slate-200 outline-none"
              >
                <option value="conversational">Conversational (សន្ទនា)</option>
                <option value="friendly">Friendly (រួសរាយ)</option>
                <option value="professional">Professional (វិជ្ជាជីវៈ)</option>
                <option value="dramatic">Dramatic (រំជួលចិត្ត)</option>
                <option value="documentary">Documentary (ឯកសារ)</option>
                <option value="humorous">Humorous (កំប្លែង)</option>
              </select>
            </div>

            {/* Presenter Mode */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                Presenter
              </label>
              <select
                value={presenter}
                onChange={(e) => setPresenter(e.target.value as PresenterType)}
                className="w-full bg-[#151a24] border border-[#232b3c] rounded px-2 py-1 text-xs text-slate-200 outline-none"
              >
                <option value="voice-over only">Voice-over Only</option>
                <option value="on-camera presenter">On-camera Presenter</option>
                <option value="AI character">AI Character</option>
              </select>
            </div>

            {/* Visual Style */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                Visual Style
              </label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value as VisualStyle)}
                className="w-full bg-[#151a24] border border-[#232b3c] rounded px-2 py-1 text-xs text-slate-200 outline-none"
              >
                <option value="cinematic">Cinematic</option>
                <option value="realistic">Realistic</option>
                <option value="documentary">Documentary</option>
                <option value="3D animation">3D Animation</option>
                <option value="historical reconstruction">Historical</option>
                <option value="modern commercial">Commercial</option>
              </select>
            </div>

            {/* B-roll Scenes Count */}
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                B-roll Scenes
              </label>
              <select
                value={bRollCount}
                onChange={(e) => setBRollCount(Number(e.target.value))}
                className="w-full bg-[#151a24] border border-[#232b3c] rounded px-2 py-1 text-xs text-slate-200 outline-none font-mono-tabular"
              >
                <option value={4}>4 Scenes</option>
                <option value={6}>6 Scenes</option>
                <option value={8}>8 Scenes</option>
                <option value={10}>10 Scenes</option>
                <option value={12}>12 Scenes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: Content Sections Navigation Tabs */}
      <div className="bg-[#0b0e14] border-b border-[#1b2230] px-5 flex items-center justify-between shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1 py-1">
          <button
            onClick={() => setActiveTab('hooks')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'hooks'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>A. Viral Hooks ({currentPackage?.hooks.length || 3})</span>
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'script'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="font-khmer">B. ស្គ្រីបខ្មែរពេញលេញ ({currentPackage?.script.length || 6} វគ្គ)</span>
          </button>

          <button
            onClick={() => setActiveTab('qc')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'qc'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-khmer">C. Khmer Language Editor (ពិនិត្យអក្ខរាវិរុទ្ធ)</span>
          </button>

          <button
            onClick={() => setActiveTab('google-flow')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'google-flow'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>D. Google Flow Prompts ({currentPackage?.flowPrompts.length || 6})</span>
          </button>

          <button
            onClick={() => setActiveTab('editing')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'editing'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>E. Editing Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'audio'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>F. Voice & Sound</span>
          </button>

          <button
            onClick={() => setActiveTab('fact-check')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'fact-check'
                ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>G. Research Verification</span>
          </button>
        </div>

        {/* Global Export Quick Actions */}
        {currentPackage && (
          <div className="flex items-center gap-2 py-1.5 shrink-0">
            <button
              onClick={() => {
                const srt = ExportService.generateSrt(currentPackage.script);
                ExportService.downloadFile(srt, `${currentPackage.titleEnglish}_subtitles.srt`, 'text/plain');
              }}
              className="px-2.5 py-1 text-[11px] rounded bg-[#161c28] hover:bg-[#1e2636] border border-[#252f42] text-slate-300 transition-colors whitespace-nowrap"
              title="Download SRT Subtitle file"
            >
              Export SRT
            </button>
            <button
              onClick={() => ExportService.openPrintPreview(currentPackage)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded bg-[#161c28] hover:bg-[#1e2636] border border-[#252f42] text-slate-300 transition-colors whitespace-nowrap"
              title="Print or Save PDF"
            >
              <Printer className="w-3 h-3" />
              <span>PDF / Print</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Render Area */}
      <div className="flex-1 overflow-auto p-6 bg-[#090c10]">
        {!currentPackage ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-200 font-khmer">
              ត្រៀមខ្លួនរួចរាល់សម្រាប់ការផលិតកញ្ចប់មាតិកា
            </h3>
            <p className="text-xs text-slate-400 max-w-md mt-1 mb-6 font-khmer">
              ចុចប៊ូតុង "GENERATE COMPLETE CONTENT" ខាងលើ ដើម្បីឱ្យប្រព័ន្ធ AI បង្កើត Hook,
              ស្គ្រីបខ្មែរធម្មជាតិ, Google Flow B-roll Prompts, គម្រោងកាត់ត និងការផ្ទៀងផ្ទាត់ការពិត។
            </p>
            <button
              onClick={handleGenerateComplete}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg"
            >
              <Wand2 className="w-4 h-4" />
              <span>ចាប់ផ្តើមបង្កើតឥឡូវនេះ (Generate Now)</span>
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* SUB-TAB A: VIRAL HOOKS */}
            {activeTab === 'hooks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      A. Three Alternative Viral-Style Opening Hooks
                    </h3>
                    <p className="text-xs text-slate-400 font-khmer mt-0.5">
                      ចាប់ចំណាប់អារម្មណ៍ក្នុងរយៈពេល ១ ដល់ ៣ វិនាទីដំបូង ដោយមិនប្រើពាក្យបោកបញ្ឆោត (Clickbait)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentPackage.hooks.map((h, idx) => (
                    <div
                      key={h.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        h.isRecommended
                          ? 'bg-indigo-950/20 border-indigo-500/40 shadow-sm'
                          : 'bg-[#11151e] border-[#1d2535]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono-tabular font-bold text-slate-400">
                            HOOK OPTION {idx + 1}
                          </span>
                          {h.isRecommended && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                              RECOMMENDED
                            </span>
                          )}
                        </div>

                        <div className="text-sm font-semibold font-khmer text-slate-100 leading-relaxed">
                          "{h.hookKhmer}"
                        </div>

                        <div className="text-xs text-slate-400 italic">
                          "{h.hookEnglish}"
                        </div>

                        <div className="pt-2 border-t border-[#1d2535]/80 space-y-1.5 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Technique:</span>
                            <span className="text-slate-300 font-khmer text-[11px]">{h.technique}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Retention Rationale:</span>
                            <span className="text-slate-400 font-khmer text-[11px]">{h.retentionRationale}</span>
                          </div>
                          {h.whyRecommended && (
                            <div>
                              <span className="text-indigo-400 block text-[10px]">Why it fits this topic:</span>
                              <span className="text-indigo-200 font-khmer text-[11px]">{h.whyRecommended}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-2">
                        <button
                          onClick={() => copyToClipboard(h.hookKhmer, h.id)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#181f2c] hover:bg-[#20293b] border border-[#252f42] text-xs text-slate-300 hover:text-white transition-colors"
                        >
                          {copiedId === h.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">បានចម្លង (Copied)</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Hook</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB B: COMPLETE KHMER VIDEO SCRIPT */}
            {activeTab === 'script' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span>B. Complete Khmer Video Script (ស្គ្រីបវីដេអូខ្មែរពេញលេញ)</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-khmer mt-0.5">
                      សំនៀងនិយាយតាមទម្រង់ជនជាតិខ្មែរពិតប្រាកដ រៀបចំតាមពេលវេលាជាក់ស្តែង Scene-by-Scene
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const fullScript = currentPackage.script
                          .map(s => `[${s.startTime} - ${s.endTime}] ${s.narrationKhmer}`)
                          .join('\n\n');
                        copyToClipboard(fullScript, 'full-script');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-[#1e2636] border border-[#252f42] text-xs text-slate-300"
                    >
                      {copiedId === 'full-script' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy Full Script</span>
                    </button>
                  </div>
                </div>

                {/* Scene-by-scene script cards */}
                <div className="space-y-3">
                  {currentPackage.script.map((scene, idx) => (
                    <div
                      key={scene.sceneNumber}
                      onClick={() => setActiveSceneIdx(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        activeSceneIdx === idx
                          ? 'bg-[#131824] border-indigo-500/50 shadow-md ring-1 ring-indigo-500/20'
                          : 'bg-[#10141d] border-[#1c2434] hover:border-[#28344a]'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-400 text-xs font-mono-tabular font-bold flex items-center justify-center">
                            {scene.sceneNumber}
                          </span>
                          <span className="text-xs font-mono-tabular text-slate-400">
                            {scene.startTime} — {scene.endTime} ({scene.paceSeconds}s)
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs text-slate-400 font-khmer">
                            {scene.emotionalDelivery}
                          </span>
                        </div>

                        {/* Quick Action Buttons for Active Scene */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayVoicePreview(scene.narrationKhmer);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#18202d] hover:bg-[#222b3d] text-slate-300 text-[11px] border border-[#263145]"
                            title="Play Khmer TTS Audio Preview"
                          >
                            <Play className="w-3 h-3 text-indigo-400" />
                            <span>ស្តាប់សំនៀង</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(scene.narrationKhmer, `scene-${scene.sceneNumber}`);
                            }}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Copy narration"
                          >
                            {copiedId === `scene-${scene.sceneNumber}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Exact Spoken Narration (Khmer) */}
                      <div className="text-base font-khmer text-slate-100 leading-relaxed my-2 pl-2 border-l-2 border-indigo-500/40">
                        {scene.narrationKhmer}
                      </div>

                      {/* Visual & On-Screen Overlay Guidance */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-2 mt-2 border-t border-[#1a2130]">
                        <div className="text-slate-400">
                          <span className="text-slate-500 font-medium mr-1.5">Visual Footage:</span>
                          <span>{scene.suggestedFootage}</span>
                        </div>
                        {scene.onScreenTextKhmer && (
                          <div className="text-slate-400 font-khmer">
                            <span className="text-slate-500 font-medium mr-1.5">On-screen Text:</span>
                            <span className="text-indigo-300">"{scene.onScreenTextKhmer}"</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB C: KHMER LANGUAGE QUALITY CONTROL (EDITOR) */}
            {activeTab === 'qc' && (
              <div className="space-y-5">
                <div className="bg-[#101520] border border-[#1e2637] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      C. Dedicated Khmer Language Quality Control & Proofreader
                    </h3>
                    <p className="text-xs text-slate-400 font-khmer mt-0.5">
                      {currentPackage.languageQualityNotes.spellingStatus} &bull;{' '}
                      {currentPackage.languageQualityNotes.naturalPhrasingRating}
                    </p>
                  </div>
                  <div className="text-xs text-indigo-400 font-semibold px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                    Two-Stage Review Workflow Active
                  </div>
                </div>

                {/* Feedback Toast */}
                {proofreadFeedback && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 font-khmer flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{proofreadFeedback}</span>
                  </div>
                )}

                {/* Quick Rewrite Action Buttons */}
                <div className="bg-[#10141d] border border-[#1c2434] p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Khmer Language Rewrite Controls (សម្រាប់ Scene {activeSceneIdx + 1})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ជ្រើសរើសសកម្មភាពដើម្បីកែសម្រួលប្រយោគភ្លាមៗ
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleRewriteSentence('spelling')}
                      className="px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-indigo-600/30 border border-[#273245] text-xs text-slate-200 hover:text-indigo-200 transition-colors font-khmer"
                    >
                      CHECK KHMER SPELLING
                    </button>
                    <button
                      onClick={() => handleRewriteSentence('natural')}
                      className="px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-indigo-600/30 border border-[#273245] text-xs text-slate-200 hover:text-indigo-200 transition-colors font-khmer"
                    >
                      IMPROVE NATURAL SPEECH
                    </button>
                    <button
                      onClick={() => handleRewriteSentence('simplify')}
                      className="px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-indigo-600/30 border border-[#273245] text-xs text-slate-200 hover:text-indigo-200 transition-colors font-khmer"
                    >
                      MAKE IT EASIER TO UNDERSTAND
                    </button>
                    <button
                      onClick={() => handleRewriteSentence('engaging')}
                      className="px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-indigo-600/30 border border-[#273245] text-xs text-slate-200 hover:text-indigo-200 transition-colors font-khmer"
                    >
                      MAKE IT MORE ENGAGING
                    </button>
                    <button
                      onClick={() => handleRewriteSentence('shorten')}
                      className="px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-indigo-600/30 border border-[#273245] text-xs text-slate-200 hover:text-indigo-200 transition-colors font-khmer"
                    >
                      SHORTEN SCRIPT
                    </button>
                    <button
                      onClick={() => handleRewriteSentence('expand')}
                      className="px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-indigo-600/30 border border-[#273245] text-xs text-slate-200 hover:text-indigo-200 transition-colors font-khmer"
                    >
                      EXPAND SCRIPT
                    </button>
                    <button
                      onClick={() => handleRewriteSentence('fact_check')}
                      className="px-3 py-1.5 rounded-lg bg-[#161c28] hover:bg-indigo-600/30 border border-[#273245] text-xs text-slate-200 hover:text-indigo-200 transition-colors font-khmer"
                    >
                      CHECK FACTS
                    </button>
                  </div>
                </div>

                {/* Side-by-side Proofreading Differences */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    PROOFREADING AUDIT LOG & REVISION EXPLANATIONS
                  </h4>
                  {currentPackage.proofreadDifs.map((diff, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#10141d] border border-[#1d2535] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-indigo-400 uppercase">
                          {diff.category}
                        </span>
                        {diff.needsHumanVerification && (
                          <span className="text-amber-400 font-khmer">
                            ទាមទារការត្រួតពិនិត្យបន្ថែម (Requires Human Review)
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded bg-rose-950/20 border border-rose-900/30">
                          <span className="text-[10px] text-rose-400 block mb-1">អត្ថបទដើម (Original):</span>
                          <p className="font-khmer text-slate-300">{diff.originalText}</p>
                        </div>
                        <div className="p-3 rounded bg-emerald-950/20 border border-emerald-900/30">
                          <span className="text-[10px] text-emerald-400 block mb-1">កែសម្រួលរួច (Improved):</span>
                          <p className="font-khmer text-slate-200 font-medium">{diff.improvedText}</p>
                        </div>
                      </div>

                      <p className="text-slate-400 font-khmer text-[11px] pt-1">
                        <strong className="text-slate-300">ការពន្យល់៖</strong> {diff.changeExplanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB D: GOOGLE FLOW VIDEO FOOTAGE PROMPTS */}
            {activeTab === 'google-flow' && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#111622] p-4 rounded-xl border border-indigo-500/20">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-indigo-400" />
                      <span>D. Google Flow Video Footage Prompt Generator</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-khmer mt-0.5">
                      Prompt ភាសាអង់គ្លេសកម្រិតវិជ្ជាជីវៈសម្រាប់ Google Flow / Veo ជាមួយការណែនាំប្លង់កាមេរ៉ា ពន្លឺ និង Continuity
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const allPrompts = ExportService.generateFlowPromptsText(currentPackage.flowPrompts);
                      ExportService.downloadFile(allPrompts, `${currentPackage.titleEnglish}_google_flow_prompts.txt`, 'text/plain');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white whitespace-nowrap shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>EXPORT ALL PROMPTS (.TXT)</span>
                  </button>
                </div>

                {/* List of scene prompts */}
                <div className="space-y-4">
                  {currentPackage.flowPrompts.map((prompt, pIdx) => (
                    <div
                      key={prompt.sceneNumber}
                      className="p-5 rounded-xl bg-[#10141d] border border-[#1d2535] space-y-3"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#1b2230] pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 font-mono-tabular">
                            SCENE {prompt.sceneNumber}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({prompt.durationSeconds}s &bull; {prompt.aspectRatio})
                          </span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs text-slate-300 font-medium">
                            {prompt.purpose}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => handleTweakFlowPrompt(pIdx, 'angle')}
                            className="px-2 py-1 rounded bg-[#161c28] hover:bg-[#20293a] border border-[#242e40] text-[11px] text-slate-300"
                          >
                            CHANGE ANGLE
                          </button>
                          <button
                            onClick={() => handleTweakFlowPrompt(pIdx, 'lighting')}
                            className="px-2 py-1 rounded bg-[#161c28] hover:bg-[#20293a] border border-[#242e40] text-[11px] text-slate-300"
                          >
                            CHANGE LIGHTING
                          </button>
                          <button
                            onClick={() => handleTweakFlowPrompt(pIdx, 'style')}
                            className="px-2 py-1 rounded bg-[#161c28] hover:bg-[#20293a] border border-[#242e40] text-[11px] text-slate-300"
                          >
                            CHANGE STYLE
                          </button>
                          <button
                            onClick={() => handleTweakFlowPrompt(pIdx, 'alternative')}
                            className="px-2 py-1 rounded bg-[#161c28] hover:bg-[#20293a] border border-[#242e40] text-[11px] text-slate-300"
                          >
                            ALTERNATIVE SHOT
                          </button>
                          <button
                            onClick={() => copyToClipboard(prompt.fullPromptEnglish, `flow-${prompt.sceneNumber}`)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[11px] font-medium"
                          >
                            {copiedId === `flow-${prompt.sceneNumber}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>COPY PROMPT</span>
                          </button>
                        </div>
                      </div>

                      {/* Full Prompt in Descriptive English */}
                      <div className="bg-[#090c10] border border-[#1b2230] p-3.5 rounded-lg font-mono text-xs text-slate-200 leading-relaxed select-all">
                        {prompt.fullPromptEnglish}
                      </div>

                      {/* Breakdown metadata */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1">
                        <div>
                          <span className="text-slate-600 block">Camera:</span>
                          <span className="text-slate-300">{prompt.cameraAngleFraming}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 block">Movement:</span>
                          <span className="text-slate-300">{prompt.cameraMovement}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 block">Lighting:</span>
                          <span className="text-slate-300">{prompt.lighting}</span>
                        </div>
                        <div>
                          <span className="text-slate-600 block">Continuity:</span>
                          <span className="text-slate-300">{prompt.continuityInstructions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB E: B-ROLL AND EDITING PLAN */}
            {activeTab === 'editing' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    E. Complete Video Editing Blueprint & Timeline Plan
                  </h3>
                  <p className="text-xs text-slate-400 font-khmer mt-0.5">
                    លំដាប់លំដោយនៃការកាត់ត ការផ្លាស់ប្តូរប្លង់ (Transitions) ចលនាកាមេរ៉ា និងចង្វាក់ Subtitle
                  </p>
                </div>

                <div className="bg-[#10141d] rounded-xl border border-[#1d2535] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#0b0e14] border-b border-[#1c2331] text-[11px] font-semibold text-slate-400 uppercase">
                      <tr>
                        <th className="py-2.5 px-3 w-12 text-center">#</th>
                        <th className="py-2.5 px-3 w-16">Duration</th>
                        <th className="py-2.5 px-3">Narration Match</th>
                        <th className="py-2.5 px-3">Transition Effect</th>
                        <th className="py-2.5 px-3">Sound Effects (SFX)</th>
                        <th className="py-2.5 px-3">BGM Mood</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#171d29]">
                      {currentPackage.editingPlan.map((item) => (
                        <tr key={item.order} className="hover:bg-[#121620] transition-colors">
                          <td className="py-3 px-3 text-center font-mono-tabular text-slate-400 font-bold">
                            {item.sceneNumber}
                          </td>
                          <td className="py-3 px-3 font-mono-tabular text-indigo-400">
                            {item.clipDuration}
                          </td>
                          <td className="py-3 px-3 font-khmer text-slate-200">
                            {item.matchingNarrationSummary}
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            {item.transitionEffect}
                          </td>
                          <td className="py-3 px-3 text-amber-300/80 font-mono text-[11px]">
                            {item.soundEffectsCues}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {item.backgroundMusicMood}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB F: VOICE-OVER & SOUND DESIGN */}
            {activeTab === 'audio' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    F. Khmer Voice-Over Direction & Sound Design
                  </h3>
                  <p className="text-xs text-slate-400 font-khmer mt-0.5">
                    ការណែនាំចង្វាក់សំឡេង ការបញ្ចេញខ្យល់ ការផ្អាកដកដង្ហើម និងស្ទីលតន្ត្រីផ្ទៃខាងក្រោយ
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#10141d] p-5 rounded-xl border border-[#1d2535] space-y-3 text-xs">
                    <h4 className="font-semibold text-indigo-400 uppercase text-[11px]">
                      Voice Profile & Cadence
                    </h4>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Voice Personality:</span>
                      <p className="font-khmer text-slate-200 mt-0.5">
                        {currentPackage.voiceSoundDesign.voicePersonality}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Speaking Speed:</span>
                      <p className="text-slate-200 mt-0.5 font-mono-tabular">
                        {currentPackage.voiceSoundDesign.speakingSpeed}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Pause & Pacing Guidance:</span>
                      <p className="font-khmer text-slate-300 mt-0.5">
                        {currentPackage.voiceSoundDesign.pausePacingGuidance}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#10141d] p-5 rounded-xl border border-[#1d2535] space-y-3 text-xs">
                    <h4 className="font-semibold text-indigo-400 uppercase text-[11px]">
                      Acoustic & Sound Effects
                    </h4>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Background Music Style:</span>
                      <p className="text-slate-200 mt-0.5">
                        {currentPackage.voiceSoundDesign.backgroundMusicStyle}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Emphasis Rules:</span>
                      <p className="font-khmer text-slate-300 mt-0.5">
                        {currentPackage.voiceSoundDesign.emphasisWordRules}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Key SFX Cues:</span>
                      <ul className="list-disc list-inside text-slate-400 mt-0.5 space-y-0.5 font-mono text-[11px]">
                        {currentPackage.voiceSoundDesign.suggestedSfxCues.map((cue, idx) => (
                          <li key={idx}>{cue}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB G: RESEARCH & FACT-CHECKING */}
            {activeTab === 'fact-check' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>G. Research & Fact-Checking Verification Log</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-khmer mt-0.5">
                    បែងចែករវាងការពិតដែលត្រូវបានបញ្ជាក់ និងការសន្និដ្ឋានដែលទាមទារការផ្ទៀងផ្ទាត់ដោយផ្ទាល់
                  </p>
                </div>

                <div className="space-y-3">
                  {currentPackage.factChecking.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#10141d] border border-[#1d2535] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 font-khmer">
                          {item.claim}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            item.status === 'verified'
                              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
                        <div>
                          <strong className="text-slate-500 mr-1">Source Reference:</strong>
                          <span className="font-khmer">{item.sourceReference}</span>
                        </div>
                        <div>
                          <strong className="text-slate-500 mr-1">Action Required:</strong>
                          <span className="font-khmer text-slate-300">{item.verificationInstructions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
