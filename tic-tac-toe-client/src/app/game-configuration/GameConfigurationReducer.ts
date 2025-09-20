import { type Reducer } from 'react';

import { setAutoNewGame, type SetAutoNewGameActionPayload } from './SetAutoNewGameAction';
import { setPlayerType, type SetPlayerTypeActionPayload } from './SetPlayerTypeAction';
import { type GameConfigurationType } from './GameConfiguration';

export enum GameConfigurationActionType {
  SetAutoNewGame,
  SetPlayerType,
}

export type GameConfigurationActionPayload =
  | SetAutoNewGameActionPayload
  | SetPlayerTypeActionPayload;

export interface GameConfigurationAction {
  type: Readonly<GameConfigurationActionType>;
  payload: Readonly<GameConfigurationActionPayload>;
}

type ActionDelegate = (
  prevState: Readonly<GameConfigurationType>,
  payload: Readonly<GameConfigurationActionPayload>,
) => GameConfigurationType;

const typeToAction: Readonly<Record<GameConfigurationActionType, ActionDelegate>> = {
  [GameConfigurationActionType.SetAutoNewGame]: (prevState, payload) =>
    setAutoNewGame(prevState, payload as SetAutoNewGameActionPayload),

  [GameConfigurationActionType.SetPlayerType]: (prevState, payload) =>
    setPlayerType(prevState, payload as SetPlayerTypeActionPayload),
};

export type GameConfigurationReducer = Reducer<GameConfigurationType, GameConfigurationAction>;

export const gameConfigurationReducer: GameConfigurationReducer = (
  prevState: Readonly<GameConfigurationType>,
  gameConfigurationAction: Readonly<GameConfigurationAction>,
) => {
  const { type, payload } = gameConfigurationAction;
  const actionDelegate = typeToAction[type];
  if (actionDelegate) {
    return actionDelegate(prevState, payload);
  }
  throw new Error('unknown game configuration reducer action type');
};
