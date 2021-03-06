import { findFreeCellIndices, takeAny } from './ai-agent/Decision';
import { AttackGameAction } from '../meta-model/GameAction';
import { PlayerCreator } from '../meta-model/Player';
import { PlayerTurn } from '../meta-model/PlayerTurn';

export const createMockPlayer: PlayerCreator = async () => ({
  async takeTurn(playerTurn: Readonly<PlayerTurn>): Promise<AttackGameAction> {
    const freeCellIndices = findFreeCellIndices(playerTurn.gameView.board.cells);
    return {
      affectedCellsAt: takeAny(freeCellIndices),
    };
  },
});
