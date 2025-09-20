import { render } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';

import { CellOwner } from '../../../meta-model/CellOwner';
import { type Points } from '../../../meta-model/GameView';
import { WinnerView } from './WinnerView';

describe('WinnerView', () => {
  let winner: Readonly<CellOwner>;
  let wins: Readonly<Points>;

  beforeEach(() => {
    winner = CellOwner.X;
    wins = {
      [CellOwner.O]: 0,
      [CellOwner.X]: 0,
    };
  });

  it('renders without crashing', () => {
    render(<WinnerView winner={winner} wins={wins} />);
  });
});
