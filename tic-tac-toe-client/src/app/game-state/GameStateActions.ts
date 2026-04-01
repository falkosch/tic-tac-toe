import { type AddWinActionPayload } from './AddWinAction';
import { type EndGameActionPayload } from './EndGameAction';
import { type ResetWinsActionPayload } from './ResetWinsAction';
import { type SetActionTokenActionPayload } from './SetActionTokenAction';
import { type SetGameViewActionPayload } from './SetGameViewAction';
import { type SetWinnerActionPayload } from './SetWinnerAction';
import { type StartNewGameActionPayload } from './StartNewGameAction';
import { type UpdateGameActionPayload } from './UpdateGameAction';

export const GameStateActionTypeAddWin = 'ADD_WIN';
export const GameStateActionTypeEndGame = 'END_GAME';
export const GameStateActionTypeResetWins = 'RESET_WINS';
export const GameStateActionTypeSetActionToken = 'SET_ACTION_TOKEN';
export const GameStateActionTypeSetGameView = 'SET_GAME_VIEW';
export const GameStateActionTypeSetWinner = 'SET_WINNER';
export const GameStateActionTypeStartNewGame = 'START_NEW_GAME';
export const GameStateActionTypeUpdateGame = 'UPDATE_GAME';

export type GameStateActionType =
  | typeof GameStateActionTypeAddWin
  | typeof GameStateActionTypeEndGame
  | typeof GameStateActionTypeResetWins
  | typeof GameStateActionTypeSetActionToken
  | typeof GameStateActionTypeSetGameView
  | typeof GameStateActionTypeSetWinner
  | typeof GameStateActionTypeStartNewGame
  | typeof GameStateActionTypeUpdateGame;

interface AddWinAction {
  type: typeof GameStateActionTypeAddWin;
  payload: AddWinActionPayload;
}

interface EndGameAction {
  type: typeof GameStateActionTypeEndGame;
  payload: EndGameActionPayload;
}

interface ResetWinsAction {
  type: typeof GameStateActionTypeResetWins;
  payload: ResetWinsActionPayload;
}

interface SetActionTokenAction {
  type: typeof GameStateActionTypeSetActionToken;
  payload: SetActionTokenActionPayload;
}

interface SetGameViewAction {
  type: typeof GameStateActionTypeSetGameView;
  payload: SetGameViewActionPayload;
}

interface SetWinnerAction {
  type: typeof GameStateActionTypeSetWinner;
  payload: SetWinnerActionPayload;
}

interface StartNewGameAction {
  type: typeof GameStateActionTypeStartNewGame;
  payload: StartNewGameActionPayload;
}

interface UpdateGameAction {
  type: typeof GameStateActionTypeUpdateGame;
  payload: UpdateGameActionPayload;
}

export type GameStateAction =
  | AddWinAction
  | EndGameAction
  | ResetWinsAction
  | SetActionTokenAction
  | SetGameViewAction
  | SetWinnerAction
  | StartNewGameAction
  | UpdateGameAction;

export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
};
