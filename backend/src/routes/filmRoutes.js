import express from 'express';
import { upload } from '../middleware/upload.js';
import { createFilm, getProgress, listProjects, getProject } from '../controllers/filmController.js';

const router = express.Router();

router.post('/create-film', upload.single('document'), createFilm);
router.get('/progress/:id', getProgress);
router.get('/projects', listProjects);
router.get('/projects/:id', getProject);

export default router;
