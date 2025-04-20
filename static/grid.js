const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let cellSize;
let gridSize = 15;
let showGridLines = true;
let gridLineColor = "rgba(255, 255, 255, 0.2)";


// === Grid Drawing ===
function drawGrid() {
    if (!showGridLines) return;

    ctx.strokeStyle = gridLineColor;
    ctx.lineWidth = 1;

    for (let i = 0; i <= gridSize; i++) {
        const pos = i * cellSize;

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvas.height);
        ctx.stroke();

        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvas.width, pos);
        ctx.stroke();
    }
}

function setCellSize(value){
    cellSize = value;
}

function setGridSize(value) {
    gridSize = value;
}

function setShowGridLines(value) {
    showGridLines = value;
}

function setGridLineColor(value) {
    // We'll keep the same transparency, but change the base color
    const colorMap = {
        white: "rgba(255, 255, 255, 0.2)",
        green: "rgba(0, 255, 0, 0.2)",
        cyan: "rgba(0, 255, 255, 0.2)",
        gray: "rgba(128, 128, 128, 0.2)"
    };

    gridLineColor = colorMap[value] || "rgba(255, 255, 255, 0.2)";
}


export {
    canvas,     // canvas element reference
    cellSize,   // size of one cell in pixels
    ctx,        // 2D drawing context
    drawGrid,   // function to draw grid lines
    gridSize,   // number of cells per row/column
    setCellSize,
    setGridLineColor,
    setGridSize,
    setShowGridLines
};
