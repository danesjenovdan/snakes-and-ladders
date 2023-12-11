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
      <div class="modal-body__main">
        <p>Misija: nakup stanovanja v aktualnih razmerah na slovenskem nepremičninskem trgu.</p>
        <p>Na poti do novega doma vas bodo ovirale kače, lestve pa vam bodo pomagale.</p>
        <p>
          <button type="button">Vrzi kocko!</button>
        </p>
      </div>
    `,
  },
  // regular
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <div class="modal-body__main">
        <p class="big-number">39,9 %</p>
        <p class="emphasised">tržnih najemnikov živi v prenaseljenih stanovanjih</p>
      </div>
    `,
  },
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <div class="modal-body__main">
        <p class="big-number">98 %</p>
        <p class="emphasised">višje so povprečne cene rabljenih stanovanj kot leta 2015</p>
      </div>
    `,
  },
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <div class="modal-body__main">
        <p class="big-text">»Država ustvarja možnosti, da si državljani lahko pridobijo primerno stanovanje.«</p>
        <p>Ustava Republike Slovenije</p>
      </div>
    `,
  },
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <div class="modal-body__main">
        <p class="big-number">1200</p>
        <p class="emphasised">novih stanovanj je bilo v prvi polovici leta na trgu, dobra polovica v Ljubljani</p>
      </div>
    `,
  },
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <div class="modal-body__main">
        <p class="big-text">»Zaradi nekakovostnega poročanja je višina izračunanih stanovanjskih najemnin v poročilu problematična.«</p>
        <p>Geodetska uprava leta 2017 v zadnjem poročilu o stanovanjskem najemnem trgu</p>
      </div>
    `,
  },
  {
    position: "none",
    color: "gray",
    title: "Ali veš?",
    message: `
      <div class="modal-body__main">
        <p class="big-number">1246</p>
        <p class="emphasised">stanovanj v novogradnjah je v lasti stanovanjskih skladov, občin, države in nepremičninskega sklada PIZ</p>
      </div>
    `,
  },
  // snakes
  {
    position: 5,
    color: "blue",
    title: "Kača",
    message: `
      <div class="modal-body__main">
        <p>Ni ti usojeno – stanovanje je pravkar kupil premožnejši kupec! Najbrž ga bo oddal v najem, dolgoročni ali za turiste, ali pa bo ostalo kar prazno.</p>
      </div>
      <div class="modal-body__extra">
        <p class="big-number">19 %</p>
        <p class="emphasised">stanovanj v novogradnjah je naložbenih</p>
      </div>
    `,
  },
  {
    position: 15,
    color: "blue",
    title: "Kača",
    message: `
      <div class="modal-body__main">
        <p>Ne bo šlo 🙁. Stanovanje, ki bi bilo idealno zate, bo kupil nekdo, ki ga že ima, išče pa še eno. Morda bo v njem občasno prespal, morda bodo v njem živeli otroci, morda pa bo ostalo prazno.</p>
      </div>
      <div class="modal-body__extra">
        <p class="big-number">29 %</p>
        <p class="emphasised">stanovanj v novogradnjah so kupili kupci, ki tam niso prijavili prebivališča, niti stanovanja uradno ne oddajajo v najem</p>
      </div>
    `,
  },
  {
    position: 17,
    color: "blue",
    title: "Kača",
    message: `
      <div class="modal-body__main">
        <p>V manjši dom bo treba! Banka ti je z dvigom obrestnih mer prekrižala načrte. Ne moreš več tekmovati s kupci, ki posojila sploh ne potrebujejo.</p>
      </div>
      <div class="modal-body__extra">
        <p class="big-number">62 %</p>
        <p class="emphasised">kupcev novih stanovanj v Ljubljani za nakup ni potrebovalo posojila</p>
      </div>
    `,
  },
  // ladders
  {
    position: 2,
    color: "orange",
    title: "Lestev",
    message: `
      <div class="modal-body__main">
        <p>Naložbe v gradnjo stanovanj rastejo. Ponudba se bo postopno začela približevati potrebam.</p>
      </div>
      <div class="modal-body__extra">
        <p class="big-number">5,9 % BDP</p>
        <p class="emphasised">gospodarstva EU povprečno namenijo gradnji stanovanj, Slovenija pa le 2,8 %</p>
      </div>
    `,
  },
  {
    position: 11,
    color: "orange",
    title: "Lestev",
    message: `
      <div class="modal-body__main">
        <p>Počasi se premika! Vlada je uvedla nepremičninski davek, zato so stanovanja manj privlačna naložba.</p>
      </div>
      <div class="modal-body__extra">
        <p class="big-number">0,5 % BDP</p>
        <p class="emphasised">je leta 2021 v Sloveniji znašala obdavčitev nepremičnin; povprečje EU je 1,1 %</p>
      </div>
    `,
  },
  {
    position: 14,
    color: "orange",
    title: "Lestev",
    message: `
      <div class="modal-body__main">
        <p>Dobra novica! Tvoja občina je omejila oddajo stanovanj turistom.</p>
      </div>
      <div class="modal-body__extra">
        <p class="emphasised">V pripravi je nov zakon o gostinstvu, nekatere občine pa so se že zavzele za več pristojnosti pri regulaciji turističnega oddajanja.</p>
      </div>
    `,
  },
  // win
  {
    position: "win",
    color: "green",
    title: "Konec",
    message: `
      <div class="modal-body__main">
        <p>Čestitamo, končno imaš stanovanje!</p>
        <p>Toda mnogim ni uspelo. Premajhno število stanovanj na trgu in tekmovanje s premožnejšimi kupci sta pogosto previsoki oviri za iskalce stanovanj, zato pristanejo na slabo reguliranem najemniškem trgu.</p>
        <p>Skoraj petina nakupov stanovanj v novogradnjah v Ljubljani, na Obali in v alpskem turističnem območju je naložbenih, je pokazala nova preiskava Oštra. V središču Ljubljane lastniki živijo le v vsakem petem stanovanju, v Kranjski Gori pa jih je več kot polovica namenjenih turizmu.</p>
        <p>
          <a class="button" href="https://www.ostro.si/si/zakon-nepremicninske-dzungle" target="_blank">Preberi več</a>
        </p>
      </div>
    `,
  },
];

