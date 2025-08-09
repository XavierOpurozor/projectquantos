// --- Game Variables ---
let secret_number = 0;
let attempts_left = 0;
let max_attempts_current = 5;
let min_range_current = 1;
let max_range_current = 100;
let game_active = false;

// --- DOM Element References ---
const minRangeInput = document.getElementById('min-range');
const maxRangeInput = document.getElementById('max-range');
const maxAttemptsInput = document.getElementById('max-attempts');
const statusLabel = document.getElementById('status-label');
const resultLabel = document.getElementById('result-label');
const guessEntry = document.getElementById('guess-entry');
const guessButton = document.getElementById('guess-button');
const hintButton = document.getElementById('hint-button');
const newGameButton = document.getElementById('new-game-button');

// --- Game Functions ---

function updateStatusLabel() {
    statusLabel.textContent = `Attempts left: ${attempts_left} / ${max_attempts_current}`;
}

function updateFeedback(message, className) {
    resultLabel.textContent = message;
    resultLabel.className = 'game-feedback ' + className;
}

function startGame() {
    try {
        min_range_current = parseInt(minRangeInput.value);
        max_range_current = parseInt(maxRangeInput.value);
        max_attempts_current = parseInt(maxAttemptsInput.value);

        if (min_range_current >= max_range_current) {
            alert("Minimum number must be less than maximum number.");
            game_active = false;
            guessButton.disabled = true;
            hintButton.disabled = true;
            return;
        }

        secret_number = Math.floor(Math.random() * (max_range_current - min_range_current + 1)) + min_range_current;
        attempts_left = max_attempts_current;
        game_active = true;

        updateFeedback(`Guess a number between ${min_range_current} and ${max_range_current}!`, '');
        guessEntry.value = '';
        updateStatusLabel();
        guessButton.disabled = false;
        hintButton.disabled = false;
        console.log(`DEBUG: Secret number is ${secret_number}`);

    } catch (e) {
        alert("An error occurred with game settings. Please check your inputs.");
        game_active = false;
        guessButton.disabled = true;
        hintButton.disabled = true;
    }
}

function checkGuess() {
    if (!game_active) {
        alert("Click 'New Game' to start!");
        return;
    }

    try {
        const player_guess = parseInt(guessEntry.value);
        guessEntry.value = '';

        if (isNaN(player_guess) || player_guess < min_range_current || player_guess > max_range_current) {
            updateFeedback(`Please enter a number between ${min_range_current} and ${max_range_current}.`, 'feedback-failure');
            return;
        }

        attempts_left--;

        if (player_guess === secret_number) {
            updateFeedback(`Congratulations! You guessed it in ${max_attempts_current - attempts_left} attempts!`, 'feedback-success');
            alert(`Awesome! You guessed the number ${secret_number}!`);
            game_active = false;
            guessButton.disabled = true;
            hintButton.disabled = true;
        } else if (attempts_left === 0) {
            updateFeedback(`Game Over! The number was ${secret_number}.`, 'feedback-failure');
            alert(`You ran out of attempts! The number was ${secret_number}.`);
            game_active = false;
            guessButton.disabled = true;
            hintButton.disabled = true;
        } else if (player_guess < secret_number) {
            updateFeedback("Too low! Try again.", 'feedback-low');
        } else {
            updateFeedback("Too high! Try again.", 'feedback-high');
        }

        updateStatusLabel();

    } catch (e) {
        updateFeedback("Invalid input! Please enter a whole number.", 'feedback-failure');
    }
}

function giveHint() {
    if (!game_active) {
        alert("Click 'New Game' to start!");
        return;
    }

    if (attempts_left <= 1) {
        alert("Not enough attempts left for a hint!");
        return;
    }

    attempts_left--;
    hintButton.disabled = true;

    if (secret_number % 2 === 0) {
        updateFeedback("Hint: The secret number is EVEN!", 'feedback-hint');
    } else {
        updateFeedback("Hint: The secret number is ODD!", 'feedback-hint');
    }
    updateStatusLabel();
}

// --- Event Listeners ---
newGameButton.addEventListener('click', startGame);
guessButton.addEventListener('click', checkGuess);
hintButton.addEventListener('click', giveHint);
guessEntry.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

// Initial state
updateStatusLabel();