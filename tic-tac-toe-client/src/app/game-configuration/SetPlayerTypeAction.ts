import { type SpecificCellOwner } from '../../meta-model/CellOwner';
import { type GameConfigurationType } from './GameConfiguration';
import { type PlayerType } from './PlayerType.ts';

export interface SetPlayerTypeActionPayload {
  player: Readonly<SpecificCellOwner>;
  playerType: Readonly<PlayerType>;
}

export const setPlayerType = (
  prevState: Readonly<GameConfigurationType>,
  payload: Readonly<SetPlayerTypeActionPayload>,
): GameConfigurationType => {
  const { player, playerType } = payload;
  return {
    ...prevState,
    playerTypes: {
      ...prevState.playerTypes,
      [player]: playerType,
    },
  };
};
