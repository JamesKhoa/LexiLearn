import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/lexilearn',
  openAiModel: process.env.OPENAI_MODEL || 'gpt-4.1',
  ffmpegPath: process.env.FFMPEG_PATH || null
};
