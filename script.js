// Audio functionality
const backgroundMusic = document.getElementById('backgroundMusic');
const audioControl = document.getElementById('audioControl');
const audioIcon = document.getElementById('audioIcon');
const audioText = document.getElementById('audioText');
let isPlaying = false;

// Function to play music
function playMusic() {
  backgroundMusic.play().then(() => {
    isPlaying = true;
    audioIcon.textContent = '🎵';
    audioText.textContent = 'Music On';
    audioControl.classList.add('playing');
  }).catch(error => {
    console.log('Autoplay prevented:', error);
    // Fallback: show control immediately if autoplay fails
    audioControl.style.display = 'flex';
  });
}

// Function to pause music
function pauseMusic() {
  backgroundMusic.pause();
  isPlaying = false;
  audioIcon.textContent = '🔇';
  audioText.textContent = 'Music Off';
  audioControl.classList.remove('playing');
}

// Toggle music function
function toggleMusic() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

// Audio control click handler
audioControl.addEventListener('click', toggleMusic);

// Show invitee name from URL param "to"
function getInviteeName() {
  const params = new URLSearchParams(window.location.search);
  return params.get('to') || 'dear guest';
}

// FIXED: Cover enter button click - proper slide up animation
document.getElementById('enterBtn').addEventListener('click', () => {
  const cover = document.getElementById('cover');
  
  // Add the slide-out class to trigger CSS animation
  cover.classList.add('cover-slide-out');
  
  // Try to start music when user clicks enter
  playMusic();
  
  // Show audio control after animation starts
  setTimeout(() => {
    audioControl.style.display = 'flex';
  }, 300);
  
  // Hide cover completely after animation finishes
  setTimeout(() => {
    cover.style.display = 'none';
    // Show main content if you have it
    const mainContent = document.getElementById('main');
    if (mainContent) {
      mainContent.classList.remove('hidden');
    }
  }, 700); // Match your CSS transition duration
});

// Countdown timer
const weddingDate = new Date('2025-07-26T10:00:00');
const countdownEl = document.getElementById('countdown');

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    countdownEl.textContent = "We're married!";
    clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownEl.textContent =
    `${days} day${days !== 1 ? 's' : ''}, ` +
    `${hours.toString().padStart(2, '0')}h:` +
    `${minutes.toString().padStart(2, '0')}m:` +
    `${seconds.toString().padStart(2, '0')}s`;
}

const countdownInterval = setInterval(updateCountdown, 1000);

// Animation observer for reveal elements
const revealElements = document.querySelectorAll('.deco-a, .deco-b, .name-1, .border-anim');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden-init');
      entry.target.classList.add('animate-slide-fade');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set invitee name
  document.getElementById('inviteeName').textContent = getInviteeName();
  
  // Start countdown
  updateCountdown();
  
  // Observe reveal elements
  revealElements.forEach(el => observer.observe(el));
});