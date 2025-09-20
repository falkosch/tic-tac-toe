import { type AttackGameAction } from '../meta-model/GameAction';
import { type CellOwner, CellOwnerNone } from '../meta-model/CellOwner';
import { type Board } from '../meta-model/Board';

export type BoardModifier = (board: Readonly<Board>) => Board;

export type CellModifier = (
  currentCellOwner: Readonly<CellOwner>,
  currentCellAt: number,
) => CellOwner;

export const buildCellModifier = (
  attack: Readonly<AttackGameAction>,
  newOwner: Readonly<CellOwner>,
): CellModifier => {
  return (currentCellOwner, currentCellAt) => {
    if (!attack.affectedCellsAt.includes(currentCellAt)) {
      return currentCellOwner;
    }
    if (currentCellOwner !== CellOwnerNone) {
      return currentCellOwner;
    }
    return newOwner;
  };
};

export const buildBoardModifier = (
  attack: Readonly<AttackGameAction>,
  newOwner: Readonly<CellOwner>,
): BoardModifier => {
  const cellModifier = buildCellModifier(attack, newOwner);
  return (board) => ({
    cells: board.cells.map(cellModifier),
    dimensions: board.dimensions,
  });
};
