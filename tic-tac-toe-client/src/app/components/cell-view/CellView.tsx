import React, { type FC, useCallback, useContext, useMemo } from 'react';

import { cellCoordinates } from '../../../mechanics/CellCoordinates';
import { cellEdgeClassifiers, EdgeClassifier } from '../../../mechanics/CellEdgeClassifiers';
import { coveredConsecutiveDirections } from '../../../mechanics/Consecutiveness';
import { mapCellOwnerToImage, mapConsecutiveDirectionToImage } from '../../../mechanics/MapToImage';
import { ActionTokenDispatch } from '../../game-state/ActionTokenDispatch';
import { type BoardDimensions } from '../../../meta-model/Board';
import { CellOwner } from '../../../meta-model/CellOwner';
import { type Consecutive } from '../../../meta-model/GameView';
import { ImageStack, type ImageWithAlt } from '../image-stack/ImageStack';

import styles from './CellView.module.css';

const grid = {
  value: 0.25,
  unit: 'rem',
};

const tileSize = (dimension: number): string => {
  const innerGridSize = grid.value * (dimension - 1);
  return `calc((100% - ${innerGridSize}${grid.unit}) / ${dimension})`;
};

const selectBorderWidth = (upperEdge: boolean): string => {
  return upperEdge ? '0' : `${grid.value}${grid.unit}`;
};

interface Props {
  boardDimensions: Readonly<BoardDimensions>;
  cellAt: number;
  cellOwner: Readonly<CellOwner>;
  consecutive: readonly Consecutive[];
}

export const CellView: FC<Props> = React.memo(
  ({ boardDimensions, cellAt, cellOwner, consecutive }) => {
    const actionTokenDispatch = useContext(ActionTokenDispatch);

    const cellOwnerImage = useMemo(() => mapCellOwnerToImage(cellOwner), [cellOwner]);

    const consecutiveDirectionImages = useMemo(
      () =>
        coveredConsecutiveDirections(cellAt, consecutive).map((d) =>
          mapConsecutiveDirectionToImage(d),
        ),
      [cellAt, consecutive],
    );

    const edgeClassifiers = useMemo(
      () => cellEdgeClassifiers(cellCoordinates(cellAt, boardDimensions), boardDimensions),
      [cellAt, boardDimensions],
    );

    const gridStyle = useMemo(
      () => ({
        borderRightWidth: selectBorderWidth(edgeClassifiers.x === EdgeClassifier.Upper),
        borderBottomWidth: selectBorderWidth(edgeClassifiers.y === EdgeClassifier.Upper),
        height: tileSize(boardDimensions.height),
        width: tileSize(boardDimensions.width),
      }),
      [edgeClassifiers, boardDimensions],
    );

    const className = `${styles.view} position-relative bg-light border-secondary`;

    const onClick = useCallback((): void => {
      if (actionTokenDispatch) {
        actionTokenDispatch([cellAt]);
      }
    }, [actionTokenDispatch, cellAt]);

    const images = useMemo((): ImageWithAlt[] => {
      const result: ImageWithAlt[] = [];

      // Add cell owner image (X or O)
      if (cellOwnerImage) {
        const ownerTypeX = cellOwner === CellOwner.X ? 'X' : 'Empty';
        result.push({
          src: cellOwnerImage,
          alt: cellOwner === CellOwner.O ? 'O' : ownerTypeX,
        });
      }

      // Add consecutive direction images (strike-through lines)
      consecutiveDirectionImages.forEach((src) => {
        if (src) {
          result.push({
            src,
            alt: 'Winning line',
          });
        }
      });

      return result;
    }, [cellOwnerImage, consecutiveDirectionImages, cellOwner]);

    return (
      <button className={className} onClick={onClick} style={gridStyle} type="button">
        <ImageStack images={images} />
      </button>
    );
  },
);

CellView.displayName = 'CellView';
