import { type GameView } from '../../meta-model/GameView';
import { type GameStateType } from './GameState';

export interface SetGameViewActionPayload {
  gameView: Readonly<GameView> | undefined;
}

export const setGameView = (
  prevState: Readonly<GameStateType>,
  payload: Readonly<SetGameViewActionPayload>,
): GameStateType => {
  const { gameView } = payload;
  return {
    ...prevState,
    gameView,
  };
};
