import { type FC, useState } from 'react';
import { type PlayerType } from '../../game-configuration/PlayerType.ts';
import { type SpecificCellOwner } from '../../../meta-model/CellOwner.ts';
import { type PlayerCreator } from '../../../meta-model/Player.ts';

interface PlayerDropdownProps {
  cellOwner: SpecificCellOwner;
  currentPlayerType: string;
  playerCreators: Record<PlayerType, PlayerCreator>;
  onPlayerTypeChange: (cellOwner: SpecificCellOwner, playerType: PlayerType) => void;
}

export const PlayerDropdown: FC<PlayerDropdownProps> = ({
  cellOwner,
  currentPlayerType,
  playerCreators,
  onPlayerTypeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownId = `d${cellOwner}`;

  return (
    <div key={dropdownId} className="relative mt-2 w-full sm:w-auto md:mt-0">
      <button
        id={dropdownId}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex w-full items-center justify-between rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
      >
        <span>{`Player ${cellOwner}`}</span>
        <svg
          className={`ml-2 h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <div className="absolute right-0 z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            {Object.keys(playerCreators).map((playerKey) => {
              const active = playerKey === currentPlayerType;
              const itemId = `d${cellOwner}${playerKey}`;
              return (
                <button
                  key={itemId}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    active ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    onPlayerTypeChange(cellOwner, playerKey as PlayerType);
                    setIsOpen(false);
                  }}
                >
                  {playerKey}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
