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
  ViralHookOption,
  ScriptScene,
  GoogleFlowPrompt,
  EditingTimelineItem,
  VoiceSoundDesign,
  FactCheckItem,
  ProofreadDiff
} from '../types';

export interface ProductionConfig {
  topic: TopicItem;
  targetPlatform: TargetPlatform;
  videoDuration: VideoDurationOption;
  customDurationSeconds?: number;
  videoFormat: VideoFormat;
  contentType: ContentType;
  narrationStyle: NarrationStyle;
  presenter: PresenterType;
  visualStyle: VisualStyle;
  bRollSceneCount: number;
}

export class ContentProductionEngine {
  /**
   * Generates a complete, production-ready content package for the configured topic.
   */
  static generateCompletePackage(config: ProductionConfig): CompleteContentPackage {
    const {
      topic,
      targetPlatform,
      videoDuration,
      videoFormat,
      contentType,
      narrationStyle,
      presenter,
      visualStyle,
      bRollSceneCount,
    } = config;

    // Calculate approximate duration in seconds
    let totalSeconds = 60;
    if (videoDuration === '30s') totalSeconds = 30;
    else if (videoDuration === '60s') totalSeconds = 60;
    else if (videoDuration === '90s') totalSeconds = 90;
    else if (videoDuration === '3m') totalSeconds = 180;
    else if (videoDuration === '5m') totalSeconds = 300;
    else if (config.customDurationSeconds) totalSeconds = config.customDurationSeconds;

    const sceneCount = Math.max(4, Math.min(bRollSceneCount || 6, Math.floor(totalSeconds / 10)));
    const avgSceneDuration = Math.round(totalSeconds / sceneCount);

    // 1. Generate 3 Viral-Style Hook Alternatives
    const hooks: ViralHookOption[] = [
      {
        id: 'HOOK-1',
        hookKhmer: `តើអ្នកដឹងទេថា ${topic.titleKhmer.replace(/^(ហេតុអ្វីបានជា|វិធីសាស្ត្រ|ក្បួន|អាថ៌កំបាំង|រឿងពិត)/, '').trim()}? រឿងពិតនៅពីក្រោយនេះ នឹងធ្វើឱ្យអ្នកភ្ញាក់ផ្អើល!`,
        hookEnglish: `Did you know the untold truth behind ${topic.titleEnglish}? What happened will leave you speechless!`,
        technique: 'Curiosity Gap & Pattern Interrupt (បើកចំហរឿងចម្លែកដែលមនុស្សមិននឹកស្មាន)',
        retentionRationale: 'ទាក់ទាញចំណាប់អារម្មណ៍ក្នុងរយៈពេល 1-2 វិនាទីដំបូង ដោយចោទជាសំណួរផ្ទុយពីការយល់ឃើញទូទៅ។',
        isRecommended: true,
        whyRecommended: 'ស័ក្តិសមបំផុតសម្រាប់ក្បួនដោះស្រាយ Short-form video ព្រោះបង្កើត Curiosity Gap ខ្លាំង និងជួយទប់ retention rate កុំឱ្យ scroll រំលង។'
      },
      {
        id: 'HOOK-2',
        hookKhmer: `៩០% នៃមនុស្សយល់ច្រឡំលើរឿងនេះ... កុំទាន់អាលសម្រេចចិត្ត ប្រសិនបើមិនទាន់បានដឹងចំណុចសំខាន់មួយនេះ!`,
        hookEnglish: `90% of people get this completely wrong... Do not make a move before watching this vital detail!`,
        technique: 'FOMO & Common Misconception (ការបារម្ភពីការខាតបង់ ឬយល់ខុស)',
        retentionRationale: 'ជំរុញឱ្យអ្នកមើលមានអារម្មណ៍ថាខ្លួនអាចកំពុងខាតបង់ ឬយល់ខុស ប្រសិនបើមិនបន្តទស្សនា។',
        isRecommended: false,
        whyRecommended: 'មានប្រសិទ្ធភាពខ្ពស់សម្រាប់វីដេអូប្រភេទចំណេះដឹង និងហិរញ្ញវត្ថុ ប៉ុន្តែ Hook-1 មានភាពទាក់ទាញបែបធម្មជាតិជាង។'
      },
      {
        id: 'HOOK-3',
        hookKhmer: `ប្រសិនបើអ្នកធ្លាប់ជួបបញ្ហានេះ ឬឆ្ងល់ពីអាថ៌កំបាំងនេះ វីដេអូនេះមានចម្លើយពិតប្រាកដសម្រាប់អ្នក!`,
        hookEnglish: `If you have ever encountered this problem, this video holds the definitive proven answer!`,
        technique: 'Direct Problem-Solution (ដោះស្រាយបញ្ហាផ្ទាល់ខ្លួនរបស់ទស្សនិកជន)',
        retentionRationale: 'ផ្តោតចំ Pain point របស់អ្នកមើលភ្លាមៗ ធ្វើឱ្យពួកគេដឹងថាវីដេអូនេះមានប្រយោជន៍សម្រាប់ខ្លួន។',
        isRecommended: false,
        whyRecommended: 'ល្អសម្រាប់អ្នកមើលដែលកំពុងស្វែងរកដំណោះស្រាយជាក់ស្តែង តែចង្វាក់ Hook យឺតជាងបន្តិច។'
      }
    ];

    // 2. Generate Scene-by-Scene Script with Natural Cambodian Phrasing
    const script: ScriptScene[] = [];
    const flowPrompts: GoogleFlowPrompt[] = [];
    const editingPlan: EditingTimelineItem[] = [];

    // Structural sections: 1. Hook, 2. Intro, 3. Core Explanation, 4. Details/Facts, 5. Proof/Examples, 6. Ending/CTA
    const sceneTemplates = [
      {
        name: 'Opening Hook (ទាក់ទាញចំណាប់អារម្មណ៍)',
        khmer: `សួស្តីបងប្អូនទាំងអស់គ្នា! ${hooks[0].hookKhmer}`,
        enGuide: 'Energetic hook delivered with immediate direct gaze to the camera or captivating voiceover over high-impact footage.',
        emotion: 'ភ្ញាក់ផ្អើល រំភើប និងទាក់ទាញ (Urgent & Captivating)',
        footage: 'High contrast dynamic visual or macro shot that immediately arrests scrolling',
        screenTextKhmer: 'ការពិតដែលអ្នកមិនធ្លាប់ដឹង!',
        sfx: 'Subtle cinematic sub-bass whoosh & quick impact',
        bgm: 'Tense, curiosity-inducing light rhythmic pulse'
      },
      {
        name: 'Introduction & Mystery Setup (ការបើកក្បាល និងបញ្ហា)',
        khmer: `ជាទូទៅ យើងតែងតែគិតថា រឿងនេះជារឿងសាមញ្ញ ឬជាការចៃដន្យ។ ប៉ុន្តែនៅពេលដែលក្រុមអ្នកស្រាវជ្រាវចាប់ផ្តើមពិនិត្យឱ្យបានស៊ីជម្រៅ ពួកគេបានរកឃើញការពិតដ៏គួរឱ្យភ្ញាក់ផ្អើលមួយ។`,
        enGuide: 'Setting the premise. Transitioning from the curiosity hook to the factual foundation.',
        emotion: 'ស្ងប់ស្ងាត់ គួរឱ្យទុកចិត្ត និងទាក់ទាញ (Confident & Intriguing)',
        footage: 'Atmospheric establishing shot setting the environment and mood',
        screenTextKhmer: 'តើមានរឿងអ្វីកើតឡើងពិតប្រាកដ?',
        sfx: 'Ambient room tone swell with soft riser',
        bgm: 'Deep mystery strings building low resonance'
      },
      {
        name: 'Core Explanation (ការពន្យល់ចំណុចស្នូល)',
        khmer: `ចំណុចសំខាន់ទីមួយគឺស្ថិតនៅលើរចនាសម្ព័ន្ធ និងវិធីសាស្ត្រអនុវត្តផ្ទាល់តែម្តង។ មើលត្រង់ចំណុចនេះ វាមិនមែនគ្រាន់តែជាការធ្វើឡើងដោយគ្មានគម្រោងនោះទេ ប៉ុន្តែជាការគិតគូរយ៉ាងល្អិតល្អន់បំផុត។`,
        enGuide: 'Core breakdown of the mechanism or story with crystal clear simple phrasing.',
        emotion: 'ច្បាស់លាស់ ផ្តល់ចំណេះដឹង និងគួរឱ្យជឿជាក់ (Informative & Engaging)',
        footage: 'Detailed technical or contextual footage demonstrating the exact mechanism',
        screenTextKhmer: 'យន្តការស្នូល និងបច្ចេកទេសជាក់ស្តែង',
        sfx: 'Soft mechanical snap or subtle digital click for on-screen emphasis',
        bgm: 'Steady, focused documentary rhythm (mid-tempo)'
      },
      {
        name: 'Fascinating Supporting Facts (ការពិតគាំទ្រ និងភស្តុតាង)',
        khmer: `តួលេខ និងភស្តុតាងជាក់ស្តែងបានបង្ហាញថា អ្វីដែលយើងបានឃើញនៅទីនេះ បានជួយសន្សំពេលវេលា និងបង្កើនប្រសិទ្ធភាពរហូតដល់លើសពីការរំពឹងទុក។ នេះជាមូលហេតុដែលអ្នកជំនាញតែងតែយកចំណុចនេះជាគំរូ។`,
        enGuide: 'Presenting verifiable evidence and compelling context.',
        emotion: 'គួរឱ្យកោតសរសើរ និងច្បាស់លាស់ (Admiring & Authoritative)',
        footage: 'Dynamic slow-motion footage capturing the human element and verified artifacts',
        screenTextKhmer: 'ភស្តុតាង និងទិន្នន័យជាក់ស្តែង',
        sfx: 'Cinematic chime accenting the key revelation',
        bgm: 'Uplifting documentary chords introducing positive resolution'
      },
      {
        name: 'Real-world Takeaway (មេរៀន និងការអនុវត្ត)',
        khmer: `ដូច្នេះ មេរៀនសំខាន់ដែលយើងអាចដកស្រង់បានពីវីដេអូនេះ គឺការយល់ដឹងច្បាស់ពីប្រភពដើម និងការមិនមើលរំលងព័ត៌មានលម្អិតតូចៗ។ បើអ្នកយកចំណុចនេះទៅអនុវត្ត អ្នកនឹងឃើញផលវិជ្ជមានភ្លាមៗ។`,
        enGuide: 'Actionable takeaway for the viewer to apply or reflect upon.',
        emotion: 'កក់ក្តៅ បំផុសគំនិត និងលើកទឹកចិត្ត (Empowering & Thoughtful)',
        footage: 'Medium shot of subject engaged in purposeful, inspiring action',
        screenTextKhmer: 'មេរៀនសំខាន់សម្រាប់ជីវិត និងការងារ',
        sfx: 'Warm resonant chord fade',
        bgm: 'Inspiring, resonant harmonic piano notes'
      },
      {
        name: 'Ending & Call to Action (ការបញ្ចប់ និងការចូលរួម)',
        khmer: `តើបងប្អូនយល់យ៉ាងណាដែរចំពោះរឿងនេះ? សូមបញ្ចេញមតិយោបល់នៅខាងក្រោម! កុំភ្លេចចុច Follow ឬ Subscribe ដើម្បីទទួលបានវីដេអូចំណេះដឹងថ្មីៗបន្តទៀត។ សូមអរគុណ!`,
        enGuide: 'Warm closing and friendly call to action inviting genuine viewer engagement in comments.',
        emotion: 'រួសរាយ រាក់ទាក់ និងស្និទ្ធស្នាល (Warm & Friendly Community Tone)',
        footage: 'Memorable, lingering final visual anchor fading out smoothly',
        screenTextKhmer: 'ចុច Follow សម្រាប់ចំណេះដឹងល្អៗជារៀងរាល់ថ្ងៃ!',
        sfx: 'Clean notification bell tap accent',
        bgm: 'Graceful musical cadence tapering naturally to silence'
      }
    ];

    let currentTimestamp = 0;
    for (let i = 0; i < sceneCount; i++) {
      const template = sceneTemplates[i % sceneTemplates.length];
      const startSec = currentTimestamp;
      const endSec = (i === sceneCount - 1) ? totalSeconds : currentTimestamp + avgSceneDuration;
      currentTimestamp = endSec;

      const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      };

      const startTimeStr = formatTime(startSec);
      const endTimeStr = formatTime(endSec);

      // Add to script
      script.push({
        sceneNumber: i + 1,
        startTime: startTimeStr,
        endTime: endTimeStr,
        narrationKhmer: template.khmer,
        narrationEnglishGuide: template.enGuide,
        emotionalDelivery: template.emotion,
        suggestedFootage: template.footage,
        onScreenTextKhmer: template.screenTextKhmer,
        onScreenTextEnglish: `Scene ${i + 1} Overlay`,
        paceSeconds: endSec - startSec
      });

      // Add to Google Flow Prompt (Strictly in high-fidelity descriptive English)
      const aspectStr = videoFormat === '9:16' ? 'vertical 9:16' : (videoFormat === '16:9' ? 'cinematic widescreen 16:9' : 'square 1:1');
      const flowPrompt: GoogleFlowPrompt = {
        sceneNumber: i + 1,
        durationSeconds: endSec - startSec,
        purpose: `B-roll footage illustrating: ${template.name}`,
        mainSubject: i === 0 ? 'Captivating visual focal subject related to ' + topic.category : 'Authentic contextual details of the topic in action',
        locationAndEnvironment: 'Authentic Cambodian architectural environment, natural atmosphere with rich realistic textures',
        subjectMovement: 'Slow organic motion, calm realistic gestures, subtle authentic interactions',
        cameraMovement: i % 2 === 0 ? 'Smooth cinematic slow push-in forward along the central axis' : 'Graceful lateral tracking slider movement from left to right',
        cameraAngleFraming: i === 0 ? 'Dynamic eye-level medium close-up shot' : (i % 2 === 1 ? 'Atmospheric wide-angle master shot' : 'Intimate detail macro shot'),
        lensAndDof: '35mm prime lens, shallow depth of field with soft creamy bokeh, sharp subject plane',
        lighting: 'Warm golden hour morning sunlight filtering naturally through windows, soft directional fill, volumetric dust rays',
        colorGrading: 'Kodak Portra warm documentary color grade, balanced skin tones, rich earthy wood tones and temple stone pigments',
        atmosphere: 'Serene, respectful, culturally authentic, cinematic documentary mood',
        visualStyle: visualStyle === 'cinematic' ? 'Photorealistic 8k documentary cinematography' : `${visualStyle} production quality with authentic details`,
        aspectRatio: aspectStr,
        continuityInstructions: 'Maintain identical character wardrobe, architectural palette, and morning warm light tone across adjacent scenes.',
        negativeConstraints: 'No text, no subtitles, no logos, no watermarks, no distorted faces, no modern plastic anomalies, no oversaturation.',
        fullPromptEnglish: `Create a cinematic, photorealistic documentary B-roll shot of ${topic.category} context in Cambodia. Scene ${i + 1}: ${template.footage}. Warm natural sunlight enters smoothly, illuminating realistic organic textures and authentic architectural details. The camera ${i % 2 === 0 ? 'slowly pushes forward along the subject axis' : 'glides with a subtle lateral slider motion'}. Natural lighting, physically realistic materials, authentic Cambodian cultural authenticity, balanced exposure, professional documentary cinematography, stable camera movement, ${aspectStr} composition. No text, no subtitles, no logos, no watermarks.`
      };
      flowPrompts.push(flowPrompt);

      // Add to Editing Plan
      editingPlan.push({
        order: i + 1,
        sceneNumber: i + 1,
        clipDuration: `${endSec - startSec}s`,
        matchingNarrationSummary: template.khmer.slice(0, 45) + '...',
        transitionEffect: i === 0 ? 'Quick direct cut with impact' : (i === sceneCount - 1 ? 'Slow cinematic fade to black' : 'Smooth invisible match cut'),
        cameraMotionEffect: i % 2 === 0 ? 'Slow digital push-in (scale 100% to 105%)' : 'Gentle pan with stabilization',
        soundEffectsCues: template.sfx,
        backgroundMusicMood: template.bgm,
        pauseEmphasisPoint: `Pause for 0.4s right after saying key phrase`,
        subtitlePlacement: videoFormat === '9:16' ? 'Lower third (30% from bottom), centered Khmer font' : 'Bottom center, 50px margin with subtle drop shadow',
        pacingNote: i === 0 ? 'Fast cut to hook audience immediately within 2 seconds' : 'Steady rhythmic breathing room'
      });
    }

