import { gridSize, cellSize, ctx } from './grid.js';
import { snake } from './snake.js';

let food = { x: 10, y: 10 };
let foodStyle = "color";
let foodColor = "red";
let foodEmoji = "🍎";

// === Food Generation ===

/**
 * Randomly places food on the grid,
 * avoiding any overlap with the snake's body.
 */
function generateFood() {
    let valid = false;

    while (!valid) {
        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);

        valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }
}

// === Food Rendering ===

/**
 * Draws the food on the canvas.
 * Depending on the style, it's either a colored circle or an emoji.
 */
function drawFood() {
    const x = food.x * cellSize + cellSize / 2;
    const y = food.y * cellSize + cellSize / 2;
    const radius = cellSize * 0.4;

    if (foodStyle === "color") {
        ctx.fillStyle = foodColor;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    } else if (foodStyle === "emoji") {
        ctx.font = `${cellSize * 0.8}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(foodEmoji, x, y);
    }
}

// === Setters ===

function setFoodStyle(style) {
    foodStyle = style;
}

function setFoodColor(color) {
    foodColor = color;
}

function setFoodEmoji(emoji) {
    foodEmoji = emoji;
}

// === Exports ===

export {
    drawFood,
    generateFood,
    food,
    setFoodStyle,
    setFoodColor,
    setFoodEmoji
};
