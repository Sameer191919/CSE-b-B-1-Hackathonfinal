// FocusFlow Frontend
// Manages Pomodoro timer, tasks, stats, goals, quotes, sounds, leaderboard.
(() => {
  // ---- State ----
  const PHASES = { FOCUS: 'Focus', SHORT: 'Short Break', LONG: 'Long Break' };
  const $ = (sel) => document.querySelector(sel);
  const taskListEl = $('#taskList');
  const timeDisplay = $('#timeDisplay');
  const phaseBadge = $('#phaseBadge');
  const statFocus = $('#statFocus');
  const statDone = $('#statDone');
  const statSessions = $('#statSessions');
  const statGoal = $('#statGoal');
  const goalProgressBar = $('#goalProgressBar');
  const streakBadge = $('#streakBadge');
  const streakDaysEl = $('#streakDays');
  const quoteBox = $('#quoteBox');

  const focusMinsInput = $('#focusMins');
  const shortBreakMinsInput = $('#shortBreakMins');
  const longBreakMinsInput = $('#longBreakMins');

  const btnStart = $('#btnStart');
  const btnPause = $('#btnPause');
  const btnReset = $('#btnReset');

  const dailyGoalInput = $('#dailyGoal');
  const saveGoalBtn = $('#saveGoal');

  const soundToggle = $('#soundToggle');
  const autoStartBreaks = $('#autoStartBreaks');
  const autoStartFocus = $('#autoStartFocus');

  const leaderboardBody = $('#leaderboardBody');
  const leaderboardForm = $('#leaderboardForm');
  const playerNameInput = $('#playerName');

  // ---- Persistence (localStorage) ----
  const KEY = {
    TASKS: 'ff_tasks',
    STATS: 'ff_stats',
    SETTINGS: 'ff_settings',
  };

  function todayKey() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function saveJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  // Tasks
  let tasks = loadJSON(KEY.TASKS, []);
  // Stats per day
  let statsByDay = loadJSON(KEY.STATS, {});
  if (!statsByDay[todayKey()]) statsByDay[todayKey()] = { focusMinutes: 0, doneCount: 0, sessions: 0, streak: 0, goalMinutes: 120 };
  // Settings
  let settings = loadJSON(KEY.SETTINGS, { sound: true, autoStartBreaks: true, autoStartFocus: false });
  soundToggle.checked = settings.sound;
  autoStartBreaks.checked = settings.autoStartBreaks;
  autoStartFocus.checked = settings.autoStartFocus;
  dailyGoalInput.value = statsByDay[todayKey()].goalMinutes;

  // ---- Timer ----
  let timer = {
    secondsLeft: Number(focusMinsInput.value) * 60,
    phase: PHASES.FOCUS,
    intervalId: null,
    focusCount: 0, // after 4 focus -> long break
    running: false,
  };

  function fmt(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateDisplay() {
    timeDisplay.textContent = fmt(timer.secondsLeft);
    phaseBadge.textContent = timer.phase;
  }

  function tick() {
    if (timer.secondsLeft > 0) {
      timer.secondsLeft -= 1;
      updateDisplay();
      return;
    }
    // Phase end
    notify(`Time's up: ${timer.phase}`);
    if (timer.phase === PHASES.FOCUS) {
      // add focus minutes to stats (from configured focus length)
      const mins = Number(focusMinsInput.value);
      addFocusMinutes(mins);
      statsByDay[todayKey()].sessions += 1;
      saveJSON(KEY.STATS, statsByDay);
      renderStats();

      timer.focusCount += 1;
      if (timer.focusCount % 4 === 0) switchPhase(PHASES.LONG);
      else switchPhase(PHASES.SHORT);

      if (autoStartBreaks.checked) startTimer();
    } else {
      // break ended
      switchPhase(PHASES.FOCUS);
      if (autoStartFocus.checked) startTimer();
    }
  }

  function switchPhase(p) {
    timer.phase = p;
    timer.secondsLeft = p === PHASES.FOCUS
      ? Number(focusMinsInput.value) * 60
      : (p === PHASES.SHORT ? Number(shortBreakMinsInput.value) : Number(longBreakMinsInput.value)) * 60;
    updateDisplay();
    fetchQuote(); // show a new quote on phase change
  }

  function startTimer() {
    if (timer.running) return;
    timer.running = true;
    if (timer.intervalId) clearInterval(timer.intervalId);
    timer.intervalId = setInterval(tick, 1000);
  }
  function pauseTimer() {
    timer.running = false;
    if (timer.intervalId) clearInterval(timer.intervalId);
  }
  function resetTimer() {
    pauseTimer();
    switchPhase(PHASES.FOCUS);
    timer.focusCount = 0;
  }

  // ---- Sound ----
  function beep() {
    if (!soundToggle.checked) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 660;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.start();
      o.stop(ctx.currentTime + 0.26);
    } catch {}
  }

  function notify(msg) {
    beep();
    if (document.visibilityState === 'hidden' && 'Notification' in window) {
      if (Notification.permission === 'granted') new Notification('FocusFlow', { body: msg });
    }
  }

  // Ask notification permission early
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // ---- Tasks ----
  function renderTasks() {
    taskListEl.innerHTML = '';
    if (!tasks.length) {
      taskListEl.innerHTML = '<li class="list-group-item text-muted">No tasks yet. Add one above.</li>';
      return;
    }
    tasks.forEach((t, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <div class="fw-semibold">${t.title}</div>
          <div class="time-spent">Time: ${t.minutes}m ${t.done ? ' • ✅' : ''}</div>
        </div>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-secondary" data-action="add5">+5m</button>
          <button class="btn btn-sm btn-outline-success" data-action="done">${t.done ? 'Undo' : 'Done'}</button>
          <button class="btn btn-sm btn-outline-danger" data-action="del">Delete</button>
        </div>
      `;
      li.addEventListener('click', (e) => {
        const a = e.target.getAttribute('data-action');
        if (!a) return;
        if (a === 'add5') { t.minutes += 5; saveTasks(); renderTasks(); renderStats(); }
        if (a === 'done') { t.done = !t.done; saveTasks(); renderTasks(); renderStats(); }
        if (a === 'del') { tasks.splice(idx, 1); saveTasks(); renderTasks(); renderStats(); }
      });
      taskListEl.appendChild(li);
    });
  }

  function saveTasks() { saveJSON(KEY.TASKS, tasks); }

  $('#taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = $('#taskInput').value.trim();
    if (!val) return;
    tasks.push({ title: val, minutes: 0, done: false });
    $('#taskInput').value = '';
    saveTasks();
    renderTasks();
    renderStats();
  });

  // ---- Stats, Goals, Streak ----
  function addFocusMinutes(mins) {
    const k = todayKey();
    rolloverIfNewDay();
    statsByDay[k].focusMinutes += mins;
    // streak handling: if user has focus minutes today, ensure streak >= 1
    updateStreak();
    saveJSON(KEY.STATS, statsByDay);
  }

  function completedTasksCountToday() {
    return tasks.filter(t => t.done).length;
  }

  function rolloverIfNewDay() {
    const k = todayKey();
    if (!statsByDay[k]) {
      // Carry over streak if yesterday had any focus
      const days = Object.keys(statsByDay).sort();
      const yesterday = days[days.length - 1];
      statsByDay[k] = { focusMinutes: 0, doneCount: 0, sessions: 0, streak: statsByDay[yesterday]?.streak || 0, goalMinutes: statsByDay[yesterday]?.goalMinutes || 120 };
    }
  }

  function updateStreak() {
    const k = todayKey();
    // If today has focusMinutes > 0, ensure streak >= yesterday+1
    const days = Object.keys(statsByDay).sort();
    const idx = days.indexOf(k);
    const yday = days[idx - 1];
    const yesterdayStreak = yday ? (statsByDay[yday].focusMinutes > 0 ? statsByDay[yday].streak : 0) : 0;
    if (statsByDay[k].focusMinutes > 0) {
      statsByDay[k].streak = yesterdayStreak + 1;
    } else {
      statsByDay[k].streak = yesterdayStreak; // unchanged
    }
  }

  function renderStats() {
    rolloverIfNewDay();
    const k = todayKey();
    statsByDay[k].doneCount = completedTasksCountToday();
    saveJSON(KEY.STATS, statsByDay);

    const s = statsByDay[k];
    statFocus.textContent = `${s.focusMinutes}m`;
    statDone.textContent = s.doneCount;
    statSessions.textContent = s.sessions;

    const goal = Math.max(10, Number(s.goalMinutes || 120));
    const pct = Math.min(100, Math.round((s.focusMinutes / goal) * 100));
    statGoal.textContent = `${pct}%`;
    goalProgressBar.style.width = `${pct}%`;

    streakDaysEl.textContent = s.streak || 0;
  }

  saveGoalBtn.addEventListener('click', () => {
    const k = todayKey();
    statsByDay[k].goalMinutes = Math.max(10, Number(dailyGoalInput.value || 120));
    saveJSON(KEY.STATS, statsByDay);
    renderStats();
  });

  // ---- Quotes ----
  async function fetchQuote() {
    try {
      const res = await fetch('/api/quotes');
      const data = await res.json();
      quoteBox.textContent = data.quote || 'Stay focused!';
    } catch {
      quoteBox.textContent = 'Stay focused!';
    }
  }

  // ---- Leaderboard ----
  async function loadLeaderboard() {
    const res = await fetch('/api/leaderboard');
    const list = await res.json();
    leaderboardBody.innerHTML = '';
    list.forEach((row, i) => {
      const tr = document.createElement('tr');
      const when = new Date(row.at).toLocaleString();
      tr.innerHTML = `<td>${i+1}</td><td>${row.name}</td><td>${row.points}</td><td>${when}</td>`;
      leaderboardBody.appendChild(tr);
    });
  }

  leaderboardForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const k = todayKey();
    const s = statsByDay[k];
    const points = Number(s.focusMinutes) + Number(s.doneCount) * 5;
    const name = playerNameInput.value.trim() || 'Anonymous';
    if (points <= 0) { alert('Earn some points first!'); return; }
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, points })
    });
    playerNameInput.value = '';
    await loadLeaderboard();
  });

  // ---- Settings ----
  soundToggle.addEventListener('change', () => { settings.sound = soundToggle.checked; saveJSON(KEY.SETTINGS, settings); });
  autoStartBreaks.addEventListener('change', () => { settings.autoStartBreaks = autoStartBreaks.checked; saveJSON(KEY.SETTINGS, settings); });
  autoStartFocus.addEventListener('change', () => { settings.autoStartFocus = autoStartFocus.checked; saveJSON(KEY.SETTINGS, settings); });

  // ---- Controls ----
  btnStart.addEventListener('click', startTimer);
  btnPause.addEventListener('click', pauseTimer);
  btnReset.addEventListener('click', resetTimer);

  [focusMinsInput, shortBreakMinsInput, longBreakMinsInput].forEach(inp => {
    inp.addEventListener('change', () => {
      // If currently in that phase, update secondsLeft
      if (timer.phase === PHASES.FOCUS) timer.secondsLeft = Number(focusMinsInput.value) * 60;
      if (timer.phase === PHASES.SHORT) timer.secondsLeft = Number(shortBreakMinsInput.value) * 60;
      if (timer.phase === PHASES.LONG) timer.secondsLeft = Number(longBreakMinsInput.value) * 60;
      updateDisplay();
    });
  });

  // ---- Reset All ----
  $('#resetAll').addEventListener('click', () => {
    if (!confirm('Reset all local data (tasks, stats, settings)?')) return;
    localStorage.removeItem(KEY.TASKS);
    localStorage.removeItem(KEY.STATS);
    localStorage.removeItem(KEY.SETTINGS);
    tasks = [];
    statsByDay = {};
    settings = { sound: true, autoStartBreaks: true, autoStartFocus: false };
    soundToggle.checked = settings.sound;
    autoStartBreaks.checked = settings.autoStartBreaks;
    autoStartFocus.checked = settings.autoStartFocus;
    dailyGoalInput.value = 120;
    switchPhase(PHASES.FOCUS);
    renderTasks();
    renderStats();
  });

  // ---- Init ----
  switchPhase(PHASES.FOCUS);
  renderTasks();
  renderStats();
  fetchQuote();
  loadLeaderboard();
})();
