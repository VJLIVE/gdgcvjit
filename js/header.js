// js/header.js
document.addEventListener('DOMContentLoaded', () => {
    // Load header.html into #header-container
    fetch('./header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header.html');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('header-container').innerHTML = data;

            // Mobile menu toggle logic
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const closeBtn = document.getElementById('close-btn');
            const mobileMenu = document.getElementById('mobile-menu');

            // Debug logs to check if elements are found
            console.log('Hamburger Button:', hamburgerBtn);
            console.log('Close Button:', closeBtn);
            console.log('Mobile Menu:', mobileMenu);

            if (hamburgerBtn && closeBtn && mobileMenu) {
                // Open menu on hamburger click
                hamburgerBtn.addEventListener('click', () => {
                    console.log('Hamburger clicked');
                    mobileMenu.classList.remove('translate-x-full');
                });

                // Close menu on cross click
                closeBtn.addEventListener('click', () => {
                    console.log('Close button clicked');
                    mobileMenu.classList.add('translate-x-full');
                });

                // Close menu when clicking a link
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        console.log('Nav link clicked:', link.textContent);
                        mobileMenu.classList.add('translate-x-full');
                    });
                });
            } else {
                console.error('One or more menu elements not found:', {
                    hamburgerBtn,
                    closeBtn,
                    mobileMenu
                });
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
            document.getElementById('header-container').innerHTML = '<p>Error loading header</p>';
        });
});