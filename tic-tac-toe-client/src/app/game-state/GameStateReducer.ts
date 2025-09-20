import { type Reducer } from 'react';

import { addWin } from './AddWinAction';
import { endGame } from './EndGameAction';
import { resetWins } from './ResetWinsAction';
import { setActionToken } from './SetActionTokenAction';
import { setGameView } from './SetGameViewAction';
import { setWinner } from './SetWinnerAction';
import { startNewGame } from './StartNewGameAction';
import { updateGame } from './UpdateGameAction';
import { type GameStateType } from './GameState';
import {
  assertNever,
  type GameStateAction,
  GameStateActionTypeAddWin,
  GameStateActionTypeEndGame,
  GameStateActionTypeResetWins,
  GameStateActionTypeSetActionToken,
  GameStateActionTypeSetGameView,
  GameStateActionTypeSetWinner,
  GameStateActionTypeStartNewGame,
  GameStateActionTypeUpdateGame,
} from './GameStateActions';

export type GameStateReducer = Reducer<GameStateType, GameStateAction>;

export const gameStateReducer: GameStateReducer = (
  prevState: Readonly<GameStateType>,
  action: Readonly<GameStateAction>,
): GameStateType => {
  switch (action.type) {
    case GameStateActionTypeAddWin:
      return addWin(prevState, action.payload);

    case GameStateActionTypeEndGame:
      return endGame(prevState, action.payload);

    case GameStateActionTypeResetWins:
      return resetWins(prevState, action.payload);

    case GameStateActionTypeSetActionToken:
      return setActionToken(prevState, action.payload);

    case GameStateActionTypeSetGameView:
      return setGameView(prevState, action.payload);

    case GameStateActionTypeSetWinner:
      return setWinner(prevState, action.payload);

    case GameStateActionTypeStartNewGame:
      return startNewGame(prevState, action.payload);

    case GameStateActionTypeUpdateGame:
      return updateGame(prevState, action.payload);

    default:
      return assertNever(action);
  }
};
