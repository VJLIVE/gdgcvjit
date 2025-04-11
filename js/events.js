// Load header dynamically
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            headerPlaceholder.innerHTML = html;
            // Apply fade-in animation
            const header = headerPlaceholder.querySelector('header');
            if (header) header.classList.add('fade-in');
            // Initialize header-related functionality
            initializeMobileMenu();
            setActiveNavLink();
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
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
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
                    mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                }
            }
        });
    });
}

// Display events based on page context
function displayEvents(cards) {
    const upcomingContainer = document.getElementById('upcoming-events');
    const pastContainer = document.getElementById('past-events');
    const currentDate = new Date('2025-04-05'); // Current date as per context

    const upcomingEvents = [];
    const pastEvents = [];

    cards.forEach(card => {
        const eventDate = new Date(card.dataset.date);
        (eventDate >= currentDate ? upcomingEvents : pastEvents).push(card.cloneNode(true));
    });

    // Sort events
    upcomingEvents.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date)); // Closest first for upcoming
    pastEvents.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));    // Most recent first for past

    if (upcomingContainer) {
        upcomingContainer.innerHTML = '';
        pastContainer.innerHTML = '';
        upcomingEvents.forEach(event => upcomingContainer.appendChild(event));
        pastEvents.forEach(event => pastContainer.appendChild(event));
    } else {
        pastContainer.innerHTML = '';
        pastEvents.forEach(event => pastContainer.appendChild(event));
    }

    attachDetailsButtonListeners();
}

