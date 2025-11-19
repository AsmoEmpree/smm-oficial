import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Types para o banco de dados
export type User = {
  id: string
  email: string
  name: string
  avatar_url?: string
  subscription_plan: 'free' | 'pro' | 'creator' | 'enterprise'
  ai_credits: number
  mental_style?: string
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  user_id: string
  name: string
  description?: string
  progress: number
  status: 'active' | 'paused' | 'completed'
  created_at: string
  updated_at: string
}

export type Node = {
  id: string
  project_id: string
  title: string
  description?: string
  tags: string[]
  status: 'pending' | 'in_progress' | 'completed'
  responsible?: string
  position_x: number
  position_y: number
  attachments?: string[]
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  node_id: string
  user_id: string
  content: string
  created_at: string
}

export type Financial = {
  id: string
  project_id: string
  type: 'investment' | 'expense' | 'revenue'
  amount: number
  description?: string
  date: string
  created_at: string
}

export type Template = {
  id: string
  creator_id: string
  name: string
  description?: string
  category: string
  price: number
  preview_image?: string
  content: any
  created_at: string
}

export type Transaction = {
  id: string
  user_id: string
  type: 'subscription' | 'template' | 'ai_credits'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}
