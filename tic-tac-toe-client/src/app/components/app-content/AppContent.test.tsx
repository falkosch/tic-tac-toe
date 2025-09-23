import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { AppContent } from './AppContent';

vi.mock('../app-header/AppHeader', () => ({
  AppHeader: ({ children }) => <div data-testid="app-header">{children}</div>,
}));

vi.mock('../player-dropdown/PlayerDropdown.tsx', () => ({
  PlayerDropdown: ({ cellOwner, currentPlayerType }) => (
    <div data-testid="player-dropdown">
      {cellOwner}:{currentPlayerType}
    </div>
  ),
}));

vi.mock('../game-state-view/GameStateView', () => ({
  GameStateView: ({ gameState }) => (
    <div data-testid="game-state-view">{JSON.stringify(gameState)}</div>
  ),
}));

vi.mock('../error-boundary/ErrorBoundary', () => ({
  AIErrorBoundary: ({ children }: { children: ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

// --- Mock hooks ---
const mockUseGameState = vi.fn();
const mockUseGameConfiguration = vi.fn();
const mockUsePlayerRegistry = vi.fn();
const mockUseGameController = vi.fn();

vi.mock('../../context/GameContext', () => ({
  useGameState: () => mockUseGameState(),
  useGameConfiguration: () => mockUseGameConfiguration(),
}));

vi.mock('../../hooks/usePlayerRegistry', () => ({
  usePlayerRegistry: (cb: any) => mockUsePlayerRegistry(cb),
}));

vi.mock('../../hooks/useGameController', () => ({
  useGameController: (creators: any) => mockUseGameController(creators),
}));

function setupMocks({
  gameState = { foo: 'bar' },
  configuration = {
    playerTypes: { X: 'human', O: 'ai' },
    autoNewGame: false,
  },
  isLoading = false,
  error = null,
  playerCreators = ['human', 'ai'],
  canCreateNewGame = () => true,
  createNewGame = vi.fn().mockResolvedValue(undefined),
  toggleAutoNewGame = vi.fn(),
  changePlayerType = vi.fn(),
} = {}) {
  mockUseGameState.mockReturnValue({ gameState, dispatch: vi.fn() });
  mockUseGameConfiguration.mockReturnValue({ configuration });
  mockUsePlayerRegistry.mockReturnValue({ playerCreators, isLoading, error });
  mockUseGameController.mockReturnValue({
    createNewGame,
    canCreateNewGame,
    toggleAutoNewGame,
    changePlayerType,
  });

  return { createNewGame, toggleAutoNewGame, changePlayerType };
}

describe('AppContent', () => {
  it('renders loading state', () => {
    setupMocks({ isLoading: true });

    render(<AppContent />);

    expect(screen.getByText(/loading players/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    setupMocks({ error: new Error('Boom!') });

    render(<AppContent />);

    expect(screen.getByText(/error initializing players/i)).toBeInTheDocument();
    expect(screen.getByText(/boom/i)).toBeInTheDocument();
  });

  it('renders header, dropdowns, checkbox, and game view', () => {
    setupMocks();

    render(<AppContent />);

    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getAllByTestId('player-dropdown')).toHaveLength(2);
    expect(screen.getByLabelText(/auto new game/i)).toBeInTheDocument();
    expect(screen.getByTestId('game-state-view')).toHaveTextContent(/foo/);
  });

  it('disables new game button when canCreateNewGame returns false', () => {
    setupMocks({ canCreateNewGame: () => false });

    render(<AppContent />);

    expect(screen.getByRole('button', { name: /new game/i })).toBeDisabled();
  });

  it('calls createNewGame on button click', async () => {
    const { createNewGame } = setupMocks();
    render(<AppContent />);

    fireEvent.click(screen.getByRole('button', { name: /new game/i }));

    await waitFor(() => {
      expect(createNewGame).toHaveBeenCalled();
    });
  });

  it('calls toggleAutoNewGame when checkbox toggled', () => {
    const { toggleAutoNewGame } = setupMocks({
      configuration: { playerTypes: { X: 'human' }, autoNewGame: true },
    });
    render(<AppContent />);

    const checkbox = screen.getByLabelText(/auto new game/i);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(toggleAutoNewGame).toHaveBeenCalled();
  });

  it('renders dropdowns with correct props', () => {
    setupMocks({
      configuration: { playerTypes: { X: 'human', O: 'ai', Z: 'random' }, autoNewGame: false },
    });
    render(<AppContent />);

    const dropdowns = screen.getAllByTestId('player-dropdown');
    expect(dropdowns).toHaveLength(3);
    expect(dropdowns[0]).toHaveTextContent('X:human');
    expect(dropdowns[1]).toHaveTextContent('O:ai');
    expect(dropdowns[2]).toHaveTextContent('Z:random');
  });
});
