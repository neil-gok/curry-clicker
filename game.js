'use strict';

// ============================================================
//  BUILDINGS
// ============================================================
const BUILDINGS = [
  { id: 'bike',        name: "Amir's Bike",      emoji: '🛵', baseCost: 10,       baseCps: 0.1,   desc: '0.1/sec',   count: 0, boost: 1 },
  { id: 'chapati',     name: 'Chapati Stand',    emoji: '🫓', baseCost: 100,      baseCps: 0.5,   desc: '0.5/sec',   count: 0, boost: 1 },
  { id: 'tandoor',     name: 'Tandoor',          emoji: '🔥', baseCost: 500,      baseCps: 3,     desc: '3/sec',     count: 0, boost: 1 },
  { id: 'curryhouse',  name: 'Curry House',      emoji: '🍛', baseCost: 2000,     baseCps: 15,    desc: '15/sec',    count: 0, boost: 1 },
  { id: 'spicemarket', name: 'Spice Market',     emoji: '🌶️', baseCost: 10000,    baseCps: 80,    desc: '80/sec',    count: 0, boost: 1 },
  { id: 'bollywood',   name: 'Bollywood Studio', emoji: '🎬', baseCost: 50000,    baseCps: 500,   desc: '500/sec',   count: 0, boost: 1 },
  { id: 'taj',         name: 'Taj Mahal',        emoji: '🕌', baseCost: 500000,   baseCps: 3000,  desc: '3,000/sec', count: 0, boost: 1 },
  { id: 'dimension',   name: 'Curry Dimension',  emoji: '🌀', baseCost: 10000000, baseCps: 50000, desc: '50K/sec',   count: 0, boost: 1 },
];

// ============================================================
//  UPGRADES
// ============================================================
const UPGRADES = [
  { id: 'ladle',     name: 'Golden Ladle',    emoji: '🥄', cost: 50,     desc: '2× click',         type: 'click',    bid: null,          multi: 2,  bought: false, cond: s => s.totalCurry >= 10 },
  { id: 'rack',      name: 'Spice Rack',      emoji: '🌿', cost: 500,    desc: '2× click',         type: 'click',    bid: null,          multi: 2,  bought: false, cond: s => s.totalCurry >= 100 },
  { id: 'spoon',     name: 'Sacred Spoon',    emoji: '✨', cost: 5000,   desc: '2× click',         type: 'click',    bid: null,          multi: 2,  bought: false, cond: s => s.totalCurry >= 1000 },
  { id: 'blessing',  name: "Amir's Blessing", emoji: '🙏', cost: 50000,  desc: '5× click',         type: 'click',    bid: null,          multi: 5,  bought: false, cond: s => s.totalCurry >= 10000 },
  { id: 'godcurry',  name: "God's Own Curry", emoji: '⚡', cost: 500000, desc: '10× click',        type: 'click',    bid: null,          multi: 10, bought: false, cond: s => s.totalCurry >= 100000 },
  { id: 'turbobike', name: 'Turbo Bike',      emoji: '💨', cost: 100,    desc: "2× Amir's Bike",   type: 'building', bid: 'bike',        multi: 2,  bought: false, cond: () => getB('bike').count >= 3 },
  { id: 'flour',     name: 'Better Flour',    emoji: '🌾', cost: 1000,   desc: '2× Chapati Stand', type: 'building', bid: 'chapati',     multi: 2,  bought: false, cond: () => getB('chapati').count >= 3 },
  { id: 'coal',      name: 'Premium Coal',    emoji: '♨️', cost: 5000,   desc: '2× Tandoor',       type: 'building', bid: 'tandoor',     multi: 2,  bought: false, cond: () => getB('tandoor').count >= 3 },
  { id: 'michelin',  name: 'Michelin Star',   emoji: '⭐', cost: 20000,  desc: '2× Curry House',   type: 'building', bid: 'curryhouse',  multi: 2,  bought: false, cond: () => getB('curryhouse').count >= 3 },
  { id: 'silkroad',  name: 'Silk Road',       emoji: '🐪', cost: 100000, desc: '2× Spice Market',  type: 'building', bid: 'spicemarket', multi: 2,  bought: false, cond: () => getB('spicemarket').count >= 3 },
];

