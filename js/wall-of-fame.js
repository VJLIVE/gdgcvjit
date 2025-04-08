// Dynamic Header Loading
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            headerPlaceholder.innerHTML = html;
            // Apply fade-in animation
            const header = headerPlaceholder.querySelector('header');
            if (header) header.classList.add('fade-in');
            // Link the header.css file dynamically (optional, since it's already in HTML)
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../css/header.css';
            document.head.appendChild(link);

            // Initialize mobile menu toggle
            initializeMobileMenu();
            // Set active navigation link based on current page
            setActiveNavLink();
            // Initialize smooth scrolling for anchor links
            initializeSmoothScrolling();
        })
        .catch(error => console.error('Error loading header:', error));
}

// Set active navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize mobile menu toggle
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.hamburger'); // Updated to match header.html
    const mobileMenu = document.querySelector('.nav-links'); // Updated to match header.html
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('hidden');
            if (isOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            }
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const mobileMenuButton = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.nav-links');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (mobileMenuButton) mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', loadHeader);

// Category filtering
const filterButtons = document.querySelectorAll('.category-filter');
const achievementCards = document.querySelectorAll('.achievement-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter cards
        const category = button.dataset.category;
        
        achievementCards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'block';
            } else {
                const categories = card.dataset.categories.split(' ');
                if (categories.includes(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Modal functionality
const modal = document.getElementById('alumni-modal');
const modalCloseBtns = document.querySelectorAll('#modal-close-btn, #modal-close-btn-2');
const modalConnectBtn = document.getElementById('modal-connect-btn');
const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

// Open modal when view details button is clicked
viewDetailsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Get data from button's data attributes
        const name = btn.dataset.name;
        const batch = btn.dataset.batch;
        const achievements = btn.dataset.achievements.split(', ');
        const details = btn.dataset.details;
        const linkedin = btn.dataset.linkedin;
        const imgSrc = btn.closest('.achievement-card').querySelector('img').src;
        
        // Set modal content
        document.getElementById('modal-name').textContent = name;
        document.getElementById('modal-batch').textContent = `Batch of ${batch}`;
        document.getElementById('modal-profile-img').src = imgSrc;
        document.getElementById('modal-details').textContent = details;
        
        // Clear and set achievements
        const achievementsContainer = document.getElementById('modal-achievements');
        achievementsContainer.innerHTML = '';
        
        achievements.forEach(achievement => {
            let badgeClass = 'google-blue';
            if (achievement.includes('Speaker') || achievement.includes('Talks')) {
                badgeClass = 'google-yellow';
            } else if (achievement.includes('Hackathon') || achievement.includes('Mentor') || achievement.includes('Founding')) {
                badgeClass = 'google-red';
            } else if (achievement.includes('Project') || achievement.includes('Hackathon')) {
                badgeClass = 'google-green';
            }
            
            const badge = document.createElement('span');
            badge.className = `${badgeClass} text-white text-xs px-2 py-1 rounded`;
            badge.textContent = achievement;
            achievementsContainer.appendChild(badge);
        });
        
        // Set LinkedIn URL
        modalConnectBtn.onclick = () => {
            window.open(linkedin, '_blank');
        };
        
        // Show modal
        modal.classList.remove('hidden');
    });
});

// Close modal when close button or overlay is clicked
modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});
