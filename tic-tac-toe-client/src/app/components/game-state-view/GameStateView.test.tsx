import { render } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';

import { CellOwner } from '../../../meta-model/CellOwner';
import { type GameStateType } from '../../game-state/GameState';
import { GameStateView } from './GameStateView';

describe('GameStateView', () => {
  let gameState: GameStateType;

  beforeEach(() => {
    gameState = {
      wins: {
        [CellOwner.O]: 0,
        [CellOwner.X]: 0,
      },
    };
  });

  it('renders without crashing', () => {
    render(<GameStateView gameState={gameState} />);
  });
});
