const symbols = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍊', '🍍', '🥝'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;
let matchedCount = 0;
let startTime;
let timerInterval;

const gameBoard = document.getElementById('gameBoard');
const attemptsDisplay = document.getElementById('attempts');
const timeDisplay = document.getElementById('time');
const winMessage = document.getElementById('winMessage');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timeDisplay.textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function restartGame() {
  attempts = 0;
  matchedCount = 0;
  attemptsDisplay.textContent = 0;
  timeDisplay.textContent = 0;
  winMessage.classList.add('hidden');
  gameBoard.innerHTML = '';
  cards = [...symbols, ...symbols];
  shuffle(cards);
  createBoard();
  stopTimer();
  startTimer();
}

function createBoard() {
  cards.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    const front = document.createElement('div');
    front.classList.add('front');
    front.textContent = symbol;
    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = '❓';
    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', handleCardClick);
    gameBoard.appendChild(card);
  });
}

function handleCardClick(e) {
  const clicked = e.currentTarget;
  if (lockBoard || clicked === firstCard || clicked.classList.contains('flipped')) return;

  clicked.classList.add('flipped');

  if (!firstCard) {
    firstCard = clicked;
    return;
  }

  secondCard = clicked;
  lockBoard = true;
  attempts++;
  attemptsDisplay.textContent = attempts;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCount += 2;

    resetTurn();

    if (matchedCount === cards.length) {
      stopTimer();
      winMessage.classList.remove('hidden');
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
restartGame();
