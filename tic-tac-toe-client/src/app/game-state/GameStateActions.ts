import { AddWinActionPayload } from './AddWinAction';
import { EndGameActionPayload } from './EndGameAction';
import { ResetWinsActionPayload } from './ResetWinsAction';
import { SetActionTokenActionPayload } from './SetActionTokenAction';
import { SetGameViewActionPayload } from './SetGameViewAction';
import { SetWinnerActionPayload } from './SetWinnerAction';
import { StartNewGameActionPayload } from './StartNewGameAction';
import { UpdateGameActionPayload } from './UpdateGameAction';

export enum GameStateActionType {
  AddWin = 'ADD_WIN',
  EndGame = 'END_GAME',
  ResetWins = 'RESET_WINS',
  SetActionToken = 'SET_ACTION_TOKEN',
  SetGameView = 'SET_GAME_VIEW',
  SetWinner = 'SET_WINNER',
  StartNewGame = 'START_NEW_GAME',
  UpdateGame = 'UPDATE_GAME',
}

interface AddWinAction {
  type: GameStateActionType.AddWin;
  payload: AddWinActionPayload;
}

interface EndGameAction {
  type: GameStateActionType.EndGame;
  payload: EndGameActionPayload;
}

interface ResetWinsAction {
  type: GameStateActionType.ResetWins;
  payload: ResetWinsActionPayload;
}

interface SetActionTokenAction {
  type: GameStateActionType.SetActionToken;
  payload: SetActionTokenActionPayload;
}

interface SetGameViewAction {
  type: GameStateActionType.SetGameView;
  payload: SetGameViewActionPayload;
}

interface SetWinnerAction {
  type: GameStateActionType.SetWinner;
  payload: SetWinnerActionPayload;
}

interface StartNewGameAction {
  type: GameStateActionType.StartNewGame;
  payload: StartNewGameActionPayload;
}

interface UpdateGameAction {
  type: GameStateActionType.UpdateGame;
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
