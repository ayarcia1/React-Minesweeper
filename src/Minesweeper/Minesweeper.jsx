import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './Minesweeper.css';

const boardSize = 10;
const mineCount = 10;
let gameBoard = [];
let mineLocations = [];
let gameOver = 0;

const createBoard = () => {
  for (let i = 0; i < boardSize; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < boardSize; j++) {
      gameBoard[i][j] = 0;
    }
  }
  placeMines();
  countAdjacentMines();
  renderBoard();
};

const placeMines = () => {
  while (mineLocations.length < mineCount) {
    let row = Math.floor(Math.random() * boardSize);
    let col = Math.floor(Math.random() * boardSize);
    if (gameBoard[row][col] !== 'mine') {
      gameBoard[row][col] = 'mine';
      mineLocations.push([row, col]);
    }
  }
};

const countAdjacentMines = () => {
  for (let i = 0; i < mineLocations.length; i++) {
    let row = mineLocations[i][0];
    let col = mineLocations[i][1];
    for (let j = row - 1; j <= row + 1; j++) {
      for (let k = col - 1; k <= col + 1; k++) {
        if (
          j >= 0 &&
          j < boardSize &&
          k >= 0 &&
          k < boardSize &&
          gameBoard[j][k] !== 'mine'
        ) {
          gameBoard[j][k] += 1;
        }
      }
    }
  }
};

const renderBoard = () => {
  const gameBoardEl = document.getElementById('gameBoard');
  gameBoardEl.innerHTML = '';
  for (let i = 0; i < boardSize; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      row.appendChild(cell);
    }
    gameBoardEl.appendChild(row);
  }
};

const revealAdjacentCells = (row, col) => {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
        const cell = document.querySelector(
          `.cell[data-row="${i}"][data-col="${j}"]`
        );
        if (!cell.classList.contains('clicked')) {
          cell.classList.add('clicked');
          if (gameBoard[i][j] !== 0) {
            cell.textContent = gameBoard[i][j];
          }
          if (gameBoard[i][j] === 0) {
            revealAdjacentCells(i, j);
          }
        }
      }
    }
  }
};

const checkWinCondition = () => {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );
      if (
        gameBoard[row][col] !== 'mine' &&
        !cell.classList.contains('clicked')
      ) {
        return false;
      }
    }
  }
  return true;
};

const revealEmptyCells = () => {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
      );
      if (!cell.classList.contains('clicked')) {
        if (gameBoard[row][col] === 'mine') {
          cell.classList.add('clicked', 'mine');
          cell.textContent = 'X';
        } else {
          cell.classList.add('clicked');
          cell.textContent = gameBoard[row][col];
        }
      }
    }
  }
};

const Minesweeper = () => {
  useEffect(() => {
    createBoard();
  }, []);

  const resetBoard = () => {
    gameBoard = [];
    mineLocations = [];
    gameOver--;
    createBoard();
  };

  const handleClick = (event) => {
    if (event.target.classList.contains('cell') && gameOver === 0) {
      const row = parseInt(event.target.dataset.row);
      const col = parseInt(event.target.dataset.col);
      if (gameBoard[row][col] === 'mine') {
        event.target.classList.add('mine');
        alert('Game over!');
        revealEmptyCells();
        gameOver++;
      } else {
        event.target.classList.add('clicked');
        if (gameBoard[row][col] !== 0) {
        event.target.textContent = gameBoard[row][col];
        }
        if (gameBoard[row][col] === 0) {
          revealAdjacentCells(row, col);
        }
        if (checkWinCondition()) {
          alert('You win!');
          revealEmptyCells();
          gameOver++;
        }
      }
    }
  };

  return (
    <div>
      <h1>Minesweeper Game</h1>
      <hr></hr>
      <br></br>
      <div id="gameBoard" onClick={handleClick}></div>
      <br></br>
      <button onClick={resetBoard}>Reset</button>
    </div>
  );
};

ReactDOM.render(<Minesweeper />, document.getElementById('root'));