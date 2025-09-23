import menaceO3x3 from './brains/menace-O-3x3.json';
import menaceX3x3 from './brains/menace-X-3x3.json';
import { type StorableMenaceAgent } from './StorableMenaceAgent';

export const Brains: Record<string, StorableMenaceAgent> = {
  'menace-O-3x3': menaceO3x3,
  'menace-X-3x3': menaceX3x3,
};