// Attach event listeners to details buttons
function attachDetailsButtonListeners() {
    const modal = document.getElementById('event-modal');
    const closeModal = document.getElementById('close-modal');
    const registerLink = document.getElementById('register-link');
    const watchReelBtn = document.getElementById('watch-reel-btn');
    const eventDetailBtns = document.querySelectorAll('.event-details-btn');
    const carouselImages = document.getElementById('carousel-images');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const photosSection = document.querySelector('#photo-carousel') ? document.querySelector('#photo-carousel').parentElement : null;
    const carouselDots = document.getElementById('carousel-dots');
    const photoCarousel = document.getElementById('photo-carousel');

    let currentIndex = 0;
    let photos = [];
    let touchStartX = 0;
    let touchEndX = 0;

    eventDetailBtns.forEach(btn => {
        btn.removeEventListener('click', handleDetailsClick);
        btn.addEventListener('click', handleDetailsClick);
    });

    function updateCarousel() {
        if (photos.length > 0) {
            carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = carouselDots.querySelectorAll('span');
            dots.forEach((dot, index) => {
                dot.classList.toggle('bg-blue-600', index === currentIndex);
                dot.classList.toggle('bg-gray-300', index !== currentIndex);
            });
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === photos.length - 1;
        }
    }

    function handleDetailsClick(e) {
        const currentEventCard = e.target.closest('.event-card');
        if (!currentEventCard) return;

        const title = currentEventCard.querySelector('h3').textContent;
        const dateTimeContainer = currentEventCard.querySelector('.flex.items-center.text-gray-500.mb-4');
        const dateTimeSpans = dateTimeContainer.querySelectorAll('span');
        const date = dateTimeSpans[0].textContent;
        const time = dateTimeSpans[1].textContent;
        const locationContainer = currentEventCard.querySelectorAll('.flex.items-center.text-sm.text-gray-500')[1] || currentEventCard.querySelector('.flex.items-center.text-sm.text-gray-500');
        const location = locationContainer.querySelector('span').textContent;
        const fullDescription = currentEventCard.dataset.fullDescription;
        const seats = currentEventCard.querySelector('.fa-users + span').textContent;
        const type = currentEventCard.dataset.type;
        photos = JSON.parse(currentEventCard.dataset.photos || '[]');
        const reelUrl = currentEventCard.dataset.reel || '#';
        const learnItems = JSON.parse(currentEventCard.dataset.learn || '[]');
        const prerequisites = JSON.parse(currentEventCard.dataset.prerequisites || '[]');
        const registrationUrl = currentEventCard.dataset.registrationUrl || '#';
        const eventDate = new Date(currentEventCard.dataset.date);
        const isPastEvent = eventDate < new Date('2025-04-05');

        // Populate modal
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-date').textContent = date;
        document.getElementById('modal-time').textContent = time;
        document.getElementById('modal-location').textContent = location;
        document.getElementById('modal-description').textContent = fullDescription;
        document.getElementById('modal-seats').textContent = seats;
        document.getElementById('modal-type').textContent = type.charAt(0).toUpperCase() + type.slice(1);
        document.getElementById('modal-type').className = `bg-${type === 'workshop' ? 'blue' : type === 'hackathon' ? 'red' : type === 'talk' ? 'purple' : 'teal'}-100 text-${type === 'workshop' ? 'blue' : type === 'hackathon' ? 'red' : type === 'talk' ? 'purple' : 'teal'}-800 text-xs font-medium px-2.5 py-0.5 rounded`;
        document.getElementById('modal-difficulty').textContent = 'Beginner';
        document.getElementById('modal-duration').textContent = time;

        const learnList = document.getElementById('modal-learn');
        learnList.innerHTML = '';
        learnItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            learnList.appendChild(li);
        });

        const prerequisitesList = document.getElementById('modal-prerequisites');
        prerequisitesList.innerHTML = '';
        prerequisites.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            prerequisitesList.appendChild(li);
        });

        // Reel button handling
        if (watchReelBtn) {
            watchReelBtn.href = reelUrl;
            watchReelBtn.classList.toggle('hidden', !isPastEvent); // Show only for past events
            watchReelBtn.removeEventListener('click', handleReelClick); // Remove existing listener to avoid duplicates
            watchReelBtn.addEventListener('click', handleReelClick); // Add new listener
        }

        // Photos and carousel handling
        if (carouselImages && photosSection) {
            carouselImages.innerHTML = '';
            carouselDots.innerHTML = '';
            if (isPastEvent && photos.length > 0) {
                photos.forEach(photo => {
                    const img = document.createElement('img');
                    img.src = photo;
                    img.alt = `${title} event photo`;
                    img.classList.add('w-full','md:h-[10vh]', 'flex-shrink-0');
                    carouselImages.appendChild(img);
                });

                photos.forEach((_, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-gray-300', 'cursor-pointer', 'mx-1', 'transition-colors', 'duration-300');
                    dot.addEventListener('click', () => {
                        currentIndex = index;
                        updateCarousel();
                    });
                    carouselDots.appendChild(dot);
                });

                photosSection.classList.remove('hidden');
                prevBtn.disabled = photos.length <= 1;
                nextBtn.disabled = photos.length <= 1;

                // Swipe handling
                photoCarousel.removeEventListener('touchstart', handleTouchStart);
                photoCarousel.removeEventListener('touchmove', handleTouchMove);
                photoCarousel.removeEventListener('touchend', handleTouchEnd);
                photoCarousel.addEventListener('touchstart', handleTouchStart);
                photoCarousel.addEventListener('touchmove', handleTouchMove);
                photoCarousel.addEventListener('touchend', handleTouchEnd);
            } else {
                photosSection.classList.add('hidden');
                prevBtn.disabled = true;
                nextBtn.disabled = true;
            }
        }

        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
        }

        function handleTouchMove(e) {
            touchEndX = e.touches[0].clientX;
        }

        function handleTouchEnd() {
            const swipeDistance = touchStartX - touchEndX;
            const minSwipeDistance = 50; // Minimum distance to consider it a swipe

            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0 && currentIndex < photos.length - 1) {
                    currentIndex++; // Swipe left
                } else if (swipeDistance < 0 && currentIndex > 0) {
                    currentIndex--; // Swipe right
                }
                updateCarousel();
            }
        }

        currentIndex = 0;
        updateCarousel();

        // Registration handling
        if (registerLink) {
            registerLink.classList.remove('hidden');
            if (isPastEvent) {
                registerLink.textContent = 'Event Ended';
                registerLink.href = '#';
                registerLink.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                registerLink.classList.add('bg-gray-400', 'cursor-not-allowed');
            } else {
                registerLink.textContent = 'Register Now';
                registerLink.href = registrationUrl;
                registerLink.classList.remove('bg-gray-400', 'cursor-not-allowed');
                registerLink.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }

            registerLink.addEventListener('click', (e) => {
                if (registrationUrl === '#' || registrationUrl === window.location.href + '#') {
                    e.preventDefault();
                    const customAlert = document.createElement('div');
                    customAlert.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                    customAlert.innerHTML = `
                        <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
                            <p class="text-lg text-gray-900 mb-4">Registrations open soon!</p>
                            <button id="close-alert" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">OK</button>
                        </div>
                    `;
                    document.body.appendChild(customAlert);

                    const closeAlertBtn = document.getElementById('close-alert');
                    closeAlertBtn.addEventListener('click', () => {
                        document.body.removeChild(customAlert);
                    });

                    customAlert.addEventListener('click', (event) => {
                        if (event.target === customAlert) {
                            document.body.removeChild(customAlert);
                        }
                    });
                }
            });
        }

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function handleReelClick(e) {
        e.preventDefault(); // Prevent default behavior to handle manually
        const reelUrl = this.href;
        if (reelUrl && reelUrl !== '#') {
            window.open(reelUrl, '_blank'); // Open in a new tab
            console.log('Opening reel:', reelUrl); // Debug log
        } else {
            console.warn('Invalid reel URL:', reelUrl);
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < photos.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    const allEventCards = document.querySelectorAll('.event-card');
    displayEvents(allEventCards);

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-600', 'text-white'));
                button.classList.add('active', 'bg-blue-600', 'text-white');
                const filter = button.dataset.filter;
                const filteredCards = filter === 'all'
                    ? allEventCards
                    : Array.from(allEventCards).filter(card => card.dataset.type === filter);
                displayEvents(filteredCards);
            });
        });
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const searchedCards = Array.from(allEventCards).filter(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                return title.includes(searchTerm) || description.includes(searchTerm);
            });
            displayEvents(searchedCards);
        });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            const sortedCards = Array.from(allEventCards).sort((a, b) => {
                const dateA = new Date(a.dataset.date);
                const dateB = new Date(b.dataset.date);
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;
                if (sortValue === 'date-asc') return dateA - dateB;
                if (sortValue === 'date-desc') return dateB - dateA;
                if (sortValue === 'name-asc') return nameA.localeCompare(nameB);
                if (sortValue === 'name-desc') return nameB.localeCompare(nameB);
            });
            displayEvents(sortedCards);
        });
    }
});