import { type FC } from 'react';

import { useGameState } from '../../context/GameContext';

import styles from './HumanPlayerStatusView.module.css';

export const HumanPlayerStatusView: FC = () => {
  const { gameState } = useGameState();

  return (
    <div className={styles.view}>
      {gameState.actionToken ? <>It&apos;s your turn!</> : <>Other player is serving...</>}
    </div>
  );
};
