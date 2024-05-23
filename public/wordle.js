// Define constants
const API_URL = 'https://s5rznqdan5.execute-api.us-east-1.amazonaws.com/dev/wordlist';
const MAX_ATTEMPTS = 6;

// Define variables
let dictionary = [];
let currentWord = "";
let currentAttempts = 0;
let nextEmptyBox = 0;

// Get elements from DOM
const lettersContainer = document.getElementById("letters-container");
const hintButton = document.getElementById("hint-button");
const startOverButton = document.getElementById("start-over-button");
const menuInstructions = document.getElementById("menu-instructions");
const menuDarkMode = document.getElementById("dark-mode");
const hintBox = document.getElementById("hint-box");
const menuHint = document.getElementById("hint");
const letterBoxes = document.querySelectorAll(".letter-box");

// Disable start over button while loading dictionary
startOverButton.disabled = true;
startOverButton.textContent = "Loading...";

// Fetch dictionary from cache or API
const cachedDictionary = localStorage.getItem("wordle.dictionary");
if (cachedDictionary) {
  console.log("Fetching dictionary from cache...");
  dictionary = JSON.parse(cachedDictionary);
  startOverButton.disabled = false;
  startOverButton.textContent = "Start Over";
  pickRandomWord();
} else {
  console.log("Fetching dictionary from API...");
  fetch(API_URL, { mode: 'cors' })
    .then((response) => response.json())
    .then((data) => {
      dictionary = data.dictionary;
      localStorage.setItem("wordle.dictionary", JSON.stringify(dictionary));
      startOverButton.disabled = false;
      startOverButton.textContent = "Start Over";
      pickRandomWord();
    })
    .catch((error) => console.error(error));
}

// Pick random word from dictionary
function pickRandomWord() {
  const randomIndex = Math.floor(Math.random() * dictionary.length);
  const wordData = dictionary[randomIndex];
  currentWord = {
    word: wordData.word.toUpperCase(),
    hint: wordData.hint,
  };
  console.log(currentWord);
}

// Define function to toggle hint box
function toggleHint() {
  hintBox.classList.toggle("hidden");
  if (!hintBox.classList.contains("hidden")) {
    hintBox.innerHTML = `<i>Hint:</i> ${currentWord.hint}`;
  }
}

// Handle dark mode button click
menuDarkMode.addEventListener("click", () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
});

// Handle instructions button click
menuInstructions.addEventListener("click", () => {
  alert("How To Play\n\n• Start typing. The letters will appear in the boxes\n\n• Remove letters with Backspace\n\n• Hit Enter/Return to submit an answer\n\n• Letters with green background are in the right spot\n\n• Letters with yellow background exist in the word, but are in the wrong spots\n\n• Letters with gray background do not exist in the word\n\n• If you need a hint, click the ? icon");
});

// Handle keydown event for typing and guessing
document.addEventListener("keydown", (event) => {
  if (event.keyCode >= 65 && event.keyCode <= 90) {
    // Handle letter key presses
    const letter = String.fromCharCode(event.keyCode);
    if (nextEmptyBox < letterBoxes.length) {
      letterBoxes[nextEmptyBox].textContent = letter.toUpperCase();
      nextEmptyBox++;
    }
  } else if (event.keyCode === 8) {
    // Handle backspace key press
    if (nextEmptyBox > 0) {
      nextEmptyBox--;
      letterBoxes[nextEmptyBox].textContent = "";
    }
  } else if (event.keyCode === 13) {
    // Handle enter key press
    let guess = "";
    for (let i = 0; i < letterBoxes.length; i++) {
      guess += letterBoxes[i].textContent;
    }
    updateWord(guess);
  }
});

// Function to update the word and provide feedback
function updateWord(guess) {
  if (guess.length < currentWord.word.length) {
    alert('Please complete the word before submitting a guess!');
    return;
  }

  let allGreen = true; // Assume all boxes are green
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === currentWord.word[i]) {
      letterBoxes[i].style.backgroundColor = 'lightgreen';
    } else if (currentWord.word.includes(guess[i])) {
      letterBoxes[i].style.backgroundColor = '#FDFD96';
      allGreen = false; // Not all boxes are green
    } else {
      letterBoxes[i].style.backgroundColor = 'grey';
      allGreen = false; // Not all boxes are green
    }
  }

  if (allGreen) {
    hintBox.innerHTML = `Woohoo! You guessed the word <b>${currentWord.word}</b> correctly!`;
    startOverButton.disabled = false;
    return;
  }

  currentAttempts++;
  if (currentAttempts >= MAX_ATTEMPTS) {
    hintBox.innerHTML = `You missed the word <b>${currentWord.word}</b> and lost!`;
    startOverButton.disabled = false;
  }
}

// Function to start over
function startOver() {
  letterBoxes.forEach(box => {
    box.textContent = "";
    box.style.backgroundColor = "";
  });
  nextEmptyBox = 0;
  currentAttempts = 0;
  hintBox.innerHTML = "";
  pickRandomWord();
}

// Start over button event listener
startOverButton.addEventListener("click", () => {
  startOver();
});
