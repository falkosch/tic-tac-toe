import { CellOwner } from '../../meta-model/CellOwner';

export interface Decision {
  cellsAtToAttack: ReadonlyArray<number>;
}

export function validateDecision(
  cells: ReadonlyArray<CellOwner>,
  decision: Readonly<Decision>,
): boolean {
  return decision.cellsAtToAttack.reduce<boolean>(
    (validAcc, cellAt) => {
      if (!validAcc) {
        return false;
      }
      return cells[cellAt] === CellOwner.None;
    },
    true,
  );
}

export function findFreeCellIndices(cells: ReadonlyArray<CellOwner>): number[] {
  const freeCellIndices: number[] = [];
  cells.forEach((cellOwner, index) => {
    if (cellOwner === CellOwner.None) {
      freeCellIndices.push(index);
    }
  });
  return freeCellIndices;
}

export function takeAny(freeCellIndices: ReadonlyArray<number>): number[] {
  if (freeCellIndices.length === 0) {
    return [];
  }
  if (freeCellIndices.length === 1) {
    return [freeCellIndices[0]];
  }
  const choice = Math.floor(Math.random() * freeCellIndices.length);
  return [freeCellIndices[choice]];
}
