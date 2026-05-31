// =====================================================
// CURRY EMPIRE — Data
// =====================================================

const INGREDIENTS = {
  onion:     { name: 'Onion',     emoji: '🧅', tier: 1 },
  tomato:    { name: 'Tomato',    emoji: '🍅', tier: 1 },
  chilli:    { name: 'Chilli',    emoji: '🌶️',  tier: 1 },
  garlic:    { name: 'Garlic',    emoji: '🧄', tier: 1 },
  potato:    { name: 'Potato',    emoji: '🥔', tier: 2 },
  spinach:   { name: 'Spinach',   emoji: '🥬', tier: 2 },
  paneer:    { name: 'Paneer',    emoji: '🧀', tier: 2 },
  chicken:   { name: 'Chicken',   emoji: '🍗', tier: 2 },
  butter:    { name: 'Butter',    emoji: '🧈', tier: 2 },
  yogurt:    { name: 'Yogurt',    emoji: '🥛', tier: 3 },
  lamb:      { name: 'Lamb',      emoji: '🥩', tier: 3 },
  rice:      { name: 'Rice',      emoji: '🌾', tier: 3 },
  spice_mix: { name: 'Spice Mix', emoji: '🫙', tier: 3 },
  saffron:   { name: 'Saffron',   emoji: '🌸', tier: 4 },
  gold_leaf: { name: 'Gold Leaf', emoji: '✨', tier: 4 },
};

const RECIPES = [
  {
    id: 'tadka_dal',
    name: 'Tadka Dal',
    emoji: '🍲',
    ingredients: { onion: 3, tomato: 2, chilli: 1 },
    value: 15,
    unlockAt: 0,
    description: 'Simple comfort food',
  },
  {
    id: 'aloo_gobi',
    name: 'Aloo Gobi',
    emoji: '🥘',
    ingredients: { potato: 3, onion: 2, chilli: 2, garlic: 1 },
    value: 55,
    unlockAt: 100,
    description: 'The classic veggie',
  },
  {
    id: 'palak_paneer',
    name: 'Palak Paneer',
    emoji: '🫕',
    ingredients: { spinach: 4, paneer: 3, garlic: 2, spice_mix: 2 },
    value: 220,
    unlockAt: 500,
    description: 'Creamy spinach & cheese',
  },
  {
    id: 'butter_chicken',
    name: 'Butter Chicken',
    emoji: '🍛',
    ingredients: { chicken: 4, tomato: 3, butter: 2, garlic: 2, spice_mix: 2 },
    value: 700,
    unlockAt: 2000,
    description: 'The crowd favourite',
  },
  {
    id: 'lamb_rogan_josh',
    name: 'Lamb Rogan Josh',
    emoji: '🍜',
    ingredients: { lamb: 5, onion: 4, yogurt: 3, spice_mix: 3, garlic: 2 },
    value: 3200,
    unlockAt: 12000,
    description: 'Kashmiri masterpiece',
  },
  {
    id: 'biryani',
    name: 'Royal Biryani',
    emoji: '🍚',
    ingredients: { rice: 6, lamb: 4, spice_mix: 4, yogurt: 3, saffron: 2 },
    value: 16000,
    unlockAt: 80000,
    description: 'The king of dishes',
  },
  {
    id: 'maharaja_feast',
    name: "Maharaja's Feast",
    emoji: '👑',
    ingredients: { rice: 10, lamb: 8, chicken: 6, saffron: 5, gold_leaf: 3, spice_mix: 5 },
    value: 120000,
    unlockAt: 500000,
    description: 'Fit for royalty',
  },
  {
    id: 'gods_curry',
    name: "God's Own Curry",
    emoji: '🌟',
    ingredients: { saffron: 20, gold_leaf: 15, spice_mix: 15, lamb: 15, butter: 10, yogurt: 10 },
    value: 1500000,
    unlockAt: 5000000,
    description: 'The ultimate creation',
  },
];

