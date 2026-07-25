import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Local Vite middleware that mounts the Vercel serverless grade-exam handler
 * so exam submission works during `npm run dev` without `vercel dev`.
 */
function gradeExamDevApiPlugin() {
  return {
    name: 'safeai-grade-exam-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] ?? '';
        if (url !== '/api/grade-exam') {
          next();
          return;
        }

        try {
          const module = await import('./api/grade-exam.js');
          await module.default(req, res);
        } catch (error) {
          console.error('[vite] /api/grade-exam middleware failed', error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ success: false, error: 'Local grading API failed.' }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  /** Absolute root — deep-linked routes (e.g. /academy/exam) must resolve /assets/* on hard refresh. */
  base: '/',
  plugins: [react(), tailwindcss(), gradeExamDevApiPlugin()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
});
