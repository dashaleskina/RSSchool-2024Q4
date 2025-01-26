function createStartScreen(container, difficulty) {
  //тут будет логика вставки элементов в контейнер геймпада
}

function initGame() {
  let gamepad = document.querySelector(".gamepad");
  if (!gamepad) {
    gamepad = document.createElement("div");
    gamepad.className = "gamepad";
    document.body.appendChild(gamepad);
  }
  createStartScreen(gamepad, "easy");
}

initGame();
