import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onRetry }) => (
  <div className="mx-auto mt-4 max-w-4xl p-4">
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h2 className="mb-4 text-xl font-semibold text-red-800">Oops! Something went wrong</h2>
      <p className="mb-4 text-red-700">
        The game encountered an unexpected error. This might be due to an issue with AI players or
        game logic.
      </p>
      {error && (
        <details className="mt-3">
          <summary className="cursor-pointer text-red-700 hover:text-red-900">
            Error Details
          </summary>
          <pre className="mt-2 overflow-auto rounded border bg-red-100 p-3 text-sm whitespace-pre-wrap">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      <hr className="my-4 border-red-200" />
      <div className="flex gap-3">
        <button
          className="rounded-md border border-red-300 bg-white px-4 py-2 text-red-600 hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          onClick={onRetry}
        >
          Try Again
        </button>
        <button
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-600 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GameErrorBoundary caught an error:', error, errorInfo);
    const { onError } = this.props;
    if (onError) {
      onError(error, errorInfo);
    }
  }

  private retry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback && error) {
        return fallback(error, this.retry);
      }

      return <DefaultErrorFallback error={error} onRetry={this.retry} />;
    }

    return children;
  }
}

const AIErrorFallback: React.FC<{ retry: () => void }> = ({ retry }) => (
  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
    <h3 className="mb-2 text-lg font-semibold text-yellow-800">AI Player Error</h3>
    <p className="mb-4 text-yellow-700">
      The AI player encountered an error. You can try again or switch to a different AI player.
    </p>
    <button
      className="rounded-md border border-yellow-300 bg-white px-4 py-2 text-yellow-600 hover:bg-yellow-50 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
      onClick={retry}
    >
      Retry AI Move
    </button>
  </div>
);

interface AIErrorBoundaryProps {
  children: ReactNode;
  onAIError?: (error: Error) => void;
}

export const AIErrorBoundary: React.FC<AIErrorBoundaryProps> = ({
  children,
  onAIError = undefined,
}) => {
  const handleError = React.useCallback(
    (error: Error) => {
      if (onAIError) {
        onAIError(error);
      }
    },
    [onAIError],
  );

  const fallbackComponent = React.useCallback(
    (_error: Error, retry: () => void) => <AIErrorFallback retry={retry} />,
    [],
  );

  return (
    <GameErrorBoundary onError={handleError} fallback={fallbackComponent}>
      {children}
    </GameErrorBoundary>
  );
};
