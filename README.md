# InsightHub

InsightHub is a full-stack blogging platform with role-based experiences for **Admin**, **Writer**, and **Reader** users.

## Architecture Overview

```text
React Frontend  →  .NET Web API  →  MongoDB

Browser         →  Backend API   →  Database
```

Flow:
1. User opens the UI.
2. React calls API endpoints.
3. API reads/writes MongoDB.
4. Data is returned to the UI.

---


## Current Repository Status

The repository now includes initial implementation scaffolding for **Phase 1 (Authentication)**:

- `backend/InsightHubApi` with MongoDB-backed register/login/user-list APIs.
- `frontend/insighthub-web` with React + TypeScript routes for `/login`, `/register`, `/admin`, `/writer`, and `/home`.
- Role-based redirect behavior after login (Admin → `/admin`, Writer → `/writer`, Reader → `/home`).

## 1) Local Prerequisites

Install these tools before you start:

- **.NET 8 SDK**: https://dotnet.microsoft.com/download
- **Node.js (LTS)**: https://nodejs.org
- **MongoDB Community Server**: https://www.mongodb.com/try/download/community
- **VS Code**: https://code.visualstudio.com

Recommended VS Code extensions:
- C# Dev Kit
- ES7 React Snippets
- Tailwind CSS IntelliSense

---

## 2) Project Structure

```text
InsightHub/
  backend/
  frontend/
```

---

## 3) Backend Setup (.NET Web API)

```bash
cd backend
dotnet new webapi -n InsightHubApi
cd InsightHubApi
```

Install backend packages:

```bash
dotnet add package MongoDB.Driver
dotnet add package BCrypt.Net-Next
```

Create folders:

```text
/Controllers
/Services
/Repositories
/Models
/DTOs
/Config
```

---

## 4) Frontend Setup (React + TypeScript)

```bash
cd frontend
npx create-react-app insighthub-web --template typescript
cd insighthub-web
```

Install frontend packages:

```bash
npm install axios react-router-dom
npm install -D tailwindcss
npx tailwindcss init
```

Configure Tailwind in `tailwind.config.js`.

---

## 5) MongoDB Setup

Start local MongoDB:

```bash
mongod
```

Create database: `InsightHubDb`

Collections auto-create when first used:
- `users`
- `posts`
- `categories`

`appsettings.json` Mongo config:

```json
{
  "MongoSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "InsightHubDb"
  }
}
```

---

## 6) Phase-by-Phase Development Plan (Build in Order)

### Phase 1 — Authentication Module

Collection: `users`

```json
{
  "name": "Admin User",
  "email": "admin@insighthub.com",
  "passwordHash": "",
  "role": "Admin",
  "createdAt": "date"
}
```

APIs:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/users`

UI routes:
- `/login`
- `/register`

Role redirects after login:
- Admin → `/admin`
- Writer → `/writer`
- Reader → `/home`

### Phase 2 — Blog Core

Collection: `posts`

```json
{
  "title": "",
  "content": "",
  "categoryId": "",
  "authorId": "",
  "status": "Draft",
  "createdAt": ""
}
```

Collection: `categories`

```json
{
  "name": "Technology"
}
```

APIs:
- `POST /api/posts`
- `PUT /api/posts/{id}`
- `GET /api/posts`
- `GET /api/posts/{id}`
- `DELETE /api/posts/{id}`

Writer UI:
- `/writer/dashboard`
- `/writer/create`
- `/writer/edit`

Install rich text editor:

```bash
npm install react-quill
```

### Phase 3 — Reader Experience

Routes:
- `/home`
- `/post/:id`
- `/category/:id`

UI requirements:
- Blog cards
- Author name
- Publish date

### Phase 4 — Admin Panel

Routes:
- `/admin/dashboard`
- `/admin/users`
- `/admin/categories`
- `/admin/posts`

Admin features:
- Delete posts
- Manage users
- Manage categories

---

## 7) Run Locally

Backend:

```bash
cd backend/InsightHubApi
dotnet run
```

Default URL: `http://localhost:5000`

Frontend:

```bash
cd frontend/insighthub-web
npm start
```

Default URL: `http://localhost:3000`

---

## 8) Frontend API Client

Create `src/services/api.ts`:

```ts
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api"
});
```

---

## 9) Seed Initial Data

Use MongoDB Compass to insert:
- Admin user
- A few categories
- Sample posts

---

## 10) Deployment Plan

### Backend (.NET API)
Deploy to **Azure App Service**.

Set environment variables:
- `MongoSettings__ConnectionString`
- `MongoSettings__DatabaseName`

### Database
Use **MongoDB Atlas** (free tier):
- Create cluster
- Whitelist IP
- Use Atlas connection string

### Frontend
Deploy to **Vercel**:

```bash
npm run build
```

Set environment variable:
- `REACT_APP_API_URL`

Production architecture:

```text
Users
  ↓
Vercel (React)
  ↓
Azure (.NET API)
  ↓
MongoDB Atlas
```

---

## 11) Post-MVP Enhancements (Do Later)

- JWT authentication
- Comments
- Likes/Claps
- SEO metadata
- Image cloud storage
- Search
- AI article generator

---

## 12) Suggested Execution Timeline

- **Week 1**: Tooling + project generation + authentication
- **Week 2**: Blog CRUD
- **Week 3**: Reader UI
- **Week 4**: Deploy MVP

Codex generation sequence:
1. Project setup
2. Auth module
3. Blog module
4. Reader UI
5. Admin UI
6. Deployment scripts
