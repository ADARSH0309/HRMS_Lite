# HRMS Lite

A lightweight Human Resource Management System built as a full-stack web application for managing employee records and tracking daily attendance.

## Live Demo

- **Frontend**: [https://hrms-lite-pro.netlify.app](https://hrms-lite-pro.netlify.app)
- **Backend API**: [https://hrms-lite-pro.onrender.com](https://hrms-lite-pro.onrender.com)
- **API Docs**: [https://hrms-lite-pro.onrender.com/docs](https://hrms-lite-pro.onrender.com/docs)

## Features

### Core
- **Employee Management**: Add, view, edit, and delete employees (ID, Name, Email, Department)
- **Attendance Management**: Mark daily attendance (Present/Absent), view and filter records
- **Dashboard**: Summary cards, attendance trend chart (7 days), department distribution chart

### Bonus
- Filter attendance records by date and employee
- Total present/absent days per employee with attendance rate
- Interactive dashboard with charts (Recharts)

### UI/UX
- Dark/Light theme toggle with persistence
- Responsive design (mobile, tablet, desktop)
- Animated stat cards with Magic UI ShineBorder and AuroraText
- Staggered page load animations, hover effects, and shimmer loading states
- Empty states and error states with retry

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, Magic UI, Recharts |
| **Backend** | Python, FastAPI, Pydantic, Motor (async MongoDB driver) |
| **Database** | MongoDB Atlas |
| **Deployment** | Netlify (frontend), Render (backend) |

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=hrms_lite
FRONTEND_URL=http://localhost:4173
```

Start the server:
```bash
uvicorn app.main:app --reload --port 8001
```
API available at `http://localhost:8001` | Docs at `http://localhost:8001/docs`

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8001
```

Start the dev server:
```bash
npm run dev
```
App available at `http://localhost:4173`

## Deployment

### Frontend (Netlify)
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Environment variable: `VITE_API_URL` = your Render backend URL

### Backend (Render)
- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables: `MONGODB_URL`, `MONGODB_DB_NAME`, `FRONTEND_URL`

## Assumptions & Limitations
- **Authentication**: Single admin user, no login required (as per assignment scope)
- **Scope**: Leave management, payroll, and advanced HR features are out of scope
- **Database**: MongoDB Atlas (free tier) used for persistence
