import axios, { AxiosError } from 'axios';

import { type AttackGameAction } from '../meta-model/GameAction';
import { type PlayerCreator } from '../meta-model/Player';
import { type PlayerTurn } from '../meta-model/PlayerTurn';

/**
 * Configuration constants for Azure Function Player
 */
const AZURE_FUNCTION_CONFIG = {
  MAX_RETRIES: 3,
  BASE_DELAY_MS: 1000,
  TIMEOUT_MS: 30000,
  API_ENDPOINT: '/api/takeTurn',
} as const;

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_AZURE_FUNCTION_BASE_URL,
  timeout: AZURE_FUNCTION_CONFIG.TIMEOUT_MS,
});

/**
 * Check if the Azure Function service is available
 */
const isAzureFunctionAvailable = (): boolean => {
  const baseURL = process.env.REACT_APP_AZURE_FUNCTION_BASE_URL;
  return !!baseURL && baseURL.trim() !== '';
};

/**
 * Create user-friendly error message for network failures
 */
const createNetworkError = (originalError: AxiosError): Error => {
  let message: string;

  if (originalError.code === 'ECONNABORTED') {
    message = 'Azure Function request timed out. The service may be slow or unavailable.';
  } else if (originalError.response?.status === 404) {
    message =
      'Azure Function service is not available. The backend may not be deployed or the endpoint is incorrect.';
  } else if (originalError.code === 'ECONNREFUSED' || originalError.code === 'ENOTFOUND') {
    message =
      'Cannot connect to Azure Function service. Please check your network connection and try again.';
  } else {
    message = `Azure Function service is currently unavailable: ${originalError.message}`;
  }

  const error = new Error(message);
  (error as typeof error & { isAxiosError: boolean }).isAxiosError = true;
  return error;
};

/**
 * Sleep utility function for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Retry function with exponential backoff
 */
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries = AZURE_FUNCTION_CONFIG.MAX_RETRIES,
  baseDelay = AZURE_FUNCTION_CONFIG.BASE_DELAY_MS,
): Promise<T> => {
  let lastError: Error;
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt >= maxRetries) {
        break;
      }

      // Only retry on specific network errors
      if (axios.isAxiosError(error)) {
        const isRetryableError =
          error.code === 'ECONNABORTED' || // timeout
          error.code === 'ECONNREFUSED' || // connection refused
          error.code === 'ENOTFOUND' || // DNS lookup failed
          error.response?.status === 500 || // server error
          error.response?.status === 502 || // bad gateway
          error.response?.status === 503 || // service unavailable
          error.response?.status === 504; // gateway timeout

        if (isRetryableError) {
          const delay = baseDelay * 2 ** attempt;
          await sleep(delay);
          attempt += 1;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }

  throw lastError;
};

export const createAzureFunctionPlayer: PlayerCreator = () => {
  // Check if Azure Function is configured
  if (!isAzureFunctionAvailable()) {
    throw new Error(
      'Azure Function player is not configured. Please check your environment variables.',
    );
  }

  return Promise.resolve({
    /**
     * Posts the current game state in {@code playerTurn} to the Azure Function
     * {@code fstictactoegame}. The Azure function reacts on the game state by deciding for a
     * valuable action. Includes retry logic and user-friendly error handling.
     */
    async takeTurn(playerTurn: Readonly<PlayerTurn>): Promise<AttackGameAction> {
      try {
        return await retryWithBackoff(async () => {
          const response = await axiosInstance.post<AttackGameAction>(
            AZURE_FUNCTION_CONFIG.API_ENDPOINT,
            playerTurn,
          );
          return response.data;
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw createNetworkError(error);
        }
        throw error;
      }
    },
  });
};
