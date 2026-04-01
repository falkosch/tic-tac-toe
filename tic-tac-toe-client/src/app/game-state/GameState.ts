import { type CellOwner, CellOwnerO, CellOwnerX } from '../../meta-model/CellOwner';
import { type GameView, type Points } from '../../meta-model/GameView';

export type ActionToken = (affectedCellsAt?: readonly number[], error?: Readonly<Error>) => void;

export interface GameStateType {
  actionToken?: ActionToken;
  gameView?: Readonly<GameView>;
  winner?: Readonly<CellOwner> | Readonly<Error>;
  wins: Readonly<Points>;
}

export const initialGameState: Readonly<GameStateType> = {
  wins: {
    [CellOwnerO]: 0,
    [CellOwnerX]: 0,
  },
};