// ============================================================
//  MILESTONES
// ============================================================
const MILESTONES = [
  { at: 100,        msg: '100 CURRY! Amir is proud, sir!' },
  { at: 1000,       msg: '1,000 CURRY! You built different!' },
  { at: 10000,      msg: '10K CURRY! I deliver your curry, sir!' },
  { at: 100000,     msg: '100K CURRY! It\'s okay, sir!' },
  { at: 1000000,    msg: '1 MILLION CURRY! The GOAT of curry!' },
  { at: 1000000000, msg: '1 BILLION CURRY! LEGENDARY!' },
];

// ============================================================
//  STATE
// ============================================================
const state = {
  curry:            0,
  totalCurry:       0,
  clickMulti:       1,
  nextMilestoneIdx: 0,
};

let gameStarted = false;
const MAX_LIVES = 3;
let lives = MAX_LIVES;

const getB         = id => BUILDINGS.find(b => b.id === id);
const buildingCost = b  => Math.ceil(b.baseCost * Math.pow(1.15, b.count));
const totalCps     = () => BUILDINGS.reduce((s, b) => s + b.count * b.baseCps * b.boost, 0);
const clickValue   = () => Math.max(1, state.clickMulti);

// ============================================================
//  FORMATTING
// ============================================================
function fmt(n) {
  n = Math.floor(n);
  if (n < 1000)  return n.toString();
  if (n < 1e6)   return (n/1e3).toFixed(1).replace(/\.0$/,'')  + 'K';
  if (n < 1e9)   return (n/1e6).toFixed(1).replace(/\.0$/,'')  + 'M';
  if (n < 1e12)  return (n/1e9).toFixed(1).replace(/\.0$/,'')  + 'B';
  return               (n/1e12).toFixed(1).replace(/\.0$/,'')  + 'T';
}

function fmtCps(n) {
  if (n === 0) return '0';
  if (n < 1)   return n.toFixed(2);
  if (n < 10)  return n.toFixed(1);
  if (n < 1e3) return Math.round(n).toString();
  return fmt(n);
}

// ============================================================
//  COMBO SYSTEM
// ============================================================
let comboCount  = 0;
let lastHitTime = 0;
const COMBO_TIMEOUT = 1200; // ms without a hit before combo resets

function getComboMulti() {
  if (comboCount < 2)  return 1;
  if (comboCount < 5)  return comboCount;      // ×2, ×3, ×4
  if (comboCount < 10) return 5;               // ×5
  if (comboCount < 20) return 10;              // ×10
  return 20;                                   // ×20 cap
}

function incrementCombo() {
  comboCount++;
  lastHitTime = Date.now();
  updateComboDisplay();
}

function resetCombo() {
  if (comboCount >= 3) flashComboBreak();
  comboCount = 0;
  updateComboDisplay();
}

function checkComboTimeout() {
  if (comboCount > 0 && Date.now() - lastHitTime > COMBO_TIMEOUT) resetCombo();
}

function updateComboDisplay() {
  const el = document.getElementById('combo-display');
  if (!el) return;
  if (comboCount >= 2) {
    const m = getComboMulti();
    el.textContent   = '×' + m + ' COMBO!';
    el.dataset.tier  = comboCount >= 20 ? 'max' : comboCount >= 10 ? 'high' : comboCount >= 5 ? 'mid' : 'low';
    el.style.display = 'block';
    el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  } else {
    el.style.display = 'none';
  }
}

function flashComboBreak() {
  const el = document.getElementById('combo-display');
  if (!el) return;
  el.textContent   = '💔 COMBO LOST!';
  el.dataset.tier  = 'lost';
  el.style.display = 'block';
  setTimeout(() => { if (comboCount === 0) el.style.display = 'none'; }, 700);
}

