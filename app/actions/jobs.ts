'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createJob(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to post a job.' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const location = formData.get('location') as string
  const salary = formData.get('salary') as string
  const job_type = formData.get('job_type') as string

  if (!title || !description || !location || !job_type) {
    return { error: 'Title, description, location, and job type are required.' }
  }

  const { error } = await supabase.from('jobs').insert({
    employer_id: user.id,
    title,
    description,
    location,
    salary,
    job_type,
  })

  if (error) {
    console.error('Error creating job:', error)
    return { error: 'Failed to create job.' }
  }

  revalidatePath('/employer')
  revalidatePath('/jobs')
  revalidatePath('/')
  redirect('/employer')
}

export async function deleteJob(jobId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('jobs').delete().eq('id', jobId)

  if (error) {
    console.error('Error deleting job:', error)
    throw new Error('Failed to delete job')
  }

  revalidatePath('/employer')
  revalidatePath('/jobs')
}