const gameState = {
  currentPosition: 0,
  shownMessages: [],
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
    gameState.shownMessages = [];
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

  let messages = MESSAGES.filter(
    (m) => m.position === position && !gameState.shownMessages.includes(m)
  );
  if (!messages.length) {
    messages = MESSAGES.filter((m) => m.position === position);
  }

  const message = sample(messages);
  if (!message) {
    return { modalClosed: Promise.resolve() };
  }

  gameState.shownMessages.push(message);

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

function preload() {
  let resolvePreload;
  const promise = new Promise((resolve) => {
    resolvePreload = resolve;
  });

  // timeout preload
  setTimeout(() => {
    resolvePreload();
  }, 5000);

  Promise.all([document.fonts.ready, preloadImages(), preloadSounds()]).then(
    () => resolvePreload()
  );

  return promise;
}

async function main() {
  const debugEl = document.getElementById("debug");
  debugEl.style.backgroundColor = "orange";
  debugEl.textContent = "1";

  window.addEventListener("resize", fixAspectRatio);
  fixAspectRatio();

  debugEl.style.backgroundColor = "cyan";
  debugEl.textContent = "2";

  try {
    await preload();
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }

  debugEl.style.backgroundColor = "lime";
  debugEl.textContent = "3";

  const { modalClosed } = openModal("start");
  await modalClosed;

  debugEl.style.backgroundColor = "pink";
  debugEl.textContent = "4";

  const throwButton = document.querySelector(".dice-area .btn-throw");
  throwButton.addEventListener("click", onThrowClick);

  debugEl.style.backgroundColor = "lavender";
  debugEl.textContent = "5";

  onThrowClick({ currentTarget: throwButton });
}

main();
