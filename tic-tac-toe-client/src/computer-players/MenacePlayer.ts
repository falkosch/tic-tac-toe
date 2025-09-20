import { findMenaceDecision } from './menace-match-boxes/MenaceAgent';
import { getMenaceAgent } from './menace-match-boxes/EpsilonGreedyMenaceAgent';
import { notifyEndState } from './ai-agent/AIAgent';
import { type AttackGameAction } from '../meta-model/GameAction';
import { type GameEndState } from '../meta-model/GameEndState';
import { type GameView } from '../meta-model/GameView';
import { type PlayerCreator } from '../meta-model/Player';
import { type PlayerTurn } from '../meta-model/PlayerTurn';
import { type SpecificCellOwner } from '../meta-model/CellOwner';

export const createMenacePlayer: PlayerCreator = async () => ({
  /**
   * Implements the concept Menace Match Box Engine developed by Donald Michie. Code itself is
   * based upon {@link https://github.com/andrewmccarthy/menace}.
   */
  async takeTurn(playerTurn: Readonly<PlayerTurn>): Promise<AttackGameAction> {
    const agent = await getMenaceAgent(playerTurn.cellOwner, playerTurn.gameView.board.dimensions);
    const decision = await findMenaceDecision(agent, playerTurn.gameView.board);
    return {
      affectedCellsAt: decision ? decision.cellsAtToAttack : [],
    };
  },

  async onGameStart(
    cellOwner: Readonly<SpecificCellOwner>,
    gameView: Readonly<GameView>,
  ): Promise<void> {
    const agent = await getMenaceAgent(cellOwner, gameView.board.dimensions);
    await agent.startNewGame();
  },

  async onGameEnd(
    cellOwner: Readonly<SpecificCellOwner>,
    endState: Readonly<GameEndState>,
  ): Promise<void> {
    const agent = await getMenaceAgent(cellOwner, endState.gameView.board.dimensions);
    await notifyEndState(endState, agent);
  },
});
