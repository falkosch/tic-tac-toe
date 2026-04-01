import { CellOwnerO, CellOwnerX, type SpecificCellOwner } from '../../meta-model/CellOwner';
import { type PlayerCreator } from '../../meta-model/Player';
import { type PlayerType, PlayerTypeDQN, PlayerTypeHuman } from './PlayerType.ts';

export type PlayerCreators = Record<Readonly<PlayerType>, PlayerCreator>;

export type PlayerConfiguration = Record<SpecificCellOwner, Readonly<PlayerType>>;

export interface GameConfigurationType {
  autoNewGame: boolean;
  playerTypes: Readonly<PlayerConfiguration>;
}

export const initialGameConfiguration: Readonly<GameConfigurationType> = {
  autoNewGame: false,
  playerTypes: {
    [CellOwnerX]: PlayerTypeHuman,
    [CellOwnerO]: PlayerTypeDQN,
  },
};