// ============================================================
//  FLOAT TEXT HELPER
// ============================================================
function spawnFloat(x, y, text, isCombo, isMiss) {
  const div = document.createElement('div');
  div.className = 'float-text' + (isCombo ? ' float-combo' : '') + (isMiss ? ' float-miss' : '');
  div.textContent = text;
  div.style.left  = (x - 50) + 'px';
  div.style.top   = (y - 10) + 'px';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 950);
}

// ============================================================
//  RENDER
// ============================================================
function renderStats() {
  const cps = fmtCps(totalCps());
  document.getElementById('curry-count').textContent = fmt(state.curry);
  document.getElementById('cps-display').textContent = cps + '/sec';
  document.getElementById('shop-total').textContent  = fmt(state.totalCurry);
  document.getElementById('click-val').textContent   = fmt(clickValue());
  document.getElementById('shop-cps').textContent    = cps;
  renderLives();
}

function renderLives() {
  const el = document.getElementById('lives-display');
  if (!el) return;
  el.textContent = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, MAX_LIVES - lives));
}

function loseLife() {
  if (!gameStarted || lives <= 0) return;
  lives--;
  renderLives();
  const el = document.getElementById('lives-display');
  if (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  if (lives <= 0) gameOver();
}

function gameOver() {
  gameStarted = false;
  clearTimeout(beatTimer);
  beatTimer = null;
  if (masterGain) masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.6);
  document.getElementById('amir-sprite').style.animationPlayState = 'paused';
  document.getElementById('go-score').textContent = fmt(state.totalCurry);
  const goScreen = document.getElementById('gameover-screen');
  goScreen.style.display = 'flex';
}

function resetGame() {
  localStorage.removeItem('cc-save');
  window.location.reload();
}

function renderShop() {
  // Upgrades
  const upgEl = document.getElementById('upgrades-list');
  const avail = UPGRADES.filter(u => !u.bought && u.cond(state));
  if (!avail.length) {
    upgEl.innerHTML = '<p class="empty-msg">Keep clicking to unlock!</p>';
  } else {
    upgEl.innerHTML = avail.map(u => {
      const ok = state.curry >= u.cost;
      return `<div class="shop-item${ok?' can-afford':''}" onclick="buyUpgrade('${u.id}')">
        <span class="s-emoji">${u.emoji}</span>
        <div class="s-info">
          <div class="s-name">${u.name}</div>
          <div class="s-desc">${u.desc}</div>
          <span class="upg-tag">UPGRADE</span>
        </div>
        <div class="s-cost">🍛${fmt(u.cost)}</div>
      </div>`;
    }).join('');
  }

  // Buildings
  document.getElementById('buildings-list').innerHTML = BUILDINGS.map(b => {
    const cost = buildingCost(b);
    const ok   = state.curry >= cost;
    const sub  = b.count > 0
      ? `<div class="s-count">×${b.count} · ${fmtCps(b.count*b.baseCps*b.boost)}/sec</div>`
      : `<div class="s-desc">${b.desc}</div>`;
    return `<div class="shop-item${ok?' can-afford':''}" onclick="buyBuilding('${b.id}')">
      <span class="s-emoji">${b.emoji}</span>
      <div class="s-info">
        <div class="s-name">${b.name}</div>${sub}
      </div>
      <div class="s-cost">🍛${fmt(cost)}</div>
    </div>`;
  }).join('');
}

function render() { renderStats(); renderShop(); }

// ============================================================
//  PURCHASES
// ============================================================
function buyBuilding(id) {
  const b = getB(id), cost = buildingCost(b);
  if (state.curry < cost) return;
  state.curry -= cost;
  b.count++;
  render();
}

function buyUpgrade(id) {
  const u = UPGRADES.find(u => u.id === id);
  if (!u || u.bought || state.curry < u.cost) return;
  state.curry -= u.cost;
  u.bought = true;
  if (u.type === 'click') {
    state.clickMulti *= u.multi;
  } else if (u.type === 'building') {
    const b = getB(u.bid);
    if (b) b.boost *= u.multi;
  }
  render();
}

