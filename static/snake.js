import { cellSize, ctx, gridSize } from './grid.js';
import { gameOver, score, setScore, setGameOver, speed } from './script.js';
import { food, generateFood } from './food.js';

let snakeColor = "#00cc66";

let snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
];

let direction = "RIGHT";
let directionQueue = [];

// === Snake Rendering ===

/**
 * Draws a rounded rectangle segment on the canvas.
 */
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * Renders the snake on the canvas using rounded segments.
 */
function drawSnake() {
    const segmentSize = cellSize * 0.8;
    const offset = (cellSize - segmentSize) / 2;
    const radius = segmentSize * 0.2;

    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = "#004d00";
    ctx.lineWidth = 2;

    for (let segment of snake) {
        const x = segment.x * cellSize + offset;
        const y = segment.y * cellSize + offset;

        drawRoundedRect(x, y, segmentSize, segmentSize, radius);
        ctx.fill();
        ctx.stroke();
    }
}

// === Snake Logic ===

/**
 * Updates the snake's position, handles movement,
 * collision detection, and food consumption.
 */
function moveSnake() {
    if (gameOver) return;

    if (directionQueue.length > 0) {
        direction = directionQueue.shift();
    }

    const head = { ...snake[0] };
    if (direction === "RIGHT") head.x += 1;
    if (direction === "LEFT")  head.x -= 1;
    if (direction === "UP")    head.y -= 1;
    if (direction === "DOWN")  head.y += 1;

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true);
        return;
    }

    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            setGameOver(true);
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        updateScore();
        generateFood();
    } else {
        snake.pop();
    }
}

/**
 * Increases score based on speed and updates UI.
 */
function updateScore() {
    if (speed === 150) setScore(score + 10);
    else if (speed === 250) setScore(score + 8);
    else setScore(score + 7);

    document.getElementById("scoreDisplay").textContent = `Score: ${score}`;
}

// === State Setters ===

function setDirection(value) {
    direction = value;
}

function setDirectionQueue(value) {
    directionQueue = value;
}

function setSnake(value) {
    snake = value;
}

function setSnakeColor(color) {
    snakeColor = color;
}

// === Exports ===

export {
    direction,
    directionQueue,
    snake,
    drawSnake,
    moveSnake,
    setDirection,
    setDirectionQueue,
    setSnake,
    setSnakeColor
};
