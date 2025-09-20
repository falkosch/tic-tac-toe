import {
  type AIAgent,
  buildNormalizedStateSpace,
  findDecisionForStateSpace,
  type NormalizedStateSpace,
} from '../ai-agent/AIAgent';
import { transformBoardCells } from '../../mechanics/BoardNormalization';
import { type Board } from '../../meta-model/Board';
import { CellOwner, type SpecificCellOwner } from '../../meta-model/CellOwner';
import { type Decision } from '../ai-agent/Decision';

export interface ReinforcedStateSpace extends NormalizedStateSpace {
  states: readonly number[];
}

export type ReinforcedAgent = AIAgent<ReinforcedStateSpace>;

const buildReinforcedStateSpace = (
  agentCellOwner: Readonly<SpecificCellOwner>,
  board: Readonly<Board>,
): ReinforcedStateSpace => {
  const normalizedStateSpace = buildNormalizedStateSpace(board);
  return {
    ...normalizedStateSpace,
    states: transformBoardCells(board, normalizedStateSpace.normalization).map((cellOwner) => {
      if (cellOwner === CellOwner.None) {
        return 0.0;
      }
      if (cellOwner === agentCellOwner) {
        return 1.0;
      }
      return -1.0;
    }),
  };
};

export const findReinforcedDecision = (
  agent: Readonly<ReinforcedAgent>,
  board: Readonly<Board>,
): Promise<Decision | null> => {
  return findDecisionForStateSpace(agent, buildReinforcedStateSpace(agent.cellOwner, board));
};
