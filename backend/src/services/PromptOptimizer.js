export class PromptOptimizer {
  optimizeForVeo(rawPrompt, sceneNumber, totalScenes, request) {
    let optimized = rawPrompt;
    optimized = this.addCameraSpecs(optimized, request.aspectRatio);
    optimized = this.injectConsistencyMarkers(optimized, sceneNumber);
    if (sceneNumber < totalScenes) {
      optimized = this.addTransitionHints(optimized, sceneNumber);
    }
    optimized = this.applySafetyFilters(optimized);
    optimized = this.addLipSyncInstructions(optimized);
    return optimized;
  }

  addCameraSpecs(prompt, aspectRatio = '16:9') {
    return `${prompt}\nTechnical: shot in ${aspectRatio}, 24fps, cinematic color grading.`;
  }

  injectConsistencyMarkers(prompt, sceneNumber) {
    return `${prompt}\nScene Marker: [scene-${sceneNumber}-consistency]`;
  }

  addTransitionHints(prompt, sceneNumber) {
    return `${prompt}\nTransition hint: Prepare smooth continuity into scene ${sceneNumber + 1}.`;
  }

  applySafetyFilters(prompt) {
    return prompt.replace(/\b(explicit|nude|gore)\b/gi, term => `${term} (metaphorical)`);
  }

  addLipSyncInstructions(prompt) {
    const dialoguePattern = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    return prompt.replace(dialoguePattern, (match, dialogue) => {
      const speaker = this.identifySpeaker(prompt, match) || 'Unknown speaker';
      return `"${dialogue}" [${speaker} speaking with precise lip-sync, mouth movements matching phonemes]`;
    });
  }

  identifySpeaker(prompt, dialogue) {
    const lines = prompt.split('\n');
    const index = lines.findIndex(line => line.includes(dialogue));
    if (index > 0) {
      const possibleSpeaker = lines[index - 1].match(/([A-Z][a-zA-Z]+):$/);
      if (possibleSpeaker) {
        return possibleSpeaker[1];
      }
    }
    return null;
  }
}
