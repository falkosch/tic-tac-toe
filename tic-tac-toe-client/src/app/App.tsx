import React, { type FC } from 'react';

import { AppContent } from './components/app-content/AppContent';
import { GameErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { GameProvider } from './context/GameContext';

export const App: FC = () => (
  <GameErrorBoundary>
    <GameProvider>
      <AppContent />
    </GameProvider>
  </GameErrorBoundary>
);
