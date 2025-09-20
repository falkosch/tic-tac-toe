import { buildBoardModifier } from './Actions';
import { countPoints, isDrawEnding, isOneWinnerEnding, pointsLeader } from './GameRules';
import { findConsecutive } from './Consecutiveness';
import { type AttackGameAction } from '../meta-model/GameAction';
import { type Board, type BoardDimensions } from '../meta-model/Board';
import {
  CellOwnerNone,
  CellOwnerO,
  CellOwnerX,
  type SpecificCellOwner,
} from '../meta-model/CellOwner';
import { type GameActionHistory } from '../meta-model/GameActionHistory';
import { type GameEndState } from '../meta-model/GameEndState';
import { type GameView } from '../meta-model/GameView';
import { type Player, type PlayerCreator } from '../meta-model/Player';

export type JoiningPlayers = Record<SpecificCellOwner, PlayerCreator>;

export type OnGameStart = (gameView: Readonly<GameView>) => Promise<void>;

export type OnGameViewUpdate = (gameView: Readonly<GameView>) => Promise<void>;

export type OnGameEnd = (endState: Readonly<GameEndState>) => Promise<void>;

type JoinedPlayer = [Readonly<SpecificCellOwner>, Readonly<Player>];

const DefaultDimensions: Readonly<BoardDimensions> = {
  height: 3,
  width: 3,
};

const newBoard = (boardDimensions: Readonly<BoardDimensions>): Board => {
  const { height, width } = boardDimensions;
  return {
    cells: Array.from({ length: height * width }).map(() => CellOwnerNone),
    dimensions: boardDimensions,
  };
};

const newGameView = (): GameView => {
  return {
    board: newBoard(DefaultDimensions),
    consecutive: [],
    points: {
      [CellOwnerO]: 0,
      [CellOwnerX]: 0,
    },
  };
};

const emptyActionHistory = (): GameActionHistory => {
  return {
    action: {
      affectedCellsAt: [],
    },
  };
};

const effectiveMaxTurns = (dimensions: Readonly<BoardDimensions>, maxTurns: number): number => {
  const minTurnsRequired = dimensions.width * dimensions.height;
  return Math.max(minTurnsRequired, maxTurns);
};

const playerOfTurn = (joinedPlayers: readonly JoinedPlayer[], turn: number): JoinedPlayer => {
  const indexOfPlayerWithTurn = turn % joinedPlayers.length;
  return joinedPlayers[indexOfPlayerWithTurn];
};

const joinPlayers = (joiningPlayers: Readonly<JoiningPlayers>): Promise<JoinedPlayer[]> => {
  const joiningPlayersEntries = Object.entries(joiningPlayers);
  const createPromises = joiningPlayersEntries.map<Promise<[SpecificCellOwner, Player]>>(
    async ([cellOwner, playerCreator]) => [cellOwner as SpecificCellOwner, await playerCreator()],
  );
  return Promise.all(createPromises);
};

const isWithdrawAction = (action: Readonly<AttackGameAction>): boolean => {
  return action.affectedCellsAt.length === 0;
};

const makeDrawEndState = (
  gameView: Readonly<GameView>,
  moveLimitReached: boolean,
): GameEndState => {
  return {
    gameView,
    visit(visitor) {
      const { drawEndState } = visitor;
      if (drawEndState) {
        drawEndState(moveLimitReached);
      }
    },
  };
};

const makeOneWinnerEndState = (gameView: Readonly<GameView>): GameEndState => {
  const winner = pointsLeader(gameView.points);
  return {
    gameView,
    visit(visitor) {
      const { oneWinnerEndState } = visitor;
      if (oneWinnerEndState && winner) {
        oneWinnerEndState(winner);
      }
    },
  };
};

const makeErroneousEndState = (
  gameView: Readonly<GameView>,
  error: Readonly<Error>,
): GameEndState => {
  return {
    gameView,
    visit(visitor) {
      const { erroneousEndState } = visitor;
      if (erroneousEndState) {
        erroneousEndState(error);
      }
    },
  };
};

