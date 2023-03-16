// Game of TicTacToe
const ticTacToe = (() => {
  const availableMoves = [];
  let gameBoard = [];
  let isOver = false;
  let aiSymbol;
  let humanSymbol;
  let difficulty;

  // Calculate if all three elements are equal
  const equal = (a, b, c) => (a === b && b === c);

  // Check if game has ended and returns game outcome
  const hasEnded = () => {
    let winner = null;
    let emptyBoxes = 0;

    // Check horizontal for win
    for (let i = 0; i < gameBoard.length; i += 1) {
      if (gameBoard[i][0] !== 0 && equal(gameBoard[i][0], gameBoard[i][1], gameBoard[i][2])) {
        // console.log("horizontal");
        if (gameBoard[i][0] === 1) {
          winner = "x";
        } else {
          winner = "o";
        }
      }
    }
    // Check vertical for win
    for (let i = 0; i < gameBoard[0].length; i += 1) {
      if (gameBoard[0][i] !== 0 && equal(gameBoard[0][i], gameBoard[1][i], gameBoard[2][i])) {
        // console.log("vertical");
        if (gameBoard[0][i] === 1) {
          winner = "x";
        } else {
          winner = "o";
        }
      }
    }

    // Check diagonal left top to right bottom
    if (gameBoard[0][0] !== 0 && equal(gameBoard[0][0], gameBoard[1][1], gameBoard[2][2])) {
      // console.log("diagonal");
      if (gameBoard[0][0] === 1) {
        winner = "x";
      } else {
        winner = "o";
      }
    }

    // Check diagonal left bottom to right top
    if (gameBoard[0][2] !== 0 && equal(gameBoard[0][2], gameBoard[1][1], gameBoard[2][0])) {
      // console.log("diagonal");
      if (gameBoard[0][2] === 1) {
        winner = "x";
      } else {
        winner = "o";
      }
    }

    // count the number of empty boxes
    for (let i = 0; i < gameBoard.length; i += 1) {
      for (let j = 0; j < gameBoard[0].length; j += 1) {
        if (gameBoard[i][j] === 0) {
          emptyBoxes += 1;
        }
      }
    }

    // if no winner and all boxes filled then game is draw
    if (winner === null && emptyBoxes === 0) {
      return "draw";
    }
    return winner;
  };

  // Stop game if game has ended
  const declareEnd = () => {
    if (hasEnded() !== null) {
      isOver = true;
    }
  };

  // Remove a move from available moves (or boxes)
  const removeMove = (x, y) => {
    const address = `p${x}${y}`;
    for (let i = 0; i < availableMoves.length; i += 1) {
      if (availableMoves[i] === address) {
        availableMoves.splice(i, 1);
      }
    }
  };

  // Renders the x and o within the boxes
  const renderBox = (box, move, isAi) => {
    const currbox = box;
    if (move === "x") {
      if (isAi) {
        currbox.innerHTML = `
        <div class="flex-center-o" style="display: none">
          <div class="o"></div>
        </div>
        <div class="x" style="animation-delay: 0.3s"></div>
        `;
      } else {
        currbox.innerHTML = `
        <div class="flex-center-o" style="display: none">
          <div class="o"></div>
        </div>
        <div class="x"></div>
        `;
      }
    } else if (move === "o") {
      if (isAi) {
        currbox.innerHTML = `
      <div class="flex-center-o" style="animation-delay: 0.3s">
        <div class="o"></div>
      </div>
      <div class="x" style="display: none"></div>
      `;
      } else {
        currbox.innerHTML = `
      <div class="flex-center-o">
        <div class="o"></div>
      </div>
      <div class="x" style="display: none"></div>
      `;
      }
    }
  };

  // Renders the player's input moves
  const playerMove = (box, id) => {
    const inputBox = box;
    const inputId = id;
    const xPos = parseInt(inputId[1], 10);
    const yPos = parseInt(inputId[2], 10);

    if (humanSymbol === "x") {
      renderBox(inputBox, "x", false);
      gameBoard[xPos][yPos] = 1;
    } else {
      renderBox(inputBox, "o", false);
      gameBoard[xPos][yPos] = 2;
    }
    removeMove(xPos, yPos);
  };

  // AI - easy mode, Ai randomly picks moves
  const aiMoveEasy = () => {
    const min = 0;
    const max = availableMoves.length - 1;
    const randomVal = Math.floor(Math.random() * (max - min + 1)) + min;
    const currAddress = availableMoves[randomVal];
    const xPos = currAddress.charAt(1);
    const yPos = currAddress.charAt(2);
    const currBox = document.getElementById(currAddress);

    availableMoves.splice(randomVal, 1);

    if (humanSymbol === "x") {
      renderBox(currBox, "o", true);
      gameBoard[xPos][yPos] = 2;
    } else {
      renderBox(currBox, "x", true);
      gameBoard[xPos][yPos] = 1;
    }
  };

  // Minimax helper function
  const miniMax = (medium, depth, isMaximizing) => {
    // Medium mode allows Minimax algorithm to reach up to 2 depths and returns
    // a less impactful value
    if (medium && depth === 2) return 5;

    const winner = hasEnded();
    // Terminating case, return if minimax branch has reached an end
    if (winner !== null) {
      if (winner === "draw") {
        return 0;
      }
      if (winner === aiSymbol) {
        return 10 - depth;
      }
      return depth - 10;
    }

    // AI's maximizing turns
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          if (gameBoard[i][j] === 0) {
            if (aiSymbol === "x") {
              gameBoard[i][j] = 1;
            } else {
              gameBoard[i][j] = 2;
            }
            const score = miniMax(medium, depth + 1, false);
            gameBoard[i][j] = 0;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    }

    // Player's minimizing turn
    let bestScore = Infinity;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (gameBoard[i][j] === 0) {
          if (aiSymbol === "x") {
            gameBoard[i][j] = 2;
          } else {
            gameBoard[i][j] = 1;
          }
          const score = miniMax(medium, depth + 1, true);
          gameBoard[i][j] = 0;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  };

  // AI - hard mode, AI uses minimax to pick moves, unbeatable
  // AI - medium mode, AI uses minimax but only up to 2 depths
  const aiMoveHard = (medium) => {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (gameBoard[i][j] === 0) {
          if (aiSymbol === "x") {
            gameBoard[i][j] = 1;
          } else {
            gameBoard[i][j] = 2;
          }
          const score = miniMax(medium, 0, false);
          gameBoard[i][j] = 0;
          if (score > bestScore) {
            bestScore = score;
            bestMove = { i, j };
          }
        }
      }
    }
    const xPos = bestMove.i;
    const yPos = bestMove.j;

    if (aiSymbol === "x") {
      const currBox = document.getElementById(`p${xPos}${yPos}`);
      renderBox(currBox, "x", true);
      gameBoard[xPos][yPos] = 1;
    } else {
      const currBox = document.getElementById(`p${xPos}${yPos}`);
      renderBox(currBox, "o", true);
      gameBoard[xPos][yPos] = 2;
    }
  };

  const aiMove = () => {
    console.log(difficulty);

    if (difficulty === "Easy") {
      aiMoveEasy();
    } else if (difficulty === "Medium") {
      aiMoveHard(true);
    } else {
      aiMoveHard(false);
    }
  };

  // Run the game steps in order
  const gameRun = (box, id) => {
    // render player move
    playerMove(box, id);

    declareEnd();

    if (isOver === false) {
      aiMove(difficulty);
    }

    declareEnd();
  };

  // Returns isOver
  const getIsOver = () => isOver;

  // Setup and start new game
  const newGame = (iconChoice, selectedDifficulty) => {
    gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    isOver = false;
    availableMoves.length = 0;
    difficulty = selectedDifficulty;

    for (let i = 0; i < gameBoard.length; i += 1) {
      for (let j = 0; j < gameBoard[0].length; j += 1) {
        const address = `p${i}${j}`;
        availableMoves.push(address);
      }
    }

    if (iconChoice === "x") {
      aiSymbol = "o";
      humanSymbol = iconChoice;
    } else {
      aiSymbol = "x";
      humanSymbol = iconChoice;
      aiMoveEasy();
    }
  };

  return {
    newGame,
    hasEnded,
    gameRun,
    getIsOver,
  };
})();

const gameBoxes = document.querySelectorAll(".box");
const selectDif = document.querySelector(".select-dif");
const startDifficulty = selectDif.options[selectDif.selectedIndex].text;
console.log(startDifficulty);
ticTacToe.newGame("x", startDifficulty);

gameBoxes.forEach((gameBox) => {
  gameBox.addEventListener("click", () => {
    if (gameBox.childElementCount !== 0 || ticTacToe.getIsOver()) {
      return;
    }
    const currID = gameBox.getAttribute("id");
    ticTacToe.gameRun(gameBox, currID);
  });
});

selectDif.addEventListener("change", () => {
  const difficulty = selectDif.options[selectDif.selectedIndex].text;
  console.log(difficulty);
  ticTacToe.newGame("x", difficulty);
});
