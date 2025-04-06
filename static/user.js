function userSidebar() {
    const userIcon = document.getElementById("userIcon");
    const userSidebar = document.getElementById("userSidebar");
    const closeUserSidebarBtn = document.getElementById("closeUserSidebarBtn");
    const overlay = document.getElementById("overlay");
    const logoutBtn = document.getElementById("logoutBtn");
    const userInfoName = document.getElementById("userInfoName");

    const summarySnakeColor = document.getElementById("summarySnakeColor");
    const summaryFoodStyle = document.getElementById("summaryFoodStyle");
    const summaryGridSize = document.getElementById("summaryGridSize");

    // Open sidebar
    userIcon.addEventListener("click", () => {
        userSidebar.classList.add("active");
        overlay.classList.add("active");

        // Update preference summary
        summarySnakeColor.textContent = document.getElementById("snakeColorSelect")?.selectedOptions[0].text || "–";
        summaryFoodStyle.textContent = document.getElementById("foodStyleSelect")?.selectedOptions[0].text || "–";
        summaryGridSize.textContent = document.getElementById("gridSizeSelect")?.selectedOptions[0].text || "–";
    });

    // Close sidebar
    closeUserSidebarBtn.addEventListener("click", () => {
        userSidebar.classList.remove("active");
        overlay.classList.remove("active");
    });

    // Close both sidebars when clicking the overlay
    overlay.addEventListener("click", () => {
        userSidebar.classList.remove("active");
        document.getElementById("settingsSidebar").classList.remove("active");
        overlay.classList.remove("active");
    });

    // Set username
    const username = document.body.dataset.username;
    if (username) {
        userInfoName.textContent = username;
    }

    // Logout
    logoutBtn.addEventListener("click", () => {
        window.location.href = "/logout";
    });
}

export { userSidebar };
