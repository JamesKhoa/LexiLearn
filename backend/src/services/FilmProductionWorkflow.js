import { FilmProductionEngine } from './FilmProductionEngine.js';
import { QualityControl } from './QualityControl.js';
import { VeoAutomation } from './VeoAutomation.js';
import { VideoAssembler } from './VideoAssembler.js';

export class FilmProductionWorkflow {
  constructor(apiKey) {
    this.engine = new FilmProductionEngine(apiKey);
    this.quality = new QualityControl();
  }

  async analyzeContent(content) {
    return this.quality.preprocessScript(content);
  }

  async developScript(analysis, genre, duration) {
    return this.engine.writeDetailedScript(`${analysis}\nGenre: ${genre}`, duration, 'English');
  }

  async breakdownScenes(script) {
    return this.engine.breakdownScenes(script, this.engine.sceneLength);
  }

  async createBibles(script) {
    const [characters, environments] = await Promise.all([
      this.engine.createCharacterBible(script),
      this.engine.createEnvironmentalBible(script)
    ]);
    return { characters, environments };
  }

  async generatePrompts(scenes, bibles, request = {}) {
    const vfxDefinitions = await this.engine.defineSpecialEffects(request.script || '', request.genre || 'documentary');
    return this.engine.generateVeoPrompts(
      scenes,
      bibles.characters,
      bibles.environments,
      vfxDefinitions,
      request
    );
  }

  async submitToVeo(prompts, cookies) {
    const automation = new VeoAutomation();
    await automation.initialize(cookies);
    const videos = [];
    for (let i = 0; i < prompts.length; i += 1) {
      const path = await automation.submitPrompt(prompts[i], i + 1);
      videos.push(path);
    }
    await automation.close();
    return videos;
  }

  async assembleVideo(videos) {
    const assembler = new VideoAssembler();
    return assembler.assembleScenes(videos);
  }
}
