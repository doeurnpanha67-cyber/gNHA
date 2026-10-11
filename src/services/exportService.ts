import { CompleteContentPackage, ScriptScene, GoogleFlowPrompt, TopicItem } from '../types';

export class ExportService {
  /**
   * Generates standard SubRip Subtitle (.srt) format with accurate timestamp markers and natural Khmer text.
   */
  static generateSrt(script: ScriptScene[]): string {
    return script
      .map((scene, idx) => {
        // Convert "00:15" to "00:00:15,000"
        const formatSrtTime = (t: string) => {
          const parts = t.split(':');
          const mins = parts[0] || '00';
          const secs = parts[1] || '00';
          return `00:${mins.padStart(2, '0')}:${secs.padStart(2, '0')},000`;
        };

        const start = formatSrtTime(scene.startTime);
        const end = formatSrtTime(scene.endTime);

        return `${idx + 1}\n${start} --> ${end}\n${scene.narrationKhmer.trim()}\n`;
      })
      .join('\n');
  }

  /**
   * Generates a comprehensive human-readable TXT production document.
   */
  static generateTxt(pkg: CompleteContentPackage): string {
    const divider = '='.repeat(60);
    const subDivider = '-'.repeat(40);

    let doc = `${divider}\n`;
    doc += `KHMER AI CONTENT STUDIO - PRODUCTION SCRIPT PACKAGE\n`;
    doc += `${divider}\n\n`;
    doc += `Project Title (Khmer): ${pkg.titleKhmer}\n`;
    doc += `Project Title (English): ${pkg.titleEnglish}\n`;
    doc += `Category: ${pkg.category}\n`;
    doc += `Target Platform: ${pkg.targetPlatform}\n`;
    doc += `Duration: ${pkg.videoDuration} | Format: ${pkg.videoFormat}\n`;
    doc += `Narration Style: ${pkg.narrationStyle} | Visual Style: ${pkg.visualStyle}\n`;
    doc += `Generated: ${new Date(pkg.createdAt).toLocaleString()}\n\n`;

    doc += `${subDivider}\nSECTION 1: VIRAL HOOK ALTERNATIVES\n${subDivider}\n`;
    pkg.hooks.forEach((h, idx) => {
      doc += `Option ${idx + 1} ${h.isRecommended ? '[RECOMMENDED]' : ''}:\n`;
      doc += `Khmer: ${h.hookKhmer}\n`;
      doc += `Technique: ${h.technique}\n`;
      doc += `Retention Rationale: ${h.retentionRationale}\n\n`;
    });

    doc += `\n${subDivider}\nSECTION 2: FULL SCENE-BY-SCENE KHMER SCRIPT\n${subDivider}\n`;
    pkg.script.forEach(scene => {
      doc += `[Scene ${scene.sceneNumber}] (${scene.startTime} - ${scene.endTime}) | Delivery: ${scene.emotionalDelivery}\n`;
      doc += `Footage: ${scene.suggestedFootage}\n`;
      doc += `Narration (Khmer): ${scene.narrationKhmer}\n`;
      if (scene.onScreenTextKhmer) {
        doc += `On-Screen Text: ${scene.onScreenTextKhmer}\n`;
      }
      doc += `\n`;
    });

    doc += `\n${subDivider}\nSECTION 3: GOOGLE FLOW VIDEO FOOTAGE PROMPTS (ENGLISH)\n${subDivider}\n`;
    pkg.flowPrompts.forEach(p => {
      doc += `--- Scene ${p.sceneNumber} (${p.durationSeconds}s, ${p.aspectRatio}) ---\n`;
      doc += `${p.fullPromptEnglish}\n\n`;
    });

    doc += `\n${subDivider}\nSECTION 4: VOICE-OVER & SOUND DESIGN NOTES\n${subDivider}\n`;
    doc += `Voice Personality: ${pkg.voiceSoundDesign.voicePersonality}\n`;
    doc += `Speaking Speed: ${pkg.voiceSoundDesign.speakingSpeed}\n`;
    doc += `Background Music: ${pkg.voiceSoundDesign.backgroundMusicStyle}\n\n`;

    doc += `${subDivider}\nSECTION 5: RESEARCH & FACT-CHECKING\n${subDivider}\n`;
    pkg.factChecking.forEach((f, idx) => {
      doc += `${idx + 1}. [${f.status.toUpperCase()}] ${f.claim}\n`;
      doc += `   Reference: ${f.sourceReference}\n`;
      doc += `   Action: ${f.verificationInstructions}\n\n`;
    });

    return doc;
  }

