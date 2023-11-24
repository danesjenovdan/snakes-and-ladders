import "./styles/main.scss";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const app = document.querySelector("#app");

const gameState = {
  currentPosition: 0,
};

function fixAspectRatio() {
  const view = document.querySelector("#view");
  const aspectRatio = 9 / 16;
  const { innerWidth, innerHeight } = window;
  const windowAspectRatio = innerWidth / innerHeight;
  if (windowAspectRatio > aspectRatio) {
    view.style.setProperty("--board-width", `${innerHeight * aspectRatio}px`);
    view.style.width = `${innerHeight * aspectRatio}px`;
    view.style.height = `${innerHeight}px`;
  } else {
    view.style.setProperty("--board-width", `${innerWidth}px`);
    view.style.width = `${innerWidth}px`;
    view.style.height = `${innerWidth / aspectRatio}px`;
  }
}

async function throwDice(diceSides) {
  let diceNumber = 0;
  for (let i = 0; i < 20; i++) {
    const randomSide = Math.floor(Math.random() * 6);
    diceNumber = randomSide + 1;
    diceSides.forEach((side) => side.classList.remove("active"));
    diceSides[randomSide].classList.add("active");
    await wait(100);
  }
  return diceNumber;
}

async function updatePlayerPosition(diceNumber) {
  gameState.currentPosition += diceNumber;

  const posY = 4 - Math.floor(gameState.currentPosition / 4);
  let posX = gameState.currentPosition % 4;
  if (posY % 2 === 1) {
    posX = 3 - posX;
  }

  const player = document.querySelector(".player");
  player.classList.remove("start");
  player.style.setProperty("--pos-x", posX);
  player.style.setProperty("--pos-y", posY);

  await wait(1000);
}
window.updatePlayerPosition = updatePlayerPosition;

async function onThrowClick(event) {
  const button = event.currentTarget;
  const diceArea = document.querySelector(".dice-area");
  const dice = document.querySelector(".dice-area .dice");
  const diceSides = [...dice.querySelectorAll(".dice-side")];

  button.disabled = true;
  diceArea.classList.add("throwing");

  const diceNumber = await throwDice(diceSides);
  await updatePlayerPosition(diceNumber);

  await wait(1000);

  diceSides.forEach((side) => side.classList.remove("active"));
  diceArea.classList.remove("throwing");
  button.disabled = false;
}

window.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("resize", fixAspectRatio);
  fixAspectRatio();

  document
    .querySelector(".dice-area .btn-throw")
    .addEventListener("click", onThrowClick);
});
