import React, { type FC, useCallback, useMemo } from 'react';

import { cellCoordinates } from '../../../mechanics/CellCoordinates';
import { cellEdgeClassifiers } from '../../../mechanics/CellEdgeClassifiers';
import { coveredConsecutiveDirections } from '../../../mechanics/Consecutiveness';
import { mapCellOwnerToImage, mapConsecutiveDirectionToImage } from '../../../mechanics/MapToImage';
import { useGameState } from '../../context/GameContext';
import { type BoardDimensions } from '../../../meta-model/Board';
import { type CellOwner, CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import { type Consecutive } from '../../../meta-model/GameView';
import { ImageStack, type ImageWithAlt } from '../image-stack/ImageStack';

import styles from './CellView.module.css';
import { EdgeClassifierUpper } from '../../../mechanics/EdgeClassifier.ts';

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
    const { gameState } = useGameState();

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
        borderRightWidth: selectBorderWidth(edgeClassifiers.x === EdgeClassifierUpper),
        borderBottomWidth: selectBorderWidth(edgeClassifiers.y === EdgeClassifierUpper),
        height: tileSize(boardDimensions.height),
        width: tileSize(boardDimensions.width),
      }),
      [edgeClassifiers, boardDimensions],
    );

    const className = `${styles.view} position-relative bg-light border-secondary`;

    const onClick = useCallback((): void => {
      if (gameState.actionToken) {
        gameState.actionToken([cellAt]);
      }
    }, [gameState, cellAt]);

    const images = useMemo((): ImageWithAlt[] => {
      const result: ImageWithAlt[] = [];

      // Add cell owner image (X or O)
      if (cellOwnerImage) {
        const ownerTypeToAltTextMap: Record<string, string> = {
          [CellOwnerX]: 'X',
          [CellOwnerO]: 'O',
        };
        result.push({
          src: cellOwnerImage,
          alt: ownerTypeToAltTextMap[cellOwner] ?? 'Empty',
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
