import { type Board } from './Board';
import { type SpecificCellOwner } from './CellOwner';

export const enum ConsecutiveDirection {
  Horizontal = 'H',
  Vertical = 'V',
  DiagonalTR2BL = 'TR2BL',
  DiagonalTL2BR = 'TL2BR',
}

export interface Consecutive {
  cellsAt: readonly number[];
  direction: Readonly<ConsecutiveDirection>;
}

export type Points = Record<SpecificCellOwner, number>;

export interface GameView {
  board: Readonly<Board>;
  consecutive: readonly Consecutive[];
  points: Readonly<Points>;
}
