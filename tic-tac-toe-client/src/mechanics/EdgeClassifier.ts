export const EdgeClassifierLower = 'l';
export const EdgeClassifierInner = 'i';
export const EdgeClassifierUpper = 'u';

export type EdgeClassifier =
  | typeof EdgeClassifierLower
  | typeof EdgeClassifierInner
  | typeof EdgeClassifierUpper;
