/* ============================================================
   SCRIPT PRINCIPAL - REGALO INTERACTIVO PARA SAMANTHA
   ============================================================ */

// Estado global de la aplicación
let currentScene = 1;
const totalScenes = 3;

/* ============================================================
   CONFIGURACIÓN DE MÚSICA
   Puedes colocar canciones en la carpeta 'music/':
   - Opción A (Una canción general): nombra tu archivo 'cancion.mp3'
   - Opción B (Una canción por escena):
       'cancion1.mp3' (para Portada)
       'cancion2.mp3' (para Escena de la colina)
       'cancion3.mp3' (para Carta y flores)
   ============================================================ */
const musicTracks = {
  1: { src: "music/cancion1.mp3", title: "Nuestra Historia 💕", fallback: "music/cancion.mp3" },
  2: { src: "music/cancion2.mp3", title: "Un Momento Mágico ✨", fallback: "music/cancion.mp3" },
  3: { src: "music/cancion3.mp3", title: "Para Ti, Samantha 💌", fallback: "music/cancion.mp3" }
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
  setupWindCanvas();
  setupFireflies();

  const startBtn = document.getElementById("startBtn");
  const startOverlay = document.getElementById("startOverlay");

  startBtn.addEventListener("click", () => {
    startOverlay.classList.add("hidden");
    playSceneMusic(1);
  });
});

function setupMusicPlayer() {
  musicToggleBtn.addEventListener("click", () => {
    if (isAudioPlaying) {
      pauseMusic();
    } else {
      resumeMusic();
    }
  });

  audioEl.addEventListener("ended", () => {
    // Si la canción termina, repetirla
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  });

  // Manejo de error si la canción de la escena no existe, intenta fallback o silencio suave
  audioEl.addEventListener("error", () => {
    const sceneConfig = musicTracks[currentScene];
    if (sceneConfig && audioEl.src.includes(sceneConfig.src) && sceneConfig.fallback) {
      singleTrackMode = true;
      audioEl.src = sceneConfig.fallback;
      if (isAudioPlaying) audioEl.play().catch(() => {});
    } else {
      console.log("Aviso: No se encontró archivo de audio en music/. Coloca tu canción .mp3 en la carpeta music/");
      musicWidget.classList.remove("playing");
      isAudioPlaying = false;
      songTitleEl.textContent = "Agrega tu música 🎵";
    }
  });
}

function playSceneMusic(sceneNum) {
  const track = musicTracks[sceneNum];
  if (!track) return;

  // Si estamos en modo de una sola pista continua y ya está sonando, no reiniciar
  if (singleTrackMode && isAudioPlaying) {
    return;
  }

  songTitleEl.textContent = track.title;
  const targetSrc = singleTrackMode ? track.fallback : track.src;

  // Solo cambiar de fuente si es distinta
  if (!audioEl.src.endsWith(targetSrc)) {
    audioEl.src = targetSrc;
  }

  audioEl.play().then(() => {
    isAudioPlaying = true;
    musicWidget.classList.add("playing");
  }).catch(err => {
    console.log("Reproducción automática esperando interacción o archivo no encontrado:", err);
  });
}

function pauseMusic() {
  audioEl.pause();
  isAudioPlaying = false;
  musicWidget.classList.remove("playing");
}

function resumeMusic() {
  audioEl.play().then(() => {
    isAudioPlaying = true;
    musicWidget.classList.add("playing");
  }).catch(err => {
    console.log("No se pudo reproducir el audio:", err);
  });
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

    // Cambiar música de escena si corresponde
    if (!singleTrackMode && isAudioPlaying) {
      playSceneMusic(target);
    }

    // Scroll al inicio de la escena en pantallas pequeñas
    targetEl.scrollTop = 0;
  }
}

// Soporte para gestos táctiles de deslizamiento (Swipe) en celulares
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
    goToScene(currentScene + 1); // Deslizar hacia la izquierda -> Siguiente
  } else if (diff > threshold && currentScene > 1) {
    goToScene(currentScene - 1); // Deslizar hacia la derecha -> Anterior
  }
}

/* ============================================================
   ESCENA 2: SIMULACIÓN DE VIENTO Y HOJAS EN CANVAS
   ============================================================ */
function setupWindCanvas() {
  const canvas = document.getElementById("windCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Partículas de hojas y pétalos
  const particles = [];
  const particleCount = 28;

  class WindParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : -30;
      this.y = Math.random() * height * 0.8;
      this.speedX = 2.5 + Math.random() * 4.5;
      this.speedY = (Math.random() - 0.3) * 1.5;
      this.size = 6 + Math.random() * 9;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.08;
      this.type = Math.random() > 0.4 ? "leaf" : "petal"; // hojas o pétalos rosados
      this.color = this.type === "leaf"
        ? (Math.random() > 0.5 ? "rgba(95, 168, 62, 0.85)" : "rgba(125, 195, 75, 0.85)")
        : "rgba(255, 140, 165, 0.88)";
    }

    update() {
      this.x += this.speedX;
      this.y += Math.sin(this.x * 0.015) * 1.2 + this.speedY;
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
      // Dibujar forma orgánica de hoja o pétalo
      ctx.ellipse(0, 0, this.size, this.size * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();

      // Brillo central de la hoja
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.7, 0);
      ctx.lineTo(this.size * 0.7, 0);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Líneas de ráfagas de viento
  const windStreaks = [];
  const streakCount = 6;

  class WindStreak {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : -150;
      this.y = 50 + Math.random() * (height * 0.65);
      this.length = 60 + Math.random() * 110;
      this.speed = 5 + Math.random() * 6;
      this.opacity = 0.15 + Math.random() * 0.25;
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
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      // Curva suave simulando corriente de brisa
      ctx.quadraticCurveTo(
        this.x + this.length * 0.5,
        this.y + Math.sin(this.x * 0.02) * 12,
        this.x + this.length,
        this.y
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new WindParticle());
  }

  for (let i = 0; i < streakCount; i++) {
    windStreaks.push(new WindStreak());
  }

  // Interacción táctil: al tocar la pantalla de la escena 2 se genera una ráfaga
  canvas.parentElement.addEventListener("pointerdown", (e) => {
    if (currentScene !== 2) return;
    for (let i = 0; i < 8; i++) {
      const p = new WindParticle();
      p.x = e.clientX || width * 0.2;
      p.y = (e.clientY || height * 0.5) + (Math.random() - 0.5) * 40;
      p.speedX += 4;
      particles.push(p);
      if (particles.length > 50) particles.shift();
    }
  });

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
   LIGHTBOX DE FOTOS (Al tocar una foto en el celular)
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

  const hearts = ["❤️", "💖", "💕", "✨", "🌸", "🥰"];
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement("div");
    heart.className = "flying-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty("--vx", `${(Math.random() - 0.5) * 160}px`);
    heart.style.animationDelay = `${i * 0.06}s`;
    heart.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  }
}

