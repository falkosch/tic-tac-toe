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

  const createDropdownViewForCellOwner = useCallback(
    (cellOwner: SpecificCellOwner): JSX.Element => {
      const dropdownId = `d${cellOwner}`;
      return (
        <Col key={dropdownId} xs="12" sm="4" md="auto">
          <Dropdown className="mt-2 mt-md-0">
            <Dropdown.Toggle className="w-100" id={dropdownId} variant="secondary">
              {`Player ${cellOwner}`}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              {Object.keys(PlayerType).map((playerKey) => {
                const active = playerKey === configuration.playerTypes[cellOwner];
                const itemId = `d${cellOwner}${playerKey}`;
                return (
                  <Dropdown.Item
                    active={active}
                    key={itemId}
                    onClick={() => changePlayerType(cellOwner, playerKey as PlayerType)}
                  >
                    {playerKey}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      );
    },
    [configuration.playerTypes, changePlayerType],
  );

  if (isLoading) {
    return (
      <div
        className={`${styles.view} d-flex flex-column h-100 justify-content-center align-items-center`}
      >
        <div>Loading players...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${styles.view} d-flex flex-column h-100 justify-content-center align-items-center`}
      >
        <div className="text-danger">Error initializing players: {error.message}</div>
      </div>
    );
  }

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
