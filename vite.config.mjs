import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(root, 'web'),
  base: '/',
  publicDir: path.join(root, 'web/public'),
  plugins: [react()],
  // No backend secrets or old VITE_API_BASE_URL values enter either workspace.
  envDir: path.join(root, 'web'),
  build: {
    manifest: true,
    outDir: path.join(root, 'dist'),
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        home: path.join(root, 'web/index.html'),
        legal: path.join(root, 'web/legal/index.html'),
        student: path.join(root, 'web/student/index.html'),
        admin: path.join(root, 'web/admin/index.html'),
      },
    },
  },
});
