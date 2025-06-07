import React, { useState, useEffect } from 'react';

// Square component for individual cells in the Tic Tac Toe board
function Square({ value, onClick, isWinningSquare }) {
  // Determine the styling based on whether it's a winning square
  const squareClasses = `
    w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32
    flex items-center justify-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl
    font-inter font-bold
    bg-white hover:bg-gray-100 transition-colors duration-200
    border-2 border-gray-300 rounded-lg
    cursor-pointer
    ${isWinningSquare ? 'bg-green-300 text-green-800' : 'text-gray-800'}
  `;
  return (
    <button className={squareClasses} onClick={onClick}>
      {value}
    </button>
  );
}

// Board component to render the 3x3 grid of squares
function Board({ squares, onClick, winningLine }) {
  // Function to render a single square
  const renderSquare = (i) => {
    // Check if the current square index is part of the winning line
    const isWinningSquare = winningLine && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  // Render the 3x3 board
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 p-4 bg-gray-100 rounded-xl shadow-lg">
      {/* Row 1 */}
      {Array(3).fill(null).map((_, i) => renderSquare(i))}
      {/* Row 2 */}
      {Array(3).fill(null).map((_, i) => renderSquare(i + 3))}
      {/* Row 3 */}
      {Array(3).fill(null).map((_, i) => renderSquare(i + 6))}
    </div>
  );
}

// Main Game component
export default function App() {
  // State to manage game history (array of board states)
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  // State to track the current step in history (for time travel)
  const [currentStep, setCurrentStep] = useState(0);
  // State to determine whose turn it is (X or O)
  const [xIsNext, setXIsNext] = useState(true);

  // Get the current board state from history
  const current = history[currentStep];
  // Calculate the winner and the winning line based on the current board
  const { winner, line: winningLine } = calculateWinner(current.squares);

  // Handle a click on a square
  const handleClick = (i) => {
    // Slice history up to the current step to discard future moves if going back in time
    const newHistory = history.slice(0, currentStep + 1);
    const currentSquares = [...current.squares];

    // If there's a winner or the square is already filled, do nothing
    if (winner || currentSquares[i]) {
      return;
    }

    // Update the square with 'X' or 'O'
    currentSquares[i] = xIsNext ? 'X' : 'O';

    // Update history, current step, and switch player
    setHistory([...newHistory, { squares: currentSquares }]);
    setCurrentStep(newHistory.length);
    setXIsNext(!xIsNext);
  };

  // Function to jump to a specific step in game history
  const jumpTo = (step) => {
    setCurrentStep(step);
    setXIsNext(step % 2 === 0); // X is always first move (even steps)
  };

  // Determine the game status message
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  // Generate the list of moves for time travel
  const moves = history.map((step, move) => {
    const description = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move} className="mb-2">
        <button
          onClick={() => jumpTo(move)}
          className={`
            w-full px-4 py-2 text-sm sm:text-base rounded-md transition-colors duration-200
            ${move === currentStep ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-200 text-blue-800 hover:bg-blue-300'}
          `}
        >
          {description}
        </button>
      </li>
    );
  });

  // Function to calculate the winner
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2], // Rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // Columns
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // Diagonals
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] }; // Return winner and winning line
      }
    }
    // Check for a draw
    if (squares.every(square => square !== null)) {
      return { winner: 'Draw', line: null };
    }
    return { winner: null, line: null };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-4xl w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start justify-center">
        {/* Game Board Section */}
        <div className="flex flex-col items-center flex-grow">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 font-inter text-center">
            Tic Tac Toe
          </h1>
          <div className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-6 font-inter">
            {status}
          </div>
          <Board
            squares={current.squares}
            onClick={handleClick}
            winningLine={winningLine}
          />
        </div>

        {/* Game Info Section */}
        <div className="w-full lg:w-auto lg:min-w-[200px] flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 font-inter text-center lg:text-left">
            Game History
          </h2>
          <ol className="list-none p-0 m-0 space-y-2 max-h-64 lg:max-h-[unset] overflow-y-auto lg:overflow-visible pr-2 lg:pr-0">
            {moves}
          </ol>
        </div>
      </div>
    </div>
  );
}
