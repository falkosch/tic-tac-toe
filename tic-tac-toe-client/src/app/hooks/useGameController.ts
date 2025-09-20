import { useCallback, useRef, useState } from 'react';

import { useGame, useGameConfiguration, useGameState } from '../context/GameContext';
import { runNewGame } from '../../mechanics/GameDirector';
import { GameStateActionType } from '../game-state/GameStateReducer';
import { GameConfigurationActionType } from '../game-configuration/GameConfigurationReducer';
import { CellOwner, type SpecificCellOwner } from '../../meta-model/CellOwner';
import { type PlayerCreators, PlayerType } from '../game-configuration/GameConfiguration';
import { type Player } from '../../meta-model/Player';
import { type AttackGameAction } from '../../meta-model/GameAction';

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

  const createHumanPlayer = useCallback(async (): Promise<Player> => {
    return {
      takeTurn: () =>
        new Promise<AttackGameAction>((resolve, reject) => {
          const actionToken = (affectedCellsAt?: readonly number[], error?: Error): void => {
            dispatchGameState({
              type: GameStateActionType.SetActionToken,
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
            type: GameStateActionType.SetActionToken,
            payload: { actionToken },
          });
        }),
    };
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
      [CellOwner.X]: playerCreators[playerTypes[CellOwner.X] as PlayerType],
      [CellOwner.O]: playerCreators[playerTypes[CellOwner.O] as PlayerType],
    };

    const newRunningGame = runNewGame(
      joiningPlayers,
      async (newGameView) => {
        dispatchGameState({
          type: GameStateActionType.StartNewGame,
          payload: { gameView: newGameView },
        });
      },
      async (newGameView) => {
        dispatchGameState({
          type: GameStateActionType.UpdateGame,
          payload: { gameView: newGameView },
        });
      },
      async (endState) => {
        dispatchGameState({
          type: GameStateActionType.EndGame,
          payload: { endState },
        });
      },
    );

    setRunningGame(newRunningGame);

    await newRunningGame;
    if (
      gameRef.current.runningGame === newRunningGame &&
      gameRef.current.configuration.autoNewGame &&
      !(gameRef.current.gameState.winner instanceof Error)
    ) {
      setTimeout(createNewGame, 0);
    }
  }, [runningGame, playerCreators, dispatchGameState]);

  const canCreateNewGame = useCallback((): boolean => {
    // Can't create a game if actionToken is active (game in progress)
    return !gameState.actionToken;
  }, [gameState.actionToken]);

  const toggleAutoNewGame = useCallback((): void => {
    dispatchConfiguration({
      type: GameConfigurationActionType.SetAutoNewGame,
      payload: {
        value: !configuration.autoNewGame,
      },
    });
  }, [configuration.autoNewGame, dispatchConfiguration]);

  const changePlayerType = useCallback(
    (cellOwner: SpecificCellOwner, playerType: PlayerType): void => {
      // Cancel current game if in progress
      const { actionToken } = gameRef.current.gameState;
      if (actionToken) {
        actionToken();
      }

      dispatchGameState({
        type: GameStateActionType.ResetWins,
        payload: {
          player: cellOwner,
        },
      });
      dispatchConfiguration({
        type: GameConfigurationActionType.SetPlayerType,
        payload: {
          player: cellOwner,
          playerType,
        },
      });

      // Start new game with updated configuration if there was a game in progress
      if (actionToken) {
        setTimeout(createNewGame, 0);
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
