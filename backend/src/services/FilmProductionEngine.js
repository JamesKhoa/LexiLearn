import OpenAI from 'openai';
import { config } from '../config/env.js';
import { GenreDirector } from './GenreDirector.js';
import { CharacterConsistency } from './CharacterConsistency.js';
import { PromptOptimizer } from './PromptOptimizer.js';
import { QualityControl } from './QualityControl.js';

export class FilmProductionEngine {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
    this.sceneLength = 8;
    this.genreDirector = new GenreDirector();
    this.characterConsistency = new CharacterConsistency();
    this.promptOptimizer = new PromptOptimizer();
    this.qualityControl = new QualityControl();
  }

  async processUserRequest(request) {
    const marketAnalysis = await this.analyzeMarketTrends(request);
    const contentStrategy = await this.developContentStrategy(marketAnalysis, request.genre);
    const script = await this.writeDetailedScript(contentStrategy, request.duration, request.language);
    const scenes = await this.breakdownScenes(script, this.sceneLength);
    const characterBible = await this.createCharacterBible(script);
    const environmentBible = await this.createEnvironmentalBible(script);
    const vfxDefinitions = await this.defineSpecialEffects(script, request.genre);
    const prompts = await this.generateVeoPrompts(
      scenes,
      characterBible,
      environmentBible,
      vfxDefinitions,
      request
    );

    return { marketAnalysis, contentStrategy, script, scenes, characterBible, environmentBible, vfxDefinitions, prompts };
  }

  async analyzeMarketTrends(request) {
    const prompt = `You are an experienced film market analyst. Provide a concise market analysis for a ${request.genre} film.
Input details: ${JSON.stringify({ audience: request.targetAudience || 'general', duration: request.duration, theme: request.theme || 'user supplied content' })}`;
    const completion = await this.openai.responses.create({
      model: config.openAiModel,
      input: prompt
    });
    return completion.output_text || completion.data?.[0]?.content?.[0]?.text || 'No analysis available';
  }

  async developContentStrategy(marketAnalysis, genre) {
    const prompt = `Using the following market analysis, outline a content strategy for a ${genre} film including hook, pacing, and key beats.
Market analysis: ${marketAnalysis}`;
    const completion = await this.openai.responses.create({
      model: config.openAiModel,
      input: prompt
    });
    return completion.output_text || completion.data?.[0]?.content?.[0]?.text || 'No strategy available';
  }

  async writeDetailedScript(contentStrategy, duration, language) {
    const prompt = `Write a detailed screenplay in ${language} following this strategy.
Include scene headings, action lines, and dialogue.
Target duration: ${duration} seconds.`;
    const completion = await this.openai.responses.create({
      model: config.openAiModel,
      input: [
        { role: 'system', content: 'You are a professional screenwriter.' },
        { role: 'user', content: `${contentStrategy}\n\nPlease produce a screenplay with clear scene separators.` }
      ]
    });
    return completion.output_text || completion.data?.[0]?.content?.[0]?.text || 'No script generated';
  }

  async breakdownScenes(script, sceneLength) {
    const prompt = `Break down the following screenplay into scenes of approximately ${sceneLength} seconds each. Return JSON with fields: index, title, summary, prompt.`;
    const completion = await this.openai.responses.create({
      model: config.openAiModel,
      input: [
        { role: 'system', content: 'You are a world-class film director and storyboard artist.' },
        { role: 'user', content: script }
      ]
    });

    try {
      const jsonMatch = completion.output_text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.scenes || [];
      }
    } catch (error) {
      console.warn('Scene breakdown parse error:', error.message);
    }
    return [];
  }

  async createCharacterBible(script) {
    const prompt = `Extract a character bible from the screenplay. Return JSON array with fields: name, ethnicity, age, face_shape, eye_color, eye_shape, eye_size, eye_expression, nose_description, mouth_description, marks, height, build, posture, voice_tone, accent, pitch, current_outfit, accessories, hair_states.`;
    const completion = await this.openai.responses.create({
      model: config.openAiModel,
      input: script
    });
    try {
      const jsonMatch = completion.output_text?.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Character bible parse error:', error.message);
    }
    return [];
  }

  async createEnvironmentalBible(script) {
    const prompt = `Extract an environmental bible describing key locations and moods from this screenplay. Return JSON array with name, description, lighting, color_palette, weather, and ambience.`;
    const completion = await this.openai.responses.create({
      model: config.openAiModel,
      input: prompt + '\n' + script
    });
    try {
      const jsonMatch = completion.output_text?.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Environment bible parse error:', error.message);
    }
    return [];
  }

  async defineSpecialEffects(script, genre) {
    const prompt = `Identify special and visual effects for a ${genre} film based on this script. Return JSON array with scene_reference, effect_description, technical_notes.`;
    const completion = await this.openai.responses.create({
      model: config.openAiModel,
      input: prompt + '\n' + script
    });
    try {
      const jsonMatch = completion.output_text?.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('VFX parse error:', error.message);
    }
    return [];
  }

  async generateVeoPrompts(scenes, characterBible, environmentBible, vfxDefinitions, request) {
    const characters = characterBible.map(character => this.characterConsistency.generateCharacterTemplate(character));
    const totalScenes = scenes.length;

    return scenes.map((scene, index) => {
      const directorNotes = this.genreDirector.getDirectorNotes(request.genre);
      let prompt = `Scene ${scene.index || index + 1}: ${scene.title}\n${scene.summary || scene.prompt || ''}\nDirector notes: ${JSON.stringify(directorNotes)}\nEnvironment: ${JSON.stringify(environmentBible.find(env => env.name === scene.location) || environmentBible[0] || {})}\nVFX: ${JSON.stringify(vfxDefinitions.find(vfx => vfx.scene_reference === scene.title) || {})}`;
      prompt = this.characterConsistency.embedInPrompt(prompt, characters);
      prompt = this.promptOptimizer.optimizeForVeo(prompt, index + 1, totalScenes, request);
      const issues = this.qualityControl.validatePrompt(prompt);
      if (issues.length) {
        prompt += `\nQuality Warnings: ${issues.join('; ')}`;
      }
      return prompt;
    });
  }
}
