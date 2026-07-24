'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to a default route, or we can look up their role and redirect accordingly
  // For simplicity, redirect to home which will handle routing or they can use the navbar
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string // 'employer' or 'candidate'

  if (!email || !password || !name || !role) {
    return { error: 'All fields are required' }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    // Insert into our custom public.users table
    const { error: dbError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      name,
      role,
    })

    if (dbError) {
      console.error('Error inserting into public.users:', dbError)
      return { error: 'User created in auth, but failed to save profile.' }
    }
  }

  revalidatePath('/', 'layout')
  // We'll redirect to home after successful signup
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
