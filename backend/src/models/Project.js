import mongoose from 'mongoose';

const SceneSchema = new mongoose.Schema({
  index: Number,
  title: String,
  prompt: String,
  videoPath: String
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  aspectRatio: { type: String, default: '16:9' },
  language: { type: String, default: 'English' },
  artStyle: { type: String, default: 'photorealistic' },
  status: { type: String, default: 'draft' },
  scenes: [SceneSchema],
  prompts: [String],
  createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model('Project', ProjectSchema);
