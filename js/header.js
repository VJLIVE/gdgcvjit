// header.js
document.addEventListener('DOMContentLoaded', function() {
    // Load header content
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // Get current page URL
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            
            // Highlight active navigation item
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href === currentPage) {
                    item.classList.add('active');
                }
            });

            // Add fade-in animation only on home page
            const header = document.querySelector('header');
            if (currentPage === 'index.html') {
                header.classList.add('fade-in');
            } else {
                header.style.opacity = '1'; // Show immediately on other pages
            }

            // Dynamically set body padding-top based on header height
            const headerHeight = header.offsetHeight;
            //document.body.style.paddingTop = `${headerHeight}px`; // Add 20px buffer for spacing

            // Mobile menu toggle
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');

            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking a link
            navItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href === currentPage) {
                    item.classList.add('active');
                    item.style.color = 'black';
                    item.style.textDecoration = 'none';
                }
            });            
        })
        .catch(error => console.error('Error loading header:', error));
});