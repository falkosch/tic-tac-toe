import { createContext } from 'react';

export type ActionTokenDispatchType = (cellsAt: readonly number[]) => void;

export const ActionTokenDispatch = createContext<ActionTokenDispatchType | undefined>(undefined);
