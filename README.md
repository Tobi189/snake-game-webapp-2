# 🐍 Snake Game Web Application

This is a local, single-player snake game built using Flask, JavaScript, and PostgreSQL. It runs entirely on your machine using Docker and Docker Compose.

---

## 🐳 Run the Project (Docker Required)

### 🔧 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### ▶️ Start the App

1. Clone the repository:

```bash
git clone git@github.com:Tobi189/snake-game-webapp-2.git
cd snake-game-webapp-2
```

2. Run the app using Docker Compose:

```bash
docker-compose up --build
```

3. Open your browser and visit:

```
http://127.0.0.1:5000
```

---

## 🗃️ Database Setup

The PostgreSQL database is initialized automatically using the `init_db.sql` file via Docker Compose.

### Tables:

#### `users`
- `id` (SERIAL, primary key)
- `username` (TEXT, unique)
- `password_hash` (TEXT)

#### `scores`
- `id` (SERIAL, primary key)
- `user_id` (INTEGER, foreign key → users)
- `score` (INTEGER)
- `played_at` (TIMESTAMP)

---

## 🧠 Notes

- This is a local application. No external hosting or deployment is required.
- All functionality (authentication, gameplay, scoring) is handled within Docker containers.
- No manual database setup is needed — it is provisioned automatically.

---

## 📄 License

This project is for academic use only.
