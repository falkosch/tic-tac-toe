import { rand, randNumber } from '@ngneat/falso';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { coveredConsecutiveDirections } from '../../../mechanics/Consecutiveness.ts';
import {
  mapCellOwnerToImage,
  mapConsecutiveDirectionToImage,
} from '../../../mechanics/MapToImage.ts';
import { type CellOwner, CellOwnerO, CellOwnerX } from '../../../meta-model/CellOwner';
import {
  type ConsecutiveDirection,
  ConsecutiveDirectionHorizontal,
  ConsecutiveDirectionVertical,
} from '../../../meta-model/ConsecutiveDirection.ts';
import type { Consecutive } from '../../../meta-model/GameView.ts';
import { useGameState } from '../../context/GameContext.tsx';
import { ImageStack } from '../image-stack/ImageStack.tsx';
import { CellView } from './CellView';

vi.mock('../../../mechanics/Consecutiveness', () => ({
  coveredConsecutiveDirections: vi.fn(),
}));

vi.mock('../../../mechanics/MapToImage', () => ({
  mapCellOwnerToImage: vi.fn(),
  mapConsecutiveDirectionToImage: vi.fn(),
}));

vi.mock('../../context/GameContext', () => ({
  useGameState: vi.fn(),
}));

vi.mock('../image-stack/ImageStack', () => ({
  ImageStack: vi.fn(),
}));

describe('CellView', () => {
  const givenActionToken = vi.fn();
  const givenGameState = {
    gameState: {
      actionToken: givenActionToken,
      wins: {
        X: randNumber(),
        O: randNumber(),
      },
    },
    dispatch: vi.fn(),
  };
  const givenCellAt = randNumber();
  const givenCellOwner = rand<CellOwner>([CellOwnerX, CellOwnerO]);
  const givenConsecutive: Consecutive[] = [];

  beforeEach(() => {
    vi.mocked(coveredConsecutiveDirections).mockReturnValue([]);
    vi.mocked(mapCellOwnerToImage).mockReturnValue(undefined);
    vi.mocked(mapConsecutiveDirectionToImage).mockReturnValue(undefined);
    vi.mocked(useGameState).mockReturnValue(givenGameState);
    vi.mocked(ImageStack).mockReturnValue(<></>);
  });

  it('renders images in ImageStack', () => {
    render(
      <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
    );

    expect(ImageStack).toHaveBeenCalledTimes(1);
  });

  describe('Cell owner images', () => {
    it('maps cell owner to image', () => {
      render(
        <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
      );

      expect(mapCellOwnerToImage).toHaveBeenCalledWith(givenCellOwner);
      expect(mapCellOwnerToImage).toHaveBeenCalledTimes(1);
    });

    it('renders no image when cell owner is not mapped to an image', () => {
      render(
        <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
      );

      expect(ImageStack).toHaveBeenCalledWith({ images: [] }, undefined);
    });

    it('renders cell owner image with alt text "X" when cell owner is X', () => {
      vi.mocked(mapCellOwnerToImage).mockReturnValue('/x.svg');

      render(
        <CellView cellAt={givenCellAt} cellOwner={CellOwnerX} consecutive={givenConsecutive} />,
      );

      expect(ImageStack).toHaveBeenCalledWith({ images: [{ alt: 'X', src: '/x.svg' }] }, undefined);
    });

    it('renders cell owner image with alt text "O" when cell owner is O', () => {
      vi.mocked(mapCellOwnerToImage).mockReturnValue('/o.svg');

      render(
        <CellView cellAt={givenCellAt} cellOwner={CellOwnerO} consecutive={givenConsecutive} />,
      );

      expect(ImageStack).toHaveBeenCalledWith({ images: [{ alt: 'O', src: '/o.svg' }] }, undefined);
    });
  });

  describe('Winning lines', () => {
    it('determines covered consecutive directions given cellAt and consecutive directions', () => {
      render(
        <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
      );

      expect(coveredConsecutiveDirections).toHaveBeenCalledWith(givenCellAt, givenConsecutive);
      expect(coveredConsecutiveDirections).toHaveBeenCalledTimes(1);
    });

    it('maps each covered consecutive direction to Winning line image', () => {
      const givenCoveredConsecutiveDirections: ConsecutiveDirection[] = [
        ConsecutiveDirectionHorizontal,
        ConsecutiveDirectionVertical,
      ];
      vi.mocked(coveredConsecutiveDirections).mockReturnValue(givenCoveredConsecutiveDirections);

      render(
        <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
      );

      expect(mapConsecutiveDirectionToImage).toHaveBeenNthCalledWith(
        1,
        ConsecutiveDirectionHorizontal,
        0,
        givenCoveredConsecutiveDirections,
      );
      expect(mapConsecutiveDirectionToImage).toHaveBeenNthCalledWith(
        2,
        ConsecutiveDirectionVertical,
        1,
        givenCoveredConsecutiveDirections,
      );
      expect(mapConsecutiveDirectionToImage).toHaveBeenCalledTimes(2);
    });

    it('renders no Winning line image when covered consecutive directions are empty', () => {
      render(
        <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
      );

      expect(ImageStack).toHaveBeenCalledWith({ images: [] }, undefined);
    });

    it('renders no Winning line image when covered consecutive direction is unknown', () => {
      vi.mocked(coveredConsecutiveDirections).mockReturnValue([ConsecutiveDirectionHorizontal]);

      render(
        <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
      );

      expect(ImageStack).toHaveBeenCalledWith({ images: [] }, undefined);
    });

    it('renders image for each covered consecutive direction', () => {
      vi.mocked(coveredConsecutiveDirections).mockReturnValue([
        ConsecutiveDirectionHorizontal,
        ConsecutiveDirectionVertical,
      ]);
      vi.mocked(mapConsecutiveDirectionToImage)
        .mockReturnValueOnce('/winning-line-1.svg')
        .mockReturnValueOnce('/winning-line-2.svg');

      render(
        <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
      );

      expect(ImageStack).toHaveBeenCalledWith(
        {
          images: [
            { alt: 'Winning line', src: '/winning-line-1.svg' },
            { alt: 'Winning line', src: '/winning-line-2.svg' },
          ],
        },
        undefined,
      );
    });
  });

  describe('Action token', () => {
    it('invokes actionToken with given cellAt when button is clicked', () => {
      render(
        <CellView cellAt={givenCellAt} cellOwner={givenCellOwner} consecutive={givenConsecutive} />,
      );

      fireEvent.click(screen.getByRole('button'));

      expect(givenActionToken).toHaveBeenCalledWith([givenCellAt]);
      expect(givenActionToken).toHaveBeenCalledTimes(1);
    });
  });
});
