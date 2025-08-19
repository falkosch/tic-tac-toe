import { PlayerCreator } from '../meta-model/Player';
import { PlayerType } from '../app/game-configuration/GameConfiguration';

export interface PlayerRegistryInterface {
  register(type: PlayerType, creator: PlayerCreator): void;
  create(type: PlayerType): PlayerCreator;
  getAvailableTypes(): PlayerType[];
  isRegistered(type: PlayerType): boolean;
}

export class PlayerRegistry implements PlayerRegistryInterface {
  private players = new Map<PlayerType, PlayerCreator>();

  register(type: PlayerType, creator: PlayerCreator): void {
    this.players.set(type, creator);
  }

  create(type: PlayerType): PlayerCreator {
    const creator = this.players.get(type);
    if (!creator) {
      throw new Error(
        `Player type "${type}" is not registered. Available types: ${this.getAvailableTypes().join(', ')}`,
      );
    }
    return creator;
  }

  getAvailableTypes(): PlayerType[] {
    return Array.from(this.players.keys());
  }

  isRegistered(type: PlayerType): boolean {
    return this.players.has(type);
  }

  createAll(): Record<PlayerType, PlayerCreator> {
    const result = {} as Record<PlayerType, PlayerCreator>;
    this.players.forEach((creator, type) => {
      result[type] = creator;
    });
    return result;
  }
}

export const createDefaultPlayerRegistry = async (): Promise<PlayerRegistry> => {
  const registry = new PlayerRegistry();

  try {
    // Import all players
    const [mockModule, dqnModule, menaceModule, azureModule] = await Promise.all([
      import('./MockPlayer'),
      import('./DQNPlayer'),
      import('./MenacePlayer'),
      import('./AzureFunctionPlayer'),
    ]);

    // Register all available players
    registry.register(PlayerType.Mock, mockModule.createMockPlayer);
    registry.register(PlayerType.DQN, dqnModule.createDQNPlayer);
    registry.register(PlayerType.Menace, menaceModule.createMenacePlayer);
    registry.register(PlayerType.Azure, azureModule.createAzureFunctionPlayer);
  } catch (error) {
    console.error('Failed to load player modules:', error);
    throw error;
  }

  return registry;
};
