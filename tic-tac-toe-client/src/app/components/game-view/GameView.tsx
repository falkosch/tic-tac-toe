import React, { type FC, useMemo } from 'react';

import { type CellOwner } from '../../../meta-model/CellOwner';
import { type GameView as ModelGameView } from '../../../meta-model/GameView';
import { CellView } from '../cell-view/CellView';

interface Props {
  gameView: Readonly<ModelGameView>;
}

interface CellData {
  id: number;
  cellAt: number;
  cellOwner: CellOwner;
  isWinning: boolean;
}

export const GameView: FC<Props> = React.memo(({ gameView }) => {
  const memoizedCells = useMemo((): CellData[] => {
    return gameView.board.cells.map((cellOwner, cellAt) => ({
      id: cellAt,
      cellAt,
      cellOwner,
      isWinning: gameView.consecutive.some((consecutive) => consecutive.cellsAt.includes(cellAt)),
    }));
  }, [gameView.board.cells, gameView.consecutive]);
  const { width, height } = gameView.board.dimensions;

  return (
    <div
      className="grid aspect-square h-full gap-3"
      style={{
        gridTemplateColumns: `repeat(${width.toFixed()}, 1fr)`,
        gridTemplateRows: `repeat(${height.toFixed()}, 1fr)`,
      }}
    >
      {memoizedCells.map((cell) => (
        <CellView
          key={`c${cell.cellAt.toFixed()}-${cell.cellOwner}-${cell.isWinning ? 'w' : ''}`}
          boardDimensions={gameView.board.dimensions}
          cellAt={cell.cellAt}
          cellOwner={cell.cellOwner}
          consecutive={gameView.consecutive}
        />
      ))}
    </div>
  );
});
