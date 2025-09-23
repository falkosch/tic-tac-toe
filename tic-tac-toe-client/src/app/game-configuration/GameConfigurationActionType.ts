export const GameConfigurationActionTypeSetAutoNewGame = 'SetAutoNewGame';
export const GameConfigurationActionTypeSetPlayerType = 'SetPlayerType';

export type GameConfigurationActionType =
  | typeof GameConfigurationActionTypeSetAutoNewGame
  | typeof GameConfigurationActionTypeSetPlayerType;
