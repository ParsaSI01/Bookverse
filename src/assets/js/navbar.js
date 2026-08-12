document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelector(".nav-links");

    if (!navbar || !navLinks) {
        return;
    }

    // Create the mobile menu button
    const menuButton = document.createElement("button");

    menuButton.className = "mobile-menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    navbar.insertBefore(menuButton, navLinks);


    menuButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuButton.classList.toggle("open", isOpen);
        menuButton.setAttribute("aria-expanded", isOpen);
    });


    // Close the menu after clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuButton.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        });

    });


    // Close the menu when clicking outside it
    document.addEventListener("click", (event) => {

        if (
            !navbar.contains(event.target) &&
            navLinks.classList.contains("open")
        ) {
            navLinks.classList.remove("open");
            menuButton.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        }

    });
});