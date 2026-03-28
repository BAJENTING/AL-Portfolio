'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitContactForm(formData: FormData) {
  const supabase = await createClient();
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const lookingTo = formData.get('lookingTo') as string;
  const budget = formData.get('budget') as string;
  const message = formData.get('message') as string;

  const { data, error } = await supabase
    .from('contacts')
    .insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        looking_to: lookingTo,
        budget_range: budget,
        message,
      },
    ]);

  if (error) {
    console.error('Error submitting form:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
/*
SQL for Supabase Table:
create table contacts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text,
  last_name text,
  email text,
  phone text,
  looking_to text,
  budget_range text,
  message text
);
*/
