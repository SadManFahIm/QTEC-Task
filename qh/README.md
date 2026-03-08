# QuickHire — Job Board Application

A full-stack job board where job seekers can browse and apply for jobs, and admins can manage listings.

**Tech Stack:** Next.js 14 · Node.js/Express · MySQL · Tailwind CSS

---

## Live Demo

- 🔗 Live Site:
- 📹 Demo Video:
- 💻 GitHub:

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0

---

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/quickhire.git
cd quickhire
```

---

### 2. Database setup

```bash
mysql -u root -p
```

```sql
source /path/to/qh/backend/config/schema.sql
exit
```

---

### 3. Backend

```bash
cd qh/backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quickhire
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

Runs on: http://localhost:5000

---

### 4. Frontend

```bash
cd qh/frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Runs on: http://localhost:3000

---

## Environment Variables

### Backend

| Variable       | Description                     |
| -------------- | ------------------------------- |
| `PORT`         | API server port (default: 5000) |
| `DB_HOST`      | MySQL host                      |
| `DB_USER`      | MySQL username                  |
| `DB_PASSWORD`  | MySQL password                  |
| `DB_NAME`      | Database name                   |
| `FRONTEND_URL` | Frontend URL for CORS           |

### Frontend

| Variable              | Description          |
| --------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## API Endpoints

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/jobs`                  | Get all jobs                 |
| GET    | `/api/jobs?search=x`         | Search jobs                  |
| GET    | `/api/jobs?category=Design`  | Filter by category           |
| GET    | `/api/jobs/:id`              | Get single job               |
| POST   | `/api/jobs`                  | Create job (admin)           |
| DELETE | `/api/jobs/:id`              | Delete job (admin)           |
| GET    | `/api/jobs/categories`       | Get categories               |
| POST   | `/api/jobs/:id/applications` | Apply for job                |
| GET    | `/api/applications`          | Get all applications (admin) |

---

## Features

- Browse and search job listings
- Filter by category, location, and job type
- Job detail page with full description
- Apply Now form with validation
- Admin panel — add and delete jobs
- Admin panel — view all applications
- Fully responsive design
- REST API with input validation
- Duplicate application prevention

---

## Project Structure

```
qh/
├── backend/
│   ├── config/
│   │   ├── db.js           # MySQL connection pool
│   │   └── schema.sql      # Database schema + sample data
│   ├── controllers/
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── routes/
│   │   ├── jobs.js
│   │   └── applications.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.js         # Landing page
        │   ├── jobs/page.js    # Job listings
        │   ├── jobs/[id]/page.js # Job detail
        │   └── admin/page.js   # Admin panel
        ├── components/
        │   ├── layout/         # Navbar, Footer
        │   ├── jobs/           # JobCard, ApplyForm, Filters
        │   ├── admin/          # AdminDashboard
        │   └── ui/             # SearchBar
        └── lib/
            └── api.js          # API utility functions
```