  /**
   * Generates a batch text file of Google Flow prompts.
   */
  static generateFlowPromptsText(prompts: GoogleFlowPrompt[]): string {
    let out = `# GOOGLE FLOW & VEO PRODUCTION B-ROLL PROMPTS\n`;
    out += `# Total Scenes: ${prompts.length}\n\n`;
    prompts.forEach(p => {
      out += `// SCENE ${p.sceneNumber} [Duration: ${p.durationSeconds}s | Aspect: ${p.aspectRatio}]\n`;
      out += `${p.fullPromptEnglish}\n\n`;
    });
    return out;
  }

  /**
   * Generates CSV for Topic List with UTF-8 BOM (\uFEFF) for Excel compatibility with Khmer text.
   */
  static generateTopicsCsv(topics: TopicItem[]): string {
    const headers = [
      'Topic ID',
      'Title (Khmer)',
      'Title (English)',
      'Category',
      'Hook Idea',
      'Target Audience',
      'Duration',
      'Content Potential',
      'Research Requirements'
    ];

    const escapeCsv = (str: string) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = topics.map(t => [
      escapeCsv(t.id),
      escapeCsv(t.titleKhmer),
      escapeCsv(t.titleEnglish),
      escapeCsv(t.category),
      escapeCsv(t.hookIdea),
      escapeCsv(t.targetAudience),
      escapeCsv(t.suggestedDuration),
      escapeCsv(t.contentPotential),
      escapeCsv(t.researchRequirements)
    ].join(','));

    // \uFEFF is the UTF-8 Byte Order Mark for Microsoft Excel
    return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  }

  /**
   * Triggers client browser download of generated content.
   */
  static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Opens a print dialog formatted for saving as PDF or Word document.
   */
  static openPrintPreview(pkg: CompleteContentPackage): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="km">
      <head>
        <meta charset="utf-8">
        <title>${pkg.titleKhmer} - Production Script</title>
        <style>
          body { font-family: 'Kantumruy Pro', system-ui, sans-serif; line-height: 1.6; color: #1a202c; padding: 40px; }
          h1 { font-size: 24px; color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
          h2 { font-size: 18px; color: #2b6cb0; margin-top: 30px; border-bottom: 1px solid #cbd5e0; }
          .meta { font-size: 14px; color: #4a5568; margin-bottom: 24px; }
          .scene-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
          .scene-header { font-weight: bold; color: #2d3748; margin-bottom: 8px; }
          .narration { font-size: 16px; line-height: 1.8; color: #000; margin: 8px 0; }
          .prompt { font-family: monospace; font-size: 12px; background: #f7fafc; padding: 10px; border-radius: 4px; border: 1px solid #edf2f7; }
        </style>
      </head>
      <body>
        <h1>${pkg.titleKhmer}</h1>
        <div class="meta">
          <strong>Category:</strong> ${pkg.category} | <strong>Platform:</strong> ${pkg.targetPlatform} | <strong>Duration:</strong> ${pkg.videoDuration}
        </div>
        <h2>1. Viral Opening Hook</h2>
        <p><strong>${pkg.hooks[0]?.hookKhmer}</strong></p>
        <h2>2. Scene-by-Scene Script</h2>
        ${pkg.script.map(s => `
          <div class="scene-card">
            <div class="scene-header">Scene ${s.sceneNumber} (${s.startTime} - ${s.endTime}) &bull; ${s.emotionalDelivery}</div>
            <div class="narration"><strong>Narration (Khmer):</strong> ${s.narrationKhmer}</div>
            <p style="font-size: 13px; color: #4a5568;"><strong>Visual Footage:</strong> ${s.suggestedFootage}</p>
          </div>
        `).join('')}
        <h2>3. Google Flow Video Prompts</h2>
        ${pkg.flowPrompts.map(p => `
          <div class="scene-card">
            <div class="scene-header">Scene ${p.sceneNumber} Video Prompt (${p.aspectRatio})</div>
            <div class="prompt">${p.fullPromptEnglish}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
