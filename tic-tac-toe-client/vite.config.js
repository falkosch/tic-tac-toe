import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    define: {
      // https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
      'process.env': {},
    },
    build: {
      outDir: 'build',
    },
    plugins: [react(), viteTsconfigPaths()],
    test: {
      globals: true,
      environment: 'jsdom',
    },
  };
});
