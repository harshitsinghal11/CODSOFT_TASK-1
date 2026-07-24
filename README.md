# Job Board Platform 🚀

A modern, full-stack Job Board platform built with **Next.js (App Router)** and **Supabase**. 

> **Note:** This project was developed as part of the **Virtual Internship at CodSoft** as a **Level 2 - Task 1 (Web Developer)** assignment.

## 🌟 Features

### For Employers 🏢
- **Role-based Authentication**: Secure login and sign-up flows specifically for employers.
- **Job Management**: A dedicated dashboard to create, view, and delete job postings.
- **Applicant Tracking**: View a list of candidates who have applied to your specific job postings.
- **Resume Access**: Securely download and view PDF resumes submitted by applicants.

### For Candidates 🧑‍💻
- **Job Browsing**: A beautiful, responsive home page featuring the latest job opportunities.
- **Advanced Search**: Filter and search for jobs by keywords and location.
- **Apply with Ease**: Upload a PDF resume directly through the platform to apply for jobs.
- **Application Tracking**: A dedicated candidate dashboard to track the status of submitted applications.

## 🛠️ Technology Stack

- **Frontend**: Next.js (React 19), Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage Buckets (for PDF resumes)
- **Hosting**: Vercel

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need a free account on [Supabase](https://supabase.com/).

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd job-board
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase
1. Create a new project in the Supabase Dashboard.
2. Run the `supabase-schema.sql` script in the Supabase SQL Editor to generate the `users`, `jobs`, and `applications` tables.
3. Run the `storage-policy.sql` script to configure the RLS policies for resume uploads.
4. Go to the **Storage** tab in Supabase and create a new **Public** bucket named `resumes`.
5. (Optional) Run `seed.sql` to populate the database with mock employers and job listings.

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase project keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License
This project is open-source and available under the MIT License.
