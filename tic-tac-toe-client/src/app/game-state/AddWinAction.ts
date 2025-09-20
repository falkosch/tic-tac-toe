import { type GameStateType } from './GameState';
import { type SpecificCellOwner } from '../../meta-model/CellOwner';

export interface AddWinActionPayload {
  player: Readonly<SpecificCellOwner> | undefined;
}

export const addWin = (
  prevState: Readonly<GameStateType>,
  payload: Readonly<AddWinActionPayload>,
): GameStateType => {
  const { player } = payload;
  if (player === undefined) {
    return { ...prevState };
  }
  return {
    ...prevState,
    wins: {
      ...prevState.wins,
      [player]: prevState.wins[player] + 1,
    },
  };
};
