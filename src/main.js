import "./styles/main.scss";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const app = document.querySelector("#app");

const MESSAGES = [
  // snakes
  {
    position: 5,
    color: "blue",
    title: "Kača",
    message: `
      <p>Ni ti usojeno, stanovanje je pravkar kupil investitor. Lahko bi postal tvoj dom, zdaj pa ga bo investitor ali kratkoročno oddajal turistom, ali dolgoročno najemnikom, ali pa bo ostalo kar prazno in zgolj ohranjalo vrednost.</p>
      <p class="big-number">10 %</p>
      <p class="emphasised">novih nepremičnin so kupili kupci kot investicijo.</p>
    `,
  },
  {
    position: 15,
    color: "blue",
    title: "Kača",
    message: `
      <p>Prav nimaš sreče. Ogledoval si si stanovanje, zdaj pa ga kupila oseba, ki že ima dom in išče drugo nepremičnino. Morda bo v njej občasno prespala, morda bodo v njem živeli otroci, možno pa je tudi, da ga bo na črno oddajala.</p>
      <p class="big-number">33 %</p>
      <p class="emphasised">lastnikov novih stanovanj v njih nimajo niti stalnega prebivališča niti ga ne oddajajo.</p>
    `,
  },
  {
    position: 17,
    color: "blue",
    title: "Kača",
    message: `
      <p>Sprijazni se, pač nisi "pravi" kupec. Banka je ugodnejše posojilo ponu-dila kupcu, ki stanovanje kupuje za investicijo in ne za svoj dom.</p>
      <p class="big-number">15 %</p>
      <p class="emphasised">tistih, ki so stanovanje kupili kot investicijo, je za to potrebovalo posojilo. Med tistimi, ki so nova stanovanja kupili za bivanje, je takšnih skoraj polovica.</p>
    `,
  },
  // ladders
  {
    position: 2,
    color: "orange",
    title: "Lestev",
    message: `
      <p>Priložnost zate? Stanovanjski sklad je zgradil novo sosesko in stanovanja oddaja v najem. Medtem pa povpraševanje po nakupu upada.</p>
      <p class="big-number">20 %</p>
      <p class="emphasised">novih stanovanj v Ljubljani, na Obali in v alpskem turističnem območju je javnih stanovanj. Gradnja javnih najemnih stanovanj je po mnenju stroke najučinkovitejši način za povečanje njihove dostopnosti.</p>
    `,
  },
  {
    position: 11,
    color: "orange",
    title: "Lestev",
    message: `
      <p>Počasi se le premika. Občina je uvedla aktivno zemljiško politiko in določila območja, v kateri je dovoljeno le lastništvo stanovanj, ki so namenjena primarnemu prebivališču.</p>
      <p class="emphasised">Tako ureditev že poznajo denimo v več avstrijskih zveznih deželah. S tako politiko bi lahko zajezili špekulativne nakupe stanovanj in s tem rast cen.</p>
    `,
  },
  {
    position: 14,
    color: "orange",
    title: "Lestev",
    message: `
      <p>Drugače ne gre. Podedoval si 200.000 evrov.</p>
      <p class="big-number">99 %</p>
      <p class="emphasised">mladih se zanaša na pomoč staršev pri reševanju stanovanjskega problema, kažejo rezultati raziskave Hotel mama.</p>
    `,
  },
  // win
  {
    position: "win",
    color: "green",
    title: "Konec",
    message: `
      <p>Čestitam, kupil si stanovanje!</p>
      <p>Marsikdo nima ali takšne sreče ali takšnih možnosti. Premajhno število stanovanj na trgu in konkurenca premožnejših kupcev se pogosto izkažeta kot previsoki oviri in iskalce stanovanj pahneta na pretežno nereguliran najemniški trg.</p>
      <p>Kdo so kupci novih nepremičnin na ljubljanskem in obalnem trgu ter v alpskem turističnem območju ter kakšne so prakse nakupovanja stanovanj, preberi v na povezavi.</p>
    `,
  },
];

const gameState = {
  currentPosition: 0,
};

function isSnakeOrLadder(position) {
  const snakes = [5, 15, 17];
  const snakesMoves = [-2, -9, -7];
  const ladders = [2, 11, 14];
  const laddersMoves = [7, 2, 2];
  if (ladders.includes(position)) {
    const move = laddersMoves[ladders.indexOf(position)];
    return { type: "ladder", move };
  }
  if (snakes.includes(position)) {
    const move = snakesMoves[snakes.indexOf(position)];
    return { type: "snake", move };
  }
  return { type: "none", move: 0 };
}

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
  if (gameState.currentPosition > 19) {
    gameState.currentPosition = 19;
  }

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

function openModal(position) {
  const modalBg = document.querySelector(".modal-bg");
  const modal = document.querySelector(".modal");
  const closeButton = modal.querySelector(".btn-modal-close");
  const modalTitle = modal.querySelector(".modal-title h2");
  const modalBody = modal.querySelector(".modal-body");

  const message = MESSAGES.find((m) => m.position === position);
  if (!message) {
    return { modalClosed: Promise.resolve() };
  }

  modal.classList.add(`modal--${message.color}`);
  modalTitle.textContent = message.title;
  modalBody.innerHTML = message.message;

  let resolveModalClosed;
  const modalClosed = new Promise((resolve) => {
    resolveModalClosed = resolve;
  });

  closeButton.addEventListener("click", () => {
    modalBg.classList.remove("open");
    modal.classList.remove("modal--blue", "modal--orange", "modal--green");
    resolveModalClosed();
  });

  modalBg.classList.add("open");

  return { modalClosed };
}
window.openModal = openModal;

async function onThrowClick(event) {
  const button = event.currentTarget;
  const diceArea = document.querySelector(".dice-area");
  const dice = document.querySelector(".dice-area .dice");
  const diceSides = [...dice.querySelectorAll(".dice-side")];

  button.disabled = true;
  diceArea.classList.add("throwing");

  const diceNumber = await throwDice(diceSides);
  await updatePlayerPosition(diceNumber);
  await wait(400);

  if (gameState.currentPosition > 18) {
    diceSides.forEach((side) => side.classList.remove("active"));
    const { modalClosed } = openModal("win");
    await modalClosed;
    await wait(400);
    return;
  }

  const { type, move } = isSnakeOrLadder(gameState.currentPosition);
  if (type !== "none") {
    const { modalClosed } = openModal(gameState.currentPosition);
    await modalClosed;
    await updatePlayerPosition(move);
    await wait(400);
  }

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
