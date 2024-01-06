import { useState } from "react";

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function SquareRed({ value, onSquareClick }) {
  return <button className="square-highlight" onClick={onSquareClick}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay, currentMove}) {
  const winner = calculateWinner(squares); //this now returns winning line
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else if (currentMove === 9) {
    status = "Draw";
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  };


  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    };
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="board-row" key={i}>{
          Array.from({ length: 3 }).map((_, j) => {
            return Array.isArray(winner) && winner.includes(j + i * 3) ?
              (<SquareRed
                key={j + i * 3}
                value={squares[j + i * 3]}
                onSquareClick={() => handleClick(j + i * 3)}
              />)
              :
              (<Square
                key={j + i * 3}
                value={squares[j + i * 3]}
                onSquareClick={() => handleClick(j + i * 3)}
              />);
          })
        }
        </div>
      ))}
    </>
  );

}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [movesSortAscend, setMovesSortAscend] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = "You are at move #" + move;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  function handleAscendClick() {
    setMovesSortAscend(!movesSortAscend);
  }

  const displayedMoves = movesSortAscend ? [...moves] : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <button onClick={handleAscendClick}>{movesSortAscend ? "Switch: Descending order" : "Switch: Ascending order"}</button>
        <ol>{displayedMoves}</ol>
      </div>
    </div>
  )
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i]; //return winning line
      // return squares[a]; //return squares
    }
  }
  return null;
}