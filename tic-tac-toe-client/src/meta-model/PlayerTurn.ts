import { type SpecificCellOwner } from './CellOwner';
import { type GameActionHistory } from './GameActionHistory';
import { type GameView } from './GameView';

export interface PlayerTurn {
  cellOwner: Readonly<SpecificCellOwner>;
  gameView: Readonly<GameView>;
  actionHistory?: Readonly<GameActionHistory>;
}