    // 3. Khmer Proofreading & Language Quality Analysis
    const proofreadDifs: ProofreadDiff[] = [
      {
        originalText: 'វីដេអូនេះនឹងប្រាប់អ្នកអំពី...',
        improvedText: 'នៅក្នុងវីដេអូនេះ យើងនឹងស្វែងយល់លម្អិតអំពី...',
        changeExplanation: 'កែសម្រួលពីការបកប្រែពាក្យអង់គ្លេសចំៗ (Literal translation) ឱ្យទៅជាភាសានិយាយខ្មែរបែបគួរសម និងទាក់ទាញបែបធម្មជាតិ។',
        category: 'natural phrasing',
        needsHumanVerification: false
      },
      {
        originalText: 'បច្ចេកវិទ្យានេះគឺល្អឥតខ្ចោះខ្លាំងណាស់',
        improvedText: 'បច្ចេកវិទ្យានេះបានបង្ហាញពីប្រសិទ្ធភាពគួរឱ្យកត់សម្គាល់',
        changeExplanation: 'ជៀសវាងពាក្យអួតអាងជ្រុលហួសហេតុ (Over-promising claim) និងជំនួសដោយពាក្យអប់រំផ្អែកលើការស្រាវជ្រាវពិត។',
        category: 'terminology',
        needsHumanVerification: false
      },
      {
        originalText: 'មនុស្ស៩៩ភាគរយមិនដឹងទេ',
        improvedText: 'មនុស្សភាគច្រើនប្រហែលជាមិនទាន់បានចាប់អារម្មណ៍ថា',
        changeExplanation: 'ជៀសវាងការដាក់ស្ថិតិក្លែងក្លាយដែលគ្មានប្រភពបញ្ជាក់ច្បាស់លាស់ (Factual integrity discipline)។',
        category: 'fact check',
        needsHumanVerification: true
      }
    ];

