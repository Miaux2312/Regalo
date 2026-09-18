/* ============================================================
   SCRIPT PRINCIPAL - REGALO INTERACTIVO PARA SAMANTHA
   ============================================================ */

// Estado global de la aplicación
let currentScene = 1;
const totalScenes = 3;

/* ============================================================
   CONFIGURACIÓN DE MÚSICA
   ============================================================ */
const musicTracks = {
  1: { src: "music/cancion1.mp3", title: "Mi para siempre 💕", fallback: "music/cancion.mp3" },
  2: { src: "music/cancion2.mp3", title: "MI MORFINA", fallback: "music/cancion.mp3" },
  3: { src: "music/cancion3.mp3", title: "Para Ti, Mi Amor 💌", fallback: "music/cancion.mp3" }
};

const audioEl = document.getElementById("bgAudio");
const musicWidget = document.getElementById("musicWidget");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const songTitleEl = document.getElementById("songTitle");
let isAudioPlaying = false;
let singleTrackMode = false;

/* ============================================================
   INICIO & DESBLOQUEO DE AUDIO EN CELULARES
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  setupMusicPlayer();
  setupScene1Petals();
  setupWindCanvas();
  setupStars();
  setupFireflies();
  setupFallingPetals();

  const startBtn = document.getElementById("startBtn");
  const startOverlay = document.getElementById("startOverlay");

  if (startBtn && startOverlay) {
    startBtn.addEventListener("click", () => {
      startOverlay.classList.add("hidden");
      playSceneMusic(1);
    });
  }
});

function setupMusicPlayer() {
  if (!musicToggleBtn || !audioEl) return;

  musicToggleBtn.addEventListener("click", () => {
    if (isAudioPlaying) {
      pauseMusic();
    } else {
      resumeMusic();
    }
  });

  audioEl.addEventListener("ended", () => {
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  });

  audioEl.addEventListener("error", () => {
    const sceneConfig = musicTracks[currentScene];
    if (sceneConfig && audioEl.src.includes(sceneConfig.src) && sceneConfig.fallback) {
      singleTrackMode = true;
      audioEl.src = sceneConfig.fallback;
      if (isAudioPlaying) audioEl.play().catch(() => {});
    } else {
      musicWidget.classList.remove("playing");
      isAudioPlaying = false;
      songTitleEl.textContent = "Agrega tu música 🎵";
    }
  });
}

function playSceneMusic(sceneNum) {
  const track = musicTracks[sceneNum];
  if (!track || !audioEl) return;

  if (singleTrackMode && isAudioPlaying) {
    return;
  }

  if (songTitleEl) songTitleEl.textContent = track.title;
  const targetSrc = singleTrackMode ? track.fallback : track.src;

  if (!audioEl.src.endsWith(targetSrc)) {
    audioEl.src = targetSrc;
  }

  audioEl.play().then(() => {
    isAudioPlaying = true;
    if (musicWidget) musicWidget.classList.add("playing");
  }).catch(() => {});
}

function pauseMusic() {
  if (!audioEl) return;
  audioEl.pause();
  isAudioPlaying = false;
  if (musicWidget) musicWidget.classList.remove("playing");
}

function resumeMusic() {
  if (!audioEl) return;
  audioEl.play().then(() => {
    isAudioPlaying = true;
    if (musicWidget) musicWidget.classList.add("playing");
  }).catch(() => {});
}

/* ============================================================
   NAVEGACIÓN ENTRE ESCENAS
   ============================================================ */
function goToScene(target) {
  if (target < 1 || target > totalScenes || target === currentScene) return;

  const currentEl = document.getElementById(`scene${currentScene}`);
  const targetEl = document.getElementById(`scene${target}`);

  if (currentEl && targetEl) {
    currentEl.classList.remove("active");
    targetEl.classList.add("active");
    currentScene = target;

    // Actualizar puntos de navegación
    const dots = document.querySelectorAll(".dot-btn");
    dots.forEach((dot, idx) => {
      if (idx + 1 === target) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    // Ajustar dimensiones de canvas al entrar a escena 2
    if (target === 2) {
      resizeWindCanvas();
    }

    // Cambiar música de escena si corresponde
    if (!singleTrackMode && isAudioPlaying) {
      playSceneMusic(target);
    }

    // Scroll al inicio de la escena en pantallas pequeñas
    targetEl.scrollTop = 0;
  }
}

// Soporte para gestos táctiles tipo Swipe en celulares
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const threshold = 65;
  const diff = touchEndX - touchStartX;
  if (diff < -threshold && currentScene < totalScenes) {
    goToScene(currentScene + 1);
  } else if (diff > threshold && currentScene > 1) {
    goToScene(currentScene - 1);
  }
}

/* ============================================================
   ESCENA 1: PÉTALOS DE FLORES CAYENDO
   ============================================================ */
function setupScene1Petals() {
  const container = document.getElementById("scene1Petals");
  if (!container) return;

  const petalCount = 14;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("div");
    petal.className = "scene1-petal";
    petal.style.left = `${Math.random() * 96}%`;
    petal.style.animationDelay = `${Math.random() * 6}s`;
    petal.style.animationDuration = `${5 + Math.random() * 4}s`;
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(petal);
  }
}

/* ============================================================
   ESCENA 2: SIMULACIÓN DE VIENTO Y HOJAS DE SAUCE EN CANVAS
   ============================================================ */
let resizeWindCanvas = () => {};

