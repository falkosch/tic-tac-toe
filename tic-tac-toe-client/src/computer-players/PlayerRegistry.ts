import { type PlayerCreator } from '../meta-model/Player';

import {
  type PlayerType,
  PlayerTypeAzure,
  PlayerTypeDQN,
  PlayerTypeMenace,
  PlayerTypeMock,
} from '../app/game-configuration/PlayerType.ts';

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
    registry.register(PlayerTypeMock, mockModule.createMockPlayer);
    registry.register(PlayerTypeDQN, dqnModule.createDQNPlayer);
    registry.register(PlayerTypeMenace, menaceModule.createMenacePlayer);
    registry.register(PlayerTypeAzure, azureModule.createAzureFunctionPlayer);
  } catch (error) {
    console.error('Failed to load player modules:', error);
    throw error;
  }

  return registry;
};