const notifyGameViewUpdate = async (
  gameView: Readonly<GameView>,
  joinedPlayers: readonly JoinedPlayer[],
  onGameViewUpdate?: OnGameViewUpdate,
): Promise<void> => {
  if (onGameViewUpdate) {
    await onGameViewUpdate(gameView);
  }

  await Promise.all(
    joinedPlayers.map(async ([cellOwner, player]) => {
      const { onGameViewUpdate: playerOnGameViewUpdate } = player;
      if (playerOnGameViewUpdate) {
        await playerOnGameViewUpdate(cellOwner, gameView);
      }
    }),
  );
};

const notifyGameStart = async (
  gameView: Readonly<GameView>,
  joinedPlayers: readonly JoinedPlayer[],
  onGameStart?: OnGameStart,
): Promise<void> => {
  if (onGameStart) {
    await onGameStart(gameView);
  }

  await Promise.all(
    joinedPlayers.map(async ([cellOwner, player]) => {
      const { onGameStart: playerOnGameStart } = player;
      if (playerOnGameStart) {
        await playerOnGameStart(cellOwner, gameView);
      }
    }),
  );
};

const notifyGameEnd = async (
  endState: Readonly<GameEndState>,
  joinedPlayers: readonly JoinedPlayer[],
  onGameEnd?: OnGameEnd,
): Promise<void> => {
  if (onGameEnd) {
    await onGameEnd(endState);
  }

  await Promise.all(
    joinedPlayers.map(async ([cellOwner, player]) => {
      const { onGameEnd: playerOnGameEnd } = player;
      if (playerOnGameEnd) {
        await playerOnGameEnd(cellOwner, endState);
      }
    }),
  );
};

const runTurns = async (
  joinedPlayers: readonly JoinedPlayer[],
  initialGameView: Readonly<GameView>,
  onGameViewUpdate?: OnGameViewUpdate,
  maxTurns = 100,
): Promise<GameEndState> => {
  let actionHistory = emptyActionHistory();
  let gameView = initialGameView;

  const turnsLimit = effectiveMaxTurns(gameView.board.dimensions, maxTurns);
  let turn = 0;
  while (turn < turnsLimit) {
    const [cellOwner, playerWithTurn] = playerOfTurn(joinedPlayers, turn);

    let action: AttackGameAction;
    try {
      action = await playerWithTurn.takeTurn({ cellOwner, gameView, actionHistory });
    } catch (error) {
      return makeErroneousEndState(gameView, new Error('takeTurn failed', { cause: error }));
    }

    actionHistory = { action, previous: actionHistory };

    const boardModifier = buildBoardModifier(action, cellOwner);
    const board = boardModifier(gameView.board);
    const consecutive = findConsecutive(board);
    const points = countPoints(board, consecutive);
    gameView = { board, consecutive, points };
    await notifyGameViewUpdate(gameView, joinedPlayers, onGameViewUpdate);

    if (isWithdrawAction(action) || isDrawEnding(gameView)) {
      return makeDrawEndState(gameView, false);
    }

    if (isOneWinnerEnding(gameView)) {
      return makeOneWinnerEndState(gameView);
    }

    turn += 1;
  }

  return makeDrawEndState(gameView, true);
};

export const runNewGame = async (
  joiningPlayers: Readonly<JoiningPlayers>,
  onGameStart?: OnGameStart,
  onGameViewUpdate?: OnGameViewUpdate,
  onGameEnd?: OnGameEnd,
  maxTurns?: number,
): Promise<GameEndState> => {
  const joinedPlayers = await joinPlayers(joiningPlayers);

  const initialGameView = newGameView();
  await notifyGameStart(initialGameView, joinedPlayers, onGameStart);

  const endState = await runTurns(joinedPlayers, initialGameView, onGameViewUpdate, maxTurns);
  await notifyGameEnd(endState, joinedPlayers, onGameEnd);

  return endState;
};
