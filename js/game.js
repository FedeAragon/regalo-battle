// Motor del juego: mezcla los regalos, corre el "rey de la colina" y arma
// el historial de duelos. Todos los textos que ve Maite están acá arriba,
// en un solo lugar, para poder cambiarlos sin tocar el resto de la lógica.

const TEXTS = {
  pageTitle: "Para Maite 💛",
  introTitle: "Hola Maite 💛",
  introBody:
    "Quiero regalarte algo y no me decido, así que necesito tu ayuda. " +
    "Van a aparecer dos regalos: elegí el que más te guste. Sin pensarlo mucho.",
  startButton: "Empezar",
  duelPrompt: "¿Cuál te gusta más, Maite?",
  roundLabel: (current, total) => `Duelo ${current} de ${total}`,
  finalTitle: "Listo, Maite. Te quedaste con esto:",
  ideaLabel: "¿Se te ocurre algo que no puse?",
  ideaPlaceholder: "Escribilo acá si querés otra cosa (opcional)",
  doneButton: "Listo 💛",
  sendingButton: "Enviando…",
  thanksTitle: "Gracias por ayudarme, Maite 💛",
  thanksBody: "Ahora hacete la sorprendida.",
  errorBody: "No se pudo enviar. Probá de nuevo.",
  copyButton: "Copiar resultados",
  copiedButton: "¡Copiado!",
};

// --- Estado del juego -------------------------------------------------

let deck = [];
let champion = null;
let challengerIndex = 1;
let history = []; // [{ round, winner, loser }]
let ideaText = "";
let sent = false;
let sending = false;

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startGame() {
  deck = shuffle(GIFTS);
  champion = deck[0];
  challengerIndex = 1;
  history = [];
  ideaText = "";
  sent = false;
  sending = false;
  showScreen("duel");
  renderDuel();
}

function currentChallenger() {
  return deck[challengerIndex];
}

function totalRounds() {
  return deck.length - 1;
}

function currentRound() {
  return challengerIndex; // ronda 1 = primer duelo, etc.
}

function pickWinner(side) {
  const challenger = currentChallenger();
  const winner = side === "champion" ? champion : challenger;
  const loser = side === "champion" ? challenger : champion;

  history.push({ round: currentRound(), winner: winner.title, loser: loser.title });

  champion = winner;
  challengerIndex += 1;

  if (challengerIndex >= deck.length) {
    showScreen("final");
    renderFinal();
  } else {
    // Precarga la foto del próximo retador para que no titile al cambiar.
    const next = currentChallenger();
    if (next) new Image().src = next.img;
    renderDuel();
  }
}

// --- Render -------------------------------------------------------------

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.toggle("screen--active", el.dataset.screen === name);
  });
}

function renderDuel() {
  const challenger = currentChallenger();

  document.getElementById("duel-prompt").textContent = TEXTS.duelPrompt;
  document.getElementById("round-label").textContent = TEXTS.roundLabel(
    currentRound(),
    totalRounds()
  );

  const champCard = document.getElementById("card-champion");
  champCard.style.setProperty("--bg-img", `url("${champion.img}")`);
  champCard.querySelector(".card__title").textContent = champion.title;

  const challCard = document.getElementById("card-challenger");
  challCard.style.setProperty("--bg-img", `url("${challenger.img}")`);
  challCard.querySelector(".card__title").textContent = challenger.title;
}

function renderFinal() {
  document.getElementById("final-title").textContent = TEXTS.finalTitle;

  const winnerCard = document.getElementById("card-winner");
  winnerCard.style.setProperty("--bg-img", `url("${champion.img}")`);
  winnerCard.querySelector(".card__title").textContent = champion.title;

  document.getElementById("idea-label").textContent = TEXTS.ideaLabel;
  const ideaInput = document.getElementById("idea-input");
  ideaInput.placeholder = TEXTS.ideaPlaceholder;
  ideaInput.value = ideaText;

  const doneBtn = document.getElementById("done-button");
  doneBtn.textContent = TEXTS.doneButton;
  doneBtn.disabled = false;

  document.getElementById("send-error").hidden = true;
  document.getElementById("copy-button").hidden = true;
}

// --- Wiring ---------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  document.title = TEXTS.pageTitle;
  document.getElementById("intro-title").textContent = TEXTS.introTitle;
  document.getElementById("intro-body").textContent = TEXTS.introBody;
  document.getElementById("start-button").textContent = TEXTS.startButton;

  document.getElementById("start-button").addEventListener("click", startGame);

  document.getElementById("card-champion").addEventListener("click", () => pickWinner("champion"));
  document.getElementById("card-challenger").addEventListener("click", () => pickWinner("challenger"));

  document.getElementById("idea-input").addEventListener("input", (e) => {
    ideaText = e.target.value;
  });

  document.getElementById("done-button").addEventListener("click", handleDone);
  document.getElementById("copy-button").addEventListener("click", handleCopy);
});
