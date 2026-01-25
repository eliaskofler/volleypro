import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Fastify from 'fastify';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = Fastify();
const port = Number(process.env.API_PORT) || 3000;

app.listen({ port }, () => console.log(`API running on port ${port}`));
