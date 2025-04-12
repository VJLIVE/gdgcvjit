document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const header = document.querySelector('.header');

    // Check for missing elements
    if (!hamburger || !navLinks || !menuOverlay || !header) {
        return;
    }

    // Fade in header
    header.classList.add('fade-in');

    // Toggle menu
    const toggleMenu = () => {
        const isActive = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu on nav item click
    navLinks.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    });

    // Close menu on overlay click
    menuOverlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
});