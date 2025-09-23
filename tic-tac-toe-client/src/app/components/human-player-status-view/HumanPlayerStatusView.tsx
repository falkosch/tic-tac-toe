import { type FC } from 'react';

import { useGameState } from '../../context/GameContext';

export const HumanPlayerStatusView: FC = () => {
  const { gameState } = useGameState();

  return (
    <div className="text-4xl">
      {gameState.actionToken ? (
        <span className="text-indigo-700">It&apos;s your turn!</span>
      ) : (
        <span className="text-gray-700">Other player is serving...</span>
      )}
    </div>
  );
};
