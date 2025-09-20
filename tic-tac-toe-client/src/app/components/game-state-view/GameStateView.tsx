import React, { type FC } from 'react';

import { type GameStateType } from '../../game-state/GameState';
import { GameView } from '../game-view/GameView';
import { HumanPlayerStatusView } from '../human-player-status-view/HumanPlayerStatusView';
import { WinnerView } from '../winner-view/WinnerView';

import styles from './GameStateView.module.css';

export const GameStateView: FC<{
  gameState: GameStateType;
}> = ({ gameState }) => (
  <div className={`${styles.view} flex flex-col items-center justify-center`}>
    {!gameState.gameView && <div className={styles['new-game']}>Create a new game first.</div>}
    {gameState.gameView && (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center">
          <GameView gameView={gameState.gameView} />
        </div>
        <div className={`${styles.status} flex items-center justify-center`}>
          <WinnerView winner={gameState.winner} wins={gameState.wins} />
          {!gameState.winner && <HumanPlayerStatusView />}
        </div>
      </div>
    )}
  </div>
);
