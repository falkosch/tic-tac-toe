export const PlayerTypeHuman = 'Human player';
export const PlayerTypeMock = 'Random AI (local)';
export const PlayerTypeDQN = 'DQN AI (local)';
export const PlayerTypeMenace = 'Menace AI (local)';
export const PlayerTypeAzure = 'Azure function (remote)';

export type PlayerType =
  | typeof PlayerTypeHuman
  | typeof PlayerTypeMock
  | typeof PlayerTypeDQN
  | typeof PlayerTypeMenace
  | typeof PlayerTypeAzure;
