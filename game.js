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
const REVIVE_MAX = 2;
let revivesBought = 0;

let shieldActive = false;
let slowActive   = false;
let slowTimeLeft = 0; // ms

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
  el.innerHTML =
    '<span class="lf">♥</span>'.repeat(Math.max(0, lives)) +
    '<span class="le">♥</span>'.repeat(Math.max(0, MAX_LIVES - lives));
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
  if (bgMusic) {
    bgMusic.volume = 0;
    setTimeout(() => bgMusic.pause(), 600);
  }
  document.getElementById('amir-sprite').style.animationPlayState = 'paused';
  document.getElementById('go-score').textContent = fmt(state.totalCurry);
  document.getElementById('gameover-screen').style.display = 'flex';
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

  // Power-ups
  const powersEl = document.getElementById('powers-list');
  if (powersEl) {
    const items = [
      {
        emoji: '🛡️', name: "Amir's Shield",
        desc: shieldActive ? 'Active — absorbs next hit' : 'Absorb the next obstacle hit',
        cost: shieldCost(), active: shieldActive, disabled: shieldActive || !gameStarted,
        fn: 'buyShield()',
      },
      {
        emoji: '🐢', name: 'Slow Scroll',
        desc: slowActive ? `Active — ${Math.ceil(slowTimeLeft / 1000)}s left` : 'Halve world speed for 6s',
        cost: slowCost(), active: slowActive, disabled: slowActive || !gameStarted,
        fn: 'buySlow()',
      },
      {
        emoji: '💥', name: 'Curry Bomb',
        desc: 'Blast all obstacles off-screen',
        cost: bombCost(), active: false, disabled: !gameStarted,
        fn: 'buyCurryBomb()',
      },
    ];
    powersEl.innerHTML = items.map(item => {
      const ok = !item.disabled && state.curry >= item.cost;
      return `<div class="shop-item${ok ? ' can-afford' : ''}${item.active ? ' power-active' : ''}" onclick="${item.fn}">
        <span class="s-emoji">${item.emoji}</span>
        <div class="s-info">
          <div class="s-name">${item.name}</div>
          <div class="s-desc">${item.desc}</div>
          <span class="upg-tag">POWER</span>
        </div>
        <div class="s-cost">${item.active ? '✓ ACTIVE' : '🍛' + fmt(item.cost)}</div>
      </div>`;
    }).join('');
  }

  // Revival
  const revivalEl = document.getElementById('revival-list');
  if (revivalEl) {
    const remaining = REVIVE_MAX - revivesBought;
    const cost = reviveCost();
    if (lives >= MAX_LIVES) {
      revivalEl.innerHTML = '<p class="empty-msg">Full health — no revival needed!</p>';
    } else if (remaining <= 0) {
      revivalEl.innerHTML = '<p class="empty-msg">No revivals remaining this run.</p>';
    } else {
      const ok = state.curry >= cost;
      revivalEl.innerHTML = `<div class="shop-item${ok ? ' can-afford' : ''}" onclick="buyRevive()">
        <span class="s-emoji">❤️</span>
        <div class="s-info">
          <div class="s-name">Second Wind</div>
          <div class="s-desc">Restore 1 life · ${remaining} left this run</div>
          <span class="upg-tag">REVIVAL</span>
        </div>
        <div class="s-cost">🍛${fmt(cost)}</div>
      </div>`;
    }
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

function reviveCost() {
  return Math.max(200, Math.floor(state.totalCurry * 0.1)) * (revivesBought + 1);
}

function buyRevive() {
  const cost = reviveCost();
  if (lives >= MAX_LIVES || revivesBought >= REVIVE_MAX || state.curry < cost) return;
  state.curry -= cost;
  revivesBought++;
  lives++;
  renderLives();
  render();
}

// ============================================================
//  POWER-UPS
// ============================================================
function shieldCost() { return Math.max(300,  Math.floor(state.totalCurry * 0.08)); }
function slowCost()   { return Math.max(500,  Math.floor(state.totalCurry * 0.12)); }
function bombCost()   { return Math.max(1000, Math.floor(state.totalCurry * 0.20)); }

function buyShield() {
  const cost = shieldCost();
  if (shieldActive || !gameStarted || state.curry < cost) return;
  state.curry -= cost;
  shieldActive = true;
  document.getElementById('amir-char').classList.add('shielded');
  updatePowerupHud();
  render();
}

function buySlow() {
  const cost = slowCost();
  if (slowActive || !gameStarted || state.curry < cost) return;
  state.curry -= cost;
  slowActive   = true;
  slowTimeLeft = 6000;
  document.getElementById('slow-overlay').style.display = 'block';
  updatePowerupHud();
  render();
}

function buyCurryBomb() {
  const cost = bombCost();
  if (!gameStarted || state.curry < cost) return;
  state.curry -= cost;
  obstacles.forEach(o => o.el.remove());
  obstacles.length = 0;
  const layer = document.getElementById('obstacles-layer');
  layer.classList.add('bomb-flash');
  setTimeout(() => layer.classList.remove('bomb-flash'), 500);
  render();
}

function updatePowerupHud() {
  const el = document.getElementById('powerup-hud');
  if (!el) return;
  const parts = [];
  if (shieldActive) parts.push('🛡️ SHIELD');
  if (slowActive)   parts.push('🐢 ' + Math.ceil(slowTimeLeft / 1000) + 's');
  el.textContent   = parts.join('  ·  ');
  el.style.display = parts.length ? 'block' : 'none';
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
  const el = document.getElementById('amir-char');
  el.style.transform = `translateY(${-amirY}px) scale(${amirScale})`;
  el.style.zIndex    = amirY > 20 ? '9' : '5';
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
  // Ground hazards — potholes (jump over them)
  { type: 'pothole', width: 80,  speedM: 1.05, front: true  },
  { type: 'pothole', width: 105, speedM: 1.0,  front: true  },
  { type: 'pothole', width: 130, speedM: 0.95, front: true  },
  { type: 'pothole', width: 155, speedM: 0.9,  front: true  },
  { type: 'pothole', width: 85,  speedM: 1.1,  front: true  },
  { type: 'pothole', width: 115, speedM: 1.0,  front: true  },
  // Background scenery — decorative only, no collision
  { type: 'scenery', emoji: '🐄', size: 110, speedM: 0.65, front: false },
  { type: 'scenery', emoji: '🐪', size: 100, speedM: 0.75, front: false },
  { type: 'scenery', emoji: '🐫', size: 108, speedM: 0.7,  front: false },
  { type: 'scenery', emoji: '🐘', size: 118, speedM: 0.6,  front: false },
];

let obstacles  = [];
let obsTimer   = 0;
let nextObs    = 2000;

function worldSpeed() {
  const base = Math.min(540, 160 + Math.log10(state.totalCurry + 1) * 75);
  return slowActive ? base * 0.45 : base;
}

function obsInterval() {
  // 1900ms → 350ms as curry grows — twice as many obstacles as before
  return Math.max(350, 1900 - Math.log10(state.totalCurry + 1) * 220);
}

function spawnObstacle() {
  const type   = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)];
  const layer  = document.getElementById('obstacles-layer');
  const el     = document.createElement('div');
  const startX = window.innerWidth + 80;

  if (type.type === 'pothole') {
    el.className   = 'pothole';
    el.style.width = type.width + 'px';
  } else {
    el.className      = 'obstacle';
    el.textContent    = type.emoji;
    el.style.fontSize = type.size + 'px';
    el.style.bottom   = GROUND_H + 'px';
    el.style.zIndex   = '3';
  }

  el.style.left = startX + 'px';
  layer.appendChild(el);

  obstacles.push({
    el,
    x:       startX,
    speedM:  type.speedM,
    front:   type.front,
    visualH: type.type === 'pothole' ? 45 : 0,
    visualW: type.type === 'pothole' ? type.width : Math.round((type.size || 100) * 0.7),
    damaged: false,
  });
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
//  POSITIONAL COLLISION — auto-damage when obstacle overlaps Amir on ground
// ============================================================
let hitInvincibleTime = 0;

