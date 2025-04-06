function userSidebar() {
    const userIcon = document.getElementById("userIcon");
    const userSidebar = document.getElementById("userSidebar");
    const closeUserSidebarBtn = document.getElementById("closeUserSidebarBtn");
    const overlay = document.getElementById("overlay");
    const logoutBtn = document.getElementById("logoutBtn");
    const userInfoName = document.getElementById("userInfoName");

    // Open sidebar
    userIcon.addEventListener("click", () => {
        userSidebar.classList.add("active");
        overlay.classList.add("active");
    });

    // Close sidebar
    closeUserSidebarBtn.addEventListener("click", () => {
        userSidebar.classList.remove("active");
        overlay.classList.remove("active");
    });

    // Close both sidebars if clicking outside
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
