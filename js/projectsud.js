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

// Memory Game
const memoryCards = [
    'fa-html5', 'fa-css3-alt', 'fa-js', 'fa-react', 
    'fa-python', 'fa-java', 'fa-git-alt', 'fa-discord'
];
let memoryGameState = [];
let flippedCards = [];
let moves = 0;

function startMemoryGame() {
    document.getElementById('memory-game-container').classList.remove('hidden');
    document.getElementById('typing-game-container').classList.add('hidden');
    document.getElementById('quiz-game-container').classList.add('hidden');
    resetMemoryGame();
    document.querySelector('#memory-game-container').scrollIntoView({ behavior: 'smooth' });
}

function resetMemoryGame() {
    memoryGameState = [...memoryCards, ...memoryCards]
        .sort(() => 0.5 - Math.random());
    flippedCards = [];
    moves = 0;
    document.getElementById('moves').textContent = moves;
    
    const gameContainer = document.getElementById('memory-game');
    gameContainer.innerHTML = '';
    
    memoryGameState.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'card h-16 md:h-24 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-front  w-full h-full flex items-center justify-center">
                <i class="fas fa-question text-3xl text-gray-500"></i>
            </div>
            <div class="card-back w-full h-full flex items-center justify-center hidden">
                <i class="fab ${icon} text-3xl text-blue-500"></i>
            </div>
        `;
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
}

function flipCard() {
    const cardIndex = this.dataset.index;
    
    if (flippedCards.includes(cardIndex) || this.classList.contains('matched')) {
        return;
    }
    
    if (flippedCards.length >= 2) {
        return;
    }
    
    this.classList.add('flipped');
    this.querySelector('.card-front').classList.add('hidden');
    this.querySelector('.card-back').classList.remove('hidden');
    
    flippedCards.push(cardIndex);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        const [firstIndex, secondIndex] = flippedCards;
        const firstCard = document.querySelector(`.card[data-index="${firstIndex}"]`);
        const secondCard = document.querySelector(`.card[data-index="${secondIndex}"]`);
        
        if (memoryGameState[firstIndex] === memoryGameState[secondIndex]) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            flippedCards = [];
            
            if (document.querySelectorAll('.matched').length === memoryGameState.length) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${moves} moves!`);
                }, 500);
            }
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.querySelector('.card-front').classList.remove('hidden');
                firstCard.querySelector('.card-back').classList.add('hidden');
                secondCard.querySelector('.card-front').classList.remove('hidden');
                secondCard.querySelector('.card-back').classList.add('hidden');
                flippedCards = [];
            }, 1000);
        }
    }
}

// Typing Game
const codeSnippets = [
    'const greet = (name) => { return `Hello ${name}!`; }',
    'function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }',
    'class Person { constructor(name) { this.name = name; } sayHello() { console.log(`Hello, ${this.name}`); } }',
    'const numbers = [1, 2, 3]; const squared = numbers.map(x => x * x);',
    'async function fetchData(url) { const response = await fetch(url); return await response.json(); }'
];
let typingStartTime;
let typingInterval;
let currentSnippet = '';

function startTypingGame() {
    document.getElementById('typing-game-container').classList.remove('hidden');
    document.getElementById('memory-game-container').classList.add('hidden');
    document.getElementById('quiz-game-container').classList.add('hidden');
    resetTypingGame();
    document.querySelector('#typing-game-container').scrollIntoView({ behavior: 'smooth' });
}

function resetTypingGame() {
    clearInterval(typingInterval);
    
    currentSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    document.getElementById('typing-text').textContent = currentSnippet;
    
    const typingInput = document.getElementById('typing-input');
    typingInput.value = '';
    typingInput.focus();
    
    document.getElementById('typing-time').textContent = '0';
    document.getElementById('typing-wpm').textContent = '0';
    
    typingInput.addEventListener('keydown', function() {
        if (!typingStartTime) {
            typingStartTime = new Date().getTime();
            typingInterval = setInterval(updateTypingStats, 100);
        }
    });
}

function updateTypingStats() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - typingStartTime) / 1000;
    document.getElementById('typing-time').textContent = elapsedTime.toFixed(1);
    
    const typedText = document.getElementById('typing-input').value;
    const words = typedText.trim().split(/\s+/).length;
    const wpm = Math.round((words / elapsedTime) * 60);
    document.getElementById('typing-wpm').textContent = wpm;
    
    if (typedText === currentSnippet) {
        clearInterval(typingInterval);
        setTimeout(() => {
            alert(`Great job! Your typing speed was ${wpm} WPM!`);
        }, 100);
    }
}

// Quiz Game
const quizQuestions = [
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "CSS", "JavaScript", "Python"],
        answer: 1
    },
    {
        question: "What does 'API' stand for?",
        options: [
            "Application Programming Interface",
            "Automated Programming Interface",
            "Advanced Programming Interface",
            "Application Process Integration"
        ],
        answer: 0
    },
    {
        question: "Which of these is not a JavaScript framework?",
        options: ["React", "Angular", "Vue", "Flask"],
        answer: 3
    },
    {
        question: "What does 'DOM' stand for in web development?",
        options: [
            "Document Object Model",
            "Data Object Management",
            "Digital Output Module",
            "Display Object Method"
        ],
        answer: 0
    },
    {
        question: "Which HTTP status code means 'Not Found'?",
        options: ["200", "301", "404", "500"],
        answer: 2
    }
];
let currentQuestionIndex = 0;
let quizScore = 0;

function startQuizGame() {
    document.getElementById('quiz-game-container').classList.remove('hidden');
    document.getElementById('memory-game-container').classList.add('hidden');
    document.getElementById('typing-game-container').classList.add('hidden');
    currentQuestionIndex = 0;
    quizScore = 0;
    document.getElementById('quiz-score').textContent = quizScore;
    showQuizQuestion();
    document.querySelector('#quiz-game-container').scrollIntoView({ behavior: 'smooth' });
}

function showQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        currentQuestionIndex = 0;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    document.getElementById('quiz-question').textContent = question.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'p-3 bg-gray-100 rounded hover:bg-gray-200 text-left';
        button.textContent = option;
        button.addEventListener('click', () => checkQuizAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function checkQuizAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('#quiz-options button');
    
    if (selectedIndex === question.answer) {
        options[selectedIndex].className = 'p-3 bg-green-100 text-green-800 rounded';
        quizScore++;
        document.getElementById('quiz-score').textContent = quizScore;
    } else {
        options[selectedIndex].className = 'p-3 bg-red-100 text-red-800 rounded';
        options[question.answer].className = 'p-3 bg-green-100 text-green-800 rounded';
    }
    
    options.forEach(button => {
        button.disabled = true;
    });
}

function nextQuizQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= quizQuestions.length) {
        alert(`Quiz completed! Your score is ${quizScore}/${quizQuestions.length}`);
        currentQuestionIndex = 0;
    }
    showQuizQuestion();
}
