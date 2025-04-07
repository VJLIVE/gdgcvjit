// team.js

// Function to load header dynamically
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
    const currentPath = window.location.pathname.split('/').pop() || 'teams.html';
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
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Toggle domain sections
function toggleDomain(domainId) {
    // Hide all domain sections
    document.querySelectorAll('.domain-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected domain section
    document.getElementById(domainId).classList.add('active');
    
    // Update active button styling
    document.querySelectorAll('.domain-btn').forEach(btn => {
        btn.classList.remove('active-domain');
        btn.classList.remove('bg-blue-200', 'bg-purple-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200', 'bg-indigo-200');
        btn.classList.add(btn.dataset.domain === 'technical' ? 'bg-blue-100' : 
                         btn.dataset.domain === 'design' ? 'bg-purple-100' : 
                         btn.dataset.domain === 'organizing' ? 'bg-green-100' : 
                         btn.dataset.domain === 'production' ? 'bg-yellow-100' : 
                         btn.dataset.domain === 'marketing' ? 'bg-red-100' : 
                         'bg-indigo-100');
    });
    
    // Add active class to clicked button
    const activeBtn = document.querySelector(`.domain-btn[data-domain="${domainId}"]`);
    activeBtn.classList.add('active-domain');
    activeBtn.classList.remove('bg-blue-100', 'bg-purple-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100', 'bg-indigo-100');
    activeBtn.classList.add(domainId === 'technical' ? 'bg-blue-200' : 
                            domainId === 'design' ? 'bg-purple-200' : 
                            domainId === 'organizing' ? 'bg-green-200' : 
                            domainId === 'production' ? 'bg-yellow-200' : 
                            domainId === 'marketing' ? 'bg-red-200' : 
                            'bg-indigo-200');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load header first
    loadHeader();

    // Initialize team-specific functionality
    // Note: toggleDomain is called via inline onclick or needs to be bound to buttons
    // If using event delegation, add this:
    document.querySelectorAll('.domain-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleDomain(btn.dataset.domain));
    });
});