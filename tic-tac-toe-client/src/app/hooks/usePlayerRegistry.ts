import { useCallback, useEffect, useState } from 'react';

import { createDefaultPlayerRegistry, PlayerRegistry } from '../../computer-players/PlayerRegistry';
import { PlayerType } from '../game-configuration/GameConfiguration';
import { PlayerCreator } from '../../meta-model/Player';
import { AttackGameAction } from '../../meta-model/GameAction';

interface UsePlayerRegistryReturn {
  registry: PlayerRegistry | null;
  isLoading: boolean;
  error: Error | null;
  playerCreators: Record<PlayerType, PlayerCreator>;
  createHumanPlayerCreator: () => PlayerCreator;
}

export const usePlayerRegistry = (
  onActionToken?: (
    actionToken: (affectedCellsAt?: ReadonlyArray<number>, error?: Error) => void,
  ) => void,
): UsePlayerRegistryReturn => {
  const [registry, setRegistry] = useState<PlayerRegistry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const createHumanPlayerCreator = useCallback((): PlayerCreator => {
    return async () => ({
      takeTurn: () =>
        new Promise<AttackGameAction>((resolve, reject) => {
          const actionToken = (affectedCellsAt?: ReadonlyArray<number>, err?: Error): void => {
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
          err instanceof Error ? err : new Error('Failed to initialize player registry');
        setError(asError);
        console.error('Failed to initialize player registry:', asError);
      } finally {
        setIsLoading(false);
      }
    };

    initializeRegistry();
  }, []);

  const playerCreators: Record<PlayerType, PlayerCreator> = {
    [PlayerType.Human]: createHumanPlayerCreator(),
    [PlayerType.Mock]:
      registry?.create(PlayerType.Mock) ||
      (() => Promise.reject(new Error('Mock player not available'))),
    [PlayerType.DQN]:
      registry?.create(PlayerType.DQN) ||
      (() => Promise.reject(new Error('DQN player not available'))),
    [PlayerType.Menace]:
      registry?.create(PlayerType.Menace) ||
      (() => Promise.reject(new Error('Menace player not available'))),
    [PlayerType.Azure]:
      registry?.create(PlayerType.Azure) ||
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
