import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), '');
  // '' prefix so VITE_ variables are available

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 5173
    },
    define: {
      'process.env': env
    }
  };
});
