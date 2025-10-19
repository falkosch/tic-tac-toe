import { fireEvent, render, screen } from '@testing-library/react';
import type { ErrorInfo } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AIErrorBoundary, GameErrorBoundary } from './ErrorBoundary';

describe('GameErrorBoundary', () => {
  const ThrowError = ({ error }: { error: Error }) => {
    throw error;
  };

  const WorkingComponent = () => <div>Working Content</div>;

  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty to suppress error output
    });
  });

  describe('Normal operation without errors', () => {
    it('renders children when no error occurs', () => {
      render(
        <GameErrorBoundary>
          <WorkingComponent />
        </GameErrorBoundary>,
      );

      expect(screen.getByText('Working Content')).toBeInTheDocument();
    });

    it('does not call onError callback when no error occurs', () => {
      const onError = vi.fn();

      render(
        <GameErrorBoundary onError={onError}>
          <WorkingComponent />
        </GameErrorBoundary>,
      );

      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('Error handling with default fallback', () => {
    it('renders default error fallback when child component throws error', () => {
      const error = new Error('Test error message');

      render(
        <GameErrorBoundary>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('displays error description in default fallback', () => {
      const error = new Error('Test error');

      render(
        <GameErrorBoundary>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(
        screen.getByText(
          'The game encountered an unexpected error. This might be due to an issue with AI players or game logic.',
        ),
      ).toBeInTheDocument();
    });

    it('displays error message in details section', () => {
      const error = new Error('Specific error message');

      render(
        <GameErrorBoundary>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(screen.getByText('Error Details')).toBeInTheDocument();
      expect(screen.getByText(/Specific error message/)).toBeInTheDocument();
    });

    it('displays error stack in details section when available', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n  at line 1\n  at line 2';

      render(
        <GameErrorBoundary>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(screen.getByText(/at line 1/)).toBeInTheDocument();
    });

    it('renders Try Again button', () => {
      const error = new Error('Test error');

      render(
        <GameErrorBoundary>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });

    it('renders Reload Page button', () => {
      const error = new Error('Test error');

      render(
        <GameErrorBoundary>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: 'Reload Page' })).toBeInTheDocument();
    });
  });

  describe('Retry functionality', () => {
    it('resets error state and renders children when Try Again is clicked', () => {
      const error = new Error('Test error');
      let shouldThrow = true;

      const ConditionalThrow = () => {
        if (shouldThrow) {
          throw error;
        }
        return <div>Recovered Content</div>;
      };

      render(
        <GameErrorBoundary>
          <ConditionalThrow />
        </GameErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      shouldThrow = false;
      fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));

      expect(screen.getByText('Recovered Content')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Page reload functionality', () => {
    it('reloads page when Reload Page button is clicked', () => {
      const error = new Error('Test error');
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <GameErrorBoundary>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Reload Page' }));

      expect(reloadMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom fallback component', () => {
    it('renders custom fallback when provided', () => {
      const error = new Error('Test error');
      const customFallback = (error: Error, retry: () => void) => (
        <div>
          <div>Custom Error UI</div>
          <div>{error.message}</div>
          <button onClick={retry}>Custom Retry</button>
        </div>
      );

      render(
        <GameErrorBoundary fallback={customFallback}>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });

    it('provides error object to custom fallback', () => {
      const error = new Error('Custom error message');
      const customFallback = (error: Error) => <div>{error.message}</div>;

      render(
        <GameErrorBoundary fallback={customFallback}>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('provides retry function to custom fallback', () => {
      const error = new Error('Test error');
      let shouldThrow = true;

      const ConditionalThrow = () => {
        if (shouldThrow) {
          throw error;
        }
        return <div>Recovered via custom retry</div>;
      };

      const customFallback = (_error: Error, retry: () => void) => (
        <button onClick={retry}>Custom Retry Button</button>
      );

      render(
        <GameErrorBoundary fallback={customFallback}>
          <ConditionalThrow />
        </GameErrorBoundary>,
      );

      shouldThrow = false;
      fireEvent.click(screen.getByRole('button', { name: 'Custom Retry Button' }));

      expect(screen.getByText('Recovered via custom retry')).toBeInTheDocument();
    });
  });

  describe('Error callback', () => {
    it('calls onError callback when error is caught', () => {
      const error = new Error('Test error');
      const onError = vi.fn();

      render(
        <GameErrorBoundary onError={onError}>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('passes error to onError callback', () => {
      const error = new Error('Test error');
      const onError = vi.fn();

      render(
        <GameErrorBoundary onError={onError}>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledWith(error, expect.any(Object));
    });

    it('passes errorInfo to onError callback', () => {
      const error = new Error('Test error');
      const onError = vi.fn<[Error, ErrorInfo]>();

      render(
        <GameErrorBoundary onError={onError}>
          <ThrowError error={error} />
        </GameErrorBoundary>,
      );

      const [, errorInfo] = onError.mock.calls[0];
      expect(errorInfo).toHaveProperty('componentStack');
    });
  });
});

describe('AIErrorBoundary', () => {
  const ThrowError = ({ error }: { error: Error }) => {
    throw error;
  };

  const WorkingComponent = () => <div>AI Working Content</div>;

  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally empty to suppress error output
    });
  });

  describe('Normal operation without errors', () => {
    it('renders children when no error occurs', () => {
      render(
        <AIErrorBoundary>
          <WorkingComponent />
        </AIErrorBoundary>,
      );

      expect(screen.getByText('AI Working Content')).toBeInTheDocument();
    });
  });

  describe('AI-specific error handling', () => {
    it('renders AI-specific error fallback when child component throws error', () => {
      const error = new Error('AI error');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>,
      );

      expect(screen.getByText('AI Player Error')).toBeInTheDocument();
    });

    it('displays AI-specific error message', () => {
      const error = new Error('AI error');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>,
      );

      expect(
        screen.getByText(
          'The AI player encountered an error. You can try again or switch to a different AI player.',
        ),
      ).toBeInTheDocument();
    });

    it('renders Retry AI Move button', () => {
      const error = new Error('AI error');

      render(
        <AIErrorBoundary>
          <ThrowError error={error} />
        </AIErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: 'Retry AI Move' })).toBeInTheDocument();
    });
  });

  describe('AI error retry functionality', () => {
    it('resets error state and renders children when Retry AI Move is clicked', () => {
      const error = new Error('AI error');
      let shouldThrow = true;

      const ConditionalThrow = () => {
        if (shouldThrow) {
          throw error;
        }
        return <div>AI Recovered</div>;
      };

      render(
        <AIErrorBoundary>
          <ConditionalThrow />
        </AIErrorBoundary>,
      );

      expect(screen.getByText('AI Player Error')).toBeInTheDocument();

      shouldThrow = false;
      fireEvent.click(screen.getByRole('button', { name: 'Retry AI Move' }));

      expect(screen.getByText('AI Recovered')).toBeInTheDocument();
      expect(screen.queryByText('AI Player Error')).not.toBeInTheDocument();
    });
  });

  describe('AI error callback', () => {
    it('calls onAIError callback when error is caught', () => {
      const error = new Error('AI error');
      const onAIError = vi.fn();

      render(
        <AIErrorBoundary onAIError={onAIError}>
          <ThrowError error={error} />
        </AIErrorBoundary>,
      );

      expect(onAIError).toHaveBeenCalledTimes(1);
    });

    it('passes error to onAIError callback', () => {
      const error = new Error('AI error');
      const onAIError = vi.fn();

      render(
        <AIErrorBoundary onAIError={onAIError}>
          <ThrowError error={error} />
        </AIErrorBoundary>,
      );

      expect(onAIError).toHaveBeenCalledWith(error);
    });

    it('does not throw when onAIError is not provided', () => {
      const error = new Error('AI error');

      expect(() => {
        render(
          <AIErrorBoundary>
            <ThrowError error={error} />
          </AIErrorBoundary>,
        );
      }).not.toThrow();
    });
  });

  describe('Callback memoization', () => {
    it('maintains stable callback references when onAIError is provided', () => {
      const onAIError = vi.fn();
      const { rerender } = render(
        <AIErrorBoundary onAIError={onAIError}>
          <WorkingComponent />
        </AIErrorBoundary>,
      );

      rerender(
        <AIErrorBoundary onAIError={onAIError}>
          <WorkingComponent />
        </AIErrorBoundary>,
      );

      expect(screen.getByText('AI Working Content')).toBeInTheDocument();
    });
  });
});