// ============================================================
//  CLICK HANDLER
// ============================================================
document.getElementById('amir-char').addEventListener('click', e => {
  e.stopPropagation();

  if (!gameStarted) { startGame(); return; }

  incrementCombo();
  const multi = getComboMulti();
  const val   = clickValue() * multi;
  state.curry      += val;
  state.totalCurry += val;

  // Flash Amir
  const el = document.getElementById('amir-char');
  el.classList.add('hit');
  setTimeout(() => el.classList.remove('hit'), 140);

  // Floating text — show multiplier when combo active
  const label = multi > 1 ? `+${fmt(val)} 🍛 ×${multi}` : `+${fmt(val)} 🍛`;
  spawnFloat(e.clientX, e.clientY, label, multi > 1, false);

  checkMilestones();
  renderStats();
  tryStartMusic();
});

// ============================================================
//  JUMP PHYSICS
// ============================================================
const GROUND_H   = 58;   // must match CSS --ground-h
const GRAVITY    = 0.9;  // px deceleration per frame-unit
const JUMP_FORCE = 20;   // initial upward velocity

let amirY     = 0;   // px above ground
let amirVY    = 0;   // current vertical velocity
let amirScale = 1.0; // shrinks as curry grows

function applyAmirTransform() {
  document.getElementById('amir-char').style.transform =
    `translateY(${-amirY}px) scale(${amirScale})`;
}

function doJump() {
  if (amirY > 4) return; // already airborne
  amirVY = JUMP_FORCE;
}

function updateJump(dt) {
  if (amirY <= 0 && amirVY <= 0) return;
  const scale = dt / 16;
  amirVY -= GRAVITY * scale;
  amirY   = Math.max(0, amirY + amirVY * scale);
  applyAmirTransform();
  if (amirY <= 0) amirVY = 0;
}

// Auto-jump
let autoJumpTimer = 0;
let nextAutoJump  = 3000 + Math.random() * 2000;

function updateAutoJump(dt) {
  if (amirY > 4) { autoJumpTimer = 0; return; }
  autoJumpTimer += dt;
  if (autoJumpTimer >= nextAutoJump) {
    doJump();
    autoJumpTimer = 0;
    // Jumps get more frequent as curry grows (3–5s → 0.8–1.5s at max)
    const log = Math.log10(state.totalCurry + 1);
    const minJ = Math.max(800,  3000 - log * 350);
    const maxJ = Math.max(1500, 5000 - log * 500);
    nextAutoJump = minJ + Math.random() * (maxJ - minJ);
  }
}

// ============================================================
//  OBSTACLES
// ============================================================
const OBS_TYPES = [
  { emoji: '🔥', size: 210, speedM: 0.9,  front: true  },  // Tandoor
  { emoji: '🐄', size: 185, speedM: 1.0,  front: false },  // Sacred Cow
  { emoji: '🛺', size: 200, speedM: 1.05, front: true  },  // Rickshaw
  { emoji: '🌶️', size: 215, speedM: 1.35, front: true  },  // Giant Pepper
  { emoji: '🏗️', size: 255, speedM: 0.85, front: true  },  // Scaffolding
  { emoji: '🍛', size: 170, speedM: 1.2,  front: false },  // Curry Pot
  { emoji: '🐘', size: 235, speedM: 0.75, front: true  },  // Elephant
  { emoji: '🎡', size: 250, speedM: 0.8,  front: true  },  // Ferris Wheel
  { emoji: '🧱', size: 210, speedM: 1.1,  front: true  },  // Wall
  { emoji: '🪘', size: 175, speedM: 1.25, front: false },  // Dhol Drum
  { emoji: '🐪', size: 230, speedM: 0.95, front: true  },  // Camel
  { emoji: '🏢', size: 280, speedM: 0.65, front: true  },  // Building
  { emoji: '🕌', size: 262, speedM: 0.7,  front: true  },  // Temple
  { emoji: '🐫', size: 232, speedM: 1.0,  front: false },  // Bactrian Camel
];

let obstacles  = [];
let obsTimer   = 0;
let nextObs    = 2000;

function worldSpeed() {
  return Math.min(540, 160 + Math.log10(state.totalCurry + 1) * 75);
}

