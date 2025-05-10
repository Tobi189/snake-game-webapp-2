# 🐍 Snake Game Web Application

**Author**: Liang Yue
**Course**: CS250 – Final Project  
**GitHub**: https://github.com/Tobi189/snake-game-webapp-2

---

## 📘 Project Description

The Snake Game Web Application is a modern web-based version of the classic Snake game. Users can create accounts, play the game within a fixed grid, customize settings, and track their scores across sessions. Personal bests and a global leaderboard are automatically maintained through a PostgreSQL database. The project is fully containerized using Docker for local deployment.

---

## 🎮 Features

- **User Authentication**: Sign up, log in, change password, and delete account
- **Game Logic**: Play the snake game with grid collision, food consumption, and growing tail
- **Score System**: Earn points based on speed; submit scores automatically
- **Global Leaderboard**: Top 5 scores across all users shown in-game
- **Customization Options**:
  - Game speed (Fast, Normal, Slow)
  - Grid size (Small, Medium, Large)
  - Snake color and food appearance
- **Pause & Resume**: Pause the game at any time
- **Responsive UI**: Sidebar for user info, settings panel, and overlays

---

## 🧱 Tech Stack

- **Frontend**: HTML5, CSS, JavaScript (Canvas-based)
- **Backend**: Python, Flask
- **Database**: PostgreSQL
- **Tools**: Docker, Docker Compose, psycopg2, Jinja2

---

## 🐳 How to Run the App (Docker Required)

### 1. Clone the Repository
```bash
git clone https://github.com/Tobi189/snake-game-webapp-2.git
cd snake-game-webapp-2
```

### 2. Start the App
```bash
docker-compose up --build
```

> ⚠️ If you encounter a database connection error, you can try starting the database container first:

#### On Windows:
```cmd
docker-compose up -d db
timeout /t 5
```
```cmd
docker-compose up web
```

#### On macOS/Linux:
```bash
docker-compose up -d db
sleep 5
docker-compose up web
```

### 3. Open the Game
Visit: [http://localhost:5000](http://localhost:5000)

---

## 🗃️ Database Tables

### `users`
- `id` (SERIAL, PK)
- `username` (TEXT, unique)
- `password_hash` (TEXT)

### `scores`
- `id` (SERIAL, PK)
- `user_id` (INTEGER, FK → users)
- `score` (INTEGER)
- `played_at` (TIMESTAMP)

---

## 🧠 Notes

- No external deployment — runs fully locally
- All data is saved via Docker volumes
- The database is initialized automatically using `init_db.sql`

---

## 📄 License

This project is built for academic use in CS250.