function checkObstacleCollisions() {
  if (!gameStarted || hitInvincibleTime > 0) return;
  const amirLeft  = window.innerWidth * 0.22;
  const amirRight = amirLeft + 84;

  for (const o of obstacles) {
    if (!o.front || o.damaged) continue;
    if (o.x + o.visualW < amirLeft - 15) continue;
    if (o.x > amirRight + 15) continue;
    if (amirY >= o.visualH) continue;  // jumped over

    o.damaged = true;
    const fx = amirLeft + 42;
    const fy = window.innerHeight - GROUND_H - amirY - 60;

    if (shieldActive) {
      shieldActive = false;
      document.getElementById('amir-char').classList.remove('shielded');
      o.el.classList.add('obstacle-hit');
      setTimeout(() => o.el.classList.remove('obstacle-hit'), 350);
      spawnFloat(fx, fy, '🛡️ BLOCKED!', true, false);
      updatePowerupHud();
      renderShop();
      return;
    }

    hitInvincibleTime = 1000;
    resetCombo();
    spawnFloat(fx, fy, '💔 -1 LIFE!', false, true);
    loseLife();
    o.el.classList.add('obstacle-hit');
    setTimeout(() => o.el.classList.remove('obstacle-hit'), 350);
    return;
  }
}

// ============================================================
//  GOLDEN CURRY BOWL
// ============================================================
let goldenBowl      = null;
let goldenBowlTimer = 0;
let nextGoldenBowl  = 45000 + Math.random() * 45000;
const GOLDEN_LIFETIME = 9000;

