// Set up game board
const boardSize = 10;
const mineCount = 10;
let gameBoard = [];
let mineLocations = [];

function createBoard() {
    for (let i = 0; i < boardSize; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < boardSize; j++) {
            gameBoard[i][j] = 0;
        }
    }
    placeMines();
    countAdjacentMines();
    renderBoard();
}

function placeMines() {
    while (mineLocations.length < mineCount) {
        let row = Math.floor(Math.random() * boardSize);
        let col = Math.floor(Math.random() * boardSize);
        if (gameBoard[row][col] !== 'mine') {
            gameBoard[row][col] = 'mine';
            mineLocations.push([row, col]);
        }
    }
}

function countAdjacentMines() {
    for (let i = 0; i < mineLocations.length; i++) {
        let row = mineLocations[i][0];
        let col = mineLocations[i][1];
        for (let j = row - 1; j <= row + 1; j++) {
            for (let k = col - 1; k <= col + 1; k++) {
                if (j >= 0 && j < boardSize && k >= 0 && k < boardSize && gameBoard[j][k] !== 'mine') {
                    gameBoard[j][k] += 1;
                }
            }
        }
    }
}

function renderBoard() {
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
}

function revealAdjacentCells(row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
          if (i >= 0 && i < boardSize && j >= 0 && j < boardSize) {
              const cell = document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`);
              if (!cell.classList.contains('clicked')) {
                  cell.classList.add('clicked');
                  cell.textContent = gameBoard[i][j];
                  if (gameBoard[i][j] === 0) {
                      revealAdjacentCells(i, j);
                  }
              }
          }
      }
  }
}

function checkWinCondition() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      if (gameBoard[row][col] !== 'mine' && !cell.classList.contains('clicked')) {
        return false;
      }
    }
  }
  return true;
}


function resetBoard() {
  // Clear game board and mine locations
  gameBoard = [];
  mineLocations = [];
  
  // Recreate game board
  createBoard();
}

// Add event listeners
document.addEventListener('DOMContentLoaded', createBoard);

document.getElementById('gameBoard').addEventListener('click', function(event) {
    if (event.target.classList.contains('cell')) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        if (gameBoard[row][col] === 'mine') {
            event.target.classList.add('mine');
            alert('Game over!');
            revealEmptyCells(row, col);
        } else {
            event.target.classList.add('clicked');
            event.target.textContent = gameBoard[row][col];
            if (gameBoard[row][col] === 0) {
                revealAdjacentCells(row, col);
            }
            if(checkWinCondition()){
                alert('You win!');
                revealEmptyCells(row, col);
            }
        }
    }
});