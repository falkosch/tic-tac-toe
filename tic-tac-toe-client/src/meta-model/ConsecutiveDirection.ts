export const ConsecutiveDirectionHorizontal = 'H';
export const ConsecutiveDirectionVertical = 'V';
export const ConsecutiveDirectionDiagonalTR2BL = 'TR2BL';
export const ConsecutiveDirectionDiagonalTL2BR = 'TL2BR';

export type ConsecutiveDirection =
  | typeof ConsecutiveDirectionHorizontal
  | typeof ConsecutiveDirectionVertical
  | typeof ConsecutiveDirectionDiagonalTR2BL
  | typeof ConsecutiveDirectionDiagonalTL2BR;
