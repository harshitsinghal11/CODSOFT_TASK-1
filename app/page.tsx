import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // Fetch the 5 most recent jobs
  const { data: latestJobs } = await supabase
    .from('jobs')
    .select('*, users(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get user role
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role = null
  let name = null
  if (user) {
    const { data } = await supabase.from('users').select('role, name').eq('id', user.id).single()
    role = data?.role
    name = data?.name
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-20 sm:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {user ? `Welcome back, ${name || 'User'}!` : 'Find your next dream job'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {user
                ? role === 'employer'
                  ? 'Manage your job postings, review applications, and find the perfect candidate.'
                  : 'Track your applications, browse new opportunities, and land your dream job.'
                : 'Discover thousands of opportunities from top companies around the world. Whether you\'re looking for remote work or a local office, we have something for you.'}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <>
                  <Link
                    href={role === 'employer' ? '/employer' : '/candidate'}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Go to Dashboard
                  </Link>
                  <Link href="/jobs" className="text-sm font-semibold leading-6 text-gray-900">
                    Browse all jobs <span aria-hidden="true">→</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/jobs"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Browse all jobs
                  </Link>
                  <Link href="/employer/post" className="text-sm font-semibold leading-6 text-gray-900">
                    Post a job <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest Opportunities</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Check out the most recent roles posted on our platform.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
          {latestJobs && latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <article key={job.id} className="flex flex-col items-start justify-between bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={job.created_at} className="text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-200 px-3 py-1.5 font-medium text-gray-600">
                    {job.job_type}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={`/jobs/${job.id}`}>
                      <span className="absolute inset-0" />
                      {job.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{job.description}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      {/* supabase joins return nested objects for foreign keys if requested */}
                      {job.users ? job.users.name : 'Unknown Company'}
                    </p>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">No jobs posted yet. Check back soon!</p>
          )}
        </div>
      </div>
    </div>
  )
}
