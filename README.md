# LexiLearn Automated Filmmaking Suite

LexiLearn is a full-stack automated filmmaking solution that integrates OpenAI-powered content generation, Veo 3 browser automation, and FFmpeg-based video assembly. The platform includes a Material UI React dashboard, Express/Node backend, MongoDB persistence, and an Electron wrapper for desktop deployments.

## Project Structure

```
backend/            # Express API, OpenAI workflow, MongoDB models
frontend/           # React + Material UI dashboard (Vite)
electron/           # Electron wrapper for desktop distribution
chrome-extension/   # Flow cookie extractor helper
```

## Backend

- **Express API** (`backend/src`) exposes routes for film creation, progress polling, and project retrieval.
- **FilmProductionEngine** orchestrates multi-stage AI workflow: market research, strategy, script, scenes, character/environment bibles, VFX, and Veo prompt generation.
- **Character Consistency & Prompt Optimization** modules ensure Veo prompt fidelity and safety compliance.
- **VeoAutomation** leverages Puppeteer to auto-submit prompts and download generated clips.
- **VideoAssembler** uses FFmpeg to concatenate scene videos.

### Running the backend

```bash
cd backend
npm install
npm run dev
```

Set environment variables in a `.env` file as needed:

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/lexilearn
OPENAI_MODEL=gpt-4.1
FFMPEG_PATH=/usr/bin/ffmpeg
```

## Frontend

- Built with React, Vite, and Material UI.
- Provides project wizard, settings panel, upload management, and real-time progress visualization.

### Running the frontend

```bash
cd frontend
npm install
npm run dev
```

## Electron Desktop App

Wraps the frontend for desktop deployment while persisting settings locally.

```bash
cd electron
npm install
npm start
```

## Chrome Extension

Located in `chrome-extension/`, the extension exports cookies from Flow to enable Veo automation. Load it in Chrome via developer mode.

## Development Notes

- MongoDB must be running locally or remotely accessible.
- Provide a valid OpenAI API key via the dashboard settings.
- Puppeteer automation requires valid Flow cookies extracted with the extension.
- FFmpeg should be installed and accessible; configure `FFMPEG_PATH` if needed.
