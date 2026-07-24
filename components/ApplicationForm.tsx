'use client'

import { useActionState } from 'react'
import { submitApplication } from '@/app/actions/applications'

export default function ApplicationForm({ jobId }: { jobId: string }) {
  const [state, formAction, isPending] = useActionState(submitApplication, undefined)

  if (state?.success) {
    return (
      <div className="rounded-md bg-green-50 p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Application Submitted!</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>{state.message}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for this position</h3>

      {state?.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{state.error}</div>
        </div>
      )}

      <input type="hidden" name="job_id" value={jobId} />

      <div className="mb-4">
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
          Upload Resume (PDF only)
        </label>
        <div className="mt-2">
          <input
            type="file"
            name="resume"
            id="resume"
            accept="application/pdf"
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
      >
        {isPending ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}