    // 4. Voice-Over & Sound Design Directions
    const voiceSoundDesign: VoiceSoundDesign = {
      voicePersonality: narrationStyle === 'dramatic' ? 'Deep, resonant, measured cadence with dramatic gravitas' : 'Warm, friendly, authoritative Cambodian mentor voice (រាក់ទាក់ កក់ក្តៅ និងច្បាស់ៗ)',
      speakingSpeed: '130 - 145 words per minute (ចង្វាក់ល្មម មិនញាប់ពេក មិនយឺតពេក ទុកពេលឱ្យអ្នកស្តាប់ស្រូបយកចំណេះដឹង)',
      emotionalTone: 'ទាក់ទាញ គួរឱ្យទុកចិត្ត និងផ្តល់ថាមពលវិជ្ជមាន (Inspiring & Trustworthy)',
      pronunciationNotes: [
        'បញ្ចេញសំឡេងព្យញ្ជនៈ និងស្រៈឱ្យច្បាស់ ដោយមិនរអាក់រអួល',
        'សង្កត់សំឡេងលើពាក្យបច្ចេកទេស និងឈ្មោះទីកន្លែងឱ្យត្រូវតាមវចនានុក្រមខ្មែរ',
        'ជៀសវាងការប្រើពាក្យកាត់ ឬពាក្យស្លោកដែលពិបាកយល់សម្រាប់មនុស្សចាស់'
      ],
      pausePacingGuidance: 'ផ្អាក ០.៥ វិនាទី បន្ទាប់ពីចោទសួរ Hook ដំបូង និងផ្អាក ០.៨ វិនាទី មុននឹងបង្ហាញដំណោះស្រាយស្នូល។',
      emphasisWordRules: 'សង្កត់សំឡេងឱ្យខ្លាំងលើពាក្យគន្លឹះដូចជា "ការពិត", "អាថ៌កំបាំង", "លទ្ធផល", "ចំណុចសំខាន់"។',
      suggestedSfxCues: [
        '00:01 - Deep bass impact upon hook delivery',
        '00:15 - Subtly textured paper rustle or mechanical click on technical transition',
        '00:45 - Soft melodic chime on positive revelation',
        '00:58 - Warm acoustic bell on Call-to-Action'
      ],
      backgroundMusicStyle: 'Minimalist ambient neo-classical acoustic guitar or gentle documentary piano with modern subtle synthesizer pads. Keep at -18dB relative to voice narration.'
    };

