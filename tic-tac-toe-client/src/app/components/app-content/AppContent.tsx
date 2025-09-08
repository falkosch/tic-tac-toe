import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import React, { FC, JSX } from 'react';

import { SpecificCellOwner } from '../../../meta-model/CellOwner';
import { AIErrorBoundary } from '../error-boundary/ErrorBoundary';
import { GameStateView } from '../game-state-view/GameStateView';
import { Header } from '../header/Header';
import { GameStateActionType } from '../../game-state/GameStateReducer';
import { PlayerType } from '../../game-configuration/GameConfiguration';
import { useGameConfiguration, useGameState } from '../../context/GameContext';
import { useGameController } from '../../hooks/useGameController';
import { usePlayerRegistry } from '../../hooks/usePlayerRegistry';

import styles from './AppContent.module.scss';

export const AppContent: FC = () => {
  const { gameState } = useGameState();
  const { configuration } = useGameConfiguration();
  const { dispatch: dispatchGameState } = useGameState();

  const { playerCreators, isLoading, error } = usePlayerRegistry((actionToken) => {
    dispatchGameState({
      type: GameStateActionType.SetActionToken,
      payload: { actionToken },
    });
  });

  const { createNewGame, canCreateNewGame, toggleAutoNewGame, changePlayerType } =
    useGameController(playerCreators);

  // Check if Azure Function is available
  const isAzureFunctionConfigured = (): boolean => {
    const baseURL = process.env.REACT_APP_AZURE_FUNCTION_BASE_URL;
    return !!baseURL && baseURL.trim() !== '';
  };

  const createDropdownViewForCellOwner = (cellOwner: SpecificCellOwner): JSX.Element => {
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
  };

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
