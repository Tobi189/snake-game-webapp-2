import {
    direction, directionQueue, drawSnake, moveSnake, snake,
    setDirection, setDirectionQueue, setSnake
} from './snake.js';

import {
    cellSize, gridSize, ctx, canvas, drawGrid, setCellSize
} from './grid.js';

import { drawFood, generateFood } from './food.js';
import { settingsSidebar } from './settings.js';
import { userSidebar } from './user.js';

settingsSidebar();
userSidebar();

const bestScoreDisplay = document.getElementById("bestScoreDisplay");
const best = document.body.dataset.best;

if (bestScoreDisplay && best) {
    bestScoreDisplay.textContent = `Best: ${best}`;
}



// === Game Settings ===
export let speed = 150;
let gameLoopInterval = null;
let scoreSubmitted = false;


function startGameLoop() {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, speed);
}

export let gameOver = false;
export let score = 0;

let gameStarted = false;
let isPaused = false;
let countdown = 0;
let countdownInterval;

export function setGameOver(value) {
    gameOver = value;
}

export function setScore(value) {
    score = value;
}

const scoreDisplay = document.getElementById("scoreDisplay");


// === Buttons ===
const restartButton = { x: 0, y: 0, width: 150, height: 50 };
const resumeButton = { x: 0, y: 0, width: 150, height: 50 };
const pauseRestartButton = { x: 0, y: 0, width: 150, height: 50 };


// === Canvas Resizing ===
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.65;
    canvas.width = size;
    canvas.height = size;

    setCellSize(canvas.width / gridSize);
    drawGrid();
    drawSnake();
}


// === UI Drawing Functions ===
function drawRestartButton() {
    const { width, height } = restartButton;
    restartButton.x = (canvas.width - width) / 2;
    restartButton.y = canvas.height / 2 + cellSize;

    drawButton(restartButton, "Restart");
}

