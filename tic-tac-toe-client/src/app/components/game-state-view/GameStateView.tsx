import { type FC } from 'react';

import { type GameStateType } from '../../game-state/GameState';
import { GameView } from '../game-view/GameView';
import { HumanPlayerStatusView } from '../human-player-status-view/HumanPlayerStatusView';
import { WinnerView } from '../winner-view/WinnerView';

export const GameStateView: FC<{
  gameState: GameStateType;
}> = ({ gameState }) => (
  <div className="flex grow flex-col items-center justify-center gap-5 p-5">
    {!gameState.gameView && <span className="text-5xl text-gray-500">Create a new game</span>}
    {gameState.gameView && (
      <>
        <div className="grow rounded-xl bg-gray-100 p-3">
          <GameView gameView={gameState.gameView} />
        </div>
        <div className="">
          <WinnerView winner={gameState.winner} wins={gameState.wins} />
          {!gameState.winner && <HumanPlayerStatusView />}
        </div>
      </>
    )}
  </div>
);