function obsInterval() {
  // 1900ms → 350ms as curry grows — twice as many obstacles as before
  return Math.max(350, 1900 - Math.log10(state.totalCurry + 1) * 220);
}

function spawnObstacle() {
  const type  = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)];
  const layer = document.getElementById('obstacles-layer');

  const el = document.createElement('div');
  el.className      = 'obstacle';
  el.textContent    = type.emoji;
  el.style.fontSize = type.size + 'px';
  el.style.bottom   = GROUND_H + 'px';
  el.style.zIndex   = type.front ? '8' : '3';

  // Front obstacles block clicks — hitting one loses a life and breaks combo
  if (type.front) {
    el.style.pointerEvents = 'auto';
    el.style.cursor        = 'not-allowed';
    el.addEventListener('click', e => {
      e.stopPropagation();
      if (!gameStarted) return;
      resetCombo();
      el.classList.add('obstacle-hit');
      setTimeout(() => el.classList.remove('obstacle-hit'), 350);
      spawnFloat(e.clientX, e.clientY, '💔 -1 LIFE!', false, true);
      loseLife();
    });
  }

  const startX = window.innerWidth + 80;
  el.style.left = startX + 'px';
  layer.appendChild(el);

  obstacles.push({ el, x: startX, speedM: type.speedM });
}

function updateObstacles(dt) {
  if (!gameStarted) return;
  obsTimer += dt;
  if (obsTimer >= nextObs) {
    spawnObstacle();
    obsTimer = 0;
    nextObs  = obsInterval();
  }

  const spd = worldSpeed() * (dt / 1000);
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.x -= spd * o.speedM;
    o.el.style.left = o.x + 'px';
    if (o.x < -150) {
      o.el.remove();
      obstacles.splice(i, 1);
    }
  }
}

// ============================================================
//  AMIR SPEED / SIZE / FIRE — called from 500ms interval
// ============================================================
function updateAmirSpeed() {
  const spd = worldSpeed();           // 140 → 420 px/s
  const ratio = 140 / spd;           // 1 → 0.333
  const dur   = Math.max(0.08, 0.3 * ratio).toFixed(3) + 's';
  const sprite = document.getElementById('amir-sprite');
  if (sprite) sprite.style.animationDuration = dur;
  document.querySelectorAll('.a-arm-l, .a-arm-r, .a-leg-l, .a-leg-r, .a-shadow').forEach(el => {
    el.style.animationDuration = dur;
  });
  const ground = document.getElementById('ground');
  if (ground) ground.style.animationDuration = Math.max(0.18, 0.9 * ratio).toFixed(3) + 's';
}

function updateAmirSize() {
  // Scale 1.0 → 0.42 as log10(totalCurry) grows 0 → 7
  const newScale = Math.max(0.42, 1 - Math.log10(state.totalCurry + 1) * 0.083);
  if (Math.abs(newScale - amirScale) > 0.004) {
    amirScale = newScale;
    applyAmirTransform();
  }
}

function updateFire() {
  const el = document.getElementById('amir-fire');
  if (!el) return;
  const t = state.totalCurry;
  let size = 0;
  if      (t >= 1000000) size = 88;
  else if (t >= 100000)  size = 68;
  else if (t >= 10000)   size = 52;
  else if (t >= 1000)    size = 38;
  else if (t >= 100)     size = 28;

  if (size > 0) {
    el.style.display  = 'block';
    el.style.fontSize = size + 'px';
    el.textContent    = '🔥';
  } else {
    el.style.display = 'none';
  }
}

// ============================================================
//  GAME LOOP  (requestAnimationFrame)
// ============================================================
let lastTs = null;

