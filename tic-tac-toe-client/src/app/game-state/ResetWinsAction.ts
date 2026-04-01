import { type SpecificCellOwner } from '../../meta-model/CellOwner';
import { type GameStateType } from './GameState';

export interface ResetWinsActionPayload {
  player: Readonly<SpecificCellOwner>;
}

export const resetWins = (
  prevState: Readonly<GameStateType>,
  payload: Readonly<ResetWinsActionPayload>,
): GameStateType => {
  const { player } = payload;
  return {
    ...prevState,
    wins: {
      ...prevState.wins,
      [player]: 0,
    },
  };
};
