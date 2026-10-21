'use strict';
const $ = (id) => document.getElementById(id);
const phases = [
  { at: 0, label: '正在建立共鸣连接', log: 'INITIALIZING RESONANCE CORE...' },
  { at: 26, label: '正在同步月相数据', log: 'SYNCHRONIZING LUNAR FREQUENCIES...' },
  { at: 57, label: '正在唤醒智能核心', log: 'ALIGNING NEURAL CONSTELLATIONS...' },
  { at: 84, label: '共鸣即将完成', log: 'FINALIZING GPT INTERFACE...' },
];
let startedAt = 0;
let frame;
let transitionTimer;
let revealTimer;
let lastPhase = -1;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function startBoot() {
  cancelAnimationFrame(frame);
  clearTimeout(transitionTimer);
  clearTimeout(revealTimer);
  $('welcome').hidden = true;
  $('boot').hidden = false;
  $('boot').classList.remove('leaving');
  $('core-status').textContent = 'AWAKENING';
  startedAt = performance.now();
  lastPhase = -1;
  updateBoot(startedAt);
}
function updateBoot(now) {
  const elapsed = Math.min((now - startedAt) / 8200, 1);
  const value = Math.floor(100 * (1 - Math.pow(1 - elapsed, 1.35)));
  $('percent').textContent = String(value).padStart(2, '0');
  $('progress-fill').style.width = `${value}%`;
  $('progress').setAttribute('aria-valuenow', value);
  let index = phases.findLastIndex((phase) => value >= phase.at);
  if (index !== lastPhase) {
    $('phase').textContent = phases[index].label;
    $('terminal-line').textContent = phases[index].log;
    $('step').textContent = `0${index + 1} / 04`;
    $('announcement').textContent = phases[index].label;
    lastPhase = index;
  }
  if (elapsed < 1) {
    frame = requestAnimationFrame(updateBoot);
  } else {
    $('phase').textContent = '共鸣连接已建立';
    $('terminal-line').textContent = 'ALL SYSTEMS READY. WELCOME BACK.';
    $('core-status').textContent = 'ONLINE';
    $('announcement').textContent = '启动完成，GPT 共鸣终端已就绪。';
    transitionTimer = setTimeout(() => {
      $('boot').classList.add('leaving');
      revealTimer = setTimeout(() => {
        $('boot').hidden = true;
        $('welcome').hidden = false;
        $('replay').focus({ preventScroll: true });
      }, reducedMotion.matches ? 0 : 850);
    }, 650);
  }
}
$('replay').addEventListener('click', startBoot);
function updateClock() {
  $('clock').textContent = `${new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date())} / UTC+08:00`;
}
updateClock();
setInterval(updateClock, 1000);
const canvas = $('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let width = 0;
let height = 0;
let particleFrame;
let previousTime = 0;
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(65, Math.floor(width / 18)) }, () => ({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1.3 + .3, speed: Math.random() * .2 + .06, alpha: Math.random() * .45 + .1 }));
}
function drawParticles(time = 0) {
  const delta = previousTime ? Math.min((time - previousTime) / 16.67, 3) : 1;
  previousTime = time;
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    if (!reducedMotion.matches) p.y -= p.speed * delta;
    if (p.y < -5) p.y = height + 5;
    ctx.fillStyle = `rgba(181,245,219,${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!reducedMotion.matches && !document.hidden) particleFrame = requestAnimationFrame(drawParticles);
}
function refreshParticles() {
  cancelAnimationFrame(particleFrame);
  previousTime = 0;
  drawParticles();
}
if (ctx) {
  resize();
  refreshParticles();
  window.addEventListener('resize', () => { resize(); refreshParticles(); });
  reducedMotion.addEventListener('change', refreshParticles);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(particleFrame); else refreshParticles(); });
}
startBoot();
