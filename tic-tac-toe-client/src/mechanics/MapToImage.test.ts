import { describe, expect, it } from 'vitest';

import { CellOwner } from '../meta-model/CellOwner';
import { ConsecutiveDirection } from '../meta-model/GameView';

import strikeHorizontal from './assets/strike-horizontal.svg';
import strikeTL2BR from './assets/strike-TL2BR.svg';
import strikeTR2BL from './assets/strike-TR2BL.svg';
import strikeVertical from './assets/strike-vertical.svg';
import strokeO from './assets/stroke-o.svg';
import strokeX from './assets/stroke-x.svg';
import { mapCellOwnerToImage, mapConsecutiveDirectionToImage } from './MapToImage';

describe('mapCellOwnerToImage', () => {
  it('maps None to undefined', () => {
    expect(mapCellOwnerToImage(CellOwner.None)).toBeUndefined();
  });

  it('maps O to the O-stroke image', () => {
    expect(mapCellOwnerToImage(CellOwner.O)).toBe(strokeO);
  });

  it('maps X to the X-stroke image', () => {
    expect(mapCellOwnerToImage(CellOwner.X)).toBe(strokeX);
  });
});

describe('mapConsecutiveDirectionToImage', () => {
  it('maps undefined to undefined', () => {
    expect(mapConsecutiveDirectionToImage(undefined)).toBeUndefined();
  });

  it('maps Horizontal to the horizontal-strike image', () => {
    expect(mapConsecutiveDirectionToImage(ConsecutiveDirection.Horizontal)).toBe(strikeHorizontal);
  });

  it('maps Vertical to the vertical-strike image', () => {
    expect(mapConsecutiveDirectionToImage(ConsecutiveDirection.Vertical)).toBe(strikeVertical);
  });

  it('maps DiagonalTL2BR to the TL2BR-strike image', () => {
    expect(mapConsecutiveDirectionToImage(ConsecutiveDirection.DiagonalTL2BR)).toBe(strikeTL2BR);
  });

  it('maps DiagonalTR2BL to the TR2BL-strike image', () => {
    expect(mapConsecutiveDirectionToImage(ConsecutiveDirection.DiagonalTR2BL)).toBe(strikeTR2BL);
  });
});
