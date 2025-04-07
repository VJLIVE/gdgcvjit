// projects.js

// Function to load header dynamically
function loadHeader() {
    fetch('header.html') // Adjust path based on your structure
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize navigation-related functionality after header loads
            setActiveNavLink();
            initializeMobileMenu();
        })
        .catch(error => console.error('Error loading header:', error));
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('invisible', 'opacity-0');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    modal.classList.add('invisible', 'opacity-0');
    document.body.style.overflow = 'auto';
}

// Notification functions
function openNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    notification.classList.remove('invisible', 'opacity-0');
    notification.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    notification.classList.remove('active');
    notification.classList.add('invisible', 'opacity-0');
    document.body.style.overflow = 'auto';
}

// Filter projects by category
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        const categories = project.getAttribute('data-category').split(' ');
        if (category === 'all' || categories.includes(category)) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

// Set active navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'projects.html';
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
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load header first
    loadHeader();

    // Other event listeners for projects page
    const submitButton = document.getElementById('submit-project');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            openNotification('submit-notification');
        });
    }

    const learnMoreButton = document.getElementById('learn-more');
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function() {
            openNotification('learn-notification');
        });
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterProjects(this.value);
        });
    }

    // Close modal when clicking outside content
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            const modalId = e.target.id;
            if (modalId.startsWith('project')) {
                closeModal(modalId);
            } else {
                closeNotification(modalId);
            }
        }
    });

    // Close modal/notification with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                if (modal.id.startsWith('project')) {
                    closeModal(modal.id);
                } else {
                    closeNotification(modal.id);
                }
            });
        }
    });
});