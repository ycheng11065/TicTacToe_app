const player = (symbol) => ({ symbol });

const ticTacToe = (() => {
  let gameBoard = [];
  const players = [];
  let isOver = false;

  const newGame = (symbol) => {
    gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    players.push(player(symbol));
  };

  const hasWon = () => {
    // Check horizontal
    for (let i = 0; i < gameBoard.length; i += 1) {
      if (gameBoard[i][0] !== 0 && gameBoard[i][0] === gameBoard[i][1]
        && gameBoard[i][1] === gameBoard[i][2]) {
        console.log("horizontal");
        return true;
      }
    }
    // Check vertical
    for (let i = 0; i < gameBoard[0].length; i += 1) {
      if (gameBoard[0][i] !== 0 && gameBoard[0][i] === gameBoard[1][i]
        && gameBoard[1][i] === gameBoard[2][i]) {
        console.log("vertical");
        return true;
      }
    }

    // Check diagonal
    if (gameBoard[0][0] !== 0 && gameBoard[0][0] === gameBoard[1][1]
      && gameBoard[1][1] === gameBoard[2][2]) {
      console.log("diagonal");
      return true;
    }

    if (gameBoard[0][2] !== 0 && gameBoard[0][2] === gameBoard[1][1]
      && gameBoard[1][1] === gameBoard[2][0]) {
      console.log("diagonal");
      return true;
    }
    console.log("not won");
    return false;
  };

  const render = (box, id) => {
    const inputBox = box;
    const icon = players[0].symbol;
    const inputId = id;
    const xPos = parseInt(inputId[1], 10);
    const yPos = parseInt(inputId[2], 10);

    if (icon === "x") {
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
    if (hasWon()) {
      console.log("game over");
      isOver = true;
    }
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
