import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import { eventsRoutes } from './routes/events.js';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = Fastify();
const port = Number(process.env.API_PORT) || 3000;
const host = '0.0.0.0';

// Routes
app.register(eventsRoutes);

app.listen({ host, port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`API running at ${address}`);
});