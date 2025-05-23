// ======= 1) Definizione iniziale =======
const sports = [
  { name: "Calcio", blu: 0, rossa: 0, used: false },
  { name: "Basket", blu: 0, rossa: 0, used: false },
  { name: "Volley", blu: 0, rossa: 0, used: false },
  { name: "Tennis", blu: 0, rossa: 0, used: false },
  { name: "Nuoto", blu: 0, rossa: 0, used: false }
];
const games = [
  { name: "Caccia al tesoro", blu: 0, rossa: 0, used: false },
  { name: "Staffetta", blu: 0, rossa: 0, used: false },
  { name: "Giochi d’acqua", blu: 0, rossa: 0, used: false }
];

// chi inizia: 0 = blu, 1 = rossa (alterniamo)
let currentTeam = 0;

// riferimenti alle ruote
let wheelSport, wheelGame;

// ======= 2) Funzione per creare una ruota generica =======
function createWheel(canvasId, items, callback) {
  const segments = items
    .filter(i => !i.used)
    .map(i => ({ text: i.name, fillStyle: getRandomColor() }));
  return new Winwheel({
    canvasId,
    numSegments: segments.length,
    segments,
    animation: {
      type: 'spinToStop', duration: 5,
      callbackFinished: callback
    }
  });
}

// ======= 3) Inizializza le ruote =======
function initWheels() {
  wheelSport = createWheel('wheel-sport-canvas', sports, onSportSpun);
  wheelGame  = createWheel('wheel-game-canvas', games, onGameSpun);
}

// ======= 4) Gestori dello spin =======
function onSportSpun(segment) {
  const name = segment.text;
  const item = sports.find(s => s.name === name);
  if (!item) return;
  // assegna punto
  if (currentTeam === 0) item.blu++; else item.rossa++;
  item.used = true;
  showResult('result-sport', `${name} → squadra ${currentTeam===0?'Blu':'Rossa'}`);
  currentTeam = 1 - currentTeam;
  update();
}
function onGameSpun(segment) {
  const name = segment.text;
  const item = games.find(g => g.name === name);
  if (!item) return;
  if (currentTeam === 0) item.blu++; else item.rossa++;
  item.used = true;
  showResult('result-game', `${name} → squadra ${currentTeam===0?'Blu':'Rossa'}`);
  currentTeam = 1 - currentTeam;
  update();
}

// ======= 5) Mostra messaggio risultato =======
function showResult(elId, text) {
  const el = document.getElementById(elId);
  el.textContent = text;
  el.classList.remove('d-none');
}

// ======= 6) Render tabella classifica =======
function renderTables() {
  const tbS = document.getElementById('sports-score-table');
  tbS.innerHTML = '';
  sports.forEach(s => {
    const tr = `<tr>
      <td>${s.name}</td><td>${s.blu}</td><td>${s.rossa}</td>
    </tr>`;
    tbS.insertAdjacentHTML('beforeend', tr);
  });
  const tbG = document.getElementById('games-score-table');
  tbG.innerHTML = '';
  games.forEach(g => {
    const tr = `<tr>
      <td>${g.name}</td><td>${g.blu}</td><td>${g.rossa}</td>
    </tr>`;
    tbG.insertAdjacentHTML('beforeend', tr);
  });
}

// ======= 7) Utils =======
function getRandomColor() {
  const r = Math.floor(Math.random()*200+30);
  const g = Math.floor(Math.random()*200+30);
  const b = Math.floor(Math.random()*200+30);
  return `rgb(${r},${g},${b})`;
}

// ======= 8) Navigazione tra le “view” =======
function showView(viewId) {
  ['wheel-sport-view','wheel-game-view','scoreboard-view'].forEach(id => {
    document.getElementById(id).classList.toggle('d-none', id!==viewId);
  });
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.id === `tab-${viewId}`);
  });
}
document.getElementById('tab-wheel-sport')
  .onclick = () => showView('wheel-sport-view');
document.getElementById('tab-wheel-game')
  .onclick = () => showView('wheel-game-view');
document.getElementById('tab-scoreboard')
  .onclick = () => showView('scoreboard-view');

// ======= 9) Setup eventi spin e init =======
window.onload = () => {
  document.getElementById('spin-sport-btn')
    .onclick = () => { wheelSport.startAnimation(); };
  document.getElementById('spin-game-btn')
    .onclick = () => { wheelGame.startAnimation(); };
  initWheels();
  renderTables();
};
