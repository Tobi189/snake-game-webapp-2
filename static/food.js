import {gridSize, cellSize, ctx} from './grid.js';
import {snake} from './snake.js';

let food = { x: 10, y: 10 };
let foodStyle = "color";  // or "emoji"
let foodColor = "red";    // default color
let foodEmoji = "🍎";     // default emoji

function setFoodStyle(style) {
    foodStyle = style;
}

function setFoodColor(color) {
    foodColor = color;
}

function setFoodEmoji(emoji) {
    foodEmoji = emoji;
}


// === Food ===
function generateFood() {
    let valid = false;

    while (!valid) {
        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);

        // Don’t place food inside the snake
        valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
    }


}

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

export {drawFood, generateFood, food, setFoodColor, setFoodEmoji, setFoodStyle};