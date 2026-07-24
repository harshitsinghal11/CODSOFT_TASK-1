# Job Board — Project Docs (Simplified)

> Scope: A simple job board where employers post jobs and job seekers search/apply.
> Stack: React (frontend), Node.js/Express (backend), MongoDB (database).
> Rule for whoever builds this: keep it simple. Do not add features not listed here.

---

## 1. PRD (Product Requirements)

### Project Vision
A simple, working job board — employers post jobs, candidates find and apply to them.

### Problem Statement
Job seekers need an easy way to find and apply to jobs. Employers need an easy way to post openings and manage applicants.

### Goals
- Employers can create an account, post jobs, and view applicants.
- Candidates can create an account, search jobs, and apply with a resume.
- Everything works on both desktop and mobile.

### Target Audience
- **Employers**: want to post a job quickly and see who applied.
- **Job Seekers**: want to search jobs and apply fast.

### User Roles & Permissions
| Role | Can Do |
|---|---|
| **Employer** | Sign up/login, post/edit/delete own jobs, view applicants to own jobs |
| **Candidate** | Sign up/login, browse/search jobs, apply with resume, view own applications |

*(No admin role — not required by the task.)*

### Core Features
1. Home page (welcome + featured job listings)
2. Job listings page (browse + search)
3. Job detail page
4. Employer dashboard (manage account + post jobs)
5. Candidate dashboard (profile + view applications)
6. Job application (form + resume upload)
7. Search bar
8. Email notification on successful application
9. User authentication (login/signup for both roles)
10. Mobile responsive design

### Functional Requirements
- Employer can create/edit/delete a job posting (title, description, location, salary, job type).
- Candidate can search jobs by keyword and/or location.
- Candidate can apply to a job once (upload resume, submit).
- Candidate receives an email confirming their application was submitted.
- Employer can see a list of candidates who applied to each of their jobs.

### Non-Functional Requirements
- Site should load reasonably fast (no heavy unused libraries).
- Passwords stored securely (hashed, never plain text).
- Site should be usable on mobile screens.

### Assumptions
- One resume file per application (PDF).
- No payments involved.
- Single currency/region — no localization needed.

### Constraints
- Solo/small project — keep architecture simple, no microservices.
- Timeboxed build — avoid gold-plating.

### Out of Scope (explicitly cut, add later if ever needed)
- Admin panel / admin role
- In-app messaging between employer and candidate
- Analytics dashboards
- Payment/subscription plans
- Multi-language support

---

## 2. TRD (Technical Requirements)