function goldenBowlValue() {
  return Math.max(500, Math.floor(totalCps() * 120));
}

function spawnGoldenBowl() {
  if (goldenBowl) return;
  const el  = document.createElement('div');
  el.className  = 'golden-bowl';
  el.textContent = '🍛';
  const startX  = window.innerWidth + 80;
  el.style.left = startX + 'px';
  const val = goldenBowlValue();
  el.addEventListener('click', e => {
    e.stopPropagation();
    if (!gameStarted || !goldenBowl) return;
    state.curry      += val;
    state.totalCurry += val;
    spawnFloat(e.clientX, e.clientY, `✨ +${fmt(val)} 🍛 GOLDEN!`, true, false);
    removeGoldenBowl();
    checkMilestones();
    renderStats();
  });
  document.getElementById('obstacles-layer').appendChild(el);
  goldenBowl = { el, x: startX, timeLeft: GOLDEN_LIFETIME };
  showMilestone('✨ GOLDEN CURRY! Quick, click it!');
}

function removeGoldenBowl() {
  if (!goldenBowl) return;
  goldenBowl.el.remove();
  goldenBowl = null;
}

function updateGoldenBowl(dt) {
  if (!gameStarted) return;
  goldenBowlTimer += dt;
  if (goldenBowlTimer >= nextGoldenBowl) {
    spawnGoldenBowl();
    goldenBowlTimer = 0;
    nextGoldenBowl = 45000 + Math.random() * 45000;
  }
  if (!goldenBowl) return;
  const spd = worldSpeed() * 0.7 * (dt / 1000);
  goldenBowl.x -= spd;
  goldenBowl.el.style.left = goldenBowl.x + 'px';
  goldenBowl.timeLeft -= dt;
  if (goldenBowl.timeLeft <= 0 || goldenBowl.x < -150) removeGoldenBowl();
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

  if (slowActive) {
    slowTimeLeft -= dt;
    if (slowTimeLeft <= 0) {
      slowActive = false;
      slowTimeLeft = 0;
      document.getElementById('slow-overlay').style.display = 'none';
    }
    updatePowerupHud();
  }

  if (hitInvincibleTime > 0) hitInvincibleTime = Math.max(0, hitInvincibleTime - dt);

  updateJump(dt);
  updateAutoJump(dt);
  updateObstacles(dt);
  checkObstacleCollisions();
  updateGoldenBowl(dt);
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
//  MUSIC — HTML5 Audio (works on all browsers including iOS Safari)
//  audio.play() called within a user gesture is honoured on iOS;
//  unlike YouTube IFrame postMessage calls, it runs in the same context.
// ============================================================
const bgMusic    = document.getElementById('bg-music');
let musicOn      = true;
let musicStarted = false;

function tryStartMusic() {
  if (musicStarted || !bgMusic) return;
  bgMusic.volume = 0.55;
  bgMusic.play().then(() => {
    musicStarted = true;
    document.getElementById('music-btn').classList.remove('needs-click');
  }).catch(() => {});
}

function toggleMusic() {
  if (!bgMusic) return;
  musicOn = !musicOn;
  if (musicOn) {
    bgMusic.volume = 0.55;
    bgMusic.play().catch(() => {});
    document.getElementById('music-btn').textContent = '♪ ON';
  } else {
    bgMusic.pause();
    document.getElementById('music-btn').textContent = '♪ OFF';
  }
}

// ============================================================
//  INIT
// ============================================================
loadGame();
render();

// Jump — Space bar or tap anywhere on the game world (Amir/obstacle clicks stop propagation)
document.addEventListener('keydown', e => {
  if (e.code === 'Space') { e.preventDefault(); if (gameStarted) doJump(); }
});
document.getElementById('game-world').addEventListener('click', () => {
  if (gameStarted) doJump();
});

document.body.classList.add('pre-start');
document.getElementById('music-btn').classList.add('needs-click');
