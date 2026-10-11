import React, { useState, useEffect } from 'react';
import { WindowTitleBar } from './components/common/WindowTitleBar';
import { Sidebar } from './components/common/Sidebar';
import { TopNav } from './components/common/TopNav';
import { TopicGeneratorView } from './components/topic-generator/TopicGeneratorView';
import { ContentProductionView } from './components/content-production/ContentProductionView';
import { ViralResearchView } from './components/viral-research/ViralResearchView';
import { UtilityModals } from './components/utilities/UtilityModals';
import {
  PrimaryMenu,
  UtilityModal,
  TopicItem,
  CompleteContentPackage,
  AppSettings
} from './types';
import { SEED_TOPICS } from './data/curatedKhmerTopics';
import { StorageService, DEFAULT_SETTINGS } from './services/storageService';
import { ContentProductionEngine } from './services/contentProductionEngine';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<PrimaryMenu>('topics');
  const [activeUtilityModal, setActiveUtilityModal] = useState<UtilityModal>(null);

  // Topics state
  const [topics, setTopics] = useState<TopicItem[]>(() => {
    return SEED_TOPICS.map((t, idx) => ({
      ...t,
      id: `TOPIC-${String(idx + 1).padStart(3, '0')}`
    }));
  });

  // Selected topic passed directly into Content Production
  const [selectedTopicForProduction, setSelectedTopicForProduction] = useState<TopicItem | null>(
    topics[0] || null
  );

  // Active production package
  const [currentPackage, setCurrentPackage] = useState<CompleteContentPackage | null>(() => {
    if (topics[0]) {
      return ContentProductionEngine.generateCompletePackage({
        topic: topics[0],
        targetPlatform: 'TikTok',
        videoDuration: '60s',
        videoFormat: '9:16',
        contentType: 'documentary',
        narrationStyle: 'conversational',
        presenter: 'voice-over only',
        visualStyle: 'cinematic',
        bRollSceneCount: 6
      });
    }
    return null;
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [savedProjectsCount, setSavedProjectsCount] = useState<number>(() => StorageService.getProjects().length);

  // Search filter across navigation
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Handle Send to Production transition from Menu 1 or Menu 3
  const handleSendToProduction = (topic: TopicItem) => {
    setSelectedTopicForProduction(topic);
    // Generate fresh complete package for this topic
    const newPackage = ContentProductionEngine.generateCompletePackage({
      topic,
      targetPlatform: settings.defaultPlatform || 'TikTok',
      videoDuration: settings.defaultDuration || '60s',
      videoFormat: '9:16',
      contentType: 'documentary',
      narrationStyle: 'conversational',
      presenter: 'voice-over only',
      visualStyle: 'cinematic',
      bRollSceneCount: 6
    });

    setCurrentPackage(newPackage);
    setActiveMenu('production');
    setHasUnsavedChanges(true);
  };

  const handleSaveCurrentProject = () => {
    if (currentPackage) {
      StorageService.saveProject(currentPackage);
      setHasUnsavedChanges(false);
      setSavedProjectsCount(StorageService.getProjects().length);
    }
  };

  const handleNewProject = () => {
    if (topics[0]) {
      const freshPackage = ContentProductionEngine.generateCompletePackage({
        topic: {
          ...topics[0],
          id: `TOPIC-${Date.now().toString().slice(-4)}`,
          titleKhmer: 'ប្រធានបទថ្មី (New Draft Topic)',
          titleEnglish: 'New Content Project'
        },
        targetPlatform: settings.defaultPlatform || 'TikTok',
        videoDuration: settings.defaultDuration || '60s',
        videoFormat: '9:16',
        contentType: 'documentary',
        narrationStyle: 'conversational',
        presenter: 'voice-over only',
        visualStyle: 'cinematic',
        bRollSceneCount: 6
      });
      setCurrentPackage(freshPackage);
      setActiveMenu('production');
      setHasUnsavedChanges(true);
    }
  };

  const handleOpenSavedProject = (pkg: CompleteContentPackage) => {
    setCurrentPackage(pkg);
    setActiveMenu('production');
    setHasUnsavedChanges(false);
  };

  // Auto-save logic
  useEffect(() => {
    if (!currentPackage || !hasUnsavedChanges) return;
    const timer = setTimeout(() => {
      StorageService.saveProject(currentPackage);
      setHasUnsavedChanges(false);
      setSavedProjectsCount(StorageService.getProjects().length);
    }, (settings.autoSaveIntervalSec || 30) * 1000);

    return () => clearTimeout(timer);
  }, [currentPackage, hasUnsavedChanges, settings.autoSaveIntervalSec]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c0e12] select-none text-slate-100">
      {/* Windows Desktop Title Bar */}
      <WindowTitleBar
        currentProjectTitle={currentPackage?.titleKhmer}
        isOnline={true}
      />

      {/* Main Studio Body: Sidebar + Workspace Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (3 Primary Menus + Utilities) */}
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={(menu) => setActiveMenu(menu)}
          onOpenUtility={(utility) => setActiveUtilityModal(utility)}
          savedProjectsCount={savedProjectsCount}
        />

        {/* Center Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0a0d13]">
          {/* Top Navigation */}
          <TopNav
            activeMenu={activeMenu}
            projectName={currentPackage ? currentPackage.titleKhmer : ''}
            onNewProject={handleNewProject}
            onSaveCurrent={handleSaveCurrentProject}
            hasUnsavedChanges={hasUnsavedChanges}
            onSearchInput={setGlobalSearch}
            searchTerm={globalSearch}
          />

          {/* View Container */}
          <main className="flex-1 overflow-hidden relative">
            {activeMenu === 'topics' && (
              <TopicGeneratorView
                topics={topics}
                onTopicsUpdated={(newTopics) => {
                  setTopics(newTopics);
                }}
                onSendToProduction={handleSendToProduction}
              />
            )}

            {activeMenu === 'production' && (
              <ContentProductionView
                currentPackage={currentPackage}
                onPackageUpdated={(pkg) => {
                  setCurrentPackage(pkg);
                  setHasUnsavedChanges(true);
                }}
                selectedTopicForProduction={selectedTopicForProduction}
              />
            )}

            {activeMenu === 'research' && (
              <ViralResearchView
                onSendToProduction={handleSendToProduction}
              />
            )}
          </main>
        </div>
      </div>

      {/* Utilities & Settings Modal Popups */}
      <UtilityModals
        activeModal={activeUtilityModal}
        onClose={() => setActiveUtilityModal(null)}
        currentPackage={currentPackage}
        onOpenProject={handleOpenSavedProject}
        settings={settings}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}
