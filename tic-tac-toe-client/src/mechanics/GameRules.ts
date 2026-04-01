import { type Board } from '../meta-model/Board';
import {
  type CellOwner,
  CellOwnerNone,
  CellOwnerO,
  CellOwnerX,
  type SpecificCellOwner,
} from '../meta-model/CellOwner';
import { type Consecutive, type GameView } from '../meta-model/GameView';

type Points = Record<SpecificCellOwner, number>;

export const countPoints = (
  board: Readonly<Board>,
  consecutive: readonly Consecutive[],
): Points => {
  const pointsTracking = {
    [CellOwnerO]: 0,
    [CellOwnerX]: 0,
  };
  consecutive.forEach(({ cellsAt }) => {
    const cellOwner = board.cells[cellsAt[0]];
    if (cellOwner !== CellOwnerNone) {
      pointsTracking[cellOwner] += cellsAt.length;
    }
  });
  return pointsTracking;
};

export const pointsLeader = (points: Readonly<Points>): SpecificCellOwner | undefined => {
  let winnerPoints = 0;
  let winner;
  Object.entries(points).forEach(([cellOwnerKey, value]) => {
    if (winnerPoints < value) {
      winnerPoints = value;
      winner = cellOwnerKey as SpecificCellOwner;
    }
  });
  return winner;
};

const remainingMoves = (cells: readonly CellOwner[]): number =>
  cells.reduce((acc, cellOwner) => acc + (cellOwner === CellOwnerNone ? 1 : 0), 0);

export const isOneWinnerEnding = (gameView: Readonly<GameView>): boolean =>
  // for now, the occurrence of a first consecutive sequence ends the game
  gameView.consecutive.length > 0;

export const isDrawEnding = (gameView: Readonly<GameView>): boolean =>
  !isOneWinnerEnding(gameView) && remainingMoves(gameView.board.cells) === 0;