const STATIONS = [
  {
    id: 'prep_counter',
    name: 'Prep Counter',
    emoji: '🔪',
    description: 'Auto-chops onions, tomatoes, chillies & garlic',
    baseCost: 80,
    produces: { onion: 1.5, tomato: 1.0, chilli: 0.8, garlic: 0.5 },
    costMultiplier: 1.15,
  },
  {
    id: 'spice_rack',
    name: 'Spice Rack',
    emoji: '🌶️',
    description: 'Grinds fresh spice mix and chillies',
    baseCost: 350,
    produces: { spice_mix: 0.8, chilli: 1.0, garlic: 0.5 },
    costMultiplier: 1.15,
  },
  {
    id: 'veg_stand',
    name: 'Vegetable Stand',
    emoji: '🥬',
    description: 'Delivers fresh potatoes & spinach',
    baseCost: 1200,
    produces: { potato: 1.5, spinach: 1.5, onion: 0.5 },
    costMultiplier: 1.15,
  },
  {
    id: 'tandoor',
    name: 'Tandoor',
    emoji: '🔥',
    description: 'Fires up chicken & paneer',
    baseCost: 4500,
    produces: { chicken: 1.0, paneer: 0.8 },
    costMultiplier: 1.15,
  },
  {
    id: 'dairy_run',
    name: 'Dairy Run',
    emoji: '🐄',
    description: 'Daily butter & yogurt delivery',
    baseCost: 16000,
    produces: { butter: 1.0, yogurt: 0.8 },
    costMultiplier: 1.15,
  },
  {
    id: 'butcher',
    name: 'Butcher Shop',
    emoji: '🥩',
    description: 'Premium cuts of lamb & chicken',
    baseCost: 60000,
    produces: { lamb: 0.8, chicken: 1.5 },
    costMultiplier: 1.15,
  },
  {
    id: 'rice_paddies',
    name: 'Rice Paddies',
    emoji: '🌾',
    description: 'Grows fragrant basmati rice',
    baseCost: 220000,
    produces: { rice: 1.5 },
    costMultiplier: 1.15,
  },
  {
    id: 'saffron_fields',
    name: 'Saffron Fields',
    emoji: '🌸',
    description: 'Cultivates precious saffron & gold leaf',
    baseCost: 900000,
    produces: { saffron: 0.5, gold_leaf: 0.2 },
    costMultiplier: 1.15,
  },
  {
    id: 'master_chef',
    name: 'Master Chef',
    emoji: '👨‍🍳',
    description: 'Auto-cooks your most valuable available recipe every 4 seconds',
    baseCost: 3500000,
    produces: {},
    autoChef: true,
    costMultiplier: 1.2,
  },
];

const UPGRADES = [
  {
    id: 'sharp_knives',
    name: 'Sharp Knives',
    emoji: '🔪',
    description: '×2 ingredients per tap',
    cost: 250,
    unlockAt: 50,
    effect: { clickMultiplier: 2 },
  },
  {
    id: 'turbo_prep',
    name: 'Turbo Prep',
    emoji: '⚡',
    description: '×3 Prep Counter production',
    cost: 5000,
    unlockAt: 2000,
    effect: { stationBoost: { prep_counter: 3 } },
  },
  {
    id: 'fresh_market',
    name: 'Fresh Market',
    emoji: '🛒',
    description: '×2 all station production',
    cost: 10000,
    unlockAt: 4000,
    effect: { stationMultiplier: 2 },
  },
  {
    id: 'family_recipes',
    name: "Nana's Recipes",
    emoji: '📖',
    description: '×1.5 value of all dishes',
    cost: 25000,
    unlockAt: 10000,
    effect: { recipeMultiplier: 1.5 },
  },
  {
    id: 'golden_tandoor',
    name: 'Golden Tandoor',
    emoji: '✨',
    description: '×3 Tandoor production',
    cost: 80000,
    unlockAt: 30000,
    effect: { stationBoost: { tandoor: 3 } },
  },
  {
    id: 'michelin_star',
    name: 'Michelin Star',
    emoji: '⭐',
    description: '×3 value of all dishes',
    cost: 150000,
    unlockAt: 60000,
    effect: { recipeMultiplier: 3 },
  },
  {
    id: 'secret_spices',
    name: 'Secret Spices',
    emoji: '🌶️',
    description: '×5 ingredients per tap',
    cost: 500000,
    unlockAt: 200000,
    effect: { clickMultiplier: 5 },
  },
  {
    id: 'empire_expansion',
    name: 'Empire Expansion',
    emoji: '🌍',
    description: '×2 all production & ×2 all dish values',
    cost: 2000000,
    unlockAt: 800000,
    effect: { stationMultiplier: 2, recipeMultiplier: 2 },
  },
];

