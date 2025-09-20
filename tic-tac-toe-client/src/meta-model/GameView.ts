import { type Board } from './Board';
import { type SpecificCellOwner } from './CellOwner';
import { type ConsecutiveDirection } from './ConsecutiveDirection.ts';

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
