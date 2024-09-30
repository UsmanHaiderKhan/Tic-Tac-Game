import { useState } from "react";
import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combinations";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
}

const initialBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    0;
    currentPlayer = "O";
  }
  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  const gameBoard = initialBoard.map((row) => [...row]);
  for (const turn of gameTurns) {
    const { row, col } = turn.square;
    gameBoard[row][col] = turn.player;
  }
  return gameBoard;
}

function derivedWinner(gameBoard, players) {
  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    
    const aVal = gameBoard[combination[0].row][combination[0].column];
    const bVal = gameBoard[combination[1].row][combination[1].column];
    const cVal = gameBoard[combination[2].row][combination[2].column];
    if (aVal && aVal === bVal && aVal === cVal) {
      console.log(`${aVal} wins!`);
      winner = players[aVal];
    }
  }
  return winner;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = derivedWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  //const[activePlayer, setActivePlayer] = useState('X');
  const activePlayer = deriveActivePlayer(gameTurns);
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevGameTurns) => {
      const currentPlayer = deriveActivePlayer(prevGameTurns);
      const updateTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevGameTurns,
      ];
      return updateTurns;
    });
  }

function handleRestart() {
  setGameTurns([]);
}
function handlePlayerNameChange(symbol, newName) {
  setPlayers((prevPlayerName) => {
    return {
      ...prevPlayerName,
      [symbol]: newName,
    };
  });
}
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName = {handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName = {handlePlayerNameChange}
          />
        </ol>
        
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>  }
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
