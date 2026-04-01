export const CellOwnerNone = ' ';
export const CellOwnerX = 'X';
export const CellOwnerO = 'O';

export type CellOwner = typeof CellOwnerNone | typeof CellOwnerX | typeof CellOwnerO;
export type SpecificCellOwner = Exclude<CellOwner, typeof CellOwnerNone>;