function drawPauseMenu() {
    ctx.fillStyle = "white";
    ctx.font = `${cellSize}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Paused", canvas.width / 2, canvas.height / 2 - cellSize * 1.5);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    resumeButton.x = centerX - resumeButton.width / 2;
    resumeButton.y = centerY - resumeButton.height - 10;

    pauseRestartButton.x = centerX - pauseRestartButton.width / 2;
    pauseRestartButton.y = centerY + 10;

    drawButton(resumeButton, "Resume");
    drawButton(pauseRestartButton, "Restart");
}

function drawButton(button, text) {
    ctx.fillStyle = "#333";
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 2;
    ctx.strokeRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, button.x + button.width / 2, button.y + button.height / 2);
}

function drawGameOverMessage() {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.font = `${cellSize}px Arial`;
    ctx.fillText("Game Over", centerX, centerY - cellSize * 0.8);

    ctx.font = `${cellSize * 0.6}px Arial`;
    ctx.fillText(`Score: ${score}`, centerX, centerY + cellSize * 0.1);
    
}

function drawStartMessage() {
    ctx.fillStyle = "white";
    ctx.font = `${cellSize * 0.8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Press arrow or WASD key to start", canvas.width / 2, canvas.height / 2);
}


// === Game Logic ===
function gameLoop() {
    if (countdown > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // crisp for countdown
    } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)"; // ghosting for everything else
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    drawGrid();
    drawSnake();
    drawFood();

    

    if (gameOver) {
        drawGameOverMessage();
        drawRestartButton();
        
    if (!scoreSubmitted) {
        submitScore(score); // Only submit once
        scoreSubmitted = true;
    }
        return;
    }

    if (isPaused) {
        drawPauseMenu();
        return;
    }

    if (countdown > 0) {
        ctx.fillStyle = "white";
        ctx.font = `${cellSize * 1.5}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
        return;
    }

    if (gameStarted) {
        moveSnake();
    } else {
        drawStartMessage();
    }
}


// === Countdown ===
function startCountdown() {
    clearInterval(countdownInterval);

    let count = 3;
    countdown = count;
    isPaused = false;

    countdownInterval = setInterval(() => {
        count--;
        countdown = count;

        if (count < 0) {
            clearInterval(countdownInterval);
            countdown = 0;
        }
    }, 1000);
}


// === Restart ===
function restartGame() {
    scoreSubmitted = false; // Reset for next round
    score = 0;
    
    scoreDisplay.textContent = `Score: 0`;

    gameOver = false;
    gameStarted = false;
    isPaused = false;
    countdown = 0;

    clearInterval(countdownInterval);

    setDirection("RIGHT");
    setDirectionQueue([]);
    setSnake([
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ]);

    generateFood();
}


// === Pause ===
function togglePause() {
    if (gameOver || !gameStarted) return;

    isPaused = !isPaused;

    if (isPaused) {
        setDirectionQueue([]);
        drawPauseMenu();
    } else {
        startCountdown();
    }
}

// input handling
document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;
    const isTyping = activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";

    // Ignore keys if typing in input field
    if (isTyping) return;

    const validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault();
    }

    if (!gameStarted && validKeys.includes(event.key)) {
        gameStarted = true;
    }

    let newDirection = null;
    if (["ArrowUp", "w"].includes(event.key)) newDirection = "UP";
    else if (["ArrowDown", "s"].includes(event.key)) newDirection = "DOWN";
    else if (["ArrowLeft", "a"].includes(event.key)) newDirection = "LEFT";
    else if (["ArrowRight", "d"].includes(event.key)) newDirection = "RIGHT";

    if (!newDirection) return;

    const lastDir = directionQueue.length > 0
        ? directionQueue[directionQueue.length - 1]
        : direction;

    const opposites = {
        UP: "DOWN", DOWN: "UP",
        LEFT: "RIGHT", RIGHT: "LEFT"
    };

    const isReversing = newDirection === opposites[lastDir];
    const isRedundant = newDirection === lastDir;

    if (!isReversing && !isRedundant) {
        if (directionQueue.length < 2) {
            directionQueue.push(newDirection);
        } else {
            directionQueue[1] = newDirection;
        }
    }
});


document.addEventListener("keydown", (e) => {
    if (["Escape", " "].includes(e.key)) {
        togglePause();
    }
});

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (gameOver) {
        if (
            clickX >= restartButton.x && clickX <= restartButton.x + restartButton.width &&
            clickY >= restartButton.y && clickY <= restartButton.y + restartButton.height
        ) {
            restartGame();
        }
    } else if (isPaused) {
        if (
            clickX >= resumeButton.x && clickX <= resumeButton.x + resumeButton.width &&
            clickY >= resumeButton.y && clickY <= resumeButton.y + resumeButton.height
        ) {
            startCountdown();
        }

        if (
            clickX >= pauseRestartButton.x && clickX <= pauseRestartButton.x + pauseRestartButton.width &&
            clickY >= pauseRestartButton.y && clickY <= pauseRestartButton.y + pauseRestartButton.height
        ) {
            restartGame();
        }
    }
});

function submitScore(score) {
    fetch("/submit-score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ score })
    })
    .then(response => response.json())
    .then(data => {
        if (data.high_score !== undefined) {
            document.getElementById("bestScoreDisplay").textContent = `Best: ${data.high_score}`;
        }

        if (data.leaderboard) {
            const rankingsDiv = document.getElementById("rankings");
            rankingsDiv.innerHTML = "<h2>Global Rankings</h2>";

            data.leaderboard.forEach((entry, index) => {
                const row = document.createElement("p");
                row.textContent = `${index + 1}. ${entry.username} - ${entry.score}`;
                rankingsDiv.appendChild(row);
            });
        }
    })
    .catch(err => {
        console.error("Score submission failed:", err);
    });
}

loadLeaderboard();

function loadLeaderboard() {
    fetch("/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: 0 })  // fake score just to fetch leaderboard
    })
    .then(res => res.json())
    .then(data => {
        const rankingsDiv = document.getElementById("rankings");
        rankingsDiv.innerHTML = "<h2>Global Rankings</h2>";

        if (data.leaderboard && data.leaderboard.length > 0) {
            data.leaderboard.forEach((entry, i) => {
                const p = document.createElement("p");
                p.textContent = `${i + 1}. ${entry.username} - ${entry.score}`;
                rankingsDiv.appendChild(p);
            });
        } else {
            const p = document.createElement("p");
            p.textContent = "No scores yet.";
            rankingsDiv.appendChild(p);
        }
    })
    .catch(err => {
        console.error("Failed to load leaderboard:", err);
    });
}





document.getElementById("pauseBtn").addEventListener("click", togglePause);
document.getElementById("restartBtn").addEventListener("click", restartGame);


// === Initialization ===
window.addEventListener("load", () => {
    resizeCanvas();
    generateFood();
    loadLeaderboard(); // 👈 auto-load top 5
});

window.addEventListener("resize", resizeCanvas);
startGameLoop();

export function updateGameSpeed(newSpeed) {
    speed = newSpeed;
    startGameLoop();
}