function gameLoop(ts) {
  if (!lastTs) lastTs = ts;
  const dt = Math.min(ts - lastTs, 50); // cap at 50ms to handle tab focus-loss
  lastTs = ts;

  updateJump(dt);
  updateAutoJump(dt);
  updateObstacles(dt);
  checkComboTimeout();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// CPS income tick — every 100ms
setInterval(() => {
  if (!gameStarted) return;
  const gain = totalCps() / 10;
  if (gain > 0) {
    state.curry      += gain;
    state.totalCurry += gain;
    checkMilestones();
    renderStats();
  }
}, 100);

// Shop re-render + world scaling — every 500ms
setInterval(() => {
  renderShop();
  updateAmirSpeed();
  updateAmirSize();
  updateFire();
}, 500);

// ============================================================
//  SHOP TOGGLE
// ============================================================
let shopOpen = false;

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  document.body.classList.remove('pre-start');
  const screen = document.getElementById('start-screen');
  if (screen) {
    screen.classList.add('fade-out');
    setTimeout(() => screen.remove(), 750);
  }
  tryStartMusic();
}

function toggleShop() {
  if (!gameStarted) return;
  shopOpen = !shopOpen;
  document.getElementById('shop-panel').classList.toggle('open', shopOpen);
  document.getElementById('shop-backdrop').classList.toggle('visible', shopOpen);
  document.getElementById('shop-btn').textContent = shopOpen ? '✕ CLOSE' : '🛒 BAZAAR';
  if (shopOpen) renderShop();
}

// ============================================================
//  MILESTONES
// ============================================================
function checkMilestones() {
  if (state.nextMilestoneIdx >= MILESTONES.length) return;
  const m = MILESTONES[state.nextMilestoneIdx];
  if (state.totalCurry >= m.at) {
    state.nextMilestoneIdx++;
    showMilestone(m.msg);
  }
}

function showMilestone(msg) {
  const el = document.getElementById('milestone');
  el.textContent   = '🍛 ' + msg + ' 🍛';
  el.style.display = 'block';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = 'none'; }, 4500);
}

// ============================================================
//  SAVE / LOAD
// ============================================================
function saveGame() {
  localStorage.setItem('cc-save', JSON.stringify({
    curry:            state.curry,
    totalCurry:       state.totalCurry,
    clickMulti:       state.clickMulti,
    nextMilestoneIdx: state.nextMilestoneIdx,
    buildings: BUILDINGS.map(({ id, count, boost }) => ({ id, count, boost })),
    upgrades:  UPGRADES.map(({ id, bought })         => ({ id, bought })),
  }));
}

function loadGame() {
  const raw = localStorage.getItem('cc-save');
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    state.curry            = d.curry            || 0;
    state.totalCurry       = d.totalCurry       || 0;
    state.clickMulti       = d.clickMulti       || 1;
    state.nextMilestoneIdx = d.nextMilestoneIdx || 0;
    (d.buildings || []).forEach(sb => {
      const b = getB(sb.id);
      if (b) { b.count = sb.count || 0; b.boost = sb.boost || 1; }
    });
    (d.upgrades || []).forEach(su => {
      const u = UPGRADES.find(u => u.id === su.id);
      if (u) u.bought = su.bought;
    });
  } catch { /* ignore corrupt saves */ }
}

setInterval(saveGame, 30000);
window.addEventListener('beforeunload', saveGame);

// ============================================================
//  MUSIC — Web Audio API tabla synthesizer
//  Works on all browsers including iOS Safari (same-origin audio
//  context is unlocked by the user's tap, unlike cross-origin iframes).
// ============================================================
let audioCtx    = null;
let masterGain  = null;
let droneOscs   = [];
let musicOn     = true;
let musicStarted = false;
let beatTimer   = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.5;
  masterGain.connect(audioCtx.destination);
}

// One oscillator hit with pitch + gain envelope — simulates a tabla stroke
function hit(freq, dur, vol, time, type = 'sine', pitchDrop = true) {
  const osc = audioCtx.createOscillator();
  const env = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  if (pitchDrop) osc.frequency.exponentialRampToValueAtTime(freq * 0.28, time + dur * 0.65);
  env.gain.setValueAtTime(vol, time);
  env.gain.exponentialRampToValueAtTime(0.001, time + dur);
  osc.connect(env);
  env.connect(masterGain);
  osc.start(time);
  osc.stop(time + dur + 0.01);
}

