import { AxiosError } from 'axios';
import { type AttackGameAction } from '../meta-model/GameAction';
import { type PlayerTurn } from '../meta-model/PlayerTurn';
import { CellOwner } from '../meta-model/CellOwner';

// Now import the module after mocking
import { createAzureFunctionPlayer } from './AzureFunctionPlayer';

// Mock axios instance that will be returned by axios.create
const mockAxiosInstance = {
  post: vi.fn(),
};

// Mock axios completely
const mockAxios = {
  create: vi.fn(() => mockAxiosInstance),
  isAxiosError: vi.fn(),
  default: {
    create: vi.fn(() => mockAxiosInstance),
    isAxiosError: vi.fn(),
  },
};

// Set up the mock before importing the module
vi.doMock('axios', () => mockAxios);

describe('AzureFunctionPlayer', () => {
  const mockPlayerTurn: PlayerTurn = {
    cellOwner: CellOwner.X,
    gameView: {
      board: {
        dimensions: { width: 3, height: 3 },
        cells: [
          CellOwner.None,
          CellOwner.None,
          CellOwner.None,
          CellOwner.None,
          CellOwner.None,
          CellOwner.None,
          CellOwner.None,
          CellOwner.None,
          CellOwner.None,
        ],
      },
      consecutive: [],
      points: {
        X: 0,
        O: 0,
      },
    },
  };

  const mockResponse: AttackGameAction = {
    affectedCellsAt: [0],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up axios.create to return our mock instance
    mockAxios.create.mockReturnValue(mockAxiosInstance);

    // Set up isAxiosError to work properly
    mockAxios.isAxiosError.mockImplementation((error) => {
      return error?.constructor && error.constructor.name === 'AxiosError';
    });

    // Clear environment variables
    delete process.env.REACT_APP_AZURE_FUNCTION_BASE_URL;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Configuration Tests', () => {
    describe('Azure Function availability detection', () => {
      it('should detect Azure Function as available with valid URL', async () => {
        process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net';

        const player = await createAzureFunctionPlayer();

        expect(player).toBeDefined();
        expect(player.takeTurn).toBeDefined();
      });

      it('should detect Azure Function as unavailable with missing environment variable', async () => {
        await expect(createAzureFunctionPlayer()).rejects.toThrow(
          'Azure Function player is not configured. Please check your environment variables.',
        );
      });

      it('should detect Azure Function as unavailable with empty environment variable', async () => {
        process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = '';

        await expect(createAzureFunctionPlayer()).rejects.toThrow(
          'Azure Function player is not configured. Please check your environment variables.',
        );
      });

      it('should detect Azure Function as unavailable with whitespace-only environment variable', async () => {
        process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = '   ';

        await expect(createAzureFunctionPlayer()).rejects.toThrow(
          'Azure Function player is not configured. Please check your environment variables.',
        );
      });
    });

    describe('Player creation', () => {
      it('should create player with valid configuration', async () => {
        process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net';

        const player = await createAzureFunctionPlayer();

        expect(player).toBeDefined();
        expect(typeof player.takeTurn).toBe('function');
      });

      it('should configure axios instance with correct baseURL and timeout', async () => {
        const baseURL = 'https://example.azurewebsites.net';
        process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = baseURL;

        await createAzureFunctionPlayer();

        expect(mockAxios.create).toHaveBeenCalledWith({
          baseURL,
          timeout: 30000,
        });
      });
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net';
    });

    it('should successfully make API call and return response', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const player = await createAzureFunctionPlayer();
      const result = await player.takeTurn(mockPlayerTurn);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/takeTurn', mockPlayerTurn);
      expect(result).toEqual(mockResponse);
    });

    it('should use correct API endpoint', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const player = await createAzureFunctionPlayer();
      await player.takeTurn(mockPlayerTurn);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/takeTurn', mockPlayerTurn);
    });

    it('should pass playerTurn data correctly', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const player = await createAzureFunctionPlayer();
      await player.takeTurn(mockPlayerTurn);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/api/takeTurn',
        expect.objectContaining({
          cellOwner: CellOwner.X,
          gameView: expect.any(Object),
        }),
      );
    });
  });

  describe('Retry Mechanism Tests', () => {
    beforeEach(() => {
      process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net';
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('Exponential backoff behavior', () => {
      it('should implement exponential backoff with correct delays', async () => {
        const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
        mockAxiosInstance.post
          .mockRejectedValueOnce(timeoutError)
          .mockRejectedValueOnce(timeoutError)
          .mockRejectedValueOnce(timeoutError)
          .mockResolvedValueOnce({ data: mockResponse });

        const player = await createAzureFunctionPlayer();
        const promise = player.takeTurn(mockPlayerTurn);

        // First retry - 1000ms delay (1000 * 2^0)
        await vi.advanceTimersByTimeAsync(1000);

        // Second retry - 2000ms delay (1000 * 2^1)
        await vi.advanceTimersByTimeAsync(2000);

        // Third retry - 4000ms delay (1000 * 2^2)
        await vi.advanceTimersByTimeAsync(4000);

        const result = await promise;

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(4);
      });

      it('should calculate retry delay as baseDelay × 2^attempt', async () => {
        const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
        mockAxiosInstance.post
          .mockRejectedValueOnce(timeoutError)
          .mockRejectedValueOnce(timeoutError)
          .mockResolvedValueOnce({ data: mockResponse });

        const player = await createAzureFunctionPlayer();
        const promise = player.takeTurn(mockPlayerTurn);

        // First retry: 1000 * 2^0 = 1000ms
        await vi.advanceTimersByTimeAsync(1000);

        // Second retry: 1000 * 2^1 = 2000ms
        await vi.advanceTimersByTimeAsync(2000);

        const result = await promise;

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(3);
      });
    });

    describe('Retry conditions', () => {
      it('should retry on network timeout (ECONNABORTED)', async () => {
        const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
        mockAxiosInstance.post
          .mockRejectedValueOnce(timeoutError)
          .mockResolvedValueOnce({ data: mockResponse });

        const player = await createAzureFunctionPlayer();
        const promise = player.takeTurn(mockPlayerTurn);

        await vi.advanceTimersByTimeAsync(1000);
        const result = await promise;

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      });

      it('should retry on connection refused (ECONNREFUSED)', async () => {
        const connRefusedError = new AxiosError('connection refused', 'ECONNREFUSED');
        mockAxiosInstance.post
          .mockRejectedValueOnce(connRefusedError)
          .mockResolvedValueOnce({ data: mockResponse });

        const player = await createAzureFunctionPlayer();
        const promise = player.takeTurn(mockPlayerTurn);

        await vi.advanceTimersByTimeAsync(1000);
        const result = await promise;

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      });

      it('should retry on DNS lookup failure (ENOTFOUND)', async () => {
        const dnsError = new AxiosError('DNS lookup failed', 'ENOTFOUND');
        mockAxiosInstance.post
          .mockRejectedValueOnce(dnsError)
          .mockResolvedValueOnce({ data: mockResponse });

        const player = await createAzureFunctionPlayer();
        const promise = player.takeTurn(mockPlayerTurn);

        await vi.advanceTimersByTimeAsync(1000);
        const result = await promise;

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      });

      it.each([500, 502, 503, 504])('should retry on server error %d', async (statusCode) => {
        const serverError = new AxiosError('server error');
        serverError.response = { status: statusCode } as AxiosError['response'];
        mockAxiosInstance.post
          .mockRejectedValueOnce(serverError)
          .mockResolvedValueOnce({ data: mockResponse });

        const player = await createAzureFunctionPlayer();
        const promise = player.takeTurn(mockPlayerTurn);

        await vi.advanceTimersByTimeAsync(1000);
        const result = await promise;

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      });

      it('should not retry on 404 errors', async () => {
        const notFoundError = new AxiosError('not found');
        notFoundError.response = { status: 404 } as AxiosError['response'];
        mockAxiosInstance.post.mockRejectedValue(notFoundError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          'Azure Function service is not available. The backend may not be deployed or the endpoint is incorrect.',
        );

        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
      });

      it('should not retry on 400 client errors', async () => {
        const clientError = new AxiosError('bad request');
        clientError.response = { status: 400 } as AxiosError['response'];
        mockAxiosInstance.post.mockRejectedValue(clientError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          'Azure Function service is currently unavailable: bad request',
        );

        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
      });

      it('should not retry on non-Axios errors', async () => {
        const genericError = new Error('generic error');
        mockAxiosInstance.post.mockRejectedValue(genericError);

        mockAxios.isAxiosError.mockReturnValue(false);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow('generic error');

        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
      });
    });

    describe('Maximum retry limit', () => {
      it('should respect maximum retry limit of 3', async () => {
        const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
        mockAxiosInstance.post.mockRejectedValue(timeoutError);

        const player = await createAzureFunctionPlayer();
        const promise = player.takeTurn(mockPlayerTurn);

        // Wait for all retries to complete
        await vi.advanceTimersByTimeAsync(1000); // First retry
        await vi.advanceTimersByTimeAsync(2000); // Second retry
        await vi.advanceTimersByTimeAsync(4000); // Third retry

        await expect(promise).rejects.toThrow(
          'Azure Function request timed out. The service may be slow or unavailable.',
        );

        // Original call + 3 retries = 4 total calls
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(4);
      });

      it('should stop retrying after successful call', async () => {
        const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
        mockAxiosInstance.post
          .mockRejectedValueOnce(timeoutError)
          .mockResolvedValueOnce({ data: mockResponse });

        const player = await createAzureFunctionPlayer();
        const promise = player.takeTurn(mockPlayerTurn);

        await vi.advanceTimersByTimeAsync(1000);
        const result = await promise;

        expect(result).toEqual(mockResponse);
        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Error Handling Tests', () => {
    beforeEach(() => {
      process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net';
    });

    describe('User-friendly error messages', () => {
      it('should provide user-friendly message for timeout errors', async () => {
        const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
        mockAxiosInstance.post.mockRejectedValue(timeoutError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          'Azure Function request timed out. The service may be slow or unavailable.',
        );
      });

      it('should provide user-friendly message for 404 errors', async () => {
        const notFoundError = new AxiosError('not found');
        notFoundError.response = { status: 404 } as AxiosError['response'];
        mockAxiosInstance.post.mockRejectedValue(notFoundError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          'Azure Function service is not available. The backend may not be deployed or the endpoint is incorrect.',
        );
      });

      it('should provide user-friendly message for connection refused errors', async () => {
        const connRefusedError = new AxiosError('connection refused', 'ECONNREFUSED');
        mockAxiosInstance.post.mockRejectedValue(connRefusedError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          'Cannot connect to Azure Function service. Please check your network connection and try again.',
        );
      });

      it('should provide user-friendly message for DNS lookup errors', async () => {
        const dnsError = new AxiosError('DNS lookup failed', 'ENOTFOUND');
        mockAxiosInstance.post.mockRejectedValue(dnsError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          'Cannot connect to Azure Function service. Please check your network connection and try again.',
        );
      });

      it('should provide generic error message for other network errors', async () => {
        const genericError = new AxiosError('some other error', 'OTHER_CODE');
        mockAxiosInstance.post.mockRejectedValue(genericError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          'Azure Function service is currently unavailable: some other error',
        );
      });
    });

    describe('Error context preservation', () => {
      it('should preserve original error context in user-friendly errors', async () => {
        const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
        mockAxiosInstance.post.mockRejectedValue(timeoutError);

        const player = await createAzureFunctionPlayer();

        try {
          await player.takeTurn(mockPlayerTurn);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as AxiosError).isAxiosError).toBe(true);
        }
      });

      it('should detect and handle AxiosError correctly', async () => {
        const axiosError = new AxiosError('axios error');
        mockAxiosInstance.post.mockRejectedValue(axiosError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          'Azure Function service is currently unavailable: axios error',
        );

        expect(mockAxios.isAxiosError).toHaveBeenCalledWith(axiosError);
      });

      it('should pass through non-AxiosError errors unchanged', async () => {
        const genericError = new Error('generic error');
        mockAxiosInstance.post.mockRejectedValue(genericError);

        mockAxios.isAxiosError.mockReturnValue(false);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow('generic error');
      });
    });

    describe('Error message formatting', () => {
      it('should include original error message in generic network errors', async () => {
        const originalMessage = 'detailed error information';
        const networkError = new AxiosError(originalMessage, 'UNKNOWN_CODE');
        mockAxiosInstance.post.mockRejectedValue(networkError);

        const player = await createAzureFunctionPlayer();

        await expect(player.takeTurn(mockPlayerTurn)).rejects.toThrow(
          `Azure Function service is currently unavailable: ${originalMessage}`,
        );
      });
    });
  });

  describe('Edge Cases and Robustness', () => {
    beforeEach(() => {
      process.env.REACT_APP_AZURE_FUNCTION_BASE_URL = 'https://example.azurewebsites.net';
    });

    it('should handle successful response after network recovery', async () => {
      const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
      mockAxiosInstance.post
        .mockRejectedValueOnce(timeoutError)
        .mockRejectedValueOnce(timeoutError)
        .mockResolvedValueOnce({ data: mockResponse });

      vi.useFakeTimers();

      const player = await createAzureFunctionPlayer();
      const promise = player.takeTurn(mockPlayerTurn);

      await vi.advanceTimersByTimeAsync(1000); // First retry
      await vi.advanceTimersByTimeAsync(2000); // Second retry

      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(3);

      vi.useRealTimers();
    });

    it('should handle mixed error types during retries', async () => {
      const timeoutError = new AxiosError('timeout', 'ECONNABORTED');
      const serverError = new AxiosError('server error');
      serverError.response = { status: 500 } as AxiosError['response'];

      mockAxiosInstance.post
        .mockRejectedValueOnce(timeoutError)
        .mockRejectedValueOnce(serverError)
        .mockResolvedValueOnce({ data: mockResponse });

      vi.useFakeTimers();

      const player = await createAzureFunctionPlayer();
      const promise = player.takeTurn(mockPlayerTurn);

      await vi.advanceTimersByTimeAsync(1000); // First retry
      await vi.advanceTimersByTimeAsync(2000); // Second retry

      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(3);

      vi.useRealTimers();
    });

    it('should handle readonly PlayerTurn parameter correctly', async () => {
      const readonlyPlayerTurn: Readonly<PlayerTurn> = Object.freeze({
        cellOwner: CellOwner.O,
        gameView: Object.freeze({
          board: Object.freeze({
            dimensions: Object.freeze({ width: 3, height: 3 }),
            cells: Object.freeze([
              CellOwner.X,
              CellOwner.None,
              CellOwner.None,
              CellOwner.None,
              CellOwner.None,
              CellOwner.None,
              CellOwner.None,
              CellOwner.None,
              CellOwner.None,
            ]),
          }),
          consecutive: [],
          points: {
            X: 0,
            O: 0,
          },
        }),
      });

      mockAxiosInstance.post.mockResolvedValue({ data: mockResponse });

      const player = await createAzureFunctionPlayer();
      const result = await player.takeTurn(readonlyPlayerTurn);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/takeTurn', readonlyPlayerTurn);
    });

    it('should preserve response data structure', async () => {
      const complexResponse: AttackGameAction = {
        affectedCellsAt: [1, 3, 5],
      };

      mockAxiosInstance.post.mockResolvedValue({ data: complexResponse });

      const player = await createAzureFunctionPlayer();
      const result = await player.takeTurn(mockPlayerTurn);

      expect(result).toEqual(complexResponse);
      expect(result.affectedCellsAt).toEqual([1, 3, 5]);
    });
  });
});
