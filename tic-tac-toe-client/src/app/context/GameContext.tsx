import React, { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react';

import {
  GameConfigurationType,
  initialGameConfiguration,
} from '../game-configuration/GameConfiguration';
import { GameStateType, initialGameState } from '../game-state/GameState';
import {
  gameConfigurationReducer,
  GameConfigurationAction,
} from '../game-configuration/GameConfigurationReducer';
import { gameStateReducer, GameStateAction } from '../game-state/GameStateReducer';

interface GameContextValue {
  gameState: GameStateType;
  configuration: GameConfigurationType;
  gameActions: {
    dispatchGameState: (action: GameStateAction) => void;
    dispatchConfiguration: (action: GameConfigurationAction) => void;
  };
}

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
  initialGameState?: GameStateType;
  initialGameConfiguration?: GameConfigurationType;
}

export const GameProvider: FC<GameProviderProps> = ({
  children,
  initialGameState: providedGameState = initialGameState,
  initialGameConfiguration: providedGameConfiguration = initialGameConfiguration,
}) => {
  const [gameState, dispatchGameState] = useReducer(gameStateReducer, providedGameState);
  const [configuration, dispatchConfiguration] = useReducer(
    gameConfigurationReducer,
    providedGameConfiguration,
  );

  const gameActions = useMemo(
    () => ({
      dispatchGameState,
      dispatchConfiguration,
    }),
    [],
  );

  const contextValue = useMemo(
    () => ({
      gameState,
      configuration,
      gameActions,
    }),
    [gameState, configuration, gameActions],
  );

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const useGameState = () => {
  const { gameState, gameActions } = useGame();
  return {
    gameState,
    dispatch: gameActions.dispatchGameState,
  };
};

export const useGameConfiguration = () => {
  const { configuration, gameActions } = useGame();
  return {
    configuration,
    dispatch: gameActions.dispatchConfiguration,
  };
};
