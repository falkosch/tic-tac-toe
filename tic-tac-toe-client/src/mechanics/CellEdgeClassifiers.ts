import { type BoardDimensions } from '../meta-model/Board';
import { type CellCoordinates } from './CellCoordinates';
import { type Coordinates } from './Coordinates';
import {
  type EdgeClassifier,
  EdgeClassifierInner,
  EdgeClassifierLower,
  EdgeClassifierUpper,
} from './EdgeClassifier.ts';

export type EdgeClassifiers = Coordinates<EdgeClassifier>;

export const cellEdgeClassifier = (coordinate: number, dimension: number): EdgeClassifier => {
  if (coordinate <= 0) {
    return EdgeClassifierLower;
  }
  if (coordinate + 1 >= dimension) {
    return EdgeClassifierUpper;
  }
  return EdgeClassifierInner;
};

export const cellEdgeClassifiers = (
  coordinates: Readonly<CellCoordinates>,
  boardDimensions: Readonly<BoardDimensions>,
): EdgeClassifiers => {
  return {
    x: cellEdgeClassifier(coordinates.x, boardDimensions.width),
    y: cellEdgeClassifier(coordinates.y, boardDimensions.height),
  };
};
