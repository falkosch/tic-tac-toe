import { render } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';

import { type CellOwner, CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import { type Points } from '../../../meta-model/GameView';
import { WinnerView } from './WinnerView';

describe('WinnerView', () => {
  let winner: Readonly<CellOwner>;
  let wins: Readonly<Points>;

  beforeEach(() => {
    winner = CellOwnerX;
    wins = {
      [CellOwnerO]: 0,
      [CellOwnerX]: 0,
    };
  });

  it('renders without crashing', () => {
    render(<WinnerView winner={winner} wins={wins} />);
  });
});
