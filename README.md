# FocusFlow — Task Timer & Productivity Tracker

A clean Pomodoro-based productivity web app built with **HTML, CSS, Bootstrap, JavaScript, and Node.js (Express)**.  
Includes tasks with per-task time tracking, daily stats, goals, motivational quotes, sound notifications, and a simple local leaderboard.

## Features
- Pomodoro timer with customizable focus, short break, and long break durations
- Auto-start options for breaks and next focus session
- Task list with +5 minutes quick logging and done/undo
- Daily stats: total focus minutes, tasks done, sessions, and goal progress bar
- Daily goal (minutes) with progress
- Streak (consecutive days with focus time)
- Motivational quotes (server endpoint)
- Sound notifications (Web Audio API) + optional browser notifications
- Local leaderboard (Express endpoints, JSON storage)

## Quick Start
```bash
# 1) Extract and enter the folder
cd task-timer-app

# 2) Install dependencies
npm install

# 3) Run
npm start
# Server will run at http://localhost:3000
```

> If port 3000 is busy, set another port:
```bash
PORT=5000 npm start
```

## Folder Structure
```
task-timer-app/
├─ data/
│  └─ leaderboard.json
├─ public/
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
├─ server.js
└─ package.json
```

## How Points Work
```
points = focusMinutes × 1 + tasksCompleted × 5
```
Submit your score from the Leaderboard card.

## Notes
- This demo stores leaderboard data in a local JSON file. For multi-user/internet use, connect a DB (MongoDB/Postgres) and add auth.
- All user stats and tasks are stored in the browser’s localStorage (per device).

## License
MIT
