import { AttackGameAction } from './GameAction';
import { GameEndState } from './GameEndState';
import { GameView } from './GameView';
import { PlayerTurn } from './PlayerTurn';
import { SpecificCellOwner } from './CellOwner';

/**
 * Enables players to interact with the game.
 */
export interface Player {
  takeTurn(playerTurn: Readonly<PlayerTurn>): Promise<AttackGameAction>;
  onGameStart?(
    cellOwner: Readonly<SpecificCellOwner>,
    gameView: Readonly<GameView>
  ): void;
  onGameViewUpdate?(cellOwner: Readonly<SpecificCellOwner>, gameView: Readonly<GameView>): void;
  onGameEnd?(
    cellOwner: Readonly<SpecificCellOwner>,
    gameView: Readonly<GameView>,
    endState: Readonly<GameEndState>,
  ): void;
}