export type PrimaryMenu = 'topics' | 'production' | 'research';

export type UtilityModal = 'saved-projects' | 'content-library' | 'export-history' | 'api-connections' | 'settings' | null;

export type TargetPlatform = 'TikTok' | 'Facebook Reels' | 'YouTube Shorts' | 'YouTube Long-form';

export type VideoFormat = '9:16' | '16:9' | '1:1';

export type VideoDurationOption = '30s' | '60s' | '90s' | '3m' | '5m' | 'custom';

export type ContentType = 'educational' | 'documentary' | 'storytelling' | 'explainer' | 'news commentary' | 'entertainment';

export type NarrationStyle = 'friendly' | 'professional' | 'dramatic' | 'documentary' | 'conversational' | 'humorous';

export type PresenterType = 'on-camera presenter' | 'voice-over only' | 'AI character';

export type VisualStyle = 'cinematic' | 'realistic' | 'documentary' | '3D animation' | 'historical reconstruction' | 'modern commercial';

export interface TopicItem {
  id: string;
  titleKhmer: string;
  titleEnglish: string;
  category: string;
  hookIdea: string;
  whyInteresting: string;
  targetAudience: string;
  suggestedDuration: string;
  suggestedVisualApproach: string;
  contentPotential: 'Very High' | 'High' | 'Moderate';
  researchRequirements: string;
  isFavorite?: boolean;
  notes?: string;
}

export interface ViralHookOption {
  id: string;
  hookKhmer: string;
  hookEnglish: string;
  technique: string;
  retentionRationale: string;
  isRecommended: boolean;
  whyRecommended?: string;
}

export interface ScriptScene {
  sceneNumber: number;
  startTime: string;
  endTime: string;
  narrationKhmer: string;
  narrationEnglishGuide: string;
  emotionalDelivery: string;
  suggestedFootage: string;
  onScreenTextKhmer?: string;
  onScreenTextEnglish?: string;
  paceSeconds: number;
}

export interface ProofreadDiff {
  originalText: string;
  improvedText: string;
  changeExplanation: string;
  category: 'spelling' | 'natural phrasing' | 'grammar' | 'terminology' | 'fact check';
  needsHumanVerification: boolean;
}

export interface GoogleFlowPrompt {
  sceneNumber: number;
  durationSeconds: number;
  purpose: string;
  mainSubject: string;
  locationAndEnvironment: string;
  subjectMovement: string;
  cameraMovement: string;
  cameraAngleFraming: string;
  lensAndDof: string;
  lighting: string;
  colorGrading: string;
  atmosphere: string;
  visualStyle: string;
  aspectRatio: string;
  continuityInstructions: string;
  negativeConstraints: string;
  fullPromptEnglish: string;
}

export interface EditingTimelineItem {
  order: number;
  sceneNumber: number;
  clipDuration: string;
  matchingNarrationSummary: string;
  transitionEffect: string;
  cameraMotionEffect: string;
  soundEffectsCues: string;
  backgroundMusicMood: string;
  pauseEmphasisPoint: string;
  subtitlePlacement: string;
  pacingNote: string;
}

export interface VoiceSoundDesign {
  voicePersonality: string;
  speakingSpeed: string;
  emotionalTone: string;
  pronunciationNotes: string[];
  pausePacingGuidance: string;
  emphasisWordRules: string;
  suggestedSfxCues: string[];
  backgroundMusicStyle: string;
}

export interface FactCheckItem {
  claim: string;
  status: 'verified' | 'speculation' | 'needs-confirmation';
  sourceReference: string;
  verificationInstructions: string;
  severity: 'critical' | 'informational';
}

export interface CompleteContentPackage {
  id: string;
  titleKhmer: string;
  titleEnglish: string;
  topicId?: string;
  category: string;
  targetPlatform: TargetPlatform;
  videoDuration: VideoDurationOption;
  customDurationSeconds?: number;
  videoFormat: VideoFormat;
  contentType: ContentType;
  narrationStyle: NarrationStyle;
  presenter: PresenterType;
  visualStyle: VisualStyle;
  bRollSceneCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Package Sub-components
  hooks: ViralHookOption[];
  script: ScriptScene[];
  proofreadDifs: ProofreadDiff[];
  languageQualityNotes: {
    spellingStatus: string;
    naturalPhrasingRating: string;
    humanVerificationFlags: string[];
  };
  flowPrompts: GoogleFlowPrompt[];
  editingPlan: EditingTimelineItem[];
  voiceSoundDesign: VoiceSoundDesign;
  factChecking: FactCheckItem[];
}

export interface ViralContentItem {
  id: string;
  title: string;
  channelOrCreator: string;
  platform: 'YouTube' | 'TikTok' | 'Facebook' | 'Instagram';
  videoUrl: string;
  thumbnailUrl: string;
  publishedDate: string;
  viewCount: number | null;
  likeCount: number | null;
  commentCount: number | null;
  engagementRate: string | null;
  retrievalTimestamp: string;
  metricSource: string;
  isPublicEstimate?: boolean;
  category: string;
  language: string;
  country: string;
  summary?: string;
}

export interface ViralContentAnalysis {
  originalConceptSummary: string;
  whyAttractedViewers: string;
  hookStructureBreakdown: string;
  storytellingFramework: string;
  visualApproachNotes: string;
  khmerAdaptationOpportunities: string;
  threeOriginalAngles: {
    angleTitle: string;
    targetKhmerAudience: string;
    hookIdea: string;
    storyPivot: string;
  }[];
  suggestedScriptOutline: string[];
  suggestedGoogleFlowPrompts: string[];
}

export interface ProjectSummary {
  id: string;
  title: string;
  category: string;
  platform: TargetPlatform;
  duration: string;
  updatedAt: string;
  data: CompleteContentPackage;
}

export interface AppSettings {
  aiEngine: 'gemini' | 'claude';
  anthropicApiKey: string;
  geminiApiKey: string;
  youtubeApiKey: string;
  defaultPlatform: TargetPlatform;
  defaultDuration: VideoDurationOption;
  khmerFontSize: 'normal' | 'large' | 'extra-large';
  tokenUsageCount: number;
  estimatedCostUsd: number;
  autoSaveIntervalSec: number;
}
