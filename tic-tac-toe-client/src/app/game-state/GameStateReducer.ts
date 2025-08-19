import { Reducer } from 'react';

import { addWin } from './AddWinAction';
import { endGame } from './EndGameAction';
import { resetWins } from './ResetWinsAction';
import { setActionToken } from './SetActionTokenAction';
import { setGameView } from './SetGameViewAction';
import { setWinner } from './SetWinnerAction';
import { startNewGame } from './StartNewGameAction';
import { updateGame } from './UpdateGameAction';
import { GameStateType } from './GameState';
import { GameStateAction, GameStateActionType, assertNever } from './GameStateActions';

export type GameStateReducer = Reducer<GameStateType, GameStateAction>;

export const gameStateReducer: GameStateReducer = (
  prevState: Readonly<GameStateType>,
  action: Readonly<GameStateAction>,
): GameStateType => {
  switch (action.type) {
    case GameStateActionType.AddWin:
      return addWin(prevState, action.payload);

    case GameStateActionType.EndGame:
      return endGame(prevState, action.payload);

    case GameStateActionType.ResetWins:
      return resetWins(prevState, action.payload);

    case GameStateActionType.SetActionToken:
      return setActionToken(prevState, action.payload);

    case GameStateActionType.SetGameView:
      return setGameView(prevState, action.payload);

    case GameStateActionType.SetWinner:
      return setWinner(prevState, action.payload);

    case GameStateActionType.StartNewGame:
      return startNewGame(prevState, action.payload);

    case GameStateActionType.UpdateGame:
      return updateGame(prevState, action.payload);

    default:
      return assertNever(action);
  }
};

export { GameStateActionType } from './GameStateActions';
export type { GameStateAction } from './GameStateActions';
