import React from 'react';

import { cellCoordinates } from '../../mechanics/CellCoordinates';
import { cellEdgeClassifiers, EdgeClassifier } from '../../mechanics/CellEdgeClassifiers';
import { mapCellOwnerToImage } from '../../mechanics/MapCellOwnerToImage';
import { BoardDimensions } from '../../meta-model/Board';
import { CellOwner } from '../../meta-model/CellOwner';

import './CellView.css';

const grid = {
  value: 0.25,
  unit: 'rem',
};

function tileSize(dimension: number): string {
  const innerGridSize = grid.value * (dimension - 1);
  return `calc((100% - ${innerGridSize}${grid.unit}) / ${dimension})`;
}

function selectBorderWidth(upperEdge): string {
  return upperEdge ? '0' : `${grid.value}${grid.unit}`;
}

export const CellView: React.FC<{
  cellOwner: CellOwner;
  cellAt: number;
  boardDimensions: BoardDimensions;
}> = ({ cellOwner, cellAt, boardDimensions }) => {
  const cellOwnerImage = mapCellOwnerToImage(cellOwner);

  const edgeClassifiers = cellEdgeClassifiers(
    cellCoordinates(cellAt, boardDimensions),
    boardDimensions,
  );
  const gridStyle = {
    borderRightWidth: selectborderwidth(edgeClassifiers.x === EdgeClassifier.Upper),
    borderBottomWidth: selectborderwidth(edgeClassifiers.y === EdgeClassifier.Upper),
    height: tilesize(boardDimensions.height),
    width: tilesize(boardDimensions.width),
  };

  return (
    <div className="cell-view bg-light border-secondary" style={gridStyle}>
      {
        cellOwnerImage && (
          <img
            className="d-block h-100 w-100"
            src={cellOwnerImage}
            alt={cellOwner}
          />
        )
      }
    </div>
  );
};
