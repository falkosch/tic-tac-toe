import { render } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';

import { CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import { type GameStateType } from '../../game-state/GameState';
import { GameStateView } from './GameStateView';

describe('GameStateView', () => {
  let gameState: GameStateType;

  beforeEach(() => {
    gameState = {
      wins: {
        [CellOwnerO]: 0,
        [CellOwnerX]: 0,
      },
    };
  });

  it('renders without crashing', () => {
    render(<GameStateView gameState={gameState} />);
  });
});
