import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function ViewApplicantsPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Verify this employer owns this job
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .eq('employer_id', user.id)
    .single()

  if (jobError || !job) {
    notFound()
  }

  // 2. Fetch applicants
  const { data: applicants, error: appError } = await supabase
    .from('applications')
    .select('*, users!applications_candidate_id_fkey(name, email)')
    .eq('job_id', job.id)
    .order('applied_at', { ascending: false })

  if (appError) {
    console.error('Error fetching applicants:', appError)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/employer" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Applicants for: {job.title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">Review the candidates who have applied to this position.</p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Candidate Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date Applied
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicants && applicants.length > 0 ? (
                    applicants.map((app) => (
                      <tr key={app.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {app.users ? app.users.name : 'Unknown Candidate'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {app.users ? app.users.email : 'No email'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a 
                            href={app.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Resume
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-sm text-gray-500">
                        No one has applied to this job yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
