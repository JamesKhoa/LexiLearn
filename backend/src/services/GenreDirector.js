const genreDirectors = {
  action: {
    cameraWork: 'dynamic angles, rapid cuts, tracking shots, aerial views',
    pacing: 'fast-paced, 2-3 second cuts',
    soundDesign: 'explosive SFX, intense orchestral score',
    hookStrategy: 'open with action sequence, in medias res'
  },
  horror: {
    cameraWork: 'dutch angles, slow zooms, POV shots, static long takes',
    lighting: 'low-key lighting, shadows, contrast',
    soundDesign: 'ambient drones, sudden stings, silence breaks',
    hookStrategy: 'atmospheric tension, unsettling imagery'
  },
  documentary: {
    cameraWork: 'steady shots, talking heads, B-roll sequences',
    narration: 'authoritative voiceover, factual tone',
    soundDesign: 'subtle background music, natural sounds',
    hookStrategy: 'provocative question or surprising fact'
  },
  comedy: {
    cameraWork: 'medium shots, reaction shots, stable framing',
    timing: 'pause for laughs, visual gags setup',
    soundDesign: 'upbeat music, comedic timing cues',
    hookStrategy: 'immediate joke or absurd situation'
  },
  adult: {
    cameraWork: 'suggestive angles, implied actions, artistic framing',
    contentFilter: 'metaphorical descriptions, separated scenes',
    soundDesign: 'sensual music, atmospheric',
    safetyCompliance: 'avoid explicit terms, use artistic language'
  }
};

export class GenreDirector {
  getDirectorNotes(genre) {
    const key = (genre || '').toLowerCase();
    return genreDirectors[key] || genreDirectors.documentary;
  }
}
