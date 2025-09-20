import { type BoardDimensions } from '../meta-model/Board';
import { type Coordinates } from './Coordinates';

export type CellCoordinates = Coordinates<number>;

export interface LineDimensions {
  j: number;
  i: (atJ: number) => number;
}

export type LineIteratorToCoordinates = (i: number) => CellCoordinates;

export type LineIteratorsToCoordinates = (j: number, i: number) => CellCoordinates;

export type ForEachCellInLineCallback = (
  cellAt: number,
  coordinates: Readonly<CellCoordinates>,
) => void;

export type ForEachLineCallback = (
  lineDimension: number,
  iteratorToCoordinates: LineIteratorToCoordinates,
) => void;

export const cellCoordinates = (
  cellAt: number,
  boardDimensions: Readonly<BoardDimensions>,
): CellCoordinates => {
  const span = boardDimensions.width;
  const x = Math.floor(cellAt % span);
  const y = Math.floor((cellAt - x) / span);
  return { x, y };
};

export const cellAtCoordinate = (
  coordinates: Readonly<CellCoordinates>,
  boardDimensions: Readonly<BoardDimensions>,
): number => {
  return Math.floor(coordinates.y * boardDimensions.width + coordinates.x);
};

export const forEachCellInLine = (
  boardDimensions: Readonly<BoardDimensions>,
  lineDimension: number,
  iteratorToCoordinates: LineIteratorToCoordinates,
  forEachCellInLineCallback: ForEachCellInLineCallback,
): void => {
  for (let i = 0; i < lineDimension; i += 1) {
    const coordinates = iteratorToCoordinates(i);
    const cellAt = cellAtCoordinate(coordinates, boardDimensions);
    forEachCellInLineCallback(cellAt, coordinates);
  }
};

export const forEachLine = (
  lineDimensions: Readonly<LineDimensions>,
  iteratorsToCoordinates: LineIteratorsToCoordinates,
  forEachLineCallback: ForEachLineCallback,
): void => {
  for (let j = 0; j < lineDimensions.j; j += 1) {
    const lineDimension = lineDimensions.i(j);
    const iteratorToCoordinates: LineIteratorToCoordinates = (i) => iteratorsToCoordinates(j, i);
    forEachLineCallback(lineDimension, iteratorToCoordinates);
  }
};
