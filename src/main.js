import "./styles/main.scss";
import board from "./assets/board.png";
import diceThrow from "./assets/sounds/dice-throw.mp3";
import ladder from "./assets/sounds/ladder.mp3";
import neutralField from "./assets/sounds/neutral-field.mp3";
import snake from "./assets/sounds/snake.mp3";
import victory from "./assets/sounds/victory.mp3";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const app = document.querySelector("#app");

const MESSAGES = [
  // start
  {
    position: "start",
    color: "green",
    hideCloseButton: true,
    title: "Kače in lestve",
    message: `
      <p>Z metanjem kocke poskusi kupiti stanovaje v trenutnih pogojih nepremičninskega trga v Sloveniji.</p>
      <p>Vmes te čakajo posebna polja z informacijami - kače predstavljajo ovire, lestve pa spodbude na tvoji poti do novega doma.</p>
      <p>
        <button type="button">ZAČNI IGRO</button>
      </p>
    `,
  },
  // regular
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <p class="big-number">5000</p>
      <p class="emphasised">novih javnih stanovanj so stanovanjski skladi zgradili od leta 2015.</p>
    `,
  },
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <p class="big-number">46 %</p>
      <p class="emphasised">višje cene stanovanj imamo, kot v preteklih treh letih.</p>
    `,
  },
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <p class="big-text">»Država ustvarja možnosti, da si državljani lahko pridobijo primerno stanovanje.«</p>
      <p>– Ustava Republike Slovenije</p>
    `,
  },
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
      <p>
        <a class="button" href="https://www.ostro.si/" target="_blank">PREBERI VEČ</a>
      </p>
    `,
  },
];

const gameState = {
  currentPosition: 0,
  images: {
    board: { url: board },
  },
  sounds: {
    throw: { url: diceThrow },
    ladder: { url: ladder },
    none: { url: neutralField },
    snake: { url: snake },
    win: { url: victory },
  },
};

async function preloadImages() {
  const promises = Object.values(gameState.images).map((image) => {
    return new Promise((resolve) => {
      image.img = new Image();
      image.img.src = image.url;
      image.img.addEventListener("load", resolve);
      image.img.addEventListener("error", resolve);
    });
  });
  await Promise.all(promises);
}

async function preloadSounds() {
  const promises = Object.values(gameState.sounds).map((sound) => {
    return new Promise((resolve) => {
      sound.audio = new Audio(sound.url);
      sound.audio.addEventListener("canplaythrough", resolve);
      sound.audio.addEventListener("error", resolve);
    });
  });
  await Promise.all(promises);
}

function playSound(type) {
  const sound = gameState.sounds[type];
  if (!sound) {
    return;
  }
  sound.audio.currentTime = 0;
  sound.audio.volume = 0.5;
  sound.audio.play();
}

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

function hideLoader() {
  const view = document.querySelector("#view");
  const loaderArea = view.querySelector(".loader-area");
  loaderArea.classList.add("hidden");
  view.classList.add("loaded");
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
    await wait(150);
  }
  return diceNumber;
}

async function updatePlayerPosition(diceNumber) {
  const player = document.querySelector(".player");

  if (diceNumber === "reset") {
    gameState.currentPosition = 0;
    player.classList.add("start");
  } else {
    gameState.currentPosition += diceNumber;
    if (gameState.currentPosition > 19) {
      gameState.currentPosition = 19;
    }
    player.classList.remove("start");
  }

  const posY = 4 - Math.floor(gameState.currentPosition / 4);
  let posX = gameState.currentPosition % 4;
  if (posY % 2 === 1) {
    posX = 3 - posX;
  }

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

  const messages = MESSAGES.filter((m) => m.position === position);
  const message = sample(messages);
  if (!message) {
    return { modalClosed: Promise.resolve() };
  }

  modal.classList.add(`modal--${message.color}`);
  if (message.hideCloseButton) {
    closeButton.classList.add("hidden");
  }

  modalTitle.textContent = message.title;
  modalBody.innerHTML = message.message;

  let resolveModalClosed;
  const modalClosed = new Promise((resolve) => {
    resolveModalClosed = resolve;
  });

  function closeModal() {
    closeButton.removeEventListener("click", closeModal);
    modalBg.removeEventListener("click", closeModal);

    modalBg.classList.remove("open");
    modal.classList.remove(
      "modal--blue",
      "modal--orange",
      "modal--green",
      "modal--gray"
    );
    closeButton.classList.remove("hidden");
    resolveModalClosed();
  }

  closeButton.addEventListener("click", closeModal);
  modalBg.addEventListener("click", (event) => {
    if (event.target === modalBg) {
      closeModal();
    }
    const button = event.target.closest(".modal-body button");
    if (button) {
      closeModal();
    }
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
  playSound("throw");

  const diceNumber = await throwDice(diceSides);
  await updatePlayerPosition(diceNumber);

  if (gameState.currentPosition > 18) {
    playSound("win");
    await wait(400);
    const { modalClosed } = openModal("win");
    await modalClosed;
    await updatePlayerPosition("reset");
  } else {
    const { type, move } = isSnakeOrLadder(gameState.currentPosition);
    playSound(type);
    await wait(400);
    if (type !== "none") {
      const { modalClosed } = openModal(gameState.currentPosition);
      await modalClosed;
      await updatePlayerPosition(move);
    } else {
      const { modalClosed } = openModal("none");
      await modalClosed;
    }
  }

  diceSides.forEach((side) => side.classList.remove("active"));
  diceArea.classList.remove("throwing");
  button.disabled = false;
}

async function main() {
  window.addEventListener("resize", fixAspectRatio);
  fixAspectRatio();

  await Promise.all([document.fonts.ready, preloadImages(), preloadSounds()]);
  hideLoader();

  const { modalClosed } = openModal("start");
  await modalClosed;

  document
    .querySelector(".dice-area .btn-throw")
    .addEventListener("click", onThrowClick);
}

main();
