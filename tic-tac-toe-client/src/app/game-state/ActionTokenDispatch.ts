import React from 'react';

export type ActionTokenDispatchType = (cellsAt: readonly number[]) => void;

export const ActionTokenDispatch = React.createContext<ActionTokenDispatchType | undefined>(
  undefined,
);
