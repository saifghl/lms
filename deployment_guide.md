# Deploying LMS to Render.com

This guide will help you deploy your Lease Management System (LMS) to Render.com.

## Prerequisites
1.  **GitHub Repository**: Push your code to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).

## Part 1: Database (MySQL)
Render provides managed PostgreSQL, but for MySQL, you might need an external provider like **Clever Cloud** (free tier available) or use **Aiven**.
*Alternatively, you can switch your backend to use PostgreSQL or SQLite if you prefer, but your current setup is MySQL.*

**If you stick with MySQL:**
1.  Create a MySQL database on a provider (e.g., Clever Cloud).
2.  Get the **Connection URL** or Host, User, Password, DB Name.
3.  Import your `database_schema.sql` (if you have one) or run the `CREATE TABLE` commands in your database tool (Workbench) connected to the cloud DB.

## Part 2: Backend Deployment
1.  **New Web Service** on Render.
2.  Connect your GitHub repo.
3.  **Root Directory**: `backend`
4.  **Build Command**: `npm install`
5.  **Start Command**: `node server.js`
6.  **Environment Variables**:
    *   `PORT`: `5000` (or let Render assign one)
    *   `DB_HOST`: Your Cloud DB Host
    *   `DB_USER`: Your Cloud DB User
    *   `DB_PASSWORD`: Your Cloud DB Password
    *   `DB_NAME`: Your Cloud DB Name

## Part 3: Frontend Deployment
1.  **New Static Site** on Render.
2.  Connect your GitHub repo.
3.  **Root Directory**: `.` (root of the repo)
4.  **Build Command**: `npm install && npm run build`
5.  **Publish Directory**: `build`
6.  **Environment Variables**:
    *   `REACT_APP_API_URL`: The URL of your deployed Backend (e.g., `https://lms-backend.onrender.com/api`)

## Important Checks
*   **CORS**: In `backend/server.js`, you currently have `app.use(cors())` which allows all origins. This is fine for testing but for production, you might want to restrict it to your frontend domain.
*   **Database**: Ensure your cloud database allows connections from everywhere or specifically from Render's IPs.

## Local Testing
To run locally as you are doing now:
1.  **Backend**: `cd backend` -> `node server.js` (Runs on port 5000)
2.  **Frontend**: `cd ..` -> `npm start` (Runs on port 3000/3001)
3.  Access at `http://localhost:3000` (or 3001).
