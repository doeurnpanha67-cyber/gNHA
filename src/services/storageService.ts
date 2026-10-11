import { CompleteContentPackage, AppSettings, ProjectSummary } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'khmer_studio_projects_v1',
  SETTINGS: 'khmer_studio_settings_v1',
  SAVED_TOPICS: 'khmer_studio_saved_topics_v1'
};

export const DEFAULT_SETTINGS: AppSettings = {
  aiEngine: 'gemini',
  anthropicApiKey: '',
  geminiApiKey: '',
  youtubeApiKey: '',
  defaultPlatform: 'TikTok',
  defaultDuration: '60s',
  khmerFontSize: 'normal',
  tokenUsageCount: 4280,
  estimatedCostUsd: 0.08,
  autoSaveIntervalSec: 30
};

export class StorageService {
  static getProjects(): ProjectSummary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveProject(pkg: CompleteContentPackage): void {
    try {
      const projects = this.getProjects();
      const existingIdx = projects.findIndex(p => p.id === pkg.id);
      const summary: ProjectSummary = {
        id: pkg.id,
        title: pkg.titleKhmer,
        category: pkg.category,
        platform: pkg.targetPlatform,
        duration: pkg.videoDuration,
        updatedAt: new Date().toISOString(),
        data: pkg
      };

      if (existingIdx >= 0) {
        projects[existingIdx] = summary;
      } else {
        projects.unshift(summary);
      }
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save project to localStorage', e);
    }
  }

  static deleteProject(id: string): void {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  static duplicateProject(id: string): ProjectSummary | null {
    const projects = this.getProjects();
    const source = projects.find(p => p.id === id);
    if (!source) return null;

    const newId = `PROJECT-${Date.now()}`;
    const duplicatedPkg: CompleteContentPackage = {
      ...source.data,
      id: newId,
      titleKhmer: `${source.data.titleKhmer} (ចម្លង)`,
      titleEnglish: `${source.data.titleEnglish} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveProject(duplicatedPkg);
    return {
      id: newId,
      title: duplicatedPkg.titleKhmer,
      category: duplicatedPkg.category,
      platform: duplicatedPkg.targetPlatform,
      duration: duplicatedPkg.videoDuration,
      updatedAt: duplicatedPkg.updatedAt,
      data: duplicatedPkg
    };
  }

  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  static recordUsage(tokens: number, costEstimate: number): void {
    const settings = this.getSettings();
    settings.tokenUsageCount += tokens;
    settings.estimatedCostUsd = parseFloat((settings.estimatedCostUsd + costEstimate).toFixed(4));
    this.saveSettings(settings);
  }
}
