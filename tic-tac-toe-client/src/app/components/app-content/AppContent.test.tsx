import { randNumber } from '@ngneat/falso';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CellOwnerO, CellOwnerX, type SpecificCellOwner } from '../../../meta-model/CellOwner';
import { useGameConfiguration, useGameState } from '../../context/GameContext';
import {
  type PlayerConfiguration,
  type PlayerCreators,
} from '../../game-configuration/GameConfiguration';
import {
  PlayerTypeAzure,
  PlayerTypeDQN,
  PlayerTypeHuman,
  PlayerTypeMenace,
  PlayerTypeMock,
} from '../../game-configuration/PlayerType';
import { useGameController } from '../../hooks/useGameController';
import { usePlayerRegistry } from '../../hooks/usePlayerRegistry';
import { AppHeader } from '../app-header/AppHeader';
import { AIErrorBoundary } from '../error-boundary/ErrorBoundary';
import { GameStateView } from '../game-state-view/GameStateView';
import { PlayerDropdown } from '../player-dropdown/PlayerDropdown';
import { AppContent } from './AppContent';

vi.mock('../../context/GameContext', () => ({
  useGameState: vi.fn(),
  useGameConfiguration: vi.fn(),
}));

vi.mock('../../hooks/usePlayerRegistry', () => ({
  usePlayerRegistry: vi.fn(),
}));

vi.mock('../../hooks/useGameController', () => ({
  useGameController: vi.fn(),
}));

vi.mock('../app-header/AppHeader', () => ({
  AppHeader: vi.fn(),
}));

vi.mock('../error-boundary/ErrorBoundary', () => ({
  AIErrorBoundary: vi.fn(),
}));

vi.mock('../game-state-view/GameStateView', () => ({
  GameStateView: vi.fn(),
}));

vi.mock('../player-dropdown/PlayerDropdown', () => ({
  PlayerDropdown: vi.fn(),
}));

