import { CellOwner } from '../../meta-model/CellOwner';
import { type GameView, type Points } from '../../meta-model/GameView';

export interface ActionToken {
  (affectedCellsAt: readonly number[], error?: Readonly<Error>): void;

  (): void;
}

export interface GameStateType {
  actionToken?: ActionToken;
  gameView?: Readonly<GameView>;
  winner?: Readonly<CellOwner> | Readonly<Error>;
  wins: Readonly<Points>;
}

export const initialGameState: Readonly<GameStateType> = {
  wins: {
    [CellOwner.O]: 0,
    [CellOwner.X]: 0,
  },
};
