# QuickHire — Full-Stack Job Board Application

<div align="center">

![QuickHire Banner](https://img.shields.io/badge/QuickHire-Job%20Board-4F46E5?style=for-the-badge&logo=briefcase&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A modern, full-stack job board where job seekers can discover opportunities and admins can manage listings — built as part of the QSL Associate Software Engineer Technical Assessment.**

[🔗 Live Demo](#) · [📹 Demo Video](#) · [🐛 Report Bug](https://github.com/SadManFahIm/QTEC-Task/issues)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)

---

## 🎯 Overview

**QuickHire** is a responsive, production-ready job board application that solves the problem of connecting job seekers with top companies. The platform provides:

- A clean, Figma-matched UI for browsing thousands of job listings
- Powerful search and multi-filter capabilities
- A streamlined application flow with real-time form validation
- A complete admin dashboard for managing job postings and reviewing applicants

> Built with a focus on clean code architecture, reusable components, and a professional developer experience.

---

## ✨ Features

### 🔍 Job Seeker
- **Landing Page** — Hero section, category explorer, featured jobs, latest openings
- **Job Listings** — Browse all jobs with live search by keyword
- **Advanced Filtering** — Filter simultaneously by category, location, and employment type
- **Job Detail Page** — Full job description, requirements, company info
- **Apply Now Form** — Client-side + server-side validation (name, email, resume URL, cover note)
- **Duplicate Prevention** — Cannot apply to the same job twice with the same email

### ⚙️ Admin Panel
- **Stats Dashboard** — Total jobs, applications, and active categories at a glance
- **Job Management** — Create new listings via a modal form; delete existing ones instantly
- **Applications Viewer** — Review all submitted applications with applicant details and resume links
- **Real-time UI** — No page refresh needed — state updates instantly on create/delete

### 🛠️ Technical
- **REST API** — Clean, consistent `{ success, data, message }` response format
- **Input Validation** — Both client-side (React) and server-side (express-validator)
- **Responsive Design** — Fully mobile-friendly across all screen sizes
- **Environment Config** — `.env` based configuration for all environments
- **Cascade Deletes** — Deleting a job automatically removes all its applications

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework with server components |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Icons** | Lucide React | Clean, consistent icon library |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MySQL 8.0 | Relational data storage |
| **Validation** | express-validator | Server-side input validation |
| **Deployment** | Vercel + Railway | Frontend + Backend hosting |

---

## 📁 Project Structure

```
quickhire/
│
├── 📂 backend/                         # Express.js REST API
│   ├── 📂 config/
│   │   ├── db.js                       # MySQL connection pool
│   │   └── schema.sql                  # DB schema + 12 sample jobs
│   ├── 📂 controllers/
│   │   ├── jobController.js            # Jobs CRUD business logic
│   │   └── applicationController.js   # Applications business logic
│   ├── 📂 routes/
│   │   ├── jobs.js                     # Job API routes + validation
│   │   └── applications.js            # Application API routes + validation
│   ├── .env.example                    # Environment variable template
│   ├── package.json
│   └── server.js                       # App entry point
│
└── 📂 frontend/                        # Next.js 14 App
    └── 📂 src/
        ├── 📂 app/
        │   ├── page.js                 # / — Landing page
        │   ├── 📂 jobs/
        │   │   ├── page.js             # /jobs — Listings + filters
        │   │   └── 📂 [id]/
        │   │       └── page.js         # /jobs/:id — Detail + apply
        │   └── 📂 admin/
        │       └── page.js             # /admin — Admin dashboard
        ├── 📂 components/
        │   ├── 📂 layout/
        │   │   ├── Navbar.js           # Sticky responsive navbar
        │   │   └── Footer.js           # Site footer with newsletter
        │   ├── 📂 jobs/
        │   │   ├── JobCard.js          # Featured job card
        │   │   ├── JobListItem.js      # Compact list item
        │   │   ├── CategoryCard.js     # Category explorer card
        │   │   ├── JobFilters.js       # Sidebar filter panel
        │   │   └── ApplyForm.js        # Application form
        │   ├── 📂 admin/
        │   │   └── AdminDashboard.js   # Full admin panel
        │   └── 📂 ui/
        │       └── SearchBar.js        # Search + location input
        └── 📂 lib/
            └── api.js                  # All API calls + UI helpers
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://dev.mysql.com/downloads/) 8.0
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/SadManFahIm/QTEC-Task.git
cd QTEC-Task
```

---

### Step 2 — Database Setup

Open MySQL and run the schema file to create the database, tables, and seed data:

```bash
mysql -u root -p
```

```sql
source /full/path/to/backend/config/schema.sql
exit
```

This will create:
- `quickhire` database
- `jobs` table
- `applications` table
- 12 sample job listings across 8 categories

---

### Step 3 — Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=quickhire
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

✅ API running at: `http://localhost:5000`  
✅ Health check: `http://localhost:5000/api/health`

---

### Step 4 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Open `.env.local` and set the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

✅ App running at: `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend — `backend/.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | `5000` |
| `DB_HOST` | MySQL server hostname | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | Database name | `quickhire` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |

### Frontend — `frontend/.env.local`

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🔗 API Reference

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | Get all jobs |
| `GET` | `/api/jobs?search=designer` | Search by keyword |
| `GET` | `/api/jobs?category=Design` | Filter by category |
| `GET` | `/api/jobs?location=London` | Filter by location |
| `GET` | `/api/jobs?type=Full+Time` | Filter by type |
| `GET` | `/api/jobs/categories` | Get categories + counts |
| `GET` | `/api/jobs/:id` | Get single job |
| `POST` | `/api/jobs` | Create job (admin) |
| `DELETE` | `/api/jobs/:id` | Delete job (admin) |

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/jobs/:id/applications` | Submit application |
| `GET` | `/api/applications` | Get all applications (admin) |
| `GET` | `/api/jobs/:id/applications` | Get applications for a job |

### Response Format

All endpoints return a consistent JSON structure:

```json
{
  "success": true,
  "message": "Job created successfully.",
  "data": { ... },
  "total": 12
}
```

---

## 📸 Screenshots

### 🏠 Landing Page
> Hero section with search, category explorer, featured jobs, and latest openings

![Landing Page](https://via.placeholder.com/800x400/4F46E5/ffffff?text=Landing+Page+—+QuickHire)

### 📋 Job Listings
> Browse all jobs with real-time search and sidebar filters

![Job Listings](https://via.placeholder.com/800x400/6366F1/ffffff?text=Job+Listings+—+Search+%26+Filter)

### 📄 Job Detail + Apply
> Full job description with sticky Apply Now form and validation

![Job Detail](https://via.placeholder.com/800x400/3730A3/ffffff?text=Job+Detail+%2B+Apply+Form)

### ⚙️ Admin Panel
> Stats overview, job management table, and applications viewer

![Admin Panel](https://via.placeholder.com/800x400/1A1A2E/ffffff?text=Admin+Panel+—+Manage+Jobs)

---

## ✅ Assessment Checklist

### Core Requirements
- [x] Job listings page with display of all jobs
- [x] Search functionality (keyword search)
- [x] Filter by category and location
- [x] Clean, responsive layout
- [x] Job detail page with full description
- [x] Apply Now form (name, email, resume URL, cover note)
- [x] Basic admin view — add new job listings
- [x] Basic admin view — delete job listings
- [x] Must be fully responsive
- [x] Use Tailwind CSS
- [x] Maintain clean and professional UI
- [x] Reusable components
- [x] Proper component structure
- [x] Organised folder structure
- [x] Clean naming conventions
- [x] REST API — GET /api/jobs
- [x] REST API — GET /api/jobs/:id
- [x] REST API — POST /api/jobs (admin)
- [x] REST API — DELETE /api/jobs/:id (admin)
- [x] REST API — POST /api/jobs/:id/applications
- [x] MySQL database
- [x] Persist job listings and applications
- [x] Proper model relationships (foreign key)
- [x] Basic input validation on all endpoints
- [x] Email must be properly formatted
- [x] Resume link must be a valid URL
- [x] Clean folder structure
- [x] Meaningful naming conventions
- [x] Modular and reusable components
- [x] README with setup instructions

### Bonus
- [x] Environment-based configuration
- [x] Clean API response formatting
- [ ] Deployed frontend/backend
- [ ] Improved admin UI (login)
- [ ] Loading states & UX enhancements

---

## 👤 Author

**Fahim** — Associate Software Engineer Candidate  
GitHub: [@SadManFahIm](https://github.com/SadManFahIm)

---
