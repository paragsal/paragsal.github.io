/* ============================================
   Parag Salgaonkar — Site Scripts
   Theme + Constellation + Scroll Reveals + Counter
   ============================================ */

// ---- Theme Toggle ----
(function () {
  const DARK = { r: 89, g: 150, b: 146 };
  const LIGHT = { r: 69, g: 122, b: 118 };

  // Expose accent for particles to read
  window.__themeAccent = DARK;

  function getPreferred() {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    window.__themeAccent = theme === "light" ? LIGHT : DARK;
    localStorage.setItem("theme", theme);
  }

  // Apply immediately (before paint)
  apply(getPreferred());

  // Toggle button
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      apply(current === "light" ? "dark" : "light");
    });
  });

  // Listen for OS preference changes
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      apply(e.matches ? "light" : "dark");
    }
  });
})();

// ---- Constellation Particles ----
(function () {
  const canvas = document.getElementById("constellation");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w, h, dpr;
  let mouse = { x: -1000, y: -1000 };
  const particles = [];
  const CONNECT_DIST = 130;
  const MOUSE_RADIUS = 180;

  function getAccent() {
    return window.__themeAccent || { r: 89, g: 150, b: 146 };
  }

  function getParticleCount() {
    if (window.innerWidth < 640) return 30;
    if (window.innerWidth < 900) return 45;
    return 65;
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    const count = getParticleCount();
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const A = getAccent();
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const dotAlpha = isLight ? 0.25 : 0.35;
    const lineAlphaMax = isLight ? 0.08 : 0.1;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.vx += (dx / dist) * force * 0.015;
        p.vy += (dy / dist) * force * 0.015;
      }

      p.vx *= 0.992;
      p.vy *= 0.992;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${A.r}, ${A.g}, ${A.b}, ${dotAlpha})`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * lineAlphaMax;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${A.r}, ${A.g}, ${A.b}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 150);
  });

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  createParticles();
  draw();
})();

// ---- Scroll Reveal ----
(function () {
  const els = document.querySelectorAll(".anim-scroll");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const siblings = parent
            ? Array.from(parent.children).filter((el) =>
                el.classList.contains("anim-scroll")
              )
            : [];
          const index = siblings.indexOf(entry.target);
          const delay = index >= 0 ? index * 0.08 : 0;
          entry.target.style.transitionDelay = `${delay}s`;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  els.forEach((el) => observer.observe(el));
})();

// ---- Animated Counters ----
(function () {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === "true";
    const duration = 1400;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = target * eased;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.round(current);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
})();

// ---- Typewriter Effect ----
(function () {
  const elements = document.querySelectorAll(".typewriter");
  if (!elements.length) return;

  elements.forEach((el) => {
    const text = el.dataset.text || "";
    const startDelay = parseInt(el.dataset.delay, 10) || 0;
    el.textContent = "";
    el.style.borderRight = "2px solid var(--accent)";

    setTimeout(() => {
      let i = 0;
      const speed = 55 + Math.random() * 25;
      function type() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed + (Math.random() - 0.5) * 30);
        } else {
          // Remove cursor after typing is done
          setTimeout(() => { el.style.borderRight = "none"; }, 600);
        }
      }
      type();
    }, startDelay);
  });
})();

// ---- Easter Egg Terminal ----
(function () {
  const overlay = document.getElementById("terminalOverlay");
  const input = document.getElementById("terminalInput");
  const output = document.getElementById("terminalOutput");
  const closeBtn = document.getElementById("terminalClose");
  if (!overlay || !input || !output) return;

  const commands = {
    help: () =>
      "Available commands:\n" +
      "  <span style='color:var(--accent)'>whoami</span>      — about me\n" +
      "  <span style='color:var(--accent)'>skills</span>      — tech stack\n" +
      "  <span style='color:var(--accent)'>experience</span>  — career history\n" +
      "  <span style='color:var(--accent)'>contact</span>     — get in touch\n" +
      "  <span style='color:var(--accent)'>certs</span>       — certifications\n" +
      "  <span style='color:var(--accent)'>education</span>   — degrees\n" +
      "  <span style='color:var(--accent)'>uptime</span>      — career uptime\n" +
      "  <span style='color:var(--accent)'>clear</span>       — clear screen\n" +
      "  <span style='color:var(--accent)'>exit</span>        — close terminal",
    whoami: () =>
      "Parag Salgaonkar\n" +
      "Senior Site Reliability Engineer\n" +
      "Focus: Infrastructure, Reliability, Scale",
    skills: () =>
      "cloud/       AWS · Terraform · ECS · K8s\n" +
      "languages/   Python · Go · Bash\n" +
      "ops/         CI/CD · Observability · IaC\n" +
      "ai-ml/       LLMs · RAG · Knowledge Graphs",
    experience: () =>
      "2023-now   Sr. SRE @ Osano Inc.\n" +
      "2021-2023  Sr. SRE @ WireWheel Inc.\n" +
      "2019-2021  DevOps Engineer @ WireWheel Inc.\n" +
      "2017-2018  Data Engineer @ WireWheel Inc.\n" +
      "2017       Software Dev @ JIFSAN (FDA/USDA)",
    contact: () =>
      "github:   <a href='https://github.com/paragsal' target='_blank' style='color:var(--accent)'>paragsal</a>\n" +
      "linkedin: <a href='https://linkedin.com/in/paragsal' target='_blank' style='color:var(--accent)'>paragsal</a>\n" +
      "email:    <a href='mailto:parag.s@live.in' style='color:var(--accent)'>parag.s@live.in</a>",
    certs: () =>
      "<span style='color:var(--green)'>●</span> AWS Certified Developer\n" +
      "<span style='color:var(--green)'>●</span> AWS Solutions Architect\n" +
      "<span style='color:var(--green)'>●</span> CKAD (Kubernetes)",
    education: () =>
      "M.S. Telecommunications Engineering\n" +
      "  University of Maryland, College Park — 2018\n\n" +
      "B.E. Electronics & Telecom Engineering\n" +
      "  University of Mumbai, India — 2016",
    uptime: () => {
      const start = new Date("2017-01-01");
      const now = new Date();
      const years = ((now - start) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
      return `Career uptime: ${years} years\nStatus: <span style='color:var(--green)'>● operational</span>\nIncidents: 0 unresolved`;
    },
    clear: () => "__CLEAR__",
    exit: () => "__EXIT__",
  };

  function addLine(html, isCmd) {
    const div = document.createElement("div");
    div.classList.add("terminal-line");
    if (isCmd) {
      div.innerHTML = `<span class="cmd-echo">$ ${html}</span>`;
    } else {
      div.innerHTML = html;
    }
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function processCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    addLine(raw, true);

    if (!cmd) return;

    if (commands[cmd]) {
      const result = typeof commands[cmd] === "function" ? commands[cmd]() : commands[cmd];
      if (result === "__CLEAR__") {
        output.innerHTML = "";
        return;
      }
      if (result === "__EXIT__") {
        toggle(false);
        return;
      }
      addLine(result);
    } else {
      addLine(`command not found: ${cmd}. Type <span style="color:var(--accent)">help</span> for available commands.`);
    }
  }

  function toggle(open) {
    if (open) {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      setTimeout(() => input.focus(), 100);
    } else {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  // Toggle with backtick key
  document.addEventListener("keydown", (e) => {
    if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const active = document.activeElement;
      // Don't trigger if typing in another input
      if (active && active !== input && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
      e.preventDefault();
      const isOpen = overlay.classList.contains("is-open");
      toggle(!isOpen);
    }
    // Escape to close
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      toggle(false);
    }
  });

  // Enter to run command
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      processCommand(input.value);
      input.value = "";
    }
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => toggle(false));
  }

  // Click overlay to close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) toggle(false);
  });
})();

// ---- Smooth Anchor Scroll ----
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
})();
