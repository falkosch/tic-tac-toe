import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(() => ({
  define: {
    // https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
    'process.env': {},
  },
  plugins: [tailwindcss(), react(), tsconfigPaths()],
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    clearMocks: true,
    mockReset: true,
  },
}));
