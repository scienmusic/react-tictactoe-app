import "./App.css";
import Board from "./component/Board";
import React, { useState } from "react";

// app 컴포넌트 자체에서, 이력 컴포넌트를 생성하고, 여기의 데이터를 board.js에 트랜잭션한다.
function App() {
  // 이력 배열을 설정한다.
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
    },
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const current = history[stepNumber];

  const winnerSelection = (squares) => {
    const solution = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];

    for (let j = 0; j < solution.length; j++) {
      let [a, b, c] = solution[j];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[b] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = winnerSelection(current.squares);
  let status = `Next player : ${xIsNext ? "O" : "X"}`;
  if (winner != null) {
    status = `${winner} is Win`;
  }

  const handleClick = React.useCallback((i) => {
    const newHistory = history.slice(0, stepNumber + 1)
    const newSquares = current.squares.slice();

    if (newSquares[i] != null || winner != null) {
      return;
    }

    newSquares[i] = xIsNext ? "O" : "X";
    setHistory([...newHistory, { squares: newSquares }]);
    setXIsNext(prev => !prev);
    setStepNumber(history.length)
  }, [history, current, xIsNext, stepNumber, winner]);

  // move 인덱스 부터 slice를 해서 current를 바꿔주고 이동
  const jumpTo = React.useCallback((move) => {
    setHistory(history.slice(0, move + 1))
    setStepNumber(move);
    setXIsNext(move % 2 === 0);
  }, [history]);

  //이력 컴포넌트를 리턴하는 함수
  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game Start";
    return (
      <li key={move}>
        <button className="move-button" onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">      
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <ol style={{listStyle : 'none'}}>{moves}</ol>
      </div>
    </div>
  );
}

export default App;
