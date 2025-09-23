import { type SpecificCellOwner } from './CellOwner';
import { type GameView } from './GameView';

export interface GameEndStateVisitor {
  drawEndState(moveLimitReached: boolean): void;

  oneWinnerEndState(winner: Readonly<SpecificCellOwner>): void;

  erroneousEndState(error: Readonly<Error>): void;
}

export type GameEndStateVisit = (visitor: Readonly<Partial<GameEndStateVisitor>>) => void;

export interface GameEndState {
  visit: GameEndStateVisit;
  gameView: Readonly<GameView>;
}
