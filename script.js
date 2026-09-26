(() => {
  "use strict";

  /* ---------------- elements ---------------- */
  const heartsLayer   = document.getElementById("heartsLayer");
  const burstLayer    = document.getElementById("burstLayer");

  const stageGift      = document.getElementById("stageGift");
  const stageShow       = document.getElementById("stageShow");
  const stageMessage    = document.getElementById("stageMessage");
  const nameHeading      = document.getElementById("nameHeading");

  const giftBox     = document.getElementById("giftBox");
  const sideCard      = document.getElementById("sideCard");
  const photoFrame     = document.getElementById("photoFrame");
  const slideA        = document.getElementById("slideA");
  const slideB          = document.getElementById("slideB");

  const messageBox   = document.getElementById("messageBox");
  const typedTextEl    = document.getElementById("typedText");
  const caretEl          = document.getElementById("caret");
  const bgMusic        = document.getElementById("bgMusic");
  const soundFallback     = document.getElementById("soundFallback");

  nameHeading.textContent = CONFIG.name || "Ceyya";

  /* ---------------- ambient floating hearts ---------------- */
  const HEART_GLYPHS = ["💗", "💕", "💖", "❤", "💓"];

  function spawnHeart() {
    const el = document.createElement("span");
    el.className = "floating-heart";
    el.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)];
    const left = Math.random() * 100;
    const size = 14 + Math.random() * 20;
    const dur = 7 + Math.random() * 6;
    const drift = (Math.random() * 120 - 60).toFixed(0) + "px";
    const spin = (Math.random() * 360 - 180).toFixed(0) + "deg";
    el.style.left = left + "vw";
    el.style.setProperty("--size", size + "px");
    el.style.setProperty("--dur", dur + "s");
    el.style.setProperty("--drift", drift);
    el.style.setProperty("--spin", spin);
    heartsLayer.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 200);
  }
  setInterval(spawnHeart, 550);
  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 300);

  /* ---------------- gift opening burst ---------------- */
  function burstOpen() {
    const rect = giftBox.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const glyphs = ["💗", "✨", "💕", "🎉", "💖"];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("span");
      p.className = "burst-particle";
      p.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 160;
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.setProperty("--bx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--by", Math.sin(angle) * dist - 40 + "px");
      p.style.setProperty("--bs", (0.6 + Math.random() * 0.8).toFixed(2));
      p.style.setProperty("--br", Math.random() * 180 + "deg");
      p.style.fontSize = 14 + Math.random() * 14 + "px";
      burstLayer.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }

  function switchStage(fromEl, toEl) {
    fromEl.classList.remove("stage-active");
    toEl.classList.add("stage-active");
  }

  let giftOpened = false;
  giftBox.addEventListener("click", () => {
    if (giftOpened) return;
    giftOpened = true;
    giftBox.classList.add("opened");
    burstOpen();
    setTimeout(() => {
      switchStage(stageGift, stageShow);
      startSlideshow();
      setTimeout(() => sideCard.classList.add("is-visible"), 250);
    }, 750);
  });

  /* ---------------- slideshow ---------------- */
  const PHOTOS = (CONFIG.photos || []).filter(Boolean);
  let slideIndex = 0;
  let showingA = true;
  let slideshowStarted = false;
  let dockTimer = null;

  function applySlide(imgEl, src) {
    imgEl.src = src;
  }

  function advanceSlide() {
    if (PHOTOS.length === 0) return;
    slideIndex = (slideIndex + 1) % PHOTOS.length;
    const next = PHOTOS[slideIndex];
    const incoming = showingA ? slideB : slideA;
    const outgoing = showingA ? slideA : slideB;
    applySlide(incoming, next);
    incoming.classList.add("is-visible");
    outgoing.classList.remove("is-visible");
    showingA = !showingA;
  }

  function startSlideshow() {
    if (slideshowStarted || PHOTOS.length === 0) return;
    slideshowStarted = true;
    applySlide(slideA, PHOTOS[0]);
    slideA.classList.add("is-visible");
    slideIndex = 0;

    // full cycle = 5 photos x 5s = 25s, then dock + reveal message
    setInterval(advanceSlide, 5000);

    dockTimer = setTimeout(() => {
      dockPhotoFrame();
    }, PHOTOS.length * 5000);
  }

  function dockPhotoFrame() {
    photoFrame.classList.add("docked");
    setTimeout(() => {
      switchStage(stageShow, stageMessage);
      messageBox.classList.add("is-visible");
      startTyping();
    }, 700);
  }

  /* ---------------- typing effect + tick sound ---------------- */
  let audioCtx = null;
  function tick() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = 920 + Math.random() * 140;
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.045);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) { /* audio not available, ignore */ }
  }

  function startTyping() {
    const text = CONFIG.message || "";
    let i = 0;
    typedTextEl.textContent = "";
    const interval = setInterval(() => {
      const ch = text[i];
      typedTextEl.textContent += ch;
      if (ch && !/\s/.test(ch) && i % 2 === 0) tick();
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        caretEl.classList.add("hidden");
        setTimeout(playMusic, 700);
      }
    }, 32);
  }

  /* ---------------- music ---------------- */
  function playMusic() {
    if (!CONFIG.musicUrl) return;
    bgMusic.src = CONFIG.musicUrl;
    bgMusic.loop = true;
    const p = bgMusic.play();
    if (p && p.catch) {
      p.catch(() => {
        soundFallback.hidden = false;
      });
    }
  }
  // safety net in case `loop` doesn't restart the track on some browsers
  bgMusic.addEventListener("ended", () => {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  });
  soundFallback.addEventListener("click", () => {
    bgMusic.play().then(() => { soundFallback.hidden = true; }).catch(() => {});
  });
})();
