import React, { type FC, useState } from 'react';

import { type SpecificCellOwner } from '../../../meta-model/CellOwner';
import { AIErrorBoundary } from '../error-boundary/ErrorBoundary';
import { GameStateView } from '../game-state-view/GameStateView';
import { Header } from '../header/Header';
import { GameStateActionType } from '../../game-state/GameStateReducer';
import { PlayerType } from '../../game-configuration/GameConfiguration';
import { useGameConfiguration, useGameState } from '../../context/GameContext';
import { useGameController } from '../../hooks/useGameController';
import { usePlayerRegistry } from '../../hooks/usePlayerRegistry';

import styles from './AppContent.module.css';

interface PlayerDropdownProps {
  cellOwner: SpecificCellOwner;
  currentPlayerType: string;
  onPlayerTypeChange: (cellOwner: SpecificCellOwner, playerType: PlayerType) => void;
}

const PlayerDropdown: FC<PlayerDropdownProps> = ({
  cellOwner,
  currentPlayerType,
  onPlayerTypeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownId = `d${cellOwner}`;

  return (
    <div key={dropdownId} className="relative mt-2 w-full sm:w-auto md:mt-0">
      <button
        id={dropdownId}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex w-full items-center justify-between rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
      >
        <span>{`Player ${cellOwner}`}</span>
        <svg
          className={`ml-2 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <div className="absolute right-0 z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            {Object.keys(PlayerType).map((playerKey) => {
              const active = playerKey === currentPlayerType;
              const itemId = `d${cellOwner}${playerKey}`;
              return (
                <button
                  key={itemId}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    active ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    onPlayerTypeChange(cellOwner, playerKey as PlayerType);
                    setIsOpen(false);
                  }}
                >
                  {playerKey}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export const AppContent: FC = () => {
  const { gameState } = useGameState();
  const { configuration } = useGameConfiguration();
  const { dispatch: dispatchGameState } = useGameState();

  const { playerCreators, isLoading, error } = usePlayerRegistry((actionToken) => {
    dispatchGameState({
      type: GameStateActionType.SetActionToken,
      payload: { actionToken },
    });
  });

  const { createNewGame, canCreateNewGame, toggleAutoNewGame, changePlayerType } =
    useGameController(playerCreators);

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
            onClick={createNewGame}
          >
            New game
          </button>

          <div className="flex flex-col gap-4 md:flex-row">
            {Object.keys(configuration.playerTypes).map((cellOwnerKey) => (
              <PlayerDropdown
                key={cellOwnerKey}
                cellOwner={cellOwnerKey as SpecificCellOwner}
                currentPlayerType={configuration.playerTypes[cellOwnerKey as SpecificCellOwner]}
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