const MILESTONES = [
  { at: 100,        text: '₹100 earned! The kitchen is alive! 🔥' },
  { at: 1000,       text: '₹1,000! Word is spreading about your curry!' },
  { at: 10000,      text: '₹10,000! You built different, sir!' },
  { at: 100000,     text: '₹100K! The whole neighbourhood loves you!' },
  { at: 1000000,    text: '₹1 MILLION! Curry Empire is REAL! 🏆' },
  { at: 10000000,   text: '₹10 MILLION! You are a legend!' },
  { at: 1000000000, text: "₹1 BILLION! GOD'S OWN CHEF! 🌟" },
];

const CLICK_INGREDIENTS = ['onion', 'tomato', 'chilli', 'garlic'];

// =====================================================
// STATE
// =====================================================

let state = {
  rupees: 0,
  totalRupees: 0,
  dishesCooked: 0,
  ingredients: {},
  stations: {},
  upgrades: {},
  milestonesSeen: new Set(),
  clickMultiplier: 1,
  stationMultiplier: 1,
  recipeMultiplier: 1,
  stationBoosts: {},
  combo: 0,
  lastClickTime: 0,
  autoChefAccum: 0,
};

let recentEarnings = [];
let lastTick = 0;
let gameStarted = false;
let musicPlaying = false;
let activeShopTab = 'stations';

// =====================================================
// INIT
// =====================================================

function init() {
  Object.keys(INGREDIENTS).forEach(id => { state.ingredients[id] = 0; });
  loadGame();
  bindEvents();
  renderAll();
}

function bindEvents() {
  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('click-zone').addEventListener('click', handleClick);
  document.getElementById('kitchen-btn').addEventListener('click', openShop);
  document.getElementById('shop-close').addEventListener('click', closeShop);
  document.getElementById('shop-overlay').addEventListener('click', closeShop);
  document.getElementById('music-btn').addEventListener('click', toggleMusic);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeShopTab = btn.dataset.tab;
      renderShop(activeShopTab);
    });
  });
}

function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  lastTick = Date.now();
  gameStarted = true;
  setInterval(gameTick, 100);
  setInterval(saveGame, 30000);
}

// =====================================================
// GAME LOOP
// =====================================================

function gameTick() {
  const now = Date.now();
  const dt = (now - lastTick) / 1000;
  lastTick = now;

  STATIONS.forEach(station => {
    const count = state.stations[station.id] || 0;
    if (!count) return;

    if (station.autoChef) {
      state.autoChefAccum += dt * count;
      if (state.autoChefAccum >= 4) {
        state.autoChefAccum = 0;
        autoCook();
      }
    } else {
      const boost = state.stationBoosts[station.id] || 1;
      const mult = state.stationMultiplier * boost * count;
      Object.entries(station.produces).forEach(([id, rate]) => {
        state.ingredients[id] = (state.ingredients[id] || 0) + rate * mult * dt;
      });
    }
  });

  const cutoff = now - 10000;
  recentEarnings = recentEarnings.filter(e => e.t > cutoff);

  renderHUD();
  renderInventory();
  renderRecipes();

  if (!document.getElementById('shop-panel').classList.contains('hidden')) {
    renderShop(activeShopTab);
  }
}

function autoCook() {
  let best = null;
  RECIPES.forEach(r => {
    if (r.unlockAt > state.totalRupees) return;
    if (!canCook(r)) return;
    if (!best || r.value > best.value) best = r;
  });
  if (best) cookRecipe(best.id, true);
}

