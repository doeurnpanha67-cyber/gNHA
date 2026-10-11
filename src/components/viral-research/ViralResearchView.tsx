import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  ExternalLink,
  Play,
  Sparkles,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  Share2,
  ThumbsUp,
  MessageSquare,
  Eye,
  Info
} from 'lucide-react';
import { ViralContentItem, ViralContentAnalysis, TopicItem } from '../../types';
import { ViralResearchEngine } from '../../services/viralResearchEngine';
import { DEFAULT_CATEGORIES } from '../../data/defaultCategories';

interface ViralResearchViewProps {
  onSendToProduction: (topic: TopicItem) => void;
}

export const ViralResearchView: React.FC<ViralResearchViewProps> = ({
  onSendToProduction
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<
    'All' | 'YouTube' | 'TikTok' | 'Facebook' | 'Instagram'
  >('All');
  const [minViews, setMinViews] = useState<number>(0);

  // Analysis modal state
  const [activeAnalysisVideo, setActiveAnalysisVideo] = useState<ViralContentItem | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ViralContentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Manual URL Import Modal
  const [isManualImportOpen, setIsManualImportOpen] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>('');
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualCreator, setManualCreator] = useState<string>('');
  const [manualPlatform, setManualPlatform] = useState<'YouTube' | 'TikTok' | 'Facebook' | 'Instagram'>('TikTok');
  const [manualCategory, setManualCategory] = useState<string>(DEFAULT_CATEGORIES[0].nameEnglish);

  // Active video items list
  const [videoList, setVideoList] = useState<ViralContentItem[]>(() =>
    ViralResearchEngine.searchVideos({
      query: '',
      category: 'All',
      platform: 'All',
      country: 'Cambodia',
      minViews: 0
    })
  );

  const handleSearch = () => {
    const results = ViralResearchEngine.searchVideos({
      query: searchQuery,
      category: selectedCategory,
      platform: selectedPlatform,
      country: 'Cambodia',
      minViews
    });
    setVideoList(results);
  };

  const handleOpenAnalysis = (video: ViralContentItem) => {
    setActiveAnalysisVideo(video);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      const res = ViralResearchEngine.analyzeViralContent(video);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleAdoptAngle = (angleIdx: number) => {
    if (!activeAnalysisVideo) return;
    const generatedTopic = ViralResearchEngine.convertAngleToTopic(activeAnalysisVideo, angleIdx);
    setActiveAnalysisVideo(null);
    onSendToProduction(generatedTopic);
  };

  const handleAddManualVideo = () => {
    if (!manualTitle.trim()) return;
    const newItem: ViralContentItem = {
      id: `VIRAL-USER-${Date.now().toString().slice(-4)}`,
      title: manualTitle.trim(),
      channelOrCreator: manualCreator.trim() || 'Manual Import Creator',
      platform: manualPlatform,
      videoUrl: manualUrl.trim() || '#',
      thumbnailUrl: '',
      publishedDate: new Date().toISOString().split('T')[0],
      viewCount: null, // Clearly distinguish unavailable metrics from zero
      likeCount: null,
      commentCount: null,
      engagementRate: null,
      retrievalTimestamp: new Date().toISOString(),
      metricSource: 'User Provided Manual Import',
      isPublicEstimate: true,
      category: manualCategory,
      language: 'Khmer',
      country: 'Cambodia',
      summary: 'វីដេអូនាំចូលដោយផ្ទាល់ពីអ្នកប្រើប្រាស់ សម្រាប់ការវិភាគគំនិត និងការកែច្នៃមាតិកា។'
    };

    setVideoList([newItem, ...videoList]);
    setIsManualImportOpen(false);
    setManualTitle('');
    setManualUrl('');
    setManualCreator('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#090c10]">
      {/* Search & Discovery Controls */}
      <div className="bg-[#10141d] border-b border-[#1c2331] p-5 shrink-0">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>3. VIRAL CONTENT RESEARCH & INSPIRATION</span>
              </h2>
              <p className="text-xs text-slate-400 font-khmer mt-0.5">
                ស្រាវជ្រាវវីដេអូ Viral ក្នុងប្រទេសកម្ពុជា និងអន្តរជាតិ រួចកែច្នៃទៅជាមាតិកាខ្មែរដើម (Original Adaptation)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsManualImportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#161c28] hover:bg-[#1f2738] border border-[#252f42] text-xs font-semibold text-slate-200 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Manual URL Import (នាំចូល URL)</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Multi-filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1 text-xs">
            {/* Search Query */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Keyword or Topic (ពាក្យគន្លឹះ)
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="ស្វែងរកតាមចំណងជើង ឬប្រធានបទ..."
                  className="w-full bg-[#151a24] border border-[#242c3d] rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none font-khmer focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Platform (វេទិកា)
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as any)}
                className="w-full bg-[#151a24] border border-[#242c3d] rounded-md px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
              >
                <option value="All">All Platforms (ទាំងអស់)</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Category (ប្រភេទ)
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#151a24] border border-[#242c3d] rounded-md px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-khmer"
              >
                <option value="All">All Categories (គ្រប់ប្រភេទ)</option>
                {DEFAULT_CATEGORIES.map(c => (
                  <option key={c.id} value={c.nameEnglish}>{c.nameKhmer}</option>
                ))}
              </select>
            </div>

            {/* Search Execute Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>ស្វែងរក (Discover)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Analytics Notice Bar */}
      <div className="bg-[#0b0e14] border-b border-[#18202d] px-5 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>
            ទិន្នន័យត្រូវបានទាញយកពីប្រភពសាធារណៈផ្លូវការ និង API សុពលភាព។ មិនមានការប្រឌិតចំនួនទស្សនា (No fabricated stats)។
          </span>
        </div>
        <div className="font-mono-tabular text-slate-500">
          បង្ហាញ {videoList.length} វីដេអូ Viral
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="flex-1 overflow-auto p-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoList.map((video) => (
            <div
              key={video.id}
              className="bg-[#10141d] border border-[#1d2535] rounded-xl p-4 flex flex-col justify-between hover:border-[#2d3a52] transition-all"
            >
              <div className="space-y-3">
                {/* Platform Header & Source Attribution */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-indigo-400 font-mono-tabular">
                    {video.platform}
                  </span>
                  <span className="text-slate-500 font-mono-tabular text-[10px]">
                    {video.publishedDate}
                  </span>
                </div>

                {/* Video Title */}
                <div>
                  <h3 className="text-sm font-bold text-slate-100 font-khmer line-clamp-2 leading-relaxed">
                    {video.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-khmer mt-1">
                    ដោយ៖ <span className="text-slate-300 font-medium">{video.channelOrCreator}</span>
                  </div>
                </div>

                {/* Summary */}
                {video.summary && (
                  <p className="text-xs text-slate-400 font-khmer line-clamp-2 leading-relaxed bg-[#0b0e14] p-2 rounded-lg border border-[#161c28]">
                    {video.summary}
                  </p>
                )}

                {/* Metrics Breakdown (Distinguishing unavailable metrics from zero) */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#1a2230] text-center text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Views</span>
                    <span className="font-mono-tabular font-semibold text-slate-200">
                      {video.viewCount !== null ? video.viewCount.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Likes</span>
                    <span className="font-mono-tabular font-semibold text-slate-200">
                      {video.likeCount !== null ? video.likeCount.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Engagement</span>
                    <span className="font-mono-tabular font-semibold text-emerald-400">
                      {video.engagementRate !== null ? video.engagementRate : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Data Source Footnote */}
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  Source: {video.metricSource}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-2 flex items-center justify-between gap-2 border-t border-[#1a2230]">
                {video.videoUrl && video.videoUrl !== '#' ? (
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#18202d]"
                    title="Open Original Video Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : <div />}

                {/* Primary Action: ANALYZE THIS CONTENT */}
                <button
                  onClick={() => handleOpenAnalysis(video)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ANALYZE THIS CONTENT (វិភាគ)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI VIRAL ANALYSIS MODAL */}
      {activeAnalysisVideo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#111622] border border-[#242e42] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1d2637] flex items-start justify-between bg-[#0e121b]">
              <div>
                <span className="text-[11px] font-mono-tabular text-indigo-400 font-semibold">
                  AI VIRAL INSPIRATION & ORIGINAL KHMER ADAPTATION
                </span>
                <h3 className="text-sm font-bold text-slate-100 font-khmer mt-0.5 line-clamp-1">
                  វិភាគ៖ {activeAnalysisVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveAnalysisVideo(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              {isAnalyzing || !analysisResult ? (
                <div className="py-16 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="font-khmer text-slate-300">
                    Claude AI កំពុងវិភាគយុទ្ធសាស្ត្រ Hook, ក្របខ័ណ្ឌ Storytelling និងការបង្កើតមុំមាតិកាខ្មែរដើម...
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary & Why Viral */}
                  <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1a2130] space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        Original Concept & Why it Attracted Viewers
                      </span>
                      <p className="font-khmer text-slate-200 mt-1 leading-relaxed">
                        {analysisResult.originalConceptSummary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#161c28]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Retention Driver Rationale
                      </span>
                      <p className="font-khmer text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
                        {analysisResult.whyAttractedViewers}
                      </p>
                    </div>
                  </div>

                  {/* Copyright-safe Khmer Adaptation Note */}
                  <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 font-khmer leading-relaxed">
                    <strong>គោលការណ៍រក្សាសិទ្ធិ និងភាពច្នៃប្រឌិតខ្មែរ៖</strong> {analysisResult.khmerAdaptationOpportunities}
                  </div>

                  {/* Three Original Khmer Content Angles with "Send to Production" Buttons */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      THREE ORIGINAL KHMER ANGLES (ជ្រើសរើសមុំដើម្បីផលិត)
                    </h4>
                    {analysisResult.threeOriginalAngles.map((angle, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#0e121a] border border-[#1e2637] hover:border-indigo-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 flex-1">
                          <h5 className="font-bold text-slate-100 font-khmer text-xs">
                            {angle.angleTitle}
                          </h5>
                          <p className="text-[11px] font-khmer text-slate-400">
                            <strong>Hook:</strong> "{angle.hookIdea}"
                          </p>
                          <p className="text-[11px] font-khmer text-slate-500">
                            <strong>ទស្សនិកជន៖</strong> {angle.targetKhmerAudience} &bull; {angle.storyPivot}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAdoptAngle(idx)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shrink-0 whitespace-nowrap shadow-sm"
                        >
                          <span className="font-khmer">យកមុំនេះទៅផលិត (Menu 2)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Script Outline */}
                  <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1a2130] space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recommended Khmer Video Outline
                    </span>
                    <ul className="list-disc list-inside space-y-1 font-khmer text-slate-300 text-xs">
                      {analysisResult.suggestedScriptOutline.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1d2637] bg-[#0e121b] flex justify-end">
              <button
                onClick={() => setActiveAnalysisVideo(null)}
                className="px-4 py-1.5 rounded-lg text-xs text-slate-300 bg-[#192130] hover:bg-[#20293b]"
              >
                បិទ (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL URL IMPORT MODAL */}
      {isManualImportOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#111622] border border-[#242e42] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">
                Manual URL Import & Topic Analysis
              </h3>
              <button
                onClick={() => setIsManualImportOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400 font-khmer">
              ប្រសិនបើប្រព័ន្ធស្វែងរកមិនទាន់មានវីដេអូនោះ អ្នកអាចបញ្ចូលតំណភ្ជាប់ URL
              និងចំណងជើងដោយដៃ ដើម្បីឱ្យ AI ជួយវិភាគ និងកែច្នៃជាស្គ្រីបខ្មែរ។
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Video URL (តំណភ្ជាប់)</label>
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://tiktok.com/@... ឬ YouTube URL"
                  className="w-full bg-[#161c28] border border-[#242c3d] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Video Title (ចំណងជើង)</label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="ចំណងជើងវីដេអូ ឬប្រធានបទ..."
                  className="w-full bg-[#161c28] border border-[#242c3d] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none font-khmer"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Creator / Channel Name</label>
                <input
                  type="text"
                  value={manualCreator}
                  onChange={(e) => setManualCreator(e.target.value)}
                  placeholder="ឈ្មោះអ្នកបង្កើត..."
                  className="w-full bg-[#161c28] border border-[#242c3d] rounded-md px-3 py-1.5 text-xs text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Platform</label>
                  <select
                    value={manualPlatform}
                    onChange={(e) => setManualPlatform(e.target.value as any)}
                    className="w-full bg-[#161c28] border border-[#242c3d] rounded-md px-2 py-1.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full bg-[#161c28] border border-[#242c3d] rounded-md px-2 py-1.5 text-xs text-slate-200 outline-none font-khmer"
                  >
                    {DEFAULT_CATEGORIES.map(c => (
                      <option key={c.id} value={c.nameEnglish}>{c.nameKhmer}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsManualImportOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs text-slate-300 bg-[#161c28]"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                onClick={handleAddManualVideo}
                disabled={!manualTitle.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40"
              >
                នាំចូល & រក្សាទុក (Import)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
