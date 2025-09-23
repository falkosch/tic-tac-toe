import { type CellOwner, CellOwnerNone, CellOwnerO, CellOwnerX } from '../meta-model/CellOwner';
import {
  type ConsecutiveDirection,
  ConsecutiveDirectionDiagonalTL2BR,
  ConsecutiveDirectionDiagonalTR2BL,
  ConsecutiveDirectionHorizontal,
  ConsecutiveDirectionVertical,
} from '../meta-model/ConsecutiveDirection.ts';
import strikeHorizontal from './assets/strike-horizontal.svg';
import strikeTL2BR from './assets/strike-TL2BR.svg';
import strikeTR2BL from './assets/strike-TR2BL.svg';
import strikeVertical from './assets/strike-vertical.svg';
import strokeO from './assets/stroke-o.svg';
import strokeX from './assets/stroke-x.svg';

const cellOwnerToImage: Record<CellOwner, string | undefined> = {
  [CellOwnerNone]: undefined,
  [CellOwnerO]: strokeO,
  [CellOwnerX]: strokeX,
} as const;

const consecutiveDirectionToImage: Record<ConsecutiveDirection, string> = {
  [ConsecutiveDirectionHorizontal]: strikeHorizontal,
  [ConsecutiveDirectionVertical]: strikeVertical,
  [ConsecutiveDirectionDiagonalTL2BR]: strikeTL2BR,
  [ConsecutiveDirectionDiagonalTR2BL]: strikeTR2BL,
} as const;

export const mapCellOwnerToImage = (cellOwner: Readonly<CellOwner>): string | undefined =>
  cellOwnerToImage[cellOwner];

export const mapConsecutiveDirectionToImage = (
  direction?: Readonly<ConsecutiveDirection>,
): string | undefined =>
  direction === undefined ? undefined : consecutiveDirectionToImage[direction];
