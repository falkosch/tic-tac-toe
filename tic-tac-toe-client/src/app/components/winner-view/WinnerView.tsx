import { type FC } from 'react';
import { type AxiosError } from 'axios';

import {
  type CellOwner,
  CellOwnerNone,
  CellOwnerO,
  CellOwnerX,
  type SpecificCellOwner,
} from '../../../meta-model/CellOwner';
import { type Points } from '../../../meta-model/GameView';

const representsError = (value: unknown): value is Error => {
  return value instanceof Error;
};

const representsAxiosError = (value: unknown): value is AxiosError => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return 'isAxiosError' in value && !!value.isAxiosError;
};

const representsDraw = (value: unknown): value is typeof CellOwnerNone => {
  return value === CellOwnerNone;
};

const representsSpecificWinner = (value: unknown): value is SpecificCellOwner => {
  return value === CellOwnerO || value === CellOwnerX;
};

export const WinnerView: FC<{
  winner?: Readonly<CellOwner> | Error;
  wins: Readonly<Points>;
}> = ({ winner = undefined, wins }) => {
  return (
    <div className="text-4xl">
      {representsAxiosError(winner) && (
        <span className="text-red-700">
          Azure player is not available, because the backend is not reachable. Please try another
          player type.
        </span>
      )}
      {representsError(winner) && (
        <span className="text-red-700">Something unexpected happened: {winner.message}</span>
      )}

      {representsDraw(winner) && <span className="text-yellow-700">It&apos;s a draw!</span>}
      {representsSpecificWinner(winner) && (
        <span className="text-yellow-700">
          Winner is {winner} and has {wins[winner].toFixed()} wins so far.
        </span>
      )}
    </div>
  );
};
