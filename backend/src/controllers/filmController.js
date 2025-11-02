import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { Project } from '../models/Project.js';
import { FilmProductionWorkflow } from '../services/FilmProductionWorkflow.js';
import { progressTracker } from '../utils/progressTracker.js';

export async function createFilm(req, res) {
  const {
    genre,
    duration,
    language,
    artStyle,
    apiKey,
    autoSubmit,
    cookies: rawCookies,
    name,
    aspectRatio
  } = req.body;
  let cookies = rawCookies;
  if (typeof rawCookies === 'string' && rawCookies.length) {
    try {
      cookies = JSON.parse(rawCookies);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid cookies payload' });
    }
  }
  const shouldAutoSubmit = typeof autoSubmit === 'string' ? autoSubmit === 'true' : Boolean(autoSubmit);
  const content = req.file ? fs.readFileSync(req.file.path, 'utf-8') : req.body.content;
  const workflow = new FilmProductionWorkflow(apiKey);
  const progressId = uuid();
  progressTracker.init(progressId);

  try {
    progressTracker.update(progressId, 10, 'Analyzing content and market...');
    const analysis = await workflow.analyzeContent(content || '');

    progressTracker.update(progressId, 30, 'Developing script...');
    const script = await workflow.developScript(analysis, genre, duration);

    progressTracker.update(progressId, 40, 'Breaking down scenes...');
    const scenes = await workflow.breakdownScenes(script);

    progressTracker.update(progressId, 50, 'Creating production bibles...');
    const bibles = await workflow.createBibles(script);

    progressTracker.update(progressId, 60, 'Generating prompts...');
    const prompts = await workflow.generatePrompts(scenes, bibles, {
      genre,
      duration,
      language,
      artStyle,
      aspectRatio,
      script
    });

    let videoUrl;
    if (shouldAutoSubmit && cookies?.length) {
      progressTracker.update(progressId, 80, 'Submitting prompts to Veo...');
      const videos = await workflow.submitToVeo(prompts, cookies);
      progressTracker.update(progressId, 90, 'Assembling final cut...');
      videoUrl = await workflow.assembleVideo(videos);
    }

    progressTracker.complete(progressId);

    const project = await Project.create({
      name: name || `Project-${Date.now()}`,
      genre,
      duration,
      aspectRatio,
      language,
      artStyle,
      status: 'complete',
      prompts,
      scenes: scenes.map(scene => ({ index: scene.index, title: scene.title, prompt: scene.prompt || scene.summary }))
    });

    res.json({ success: true, progressId, prompts, videoUrl, project });
  } catch (error) {
    console.error('Film creation error:', error);
    res.status(500).json({ error: error.message, progressId });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
  }
}

export function getProgress(req, res) {
  const { id } = req.params;
  res.json(progressTracker.get(id));
}

export async function listProjects(req, res) {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
}

export async function getProject(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project);
}
