import { randNumber } from '@ngneat/falso';
import { render, screen } from '@testing-library/react';
import { type AxiosError } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';

import { CellOwnerNone, CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import { type Points } from '../../../meta-model/GameView';
import { WinnerView } from './WinnerView';

describe('WinnerView', () => {
  let givenWins: Points;

  beforeEach(() => {
    givenWins = {
      X: randNumber(),
      O: randNumber(),
    };
  });

  describe('When no winner is provided', () => {
    it('renders an empty container without any messages', () => {
      const { container } = render(<WinnerView wins={givenWins} />);

      expect(container.querySelector('.text-4xl')).toBeInTheDocument();
      expect(screen.queryByText(/Winner/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/draw/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('When the game ends in a draw', () => {
    it('displays draw message', () => {
      render(<WinnerView winner={CellOwnerNone} wins={givenWins} />);

      expect(screen.getByText("It's a draw!")).toBeInTheDocument();
    });

    it('applies yellow text styling to draw message', () => {
      render(<WinnerView winner={CellOwnerNone} wins={givenWins} />);

      const drawMessage = screen.getByText("It's a draw!");
      expect(drawMessage).toHaveClass('text-yellow-700');
    });

    it('does not display winner or error messages', () => {
      render(<WinnerView winner={CellOwnerNone} wins={givenWins} />);

      expect(screen.queryByText(/Winner is/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Azure player/i)).not.toBeInTheDocument();
    });
  });

  describe('When player X wins the game', () => {
    it('displays winner message with player X', () => {
      render(<WinnerView winner={CellOwnerX} wins={givenWins} />);

      expect(screen.getByText(/Winner is X/i)).toBeInTheDocument();
    });

    it('displays the number of wins for player X', () => {
      render(<WinnerView winner={CellOwnerX} wins={givenWins} />);

      expect(
        screen.getByText(`Winner is X and has ${givenWins.X.toFixed()} wins so far.`),
      ).toBeInTheDocument();
    });

    it('applies yellow text styling to winner message', () => {
      render(<WinnerView winner={CellOwnerX} wins={givenWins} />);

      const winnerMessage = screen.getByText(/Winner is X/i);
      expect(winnerMessage).toHaveClass('text-yellow-700');
    });

    it('does not display draw or error messages', () => {
      render(<WinnerView winner={CellOwnerX} wins={givenWins} />);

      expect(screen.queryByText(/draw/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Azure player/i)).not.toBeInTheDocument();
    });
  });

  describe('When player O wins the game', () => {
    it('displays winner message with player O', () => {
      render(<WinnerView winner={CellOwnerO} wins={givenWins} />);

      expect(screen.getByText(/Winner is O/i)).toBeInTheDocument();
    });

    it('displays the number of wins for player O', () => {
      render(<WinnerView winner={CellOwnerO} wins={givenWins} />);

      expect(
        screen.getByText(`Winner is O and has ${givenWins.O.toFixed()} wins so far.`),
      ).toBeInTheDocument();
    });

    it('applies yellow text styling to winner message', () => {
      render(<WinnerView winner={CellOwnerO} wins={givenWins} />);

      const winnerMessage = screen.getByText(/Winner is O/i);
      expect(winnerMessage).toHaveClass('text-yellow-700');
    });

    it('does not display draw or error messages', () => {
      render(<WinnerView winner={CellOwnerO} wins={givenWins} />);

      expect(screen.queryByText(/draw/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Azure player/i)).not.toBeInTheDocument();
    });
  });

  describe('When an Axios error occurs', () => {
    let givenAxiosError: AxiosError;

    beforeEach(() => {
      givenAxiosError = {
        isAxiosError: true,
        message: 'Network Error',
        name: 'AxiosError',
        toJSON: () => ({}),
      } as AxiosError;
    });

    it('displays Azure player unavailable error message', () => {
      render(<WinnerView winner={givenAxiosError} wins={givenWins} />);

      expect(
        screen.getByText(
          'Azure player is not available, because the backend is not reachable. Please try another player type.',
        ),
      ).toBeInTheDocument();
    });

    it('applies red text styling to error message', () => {
      render(<WinnerView winner={givenAxiosError} wins={givenWins} />);

      const errorMessage = screen.getByText(/Azure player is not available/i);
      expect(errorMessage).toHaveClass('text-red-700');
    });

    it('does not display winner or draw messages', () => {
      render(<WinnerView winner={givenAxiosError} wins={givenWins} />);

      expect(screen.queryByText(/Winner is/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/draw/i)).not.toBeInTheDocument();
    });
  });

  describe('When a generic error occurs', () => {
    let givenError: Error;

    beforeEach(() => {
      givenError = new Error('Something went wrong');
    });

    it('displays generic error message with error details', () => {
      render(<WinnerView winner={givenError} wins={givenWins} />);

      expect(
        screen.getByText('Something unexpected happened: Something went wrong'),
      ).toBeInTheDocument();
    });

    it('applies red text styling to error message', () => {
      render(<WinnerView winner={givenError} wins={givenWins} />);

      const errorMessage = screen.getByText(/Something unexpected happened/i);
      expect(errorMessage).toHaveClass('text-red-700');
    });

    it('does not display winner or draw messages', () => {
      render(<WinnerView winner={givenError} wins={givenWins} />);

      expect(screen.queryByText(/Winner is/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/draw/i)).not.toBeInTheDocument();
    });

    it('does not display Azure-specific error message', () => {
      render(<WinnerView winner={givenError} wins={givenWins} />);

      expect(screen.queryByText(/Azure player is not available/i)).not.toBeInTheDocument();
    });
  });

  describe('When error has isAxiosError property set to false', () => {
    let givenNonAxiosError: Error & { isAxiosError: boolean };

    beforeEach(() => {
      givenNonAxiosError = Object.assign(new Error('Not an Axios error'), {
        isAxiosError: false,
      });
    });

    it('displays generic error message instead of Azure-specific message', () => {
      render(<WinnerView winner={givenNonAxiosError} wins={givenWins} />);

      expect(
        screen.getByText('Something unexpected happened: Not an Axios error'),
      ).toBeInTheDocument();
      expect(screen.queryByText(/Azure player is not available/i)).not.toBeInTheDocument();
    });
  });

  describe('Win count formatting', () => {
    it('formats X win count as integer without decimal places', () => {
      const winsWithDecimals: Points = { X: 5.7, O: 3.2 };

      render(<WinnerView winner={CellOwnerX} wins={winsWithDecimals} />);

      expect(screen.getByText('Winner is X and has 6 wins so far.')).toBeInTheDocument();
    });

    it('formats O win count as integer without decimal places', () => {
      const winsWithDecimals: Points = { X: 5.7, O: 3.2 };

      render(<WinnerView winner={CellOwnerO} wins={winsWithDecimals} />);

      expect(screen.getByText('Winner is O and has 3 wins so far.')).toBeInTheDocument();
    });

    it('handles zero wins correctly', () => {
      const zeroWins: Points = { X: 0, O: 0 };

      render(<WinnerView winner={CellOwnerX} wins={zeroWins} />);

      expect(screen.getByText('Winner is X and has 0 wins so far.')).toBeInTheDocument();
    });
  });

  describe('Container styling', () => {
    it('applies large text size to container', () => {
      const { container } = render(<WinnerView winner={CellOwnerX} wins={givenWins} />);

      expect(container.firstChild).toHaveClass('text-4xl');
    });

    it('maintains consistent container styling across all winner states', () => {
      const { container: drawContainer } = render(
        <WinnerView winner={CellOwnerNone} wins={givenWins} />,
      );
      const { container: winnerContainer } = render(
        <WinnerView winner={CellOwnerX} wins={givenWins} />,
      );
      const { container: errorContainer } = render(
        <WinnerView winner={new Error('Test')} wins={givenWins} />,
      );

      expect(drawContainer.firstChild).toHaveClass('text-4xl');
      expect(winnerContainer.firstChild).toHaveClass('text-4xl');
      expect(errorContainer.firstChild).toHaveClass('text-4xl');
    });
  });
});
