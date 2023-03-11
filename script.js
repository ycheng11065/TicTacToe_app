const player = (symbol) => ({symbol});

const gameBoard = (() => {
  // let gameboard = [];
  const players = [];
  let me;

  const newGame = (symbol) => {
    // gameboard = [
    //   [0, 0, 0],
    //   [0, 0, 0],
    //   [0, 0, 0],
    // ];

    players.push(player(symbol));
    [me] = players;
  };

  const render = (box) => {
    box.innerHTML = `
        <div class="flex-center-o" style="display: none">
          <div class="o"></div>
        </div>
        <div class="x" style="display: none"></div>
    `;

  }
})();

const game = gameBoard();
game.newGame("x");

const gameBoxes = document.querySelectorAll(".box");

gameBoxes.forEach((gameBox) => {
  gameBox.addEventListener("click", () => {
    const { children } = gameBox;
    const styles1 = getComputedStyle(children[0]);
    const styles2 = getComputedStyle(children[1]);
    console.log(styles1.display);
    console.log(styles2.display);

    if (styles1.display === "none" && styles2.display === "none") {
      game.render(gameBox);
    }
  });
});
