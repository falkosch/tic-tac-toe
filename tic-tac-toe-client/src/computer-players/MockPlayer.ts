import { findFreeCellIndices, takeAny } from './ai-agent/Decision';
import { type AttackGameAction } from '../meta-model/GameAction';
import { type PlayerCreator } from '../meta-model/Player';
import { type PlayerTurn } from '../meta-model/PlayerTurn';

export const createMockPlayer: PlayerCreator = async () => ({
  async takeTurn(playerTurn: Readonly<PlayerTurn>): Promise<AttackGameAction> {
    const freeCellIndices = findFreeCellIndices(playerTurn.gameView.board.cells);
    return {
      affectedCellsAt: takeAny(freeCellIndices),
    };
  },
});
