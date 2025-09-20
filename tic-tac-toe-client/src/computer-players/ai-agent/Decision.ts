import { type CellOwner, CellOwnerNone } from '../../meta-model/CellOwner';

export interface Decision {
  cellsAtToAttack: readonly number[];
}

export const findFreeCellIndices = (cells: readonly CellOwner[]): number[] => {
  const freeCellIndices: number[] = [];
  cells.forEach((cellOwner, index) => {
    if (cellOwner === CellOwnerNone) {
      freeCellIndices.push(index);
    }
  });
  return freeCellIndices;
};

export const takeAny = (freeCellIndices: readonly number[]): number[] => {
  if (freeCellIndices.length === 0) {
    return [];
  }
  if (freeCellIndices.length === 1) {
    return [freeCellIndices[0]];
  }
  const choice = Math.floor(Math.random() * freeCellIndices.length);
  return [freeCellIndices[choice]];
};