// Tanpura-like drone: root A2 (110 Hz) + octaves, filtered to sine-ish timbre
function startDrone() {
  if (droneOscs.length) return;
  [110, 220, 330].forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const filt = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    filt.type = 'lowpass';
    filt.frequency.value = 380 + i * 140;
    filt.Q.value = 6;
    gain.gain.value = 0.065 / (i + 1);
    osc.connect(filt); filt.connect(gain); gain.connect(masterGain);
    osc.start();
    droneOscs.push(osc);
  });
}

// D major pentatonic (works over A drone — typical bhangra/Punjabi feel)
const SCALE = [293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99];
const MOTIF = [0, 2, 4, 3, 2, 5, 4, 2, 1, 3, 2, 0, 4, 6, 5, 3];
let motifIdx = 0;

// Schedule one 2-bar phrase of keherwa-inspired 8-beat tabla pattern
function scheduleBar(startTime) {
  if (!musicStarted) return;

  const BPM = 124;
  const S   = (60 / BPM) / 2;  // one 8th-note duration
  const t   = startTime;

  // Bayan (low thud) — beats 1, 3, 5, 7 of the 8-beat cycle
  hit(82, 0.24, 0.85, t);           // "Dha"
  hit(78, 0.20, 0.65, t + 4*S);    // "Da"
  hit(82, 0.22, 0.80, t + 8*S);    // "Dha"
  hit(78, 0.18, 0.60, t + 12*S);   // "Da"

  // Dayan (high "tin" / "dhin")
  hit(460, 0.10, 0.45, t + 2*S,  'triangle', false);
  hit(500, 0.09, 0.35, t + 3*S,  'triangle', false);
  hit(460, 0.10, 0.50, t + 5*S,  'triangle', false);
  hit(460, 0.09, 0.40, t + 7*S,  'triangle', false);
  hit(460, 0.10, 0.45, t + 10*S, 'triangle', false);
  hit(500, 0.09, 0.35, t + 11*S, 'triangle', false);
  hit(460, 0.10, 0.50, t + 13*S, 'triangle', false);
  hit(500, 0.09, 0.30, t + 15*S, 'triangle', false);

  // Ghost bayan strokes (quieter off-beats)
  hit(68, 0.14, 0.28, t + 6*S,  'sine', true);
  hit(68, 0.14, 0.24, t + 14*S, 'sine', true);

  // Melodic line — 4 notes per 2-bar phrase, cycling through the motif
  for (let i = 0; i < 4; i++) {
    const freq = SCALE[MOTIF[motifIdx % MOTIF.length]];
    motifIdx++;
    const mt = t + i * 4 * S;
    hit(freq,       0.38, 0.18, mt, 'triangle', false);
    hit(freq * 1.5, 0.20, 0.07, mt, 'sine',     false);  // 5th harmonic shimmer
  }

  // Schedule the next bar lookahead-style to avoid drift
  const nextStart  = t + 16 * S;
  const msUntilNext = (nextStart - audioCtx.currentTime) * 1000 - 80;
  beatTimer = setTimeout(() => {
    if (musicStarted) scheduleBar(audioCtx.currentTime + 0.08);
  }, Math.max(0, msUntilNext));
}

async function tryStartMusic() {
  if (musicStarted) return;
  initAudio();
  // On iOS the AudioContext starts suspended — resume() within a user gesture unlocks it
  if (audioCtx.state === 'suspended') {
    try { await audioCtx.resume(); } catch (_) {}
  }
  musicStarted = true;
  document.getElementById('music-btn').classList.remove('needs-click');
  startDrone();
  scheduleBar(audioCtx.currentTime + 0.1);
}

function toggleMusic() {
  if (!musicStarted) { tryStartMusic(); return; }
  musicOn = !musicOn;
  if (masterGain) {
    masterGain.gain.setTargetAtTime(musicOn ? 0.5 : 0, audioCtx.currentTime, 0.4);
  }
  document.getElementById('music-btn').textContent = musicOn ? '♪ ON' : '♪ OFF';
}

// ============================================================
//  INIT
// ============================================================
loadGame();
render();

document.body.classList.add('pre-start');
document.getElementById('music-btn').classList.add('needs-click');