### Tech Stack
- **Frontend**: React (with React Router)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)
- **File storage**: Local/Cloud storage for resume uploads (e.g., Cloudinary or simple disk storage — pick one, don't overbuild)
- **Auth**: JWT-based authentication

### System Architecture
Simple 3-tier architecture:
```
React (client) → Express REST API (server) → MongoDB (database)
```
No microservices, no separate auth service — keep it monolithic and simple.

### Authentication Strategy
- Email + password signup/login.
- Passwords hashed with bcrypt.
- JWT issued on login, stored client-side, sent on protected requests.
- Two user types differentiated by a `role` field (`employer` | `candidate`).

### Third-Party Integrations
- **Email service**: for application-confirmation emails (e.g., Nodemailer + SMTP, or a free tier like Resend/SendGrid).
- **File upload**: for resume PDFs (e.g., Cloudinary free tier, or local disk storage for simplicity).

### Deployment Overview
- Frontend: Vercel/Netlify
- Backend: Render/Railway
- Database: MongoDB Atlas (free tier)

---

## 3. App Flow

### Application Overview
A candidate browses/searches jobs → views a job → applies with resume → gets a confirmation email.
An employer signs up → posts a job → views applicants on their dashboard.

### Navigation Structure
```
/                      → Home
/jobs                  → Job Listings (with search)
/jobs/:id              → Job Detail
/login, /signup        → Auth (role selection: employer / candidate)
/employer/dashboard    → Employer Dashboard (my jobs, post new job)
/candidate/dashboard   → Candidate Dashboard (my applications, profile)
```

### Role-Based Flows
**Employer**: Signup/Login → Dashboard → Post Job → View Applicants
**Candidate**: Signup/Login → Browse/Search Jobs → Job Detail → Apply → Dashboard (view application status)

### Feature Workflows
- **Post a Job** (Employer): Fill form (title, description, location, salary, type) → Submit → Job appears in listings.
- **Apply to Job** (Candidate): Open job detail → Click Apply → Fill short form + upload resume → Submit → Confirmation email sent.
- **Search Jobs**: Type keyword/location in search bar → Listings filter → Click a job → Job Detail page.

### Error Handling
- Invalid login → show inline error message.
- Duplicate application to same job → block with a message ("You already applied").
- Failed resume upload (wrong file type/size) → show inline error before submit.

### Edge Cases
- Candidate applies without completing profile → prompt to add basic info first.
- Employer deletes a job that has existing applicants → keep applicant records, mark job as closed.

---

## 4. UI/UX

### Screens Needed (in Figma, then built in React)
1. Home
2. Job Listings (with search bar)
3. Job Detail
4. Login / Signup (role toggle)
5. Employer Dashboard
6. Candidate Dashboard
7. Job Application Form (modal or page)

### Colors & Typography
- Pick one primary brand color + one accent color + neutrals (gray scale) — keep the palette small.
- One font family, 2–3 weights (regular, medium, bold) is enough.

### States to Design
- **Loading state**: spinner/skeleton while jobs load.
- **Empty state**: "No jobs found" (listings), "You haven't applied to any jobs yet" (candidate dashboard).
- **Error state**: simple inline error message on failed actions (login fail, submit fail).

---

## 5. Data Architecture

### Database Schema (MongoDB collections)

**Users**
```
{ _id, name, email, password (hashed), role: "employer" | "candidate", createdAt }
```

**Jobs**
```
{ _id, employerId (ref Users), title, description, location, salary, jobType, createdAt }
```

**Applications**
```
{ _id, jobId (ref Jobs), candidateId (ref Users), resumeUrl, status: "submitted", appliedAt }
```

### Relationships
- One Employer → many Jobs
- One Job → many Applications
- One Candidate → many Applications

### Indexes
- `Jobs`: index on `title`, `location` (for search).
- `Applications`: compound index on `jobId + candidateId` (to prevent duplicate applications).

### Storage
- One bucket/folder for resume files (PDF only), linked via `resumeUrl` in Applications.

*(Cut: RLS policies, DB functions, separate "API Models" doc — not needed for this stack/scale. Basic Express route validation is enough.)*

---

## 6. Folder Structure

```
job-board/
├── client/                      # React app
│   ├── src/
│   │   ├── components/          # shared UI components (Navbar, JobCard, etc.)
│   │   ├── pages/                # Home, JobListings, JobDetail, Login, Signup,
│   │   │                          EmployerDashboard, CandidateDashboard
│   │   ├── hooks/                # custom hooks (e.g., useAuth)
│   │   ├── services/             # API calls (axios/fetch wrappers)
│   │   ├── context/               # auth context (user, token)
│   │   └── utils/                 # helpers (formatters, validators)
│   └── package.json
│
├── server/                      # Node.js + Express app
│   ├── src/
│   │   ├── routes/               # authRoutes, jobRoutes, applicationRoutes
│   │   ├── controllers/          # logic for each route
│   │   ├── models/                # Mongoose schemas: User, Job, Application
│   │   ├── middleware/            # auth middleware (JWT check), upload middleware
│   │   ├── services/              # email service, upload service
│   │   └── utils/                 # helpers
│   └── package.json
│
└── README.md
```

*(Cut: separate `app/api`, `app/auth`, `app/main/admin`, `app/main/user`, `types/`, `interfaces/`, `actions/` — this project doesn't use Next.js app router or an admin role, and a small codebase doesn't need types/interfaces split into separate folders.)*

---

## What Was Removed & Why
- **Admin role/dashboard** — task only mentions Employer and Candidate.
- **RLS Policies, DB Functions, separate API Models doc** — these are Supabase/Postgres-specific patterns; not needed with a simple Express + MongoDB setup.
- **Next.js-style app router folders (`app/api`, `app/auth`, `app/main/admin`, `app/main/user`)** — task doesn't specify Next.js; a simple client/server split is enough and easier to reason about.
- **Separate `types/`, `interfaces/`, `actions/` folders** — over-structuring for a simple project; kept logic inside `controllers/`, `services/`, `models/`.
- **Business Rules / Future Enhancements as heavy sections** — condensed into a short "Out of Scope" list so the build stays focused.
