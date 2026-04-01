import { type GameView } from '../../meta-model/GameView';
import { type GameStateType } from './GameState';
import { setActionToken } from './SetActionTokenAction';
import { setGameView } from './SetGameViewAction';
import { setWinner } from './SetWinnerAction';

export interface StartNewGameActionPayload {
  gameView: Readonly<GameView>;
}

export const startNewGame = (
  prevState: Readonly<GameStateType>,
  payload: Readonly<StartNewGameActionPayload>,
): GameStateType => {
  const { gameView } = payload;
  let nextGameState = prevState;

  nextGameState = setActionToken(nextGameState, {});
  nextGameState = setGameView(nextGameState, { gameView });
  nextGameState = setWinner(nextGameState, { value: undefined });

  return nextGameState;
};