// =====================================================
// CLICK
// =====================================================

function handleClick(e) {
  const now = Date.now();
  state.combo = now - state.lastClickTime < 1200 ? state.combo + 1 : 1;
  state.lastClickTime = now;

  const mult = comboMult();
  const yieldAmt = state.clickMultiplier * mult;

  CLICK_INGREDIENTS.forEach(id => {
    state.ingredients[id] = (state.ingredients[id] || 0) + yieldAmt;
  });

  const chef = document.getElementById('chef-emoji');
  chef.classList.remove('chop');
  void chef.offsetWidth;
  chef.classList.add('chop');

  const picked = CLICK_INGREDIENTS[Math.floor(Math.random() * CLICK_INGREDIENTS.length)];
  const label = INGREDIENTS[picked].emoji + (mult > 1 ? ` ×${mult}` : '');
  showFloat(label, e.clientX, e.clientY);

  if (mult > 1) {
    const el = document.getElementById('combo-display');
    el.textContent = `${mult}× COMBO!`;
    el.className = mult >= 10 ? 'combo-fire' : mult >= 5 ? 'combo-hot' : 'combo-warm';
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 900);
  }
}

function comboMult() {
  if (state.combo >= 20) return 10;
  if (state.combo >= 10) return 5;
  if (state.combo >= 5)  return 3;
  if (state.combo >= 3)  return 2;
  return 1;
}

// =====================================================
// RECIPES
// =====================================================

function canCook(recipe) {
  return Object.entries(recipe.ingredients).every(
    ([id, need]) => Math.floor(state.ingredients[id] || 0) >= need
  );
}

function cookRecipe(id, auto) {
  const recipe = RECIPES.find(r => r.id === id);
  if (!recipe || !canCook(recipe)) return;

  Object.entries(recipe.ingredients).forEach(([ing, need]) => {
    state.ingredients[ing] -= need;
  });

  const value = Math.round(recipe.value * state.recipeMultiplier);
  state.rupees += value;
  state.totalRupees += value;
  state.dishesCooked++;
  recentEarnings.push({ t: Date.now(), v: value });

  if (!auto) {
    const card = document.querySelector(`[data-recipe="${id}"]`);
    if (card) {
      const r = card.getBoundingClientRect();
      showFloat(`+₹${fmt(value)}`, r.left + r.width / 2, r.top + 20);
    }
    const btn = document.querySelector(`[data-cook="${id}"]`);
    if (btn) {
      btn.classList.add('cook-pulse');
      setTimeout(() => btn.classList.remove('cook-pulse'), 300);
    }
  }

  checkMilestones();
}

// =====================================================
// SHOP
// =====================================================

function buyStation(id) {
  const station = STATIONS.find(s => s.id === id);
  const count = state.stations[id] || 0;
  const cost = stationCost(station, count);
  if (state.rupees < cost) return;
  state.rupees -= cost;
  state.stations[id] = count + 1;
}

function buyUpgrade(id) {
  const upgrade = UPGRADES.find(u => u.id === id);
  if (!upgrade || state.upgrades[id] || state.rupees < upgrade.cost) return;
  state.rupees -= upgrade.cost;
  state.upgrades[id] = true;
  applyEffect(upgrade.effect);
}

function applyEffect(effect) {
  if (effect.clickMultiplier)   state.clickMultiplier   *= effect.clickMultiplier;
  if (effect.stationMultiplier) state.stationMultiplier *= effect.stationMultiplier;
  if (effect.recipeMultiplier)  state.recipeMultiplier  *= effect.recipeMultiplier;
  if (effect.stationBoost) {
    Object.entries(effect.stationBoost).forEach(([sid, mult]) => {
      state.stationBoosts[sid] = (state.stationBoosts[sid] || 1) * mult;
    });
  }
}

function stationCost(station, count) {
  return Math.floor(station.baseCost * Math.pow(station.costMultiplier, count));
}

