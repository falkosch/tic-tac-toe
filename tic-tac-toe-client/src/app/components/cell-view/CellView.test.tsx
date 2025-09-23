import { render } from '@testing-library/react';
import { beforeEach, describe, it } from 'vitest';

import { type BoardDimensions } from '../../../meta-model/Board';
import { type CellOwner, CellOwnerX } from '../../../meta-model/CellOwner';
import { CellView } from './CellView';

describe('CellView', () => {
  let boardDimensions: BoardDimensions;
  let cellOwner: CellOwner;

  beforeEach(() => {
    boardDimensions = {
      height: 1,
      width: 1,
    };
    cellOwner = CellOwnerX;
  });

  it('renders without crashing', () => {
    render(
      <CellView
        boardDimensions={boardDimensions}
        cellAt={0}
        cellOwner={cellOwner}
        consecutive={[]}
      />,
    );
  });
});
