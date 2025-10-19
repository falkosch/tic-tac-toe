import { randNumber } from '@ngneat/falso';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CellOwnerNone, CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import type { GameView } from '../../../meta-model/GameView';
import type { GameStateType } from '../../game-state/GameState';
import { GameView as GameViewComponent } from '../game-view/GameView';
import { HumanPlayerStatusView } from '../human-player-status-view/HumanPlayerStatusView';
import { WinnerView } from '../winner-view/WinnerView';
import { GameStateView } from './GameStateView';

vi.mock('../game-view/GameView', () => ({
  GameView: vi.fn(),
}));

vi.mock('../winner-view/WinnerView', () => ({
  WinnerView: vi.fn(),
}));

vi.mock('../human-player-status-view/HumanPlayerStatusView', () => ({
  HumanPlayerStatusView: vi.fn(),
}));

describe('GameStateView', () => {
  const givenWins = {
    [CellOwnerX]: randNumber(),
    [CellOwnerO]: randNumber(),
  };

  const givenGameView: GameView = {
    board: {
      cells: [
        CellOwnerX,
        CellOwnerO,
        CellOwnerNone,
        CellOwnerNone,
        CellOwnerX,
        CellOwnerNone,
        CellOwnerNone,
        CellOwnerO,
        CellOwnerNone,
      ],
      dimensions: { width: 3, height: 3 },
    },
    consecutive: [],
    points: givenWins,
  };

  beforeEach(() => {
    vi.mocked(GameViewComponent).mockReturnValue(<div data-testid="game-view-mock" />);
    vi.mocked(WinnerView).mockReturnValue(<div data-testid="winner-view-mock" />);
    vi.mocked(HumanPlayerStatusView).mockReturnValue(
      <div data-testid="human-player-status-view-mock" />,
    );
  });

  describe('When game has not been created', () => {
    it('renders create new game message when gameView is undefined', () => {
      const givenGameState: GameStateType = {
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(screen.getByText('Create a new game')).toBeInTheDocument();
    });

    it('does not render GameView component when gameView is undefined', () => {
      const givenGameState: GameStateType = {
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(GameViewComponent).not.toHaveBeenCalled();
    });

    it('does not render WinnerView component when gameView is undefined', () => {
      const givenGameState: GameStateType = {
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(WinnerView).not.toHaveBeenCalled();
    });

    it('does not render HumanPlayerStatusView component when gameView is undefined', () => {
      const givenGameState: GameStateType = {
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(HumanPlayerStatusView).not.toHaveBeenCalled();
    });
  });

  describe('When game is in progress', () => {
    it('does not render create new game message when gameView is defined', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(screen.queryByText('Create a new game')).not.toBeInTheDocument();
    });

    it('renders GameView component with gameView prop', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(GameViewComponent).toHaveBeenCalledWith({ gameView: givenGameView }, undefined);
      expect(GameViewComponent).toHaveBeenCalledTimes(1);
    });

    it('renders WinnerView component with winner and wins props', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(WinnerView).toHaveBeenCalledWith(
        {
          winner: undefined,
          wins: givenWins,
        },
        undefined,
      );
      expect(WinnerView).toHaveBeenCalledTimes(1);
    });

    it('renders HumanPlayerStatusView component when winner is undefined', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(HumanPlayerStatusView).toHaveBeenCalledWith({}, undefined);
      expect(HumanPlayerStatusView).toHaveBeenCalledTimes(1);
    });
  });

  describe('When game has ended with a winner', () => {
    it('renders GameView component when X wins', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerX,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(GameViewComponent).toHaveBeenCalledWith({ gameView: givenGameView }, undefined);
      expect(GameViewComponent).toHaveBeenCalledTimes(1);
    });

    it('renders WinnerView component with X winner and wins props', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerX,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(WinnerView).toHaveBeenCalledWith(
        {
          winner: CellOwnerX,
          wins: givenWins,
        },
        undefined,
      );
      expect(WinnerView).toHaveBeenCalledTimes(1);
    });

    it('does not render HumanPlayerStatusView component when X wins', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerX,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(HumanPlayerStatusView).not.toHaveBeenCalled();
    });

    it('renders GameView component when O wins', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerO,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(GameViewComponent).toHaveBeenCalledWith({ gameView: givenGameView }, undefined);
      expect(GameViewComponent).toHaveBeenCalledTimes(1);
    });

    it('renders WinnerView component with O winner and wins props', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerO,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(WinnerView).toHaveBeenCalledWith(
        {
          winner: CellOwnerO,
          wins: givenWins,
        },
        undefined,
      );
      expect(WinnerView).toHaveBeenCalledTimes(1);
    });

    it('does not render HumanPlayerStatusView component when O wins', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerO,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(HumanPlayerStatusView).not.toHaveBeenCalled();
    });
  });

  describe('When game has ended with a draw', () => {
    it('renders GameView component when game is a draw', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerNone,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(GameViewComponent).toHaveBeenCalledWith({ gameView: givenGameView }, undefined);
      expect(GameViewComponent).toHaveBeenCalledTimes(1);
    });

    it('renders WinnerView component with draw winner and wins props', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerNone,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(WinnerView).toHaveBeenCalledWith(
        {
          winner: CellOwnerNone,
          wins: givenWins,
        },
        undefined,
      );
      expect(WinnerView).toHaveBeenCalledTimes(1);
    });

    it('does not render HumanPlayerStatusView component when game is a draw', () => {
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: CellOwnerNone,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(HumanPlayerStatusView).not.toHaveBeenCalled();
    });
  });

  describe('When game has ended with an error', () => {
    it('renders GameView component when winner is an error', () => {
      const givenError = new Error('Test error');
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: givenError,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(GameViewComponent).toHaveBeenCalledWith({ gameView: givenGameView }, undefined);
      expect(GameViewComponent).toHaveBeenCalledTimes(1);
    });

    it('renders WinnerView component with error winner and wins props', () => {
      const givenError = new Error('Test error');
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: givenError,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(WinnerView).toHaveBeenCalledWith(
        {
          winner: givenError,
          wins: givenWins,
        },
        undefined,
      );
      expect(WinnerView).toHaveBeenCalledTimes(1);
    });

    it('does not render HumanPlayerStatusView component when winner is an error', () => {
      const givenError = new Error('Test error');
      const givenGameState: GameStateType = {
        gameView: givenGameView,
        winner: givenError,
        wins: givenWins,
      };

      render(<GameStateView gameState={givenGameState} />);

      expect(HumanPlayerStatusView).not.toHaveBeenCalled();
    });
  });
});
