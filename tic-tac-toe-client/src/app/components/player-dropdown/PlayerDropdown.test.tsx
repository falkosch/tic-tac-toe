import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CellOwnerO, CellOwnerX, type SpecificCellOwner } from '../../../meta-model/CellOwner';
import { type PlayerCreator } from '../../../meta-model/Player';
import {
  type PlayerType,
  PlayerTypeDQN,
  PlayerTypeHuman,
  PlayerTypeMenace,
  PlayerTypeMock,
} from '../../game-configuration/PlayerType';
import { PlayerDropdown } from './PlayerDropdown';

describe('PlayerDropdown', () => {
  const mockPlayerCreatorHuman = vi.fn<[], Promise<any>>();
  const mockPlayerCreatorMock = vi.fn<[], Promise<any>>();
  const mockPlayerCreatorDQN = vi.fn<[], Promise<any>>();
  const mockPlayerCreatorMenace = vi.fn<[], Promise<any>>();
  const mockOnPlayerTypeChange = vi.fn();

  const givenPlayerCreators: Record<PlayerType, PlayerCreator> = {
    [PlayerTypeHuman]: mockPlayerCreatorHuman,
    [PlayerTypeMock]: mockPlayerCreatorMock,
    [PlayerTypeDQN]: mockPlayerCreatorDQN,
    [PlayerTypeMenace]: mockPlayerCreatorMenace,
  };

  beforeEach(() => {
    mockOnPlayerTypeChange.mockClear();
  });

  describe('Dropdown button rendering', () => {
    it('renders dropdown button with player X label when cellOwner is X', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const button = screen.getByRole('button', { name: /Player X/i });
      expect(button).toBeInTheDocument();
    });

    it('renders dropdown button with player O label when cellOwner is O', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerO}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const button = screen.getByRole('button', { name: /Player O/i });
      expect(button).toBeInTheDocument();
    });

    it('renders dropdown button with correct id based on cellOwner', () => {
      const { container } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const button = container.querySelector('#dX');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Dropdown menu initial state', () => {
    it('does not display player options when dropdown is initially closed', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const options = screen.queryAllByRole('button', { name: PlayerTypeHuman });
      expect(options).toHaveLength(0);
    });

    it('does not display backdrop overlay when dropdown is initially closed', () => {
      const { container } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const backdrop = container.querySelector('.fixed.inset-0');
      expect(backdrop).not.toBeInTheDocument();
    });
  });

  describe('Opening dropdown menu', () => {
    it('displays player options when dropdown button is clicked', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const humanOption = screen.getByRole('button', { name: PlayerTypeHuman });
      expect(humanOption).toBeInTheDocument();
    });

    it('displays all available player types from playerCreators', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      expect(screen.getByRole('button', { name: PlayerTypeHuman })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: PlayerTypeMock })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: PlayerTypeDQN })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: PlayerTypeMenace })).toBeInTheDocument();
    });

    it('displays backdrop overlay when dropdown is opened', () => {
      const { container } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const backdrop = container.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
    });
  });

  describe('Closing dropdown menu', () => {
    it('closes dropdown when dropdown button is clicked while open', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });

      // Open dropdown
      fireEvent.click(dropdownButton);
      expect(screen.getByRole('button', { name: PlayerTypeHuman })).toBeInTheDocument();

      // Close dropdown
      fireEvent.click(dropdownButton);
      expect(screen.queryByRole('button', { name: PlayerTypeHuman })).not.toBeInTheDocument();
    });

    it('closes dropdown when backdrop overlay is clicked', () => {
      const { container } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const backdrop = container.querySelector('.fixed.inset-0');
      fireEvent.click(backdrop!);

      expect(screen.queryByRole('button', { name: PlayerTypeHuman })).not.toBeInTheDocument();
    });

    it('closes dropdown when a player option is selected', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const mockOption = screen.getByRole('button', { name: PlayerTypeMock });
      fireEvent.click(mockOption);

      expect(screen.queryByRole('button', { name: PlayerTypeMock })).not.toBeInTheDocument();
    });
  });

  describe('Player type selection', () => {
    it('invokes onPlayerTypeChange with cellOwner and selected player type', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const dqnOption = screen.getByRole('button', { name: PlayerTypeDQN });
      fireEvent.click(dqnOption);

      expect(mockOnPlayerTypeChange).toHaveBeenCalledWith(CellOwnerX, PlayerTypeDQN);
      expect(mockOnPlayerTypeChange).toHaveBeenCalledTimes(1);
    });

    it('invokes onPlayerTypeChange with correct cellOwner when player O dropdown is used', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerO}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player O/i });
      fireEvent.click(dropdownButton);

      const menaceOption = screen.getByRole('button', { name: PlayerTypeMenace });
      fireEvent.click(menaceOption);

      expect(mockOnPlayerTypeChange).toHaveBeenCalledWith(CellOwnerO, PlayerTypeMenace);
      expect(mockOnPlayerTypeChange).toHaveBeenCalledTimes(1);
    });

    it('does not invoke onPlayerTypeChange when dropdown button is clicked', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      expect(mockOnPlayerTypeChange).not.toHaveBeenCalled();
    });

    it('does not invoke onPlayerTypeChange when backdrop is clicked', () => {
      const { container } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const backdrop = container.querySelector('.fixed.inset-0');
      fireEvent.click(backdrop!);

      expect(mockOnPlayerTypeChange).not.toHaveBeenCalled();
    });
  });

  describe('Current player type highlighting', () => {
    it('applies active styling to currently selected player type', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const humanOption = screen.getByRole('button', { name: PlayerTypeHuman });
      expect(humanOption).toHaveClass('bg-indigo-50', 'font-medium', 'text-indigo-700');
    });

    it('does not apply active styling to non-selected player types', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const mockOption = screen.getByRole('button', { name: PlayerTypeMock });
      expect(mockOption).toHaveClass('text-gray-700');
      expect(mockOption).not.toHaveClass('bg-indigo-50', 'font-medium', 'text-indigo-700');
    });

    it('updates active styling when currentPlayerType changes', () => {
      const { rerender } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      let dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      let humanOption = screen.getByRole('button', { name: PlayerTypeHuman });
      expect(humanOption).toHaveClass('bg-indigo-50', 'font-medium', 'text-indigo-700');

      // Close dropdown
      fireEvent.click(dropdownButton);

      // Rerender with different currentPlayerType
      rerender(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeDQN}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const dqnOption = screen.getByRole('button', { name: PlayerTypeDQN });
      expect(dqnOption).toHaveClass('bg-indigo-50', 'font-medium', 'text-indigo-700');

      humanOption = screen.getByRole('button', { name: PlayerTypeHuman });
      expect(humanOption).not.toHaveClass('bg-indigo-50', 'font-medium', 'text-indigo-700');
    });
  });

  describe('Multiple player options rendering', () => {
    it('renders dropdown with single player type option', () => {
      const singlePlayerCreators: Record<string, PlayerCreator> = {
        [PlayerTypeHuman]: mockPlayerCreatorHuman,
      };

      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={singlePlayerCreators as Record<PlayerType, PlayerCreator>}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const allOptions = screen.getAllByRole('button');
      // 1 dropdown button + 1 player option = 2 buttons
      expect(allOptions).toHaveLength(2);
    });

    it('renders dropdown with multiple player type options', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const allOptions = screen.getAllByRole('button');
      // 1 dropdown button + 4 player options = 5 buttons
      expect(allOptions).toHaveLength(5);
    });
  });

  describe('Dropdown toggle behavior', () => {
    it('toggles dropdown state when button is clicked multiple times', () => {
      render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });

      // Initially closed
      expect(screen.queryByRole('button', { name: PlayerTypeHuman })).not.toBeInTheDocument();

      // Click 1: Open
      fireEvent.click(dropdownButton);
      expect(screen.getByRole('button', { name: PlayerTypeHuman })).toBeInTheDocument();

      // Click 2: Close
      fireEvent.click(dropdownButton);
      expect(screen.queryByRole('button', { name: PlayerTypeHuman })).not.toBeInTheDocument();

      // Click 3: Open again
      fireEvent.click(dropdownButton);
      expect(screen.getByRole('button', { name: PlayerTypeHuman })).toBeInTheDocument();
    });
  });

  describe('Different cellOwner scenarios', () => {
    const testCellOwners: SpecificCellOwner[] = [CellOwnerX, CellOwnerO];

    testCellOwners.forEach((cellOwner) => {
      it(`renders correct label and invokes callback correctly for player ${cellOwner}`, () => {
        render(
          <PlayerDropdown
            cellOwner={cellOwner}
            currentPlayerType={PlayerTypeHuman}
            playerCreators={givenPlayerCreators}
            onPlayerTypeChange={mockOnPlayerTypeChange}
          />,
        );

        const dropdownButton = screen.getByRole('button', { name: new RegExp(`Player ${cellOwner}`, 'i') });
        fireEvent.click(dropdownButton);

        const mockOption = screen.getByRole('button', { name: PlayerTypeMock });
        fireEvent.click(mockOption);

        expect(mockOnPlayerTypeChange).toHaveBeenCalledWith(cellOwner, PlayerTypeMock);
      });
    });
  });

  describe('Chevron icon rotation', () => {
    it('applies rotation class to chevron when dropdown is open', () => {
      const { container } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      fireEvent.click(dropdownButton);

      const chevron = container.querySelector('svg');
      expect(chevron).toHaveClass('rotate-180');
    });

    it('does not apply rotation class to chevron when dropdown is closed', () => {
      const { container } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const chevron = container.querySelector('svg');
      expect(chevron).not.toHaveClass('rotate-180');
    });

    it('toggles chevron rotation when dropdown is opened and closed', () => {
      const { container } = render(
        <PlayerDropdown
          cellOwner={CellOwnerX}
          currentPlayerType={PlayerTypeHuman}
          playerCreators={givenPlayerCreators}
          onPlayerTypeChange={mockOnPlayerTypeChange}
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Player X/i });
      const chevron = container.querySelector('svg');

      // Initially closed - no rotation
      expect(chevron).not.toHaveClass('rotate-180');

      // Open dropdown - chevron rotates
      fireEvent.click(dropdownButton);
      expect(chevron).toHaveClass('rotate-180');

      // Close dropdown - chevron returns to original position
      fireEvent.click(dropdownButton);
      expect(chevron).not.toHaveClass('rotate-180');
    });
  });
});
