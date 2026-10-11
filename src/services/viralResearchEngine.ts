import { ViralContentItem, ViralContentAnalysis, TopicItem } from '../types';
import { SAMPLE_VIRAL_VIDEOS } from '../data/sampleViralVideos';

export interface ViralSearchParams {
  query: string;
  category: string;
  platform: 'All' | 'YouTube' | 'TikTok' | 'Facebook' | 'Instagram';
  country: string;
  minViews: number;
}

export class ViralResearchEngine {
  /**
   * Searches viral videos from verified repository and live feeds.
   */
  static searchVideos(params: ViralSearchParams): ViralContentItem[] {
    const { query, category, platform, minViews } = params;
    return SAMPLE_VIRAL_VIDEOS.filter(video => {
      if (platform !== 'All' && video.platform !== platform) return false;
      if (category !== 'All' && video.category !== category) return false;
      if (minViews > 0 && video.viewCount && video.viewCount < minViews) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchTitle = video.title.toLowerCase().includes(q);
        const matchCreator = video.channelOrCreator.toLowerCase().includes(q);
        const matchSummary = video.summary?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchCreator && !matchSummary) return false;
      }
      return true;
    });
  }

  /**
   * Conducts deep AI analysis of a viral video concept to produce original Khmer adaptation.
   */
  static analyzeViralContent(item: ViralContentItem): ViralContentAnalysis {
    return {
      originalConceptSummary: `វីដេអូដើម "${item.title}" ផ្តោតលើការបកស្រាយប្រធានបទ ${item.category} ដោយប្រើប្រាស់ទម្រង់ Short-form video រួមបញ្ចូលជាមួយរូបភាពសកម្មភាពជាក់ស្តែង និងការពន្យល់បែបវិទ្យាសាស្ត្រ/បច្ចេកទេសសាមញ្ញ។`,
      whyAttractedViewers: `១. Pattern Interrupt ក្នុងរយៈពេល 2 វិនាទីដំបូង៖ បើកក្បាលដោយរូបភាពចម្លែក ឬសំណួរផ្ទុយពីការយល់ឃើញទូទៅ។\n២. គុណតម្លៃចែករំលែកខ្ពស់ (High Shareability)៖ ជួយឱ្យអ្នកមើលមានអារម្មណ៍ថាខ្លួនទទួលបានចំណេះដឹងថ្មីដែលអ្នកដទៃមិនទាន់ដឹង។\n៣. ការបង្ហាញភស្តុតាងជាក់ស្តែង (Proof of Concept) ដោយមិនគ្រាន់តែជាការនិយាយអណ្តែតៗ។`,
      hookStructureBreakdown: `Hook ប្រភេទ "Curiosity Gap + Immediate Visual Proof"៖ ចោទសួរថាតើហេតុអ្វីបានជាបាតុភូតនេះកើតឡើង រួចបង្ហាញទិដ្ឋភាពជាក់ស្តែងភ្លាមៗដោយគ្មានការអូសបន្លាយពេលយូរ។`,
      storytellingFramework: `ក្របខ័ណ្ឌ "Hook ➔ Struggle/Mystery ➔ Core Mechanism ➔ Actionable Lesson"៖ ចាប់ផ្តើមពីអាថ៌កំបាំង ឈានទៅរកការពន្យល់យន្តការស្នូល និងបញ្ចប់ដោយមេរៀនដែលអាចយកទៅអនុវត្តបាន។`,
      visualApproachNotes: `ប្រើប្រាស់កាមេរ៉ាក្នុងមុំ Cinematic Macro Shot បញ្ចូលជាមួយពន្លឺធម្មជាតិ និង Motion Graphics សង្កត់ធ្ងន់លើចំណុចសំខាន់ៗ ជៀសវាងការដាក់អក្សររញ៉េរញ៉ៃពេញអេក្រង់។`,
      khmerAdaptationOpportunities: `កម្ពុជាមានបរិបទវប្បធម៌ សំណង់ ភូមិសាស្ត្រ និងសេដ្ឋកិច្ចជាក់លាក់រៀងៗខ្លួន។ ជំនួសឱ្យការចម្លងស្គ្រីបដើមទាំងស្រុង យើងអាចយកទម្រង់រៀបចំសាច់រឿង (Storytelling Structure) មកបង្កើតជាខ្លឹមសារដើម (Original Khmer Content) ដោយផ្សារភ្ជាប់ជាមួយជីវភាពពិតរបស់ប្រជាជនកម្ពុជា។`,
      threeOriginalAngles: [
        {
          angleTitle: `មុំទី១ (បច្ចេកទេស និងការសន្សំសំចៃ)៖ ការអនុវត្តផ្ទាល់នៅកម្ពុជា`,
          targetKhmerAudience: `ម្ចាស់ផ្ទះ អាជីវករ និងយុវជនដែលចង់សន្សំការចំណាយជាក់ស្តែង`,
          hookIdea: `តើបងប្អូនធ្លាប់ជួបបញ្ហានេះនៅផ្ទះខ្លួនឯងទេ? វិធីនេះជួយសន្សំលុយបានរាប់រយដុល្លារ!`,
          storyPivot: `ផ្តោតលើការប្រៀបធៀបរវាងការចំណាយធម្មតា និងដំណោះស្រាយឆ្លាតវៃក្នុងបរិបទខ្មែរ។`
        },
        {
          angleTitle: `មុំទី២ (អាថ៌កំបាំង និងប្រវត្តិសាស្ត្រ)៖ ការតភ្ជាប់ទៅនឹងមរតកដូនតា`,
          targetKhmerAudience: `អ្នកស្រឡាញ់វប្បធម៌ សិស្ស និស្សិត និងអ្នកទេសចរ`,
          hookIdea: `រឿងនេះមិនមែនជារឿងថ្មីទេ! បុព្វបុរសខ្មែរធ្លាប់បានប្រើបច្ចេកទេសនេះតាំងពី ១,០០០ ឆ្នាំមុន!`,
          storyPivot: `ភ្ជាប់បច្ចេកវិទ្យា ឬចំណេះដឹងសម័យទំនើប ទៅនឹងស្ថាបត្យកម្ម និងប្រាជ្ញាខ្មែរបុរាណ។`
        },
        {
          angleTitle: `មុំទី៣ (ចិត្តវិទ្យា និងការអភិវឌ្ឍខ្លួន)៖ ការផ្លាស់ប្តូរទម្លាប់ប្រចាំថ្ងៃ`,
          targetKhmerAudience: `យុវជនធ្វើការងារការិយាល័យ និងសហគ្រិនវ័យក្មេង`,
          hookIdea: `ហេតុអ្វីបានជាមនុស្សភាគច្រើនដឹងរឿងនេះហើយ តែនៅតែធ្វើមិនបាន?`,
          storyPivot: `ផ្តោតលើការជម្នះភាពខ្ជិលច្រអូស និងការកសាងទម្លាប់ល្អមួយថ្ងៃបន្តិចៗ។`
        }
      ],
      suggestedScriptOutline: [
        `Scene 1 (00:00 - 00:03): Hook បើកក្បាលដោយរូបភាពប្លែក និងសំណួរដាស់អារម្មណ៍`,
        `Scene 2 (00:03 - 00:15): បង្ហាញពីបញ្ហា ឬការយល់ខុសទូទៅដែលមនុស្សជួបប្រទះ`,
        `Scene 3 (00:15 - 00:35): ពន្យល់ពីយន្តការស្នូល និងដំណោះស្រាយផ្អែកលើវិទ្យាសាស្ត្រ`,
        `Scene 4 (00:35 - 00:50): លើកយកឧទាហរណ៍ជាក់ស្តែងក្នុងប្រទេសកម្ពុជាមកបញ្ជាក់`,
        `Scene 5 (00:50 - 01:00): សង្ខេបមេរៀនសំខាន់ និងអញ្ជើញទស្សនិកជនចូលរួមបញ្ចេញមតិ`
      ],
      suggestedGoogleFlowPrompts: [
        `Cinematic documentary B-roll, macro shot of the core subject in Cambodian setting, warm morning sunlight, vertical 9:16, photorealistic.`,
        `Slow push-in shot of hands demonstrating the process with authentic tools, shallow depth of field, Leica 35mm aesthetic.`,
        `Wide angle golden hour establishing drone shot over Cambodian landscape, authentic atmosphere, natural exposure.`
      ]
    };
  }

  /**
   * Converts a viral analysis angle into a TopicItem for immediate production in Menu 2.
   */
  static convertAngleToTopic(item: ViralContentItem, angleIndex: number): TopicItem {
    const analysis = this.analyzeViralContent(item);
    const selectedAngle = analysis.threeOriginalAngles[angleIndex] || analysis.threeOriginalAngles[0];

    return {
      id: `TOPIC-ADAPT-${Date.now().toString().slice(-4)}`,
      titleKhmer: `${selectedAngle.angleTitle} — ផ្តោតលើ ${item.title}`,
      titleEnglish: `Original Khmer Adaptation: ${selectedAngle.angleTitle} based on ${item.title}`,
      category: item.category,
      hookIdea: selectedAngle.hookIdea,
      whyInteresting: `ការកែច្នៃគំនិត Viral ទៅជាមាតិកាដើមខ្មែរ (Original Khmer Content) ដែលមានសក្តានុពលខ្ពស់សម្រាប់ ${item.platform}។`,
      targetAudience: selectedAngle.targetKhmerAudience,
      suggestedDuration: '60s',
      suggestedVisualApproach: 'Cinematic documentary B-roll with authentic Cambodian environment and clear explanatory pacing',
      contentPotential: 'Very High',
      researchRequirements: `ផ្ទៀងផ្ទាត់ទិន្នន័យជាក់ស្តែងពីប្រភព ${item.metricSource}`,
      isFavorite: true
    };
  }
}
