-- Create custom Users table (extends Supabase's built-in auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('employer', 'candidate')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Jobs table
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  job_type TEXT NOT NULL, -- e.g., Full-time, Part-time, Contract
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Applications table
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  resume_url TEXT NOT NULL,
  status TEXT DEFAULT 'submitted' NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- A candidate can only apply once to a specific job
  UNIQUE(job_id, candidate_id) 
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- USERS POLICIES
-- Anyone can view users (so employers can see candidate names)
CREATE POLICY "Users are viewable by everyone." ON public.users FOR SELECT USING (true);
-- Users can insert their own profile during signup
CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
-- Users can update their own profile
CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- JOBS POLICIES
-- Anyone can view jobs
CREATE POLICY "Jobs are viewable by everyone." ON public.jobs FOR SELECT USING (true);
-- Only authenticated users with the 'employer' role can create jobs
CREATE POLICY "Employers can insert jobs." ON public.jobs FOR INSERT WITH CHECK (
  auth.uid() = employer_id AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'employer')
);
-- Employers can only update/delete their own jobs
CREATE POLICY "Employers can update their own jobs." ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Employers can delete their own jobs." ON public.jobs FOR DELETE USING (auth.uid() = employer_id);

-- APPLICATIONS POLICIES
-- Candidates can view their own applications
CREATE POLICY "Candidates can view their own applications." ON public.applications FOR SELECT USING (auth.uid() = candidate_id);
-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs." ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.employer_id = auth.uid())
);
-- Candidates can apply to jobs (insert applications)
CREATE POLICY "Candidates can insert applications." ON public.applications FOR INSERT WITH CHECK (
  auth.uid() = candidate_id AND 
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'candidate')
);


-- Enable RLS on storage.objects just in case it isn't
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (Candidates) to upload resumes
CREATE POLICY "Candidates can upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Allow anyone to read resumes (Employers viewing applications)
CREATE POLICY "Anyone can read resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');
