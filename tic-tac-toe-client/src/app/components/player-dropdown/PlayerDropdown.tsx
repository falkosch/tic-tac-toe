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
    <div key={dropdownId} className="relative">
      <button
        className="flex w-full items-center justify-between gap-1 rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        id={dropdownId}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        Player {cellOwner}
        <svg
          className={`w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
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
          <div className="absolute right-0 z-20 mt-1 w-50 overflow-hidden rounded-md bg-white shadow shadow-indigo-300">
            {Object.keys(playerCreators).map((playerKey) => {
              const active = playerKey === currentPlayerType;
              const itemId = `d${cellOwner}${playerKey}`;
              return (
                <button
                  key={itemId}
                  className={`w-full px-3 py-2 text-start hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none ${
                    active ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setIsOpen(false);
                    onPlayerTypeChange(cellOwner, playerKey as PlayerType);
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
