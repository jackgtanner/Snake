const GAME_PIXEL_COUNT = 40;
const SQUARE_OF_GAME_PIXEL_COUNT = Math.pow(GAME_PIXEL_COUNT, 2);
const pickup_sound = document.getElementById("pickup");
const move_sound = document.getElementById("move");

let totalFoodAte = 0;
let totalDistanceTravelled = 0;

/// THE GAME BOARD:
const gameContainer = document.getElementById("gameContainer");

const createGameBoardPixels = () => {
    // Populate the [#gameContainer] div with small div's representing game pixels
    for (let i = 1; i <= SQUARE_OF_GAME_PIXEL_COUNT; ++i) {
        gameContainer.innerHTML = `${gameContainer.innerHTML} <div class="gameBoardPixel" id="pixel${i}"></div>`;
    }
};

// This variable always holds the updated array of game pixels created by createGameBoardPixels() :
const gameBoardPixels = document.getElementsByClassName("gameBoardPixel");

/// THE FOOD:
let currentFoodPostion = 0;
const createFood = () => {
    // Remove previous food;
    gameBoardPixels[currentFoodPostion].classList.remove("food");

    // Create new food
    currentFoodPostion = Math.random();
    currentFoodPostion = Math.floor(
        currentFoodPostion * SQUARE_OF_GAME_PIXEL_COUNT
    );
    gameBoardPixels[currentFoodPostion].classList.add("food");
};

/// THE SNAKE:


//Functions to play the ingame-sounds
const audio_move = new Audio('./lib/assets/sounds/Move.mp3');
function movePlay() {
    audio_move.play();
    return;
}

const audio_pickup = new Audio('./lib/assets/sounds/Pickup.mp3');
function pickupPlay() {
    audio_pickup.play();
    return;
}

const audio_ded = new Audio('./lib/assets/sounds/Ded.wav');
function dedPlay() {
    audio_ded.play();
    return;
}

// Direction codes (Keyboard key codes for arrow keys):
const LEFT_DIR = 37;
const UP_DIR = 38;
const RIGHT_DIR = 39;
const DOWN_DIR = 40;

// Set snake direction initially to right
let snakeCurrentDirection = RIGHT_DIR;

const changeDirection = newDirectionCode => {
    // movePlay();
    // Change the direction of the snake
    if (newDirectionCode == snakeCurrentDirection) return;

    if (newDirectionCode == LEFT_DIR && snakeCurrentDirection != RIGHT_DIR) {
        snakeCurrentDirection = newDirectionCode;
    } else if (newDirectionCode == UP_DIR && snakeCurrentDirection != DOWN_DIR) {
        snakeCurrentDirection = newDirectionCode;
    } else if (
        newDirectionCode == RIGHT_DIR &&
        snakeCurrentDirection != LEFT_DIR
    ) {
        snakeCurrentDirection = newDirectionCode;
    } else if (newDirectionCode == DOWN_DIR && snakeCurrentDirection != UP_DIR) {
        snakeCurrentDirection = newDirectionCode;
    }
};

// Let the starting position of the snake be at the middle of game board
let currentSnakeHeadPosition = SQUARE_OF_GAME_PIXEL_COUNT / 2;

// Initial snake length
let snakeLength = 200;

// Move snake continously by calling this function repeatedly :
const moveSnake = () => {
    console.log("HI");
    switch (snakeCurrentDirection) {
        case LEFT_DIR:
            --currentSnakeHeadPosition;
            const isSnakeHeadAtLastGameBoardPixelTowardsLeft =
                currentSnakeHeadPosition % GAME_PIXEL_COUNT == GAME_PIXEL_COUNT - 1 ||
                currentSnakeHeadPosition < 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsLeft) {
                currentSnakeHeadPosition = currentSnakeHeadPosition + GAME_PIXEL_COUNT;
            }
            break;
        case UP_DIR:
            currentSnakeHeadPosition = currentSnakeHeadPosition - GAME_PIXEL_COUNT;
            const isSnakeHeadAtLastGameBoardPixelTowardsUp =
                currentSnakeHeadPosition < 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsUp) {
                currentSnakeHeadPosition =
                    currentSnakeHeadPosition + SQUARE_OF_GAME_PIXEL_COUNT;
            }
            break;
        case RIGHT_DIR:
            ++currentSnakeHeadPosition;
            const isSnakeHeadAtLastGameBoardPixelTowardsRight =
                currentSnakeHeadPosition % GAME_PIXEL_COUNT == 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsRight) {
                currentSnakeHeadPosition = currentSnakeHeadPosition - GAME_PIXEL_COUNT;
            }
            break;
        case DOWN_DIR:
            currentSnakeHeadPosition = currentSnakeHeadPosition + GAME_PIXEL_COUNT;
            const isSnakeHeadAtLastGameBoardPixelTowardsDown =
                currentSnakeHeadPosition > SQUARE_OF_GAME_PIXEL_COUNT - 1;
            if (isSnakeHeadAtLastGameBoardPixelTowardsDown) {
                currentSnakeHeadPosition =
                    currentSnakeHeadPosition - SQUARE_OF_GAME_PIXEL_COUNT;
            }
            break;
        default:
            break;
    }

    let nextSnakeHeadPixel = gameBoardPixels[currentSnakeHeadPosition];

    // Kill snake if it bites itself:
    if (nextSnakeHeadPixel.classList.contains("snakeBodyPixel")) {
        dedPlay();
        // Stop moving the snake
        clearInterval(moveSnakeInterval);
        if (
            !alert(
                `You have ate ${totalFoodAte} food by travelling ${totalDistanceTravelled} blocks.`
            )
        )
            window.location.reload();
    }


    nextSnakeHeadPixel.classList.add("snakeBodyPixel");

    setTimeout(() => {
        nextSnakeHeadPixel.classList.remove("snakeBodyPixel");
    }, snakeLength);


    // Update total distance travelled
    totalDistanceTravelled++;
    // Update in UI:
    if (currentSnakeHeadPosition == currentFoodPostion) {
        // Update total food ate
        totalFoodAte++;
        // Update in UI:

        // Increase Snake length:
        
        snakeLength = snakeLength + 100;
        pickupPlay();
        createFood();
    }
};

/// CALL THE FOLLOWING FUNCTIONS TO RUN THE GAME:

// Create game board pixels:
createGameBoardPixels();

// Create initial food:
createFood();

// Move snake:
var moveSnakeInterval = setInterval(moveSnake, 80);

// Call change direction function on keyboard key-down event:
addEventListener("keydown", e => changeDirection(e.keyCode));

// ON SCREEN CONTROLLERS:
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");


