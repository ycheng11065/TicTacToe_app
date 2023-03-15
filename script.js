const ticTacToe = (() => {
  let gameBoard = [];
  const availableMoves = [];
  let isOver = false;
  let turn = 0;
  const gameMode = 2; // 1 is pvp

  let aiMove;
  let humanMove;

  const hasWon = () => {
    let winner = null;
    let emptyBoxes = 0;

    // Check horizontal
    for (let i = 0; i < gameBoard.length; i += 1) {
      if (gameBoard[i][0] !== 0 && gameBoard[i][0] === gameBoard[i][1]
        && gameBoard[i][1] === gameBoard[i][2]) {
        // console.log("horizontal");
        if (gameBoard[i][0] === 1) {
          winner = "x";
        } else {
          winner = "o";
        }
      }
    }
    // Check vertical
    for (let i = 0; i < gameBoard[0].length; i += 1) {
      if (gameBoard[0][i] !== 0 && gameBoard[0][i] === gameBoard[1][i]
        && gameBoard[1][i] === gameBoard[2][i]) {
        // console.log("vertical");
        if (gameBoard[0][i] === 1) {
          winner = "x";
        } else {
          winner = "o";
        }
      }
    }

    // Check diagonal
    if (gameBoard[0][0] !== 0 && gameBoard[0][0] === gameBoard[1][1]
      && gameBoard[1][1] === gameBoard[2][2]) {
      // console.log("diagonal");
      if (gameBoard[0][0] === 1) {
        winner = "x";
      } else {
        winner = "o";
      }
    }

    if (gameBoard[0][2] !== 0 && gameBoard[0][2] === gameBoard[1][1]
      && gameBoard[1][1] === gameBoard[2][0]) {
      // console.log("diagonal");
      if (gameBoard[0][2] === 1) {
        winner = "x";
      } else {
        winner = "o";
      }
    }

    // check if draw
    for (let i = 0; i < gameBoard.length; i += 1) {
      for (let j = 0; j < gameBoard[0].length; j += 1) {
        if (gameBoard[i][j] === 0) {
          emptyBoxes += 1;
        }
      }
    }

    if (winner === null && emptyBoxes === 0) {
      return "draw";
    }
    return winner;
  };

  const removeMove = (x, y) => {
    const address = `p${x}${y}`;
    for (let i = 0; i < availableMoves.length; i += 1) {
      if (availableMoves[i] === address) {
        availableMoves.splice(i, 1);
      }
    }
  };

  const playerMove = (box, id) => {
    const inputBox = box;
    const inputId = id;
    const xPos = parseInt(inputId[1], 10);
    const yPos = parseInt(inputId[2], 10);

    if (humanMove === "x") {
      inputBox.innerHTML = `
      <div class="flex-center-o" style="display: none">
        <div class="o"></div>
      </div>
      <div class="x"></div>
      `;
      gameBoard[xPos][yPos] = 1;
    } else {
      inputBox.innerHTML = `
      <div class="flex-center-o show">
        <div class="o"></div>
      </div>
      <div class="x" style="display: none"></div>
      `;
      gameBoard[xPos][yPos] = 2;
    }
    removeMove(xPos, yPos);
  };

  const aiMoveEasy = () => {
    const min = 0;
    const max = availableMoves.length - 1;
    const randomVal = Math.floor(Math.random() * (max - min + 1)) + min;
    const currAddress = availableMoves[randomVal];
    const xPos = currAddress.charAt(1);
    const yPos = currAddress.charAt(2);
    const currBox = document.getElementById(currAddress);

    availableMoves.splice(randomVal, 1);

    if (humanMove === "x") {
      currBox.innerHTML = `
          <div class="flex-center-o">
            <div class="o"></div>
          </div>
          <div class="x" style="display: none"></div>
        `;
      gameBoard[xPos][yPos] = 2;
    } else {
      currBox.innerHTML = `
        <div class="flex-center-o" style="display: none">
          <div class="o"></div>
        </div>
        <div class="x"></div>
        `;
      gameBoard[xPos][yPos] = 1;
    }
  };

  const miniMax = (board, depth, isMaximizing) => {
    const winner = hasWon();
    if (winner !== null) {
      // console.log(winner);
      if (aiMove === "x") {
        if (winner === "o") {
          return -10;
        }
        if (winner === "x") {
          return 10;
        }
        if (winner === "draw") {
          return 0;
        }
      } else {
        if (winner === "o") {
          return 10;
        }
        if (winner === "x") {
          return -10;
        }
        if (winner === "draw") {
          return 0;
        }
      }
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          if (gameBoard[i][j] === 0) {
            if (aiMove === "x") {
              gameBoard[i][j] = 1;
            } else {
              gameBoard[i][j] = 2;
            }
            const score = miniMax(board, depth + 1, false);
            gameBoard[i][j] = 0;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    }

    let bestScore = Infinity;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (gameBoard[i][j] === 0) {
          if (aiMove === "x") {
            gameBoard[i][j] = 2;
          } else {
            gameBoard[i][j] = 1;
          }
          const score = miniMax(board, depth + 1, true);
          gameBoard[i][j] = 0;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  };

  const aiMoveHard = () => {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (gameBoard[i][j] === 0) {
          if (aiMove === "x") {
            gameBoard[i][j] = 1;
          } else {
            gameBoard[i][j] = 2;
          }
          const score = miniMax(gameBoard, 0, false);
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

    if (aiMove === "x") {
      const currBox = document.getElementById(`p${xPos}${yPos}`);
      currBox.innerHTML = `
      <div class="flex-center-o" style="display: none">
        <div class="o"></div>
      </div>
      <div class="x" ></div>
    `;
      const current = document.querySelector(`#p${xPos}${yPos} .x`);
      current.style.animationDelay = ".3s";
      gameBoard[xPos][yPos] = 1;
    } else {
      const currBox = document.getElementById(`p${xPos}${yPos}`);
      currBox.innerHTML = `
      <div class="flex-center-o">
        <div class="o"></div>
      </div>
      <div class="x" style="display: none"></div>
    `;
      const current = document.querySelector(`#p${xPos}${yPos} .flex-center-o`);
      current.style.animationDelay = ".3s";
      gameBoard[xPos][yPos] = 2;
    }
  };

  const render = (box, id) => {
    // render player move
    playerMove(box, id);

    if (hasWon() !== null) {
      console.log("over");
      isOver = true;
      for (let i = 0; i < gameBoard.length; i += 1) {
        for (let j = 0; j < gameBoard[0].length; j += 1) {
          console.log(gameBoard[i][j]);
        }
      }
    }
    if (gameMode === 2 && isOver === false) {
      aiMoveHard();
    }

    if (hasWon() !== null) {
      console.log("over");
      isOver = true;
    }
  };

  const getIsOver = () => isOver;

  const newGame = (iconChoice) => {
    gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    isOver = false;
    availableMoves.length = 0;

    for (let i = 0; i < gameBoard.length; i += 1) {
      for (let j = 0; j < gameBoard[0].length; j += 1) {
        const address = `p${i}${j}`;
        availableMoves.push(address);
      }
    }

    if (iconChoice === "x") {
      aiMove = "o";
      humanMove = iconChoice;
    } else {
      aiMove = "x";
      humanMove = iconChoice;
      aiMoveEasy();
    }
  };

  return {
    newGame,
    hasWon,
    render,
    getIsOver,
  };
})();

ticTacToe.newGame("x");

const gameBoxes = document.querySelectorAll(".box");

gameBoxes.forEach((gameBox) => {
  gameBox.addEventListener("click", () => {
    if (gameBox.childElementCount !== 0 || ticTacToe.getIsOver()) {
      return;
    }
    const currID = gameBox.getAttribute("id");
    ticTacToe.render(gameBox, currID);
  });
});
