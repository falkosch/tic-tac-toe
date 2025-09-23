import { type FC, memo, useCallback, useMemo } from 'react';

import { coveredConsecutiveDirections } from '../../../mechanics/Consecutiveness';
import { mapCellOwnerToImage, mapConsecutiveDirectionToImage } from '../../../mechanics/MapToImage';
import { type BoardDimensions } from '../../../meta-model/Board';
import { type CellOwner, CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import { type Consecutive } from '../../../meta-model/GameView';
import { useGameState } from '../../context/GameContext';
import { ImageStack, type ImageWithAlt } from '../image-stack/ImageStack';

const ownerTypeToAltTextMap: Record<string, string> = {
  [CellOwnerX]: 'X',
  [CellOwnerO]: 'O',
};

interface Props {
  boardDimensions: Readonly<BoardDimensions>;
  cellAt: number;
  cellOwner: Readonly<CellOwner>;
  consecutive: readonly Consecutive[];
}

export const CellView: FC<Props> = memo(({ cellAt, cellOwner, consecutive }) => {
  const { gameState } = useGameState();
  const cellOwnerImage = useMemo(() => mapCellOwnerToImage(cellOwner), [cellOwner]);
  const consecutiveDirectionImages = useMemo(
    () => coveredConsecutiveDirections(cellAt, consecutive).map(mapConsecutiveDirectionToImage),
    [cellAt, consecutive],
  );
  const onClick = useCallback(() => {
    if (gameState.actionToken) {
      gameState.actionToken([cellAt]);
    }
  }, [gameState, cellAt]);

  const images = useMemo(() => {
    const result: ImageWithAlt[] = [];
    // Add cell owner image (X or O)
    if (cellOwnerImage) {
      const alt = ownerTypeToAltTextMap[cellOwner] ?? 'Empty';
      result.push({ src: cellOwnerImage, alt });
    }
    // Add consecutive direction images (strike-through lines)
    consecutiveDirectionImages.forEach((src) => {
      if (src) {
        result.push({ src, alt: 'Winning line' });
      }
    });
    return result;
  }, [cellOwnerImage, consecutiveDirectionImages, cellOwner]);

  return (
    <button className="bg-white" type="button" onClick={onClick}>
      <ImageStack images={images} />
    </button>
  );
});

CellView.displayName = 'CellView';
