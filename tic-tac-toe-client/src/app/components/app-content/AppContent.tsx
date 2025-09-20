import { type FC, useCallback } from 'react';

import { type SpecificCellOwner } from '../../../meta-model/CellOwner';
import { AIErrorBoundary } from '../error-boundary/ErrorBoundary';
import { GameStateView } from '../game-state-view/GameStateView';
import { Header } from '../header/Header';
import { useGameConfiguration, useGameState } from '../../context/GameContext';
import { useGameController } from '../../hooks/useGameController';
import { usePlayerRegistry } from '../../hooks/usePlayerRegistry';

import styles from './AppContent.module.css';
import { PlayerDropdown } from './PlayerDropdown.tsx';
import { GameStateActionTypeSetActionToken } from '../../game-state/GameStateActions.ts';

export const AppContent: FC = () => {
  const { gameState } = useGameState();
  const { configuration } = useGameConfiguration();
  const { dispatch: dispatchGameState } = useGameState();

  const { playerCreators, isLoading, error } = usePlayerRegistry((actionToken) => {
    dispatchGameState({
      type: GameStateActionTypeSetActionToken,
      payload: { actionToken },
    });
  });

  const { createNewGame, canCreateNewGame, toggleAutoNewGame, changePlayerType } =
    useGameController(playerCreators);

  const onCreateNewGame = useCallback(() => {
    createNewGame().catch(console.error);
  }, [createNewGame]);

  if (isLoading) {
    return (
      <div className={`${styles.view} flex h-full flex-col items-center justify-center`}>
        <div>Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.view} flex h-full flex-col items-center justify-center`}>
        <div className="text-red-600">Error initializing players: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.view} flex h-full flex-col`}>
      <Header>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!canCreateNewGame()}
            onClick={onCreateNewGame}
          >
            New game
          </button>

          <div className="flex flex-col gap-4 md:flex-row">
            {Object.keys(configuration.playerTypes).map((cellOwnerKey) => (
              <PlayerDropdown
                key={cellOwnerKey}
                cellOwner={cellOwnerKey as SpecificCellOwner}
                currentPlayerType={configuration.playerTypes[cellOwnerKey as SpecificCellOwner]}
                playerCreators={playerCreators}
                onPlayerTypeChange={changePlayerType}
              />
            ))}
          </div>

          <div className="flex items-center">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                id="autoNewGame"
                type="checkbox"
                checked={configuration.autoNewGame}
                onChange={toggleAutoNewGame}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto new game</span>
            </label>
          </div>
        </div>
      </Header>
      <AIErrorBoundary>
        <GameStateView gameState={gameState} />
      </AIErrorBoundary>
    </div>
  );
};
