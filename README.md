# 🎮 Tic-Tac-Toe Web Application

A modern full-stack **Tic-Tac-Toe** web game built with **Next.js**, featuring Google OAuth authentication, a score tracking system, win streak bonuses, and a responsive leaderboard.

This project demonstrates full-stack development with authentication, database integration, API routes, and responsive UI design.

---

# 🚀 Live Demo

> Add your deployed URL here  
> Example:
> https://your-domain.vercel.app

---

# ✨ Features

## 🎯 Game System

- 3×3 Tic-Tac-Toe board
- Player vs Bot gameplay
- Automatic win / draw detection
- Turn-based logic
- Game reset system

## 🏆 Score System

- +1 point for each win
- −1 point for each loss
- 🔥 Bonus +1 point for 3 consecutive wins
- Persistent score storage (MongoDB)
- Auto-updating leaderboard

## 🔐 Authentication

- Google OAuth 2.0
- Secure session handling via NextAuth
- JWT-based session encryption

## 📊 Leaderboard

- Top 5 highest scoring players
- Sorted by score (descending)
- Desktop: fixed right sidebar
- Mobile: bottom sheet modal

## 📱 Responsive Design

- Fully responsive layout
- Mobile-friendly modal system
- Accessibility-aware components

---

# 🛠️ Tech Stack

| Technology    | Purpose                    |
| ------------- | -------------------------- |
| Next.js       | Full-stack React framework |
| TypeScript    | Type safety                |
| NextAuth      | Authentication             |
| MongoDB Atlas | Database                   |
| Tailwind CSS  | Styling                    |
| Vercel        | Deployment                 |

---

# 📂 Project Structure

- /app
- /api
- /auth
- /score
- /game-result
- /components
- /lib
- /models

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Fuse441/tic-tac-toe.git
cd tic-tac-toe

npm install

Environment Variables

Create a file named: .env.local
# ==============================
# NextAuth Configuration
# ==============================

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key

# ==============================
# Google OAuth Credentials
# ==============================

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ==============================
# MongoDB Database
# ==============================

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

🔐 Generate NEXTAUTH_SECRET

Run this command: openssl rand -base64 32
Copy the output and paste it into:
NEXTAUTH_SECRET=

🔑 Google OAuth Setup

Go to Google Cloud Console
https://console.cloud.google.com/

Create a new project.

Enable Google Identity Services.

Navigate to:
APIs & Services → Credentials

Create OAuth Client ID.

Add Authorized Redirect URI:

For local development:
http://localhost:3000/api/auth/callback/google

🧪 Running the App (Development)

Start development server: npm run dev

| Endpoint                  | Method     | Description            |
| ------------------------- | ---------- | ---------------------- |
| `/api/auth/[...nextauth]` | GET / POST | Authentication handler |
| `/api/score`              | GET        | Fetch user score       |
| `/api/score`              | POST       | Update score           |
| `/api/game-result`        | POST       | Submit game result     |
```
