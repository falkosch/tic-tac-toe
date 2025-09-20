import { addWin } from './AddWinAction';
import { setActionToken } from './SetActionTokenAction';
import { setGameView } from './SetGameViewAction';
import { setWinner } from './SetWinnerAction';
import { CellOwnerNone } from '../../meta-model/CellOwner';
import { type GameEndState } from '../../meta-model/GameEndState';
import { type GameStateType } from './GameState';

export interface EndGameActionPayload {
  endState: Readonly<GameEndState>;
}

export const endGame = (
  prevState: Readonly<GameStateType>,
  payload: Readonly<EndGameActionPayload>,
): GameStateType => {
  const {
    endState: { visit, gameView },
  } = payload;

  let nextGameState = prevState;

  nextGameState = setGameView(nextGameState, { gameView });

  visit({
    drawEndState() {
      nextGameState = setWinner(nextGameState, { value: CellOwnerNone });
    },
    erroneousEndState(error) {
      nextGameState = setWinner(nextGameState, { value: error });
    },
    oneWinnerEndState(winner) {
      nextGameState = setWinner(nextGameState, { value: winner });
      nextGameState = addWin(nextGameState, { player: winner });
    },
  });

  // Clear the actionToken to enable the "New game" button after game completion
  nextGameState = setActionToken(nextGameState, { actionToken: undefined });

  return nextGameState;
};
