import React, { Component, ErrorInfo, ReactNode } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

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
  <Container className="mt-4">
    <Alert variant="danger">
      <Alert.Heading>Oops! Something went wrong</Alert.Heading>
      <p>
        The game encountered an unexpected error. This might be due to an issue with AI players or
        game logic.
      </p>
      {error && (
        <details className="mt-3">
          <summary style={{ cursor: 'pointer' }}>Error Details</summary>
          <pre className="mt-2" style={{ fontSize: '0.85em', whiteSpace: 'pre-wrap' }}>
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      <hr />
      <div className="d-flex gap-2">
        <Button variant="outline-danger" onClick={onRetry}>
          Try Again
        </Button>
        <Button variant="outline-secondary" onClick={() => window.location.reload()}>
          Reload Page
        </Button>
      </div>
    </Alert>
  </Container>
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
  <Alert variant="warning">
    <Alert.Heading>AI Player Error</Alert.Heading>
    <p>The AI player encountered an error. You can try again or switch to a different AI player.</p>
    <Button variant="outline-warning" onClick={retry}>
      Retry AI Move
    </Button>
  </Alert>
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
    (error: Error, retry: () => void) => <AIErrorFallback retry={retry} />,
    [],
  );

  return (
    <GameErrorBoundary onError={handleError} fallback={fallbackComponent}>
      {children}
    </GameErrorBoundary>
  );
};
