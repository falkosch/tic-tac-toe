import axios from 'axios';

import { AttackGameAction } from '../meta-model/GameAction';
import { PlayerCreator } from '../meta-model/Player';
import { PlayerTurn } from '../meta-model/PlayerTurn';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:7071',
  baseURL: 'https://fstictactoegame.azurewebsites.net',
});

export const createAzureFunctionPlayer: PlayerCreator = () => (
  {
    /**
     * Posts the current game state to the Azure Function fstictactoegame. The function can analyse
     * the sent game state like the other AI player implementations would do. It can so decide for a
     * a valuable action and return it as response.
     */
    async takeTurn(playerTurn: Readonly<PlayerTurn>): Promise<AttackGameAction> {
      try {
        return (await axiosInstance.post('/api/takeTurn', playerTurn)).data;
      } catch (e) {
        console.error('Azure backend is not reachable', e);
        throw e;
      }
    },
  }
);
