function settingsSidebar() {
    const settingsIcon = document.getElementById('settingsIcon');
    const sidebar = document.getElementById('settingsSidebar');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const overlay = document.getElementById('overlay');

    settingsIcon.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    const speedOptions = document.querySelectorAll('input[name="speed"]');
    speedOptions.forEach(option => {
        option.addEventListener('change', () => {
            if (option.checked) {
                const newSpeed = parseInt(option.value);
                import('./script.js').then(module => {
                    module.updateGameSpeed(newSpeed);
                });
            }
        });
    });

    const gridSizeSelect = document.getElementById('gridSizeSelect');
    gridSizeSelect.addEventListener('change', async () => {
        const newSize = parseInt(gridSizeSelect.value);
        const { setGridSize, canvas, setCellSize, drawGrid } = await import('./grid.js');
        const { setSnake, setDirection, setDirectionQueue } = await import('./snake.js');
        const { generateFood } = await import('./food.js');

        setGridSize(newSize);
        const size = Math.min(window.innerWidth, window.innerHeight) * 0.65;
        canvas.width = size;
        canvas.height = size;
        setCellSize(size / newSize);

        setDirection("RIGHT");
        setDirectionQueue([]);
        setSnake([
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ]);

        generateFood();
        drawGrid();
    });

    const showGridCheckbox = document.getElementById('showGridCheckbox');
    showGridCheckbox.addEventListener('change', async () => {
        const { setShowGridLines } = await import('./grid.js');
        setShowGridLines(showGridCheckbox.checked);
    });

    const gridColorSelect = document.getElementById('gridColorSelect');
    gridColorSelect.addEventListener('change', async () => {
        const { setGridLineColor } = await import('./grid.js');
        setGridLineColor(gridColorSelect.value);
    });

    const snakeColorSelect = document.getElementById('snakeColorSelect');
    snakeColorSelect.addEventListener('change', async () => {
        const { setSnakeColor } = await import('./snake.js');
        setSnakeColor(snakeColorSelect.value);
    });

    const foodStyleSelect = document.getElementById('foodStyleSelect');
    const foodColorSelect = document.getElementById('foodColorSelect');
    const foodEmojiSelect = document.getElementById('foodEmojiSelect');
    const foodColorLabel = document.getElementById('foodColorLabel');
    const foodEmojiLabel = document.getElementById('foodEmojiLabel');

    foodStyleSelect.addEventListener('change', async () => {
        const { setFoodStyle } = await import('./food.js');
        const style = foodStyleSelect.value;
        setFoodStyle(style);

        const showColor = style === "color";
        foodColorSelect.style.display = showColor ? "block" : "none";
        foodColorLabel.style.display = showColor ? "block" : "none";

        foodEmojiSelect.style.display = !showColor ? "block" : "none";
        foodEmojiLabel.style.display = !showColor ? "block" : "none";
    });

    foodColorSelect.addEventListener('change', async () => {
        const { setFoodColor } = await import('./food.js');
        setFoodColor(foodColorSelect.value);
    });

    foodEmojiSelect.addEventListener('change', async () => {
        const { setFoodEmoji } = await import('./food.js');
        setFoodEmoji(foodEmojiSelect.value);
    });
}

export { settingsSidebar };
