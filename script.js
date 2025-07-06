const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matchesFound = 0;
const totalPairs = 8;
const confettiContainer = document.getElementById('confetti-container');
const playAgainBtn = document.getElementById('play-again');

// Move counter
let moves = 0;
const movesCounter = document.getElementById('moves-counter');

// Update the moves display
function updateMovesCounter() {
    moves++;
    movesCounter.textContent = moves;
}

// Flip card logic
function flipCard() {
    if (lockBoard || this === firstCard) return; 

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        updateMovesCounter(); // Count a move when two cards are flipped
        checkForMatch();
    }
}

// Check if two cards match
function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;

    isMatch ? disableCards() : unflipCards();
}

function startConfetti() {
    function createConfettiPiece() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Random size
        const sizeClass = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
        confetti.classList.add(sizeClass);

        // Random shape - add 'circle' only if needed
        if (Math.random() > 0.5) {
            confetti.classList.add('circle');
        }

        // Random color
        const confettiColors = ['#FFC107', '#2196F3', '#FF5722', '#4CAF50', '#E91E63'];
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];

        // Random horizontal position
        confetti.style.left = `${Math.random() * 100}vw`;

        // Random animation delay
        confetti.style.animationDelay = `${Math.random() * 2}s`;

        confettiContainer.appendChild(confetti);

        // Remove confetti after animation ends
        confetti.addEventListener('animationend', () => confetti.remove());
    }

    // Generate multiple confetti pieces
    for (let i = 0; i < 1000; i++) {
        createConfettiPiece();
    }
}

// Show confetti on win
function showConfetti() {
    startConfetti(); // Call the confetti animation
    playAgainBtn.style.display = 'block'; // Show the play again button
    
    // Show congratulations message with move count
    const congratsMessage = document.getElementById('congratulations');
    congratsMessage.textContent = `Congratulations! You won in ${moves} moves!`;
    congratsMessage.style.display = 'block';
}

// Disable matched cards
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchesFound++;

    if (matchesFound === totalPairs) showConfetti();

    resetBoard();
}

// Unflip cards if not matched
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset the board state
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Shuffle the cards
(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
})();

// Add event listeners to cards
cards.forEach(card => card.addEventListener('click', flipCard));

// Reload game on play again
playAgainBtn.addEventListener('click', () => window.location.reload());

// Create the night sky and stars
function createNightSky() {
    // Create the night sky container
    const nightSky = document.createElement('div');
    nightSky.className = 'night-sky';
    document.body.insertBefore(nightSky, document.body.firstChild);
    
    // Create container for stars
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    nightSky.appendChild(starsContainer);
    
    // Add static stars
    const numberOfStars = 200;
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // Randomize star sizes
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Add twinkling effect to some stars
        if (Math.random() > 0.7) {
            star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`;
        }
        
        starsContainer.appendChild(star);
    }
    
    // Add shooting stars
    createShootingStars(nightSky);
}

// Create shooting stars with random intervals
function createShootingStars(nightSky) {
    // Function to create a single shooting star
    function createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // Random position and angle
        const startY = Math.random() * 50; // Start in top half of screen
        shootingStar.style.top = `${startY}%`;
        shootingStar.style.left = '0%';
        
        // Random duration
        const duration = Math.random() * 2 + 2; // 2-4 seconds
        shootingStar.style.animationDuration = `${duration}s`;
        
        nightSky.appendChild(shootingStar);
        
        // Remove the shooting star after animation ends
        setTimeout(() => {
            shootingStar.remove();
        }, duration * 1000);
    }
    
    // Create shooting stars at random intervals
    function scheduleNextStar() {
        const randomDelay = Math.random() * 5000 + 2000; // Between 2-7 seconds
        setTimeout(() => {
            createShootingStar();
            scheduleNextStar();
        }, randomDelay);
    }
    
    // Start the cycle
    scheduleNextStar();
}

// Add a CSS keyframe for twinkling stars
function addTwinkleKeyframes() {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the night sky
window.addEventListener('DOMContentLoaded', () => {
    addTwinkleKeyframes();
    createNightSky();
});