# Tic-Tac-Toe Client

## Project Overview

A sophisticated React-TypeScript tic-tac-toe game featuring multiple AI opponents, including Deep
Q-Network (DQN) and Menace Matchboxes Engine implementations. The project demonstrates advanced
software architecture patterns with a clean separation between game logic, AI agents, and UI
components.

## Software Architecture

### Core Architecture Pattern

The application follows a **Model-View-Controller** pattern with **Redux-style state management**
using React's `useReducer`:

- **Model**: Domain objects in `meta-model/` (Board, CellOwner, GameView, Player, etc.)
- **View**: React components in `app/` with modular SCSS styling
- **Controller**: Game mechanics in `mechanics/` and state management via reducers

### Key Architectural Parts

#### 1. State Management (`app/game-state/`, `app/game-configuration/`)

- **GameState**: Manages current game view, action tokens, winners, and win counts
- **GameConfiguration**: Handles player types and auto-game settings
- **Reducer Pattern**: Pure functions for state transitions with typed actions
- **Action Dispatch**: Centralized state updates via strongly-typed action system

#### 2. Game Engine (`mechanics/`)

- **GameDirector**: Orchestrates game flow, turn management, and lifecycle events
- **GameRules**: Implements win/draw logic and point counting systems
- **Actions**: Board modification functions for game moves
- **Consecutiveness**: Detects winning patterns (rows, columns, diagonals)
- **BoardNormalization**: Transforms board states for AI processing

#### 3. AI Player System (`computer-players/`)

**Polymorphic Player Interface**: All AI implementations conform to the `Player` interface:

```typescript
interface Player {
  takeTurn(playerTurn: PlayerTurn): Promise<AttackGameAction>;

  onGameStart?(cellOwner: SpecificCellOwner, gameView: GameView): Promise<void>;

  onGameEnd?(cellOwner: SpecificCellOwner, endState: GameEndState): Promise<void>;
}
```

**AI Implementations**:

- **DQNPlayer**: Deep Q-Network using `reinforce-js` library with experience replay
- **MenacePlayer**: Matchbox Educable Noughts and Crosses Engine with epsilon-greedy strategy
- **MockPlayer**: Random move generator for testing
- **AzureFunctionPlayer**: Remote AI via HTTP API calls with robust error handling
- **Human Player**: Interactive player with UI callbacks

#### 4. UI Components (`app/`)

- **Component-per-Feature**: Each UI element has its own directory with TypeScript, tests, and SCSS
- **Bootstrap Integration**: Uses React Bootstrap for responsive layout
- **SCSS Modules**: Scoped styling to prevent CSS conflicts
- **Image System**: SVG-based rendering for X/O marks and strike-through lines

## Features

### Game Mechanics

- **3x3 Board**: Traditional tic-tac-toe with configurable dimensions
- **Turn-Based Play**: Alternating moves between X and O players
- **Win Detection**: Automatic detection of rows, columns, and diagonals
- **Draw Handling**: Stalemate detection when board fills without winner
- **Move Validation**: Prevents invalid moves on occupied cells

### AI Opponents

#### Deep Q-Network (DQN) AI

- **Reinforcement Learning**: Learns optimal strategies through self-play
- **Experience Replay**: Stores and replays past games for training
- **Epsilon-Greedy Policy**: Balances exploration vs exploitation
- **Persistent Brain**: Saves/loads neural network weights via localStorage
- **Performance Tracking**: Maintains win/loss/draw statistics

#### Menace AI (Machine Educable Noughts and Crosses Engine)

- **Matchbox Learning**: Inspired by Donald Michie's 1960s concept
- **Bead-Based Strategy**: Uses colored beads to represent move preferences
- **Adaptive Learning**: Adjusts strategy based on game outcomes
- **State Normalization**: Handles board symmetries and rotations
- **Pretrained Networks**: Ships with pre-trained decision trees

#### Azure Function AI (Remote Network AI)

- **HTTP API Integration**: Communicates with external Azure Function endpoints
- **Robust Error Handling**: User-friendly messages for network failures
- **Exponential Backoff Retry**: Smart retry mechanism for transient network issues
- **Timeout Protection**: 30-second timeout prevents hanging requests
- **Conditional Configuration**: Only available when properly configured
- **Graceful Degradation**: Game continues functioning when remote AI is unavailable

### User Experience

- **Player Configuration**: Choose human or AI for X/O positions
- **Auto-Game Mode**: Continuous AI vs AI gameplay for training
- **Visual Feedback**: Animated strike-through for winning combinations
- **Responsive Design**: Bootstrap-based layout for mobile/desktop
- **Real-time Updates**: Live game state updates during play

## Development Stack

### Core Technologies

- **React 18.3.1**: Modern React with hooks and strict mode
- **TypeScript 4.9.5**: Strong typing for enhanced developer experience
- **SCSS/Bootstrap**: Responsive styling with component-scoped CSS
- **Create React App**: Zero-config build toolchain

