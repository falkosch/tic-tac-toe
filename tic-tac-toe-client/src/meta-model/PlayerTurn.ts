import { type GameActionHistory } from './GameActionHistory';
import { type GameView } from './GameView';
import { type SpecificCellOwner } from './CellOwner';

export interface PlayerTurn {
  cellOwner: Readonly<SpecificCellOwner>;
  gameView: Readonly<GameView>;
  actionHistory?: Readonly<GameActionHistory>;
}
