# Warmup Minimal - Variant B (Firebase + Cloudinary placeholders)

This is a minimal full-stack project (smallest practical) implementing the warm-up assignment (Variant B).
It includes:
- Backend (Express + PostgreSQL) with JWT auth scaffold
- Frontend (React + Vite) with Firebase SDK usage scaffold
- company_db.sql to create required tables
- Instructions to configure Firebase and Cloudinary (you must supply your own keys)

## What works out of the box
- Backend endpoints for register/login and company profile (use JWT)
- Frontend pages with Firebase client-side flows scaffolded (you must add Firebase config)
- Logo upload is handled in frontend and sent as URL to backend (Cloudinary upload code is scaffolded but requires keys)

## Setup (Backend)
1. Install Node.js (>=18) and PostgreSQL.
2. Create a DB and import `company_db.sql`.
3. Copy `.env.example` to `.env` and fill values.
4. `cd backend && npm install`
5. `npm run dev` to start backend

## Setup (Frontend)
1. `cd frontend`
2. `npm install`
3. Create `.env.local` with Firebase config following `.env.local.example`
4. `npm run dev` to start frontend

## Notes
- Firebase OTP/email verification must be done via Firebase SDK on frontend. After successful Firebase verification you may call backend to update verified flags if needed.
- Cloudinary upload requires API keys; the frontend includes a simple function using unsigned uploads or you can use backend-signed uploads.

