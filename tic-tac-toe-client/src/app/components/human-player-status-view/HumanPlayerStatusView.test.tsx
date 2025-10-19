import { randNumber } from '@ngneat/falso';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import { useGameState } from '../../context/GameContext';
import { HumanPlayerStatusView } from './HumanPlayerStatusView';

vi.mock('../../context/GameContext', () => ({
  useGameState: vi.fn(),
}));

describe('HumanPlayerStatusView', () => {
  const givenActionToken = vi.fn();
  const baseGameState = {
    gameState: {
      wins: {
        [CellOwnerX]: randNumber(),
        [CellOwnerO]: randNumber(),
      },
    },
    dispatch: vi.fn(),
  };

  describe('when action token is present', () => {
    beforeEach(() => {
      vi.mocked(useGameState).mockReturnValue({
        ...baseGameState,
        gameState: {
          ...baseGameState.gameState,
          actionToken: givenActionToken,
        },
      });
    });

    it('renders the component', () => {
      render(<HumanPlayerStatusView />);

      expect(screen.getByText("It's your turn!")).toBeInTheDocument();
    });

    it('displays turn message with indigo color styling', () => {
      render(<HumanPlayerStatusView />);

      const turnMessage = screen.getByText("It's your turn!");

      expect(turnMessage).toHaveClass('text-indigo-700');
    });

    it('displays message in large text size', () => {
      const { container } = render(<HumanPlayerStatusView />);

      const wrapper = container.firstChild;

      expect(wrapper).toHaveClass('text-4xl');
    });
  });

  describe('when action token is not present', () => {
    beforeEach(() => {
      vi.mocked(useGameState).mockReturnValue({
        ...baseGameState,
        gameState: {
          ...baseGameState.gameState,
          actionToken: undefined,
        },
      });
    });

    it('renders the component', () => {
      render(<HumanPlayerStatusView />);

      expect(screen.getByText('Other player is serving...')).toBeInTheDocument();
    });

    it('displays waiting message with gray color styling', () => {
      render(<HumanPlayerStatusView />);

      const waitingMessage = screen.getByText('Other player is serving...');

      expect(waitingMessage).toHaveClass('text-gray-700');
    });

    it('displays message in large text size', () => {
      const { container } = render(<HumanPlayerStatusView />);

      const wrapper = container.firstChild;

      expect(wrapper).toHaveClass('text-4xl');
    });
  });

  describe('when action token is null', () => {
    beforeEach(() => {
      vi.mocked(useGameState).mockReturnValue({
        ...baseGameState,
        gameState: {
          ...baseGameState.gameState,
          actionToken: null as never,
        },
      });
    });

    it('displays waiting message', () => {
      render(<HumanPlayerStatusView />);

      expect(screen.getByText('Other player is serving...')).toBeInTheDocument();
    });
  });
});
