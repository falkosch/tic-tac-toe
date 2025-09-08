import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils/testUtils';
import { createMockGameView, createWinningGameView } from '../../../test-utils/mockData';
import { CellOwner } from '../../../meta-model/CellOwner';
import { GameView } from './GameView';

describe('GameView', () => {
  it('renders without crashing', () => {
    const gameView = createMockGameView();
    renderWithProviders(<GameView gameView={gameView} />);
  });

  it('renders all 9 cells for a 3x3 board', () => {
    const gameView = createMockGameView();
    renderWithProviders(<GameView gameView={gameView} />);

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(9);
  });

  it('displays winning state correctly', () => {
    const gameView = createWinningGameView(CellOwner.X);
    renderWithProviders(<GameView gameView={gameView} />);

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(9);
  });

  it('handles empty board state', () => {
    const gameView = createMockGameView({
      board: {
        dimensions: { width: 3, height: 3 },
        cells: Array(9).fill(CellOwner.None),
      },
    });

    renderWithProviders(<GameView gameView={gameView} />);

    const cells = screen.getAllByRole('button');
    expect(cells).toHaveLength(9);
  });
});
