'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitApplication(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in as a candidate to apply.' }
  }

  const jobId = formData.get('job_id') as string
  const file = formData.get('resume') as File

  if (!jobId || !file || file.size === 0) {
    return { error: 'A valid resume PDF is required.' }
  }

  if (file.type !== 'application/pdf') {
    return { error: 'Only PDF resumes are accepted.' }
  }

  // 1. Upload to Supabase Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = `${jobId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return { error: 'Failed to upload resume. Please try again.' }
  }

  // 2. Get Public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('resumes').getPublicUrl(filePath)

  // 3. Insert into Applications table
  const { error: dbError } = await supabase.from('applications').insert({
    job_id: jobId,
    candidate_id: user.id,
    resume_url: publicUrl,
  })

  if (dbError) {
    console.error('Database insert error:', dbError)
    // If it's a unique constraint violation (code 23505), candidate already applied
    if (dbError.code === '23505') {
      return { error: 'You have already applied to this job.' }
    }
    return { error: 'Failed to submit application to the database.' }
  }

  revalidatePath(`/jobs/${jobId}`)
  revalidatePath('/candidate')
  
  return { success: true, message: 'Application submitted successfully!' }
}
