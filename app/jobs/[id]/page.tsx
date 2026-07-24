import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ApplicationForm from '@/components/ApplicationForm'

export default async function JobDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const supabase = await createClient()

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*, users(name)')
    .eq('id', params.id)
    .single()

  if (error || !job) {
    notFound()
  }

  // Check if current user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  let userRole = null
  let hasApplied = false
  
  if (user) {
    // Fetch user role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
      
    userRole = userData?.role

    // Check if applied
    const { data: appData } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', job.id)
      .eq('candidate_id', user.id)
      .maybeSingle()
      
    if (appData) {
      hasApplied = true
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-2xl leading-6 font-bold text-gray-900">{job.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {job.users ? job.users.name : 'Unknown Company'}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.location}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Job Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.job_type}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Salary</dt>
              <dd className="mt-1 text-sm text-gray-900">{job.salary || 'Not specified'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Date Posted</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(job.created_at).toLocaleDateString()}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Job Description</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{job.description}</dd>
            </div>
          </dl>

          {userRole === 'candidate' ? (
            hasApplied ? (
              <div className="mt-6 rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">You've already applied</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>You can track the status in your Candidate Dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ApplicationForm jobId={job.id} />
            )
          ) : userRole === 'employer' ? (
            <div className="mt-6 text-sm text-gray-500 italic">
              Employers cannot apply to jobs. Switch to a candidate account to apply.
            </div>
          ) : (
            <div className="mt-6 rounded-md bg-blue-50 p-4">
              <div className="text-sm text-blue-700">
                Please <a href="/login" className="font-bold hover:underline">log in</a> or <a href="/signup" className="font-bold hover:underline">sign up</a> as a Candidate to apply for this position.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
