import { type SpecificCellOwner } from './CellOwner';
import { type AttackGameAction } from './GameAction';
import { type GameEndState } from './GameEndState';
import { type GameView } from './GameView';
import { type PlayerTurn } from './PlayerTurn';

/**
 * Enables players to interact with the game.
 */
export interface Player {
  takeTurn(playerTurn: Readonly<PlayerTurn>): Promise<AttackGameAction>;

  onGameStart?(cellOwner: Readonly<SpecificCellOwner>, gameView: Readonly<GameView>): Promise<void>;

  onGameViewUpdate?(
    cellOwner: Readonly<SpecificCellOwner>,
    gameView: Readonly<GameView>,
  ): Promise<void>;

  onGameEnd?(
    cellOwner: Readonly<SpecificCellOwner>,
    endState: Readonly<GameEndState>,
  ): Promise<void>;
}

export type PlayerCreator = () => Promise<Player>;
