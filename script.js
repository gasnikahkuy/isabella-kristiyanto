tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        ian: ['font-ian', 'sans-serif'],
        custom: ['font-custom', 'serif'],
        beautiful: ['Beautiful', 'cursive'],
      },
    },
  },
};

// Audio functionality
const backgroundMusic = document.getElementById('backgroundMusic');
const audioControl = document.getElementById('audioControl');
const audioIcon = document.getElementById('audioIcon');
const audioText = document.getElementById('audioText');
let isPlaying = false;

function playMusic() {
  backgroundMusic.play().then(() => {
    isPlaying = true;
    audioIcon.textContent = '🎵';
    audioControl.classList.add('playing');
  }).catch(error => {
    console.log('Autoplay prevented:', error);
    audioControl.style.display = 'flex';
  });
}

function pauseMusic() {
  backgroundMusic.pause();
  isPlaying = false;
  audioIcon.textContent = '🔇';
  audioControl.classList.remove('playing');
}

function toggleMusic() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

audioControl.addEventListener('click', toggleMusic);

function getInviteeName() {
  const params = new URLSearchParams(window.location.search);
  return params.get('to') || 'tamu undangan';
}

const weddingDate = new Date('2025-07-26T11:00:00');
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

document.addEventListener('DOMContentLoaded', () => {
  // Set invitee name
  const nameEl = document.getElementById('inviteeName');
  if (nameEl) nameEl.textContent = getInviteeName();

  // Countdown
  updateCountdown();

  // Reveal animations
  revealElements.forEach(el => observer.observe(el));

  // Enter button
  const enterBtn = document.getElementById('enterBtn');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      const cover = document.getElementById('cover');
      cover.classList.add('cover-slide-out');
      playMusic();
      setTimeout(() => {
        audioControl.style.display = 'flex';
      }, 300);
      setTimeout(() => {
        cover.style.display = 'none';
        const mainContent = document.getElementById('main');
        if (mainContent) {
          mainContent.classList.remove('hidden');
        }
      }, 700);
    });
  }

  // Lightbox for gallery
  const galleryImages = document.querySelectorAll('.gallery-img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const carousel = document.getElementById('carousel');

  if (galleryImages.length && lightbox && lightboxImg && carousel) {
    galleryImages.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
        setTimeout(() => {
          lightboxImg.classList.add('scale-100');
        }, 10);
        carousel.classList.add('paused');
      });
    });

    lightbox.addEventListener('click', () => {
      lightboxImg.classList.remove('scale-100');
      setTimeout(() => {
        lightbox.classList.add('hidden');
        carousel.classList.remove('paused');
      }, 300);
    });
  }
});
