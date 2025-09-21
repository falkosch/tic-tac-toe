import { type FC, useCallback } from 'react';

import { type SpecificCellOwner } from '../../../meta-model/CellOwner';
import { AIErrorBoundary } from '../error-boundary/ErrorBoundary';
import { GameStateView } from '../game-state-view/GameStateView';
import { AppHeader } from '../app-header/AppHeader.tsx';
import { useGameConfiguration, useGameState } from '../../context/GameContext';
import { useGameController } from '../../hooks/useGameController';
import { usePlayerRegistry } from '../../hooks/usePlayerRegistry';
import { PlayerDropdown } from '../player-dropdown/PlayerDropdown.tsx';
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
      <div className="flex h-full flex-col items-center justify-center">Loading players...</div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-700">
        Error initializing players: {error.message}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader>
        <button
          className="rounded-md bg-white px-3 py-2 text-black shadow-sm shadow-indigo-500 hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!canCreateNewGame()}
          onClick={onCreateNewGame}
        >
          New game
        </button>

        {Object.keys(configuration.playerTypes).map((cellOwnerKey) => (
          <PlayerDropdown
            key={cellOwnerKey}
            cellOwner={cellOwnerKey as SpecificCellOwner}
            currentPlayerType={configuration.playerTypes[cellOwnerKey as SpecificCellOwner]}
            playerCreators={playerCreators}
            onPlayerTypeChange={changePlayerType}
          />
        ))}

        <label
          className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-black hover:bg-gray-300"
          htmlFor="autoNewGame"
        >
          <input
            className="focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            id="autoNewGame"
            type="checkbox"
            checked={configuration.autoNewGame}
            onChange={toggleAutoNewGame}
          />
          <span>Auto new game</span>
        </label>
      </AppHeader>
      <AIErrorBoundary>
        <GameStateView gameState={gameState} />
      </AIErrorBoundary>
    </div>
  );
};
