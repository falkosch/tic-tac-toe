import { useCallback, useRef, useState } from 'react';

import { useGame, useGameConfiguration, useGameState } from '../context/GameContext';
import { runNewGame } from '../../mechanics/GameDirector';
import { CellOwnerO, CellOwnerX, type SpecificCellOwner } from '../../meta-model/CellOwner';
import { type PlayerCreators } from '../game-configuration/GameConfiguration';
import { type Player } from '../../meta-model/Player';
import { type AttackGameAction } from '../../meta-model/GameAction';
import { type PlayerType } from '../game-configuration/PlayerType.ts';
import {
  GameConfigurationActionTypeSetAutoNewGame,
  GameConfigurationActionTypeSetPlayerType,
} from '../game-configuration/GameConfigurationActionType.ts';
import {
  GameStateActionTypeEndGame,
  GameStateActionTypeResetWins,
  GameStateActionTypeSetActionToken,
  GameStateActionTypeStartNewGame,
  GameStateActionTypeUpdateGame,
} from '../game-state/GameStateActions.ts';

interface UseGameControllerReturn {
  runningGame: Promise<unknown>;
  createNewGame: () => Promise<void>;
  canCreateNewGame: () => boolean;
  toggleAutoNewGame: () => void;
  changePlayerType: (cellOwner: SpecificCellOwner, playerType: PlayerType) => void;
  createHumanPlayer: () => Promise<Player>;
}

export const useGameController = (playerCreators: PlayerCreators): UseGameControllerReturn => {
  const { gameState, configuration } = useGame();
  const { dispatch: dispatchGameState } = useGameState();
  const { dispatch: dispatchConfiguration } = useGameConfiguration();

  const [runningGame, setRunningGame] = useState<Promise<unknown>>(Promise.resolve());

  const gameRef = useRef({ gameState, configuration, runningGame });
  gameRef.current = { gameState, configuration, runningGame };

  const createHumanPlayer = useCallback((): Promise<Player> => {
    return Promise.resolve<Player>({
      takeTurn: () =>
        new Promise<AttackGameAction>((resolve, reject) => {
          const actionToken = (affectedCellsAt?: readonly number[], error?: Error): void => {
            dispatchGameState({
              type: GameStateActionTypeSetActionToken,
              payload: { actionToken: undefined },
            });

            if (error) {
              reject(error);
            } else if (affectedCellsAt) {
              resolve({ affectedCellsAt });
            } else {
              resolve({ affectedCellsAt: [] });
            }
          };

          dispatchGameState({
            type: GameStateActionTypeSetActionToken,
            payload: { actionToken },
          });
        }),
    });
  }, [dispatchGameState]);

  const createNewGame = useCallback(async (): Promise<void> => {
    const rememberedRunningGame = runningGame;
    const { actionToken } = gameRef.current.gameState;

    if (actionToken) {
      setRunningGame(Promise.resolve());
      actionToken();
    }
    await rememberedRunningGame;

    const { playerTypes } = gameRef.current.configuration;
    const joiningPlayers = {
      [CellOwnerX]: playerCreators[playerTypes[CellOwnerX] as PlayerType],
      [CellOwnerO]: playerCreators[playerTypes[CellOwnerO] as PlayerType],
    };

    const newRunningGame = runNewGame(
      joiningPlayers,
      (newGameView) => {
        dispatchGameState({
          type: GameStateActionTypeStartNewGame,
          payload: { gameView: newGameView },
        });
        return Promise.resolve();
      },
      (newGameView) => {
        dispatchGameState({
          type: GameStateActionTypeUpdateGame,
          payload: { gameView: newGameView },
        });
        return Promise.resolve();
      },
      (endState) => {
        dispatchGameState({
          type: GameStateActionTypeEndGame,
          payload: { endState },
        });
        return Promise.resolve();
      },
    );

    setRunningGame(newRunningGame);

    await newRunningGame;
    if (
      gameRef.current.runningGame === newRunningGame &&
      gameRef.current.configuration.autoNewGame &&
      !(gameRef.current.gameState.winner instanceof Error)
    ) {
      setTimeout(() => {
        createNewGame().catch(console.error);
      }, 0);
    }
  }, [runningGame, playerCreators, dispatchGameState]);

  const canCreateNewGame = useCallback((): boolean => {
    // Can't create a game if actionToken is active (game in progress)
    return !gameState.actionToken;
  }, [gameState.actionToken]);

  const toggleAutoNewGame = useCallback((): void => {
    dispatchConfiguration({
      type: GameConfigurationActionTypeSetAutoNewGame,
      payload: {
        value: !configuration.autoNewGame,
      },
    });
  }, [configuration.autoNewGame, dispatchConfiguration]);

  const changePlayerType = useCallback(
    (cellOwner: SpecificCellOwner, playerType: PlayerType): void => {
      // Cancel the current game if in progress
      const { actionToken } = gameRef.current.gameState;
      if (actionToken) {
        actionToken();
      }

      dispatchGameState({
        type: GameStateActionTypeResetWins,
        payload: {
          player: cellOwner,
        },
      });
      dispatchConfiguration({
        type: GameConfigurationActionTypeSetPlayerType,
        payload: {
          player: cellOwner,
          playerType,
        },
      });

      // Start new game with updated configuration if there was a game in progress
      if (actionToken) {
        setTimeout(() => {
          createNewGame().catch(console.error);
        }, 0);
      }
    },
    [dispatchGameState, dispatchConfiguration, createNewGame],
  );

  return {
    runningGame,
    createNewGame,
    canCreateNewGame,
    toggleAutoNewGame,
    changePlayerType,
    createHumanPlayer,
  };
};
