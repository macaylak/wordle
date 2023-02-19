// define constants
const API_URL = "https://api.masoudkf.com/v1/wordle";
const API_KEY = "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv";
const MAX_ATTEMPTS = 6;

// define variables
let dictionary = [];
let currentWord = "";
let currentAttempts = 0;
let currentRow = 0;

// get elements from DOM
const lettersContainer = document.getElementById("letters-container");
const hintButton = document.getElementById("hint-button");
const startOverButton = document.getElementById("start-over-button");
const menuInstructions = document.getElementById("menu-instructions");
const menuDarkMode = document.getElementById("dark-mode");
const hintBox = document.getElementById("hint-box");
const menuHint = document.getElementById("hint");

// disable start over button while loading dictionary
startOverButton.disabled = true;
startOverButton.textContent = "Loading...";

// fetch dictionary from cache or API
const cachedDictionary = localStorage.getItem("wordle.dictionary");
if (cachedDictionary) {
  console.log("Fetching dictionary from cache...");
  dictionary = JSON.parse(cachedDictionary);
  startOverButton.disabled = false;
  startOverButton.textContent = "Start Over";
  pickRandomWord();
} else {
  console.log("Fetching dictionary from API...");
  fetch(API_URL, {
    headers: {
      "x-api-key": API_KEY,
    },
  })
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

// pick random word from dictionary
function pickRandomWord() {
  const randomIndex = Math.floor(Math.random() * dictionary.length);
  const wordData = dictionary[randomIndex];
  currentWord = {
    word: wordData.word.toUpperCase(),
    hint: wordData.hint,
  };
  console.log(currentWord);
}


// pick random word from dictionary
function pickRandomWord() {
  const randomIndex = Math.floor(Math.random() * dictionary.length);
  const wordData = dictionary[randomIndex];
  currentWord = {
    word: wordData.word.toUpperCase(),
    hint: wordData.hint
  };
  console.log(currentWord);
}


// define function to toggle hint box
function toggleHint() {
  hintBox.classList.toggle("hidden");
  if (!hintBox.classList.contains("hidden")) {
    hintBox.innerHTML = `<i>Hint:</i> ${currentWord.hint}`;
  }
}

// handle dark mode button click
menuDarkMode.addEventListener("click", () => {
  const body = document.body;
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
  } else {
    body.classList.add("dark-mode");
  }
});

// handle instructions button click
function toggleInstructions() {
    alert("How To Play\n\n• Start typing. The letters will appear in the boxes\n\n• Remove letters with Backspace\n\n• Hit Enter/Return to submit an answer\n\n• Letters with green background are in the right spot\n\n• Letters with yellow background exist in the word, but are in the wrong spots\n\n• Letters with gray background do not exist in the word\n\n• If you need a hint, click the ? icon");

}
// select all letter boxes
const letterBoxes = document.querySelectorAll(".letter-box");

// initialize index of next empty box
let nextEmptyBox = 0;


document.addEventListener("keydown", (event) => {
  if (event.keyCode >= 65 && event.keyCode <= 90) {
    // handle letter key presses
    // handle letter key presses
    const letter = String.fromCharCode(event.keyCode);
    if (nextEmptyBox < letterBoxes.length) {
      letterBoxes[nextEmptyBox].textContent = letter.toUpperCase();
      nextEmptyBox++;
      if (nextEmptyBox === 4) { // check if four letters have been entered
        event.preventDefault(); // prevent default behavior of letter being entered into the next box
        event.stopPropagation(); // stop event propagation to prevent any other key events
        event.target.blur(); // remove focus from the letter boxes
        // show user prompt to press enter
        const enterPrompt = document.createElement("div");
        enterPrompt.textContent = "Press Enter to Guess";
        enterPrompt.classList.add("enter-prompt");
        lettersContainer.appendChild(enterPrompt);
        // handle enter key press
        document.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        // remove the enter prompt
        lettersContainer.removeChild(enterPrompt);
        let guess = "";
        for (let i = 0; i < letterBoxes.length; i++) {
          guess += letterBoxes[i].textContent;
        }
        updateWord(guess);
      }
    }, {once: true}); // remove the event listener after it has been called once
  }
}

  } else if (event.keyCode === 8) {
    // handle backspace key press
    if (nextEmptyBox > 0) {
      nextEmptyBox--;
      letterBoxes[nextEmptyBox].textContent = "";
    }
  } else if (event.keyCode === 13) {
    // handle enter key press
    let guess = "";
    for (let i = 0; i < letterBoxes.length; i++) {
      guess += letterBoxes[i].textContent;
    }
    updateWord(guess);
  }
});


let row1Boxes = document.querySelectorAll('#row-1 .letter-box');
let row2Boxes = document.querySelectorAll('#row-2 .letter-box');
let row3Boxes = document.querySelectorAll('#row-3 .letter-box');
let row4Boxes = document.querySelectorAll('#row-4 .letter-box');

let imageContainer = document.getElementById('image-container');

function updateWord(guess) {
  let rows = Math.ceil(nextEmptyBox / 4); // calculate total number of rows entered so far

  for (let row = 1; row <= rows; row++) {
    let boxes;
    if (row === 1) {
      boxes = row1Boxes;
    } else if (row === 2) {
      boxes = row2Boxes;
    } else if (row === 3) {
      boxes = row3Boxes;
    } else {
      boxes = row4Boxes;
    }

    let start = (row - 1) * 4;
    let end = start + 4;

    let allGreen = true; // assume all boxes are green
    let allFilled = true; // assume all boxes are filled

    for (let i = start; i < end; i++) {
      let currentWordIndex = i % 4;

      if (!guess[i]) {
        allFilled = false;
        break;
      }

      if (guess[i] === currentWord.word[currentWordIndex]) {
        boxes[currentWordIndex].style.backgroundColor = 'lightgreen';
      } else if (currentWord.word.includes(guess[i])) {
        boxes[currentWordIndex].style.backgroundColor = '#FDFD96';
        allGreen = false; // not all boxes are green
      } else {
        boxes[currentWordIndex].style.backgroundColor = 'grey';
        allGreen = false; // not all boxes are green
      }
    }

    if (!allFilled) {
      alert('Please complete the word before submitting a guess!');
      return;
    }

    if (allGreen) {
      let container = document.getElementById('word-container');
      container.style.display = 'none'; // hide the word-container
      let imgContainer = document.getElementById('image-container');
      imgContainer.style.display = 'block'; // show the image-container
      
      // update the hint and start over button
      let hint = document.getElementById('hint-box');
      hint.innerHTML = "Woohoo! You guessed the word <b>" + currentWord.word + "</b> correctly!";
      let startOverButton = document.getElementById('start-over-button');
      startOverButton.addEventListener('click', () => {
        location.reload(); // reload the page
      });
    } else if (row === 4) {
      // If all rows have been filled and the word has not been guessed, show a "you lost" message
      let hint = document.getElementById('hint-box');
      hint.innerHTML = "You missed the word <b>" + currentWord.word + "</b> and lost!";
      hint.style.backgroundColor = 'red';
      hintBox.style.display = 'block';
      
      let startOverButton = document.getElementById('start-over-button');
      startOverButton.addEventListener('click', () => {
        location.reload(); // reload the page
      });
    }
  }
}






function startOver() {
  const letterBoxes = document.querySelectorAll(".letter-box");
  for (let i = 0; i < letterBoxes.length; i++) {
    letterBoxes[i].textContent = "";
    letterBoxes[i].style.backgroundColor = "";
  }
  nextEmptyBox = 0;
}


startOverButton.addEventListener("click", () => {
  startOver();
});