function setupWindCanvas() {
  const canvas = document.getElementById("windCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  resizeWindCanvas = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  window.addEventListener("resize", resizeWindCanvas);

  // Partículas de viento: hojas de sauce llorón y margaritas amarillas
  const particles = [];
  const particleCount = 36;

  class MorfinaWindParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : -30;
      this.y = Math.random() * (height * 0.85);
      this.speedX = 2.2 + Math.random() * 4.2;
      this.speedY = (Math.random() - 0.35) * 1.5;
      this.size = 6 + Math.random() * 8;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.08;
      // 60% hojas finas de sauce llorón, 40% pétalos amarillos de margaritas de Morfina
      this.type = Math.random() > 0.4 ? "willow-leaf" : "yellow-petal";
      this.color = this.type === "willow-leaf"
        ? (Math.random() > 0.5 ? "rgba(72, 99, 60, 0.88)" : "rgba(90, 122, 75, 0.88)")
        : "rgba(254, 240, 138, 0.94)";
    }

    update() {
      this.x += this.speedX;
      this.y += Math.sin(this.x * 0.018) * 1.2 + this.speedY;
      this.angle += this.angularSpeed;

      if (this.x > width + 40 || this.y > height + 40 || this.y < -40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.fillStyle = this.color;
      ctx.beginPath();
      if (this.type === "willow-leaf") {
        // Hoja delgada y alargada de sauce llorón
        ctx.ellipse(0, 0, this.size * 1.4, this.size * 0.35, 0, 0, Math.PI * 2);
      } else {
        // Pétalo de margarita amarilla redondeado
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.restore();
    }
  }

  // Ráfagas suaves de brisa
  const windStreaks = [];
  const streakCount = 6;

  class WindStreak {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : -160;
      this.y = 50 + Math.random() * (height * 0.65);
      this.length = 80 + Math.random() * 120;
      this.speed = 5 + Math.random() * 5.5;
      this.opacity = 0.18 + Math.random() * 0.22;
    }

    update() {
      this.x += this.speed;
      if (this.x - this.length > width) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.quadraticCurveTo(
        this.x + this.length * 0.5,
        this.y + Math.sin(this.x * 0.02) * 14,
        this.x + this.length,
        this.y
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new MorfinaWindParticle());
  }

  for (let i = 0; i < streakCount; i++) {
    windStreaks.push(new WindStreak());
  }

  // Interacción táctil: generar ráfaga al tocar en la escena 2
  const scene2El = document.getElementById("scene2");
  if (scene2El) {
    scene2El.addEventListener("pointerdown", (e) => {
      if (currentScene !== 2) return;
      for (let i = 0; i < 10; i++) {
        const p = new MorfinaWindParticle();
        p.x = e.clientX || width * 0.2;
        p.y = (e.clientY || height * 0.5) + (Math.random() - 0.5) * 60;
        p.speedX += 4.2;
        particles.push(p);
        if (particles.length > 60) particles.shift();
      }
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    if (currentScene === 2) {
      for (const streak of windStreaks) {
        streak.update();
        streak.draw();
      }
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================================
   ESCENA 3: ESTRELLAS PARPADEANTES
   ============================================================ */
function setupStars() {
  const container = document.getElementById("starsLayer");
  if (!container) return;

  const starCount = 45;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2.5 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 95}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    star.style.opacity = `${0.3 + Math.random() * 0.7}`;
    container.appendChild(star);
  }
}

/* ============================================================
   ESCENA 3: LUCIÉRNAGAS FLOTANTES
   ============================================================ */
function setupFireflies() {
  const container = document.getElementById("firefliesLayer");
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const firefly = document.createElement("div");
    firefly.className = "firefly";
    firefly.style.left = `${Math.random() * 100}%`;
    firefly.style.top = `${Math.random() * 100}%`;
    firefly.style.animationDelay = `${Math.random() * 5}s`;
    firefly.style.animationDuration = `${4 + Math.random() * 4}s`;
    container.appendChild(firefly);
  }
}

/* ============================================================
   ESCENA 3: PÉTALOS DE ROSA CAYENDO
   ============================================================ */
function setupFallingPetals() {
  const container = document.getElementById("fallingPetalsLayer");
  if (!container) return;

  const petalCount = 12;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("div");
    petal.className = "falling-petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 8}s`;
    petal.style.animationDuration = `${6 + Math.random() * 5}s`;
    container.appendChild(petal);
  }
}

/* ============================================================
   LIGHTBOX DE FOTOS
   ============================================================ */
function openPhoto(cardElement) {
  const img = cardElement.querySelector("img");
  const lightbox = document.getElementById("photoLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  if (img && lightbox && lightboxImg) {
    lightboxImg.src = img.src;
    lightboxCaption.textContent = cardElement.querySelector(".photo-label")?.textContent || "Recuerdo Especial";
    lightbox.classList.add("active");
  }
}

function closePhoto() {
  const lightbox = document.getElementById("photoLightbox");
  if (lightbox) {
    lightbox.classList.remove("active");
  }
}

/* ============================================================
   REACCIÓN DE AMOR: RÁFAGA DE CORAZONES FLOTANTES
   ============================================================ */
function sendHeartBurst(e) {
  const x = e.clientX || window.innerWidth / 2;
  const y = e.clientY || window.innerHeight * 0.7;

  const hearts = ["❤️", "💖", "💕", "✨", "🌸", "🥰", "🌹", "🌼"];
  for (let i = 0; i < 14; i++) {
    const heart = document.createElement("div");
    heart.className = "flying-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--vx", `${(Math.random() - 0.5) * 180}px`);
    heart.style.animationDelay = `${i * 0.05}s`;
    heart.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}
