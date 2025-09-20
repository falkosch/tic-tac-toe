import React, { type FC, useContext } from 'react';

import { ActionTokenDispatch } from '../../game-state/ActionTokenDispatch';

import styles from './HumanPlayerStatusView.module.css';

export const HumanPlayerStatusView: FC = () => {
  const actionTokenDispatch = useContext(ActionTokenDispatch);

  return (
    <div className={styles.view}>
      {actionTokenDispatch ? <>It&apos;s your turn!</> : <>Other player is serving...</>}
    </div>
  );
};
