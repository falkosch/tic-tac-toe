import { vi } from 'vitest';

import { type GameConfigurationType } from '../app/game-configuration/GameConfiguration';
import { PlayerTypeHuman, PlayerTypeMock } from '../app/game-configuration/PlayerType.ts';
import { type GameStateType } from '../app/game-state/GameState';
import { type Board } from '../meta-model/Board';
import {
  CellOwnerNone,
  CellOwnerO,
  CellOwnerX,
  type SpecificCellOwner,
} from '../meta-model/CellOwner';
import {
  ConsecutiveDirectionHorizontal,
  ConsecutiveDirectionVertical,
} from '../meta-model/ConsecutiveDirection.ts';
import { type GameView } from '../meta-model/GameView';
import { type Player } from '../meta-model/Player';

export const createMockBoard = (cells?: string[]): Board => ({
  dimensions: { width: 3, height: 3 },
  cells: cells ?? Array(9).fill(CellOwnerNone),
});

export const createMockGameView = (overrides: Partial<GameView> = {}): GameView => ({
  board: createMockBoard(),
  consecutive: [],
  points: {
    [CellOwnerX]: 0,
    [CellOwnerO]: 0,
  },
  ...overrides,
});

export const createMockGameState = (overrides: Partial<GameStateType> = {}): GameStateType => ({
  gameView: createMockGameView(),
  actionToken: undefined,
  winner: undefined,
  wins: {
    [CellOwnerX]: 0,
    [CellOwnerO]: 0,
  },
  ...overrides,
});

export const createMockGameConfiguration = (
  overrides: Partial<GameConfigurationType> = {},
): GameConfigurationType => ({
  playerTypes: {
    [CellOwnerX]: PlayerTypeHuman,
    [CellOwnerO]: PlayerTypeMock,
  },
  autoNewGame: false,
  ...overrides,
});

export const createMockPlayer = (): Player => ({
  takeTurn: vi.fn().mockResolvedValue({ affectedCellsAt: [0] }),
  onGameStart: vi.fn().mockResolvedValue(undefined),
  onGameEnd: vi.fn().mockResolvedValue(undefined),
  onGameViewUpdate: vi.fn().mockResolvedValue(undefined),
});

export const createWinningGameView = (winner: SpecificCellOwner): GameView => {
  const cells = Array(9).fill(CellOwnerNone);

  if (winner === CellOwnerX) {
    cells[0] = CellOwnerX;
    cells[1] = CellOwnerX;
    cells[2] = CellOwnerX;
  } else {
    cells[0] = CellOwnerO;
    cells[3] = CellOwnerO;
    cells[6] = CellOwnerO;
  }

  return createMockGameView({
    board: createMockBoard(cells),
    consecutive:
      winner === CellOwnerX
        ? [{ cellsAt: [0, 1, 2], direction: ConsecutiveDirectionHorizontal }]
        : [{ cellsAt: [0, 3, 6], direction: ConsecutiveDirectionVertical }],
    points: {
      [CellOwnerX]: winner === CellOwnerX ? 3 : 0,
      [CellOwnerO]: winner === CellOwnerO ? 3 : 0,
    },
  });
};
