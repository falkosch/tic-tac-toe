import {
  type AIAgent,
  buildNormalizedStateSpace,
  findDecisionForStateSpace,
  type NormalizedStateSpace,
} from '../ai-agent/AIAgent';
import { type Decision, findFreeCellIndices, takeAny } from '../ai-agent/Decision';
import { transformBoardCells } from '../../mechanics/BoardNormalization';
import { type Board } from '../../meta-model/Board';
import { CellOwner } from '../../meta-model/CellOwner';

export interface MenaceStateSpace extends NormalizedStateSpace {
  boardAsString: string;
  boardAsCellOwners: readonly CellOwner[];
}

export interface MenaceAgent extends AIAgent<MenaceStateSpace> {
  startNewGame(): Promise<void>;
}

export const findFreeBeads = (stateSpace: Readonly<MenaceStateSpace>): number[] => {
  return findFreeCellIndices(stateSpace.boardAsCellOwners);
};

export const randomBead = (beads: readonly number[]): number[] => {
  return takeAny(beads);
};

export const multiplyBeads = (beads: readonly number[]): number[] => {
  const multipliedBeadsCount = Math.floor((beads.length + 2) / 2);
  let multipliedBeads: number[] = [];
  for (let i = 0; i < multipliedBeadsCount; i += 1) {
    multipliedBeads = [...multipliedBeads, ...beads];
  }
  return multipliedBeads;
};

const buildMenaceStateSpace = (board: Readonly<Board>): MenaceStateSpace => {
  const normalizedStateSpace = buildNormalizedStateSpace(board);
  const normalizedCells = transformBoardCells(board, normalizedStateSpace.normalization);
  return {
    ...normalizedStateSpace,
    boardAsString: normalizedCells.reduce(
      (stateString, cellOwner) => `${stateString}${cellOwner}`,
      '',
    ),
    boardAsCellOwners: normalizedCells,
  };
};

export const findMenaceDecision = (
  agent: Readonly<MenaceAgent>,
  board: Readonly<Board>,
): Promise<Decision | null> => {
  return findDecisionForStateSpace(agent, buildMenaceStateSpace(board));
};
