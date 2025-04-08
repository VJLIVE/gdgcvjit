// Back to top button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.remove('opacity-100', 'visible');
                backToTopButton.classList.add('opacity-0', 'invisible');
            }
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Tab functionality for about section
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-100', 'text-blue-600');
                btn.classList.add('text-gray-600', 'hover:bg-gray-100');
            });
            button.classList.add('active', 'bg-blue-100', 'text-blue-600');
            button.classList.remove('text-gray-600', 'hover:bg-gray-100');
            tabContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Form submissions
function initializeForms() {
    const eventRegistrationForm = document.getElementById('event-registration-form');
    if (eventRegistrationForm) {
        eventRegistrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const eventName = document.getElementById('event-name').value;
            alert(`Thank you for registering for ${eventName}! A confirmation email has been sent to your inbox.`);
            eventRegistrationForm.reset();
            eventModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }
}

// Typing Effect with Forward and Backspace Alternating Texts
function initializeTypingEffect() {
    const typingText = document.getElementById('typing-text');
    const texts = [
        "Build. Learn. Connect.",
        "Google Developer Group - VJIT",
        "Connect with Innovators",
        "Create Impactful Solutions"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;

    function type() {
        const currentText = texts[textIndex];
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex--);
            if (charIndex < 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 100;
            }
        } else {
            typingText.textContent = currentText.substring(0, charIndex++);
            if (charIndex > currentText.length) {
                isDeleting = true;
                typingSpeed = 100;
            }
        }
        setTimeout(type, typingSpeed);
    }

    if (typingText) {
        type();
    }
}

// Particle Network with Persistent Particles in Hero Section (Static, No Scroll Effect)
function initializeParticleNetwork() {
    const canvas = document.getElementById('particle-network');
    const heroSection = document.querySelector('#home');
    if (!canvas || !heroSection) {
        console.error('Canvas or hero section not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context from canvas');
        return;
    }

    let particles = [];
    let mouse = { x: null, y: null };
    const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];

    // Define Particle class
    class Particle {
        constructor() {
            this.resetPosition();
            this.size = Math.random() * 3 + 1;
            this.baseSize = this.size;
            this.speedX = Math.random() * 1.0 - 0.2;
            this.speedY = Math.random() * 1.0 - 0.2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        resetPosition() {
            const heroRect = heroSection.getBoundingClientRect();
            this.x = Math.random() * heroRect.width;
            this.y = Math.random() * heroRect.height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            const heroRect = heroSection.getBoundingClientRect();
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary checking based on initial hero section size
            if (this.x + this.size > heroRect.width) this.x = heroRect.width - this.size;
            if (this.x - this.size < 0) this.x = this.size;
            if (this.y + this.size > heroRect.height) this.y = heroRect.height - this.size;
            if (this.y - this.size < 0) this.y = this.size;

            if (mouse.x !== null && mouse.y !== null) {
                const adjustedMouseX = mouse.x - heroRect.left;
                const adjustedMouseY = mouse.y - heroRect.top - window.scrollY;
                const dx = adjustedMouseX - this.x;
                const dy = adjustedMouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 75;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    this.speedX -= Math.cos(angle) * force * 0.8;
                    this.speedY -= Math.sin(angle) * force * 0.8;
                    this.size = this.baseSize + force * 2;
                } else {
                    this.size += (this.baseSize - this.size) * 0.05;
                }
            } else {
                this.size += (this.baseSize - this.size) * 0.05;
            }

            this.speedX *= 0.98;
            this.speedY *= 0.98;

            if (Math.random() < 0.1) {
                this.speedX += Math.random() * 0.2 - 0.1;
                this.speedY += Math.random() * 0.2 - 0.1;
            }
        }
    }

    function resizeCanvas() {
        const heroRect = heroSection.getBoundingClientRect();
        canvas.width = heroRect.width;
        canvas.height = heroRect.height;
        canvas.style.top = `${heroRect.top + window.scrollY}px`;
        canvas.style.left = `${heroRect.left}px`;

        if (canvas.width <= 0 || canvas.height <= 0) {
            console.warn('Canvas has invalid dimensions:', canvas.width, canvas.height);
            return;
        }

        const area = canvas.width * canvas.height;
        const baseDensity = 0.0001;
        let maxParticles = Math.floor(area * baseDensity);
        maxParticles = Math.max(20, Math.min(150, maxParticles));

        console.log(`Canvas size: ${canvas.width}x${canvas.height}, Area: ${area}, Max Particles: ${maxParticles}`);

        // Adjust particle count and reposition existing particles
        while (particles.length < maxParticles) {
            const particle = new Particle();
            particles.push(particle);
        }
        while (particles.length > maxParticles) {
            particles.pop();
        }
        particles.forEach(particle => particle.resetPosition());

        console.log(`Current particle count: ${particles.length}`);
    }

    // Initial resize (only on load or resize)
    resizeCanvas();

    function connectParticles() {
        const heroRect = heroSection.getBoundingClientRect();
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxConnectDistance = 120;

                let shouldConnect = true;
                if (mouse.x !== null && mouse.y !== null) {
                    const adjustedMouseX = mouse.x - heroRect.left;
                    const adjustedMouseY = mouse.y - heroRect.top - window.scrollY;
                    const linePointDistance = pointLineDistance(
                        adjustedMouseX, adjustedMouseY,
                        particles[a].x, particles[a].y,
                        particles[b].x, particles[b].y
                    );
                    if (linePointDistance < 40 && distance < maxConnectDistance) {
                        shouldConnect = false;
                    }
                }

                if (distance < maxConnectDistance && shouldConnect) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxConnectDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function pointLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        const param = len_sq !== 0 ? dot / len_sq : -1;
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function animateParticles() {
        if (canvas.width <= 0 || canvas.height <= 0) {
            requestAnimationFrame(animateParticles);
            return;
        }

        ctx.fillStyle = 'rgba(17, 24, 39, 0.3)'; // Semi-transparent background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', resizeCanvas);
    // Removed scroll event listener to prevent dynamic repositioning on scroll
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    function animateCounters() {
        let allDone = true;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                allDone = false;
            } else {
                counter.innerText = target;
            }
        });
        if (!allDone) {
            requestAnimationFrame(animateCounters);
        }
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('#home');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all index-specific features
    initializeBackToTop();
    initializeTabs();
    initializeForms();
    initializeTypingEffect();
    initializeParticleNetwork();
    initializeCounters();
});