### AI/ML Libraries

- **reinforce-js 1.5.1**: Deep Q-Network implementation
- **recurrent-js 1.7.4**: Recurrent neural network utilities
- **axios 1.7.7**: HTTP client for remote AI services

### Development Tools

- **ESLint**: Code quality with Airbnb style guide
- **Prettier**: Consistent code formatting
- **Stylelint**: SCSS linting and standards
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities

## Testing Strategy

### Test Coverage

- **Component Tests**: Every React component has corresponding `.test.tsx` files
- **Render Tests**: Basic smoke tests ensuring components render without crashing
- **Jest Configuration**: Configured with React Testing Library and custom matchers
- **Test Commands**:
  - `npm test` - Run test suite in watch mode
  - `npm run lint:eslint` - ESLint code quality checks
  - `npm run lint:tsc` - TypeScript compiler checks
  - `npm run lint:stylelint` - SCSS style validation

### Build Process

- **Development**: `npm start` - Hot reload development server
- **Production**: `npm run build` - Optimized production build
- **Quality Gates**: All linting must pass before deployment

## File Structure

```
src/
├── app/                          # React components
│   ├── App.tsx                   # Main application component
│   ├── cell-view/                # Individual game cell
│   ├── game-configuration/       # Player selection & settings
│   ├── game-state/              # Game state management
│   ├── game-state-view/         # Game status display
│   ├── game-view/               # Main board component
│   ├── header/                  # Application header
│   └── winner-view/             # Win/draw display
├── computer-players/            # AI implementations
│   ├── ai-agent/                # Base AI interfaces
│   ├── menace-match-boxes/      # Menace AI system
│   ├── reinforcement-learning/  # DQN AI system
│   └── *.ts                     # Player factories
├── mechanics/                   # Game logic
│   ├── Actions.ts               # Board modifications
│   ├── GameDirector.ts          # Game orchestration
│   ├── GameRules.ts             # Win/draw logic
│   └── *.ts                     # Utility functions
├── meta-model/                  # Domain objects
└── scss/                       # Global styles
```

## Key Development Commands

```bash
# Development
npm start                 # Start development server (localhost:3000)
npm test                  # Run test suite
npm run build            # Create production build

# Code Quality
npm run lint:eslint      # Run ESLint checks
npm run lint:tsc         # Run TypeScript compiler checks  
npm run lint:stylelint   # Run SCSS linting
```

## Architecture Highlights

1. **Separation of Concerns**: Clear boundaries between UI, game logic, and AI systems
2. **Type Safety**: Comprehensive TypeScript coverage with strict compiler settings
3. **Testability**: Modular design enables focused unit testing
4. **Extensibility**: Plugin-style AI system allows easy addition of new opponents
5. **Performance**: Lazy loading and memoization for optimal rendering
6. **Error Resilience**: Robust error handling with user-friendly messages and graceful degradation
7. **Network Reliability**: Exponential backoff retry mechanisms for external service integration
8. **Maintainability**: Consistent patterns and comprehensive documentation

## Error Handling Patterns

The project implements comprehensive error handling strategies, particularly for network operations and external service integration:

### Network Error Handling

**AzureFunctionPlayer Error Strategy:**
- **User-Friendly Messages**: Converts technical network errors into clear user messaging
- **Selective Retry Logic**: Only retries on retryable errors (timeouts, server errors, connection failures)
- **Exponential Backoff**: Implements `delay = baseDelay × 2^attempt` for retry delays
- **Maximum Retry Limits**: Prevents infinite retry loops with configurable retry counts
- **Timeout Protection**: 30-second timeouts prevent hanging requests

### Error Classification System

**Retryable Errors:**
- `ECONNABORTED` - Network timeouts
- `ECONNREFUSED` - Connection refused
- `ENOTFOUND` - DNS lookup failures  
- HTTP 500, 502, 503, 504 - Server errors

**Non-Retryable Errors:**
- HTTP 404 - Service not found
- HTTP 400-499 - Client errors (except server errors above)

### Configuration-Based Error Handling

**Conditional Feature Availability:**
- Azure Function player only appears when `REACT_APP_AZURE_FUNCTION_BASE_URL` is configured
- Graceful degradation when external services are unavailable
- Environment-based feature flags for optional integrations

### Error Message Patterns

```typescript
// User-friendly error transformation
const createNetworkError = (originalError: AxiosError): Error => {
  // Transform technical errors into user-readable messages
  // while preserving original error context for debugging
};
```

**Error Message Examples:**
- Timeout: "Azure Function request timed out. The service may be slow or unavailable."
- 404: "Azure Function service is not available. The backend may not be deployed."
- Connection: "Cannot connect to Azure Function service. Please check your network."

This comprehensive error handling approach ensures the application remains stable and user-friendly even when external dependencies fail.

## Project Excellence

This project serves as an excellent example of modern React application architecture with
sophisticated AI integration and clean code principles.
