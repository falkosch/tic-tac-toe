import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';
import {
  PlayerTypeAzure,
  PlayerTypeDQN,
  PlayerTypeHuman,
  PlayerTypeMenace,
  PlayerTypeMock,
} from './game-configuration/PlayerType.ts';

describe('App', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<App />);
    });

    it('renders the game interface with player dropdowns', () => {
      render(<App />);

      expect(screen.getByText('Player X')).toBeInTheDocument();
      expect(screen.getByText('Player O')).toBeInTheDocument();
      expect(screen.getByText('New game')).toBeInTheDocument();
      expect(screen.getByText('Auto new game')).toBeInTheDocument();
    });
  });

  describe('Conditional Player Registration - Azure Function Player', () => {
    describe('when Azure Function environment variable is set', () => {
      beforeEach(() => {
        process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net/api';
      });

      it('includes Azure Function player in Player X dropdown', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerXDropdown = screen.getByText('Player X');
        await user.click(playerXDropdown);

        expect(screen.getByText(PlayerTypeAzure)).toBeInTheDocument();
      });

      it('includes Azure Function player in Player O dropdown', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerODropdown = screen.getByText('Player O');
        await user.click(playerODropdown);

        expect(screen.getByText(PlayerTypeAzure)).toBeInTheDocument();
      });

      it('allows selecting Azure Function player for Player X', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerXDropdown = screen.getByText('Player X');
        await user.click(playerXDropdown);

        const azureOption = screen.getByText(PlayerTypeAzure);
        await user.click(azureOption);

        // Verify Azure Function can be selected again (indicating it was successfully set)
        await user.click(playerXDropdown);
        const activeAzureOption = screen.getByText(PlayerTypeAzure);
        expect(activeAzureOption.closest('.dropdown-item')).toHaveClass('active');
      });

      it('allows selecting Azure Function player for Player O', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerODropdown = screen.getByText('Player O');
        await user.click(playerODropdown);

        const azureOption = screen.getByText(PlayerTypeAzure);
        await user.click(azureOption);

        // Verify Azure Function can be selected again (indicating it was successfully set)
        await user.click(playerODropdown);
        const activeAzureOption = screen.getByText(PlayerTypeAzure);
        expect(activeAzureOption.closest('.dropdown-item')).toHaveClass('active');
      });
    });

    describe('when Azure Function environment variable is missing', () => {
      beforeEach(() => {
        delete process.env.REACT_APP_AZURE_FUNCTION_BASE_URL;
      });

      it('does NOT include Azure Function player in Player X dropdown', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerXDropdown = screen.getByText('Player X');
        await user.click(playerXDropdown);

        expect(screen.queryByText(PlayerTypeAzure)).not.toBeInTheDocument();
      });

      it('does NOT include Azure Function player in Player O dropdown', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerODropdown = screen.getByText('Player O');
        await user.click(playerODropdown);

        expect(screen.queryByText(PlayerTypeAzure)).not.toBeInTheDocument();
      });
    });

    describe('when Azure Function environment variable is empty string', () => {
      beforeEach(() => {
        process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = '';
      });

      it('does NOT include Azure Function player in Player X dropdown', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerXDropdown = screen.getByText('Player X');
        await user.click(playerXDropdown);

        expect(screen.queryByText(PlayerTypeAzure)).not.toBeInTheDocument();
      });

      it('does NOT include Azure Function player in Player O dropdown', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerODropdown = screen.getByText('Player O');
        await user.click(playerODropdown);

        expect(screen.queryByText(PlayerTypeAzure)).not.toBeInTheDocument();
      });
    });

    describe('when Azure Function environment variable is whitespace only', () => {
      beforeEach(() => {
        process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = '   \t\n   ';
      });

      it('does NOT include Azure Function player in Player X dropdown', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerXDropdown = screen.getByText('Player X');
        await user.click(playerXDropdown);

        expect(screen.queryByText(PlayerTypeAzure)).not.toBeInTheDocument();
      });

      it('does NOT include Azure Function player in Player O dropdown', async () => {
        const user = userEvent.setup();
        render(<App />);

        const playerODropdown = screen.getByText('Player O');
        await user.click(playerODropdown);

        expect(screen.queryByText(PlayerTypeAzure)).not.toBeInTheDocument();
      });
    });
  });

  describe('Standard Players Always Available', () => {
    const testCases = [
      { name: 'with Azure Function configured', env: 'https://example.azurewebsites.net/api' },
      { name: 'without Azure Function configured', env: undefined },
      { name: 'with empty Azure Function env', env: '' },
      { name: 'with whitespace Azure Function env', env: '  \t  ' },
    ];

    testCases.forEach(({ name, env }) => {
      describe(name, () => {
        beforeEach(() => {
          if (env === undefined) {
            delete process.env.REACT_APP_AZURE_FUNCTION_BASE_URL;
          } else {
            process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = env;
          }
        });

        it('includes all standard players in Player X dropdown', async () => {
          const user = userEvent.setup();
          render(<App />);

          const playerXDropdown = screen.getByText('Player X');
          await user.click(playerXDropdown);

          expect(screen.getByText(PlayerTypeHuman)).toBeInTheDocument();
          expect(screen.getByText(PlayerTypeMenace)).toBeInTheDocument();
          expect(screen.getByText(PlayerTypeDQN)).toBeInTheDocument();
          expect(screen.getByText(PlayerTypeMock)).toBeInTheDocument();
        });

        it('includes all standard players in Player O dropdown', async () => {
          const user = userEvent.setup();
          render(<App />);

          const playerODropdown = screen.getByText('Player O');
          await user.click(playerODropdown);

          expect(screen.getByText(PlayerTypeHuman)).toBeInTheDocument();
          expect(screen.getByText(PlayerTypeMenace)).toBeInTheDocument();
          expect(screen.getByText(PlayerTypeDQN)).toBeInTheDocument();
          expect(screen.getByText(PlayerTypeMock)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Player Selection Functionality', () => {
    beforeEach(() => {
      process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net/api';
    });

    it('allows changing Player X from default Human to other players', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Default should be Human for Player X
      const playerXDropdown = screen.getByText('Player X');
      await user.click(playerXDropdown);

      // Human should be active by default
      const humanOption = screen.getByText(PlayerTypeHuman);
      expect(humanOption.closest('.dropdown-item')).toHaveClass('active');

      // Select Menace
      const menaceOption = screen.getByText(PlayerTypeMenace);
      await user.click(menaceOption);

      // Verify Menace is now active
      await user.click(playerXDropdown);
      const activeMenaceOption = screen.getByText(PlayerTypeMenace);
      expect(activeMenaceOption.closest('.dropdown-item')).toHaveClass('active');
    });

    it('allows changing Player O from default DQN to other players', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Default should be DQN for Player O
      const playerODropdown = screen.getByText('Player O');
      await user.click(playerODropdown);

      // DQN should be active by default
      const dqnOption = screen.getByText(PlayerTypeDQN);
      expect(dqnOption.closest('.dropdown-item')).toHaveClass('active');

      // Select Human
      const humanOption = screen.getByText(PlayerTypeHuman);
      await user.click(humanOption);

      // Verify Human is now active
      await user.click(playerODropdown);
      const activeHumanOption = screen.getByText(PlayerTypeHuman);
      expect(activeHumanOption.closest('.dropdown-item')).toHaveClass('active');
    });
  });

  describe('Dropdown Rendering in Different Configurations', () => {
    it('renders dropdowns correctly when Azure Function is available', async () => {
      process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net/api';
      const user = userEvent.setup();
      render(<App />);

      // Should have all 5 players available in Player X dropdown
      const playerXDropdown = screen.getByText('Player X');
      await user.click(playerXDropdown);

      expect(screen.getByText(PlayerTypeHuman)).toBeInTheDocument();
      expect(screen.getByText(PlayerTypeMock)).toBeInTheDocument();
      expect(screen.getByText(PlayerTypeDQN)).toBeInTheDocument();
      expect(screen.getByText(PlayerTypeMenace)).toBeInTheDocument();
      expect(screen.getByText(PlayerTypeAzure)).toBeInTheDocument();
    });

    it('renders dropdowns correctly when Azure Function is not available', async () => {
      delete process.env.REACT_APP_AZURE_FUNCTION_BASE_URL;
      const user = userEvent.setup();
      render(<App />);

      // Should have 4 players available in Player X dropdown (no Azure)
      const playerXDropdown = screen.getByText('Player X');
      await user.click(playerXDropdown);

      expect(screen.getByText(PlayerTypeHuman)).toBeInTheDocument();
      expect(screen.getByText(PlayerTypeMock)).toBeInTheDocument();
      expect(screen.getByText(PlayerTypeDQN)).toBeInTheDocument();
      expect(screen.getByText(PlayerTypeMenace)).toBeInTheDocument();
      expect(screen.queryByText(PlayerTypeAzure)).not.toBeInTheDocument();
    });
  });

  describe('Game Configuration and Start', () => {
    it('can start a game when Azure Function player is not available', async () => {
      delete process.env.REACT_APP_AZURE_FUNCTION_BASE_URL;
      const user = userEvent.setup();
      render(<App />);

      // Start game should be available with the default configuration (Human vs. DQN)
      const newGameButton = screen.getByText('New game');
      expect(newGameButton).not.toBeDisabled();

      // Click to start the game - this should work without errors
      await user.click(newGameButton);

      // The game should have started successfully (we don't test the specific game state here)
      expect(newGameButton).toBeInTheDocument();
    });

    it('can start a game when Azure Function player is available and selected', async () => {
      process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net/api';
      const user = userEvent.setup();
      render(<App />);

      // Configure Player X as Azure Function
      const playerXDropdown = screen.getByText('Player X');
      await user.click(playerXDropdown);
      const azureOption = screen.getByText(PlayerTypeAzure);
      await user.click(azureOption);

      // Start game should be available
      const newGameButton = screen.getByText('New game');
      expect(newGameButton).not.toBeDisabled();
    });
  });

  describe('Auto New Game Toggle', () => {
    it('toggles auto new game setting', async () => {
      const user = userEvent.setup();
      render(<App />);

      const autoNewGameCheckbox = screen.getByLabelText('Auto new game');

      // Should be unchecked by default
      expect(autoNewGameCheckbox).not.toBeChecked();

      // Toggle on
      await user.click(autoNewGameCheckbox);
      expect(autoNewGameCheckbox).toBeChecked();

      // Toggle off
      await user.click(autoNewGameCheckbox);
      expect(autoNewGameCheckbox).not.toBeChecked();
    });
  });
});
