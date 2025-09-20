import { CellOwner } from '../meta-model/CellOwner';
import { type Board } from '../meta-model/Board';
import { type GameView, ConsecutiveDirection } from '../meta-model/GameView';
import { type GameStateType } from '../app/game-state/GameState';
import {
  type GameConfigurationType,
  PlayerType,
} from '../app/game-configuration/GameConfiguration';
import { type Player } from '../meta-model/Player';

export const createMockBoard = (cells?: string[]): Board => ({
  dimensions: { width: 3, height: 3 },
  cells: cells ?? Array(9).fill(CellOwner.None),
});

export const createMockGameView = (overrides: Partial<GameView> = {}): GameView => ({
  board: createMockBoard(),
  consecutive: [],
  points: {
    [CellOwner.X]: 0,
    [CellOwner.O]: 0,
  },
  ...overrides,
});

export const createMockGameState = (overrides: Partial<GameStateType> = {}): GameStateType => ({
  gameView: createMockGameView(),
  actionToken: undefined,
  winner: undefined,
  wins: {
    [CellOwner.X]: 0,
    [CellOwner.O]: 0,
  },
  ...overrides,
});

export const createMockGameConfiguration = (
  overrides: Partial<GameConfigurationType> = {},
): GameConfigurationType => ({
  playerTypes: {
    [CellOwner.X]: PlayerType.Human,
    [CellOwner.O]: PlayerType.Mock,
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

export const createWinningGameView = (winner: CellOwner.X | CellOwner.O): GameView => {
  const cells = Array(9).fill(CellOwner.None);

  if (winner === CellOwner.X) {
    cells[0] = CellOwner.X;
    cells[1] = CellOwner.X;
    cells[2] = CellOwner.X;
  } else {
    cells[0] = CellOwner.O;
    cells[3] = CellOwner.O;
    cells[6] = CellOwner.O;
  }

  return createMockGameView({
    board: createMockBoard(cells),
    consecutive:
      winner === CellOwner.X
        ? [{ cellsAt: [0, 1, 2], direction: ConsecutiveDirection.Horizontal }]
        : [{ cellsAt: [0, 3, 6], direction: ConsecutiveDirection.Vertical }],
    points: {
      [CellOwner.X]: winner === CellOwner.X ? 3 : 0,
      [CellOwner.O]: winner === CellOwner.O ? 3 : 0,
    },
  });
};
