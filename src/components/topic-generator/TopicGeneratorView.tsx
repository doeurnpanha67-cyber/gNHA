import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Star,
  ArrowRight,
  Download,
  Trash2,
  Edit2,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { TopicItem, TargetPlatform, VideoDurationOption } from '../../types';
import { DEFAULT_CATEGORIES } from '../../data/defaultCategories';
import { TopicGeneratorEngine } from '../../services/topicGeneratorEngine';
import { ExportService } from '../../services/exportService';

interface TopicGeneratorViewProps {
  topics: TopicItem[];
  onTopicsUpdated: (topics: TopicItem[]) => void;
  onSendToProduction: (topic: TopicItem) => void;
}

export const TopicGeneratorView: React.FC<TopicGeneratorViewProps> = ({
  topics,
  onTopicsUpdated,
  onSendToProduction
}) => {
  // Generation parameters
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORIES[0].nameEnglish);
  const [customCategory, setCustomCategory] = useState<string>('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState<boolean>(false);
  const [targetAudience, setTargetAudience] = useState<string>('យុវជន អ្នកបង្កើតមាតិកា និងសាធារណជនទូទៅ');
  const [platform, setPlatform] = useState<TargetPlatform>('TikTok');
  const [duration, setDuration] = useState<VideoDurationOption>('60s');
  const [language, setLanguage] = useState<string>('Khmer (ភាសាខ្មែរធម្មជាតិ)');
  const [tone, setTone] = useState<string>('Curiosity-driven & Storytelling (ចង់ដឹង & រឿងនិទាន)');
  const [difficulty, setDifficulty] = useState<string>('ទស្សនិកជនទូទៅ (General Audience)');
  const [topicCount, setTopicCount] = useState<10 | 30 | 50 | 100>(100);

  // Generation status
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<{ completed: number; total: number } | null>(null);

  // Table filters & view state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPotential, setFilterPotential] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Modal inspection & editing
  const [inspectingTopic, setInspectingTopic] = useState<TopicItem | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTitleKhmer, setEditTitleKhmer] = useState<string>('');

  const effectiveCategory = isAddingCustomCategory && customCategory.trim()
    ? customCategory.trim()
    : selectedCategory;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress({ completed: 0, total: topicCount });

    try {
      const generated = await TopicGeneratorEngine.generateTopics({
        category: effectiveCategory,
        targetAudience,
        platform,
        duration,
        language,
        tone,
        difficulty,
        count: topicCount,
        onBatchProgress: (completed, total) => {
          setGenerationProgress({ completed, total });
        }
      });

      onTopicsUpdated(generated);
      setCurrentPage(1);
    } catch (e) {
      console.error('Error generating topics', e);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const toggleFavorite = (id: string) => {
    onTopicsUpdated(
      topics.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)
    );
  };

  const deleteTopic = (id: string) => {
    onTopicsUpdated(topics.filter(t => t.id !== id));
  };

  const startEditTitle = (topic: TopicItem) => {
    setEditingTopicId(topic.id);
    setEditTitleKhmer(topic.titleKhmer);
  };

  const saveEditTitle = (id: string) => {
    if (!editTitleKhmer.trim()) return;
    onTopicsUpdated(
      topics.map(t => t.id === id ? { ...t, titleKhmer: editTitleKhmer.trim() } : t)
    );
    setEditingTopicId(null);
  };

  const handleExportCsv = () => {
    const csv = ExportService.generateTopicsCsv(filteredTopics);
    ExportService.downloadFile(csv, `khmer_content_topics_${Date.now()}.csv`, 'text/csv');
  };

  // Filtered topics
  const filteredTopics = topics.filter(t => {
    if (onlyFavorites && !t.isFavorite) return false;
    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    if (filterPotential !== 'All' && t.contentPotential !== filterPotential) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchKhmer = t.titleKhmer.toLowerCase().includes(q);
      const matchEn = t.titleEnglish.toLowerCase().includes(q);
      const matchHook = t.hookIdea.toLowerCase().includes(q);
      if (!matchKhmer && !matchEn && !matchHook) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredTopics.length / pageSize) || 1;
  const paginatedTopics = filteredTopics.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0d12]">
      {/* Configuration Header Panel */}
      <div className="bg-[#10141d] border-b border-[#1c2331] p-5 shrink-0">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>TOPIC GENERATOR (ម៉ាស៊ីនបង្កើតប្រធានបទ)</span>
              </h2>
              <p className="text-xs text-slate-400 font-khmer mt-0.5">
                បង្កើត ១០០ គំនិតមាតិកាដែលប្លែកពីគេ គ្មានស្ទួន ត្រៀមសម្រាប់ការផលិតវីដេអូ Viral
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-sm"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating
                    ? `កំពុងបង្កើត (${generationProgress?.completed || 0}/${generationProgress?.total || topicCount})...`
                    : `GENERATE ${topicCount} TOPICS (បង្កើត ${topicCount} ប្រធានបទ)`}
                </span>
              </button>
            </div>
          </div>

          {/* Configuration Grid Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 pt-2 text-xs">
            {/* Category */}
            <div className="col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Category (ប្រភេទមាតិកា)
              </label>
              <select
                value={isAddingCustomCategory ? 'custom' : selectedCategory}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsAddingCustomCategory(true);
                  } else {
                    setIsAddingCustomCategory(false);
                    setSelectedCategory(e.target.value);
                  }
                }}
                className="w-full bg-[#161c28] border border-[#252f42] rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 outline-none font-khmer"
              >
                {DEFAULT_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.nameEnglish}>
                    {cat.nameKhmer}
                  </option>
                ))}
                <option value="custom">+ បង្កើតប្រភេទផ្ទាល់ខ្លួន (Custom)...</option>
              </select>

              {isAddingCustomCategory && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="បញ្ចូលប្រភេទថ្មី..."
                  className="mt-1.5 w-full bg-[#1b2230] border border-indigo-500/50 rounded-md px-2 py-1 text-xs text-slate-200 outline-none font-khmer"
                />
              )}
            </div>

            {/* Platform */}
            <div className="col-span-1">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Platform (វេទិកា)
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as TargetPlatform)}
                className="w-full bg-[#161c28] border border-[#252f42] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="TikTok">TikTok</option>
                <option value="Facebook Reels">Facebook Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="YouTube Long-form">YouTube Long-form</option>
              </select>
            </div>

            {/* Duration */}
            <div className="col-span-1">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Duration (រយៈពេល)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as VideoDurationOption)}
                className="w-full bg-[#161c28] border border-[#252f42] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="30s">30s (Short)</option>
                <option value="60s">60s (Standard)</option>
                <option value="90s">90s (In-depth)</option>
                <option value="3m">3 Minutes</option>
                <option value="5m">5 Minutes</option>
              </select>
            </div>

            {/* Target Audience */}
            <div className="col-span-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Target Audience (ទស្សនិកជន)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-[#161c28] border border-[#252f42] rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 outline-none font-khmer"
              />
            </div>

            {/* Tone */}
            <div className="col-span-1">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Tone (រចនាប័ទ្ម)
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#161c28] border border-[#252f42] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:border-indigo-500 outline-none"
              >
                <option value="Curiosity-driven">Curiosity & Mystery</option>
                <option value="Direct Explainer">Direct Explainer</option>
                <option value="Dramatic Storytelling">Dramatic Storytelling</option>
                <option value="Friendly Advice">Friendly & Casual</option>
              </select>
            </div>

            {/* Topic Count Selector */}
            <div className="col-span-1">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Batch Count (ចំនួន)
              </label>
              <select
                value={topicCount}
                onChange={(e) => setTopicCount(Number(e.target.value) as 10 | 30 | 50 | 100)}
                className="w-full bg-[#161c28] border border-[#252f42] rounded-md px-2 py-1.5 text-xs text-indigo-400 font-semibold focus:border-indigo-500 outline-none"
              >
                <option value={10}>10 Topics</option>
                <option value={30}>30 Topics</option>
                <option value={50}>50 Topics</option>
                <option value={100}>100 Topics</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Toolbar & Search */}
      <div className="px-5 py-3 bg-[#0d1017] border-b border-[#1c2331] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ស្វែងរកក្នុងតារាង..."
              className="w-full bg-[#141923] border border-[#222a3a] rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none font-khmer"
            />
          </div>

          {/* Potential Filter */}
          <select
            value={filterPotential}
            onChange={(e) => {
              setFilterPotential(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#141923] border border-[#222a3a] rounded-md px-2.5 py-1.5 text-xs text-slate-300 outline-none"
          >
            <option value="All">All Potentials (ទាំងអស់)</option>
            <option value="Very High">Very High Potential</option>
            <option value="High">High Potential</option>
            <option value="Moderate">Moderate Potential</option>
          </select>

          {/* Favorites Only toggle */}
          <button
            onClick={() => {
              setOnlyFavorites(!onlyFavorites);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs transition-colors ${
              onlyFavorites
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-[#141923] border-[#222a3a] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>សំណព្វ ({topics.filter(t => t.isFavorite).length})</span>
          </button>
        </div>

        {/* Right Toolbar: Count & Export */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs">
            បង្ហាញ <span className="font-mono-tabular text-slate-200">{filteredTopics.length}</span> នៃ{' '}
            <span className="font-mono-tabular text-slate-200">{topics.length}</span> ប្រធានបទ
          </span>

          <button
            onClick={handleExportCsv}
            disabled={filteredTopics.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161c28] hover:bg-[#1e2636] border border-[#252f42] text-xs text-slate-300 hover:text-white transition-colors disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Main Topics Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 bg-[#0e1219] border-b border-[#1c2331] text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none z-10">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">Fav</th>
              <th className="py-2.5 px-3 w-20">ID</th>
              <th className="py-2.5 px-3">Video Title (ចំណងជើងវីដេអូខ្មែរ)</th>
              <th className="py-2.5 px-3 w-44">Category</th>
              <th className="py-2.5 px-3 w-28">Potential</th>
              <th className="py-2.5 px-3 w-20">Duration</th>
              <th className="py-2.5 px-3 w-48 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#171d29]">
            {paginatedTopics.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-slate-500 font-khmer">
                  មិនមានប្រធានបទនៅក្នុងបញ្ជីនៅឡើយទេ... ចុច "GENERATE 100 TOPICS" ដើម្បីចាប់ផ្តើម!
                </td>
              </tr>
            ) : (
              paginatedTopics.map((topic) => (
                <tr
                  key={topic.id}
                  className="hover:bg-[#121620] transition-colors group"
                >
                  {/* Favorite Toggle */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => toggleFavorite(topic.id)}
                      className="text-slate-600 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          topic.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  </td>

                  {/* ID */}
                  <td className="py-2.5 px-3 font-mono-tabular text-slate-400 font-medium">
                    {topic.id}
                  </td>

                  {/* Title */}
                  <td className="py-2.5 px-3">
                    {editingTopicId === topic.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editTitleKhmer}
                          onChange={(e) => setEditTitleKhmer(e.target.value)}
                          className="flex-1 bg-[#1a212f] border border-indigo-500 rounded px-2 py-1 text-xs text-white outline-none font-khmer"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditTitle(topic.id)}
                          className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="font-khmer text-slate-200 font-medium line-clamp-1">
                          {topic.titleKhmer}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {topic.hookIdea}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">
                    {topic.category}
                  </td>

                  {/* Potential */}
                  <td className="py-2.5 px-3 font-mono-tabular">
                    <span
                      className={`text-[11px] font-semibold ${
                        topic.contentPotential === 'Very High'
                          ? 'text-emerald-400'
                          : topic.contentPotential === 'High'
                          ? 'text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {topic.contentPotential}
                    </span>
                  </td>

                  {/* Suggested Duration */}
                  <td className="py-2.5 px-3 text-slate-400 font-mono-tabular text-[11px]">
                    {topic.suggestedDuration}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setInspectingTopic(topic)}
                        title="View Full Topic Details"
                        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1a212f] rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => startEditTitle(topic)}
                        title="Edit Title"
                        className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1a212f] rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteTopic(topic.id)}
                        title="Delete Topic"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Primary Transfer Action: SEND TO PRODUCTION */}
                      <button
                        onClick={() => onSendToProduction(topic)}
                        title="Send this topic directly to AI Content Production (Menu 2)"
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[11px] font-semibold transition-all whitespace-nowrap ml-1"
                      >
                        <span className="font-khmer">ផលិត (Create)</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-2.5 bg-[#0d1017] border-t border-[#1c2331] flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span>បង្ហាញក្នុងមួយទំព័រ:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-[#141923] border border-[#222a3a] rounded px-2 py-0.5 text-xs text-slate-200 outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono-tabular">
            ទំព័រ {currentPage} នៃ {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-[#161c28] hover:bg-[#1e2636] border border-[#252f42] text-slate-300 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded bg-[#161c28] hover:bg-[#1e2636] border border-[#252f42] text-slate-300 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {inspectingTopic && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#121620] border border-[#242e40] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono-tabular text-indigo-400">
                  {inspectingTopic.id} &bull; {inspectingTopic.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 font-khmer mt-1">
                  {inspectingTopic.titleKhmer}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {inspectingTopic.titleEnglish}
                </p>
              </div>
              <button
                onClick={() => setInspectingTopic(null)}
                className="text-slate-500 hover:text-slate-300 p-1"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#0b0e14] p-4 rounded-lg border border-[#1b2230]">
              <div>
                <span className="text-slate-500 block mb-1">Opening Hook Idea:</span>
                <p className="font-khmer text-slate-200">{inspectingTopic.hookIdea}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Why Viewers Care:</span>
                <p className="font-khmer text-slate-200">{inspectingTopic.whyInteresting}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Target Audience:</span>
                <p className="font-khmer text-slate-200">{inspectingTopic.targetAudience}</p>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Duration & Potential:</span>
                <p className="text-slate-200">
                  {inspectingTopic.suggestedDuration} &bull; {inspectingTopic.contentPotential}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block mb-1">Suggested Visual Approach:</span>
                <p className="text-slate-300 font-mono text-[11px]">
                  {inspectingTopic.suggestedVisualApproach}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block mb-1">Fact-checking Requirements:</span>
                <p className="font-khmer text-slate-300 text-[11px]">
                  {inspectingTopic.researchRequirements}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setInspectingTopic(null)}
                className="px-4 py-1.5 rounded-lg text-xs text-slate-300 bg-[#1b2230] hover:bg-[#232c3e]"
              >
                បិទ (Close)
              </button>
              <button
                onClick={() => {
                  const t = inspectingTopic;
                  setInspectingTopic(null);
                  onSendToProduction(t);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                <span>បញ្ជូនទៅផលិតមាតិកា (Send to Menu 2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
