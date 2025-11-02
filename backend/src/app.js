import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import filmRoutes from './routes/filmRoutes.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', filmRoutes);

export async function startServer() {
  await connectDatabase();
  return new Promise(resolve => {
    const server = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
      resolve(server);
    });
  });
}

export default app;
