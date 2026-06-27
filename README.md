# Taskflow — MERN Stack Task Tracker

A full-featured task management application built with MongoDB, Express.js, React, and Node.js.

---

## Features

### Mandatory (all implemented)
- **Full CRUD** — Create, read, update, and delete tasks
- **Form validation** — Client-side + server-side with detailed error messages
- **REST API** — 8 endpoints covering all task operations
- **MongoDB integration** — Mongoose ODM with indexes and validation
- **Responsive UI** — Works on mobile, tablet, and desktop
- **Dynamic updates** — No page refresh; React state syncs instantly with the API

### Bonus features
- **Kanban board** — Tasks auto-group into To Do / In Progress / Done columns
- **Filtering** — By status, priority, and free-text search (title, description, tags)
- **Sorting** — Newest, oldest, due date, priority, alphabetical
- **Stats dashboard** — Live counts by status with overdue alert
- **Notifications** — Toast messages for every action
- **Overdue detection** — Highlights tasks past their due date
- **Tags** — Comma-separated, displayed as pills with search support
- **Status quick-cycle** — Click the status badge on any card to advance it
- **Environment variables** — All config via `.env` files; no hardcoded values
- **Skeleton loading** — Smooth skeleton cards while data loads
- **Reusable components** — `Modal`, `TaskCard`, `FilterBar`, `StatsBar`, `ConfirmDialog`

---

## Project Structure

```
task-tracker/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── errorHandler.js     # Global error handler
│   │   └── validators.js       # express-validator rules
│   ├── models/
│   │   └── Task.js             # Mongoose schema
│   ├── routes/
│   │   └── tasks.js            # REST API routes
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── context/
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root scripts (concurrently)
├── render.yaml                 # Backend deployment (Render.com)
├── vercel.json                 # Frontend deployment (Vercel)
└── README.md
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- A MongoDB database (free at [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task-tracker
```

### 2. Configure environment variables

**Backend** — copy and fill in your values:
```bash
cp backend/.env.example backend/.env
```

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/tasktracker
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** — copy and fill in:
```bash
cp frontend/.env.example frontend/.env
```

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Install dependencies
```bash
npm install           # root (concurrently)
npm run install:all   # backend + frontend
```

### 4. Run the app
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## REST API Reference

**Base URL:** `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks (filter, sort, search, paginate) |
| GET | `/tasks/stats` | Aggregate stats (totals, overdue) |
| GET | `/tasks/:id` | Get a single task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| PATCH | `/tasks/:id/status` | Update status only |
| DELETE | `/tasks/:id` | Delete a task |
| DELETE | `/tasks` | Bulk delete by IDs |
| GET | `/health` | Health check |

### Query parameters for `GET /tasks`

| Param | Values | Description |
|-------|--------|-------------|
| `status` | `todo`, `in-progress`, `completed`, `all` | Filter by status |
| `priority` | `low`, `medium`, `high`, `all` | Filter by priority |
| `search` | any string | Search title, description, tags |
| `sort` | `createdAt`, `updatedAt`, `title`, `dueDate`, `priority` | Sort field |
| `order` | `asc`, `desc` | Sort direction |
| `page` | number | Page number (default 1) |
| `limit` | number | Items per page (default 50) |

### Task schema

```json
{
  "_id": "ObjectId",
  "title": "string (required, 2–100 chars)",
  "description": "string (optional, max 500 chars)",
  "status": "todo | in-progress | completed",
  "priority": "low | medium | high",
  "dueDate": "ISO 8601 date | null",
  "tags": ["string"],
  "createdAt": "ISO 8601 date",
  "updatedAt": "ISO 8601 date"
}
```

---

## Deployment

### Backend → Render.com (free tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo and set **Root Directory** to `backend`
4. Build command: `npm install` | Start command: `node server.js`
5. Add environment variables:
   - `MONGODB_URI` — your Atlas connection string
   - `NODE_ENV` — `production`
   - `FRONTEND_URL` — your Vercel URL (set after step below)
6. Deploy — note your API URL (e.g. `https://task-tracker-api.onrender.com`)

### Frontend → Vercel (free tier)

1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` — your Render backend URL + `/api`
4. Deploy

### After both are live
- Go back to Render → Environment → update `FRONTEND_URL` with your Vercel URL
- This enables the correct CORS origin on the backend

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Axios, date-fns |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Validation | express-validator (server), custom hooks (client) |
| Deployment | Render.com (API), Vercel (frontend) |
