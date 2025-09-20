import { useCallback, useEffect, useState } from 'react';

import { createDefaultPlayerRegistry, PlayerRegistry } from '../../computer-players/PlayerRegistry';
import { type PlayerCreator } from '../../meta-model/Player';
import { type AttackGameAction } from '../../meta-model/GameAction';
import {
  type PlayerType,
  PlayerTypeAzure,
  PlayerTypeDQN,
  PlayerTypeHuman,
  PlayerTypeMenace,
  PlayerTypeMock,
} from '../game-configuration/PlayerType.ts';

interface UsePlayerRegistryReturn {
  registry: PlayerRegistry | null;
  isLoading: boolean;
  error: Error | null;
  playerCreators: Record<PlayerType, PlayerCreator>;
  createHumanPlayerCreator: () => PlayerCreator;
}

export const usePlayerRegistry = (
  onActionToken?: (
    actionToken: (affectedCellsAt?: readonly number[], error?: Error) => void,
  ) => void,
): UsePlayerRegistryReturn => {
  const [registry, setRegistry] = useState<PlayerRegistry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const createHumanPlayerCreator = useCallback((): PlayerCreator => {
    return async () => ({
      takeTurn: () =>
        new Promise<AttackGameAction>((resolve, reject) => {
          const actionToken = (affectedCellsAt?: readonly number[], err?: Error): void => {
            if (err) {
              reject(err);
            } else if (affectedCellsAt) {
              resolve({ affectedCellsAt });
            } else {
              resolve({ affectedCellsAt: [] });
            }
          };

          if (onActionToken) {
            onActionToken(actionToken);
          }
        }),
    });
  }, [onActionToken]);

  useEffect(() => {
    const initializeRegistry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const newRegistry = await createDefaultPlayerRegistry();

        setRegistry(newRegistry);
      } catch (err: unknown) {
        const asError =
          err instanceof Error
            ? err
            : new Error('Failed to initialize player registry', { cause: err });
        setError(asError);
        console.error('initializeRegistry:', asError);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRegistry().catch(console.error);
  }, []);

  const playerCreators: Record<PlayerType, PlayerCreator> = {
    [PlayerTypeHuman]: createHumanPlayerCreator(),
    [PlayerTypeMock]:
      registry?.create(PlayerTypeMock) ??
      (() => Promise.reject(new Error('Mock player not available'))),
    [PlayerTypeDQN]:
      registry?.create(PlayerTypeDQN) ??
      (() => Promise.reject(new Error('DQN player not available'))),
    [PlayerTypeMenace]:
      registry?.create(PlayerTypeMenace) ??
      (() => Promise.reject(new Error('Menace player not available'))),
    [PlayerTypeAzure]:
      registry?.create(PlayerTypeAzure) ??
      (() => Promise.reject(new Error('Azure player not available'))),
  };

  return {
    registry,
    isLoading,
    error,
    playerCreators,
    createHumanPlayerCreator,
  };
};
