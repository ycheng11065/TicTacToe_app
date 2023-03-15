const player = (name, symbol) => ({ name, symbol });

const ticTacToe = (() => {
  let gameBoard = [];
  const players = [];
  const availableMoves = [];
  let isOver = false;
  let turn = 0;
  const gameMode = 2; // 1 is pvp

  const newGame = (symbol) => {
    gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    turn = 0;
    isOver = false;
    players.length = 0;
    availableMoves.length = 0;
    players.push(player("player1", symbol));

    if (symbol === "x") {
      players.push(player("player2", "o"));
    } else {
      players.push(player("player2", "x"));
    }

    for (let i = 0; i < gameBoard.length; i += 1) {
      for (let j = 0; j < gameBoard[0].length; j += 1) {
        const address = `p${i}${j}`;
        availableMoves.push(address);
      }
    }
    // console.log(currentPlayer);
    aiMoveHard();
  };

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
    const mainIcon = players[0].symbol;
    const xPos = parseInt(inputId[1], 10);
    const yPos = parseInt(inputId[2], 10);

    if (mainIcon === "x") {
      if (turn % 2 === 0 || gameMode === 2) {
        inputBox.innerHTML = `
        <div class="flex-center-o" style="display: none">
          <div class="o"></div>
        </div>
        <div class="x"></div>
        `;
        gameBoard[xPos][yPos] = 1;
      } else {
        inputBox.innerHTML = `
          <div class="flex-center-o">
            <div class="o"></div>
          </div>
          <div class="x" style="display: none"></div>
        `;
        gameBoard[xPos][yPos] = 2;
      }
    } else if (mainIcon === "o") {
      if (turn % 2 === 0 || gameMode === 2) {
        inputBox.innerHTML = `
          <div class="flex-center-o show">
            <div class="o"></div>
          </div>
          <div class="x" style="display: none"></div>
        `;
        gameBoard[xPos][yPos] = 2;
      } else {
        inputBox.innerHTML = `
        <div class="flex-center-o" style="display: none">
          <div class="o"></div>
        </div>
        <div class="x"></div>
        `;
        gameBoard[xPos][yPos] = 1;
      }
    }
    removeMove(xPos, yPos);
    turn += 1;
  };

  // const aiMoveEasy = () => {
  //   const mainIcon = players[0].symbol;
  //   const min = 0;
  //   const max = availableMoves.length - 1;
  //   const randomVal = Math.floor(Math.random() * (max - min + 1)) + min;
  //   const currAddress = availableMoves[randomVal];
  //   const xPos = currAddress.charAt(1);
  //   const yPos = currAddress.charAt(2);
  //   const currBox = document.getElementById(currAddress);

  //   availableMoves.splice(randomVal, 1);

  //   if (mainIcon === "x") {
  //     currBox.innerHTML = `
  //         <div class="flex-center-o">
  //           <div class="o"></div>
  //         </div>
  //         <div class="x" style="display: none"></div>
  //       `;
  //     gameBoard[xPos][yPos] = 2;
  //   } else {
  //     currBox.innerHTML = `
  //       <div class="flex-center-o" style="display: none">
  //         <div class="o"></div>
  //       </div>
  //       <div class="x"></div>
  //       `;
  //     gameBoard[xPos][yPos] = 1;
  //   }
  // };

  const miniMax = (board, depth, isMaximizing) => {
    const winner = hasWon();
    if (winner !== null) {
      // console.log(winner);
      if (winner === "o") {
        return -10;
      }
      if (winner === "x") {
        return 10;
      }
      if (winner === "draw") {
        return 0;
      }
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          if (gameBoard[i][j] === 0) {
            gameBoard[i][j] = 1;
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
          gameBoard[i][j] = 2;
          const score = miniMax(board, depth + 1, true);
          gameBoard[i][j] = 0;
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  };

  const aiMove = () => {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (gameBoard[i][j] === 0) {
          gameBoard[i][j] = 1;
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
    gameBoard[xPos][yPos] = 1;
    // const currBox = document.getElementById(`p${xPos}${yPos}`);
    // currBox.innerHTML = `
    //   <div class="flex-center-o">
    //     <div class="o"></div>
    //   </div>
    //   <div class="x" style="display: none"></div>
    // `;
    // const current = document.querySelector(`#p${xPos}${yPos} .flex-center-o`);
    const currBox = document.getElementById(`p${xPos}${yPos}`);
    currBox.innerHTML = `
      <div class="flex-center-o" style="display: none">
        <div class="o"></div>
      </div>
      <div class="x" ></div>
    `;
    const current = document.querySelector(`#p${xPos}${yPos} .x`);
    current.style.animationDelay = ".3s";
  };

  const aiMoveHard = () => {
    aiMove();
    // if (availableMoves.length === 9) {
    //   aiMoveEasy();
    // } else {
    //   aiMove();
    // }
  };

  const render = (box, id) => {
    // render player move
    playerMove(box, id);

    if (hasWon() !== null) {
      isOver = true;
    }
    // console.log(currentPlayer);
    if (gameMode === 2 && isOver === false) {
      aiMoveHard();
    }

    if (hasWon() !== null) {
      isOver = true;
    }
    // console.log(currentPlayer);
  };

  const getIsOver = () => isOver;

  return {
    player,
    newGame,
    hasWon,
    render,
    getIsOver,
  };
})();

ticTacToe.newGame("o");

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
