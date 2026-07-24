'use client'

import { useActionState } from 'react'
import { createJob } from '@/app/actions/jobs'
import Link from 'next/link'

export default function PostJobPage() {
  const [state, formAction, isPending] = useActionState(createJob, undefined)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Post a New Job
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            href="/employer"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </div>

      <form action={formAction} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            {state?.error && (
              <div className="sm:col-span-6 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{state.error}</div>
              </div>
            )}

            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Job Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="e.g. Senior React Developer"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                Location
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  placeholder="e.g. Remote, New York, NY"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="job_type" className="block text-sm font-medium leading-6 text-gray-900">
                Job Type
              </label>
              <div className="mt-2">
                <select
                  id="job_type"
                  name="job_type"
                  required
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="salary" className="block text-sm font-medium leading-6 text-gray-900">
                Salary Range <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  placeholder="e.g. $100,000 - $120,000"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Job Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={8}
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Write a detailed description about the role..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 transition-colors"
          >
            {isPending ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
