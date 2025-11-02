import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { config } from '../config/env.js';

export class VideoAssembler {
  constructor() {
    if (config.ffmpegPath) {
      ffmpeg.setFfmpegPath(config.ffmpegPath);
    }
  }

  async assembleScenes(scenePaths, outputName = 'final-film.mp4') {
    return new Promise((resolve, reject) => {
      if (!scenePaths.length) {
        reject(new Error('No scene paths supplied'));
        return;
      }

      const outputDir = path.join(process.cwd(), 'backend', 'uploads', 'videos');
      fs.mkdirSync(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, outputName);
      const listFile = path.join(outputDir, 'concat_list.txt');
      const fileContent = scenePaths.map(filePath => `file '${filePath}'`).join('\n');
      fs.writeFileSync(listFile, fileContent);

      ffmpeg()
        .input(listFile)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions(['-c:v libx264', '-preset fast', '-crf 22', '-c:a aac', '-b:a 192k'])
        .output(outputPath)
        .on('end', () => {
          fs.unlinkSync(listFile);
          resolve(outputPath);
        })
        .on('error', error => {
          if (fs.existsSync(listFile)) {
            fs.unlinkSync(listFile);
          }
          reject(error);
        })
        .run();
    });
  }
}