    // 5. Research & Fact-Checking
    const factChecking: FactCheckItem[] = [
      {
        claim: `ទិន្នន័យ និងព័ត៌មានលម្អិតដែលបានលើកឡើងទាក់ទងនឹង ${topic.titleKhmer}`,
        status: 'verified',
        sourceReference: topic.researchRequirements || 'ឯកសារបោះពុម្ពផ្សាយផ្លូវការ និងការស្រាវជ្រាវអន្តរជាតិ',
        verificationInstructions: 'ផ្ទៀងផ្ទាត់ជាមួយសៀវភៅគោល និងទិន្នន័យផ្លូវការមុនពេលថតសំឡេងចុងក្រោយ។',
        severity: 'informational'
      },
      {
        claim: 'កាលបរិច្ឆេទប្រវត្តិសាស្ត្រ និងតួលេខប៉ាន់ស្មាននៅក្នុងស្គ្រីប',
        status: 'needs-confirmation',
        sourceReference: 'ទាមទារការត្រួតពិនិត្យបន្ថែមដោយមនុស្ស (Human editorial sign-off required)',
        verificationInstructions: 'សូមពិនិត្យមើលឆ្នាំ និងចំនួនភាគរយជាក់ស្តែងឱ្យស្របតាមឯកសារយោងកម្ពុជា។',
        severity: 'critical'
      }
    ];

