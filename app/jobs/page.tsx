import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function JobsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const location = typeof searchParams.location === 'string' ? searchParams.location : ''

  let query = supabase
    .from('jobs')
    .select('*, users(name)')
    .order('created_at', { ascending: false })

  if (q) {
    // Basic text search on title or description
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }
  
  if (location) {
    query = query.ilike('location', `%${location}%`)
  }

  const { data: jobs, error } = await query

  if (error) {
    console.error('Error fetching jobs:', error)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Browse Jobs
          </h2>
        </div>
      </div>

      {/* Search Bar */}
      <form className="mt-8 mb-10 flex flex-col sm:flex-row gap-4" action="/jobs" method="GET">
        <div className="flex-1">
          <label htmlFor="q" className="sr-only">Keywords</label>
          <input
            type="text"
            name="q"
            id="q"
            defaultValue={q}
            placeholder="Search by keywords..."
            className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="location" className="sr-only">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            defaultValue={location}
            placeholder="City, state, or 'Remote'"
            className="block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Search
        </button>
      </form>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  <Link href={`/jobs/${job.id}`} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {job.title}
                  </Link>
                </h3>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{job.users ? job.users.name : 'Unknown Company'}</span>
                  <span>&bull;</span>
                  <span>{job.location}</span>
                  <span>&bull;</span>
                  <span>{job.job_type}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}
