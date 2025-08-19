import React, { FC, useMemo } from 'react';

import { CellView } from '../cell-view/CellView';
import { GameView as ModelGameView } from '../../meta-model/GameView';
import { CellOwner } from '../../meta-model/CellOwner';

import styles from './GameView.module.scss';

interface Props {
  gameView: Readonly<ModelGameView>;
}

interface CellData {
  id: number;
  cellAt: number;
  cellOwner: CellOwner;
  isWinning: boolean;
}

/* eslint-disable react/prop-types */
export const GameView: FC<Props> = React.memo(({ gameView }) => {
  const memoizedCells = useMemo((): CellData[] => {
    return gameView.board.cells.map((cellOwner, cellAt) => ({
      id: cellAt,
      cellAt,
      cellOwner,
      isWinning: gameView.consecutive.some((consecutive) => consecutive.cellsAt.includes(cellAt)),
    }));
  }, [gameView.board.cells, gameView.consecutive]);

  return (
    <div className={`${styles.view} d-flex flex-row flex-wrap border-secondary bg-light p-2`}>
      {memoizedCells.map((cell) => (
        <CellView
          key={`c${cell.cellAt}`}
          boardDimensions={gameView.board.dimensions}
          cellAt={cell.cellAt}
          cellOwner={cell.cellOwner}
          consecutive={gameView.consecutive}
        />
      ))}
    </div>
  );
});

GameView.displayName = 'GameView';
