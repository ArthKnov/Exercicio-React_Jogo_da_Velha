import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningLine([]);
  }

  useEffect(() => {
    const result = calculateWinner(squares);
    setWinner(result.winner);
    setWinningLine(result.winningLine);
  }, [squares]);

  let status;
  if (winner) {
    status = "Vencedor: " + winner;
  } else {
    status = "Proximo Jogador: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      {winner && <Confetti />}
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                  highlight={winningLine.includes(index)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={resetGame}>
        Reiniciar Jogo
      </button>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: line };
    }
  }
  return { winner: null, winningLine: [] };
}

export default function App() {
  return <Board />;
}
