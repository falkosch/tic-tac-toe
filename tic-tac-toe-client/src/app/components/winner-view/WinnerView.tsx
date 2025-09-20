import { type FC } from 'react';

import {
  type CellOwner,
  CellOwnerNone,
  CellOwnerO,
  CellOwnerX,
  type SpecificCellOwner,
} from '../../../meta-model/CellOwner';
import { type Points } from '../../../meta-model/GameView';

import styles from './WinnerView.module.css';

const representsError = (value: unknown): boolean => {
  return value instanceof Error;
};

const representsAxiosError = (value: unknown): boolean => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return 'isAxiosError' in value && !!value.isAxiosError;
};

const representsDraw = (value: unknown): boolean => {
  return value === CellOwnerNone;
};

const representsSpecificWinner = (value: unknown): boolean => {
  return value === CellOwnerO || value === CellOwnerX;
};

export const WinnerView: FC<{
  winner?: Readonly<CellOwner> | Error;
  wins: Readonly<Points>;
}> = ({ winner = undefined, wins }) => (
  <div className={styles.view}>
    <div className={styles.error}>
      {representsError(winner) &&
        representsAxiosError(winner) &&
        'Azure player is not available, because the backend is not reachable. Please try another player type.'}
      {representsError(winner) &&
        !representsAxiosError(winner) &&
        `Something unexpected happened: ${winner}`}
    </div>
    <div className={styles.winner}>
      {representsDraw(winner) && <>It&apos;s a draw!</>}
      {representsSpecificWinner(winner) &&
        `Winner is ${winner} and has ${wins[winner as SpecificCellOwner]} wins so far.`}
    </div>
  </div>
);
