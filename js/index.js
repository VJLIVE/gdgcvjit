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
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const container = textElement.parentElement;
    const texts = ["Build. Learn. Connect.", "Google Developers Group - VJIT"];
    let textIndex = 0;
    let charIndex = 0;
    let isTyping = true;
    
    function setMinHeight() {
        const longestText = texts.reduce((a, b) => a.length > b.length ? a : b);
        textElement.textContent = longestText;
        const height = container.offsetHeight;
        container.style.minHeight = `${height}px`;
        textElement.textContent = '';
    }
    
    setMinHeight();
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isTyping) {
            if (charIndex < currentText.length) {
                textElement.textContent += currentText.charAt(charIndex);
                charIndex++;
                setTimeout(type, 150);
            } else {
                isTyping = false;
                setTimeout(type, 1000);
            }
        } else {
            if (charIndex > 0) {
                textElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(type, 100);
            } else {
                isTyping = true;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            }
        }
    }
    
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && charIndex === 0) {
                type();
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// Particle Network with Persistent Particles in Hero Section
function initializeParticleNetwork() {
    const canvas = document.getElementById('particle-network');
    const heroSection = document.querySelector('#home');
    if (!canvas || !heroSection) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 150;
    let mouse = { x: null, y: null };
    const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335'];
    
    function resizeCanvas() {
        const heroRect = heroSection.getBoundingClientRect();
        canvas.width = Math.min(heroRect.width, window.innerWidth);
        canvas.height = heroRect.height;
        canvas.style.top = `${heroRect.top + window.scrollY}px`;
        canvas.style.left = `${heroRect.left}px`;
    }
    resizeCanvas();
    
    class Particle {
        constructor() {
            const heroRect = heroSection.getBoundingClientRect();
            this.x = Math.random() * heroRect.width;
            this.y = Math.random() * heroRect.height;
            this.size = Math.random() * 3 + 1;
            this.baseSize = this.size;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
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
                if (particles.length < maxParticles && Math.random() < 0.01) {
                    particles.push(new Particle());
                }
            }
            
            this.speedX *= 0.98;
            this.speedY *= 0.98;
            
            if (Math.random() < 0.1) {
                this.speedX += Math.random() * 0.2 - 0.1;
                this.speedY += Math.random() * 0.2 - 0.1;
            }
        }
    }
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
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
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance/maxConnectDistance})`;
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
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
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
    window.addEventListener('scroll', resizeCanvas);
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
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all index-specific features
    initializeBackToTop();
    initializeTabs();
    initializeForms();
    initializeTypingEffect();
    initializeParticleNetwork();
    initializeCounters();
});