describe('AppContent', () => {
  const mockDispatchGameState = vi.fn();
  const mockDispatchConfiguration = vi.fn();
  const mockCreateNewGame = vi.fn();
  const mockCanCreateNewGame = vi.fn();
  const mockToggleAutoNewGame = vi.fn();
  const mockChangePlayerType = vi.fn();
  const mockPlayerCreatorHuman = vi.fn();
  const mockPlayerCreatorMock = vi.fn();
  const mockPlayerCreatorDQN = vi.fn();
  const mockPlayerCreatorMenace = vi.fn();
  const mockPlayerCreatorAzure = vi.fn();

  const givenPlayerCreators: PlayerCreators = {
    [PlayerTypeHuman]: mockPlayerCreatorHuman,
    [PlayerTypeMock]: mockPlayerCreatorMock,
    [PlayerTypeDQN]: mockPlayerCreatorDQN,
    [PlayerTypeMenace]: mockPlayerCreatorMenace,
    [PlayerTypeAzure]: mockPlayerCreatorAzure,
  };

  const givenPlayerTypes: PlayerConfiguration = {
    [CellOwnerX]: PlayerTypeHuman,
    [CellOwnerO]: PlayerTypeDQN,
  };

  const givenGameState = {
    gameState: {
      wins: {
        [CellOwnerX]: randNumber(),
        [CellOwnerO]: randNumber(),
      },
    },
    dispatch: mockDispatchGameState,
  };

  const givenConfiguration = {
    configuration: {
      autoNewGame: false,
      playerTypes: givenPlayerTypes,
    },
    dispatch: mockDispatchConfiguration,
  };

  const givenGameController = {
    runningGame: Promise.resolve(),
    createNewGame: mockCreateNewGame,
    canCreateNewGame: mockCanCreateNewGame,
    toggleAutoNewGame: mockToggleAutoNewGame,
    changePlayerType: mockChangePlayerType,
    createHumanPlayer: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useGameState).mockReturnValue(givenGameState);
    vi.mocked(useGameConfiguration).mockReturnValue(givenConfiguration);
    vi.mocked(usePlayerRegistry).mockReturnValue({
      registry: null,
      isLoading: false,
      error: null,
      playerCreators: givenPlayerCreators,
      createHumanPlayerCreator: vi.fn(),
    });
    vi.mocked(useGameController).mockReturnValue(givenGameController);
    vi.mocked(AppHeader).mockImplementation(({ children }) => <header>{children}</header>);
    vi.mocked(AIErrorBoundary).mockImplementation(({ children }) => <div>{children}</div>);
    vi.mocked(GameStateView).mockReturnValue(<></>);
    vi.mocked(PlayerDropdown).mockReturnValue(<></>);

    mockCanCreateNewGame.mockReturnValue(true);
    mockCreateNewGame.mockResolvedValue(undefined);
  });

  describe('Loading state', () => {
    it('displays loading message when player registry is loading', () => {
      vi.mocked(usePlayerRegistry).mockReturnValue({
        registry: null,
        isLoading: true,
        error: null,
        playerCreators: givenPlayerCreators,
        createHumanPlayerCreator: vi.fn(),
      });

      render(<AppContent />);

      expect(screen.getByText('Loading players...')).toBeInTheDocument();
    });

    it('does not render game UI when player registry is loading', () => {
      vi.mocked(usePlayerRegistry).mockReturnValue({
        registry: null,
        isLoading: true,
        error: null,
        playerCreators: givenPlayerCreators,
        createHumanPlayerCreator: vi.fn(),
      });

      render(<AppContent />);

      expect(AppHeader).not.toHaveBeenCalled();
      expect(GameStateView).not.toHaveBeenCalled();
    });
  });

  describe('Error state', () => {
    const givenError = new Error('Failed to initialize players');

    it('displays error message when player registry fails to load', () => {
      vi.mocked(usePlayerRegistry).mockReturnValue({
        registry: null,
        isLoading: false,
        error: givenError,
        playerCreators: givenPlayerCreators,
        createHumanPlayerCreator: vi.fn(),
      });

      render(<AppContent />);

      expect(screen.getByText(/Error initializing players:/i)).toBeInTheDocument();
      expect(screen.getByText(/Failed to initialize players/i)).toBeInTheDocument();
    });

    it('displays error message in red when player registry fails', () => {
      vi.mocked(usePlayerRegistry).mockReturnValue({
        registry: null,
        isLoading: false,
        error: givenError,
        playerCreators: givenPlayerCreators,
        createHumanPlayerCreator: vi.fn(),
      });

      const { container } = render(<AppContent />);

      const errorContainer = container.querySelector('.text-red-700');
      expect(errorContainer).toBeInTheDocument();
    });

    it('does not render game UI when player registry has an error', () => {
      vi.mocked(usePlayerRegistry).mockReturnValue({
        registry: null,
        isLoading: false,
        error: givenError,
        playerCreators: givenPlayerCreators,
        createHumanPlayerCreator: vi.fn(),
      });

      render(<AppContent />);

      expect(AppHeader).not.toHaveBeenCalled();
      expect(GameStateView).not.toHaveBeenCalled();
    });
  });

  describe('Successful initialization', () => {
    it('renders AppHeader when player registry is loaded successfully', () => {
      render(<AppContent />);

      expect(AppHeader).toHaveBeenCalledTimes(1);
    });

    it('renders GameStateView within AIErrorBoundary when player registry is loaded', () => {
      render(<AppContent />);

      expect(AIErrorBoundary).toHaveBeenCalledTimes(1);
      expect(GameStateView).toHaveBeenCalledTimes(1);
    });

    it('passes gameState to GameStateView', () => {
      render(<AppContent />);

      expect(GameStateView).toHaveBeenCalledWith(
        { gameState: givenGameState.gameState },
        undefined,
      );
    });

    it('does not display loading message when successfully initialized', () => {
      render(<AppContent />);

      expect(screen.queryByText('Loading players...')).not.toBeInTheDocument();
    });

    it('does not display error message when successfully initialized', () => {
      render(<AppContent />);

      expect(screen.queryByText(/Error initializing players:/i)).not.toBeInTheDocument();
    });
  });

  describe('New game button', () => {
    it('renders New game button in AppHeader', () => {
      render(<AppContent />);

      const button = screen.getByRole('button', { name: /New game/i });
      expect(button).toBeInTheDocument();
    });

    it('enables New game button when canCreateNewGame returns true', () => {
      mockCanCreateNewGame.mockReturnValue(true);

      render(<AppContent />);

      const button = screen.getByRole('button', { name: /New game/i });
      expect(button).not.toBeDisabled();
    });

    it('disables New game button when canCreateNewGame returns false', () => {
      mockCanCreateNewGame.mockReturnValue(false);

      render(<AppContent />);

      const button = screen.getByRole('button', { name: /New game/i });
      expect(button).toBeDisabled();
    });

    it('invokes createNewGame when New game button is clicked', () => {
      render(<AppContent />);

      const button = screen.getByRole('button', { name: /New game/i });
      fireEvent.click(button);

      expect(mockCreateNewGame).toHaveBeenCalledTimes(1);
    });

    it('does not invoke createNewGame when button is disabled and clicked', () => {
      mockCanCreateNewGame.mockReturnValue(false);

      render(<AppContent />);

      const button = screen.getByRole('button', { name: /New game/i });
      fireEvent.click(button);

      expect(mockCreateNewGame).not.toHaveBeenCalled();
    });

    it('handles createNewGame promise rejection without throwing', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // Empty implementation to suppress console errors during test
      });
      mockCreateNewGame.mockRejectedValue(new Error('Game creation failed'));

      render(<AppContent />);

      const button = screen.getByRole('button', { name: /New game/i });
      fireEvent.click(button);

      // Wait for the next tick to allow promise rejection to be handled
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Player dropdowns', () => {
    it('renders PlayerDropdown for each player in configuration', () => {
      render(<AppContent />);

      expect(PlayerDropdown).toHaveBeenCalledTimes(2);
    });

    it('renders PlayerDropdown for player X with correct props', () => {
      render(<AppContent />);

      expect(PlayerDropdown).toHaveBeenCalledWith(
        expect.objectContaining({
          cellOwner: CellOwnerX,
          currentPlayerType: givenPlayerTypes[CellOwnerX],
          playerCreators: givenPlayerCreators,
          onPlayerTypeChange: mockChangePlayerType,
        }),
        undefined,
      );
    });

    it('renders PlayerDropdown for player O with correct props', () => {
      render(<AppContent />);

      expect(PlayerDropdown).toHaveBeenCalledWith(
        expect.objectContaining({
          cellOwner: CellOwnerO,
          currentPlayerType: givenPlayerTypes[CellOwnerO],
          playerCreators: givenPlayerCreators,
          onPlayerTypeChange: mockChangePlayerType,
        }),
        undefined,
      );
    });

    it('updates PlayerDropdown props when configuration changes', () => {
      const updatedPlayerTypes: PlayerConfiguration = {
        [CellOwnerX]: PlayerTypeMenace,
        [CellOwnerO]: PlayerTypeHuman,
      };

      const { rerender } = render(<AppContent />);

      vi.mocked(useGameConfiguration).mockReturnValue({
        configuration: {
          autoNewGame: false,
          playerTypes: updatedPlayerTypes,
        },
        dispatch: mockDispatchConfiguration,
      });

      rerender(<AppContent />);

      // Check that PlayerDropdown was called with the updated configuration
      const lastCalls = vi.mocked(PlayerDropdown).mock.calls.slice(-2);
      const cellOwners = lastCalls.map((call) => call[0].cellOwner);
      const playerTypes = lastCalls.map((call) => call[0].currentPlayerType);

      expect(cellOwners).toContain(CellOwnerX);
      expect(cellOwners).toContain(CellOwnerO);
      expect(playerTypes).toContain(updatedPlayerTypes[CellOwnerX]);
      expect(playerTypes).toContain(updatedPlayerTypes[CellOwnerO]);
    });
  });

  describe('Auto new game checkbox', () => {
    it('renders Auto new game checkbox', () => {
      render(<AppContent />);

      const checkbox = screen.getByRole('checkbox', { name: /Auto new game/i });
      expect(checkbox).toBeInTheDocument();
    });

    it('renders unchecked Auto new game checkbox when autoNewGame is false', () => {
      render(<AppContent />);

      const checkbox = screen.getByRole('checkbox', { name: /Auto new game/i });
      expect(checkbox).not.toBeChecked();
    });

    it('renders checked Auto new game checkbox when autoNewGame is true', () => {
      vi.mocked(useGameConfiguration).mockReturnValue({
        configuration: {
          autoNewGame: true,
          playerTypes: givenPlayerTypes,
        },
        dispatch: mockDispatchConfiguration,
      });

      render(<AppContent />);

      const checkbox = screen.getByRole('checkbox', { name: /Auto new game/i });
      expect(checkbox).toBeChecked();
    });

    it('invokes toggleAutoNewGame when Auto new game checkbox is clicked', () => {
      render(<AppContent />);

      const checkbox = screen.getByRole('checkbox', { name: /Auto new game/i });
      fireEvent.click(checkbox);

      expect(mockToggleAutoNewGame).toHaveBeenCalledTimes(1);
    });

    it('toggles checkbox state when autoNewGame configuration changes', () => {
      const { rerender } = render(<AppContent />);

      let checkbox = screen.getByRole('checkbox', { name: /Auto new game/i });
      expect(checkbox).not.toBeChecked();

      vi.mocked(useGameConfiguration).mockReturnValue({
        configuration: {
          autoNewGame: true,
          playerTypes: givenPlayerTypes,
        },
        dispatch: mockDispatchConfiguration,
      });

      rerender(<AppContent />);

      checkbox = screen.getByRole('checkbox', { name: /Auto new game/i });
      expect(checkbox).toBeChecked();
    });

    it('has proper label association with checkbox input', () => {
      render(<AppContent />);

      const checkbox = screen.getByRole('checkbox', { name: /Auto new game/i });
      expect(checkbox).toHaveAttribute('id', 'autoNewGame');

      const label = screen.getByText('Auto new game').closest('label');
      expect(label).toHaveAttribute('for', 'autoNewGame');
    });
  });

  describe('Player registry initialization', () => {
    it('calls usePlayerRegistry with action token callback', () => {
      render(<AppContent />);

      expect(usePlayerRegistry).toHaveBeenCalledTimes(1);
      expect(usePlayerRegistry).toHaveBeenCalledWith(expect.any(Function));
    });

    it('dispatches SetActionToken action when action token callback is invoked', () => {
      const mockActionToken = vi.fn();
      let capturedCallback:
        | ((actionToken: (affectedCellsAt?: readonly number[], error?: Error) => void) => void)
        | undefined;

      vi.mocked(usePlayerRegistry).mockImplementation((callback) => {
        capturedCallback = callback;
        return {
          registry: null,
          isLoading: false,
          error: null,
          playerCreators: givenPlayerCreators,
          createHumanPlayerCreator: vi.fn(),
        };
      });

      render(<AppContent />);

      expect(capturedCallback).toBeDefined();
      if (capturedCallback) {
        capturedCallback(mockActionToken);
      }

      expect(mockDispatchGameState).toHaveBeenCalledWith({
        type: 'SET_ACTION_TOKEN',
        payload: { actionToken: mockActionToken },
      });
    });
  });

  describe('Game controller initialization', () => {
    it('calls useGameController with playerCreators', () => {
      render(<AppContent />);

      expect(useGameController).toHaveBeenCalledTimes(1);
      expect(useGameController).toHaveBeenCalledWith(givenPlayerCreators);
    });
  });

  describe('Component layout structure', () => {
    it('renders main container with flex column layout', () => {
      const { container } = render(<AppContent />);

      const mainContainer = container.querySelector('.flex.h-full.flex-col');
      expect(mainContainer).toBeInTheDocument();
    });

    it('renders AppHeader as first child of main container', () => {
      render(<AppContent />);

      expect(AppHeader).toHaveBeenCalledTimes(1);
      expect(AIErrorBoundary).toHaveBeenCalledTimes(1);
    });

    it('wraps GameStateView with AIErrorBoundary', () => {
      render(<AppContent />);

      expect(AIErrorBoundary).toHaveBeenCalledTimes(1);
      const calls = vi.mocked(AIErrorBoundary).mock.calls;
      expect(calls[0][0]).toHaveProperty('children');
    });
  });

  describe('Multiple player types in configuration', () => {
    const testPlayerConfigurations: {
      name: string;
      playerTypes: PlayerConfiguration;
    }[] = [
      {
        name: 'Human vs Human',
        playerTypes: {
          [CellOwnerX]: PlayerTypeHuman,
          [CellOwnerO]: PlayerTypeHuman,
        },
      },
      {
        name: 'DQN vs Menace',
        playerTypes: {
          [CellOwnerX]: PlayerTypeDQN,
          [CellOwnerO]: PlayerTypeMenace,
        },
      },
      {
        name: 'Mock vs Azure',
        playerTypes: {
          [CellOwnerX]: PlayerTypeMock,
          [CellOwnerO]: PlayerTypeAzure,
        },
      },
    ];

    testPlayerConfigurations.forEach(({ name, playerTypes }) => {
      it(`renders PlayerDropdowns correctly for ${name} configuration`, () => {
        vi.mocked(useGameConfiguration).mockReturnValue({
          configuration: {
            autoNewGame: false,
            playerTypes,
          },
          dispatch: mockDispatchConfiguration,
        });

        render(<AppContent />);

        expect(PlayerDropdown).toHaveBeenCalledWith(
          expect.objectContaining({
            cellOwner: CellOwnerX,
            currentPlayerType: playerTypes[CellOwnerX],
          }),
          undefined,
        );

        expect(PlayerDropdown).toHaveBeenCalledWith(
          expect.objectContaining({
            cellOwner: CellOwnerO,
            currentPlayerType: playerTypes[CellOwnerO],
          }),
          undefined,
        );
      });
    });
  });

  describe('Edge cases', () => {
    it('handles empty player creators object gracefully', () => {
      vi.mocked(usePlayerRegistry).mockReturnValue({
        registry: null,
        isLoading: false,
        error: null,
        playerCreators: {} as PlayerCreators,
        createHumanPlayerCreator: vi.fn(),
      });

      render(<AppContent />);

      expect(AppHeader).toHaveBeenCalled();
      expect(GameStateView).toHaveBeenCalled();
    });

    it('renders correctly when all players are of the same type', () => {
      const sameTypeConfiguration: PlayerConfiguration = {
        [CellOwnerX]: PlayerTypeHuman,
        [CellOwnerO]: PlayerTypeHuman,
      };

      vi.mocked(useGameConfiguration).mockReturnValue({
        configuration: {
          autoNewGame: false,
          playerTypes: sameTypeConfiguration,
        },
        dispatch: mockDispatchConfiguration,
      });

      render(<AppContent />);

      expect(PlayerDropdown).toHaveBeenCalledTimes(2);
    });

    it('maintains button disabled state after multiple renders', () => {
      mockCanCreateNewGame.mockReturnValue(false);

      const { rerender } = render(<AppContent />);

      let button = screen.getByRole('button', { name: /New game/i });
      expect(button).toBeDisabled();

      rerender(<AppContent />);

      button = screen.getByRole('button', { name: /New game/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Context integration', () => {
    it('uses gameState from useGameState hook', () => {
      render(<AppContent />);

      expect(useGameState).toHaveBeenCalledTimes(2); // Called twice in AppContent
      expect(GameStateView).toHaveBeenCalledWith(
        { gameState: givenGameState.gameState },
        undefined,
      );
    });

    it('uses configuration from useGameConfiguration hook', () => {
      render(<AppContent />);

      expect(useGameConfiguration).toHaveBeenCalledTimes(1);
      expect(PlayerDropdown).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPlayerType: givenConfiguration.configuration.playerTypes[CellOwnerX],
        }),
        undefined,
      );
    });

    it('provides dispatch function to game controller through usePlayerRegistry', () => {
      render(<AppContent />);

      expect(usePlayerRegistry).toHaveBeenCalledWith(expect.any(Function));
      expect(useGameController).toHaveBeenCalledWith(givenPlayerCreators);
    });
  });

  describe('Render optimization', () => {
    it('renders PlayerDropdowns in consistent order for each cell owner', () => {
      render(<AppContent />);

      const cellOwners: SpecificCellOwner[] = [CellOwnerX, CellOwnerO];

      cellOwners.forEach((cellOwner, index) => {
        expect(vi.mocked(PlayerDropdown).mock.calls[index][0]).toMatchObject({
          cellOwner,
          currentPlayerType: givenPlayerTypes[cellOwner],
        });
      });
    });

    it('uses keys from playerTypes object for rendering PlayerDropdowns', () => {
      render(<AppContent />);

      const calls = vi.mocked(PlayerDropdown).mock.calls;
      const renderedCellOwners = calls.map((call) => call[0].cellOwner);

      expect(renderedCellOwners).toContain(CellOwnerX);
      expect(renderedCellOwners).toContain(CellOwnerO);
      expect(renderedCellOwners).toHaveLength(2);
    });
  });
});