// =====================================================
// RENDER
// =====================================================

function renderAll() {
  renderHUD();
  renderInventory();
  renderRecipes();
}

function renderHUD() {
  document.getElementById('rupee-count').textContent = fmt(Math.floor(state.rupees));
  const rps = recentEarnings.reduce((s, e) => s + e.v, 0) / 10;
  document.getElementById('rps-display').textContent = rps >= 0.1 ? `₹${fmt(rps)} /sec` : '';
  document.getElementById('dishes-cooked').textContent = fmt(state.dishesCooked);
  document.getElementById('total-earned').textContent = fmt(Math.floor(state.totalRupees));
}

function renderInventory() {
  const grid = document.getElementById('ingredient-grid');
  const chips = [];

  Object.entries(INGREDIENTS).forEach(([id, ing]) => {
    const count = Math.floor(state.ingredients[id] || 0);
    if (count === 0 && !isRelevant(id)) return;
    chips.push(
      `<div class="ing-chip${count === 0 ? ' ing-zero' : ''}">
        <span class="ing-icon">${ing.emoji}</span>
        <span class="ing-cnt">${count}</span>
      </div>`
    );
  });

  grid.innerHTML = chips.length
    ? chips.join('')
    : '<span class="pantry-empty">Tap the chef to gather ingredients!</span>';
}

function isRelevant(id) {
  return RECIPES.some(r => r.unlockAt <= state.totalRupees && id in r.ingredients)
      || STATIONS.some(s => (state.stations[s.id] || 0) > 0 && id in s.produces);
}

function renderRecipes() {
  document.getElementById('recipe-list').innerHTML = RECIPES.map(recipe => {
    const unlocked = state.totalRupees >= recipe.unlockAt;
    if (!unlocked) {
      return `<div class="recipe-card locked">
        <span class="rc-emoji">🔒</span>
        <div class="rc-info">
          <div class="rc-name">${recipe.name}</div>
          <div class="rc-unlock">Unlock at ₹${fmt(recipe.unlockAt)}</div>
        </div>
      </div>`;
    }

    const cookable = canCook(recipe);
    const value = Math.round(recipe.value * state.recipeMultiplier);
    const ingHtml = Object.entries(recipe.ingredients).map(([id, need]) => {
      const have = Math.floor(state.ingredients[id] || 0);
      return `<span class="ing-req ${have >= need ? 'have' : 'need'}">${INGREDIENTS[id].emoji}${need}</span>`;
    }).join('');

    return `<div class="recipe-card${cookable ? ' cookable' : ''}" data-recipe="${recipe.id}">
      <span class="rc-emoji">${recipe.emoji}</span>
      <div class="rc-info">
        <div class="rc-name">${recipe.name}</div>
        <div class="rc-ings">${ingHtml}</div>
        <div class="rc-desc">${recipe.description}</div>
      </div>
      <div class="rc-action">
        <div class="rc-value">₹${fmt(value)}</div>
        <button
          class="cook-btn${cookable ? '' : ' cant-cook'}"
          data-cook="${recipe.id}"
          ${cookable ? `onclick="cookRecipe('${recipe.id}')"` : 'disabled'}
        >${cookable ? 'Cook!' : 'Need more'}</button>
      </div>
    </div>`;
  }).join('');
}

