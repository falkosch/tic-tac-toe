import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import React, { FC, JSX, useCallback } from 'react';

import { GameProvider, useGameConfiguration, useGameState } from './context/GameContext';
import { useGameController } from './hooks/useGameController';
import { PlayerType } from './game-configuration/GameConfiguration';
import { SpecificCellOwner } from '../meta-model/CellOwner';
import { GameStateView } from './components/game-state-view/GameStateView';
import { Header } from './components/header/Header';
import { AIErrorBoundary, GameErrorBoundary } from './components/error-boundary/ErrorBoundary';

import styles from './App.module.scss';

const AppContent: FC = () => {
  const { gameState } = useGameState();
  const { configuration } = useGameConfiguration();

  const { createNewGame, canCreateNewGame, toggleAutoNewGame, changePlayerType } =
    useGameController(playerCreators);

  // Check if Azure Function is available
  const isAzureFunctionConfigured = (): boolean => {
    const baseURL = process.env.REACT_APP_AZURE_FUNCTION_BASE_URL;
    return !!baseURL && baseURL.trim() !== '';
  };

  const createDropdownViewForCellOwner = (cellOwner: SpecificCellOwner): JSX.Element => {
    const dropdownId = `d${cellOwner}`;
    const availablePlayers = Object.keys(players).filter((playerKey) => {
      // Filter out Azure Function player if not configured
      if (playerKey === PlayerType.Azure && !isAzureFunctionConfigured()) {
        return false;
      }
      return true;
    });

    return (
      <Col key={dropdownId} xs="12" sm="4" md="auto">
        <Dropdown className="mt-2 mt-md-0">
          <Dropdown.Toggle className="w-100" id={dropdownId} variant="secondary">
            {`Player ${cellOwner}`}
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            {availablePlayers.map((playerKey) => {
              const active = playerKey === configuration.playerTypes[cellOwner];
              const itemId = `d${cellOwner}${playerKey}`;
              return (
                <Dropdown.Item
                  active={active}
                  key={itemId}
                  onClick={() => changePlayerType(cellOwner, playerKey)}
                >
                  {playerKey}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    );
  };

  // Create players object, conditionally including Azure Function player
  players = {
    [PlayerType.Human]: createHumanPlayer,
    [PlayerType.Mock]: createMockPlayer,
    [PlayerType.DQN]: createDQNPlayer,
    [PlayerType.Menace]: createMenacePlayer,
    [PlayerType.Azure]: isAzureFunctionConfigured()
      ? createAzureFunctionPlayer
      : async () => {
          throw new Error(
            'Azure Function player is not configured. Please set REACT_APP_AZURE_FUNCTION_BASE_URL environment variable.'
          );
        },
  };

  return (
    <div className={`${styles.view} d-flex flex-column h-100`}>
      <Header>
        <Form>
          <Form.Group className="row">
            <Col xs="12" sm="4" md="auto">
              <Button
                className="mt-2 mt-md-0"
                disabled={!canCreateNewGame()}
                onClick={createNewGame}
              >
                New game
              </Button>
            </Col>
            {Object.keys(configuration.playerTypes).map((cellOwnerKey) =>
              createDropdownViewForCellOwner(cellOwnerKey as SpecificCellOwner),
            )}
            <Col xs="12" md="auto">
              <div className="d-flex flex-row h-100 pt-2 pt-md-0">
                <Form.Check id="autoNewGame" inline checked={configuration.autoNewGame}>
                  <Form.Check.Input onChange={toggleAutoNewGame} />
                  <Form.Check.Label>Auto new game</Form.Check.Label>
                </Form.Check>
              </div>
            </Col>
          </Form.Group>
        </Form>
      </Header>
      <AIErrorBoundary>
        <GameStateView gameState={gameState} />
      </AIErrorBoundary>
    </div>
  );
};

export const App: FC = () => (
  <GameErrorBoundary>
    <GameProvider>
      <AppContent />
    </GameProvider>
  </GameErrorBoundary>
);
