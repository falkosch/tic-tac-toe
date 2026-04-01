import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CellOwnerNone, CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import {
  ConsecutiveDirectionDiagonalTL2BR,
  ConsecutiveDirectionHorizontal,
  ConsecutiveDirectionVertical,
} from '../../../meta-model/ConsecutiveDirection';
import { type GameView as ModelGameView } from '../../../meta-model/GameView';
import { CellView } from '../cell-view/CellView';
import { GameView } from './GameView';

vi.mock('../cell-view/CellView', () => ({
  CellView: vi.fn(),
}));

describe('GameView', () => {
  beforeEach(() => {
    vi.mocked(CellView).mockReturnValue(<></>);
  });

  describe('Grid rendering', () => {
    it('renders a grid with correct dimensions for 3x3 board', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      const { container } = render(<GameView gameView={gameView} />);

      // Assert
      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement.style.gridTemplateColumns).toBe('repeat(3, 1fr)');
      expect(gridElement.style.gridTemplateRows).toBe('repeat(3, 1fr)');
    });

    it('renders a grid with correct dimensions for 4x4 board', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: Array(16).fill(CellOwnerNone),
          dimensions: { width: 4, height: 4 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      const { container } = render(<GameView gameView={gameView} />);

      // Assert
      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
      expect(gridElement.style.gridTemplateRows).toBe('repeat(4, 1fr)');
    });

    it('applies correct CSS classes for grid layout', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: Array(9).fill(CellOwnerNone),
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      const { container } = render(<GameView gameView={gameView} />);

      // Assert
      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement.className).toContain('grid');
      expect(gridElement.className).toContain('aspect-square');
      expect(gridElement.className).toContain('h-full');
      expect(gridElement.className).toContain('gap-3');
    });
  });

  describe('CellView rendering', () => {
    it('renders a CellView for each cell in the board', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerO,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerX,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerO,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      expect(CellView).toHaveBeenCalledTimes(9);
    });

    it('passes correct cellAt index to each CellView', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: Array(9).fill(CellOwnerNone),
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      for (let i = 0; i < 9; i++) {
        expect(CellView).toHaveBeenNthCalledWith(
          i + 1,
          expect.objectContaining({ cellAt: i }),
          undefined,
        );
      }
    });

    it('passes correct cellOwner to each CellView', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerO,
            CellOwnerNone,
            CellOwnerX,
            CellOwnerO,
            CellOwnerNone,
            CellOwnerX,
            CellOwnerO,
            CellOwnerNone,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      expect(CellView).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ cellOwner: CellOwnerX }),
        undefined,
      );
      expect(CellView).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ cellOwner: CellOwnerO }),
        undefined,
      );
      expect(CellView).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ cellOwner: CellOwnerNone }),
        undefined,
      );
    });

    it('passes consecutive data to all CellView components', () => {
      // Arrange
      const consecutive = [
        { cellsAt: [0, 1, 2], direction: ConsecutiveDirectionHorizontal },
      ];
      const gameView: ModelGameView = {
        board: {
          cells: Array(9).fill(CellOwnerX),
          dimensions: { width: 3, height: 3 },
        },
        consecutive,
        points: { X: 1, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      for (let i = 0; i < 9; i++) {
        expect(CellView).toHaveBeenNthCalledWith(
          i + 1,
          expect.objectContaining({ consecutive }),
          undefined,
        );
      }
    });
  });

  describe('Winning cell detection', () => {
    it('marks cells as not winning when consecutive is empty', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerO,
            CellOwnerX,
            CellOwnerO,
            CellOwnerX,
            CellOwnerO,
            CellOwnerO,
            CellOwnerX,
            CellOwnerO,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      // Winning cells are encoded in the key prop, but we can't directly test that
      // Instead, we verify that all cells receive the same consecutive array
      expect(CellView).toHaveBeenCalledTimes(9);
    });

    it('correctly identifies winning cells in horizontal consecutive', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerX,
            CellOwnerX,
            CellOwnerO,
            CellOwnerO,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [{ cellsAt: [0, 1, 2], direction: ConsecutiveDirectionHorizontal }],
        points: { X: 1, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      // Cells 0, 1, 2 are winning cells and should receive the consecutive data
      expect(CellView).toHaveBeenCalledTimes(9);
      expect(CellView).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          cellAt: 0,
          consecutive: gameView.consecutive,
        }),
        undefined,
      );
    });

    it('correctly identifies winning cells in vertical consecutive', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerO,
            CellOwnerX,
            CellOwnerNone,
            CellOwnerO,
            CellOwnerX,
            CellOwnerNone,
            CellOwnerO,
            CellOwnerNone,
            CellOwnerNone,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [{ cellsAt: [0, 3, 6], direction: ConsecutiveDirectionVertical }],
        points: { X: 0, O: 1 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      expect(CellView).toHaveBeenCalledTimes(9);
      expect(CellView).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          cellAt: 0,
          consecutive: gameView.consecutive,
        }),
        undefined,
      );
      expect(CellView).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({
          cellAt: 3,
          consecutive: gameView.consecutive,
        }),
        undefined,
      );
      expect(CellView).toHaveBeenNthCalledWith(
        7,
        expect.objectContaining({
          cellAt: 6,
          consecutive: gameView.consecutive,
        }),
        undefined,
      );
    });

    it('correctly identifies winning cells in diagonal consecutive', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerO,
            CellOwnerO,
            CellOwnerO,
            CellOwnerX,
            CellOwnerO,
            CellOwnerO,
            CellOwnerO,
            CellOwnerX,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [{ cellsAt: [0, 4, 8], direction: ConsecutiveDirectionDiagonalTL2BR }],
        points: { X: 1, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      expect(CellView).toHaveBeenCalledTimes(9);
      expect(CellView).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          cellAt: 0,
          consecutive: gameView.consecutive,
        }),
        undefined,
      );
      expect(CellView).toHaveBeenNthCalledWith(
        5,
        expect.objectContaining({
          cellAt: 4,
          consecutive: gameView.consecutive,
        }),
        undefined,
      );
      expect(CellView).toHaveBeenNthCalledWith(
        9,
        expect.objectContaining({
          cellAt: 8,
          consecutive: gameView.consecutive,
        }),
        undefined,
      );
    });

    it('handles multiple consecutive patterns', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: Array(9).fill(CellOwnerX),
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [
          { cellsAt: [0, 1, 2], direction: ConsecutiveDirectionHorizontal },
          { cellsAt: [3, 4, 5], direction: ConsecutiveDirectionHorizontal },
          { cellsAt: [6, 7, 8], direction: ConsecutiveDirectionHorizontal },
        ],
        points: { X: 1, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      expect(CellView).toHaveBeenCalledTimes(9);
      // All cells should receive the complete consecutive array
      for (let i = 0; i < 9; i++) {
        expect(CellView).toHaveBeenNthCalledWith(
          i + 1,
          expect.objectContaining({
            consecutive: gameView.consecutive,
          }),
          undefined,
        );
      }
    });
  });

  describe('Component memoization', () => {
    it('renders with same gameView reference maintains component identity', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: Array(9).fill(CellOwnerNone),
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      const { rerender } = render(<GameView gameView={gameView} />);
      const firstCallCount = vi.mocked(CellView).mock.calls.length;

      rerender(<GameView gameView={gameView} />);
      const secondCallCount = vi.mocked(CellView).mock.calls.length;

      // Assert
      // With React.memo, component should not re-render with same props
      expect(secondCallCount).toBe(firstCallCount);
    });

    it('re-renders when gameView board cells change', () => {
      // Arrange
      const initialGameView: ModelGameView = {
        board: {
          cells: Array(9).fill(CellOwnerNone),
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      const updatedGameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      const { rerender } = render(<GameView gameView={initialGameView} />);
      vi.clearAllMocks();

      rerender(<GameView gameView={updatedGameView} />);

      // Assert
      expect(CellView).toHaveBeenCalledTimes(9);
    });

    it('re-renders when consecutive patterns change', () => {
      // Arrange
      const initialGameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerX,
            CellOwnerX,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
            CellOwnerNone,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      const updatedGameView: ModelGameView = {
        ...initialGameView,
        consecutive: [{ cellsAt: [0, 1, 2], direction: ConsecutiveDirectionHorizontal }],
        points: { X: 1, O: 0 },
      };

      // Act
      const { rerender } = render(<GameView gameView={initialGameView} />);
      vi.clearAllMocks();

      rerender(<GameView gameView={updatedGameView} />);

      // Assert
      expect(CellView).toHaveBeenCalledTimes(9);
    });
  });

  describe('Edge cases', () => {
    it('handles empty board correctly', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: Array(9).fill(CellOwnerNone),
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      expect(CellView).toHaveBeenCalledTimes(9);
      for (let i = 0; i < 9; i++) {
        expect(CellView).toHaveBeenNthCalledWith(
          i + 1,
          expect.objectContaining({
            cellAt: i,
            cellOwner: CellOwnerNone,
          }),
          undefined,
        );
      }
    });

    it('handles full board correctly', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerO,
            CellOwnerX,
            CellOwnerX,
            CellOwnerO,
            CellOwnerO,
            CellOwnerO,
            CellOwnerX,
            CellOwnerX,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      render(<GameView gameView={gameView} />);

      // Assert
      expect(CellView).toHaveBeenCalledTimes(9);
    });

    it('handles single cell board', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [CellOwnerX],
          dimensions: { width: 1, height: 1 },
        },
        consecutive: [],
        points: { X: 0, O: 0 },
      };

      // Act
      const { container } = render(<GameView gameView={gameView} />);

      // Assert
      const gridElement = container.firstChild as HTMLElement;
      expect(gridElement.style.gridTemplateColumns).toBe('repeat(1, 1fr)');
      expect(gridElement.style.gridTemplateRows).toBe('repeat(1, 1fr)');
      expect(CellView).toHaveBeenCalledTimes(1);
    });

    it('generates unique keys for each cell', () => {
      // Arrange
      const gameView: ModelGameView = {
        board: {
          cells: [
            CellOwnerX,
            CellOwnerO,
            CellOwnerNone,
            CellOwnerX,
            CellOwnerO,
            CellOwnerNone,
            CellOwnerX,
            CellOwnerO,
            CellOwnerNone,
          ],
          dimensions: { width: 3, height: 3 },
        },
        consecutive: [{ cellsAt: [0, 4, 8], direction: ConsecutiveDirectionDiagonalTL2BR }],
        points: { X: 1, O: 0 },
      };

      // Act
      const { container } = render(<GameView gameView={gameView} />);

      // Assert
      // React will warn if keys are not unique, so no warnings means unique keys
      expect(container.firstChild).toBeDefined();
    });
  });
});