function renderShop(tab) {
  const body = document.getElementById('shop-body');

  if (tab === 'stations') {
    body.innerHTML = STATIONS.map(s => {
      const count = state.stations[s.id] || 0;
      const cost = stationCost(s, count);
      const canAfford = state.rupees >= cost;
      return `<div class="shop-item">
        <div class="si-emoji">${s.emoji}</div>
        <div class="si-info">
          <div class="si-name">${s.name}${count ? ` <span class="si-badge">×${count}</span>` : ''}</div>
          <div class="si-desc">${s.description}</div>
        </div>
        <button class="buy-btn${canAfford ? '' : ' cant-buy'}" ${canAfford ? '' : 'disabled'} onclick="buyStation('${s.id}')">
          ₹${fmt(cost)}
        </button>
      </div>`;
    }).join('');
  } else {
    const available = UPGRADES.filter(u => state.totalRupees >= u.unlockAt);
    body.innerHTML = available.length ? available.map(u => {
      const bought = !!state.upgrades[u.id];
      const canAfford = !bought && state.rupees >= u.cost;
      return `<div class="shop-item${bought ? ' si-bought' : ''}">
        <div class="si-emoji">${u.emoji}</div>
        <div class="si-info">
          <div class="si-name">${u.name}</div>
          <div class="si-desc">${u.description}</div>
        </div>
        ${bought
          ? '<div class="si-owned">✓ Owned</div>'
          : `<button class="buy-btn${canAfford ? '' : ' cant-buy'}" ${canAfford ? '' : 'disabled'} onclick="buyUpgrade('${u.id}')">₹${fmt(u.cost)}</button>`}
      </div>`;
    }).join('') : '<p class="shop-empty">Keep earning to unlock upgrades!</p>';
  }
}

// =====================================================
// UI HELPERS
// =====================================================

function openShop() {
  document.getElementById('shop-panel').classList.remove('hidden');
  document.getElementById('shop-overlay').classList.remove('hidden');
  renderShop(activeShopTab);
}

function closeShop() {
  document.getElementById('shop-panel').classList.add('hidden');
  document.getElementById('shop-overlay').classList.add('hidden');
}

function showFloat(text, x, y) {
  const el = document.createElement('div');
  el.className = 'float-txt';
  el.textContent = text;
  el.style.cssText = `left:${x}px;top:${y}px`;
  document.getElementById('float-layer').appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function checkMilestones() {
  MILESTONES.forEach(m => {
    if (state.totalRupees >= m.at && !state.milestonesSeen.has(m.at)) {
      state.milestonesSeen.add(m.at);
      const banner = document.getElementById('milestone-banner');
      banner.textContent = m.text;
      banner.classList.add('show');
      clearTimeout(banner._t);
      banner._t = setTimeout(() => banner.classList.remove('show'), 4000);
    }
  });
}

// =====================================================
// MUSIC
// =====================================================

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-btn');
  if (musicPlaying) {
    audio.pause();
    btn.textContent = '🔇';
    musicPlaying = false;
  } else {
    audio.play().catch(() => {});
    btn.textContent = '🎵';
    musicPlaying = true;
  }
}

// =====================================================
// SAVE / LOAD
// =====================================================

function saveGame() {
  if (!gameStarted) return;
  localStorage.setItem('curryEmpire_v1', JSON.stringify({
    rupees:            state.rupees,
    totalRupees:       state.totalRupees,
    dishesCooked:      state.dishesCooked,
    ingredients:       state.ingredients,
    stations:          state.stations,
    upgrades:          state.upgrades,
    milestonesSeen:    [...state.milestonesSeen],
    clickMultiplier:   state.clickMultiplier,
    stationMultiplier: state.stationMultiplier,
    recipeMultiplier:  state.recipeMultiplier,
    stationBoosts:     state.stationBoosts,
  }));
}

function loadGame() {
  try {
    const raw = localStorage.getItem('curryEmpire_v1');
    if (!raw) return;
    const s = JSON.parse(raw);
    Object.assign(state, {
      rupees:            s.rupees            || 0,
      totalRupees:       s.totalRupees       || 0,
      dishesCooked:      s.dishesCooked      || 0,
      ingredients:       { ...state.ingredients, ...(s.ingredients || {}) },
      stations:          s.stations          || {},
      upgrades:          s.upgrades          || {},
      milestonesSeen:    new Set(s.milestonesSeen || []),
      clickMultiplier:   s.clickMultiplier   || 1,
      stationMultiplier: s.stationMultiplier || 1,
      recipeMultiplier:  s.recipeMultiplier  || 1,
      stationBoosts:     s.stationBoosts     || {},
    });
  } catch (_) {}
}

// =====================================================
// UTILS
// =====================================================

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

// =====================================================
// GO
// =====================================================

init();
