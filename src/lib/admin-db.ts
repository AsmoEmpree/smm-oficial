'use client'

import { supabase } from './supabase'

// Types para o painel admin
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  max_projects: number
  ai_credits: number
  storage_gb: number
  support_level: 'email' | 'priority' | '24/7'
  active: boolean
  color: string
  icon: string
  popular: boolean
  created_at?: string
  updated_at?: string
}

export interface UserExtended {
  id: string
  name: string
  email: string
  plan_id: string
  plan_name?: string
  status: 'active' | 'blocked' | 'pending'
  projects_count: number
  ai_credits_used: number
  created_at: string
  last_login: string
}

export interface Promotion {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  valid_until: string
  max_uses: number
  current_uses: number
  active: boolean
  created_at?: string
  updated_at?: string
}

export interface VisualCustomization {
  id: string
  primary_color: string
  secondary_color: string
  accent_color: string
  logo_url: string
  company_name: string
  tagline: string
  created_at?: string
  updated_at?: string
}

export interface ContentItem {
  id: string
  type: 'video' | 'link' | 'document'
  title: string
  url: string
  description: string
  created_at: string
  updated_at?: string
}

export interface AppSettings {
  id: string
  ai_model: string
  ai_temperature: number
  max_tokens: number
  enable_google_auth: boolean
  enable_apple_auth: boolean
  maintenance_mode: boolean
  allow_new_signups: boolean
  created_at?: string
  updated_at?: string
}

// ============================================
// SUBSCRIPTION PLANS
// ============================================

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price_monthly', { ascending: true })

  if (error) {
    console.error('Erro ao buscar planos:', error)
    return []
  }

  return data || []
}

export async function createSubscriptionPlan(plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>): Promise<SubscriptionPlan | null> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .insert([plan])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar plano:', error)
    return null
  }

  return data
}

export async function updateSubscriptionPlan(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar plano:', error)
    return null
  }

  return data
}

export async function deleteSubscriptionPlan(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('subscription_plans')
    .update({ active: false })
    .eq('id', id)

  if (error) {
    console.error('Erro ao desativar plano:', error)
    return false
  }

  return true
}

// ============================================
// USERS EXTENDED
// ============================================

export async function getUsersExtended(): Promise<UserExtended[]> {
  const { data, error } = await supabase
    .from('users_extended')
    .select(`
      *,
      subscription_plans(name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar usuários:', error)
    return []
  }

  return data?.map(user => ({
    ...user,
    plan_name: user.subscription_plans?.name || 'Sem plano',
    email: user.email || 'N/A'
  })) || []
}

export async function updateUserStatus(id: string, status: 'active' | 'blocked'): Promise<boolean> {
  const { error } = await supabase
    .from('users_extended')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar status do usuário:', error)
    return false
  }

  return true
}

// ============================================
// PROMOTIONS
// ============================================

export async function getPromotions(): Promise<Promotion[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar promoções:', error)
    return []
  }

  return data || []
}

export async function createPromotion(promo: Omit<Promotion, 'id' | 'current_uses' | 'created_at' | 'updated_at'>): Promise<Promotion | null> {
  const { data, error } = await supabase
    .from('promotions')
    .insert([{ ...promo, current_uses: 0 }])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar promoção:', error)
    return null
  }

  return data
}

export async function updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion | null> {
  const { data, error } = await supabase
    .from('promotions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar promoção:', error)
    return null
  }

  return data
}

export async function deletePromotion(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('promotions')
    .update({ active: false })
    .eq('id', id)

  if (error) {
    console.error('Erro ao desativar promoção:', error)
    return false
  }

  return true
}

// ============================================
// VISUAL CUSTOMIZATION
// ============================================

export async function getVisualCustomization(): Promise<VisualCustomization | null> {
  const { data, error } = await supabase
    .from('visual_customization')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Erro ao buscar personalização visual:', error)
    return null
  }

  return data
}

export async function updateVisualCustomization(updates: Partial<VisualCustomization>): Promise<VisualCustomization | null> {
  // Primeiro, buscar o ID existente
  const { data: existing } = await supabase
    .from('visual_customization')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    // Atualizar existente
    const { data, error } = await supabase
      .from('visual_customization')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar personalização visual:', error)
      return null
    }

    return data
  } else {
    // Criar novo
    const { data, error } = await supabase
      .from('visual_customization')
      .insert([updates])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar personalização visual:', error)
      return null
    }

    return data
  }
}

// ============================================
// CONTENT ITEMS
// ============================================

export async function getContentItems(): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar conteúdos:', error)
    return []
  }

  return data || []
}

export async function createContentItem(item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContentItem | null> {
  const { data, error } = await supabase
    .from('content_items')
    .insert([item])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar conteúdo:', error)
    return null
  }

  return data
}

export async function deleteContentItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('content_items')
    .update({ active: false })
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar conteúdo:', error)
    return false
  }

  return true
}

// ============================================
// APP SETTINGS
// ============================================

export async function getAppSettings(): Promise<AppSettings | null> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Erro ao buscar configurações:', error)
    return null
  }

  return data
}

export async function updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings | null> {
  // Primeiro, buscar o ID existente
  const { data: existing } = await supabase
    .from('app_settings')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    // Atualizar existente
    const { data, error } = await supabase
      .from('app_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar configurações:', error)
      return null
    }

    return data
  } else {
    // Criar novo
    const { data, error } = await supabase
      .from('app_settings')
      .insert([updates])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar configurações:', error)
      return null
    }

    return data
  }
}
