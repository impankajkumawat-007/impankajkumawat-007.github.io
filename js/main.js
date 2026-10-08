const root = document.documentElement;
const header = document.getElementById("header");
const themeBtn = document.getElementById("theme-toggle");
const themeEmoji = document.getElementById("theme-emoji");
const toTop = document.getElementById("to-top");
const menuBtn = document.getElementById("menu-btn");

const saved = localStorage.getItem("theme");
if (saved) root.dataset.theme = saved;
syncTheme();

themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("theme", root.dataset.theme);
  syncTheme();
});

function syncTheme() {
  themeEmoji.textContent = root.dataset.theme === "light" ? "☀️" : "🌙";
}

let lastY = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("hide", y > lastY && y > 120);
  lastY = y;
  toTop.hidden = y < 400;
}, { passive: true });

toTop.hidden = true;
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    menuBtn.checked = false;
  });
});

const bars = document.querySelectorAll(".bar");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in");
  });
}, { threshold: 0.4 });
bars.forEach((bar) => observer.observe(bar));

document.getElementById("resume").addEventListener("click", () => {
  const link = document.createElement('a');
  link.href = 'resume.pdf'; // Path to your PDF file
  link.download = 'resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

function playLottie(el) {
  if (!window.lottie || el.dataset.playing) return;
  el.dataset.playing = "true";
  window.lottie.loadAnimation({
    container: el,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: el.dataset.lottie,
  });
}

const lottieEls = [...document.querySelectorAll("[data-lottie]")];
lottieEls.forEach((el) => {
  const start = () => playLottie(el);
  if ("IntersectionObserver" in window) {
    const watch = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          watch.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    watch.observe(el);
  } else {
    start();
  }
});
