import { createClient } from '@supabase/supabase-js'

// ─── Replace these with your Supabase project values ─────────────────────────
// Get them from: supabase.com → your project → Settings → API
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || ''
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON || ''
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = (SUPABASE_URL && SUPABASE_ANON)
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : null

// Save a roster snapshot → returns the UUID or null on error
export async function saveSnapshot(snapshot) {
  // Fallback to localStorage if Supabase isn't configured
  if (!supabase) {
    const id = Math.random().toString(36).slice(2, 10)
    localStorage.setItem('roster_view_' + id, JSON.stringify(snapshot))
    return { id, remote: false }
  }

  const { data, error } = await supabase
    .from('roster_snapshots')
    .insert({ data: snapshot, week_label: snapshot.weekLabel })
    .select('id')
    .single()

  if (error) {
    console.error('Supabase save error:', error)
    // Fallback to localStorage
    const id = Math.random().toString(36).slice(2, 10)
    localStorage.setItem('roster_view_' + id, JSON.stringify(snapshot))
    return { id, remote: false }
  }

  return { id: data.id, remote: true }
}

// Load a roster snapshot by UUID
export async function loadSnapshot(id) {
  // Try localStorage first (short IDs = localStorage)
  const local = localStorage.getItem('roster_view_' + id)
  if (local) {
    try { return JSON.parse(local) } catch {}
  }

  // Try Supabase (UUID format)
  if (!supabase) return null

  const { data, error } = await supabase
    .from('roster_snapshots')
    .select('data')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data.data
}
