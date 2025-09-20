# tic-tac-toe-client

A React Tic Tac Toe game where you can battle against different AI opponents or watch them duke it out against each other.

## What's This About?

Ever wondered if you could beat a neural network at tic-tac-toe? Now you can find out! This game features several AI players:

- **DQN Player** — A Deep Q-Network that learns through reinforcement learning, using [mvrahden's reinforce-js](https://github.com/mvrahden/reinforce-js).
- **Menace Player** — The classic "matchbox" AI based on Donald Michie's 1960s concept, implementation inspired by [andrewmccarthy's Python version](https://github.com/andrewmccarthy/menace).
- **Azure AI** — Remote AI player (when configured)
- **Mock Player** — Random moves for testing

You can play as human vs. AI or even set up AI vs. AI to see which AI reigns supreme.

## Quick Start

1. Clone the repository: `git clone https://github.com/yourusername/tic-tac-toe-client.git`
2. Navigate into the project directory: `cd tic-tac-toe-client`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`
5. Open your browser and go to [http://localhost:5173](http://localhost:5173) to start playing.

## How to Play

1. Choose your player types (Human or pick an AI)
2. Click on the board to make moves when it is your turn
3. Watch the AIs think and make their moves
4. Enable "Auto Game" to watch AI vs. AI battles

That's it! Have fun and see if you can outsmart the machines. 🤖

## Tech Stack

Built with React 19, TypeScript, Vite, and TailwindCSS. 

## Credits

DQN player uses mvrahden's reinforce-js library.

Menace Matchboxes Engine based on andrewmccarthy's Python version.

## License

This project is licensed under the MIT License — see the LICENSE file for details.