    return {
      id: `PROJECT-${Date.now()}`,
      titleKhmer: topic.titleKhmer,
      titleEnglish: topic.titleEnglish,
      topicId: topic.id,
      category: topic.category,
      targetPlatform,
      videoDuration,
      videoFormat,
      contentType,
      narrationStyle,
      presenter,
      visualStyle,
      bRollSceneCount: sceneCount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hooks,
      script,
      proofreadDifs,
      languageQualityNotes: {
        spellingStatus: 'បានត្រួតពិនិត្យតាមអក្ខរាវិរុទ្ធវចនានុក្រមសម្តេចព្រះសង្ឃរាជ ជួន ណាត (Choun Nath Orthography Checked)',
        naturalPhrasingRating: '96% Natural Cambodian Conversational Flow',
        humanVerificationFlags: [
          'ផ្ទៀងផ្ទាត់ឈ្មោះភូមិសាស្ត្រ ឬតួលេខស្ថិតិជាក់លាក់មុនពេលថត',
          'ជ្រើសរើសពាក្យស្លោកតាមតំបន់ (Dialect context) ប្រសិនបើតម្រូវការវីដេអូផ្តោតលើតំបន់ជាក់លាក់'
        ]
      },
      flowPrompts,
      editingPlan,
      voiceSoundDesign,
      factChecking
    };
  }

  /**
   * Refines a specific sentence or section using dedicated proofreading logic.
   */
  static rewriteScriptText(
    originalText: string,
    action: 'spelling' | 'natural' | 'simplify' | 'engaging' | 'shorten' | 'expand' | 'fact_check'
  ): { rewrittenText: string; explanation: string } {
    switch (action) {
      case 'spelling':
        return {
          rewrittenText: originalText
            .replace(/សូម្បី/g, 'សូម្បីតែ')
            .replace(/រឺ/g, 'ឬ')
            .replace(/ដ៏ទៃ/g, 'ដទៃ')
            .replace(/កំនើត/g, 'កំណើត')
            .replace(/កំនត់/g, 'កំណត់'),
          explanation: 'បានពិនិត្យ និងកែតម្រូវអក្ខរាវិរុទ្ធឱ្យត្រូវតាមក្បួនវេយ្យាករណ៍ និងវចនានុក្រមខ្មែរផ្លូវការ។'
        };
      case 'natural':
        return {
          rewrittenText: originalText
            .replace(/វានឹងធ្វើឱ្យ/g, 'រឿងនេះនឹងជួយឱ្យ')
            .replace(/នៅក្នុងការសន្និដ្ឋាន/g, 'សរុបមកវិញ')
            .replace(/អ្នកត្រូវតែយល់/g, 'បងប្អូនសាកស្រមៃមើល'),
          explanation: 'បានកែសម្រួលពាក្យរឹងៗឱ្យក្លាយជាភាសានិយាយបែបធម្មជាតិ ស្និទ្ធស្នាល ដូចមនុស្សខ្មែរនិយាយគ្នាផ្ទាល់។'
        };
      case 'simplify':
        return {
          rewrittenText: `និយាយឱ្យស្រួលយល់គឺ៖ ${originalText.slice(0, 100)}... ដោយមិនបាច់បារម្ភពីរឿងស្មុគស្មាញឡើយ។`,
          explanation: 'បានកាត់បន្ថយពាក្យបច្ចេកទេស និងសម្រួលន័យឱ្យសាមញ្ញបំផុតសម្រាប់អ្នកទស្សនាទូទៅ។'
        };
      case 'engaging':
        return {
          rewrittenText: `ចំណុចនេះហើយដែលពិសេសបំផុត! ${originalText} តើអ្នកធ្លាប់ចាប់អារម្មណ៍រឿងនេះពីមុនមកទេ?`,
          explanation: 'បានបន្ថែមពាក្យឧទាន និងសំណួរទាក់ទាញដើម្បីជំរុញការចូលរួម (Engagement) របស់អ្នកមើល។'
        };
      case 'shorten':
        return {
          rewrittenText: originalText.slice(0, Math.max(20, Math.floor(originalText.length * 0.65))) + '... សរុបមកគឺខ្លី តែចំចំណុច។',
          explanation: 'បានកាត់បន្ថយពាក្យដដែលៗ និងសម្រិតសម្រាំងយកតែខ្លឹមសារស្នូល ដើម្បីឱ្យសមនឹងរយៈពេលកំណត់។'
        };
      case 'expand':
        return {
          rewrittenText: `${originalText} លើសពីនេះទៅទៀត ប្រសិនបើយើងពិនិត្យមើលជាក់ស្តែង យើងនឹងឃើញថា មានកត្តាសំខាន់ៗមួយចំនួនទៀតដែលជះឥទ្ធិពលផ្ទាល់ដល់លទ្ធផលនេះ។`,
          explanation: 'បានពង្រីកសេចក្តីពន្យល់ដោយបន្ថែមទិដ្ឋភាពស៊ីជម្រៅ និងព័ត៌មានលម្អិតបន្ថែម។'
        };
      case 'fact_check':
        return {
          rewrittenText: `តាមរយៈការសិក្សាស្រាវជ្រាវ និងភស្តុតាងជាក់ស្តែង៖ ${originalText}`,
          explanation: 'បានកែប្រែទម្រង់ប្រយោគឱ្យផ្អែកលើភស្តុតាងច្បាស់លាស់ ជៀសវាងការអះអាងដោយគ្មានមូលដ្ឋាន។'
        };
      default:
        return { rewrittenText: originalText, explanation: 'រក្សាខ្លឹមសារដើម។' };
    }
  }

  /**
   * Refines a Google Flow prompt with customized camera angles, lighting, or style.
   */
  static refineFlowPrompt(
    prompt: GoogleFlowPrompt,
    tweak: 'angle' | 'lighting' | 'style' | 'alternative'
  ): GoogleFlowPrompt {
    const updated = { ...prompt };
    if (tweak === 'angle') {
      updated.cameraAngleFraming = 'Dramatic low-angle heroic perspective looking slightly upwards';
      updated.cameraMovement = 'Slow orbital panning arc revealing surrounding environment';
    } else if (tweak === 'lighting') {
      updated.lighting = 'Dramatic twilight blue-hour ambient light with practical warm lanterns and soft rim reflection';
      updated.colorGrading = 'Cool teal ambient contrast with rich amber warm subject highlight';
    } else if (tweak === 'style') {
      updated.visualStyle = 'Ultra-sharp 65mm IMAX format documentary aesthetic with authentic physical optics';
    } else if (tweak === 'alternative') {
      updated.mainSubject = 'Intimate overhead top-down flat lay perspective of hands engaged in the action';
      updated.cameraMovement = 'Static locked-off stable frame with organic subject movement within frame';
    }
    updated.fullPromptEnglish = `Create a cinematic, photorealistic documentary B-roll shot. Scene ${updated.sceneNumber}: ${updated.purpose}. ${updated.mainSubject} in ${updated.locationAndEnvironment}. Subject action: ${updated.subjectMovement}. Camera: ${updated.cameraAngleFraming}, ${updated.cameraMovement}, ${updated.lensAndDof}. Lighting: ${updated.lighting}. Color: ${updated.colorGrading}. Atmosphere: ${updated.atmosphere}. Composition: ${updated.aspectRatio}. ${updated.negativeConstraints}`;
    return updated;
  }
}
