import React, { ReactElement, ReactNode, FC } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { GameProvider } from '../app/context/GameContext';
import { GameStateType, initialGameState } from '../app/game-state/GameState';
import {
  GameConfigurationType,
  initialGameConfiguration,
} from '../app/game-configuration/GameConfiguration';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialGameState?: GameStateType;
  initialGameConfiguration?: GameConfigurationType;
}

interface TestWrapperProps {
  children: ReactNode;
  initialGameState?: GameStateType;
  initialGameConfiguration?: GameConfigurationType;
}

const TestWrapper: FC<TestWrapperProps> = ({
  children,
  initialGameState: providedGameState = initialGameState,
  initialGameConfiguration: providedGameConfiguration = initialGameConfiguration,
}) => (
  <GameProvider
    initialGameState={providedGameState}
    initialGameConfiguration={providedGameConfiguration}
  >
    {children}
  </GameProvider>
);

export const renderWithProviders = (
  component: ReactElement,
  { initialGameState: gameState, initialGameConfiguration: gameConfig, ...renderOptions }: CustomRenderOptions = {},
): RenderResult => {
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <TestWrapper
      initialGameState={gameState}
      initialGameConfiguration={gameConfig}
    >
      {children}
    </TestWrapper>
  );

  return render(component, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { renderWithProviders as render };
