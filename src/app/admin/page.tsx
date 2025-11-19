'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Brain, 
  Plus, 
  Search, 
  Users, 
  CreditCard,
  Settings,
  Tag,
  TrendingUp,
  Edit,
  Trash2,
  Check,
  X,
  Shield,
  Zap,
  Target,
  DollarSign,
  Percent,
  Calendar,
  Lock,
  Unlock,
  Mail,
  User,
  Crown,
  Sparkles,
  Gift,
  BarChart3,
  FileText,
  AlertCircle,
  Palette,
  Image,
  Video,
  Link as LinkIcon,
  Upload,
  Save
} from 'lucide-react'

// Types
interface SubscriptionPlan {
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
}

interface UserAccount {
  id: string
  name: string
  email: string
  plan: string
  status: 'active' | 'blocked' | 'pending'
  created_at: string
  last_login: string
  projects_count: number
  ai_credits_used: number
}

interface Promotion {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  valid_until: string
  max_uses: number
  current_uses: number
  active: boolean
}

interface AppSettings {
  ai_model: string
  ai_temperature: number
  max_tokens: number
  enable_google_auth: boolean
  enable_apple_auth: boolean
  maintenance_mode: boolean
  allow_new_signups: boolean
}

interface VisualCustomization {
  primary_color: string
  secondary_color: string
  accent_color: string
  logo_url: string
  company_name: string
  tagline: string
}

interface ContentItem {
  id: string
  type: 'video' | 'link' | 'document'
  title: string
  url: string
  description: string
  created_at: string
}

// Toast notification
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300 ${
    type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
  }`
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 300)
    }
  }, 3000)
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Plans State
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Básico',
      description: 'Perfeito para começar a organizar seus projetos',
      price_monthly: 29,
      price_yearly: 290,
      features: [
        'Até 5 projetos ativos',
        '10 créditos de IA por mês',
        'Assistente de IA básico',
        'Métricas individuais',
        'Suporte por email',
        'Armazenamento de 1GB'
      ],
      max_projects: 5,
      ai_credits: 10,
      storage_gb: 1,
      support_level: 'email',
      active: true,
      color: 'from-blue-500 to-cyan-500',
      icon: 'zap',
      popular: false
    },
    {
      id: '2',
      name: 'Profissional',
      description: 'Para profissionais que precisam de mais poder',
      price_monthly: 79,
      price_yearly: 790,
      features: [
        'Projetos ilimitados',
        '100 créditos de IA por mês',
        'Assistente de IA avançado',
        'Métricas de equipe completas',
        'Comunicação otimizada',
        'Planejamento com IA',
        'Suporte prioritário',
        'Armazenamento de 10GB',
        'Integrações avançadas'
      ],
      max_projects: -1,
      ai_credits: 100,
      storage_gb: 10,
      support_level: 'priority',
      active: true,
      color: 'from-purple-500 to-pink-500',
      icon: 'trending-up',
      popular: true
    },
    {
      id: '3',
      name: 'Empresarial',
      description: 'Solução completa para equipes e empresas',
      price_monthly: 199,
      price_yearly: 1990,
      features: [
        'Tudo do Profissional',
        'Créditos de IA ilimitados',
        'IA personalizada para sua empresa',
        'Múltiplas equipes',
        'Painel admin completo',
        'White label disponível',
        'Suporte 24/7 dedicado',
        'Armazenamento ilimitado',
        'API personalizada',
        'Treinamento da equipe'
      ],
      max_projects: -1,
      ai_credits: -1,
      storage_gb: -1,
      support_level: '24/7',
      active: true,
      color: 'from-orange-500 to-red-500',
      icon: 'shield',
      popular: false
    }
  ])
  
  // Users State
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      plan: 'Profissional',
      status: 'active',
      created_at: '2024-01-15',
      last_login: '2024-03-20',
      projects_count: 12,
      ai_credits_used: 45
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      plan: 'Básico',
      status: 'active',
      created_at: '2024-02-10',
      last_login: '2024-03-19',
      projects_count: 3,
      ai_credits_used: 8
    }
  ])
  
  // Promotions State
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      code: 'WELCOME50',
      type: 'percentage',
      value: 50,
      valid_until: '2024-12-31',
      max_uses: 100,
      current_uses: 23,
      active: true
    }
  ])
  
  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    ai_model: 'gpt-4o',
    ai_temperature: 0.7,
    max_tokens: 2000,
    enable_google_auth: true,
    enable_apple_auth: false,
    maintenance_mode: false,
    allow_new_signups: true
  })

  // Visual Customization State
  const [visualCustomization, setVisualCustomization] = useState<VisualCustomization>({
    primary_color: '#8B5CF6',
    secondary_color: '#EC4899',
    accent_color: '#F59E0B',
    logo_url: '',
    company_name: 'SyncMyMind',
    tagline: 'Organize seus projetos com inteligência'
  })

  // Content Items State
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'video',
      title: 'Tutorial: Como usar o assistente de IA',
      url: 'https://youtube.com/watch?v=example',
      description: 'Aprenda a usar todas as funcionalidades do assistente',
      created_at: '2024-03-15'
    }
  ])
  
  // Dialog States
  const [showPlanDialog, setShowPlanDialog] = useState(false)
  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [showContentDialog, setShowContentDialog] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  
  // Form States
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    features: '',
    max_projects: 0,
    ai_credits: 0,
    storage_gb: 0,
    support_level: 'email' as const,
    color: 'from-blue-500 to-cyan-500',
    icon: 'zap',
    popular: false
  })
  
  const [promoForm, setPromoForm] = useState({
    code: '',
    type: 'percentage' as const,
    value: 0,
    valid_until: '',
    max_uses: 0
  })

  const [contentForm, setContentForm] = useState({
    type: 'video' as const,
    title: '',
    url: '',
    description: ''
  })

  // Handlers
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newPlan: SubscriptionPlan = {
      id: Date.now().toString(),
      name: planForm.name,
      description: planForm.description,
      price_monthly: planForm.price_monthly,
      price_yearly: planForm.price_yearly,
      features: planForm.features.split('\n').filter(f => f.trim()),
      max_projects: planForm.max_projects,
      ai_credits: planForm.ai_credits,
      storage_gb: planForm.storage_gb,
      support_level: planForm.support_level,
      active: true,
      color: planForm.color,
      icon: planForm.icon,
      popular: planForm.popular
    }
    
    setPlans([...plans, newPlan])
    setShowPlanDialog(false)
    resetPlanForm()
    showToast('✅ Plano criado com sucesso!')
  }
  
  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlan) return
    
    const updatedPlan: SubscriptionPlan = {
      ...editingPlan,
      name: planForm.name,
      description: planForm.description,
      price_monthly: planForm.price_monthly,
      price_yearly: planForm.price_yearly,
      features: planForm.features.split('\n').filter(f => f.trim()),
      max_projects: planForm.max_projects,
      ai_credits: planForm.ai_credits,
      storage_gb: planForm.storage_gb,
      support_level: planForm.support_level,
      color: planForm.color,
      icon: planForm.icon,
      popular: planForm.popular
    }
    
    setPlans(plans.map(p => p.id === editingPlan.id ? updatedPlan : p))
    setEditingPlan(null)
    setShowPlanDialog(false)
    resetPlanForm()
    showToast('✅ Plano atualizado com sucesso!')
  }
  
  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setPlanForm({
      name: plan.name,
      description: plan.description,
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly,
      features: plan.features.join('\n'),
      max_projects: plan.max_projects,
      ai_credits: plan.ai_credits,
      storage_gb: plan.storage_gb,
      support_level: plan.support_level,
      color: plan.color,
      icon: plan.icon,
      popular: plan.popular
    })
    setShowPlanDialog(true)
  }
  
  const handleDeletePlan = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      setPlans(plans.filter(p => p.id !== id))
      showToast('🗑️ Plano excluído com sucesso!')
    }
  }
  
  const togglePlanActive = (id: string) => {
    setPlans(plans.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ))
    showToast('✅ Status do plano atualizado!')
  }
  
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newPromo: Promotion = {
      id: Date.now().toString(),
      code: promoForm.code.toUpperCase(),
      type: promoForm.type,
      value: promoForm.value,
      valid_until: promoForm.valid_until,
      max_uses: promoForm.max_uses,
      current_uses: 0,
      active: true
    }
    
    setPromotions([...promotions, newPromo])
    setShowPromoDialog(false)
    resetPromoForm()
    showToast('🎁 Promoção criada com sucesso!')
  }
  
  const handleUpdatePromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPromo) return
    
    const updatedPromo: Promotion = {
      ...editingPromo,
      code: promoForm.code.toUpperCase(),
      type: promoForm.type,
      value: promoForm.value,
      valid_until: promoForm.valid_until,
      max_uses: promoForm.max_uses
    }
    
    setPromotions(promotions.map(p => p.id === editingPromo.id ? updatedPromo : p))
    setEditingPromo(null)
    setShowPromoDialog(false)
    resetPromoForm()
    showToast('✅ Promoção atualizada com sucesso!')
  }
  
  const handleEditPromo = (promo: Promotion) => {
    setEditingPromo(promo)
    setPromoForm({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      valid_until: promo.valid_until,
      max_uses: promo.max_uses
    })
    setShowPromoDialog(true)
  }
  
  const handleDeletePromo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta promoção?')) {
      setPromotions(promotions.filter(p => p.id !== id))
      showToast('🗑️ Promoção excluída com sucesso!')
    }
  }
  
  const togglePromoActive = (id: string) => {
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ))
    showToast('✅ Status da promoção atualizado!')
  }
  
  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ))
    showToast('✅ Status do usuário atualizado!')
  }
  
  const updateSettings = () => {
    showToast('✅ Configurações salvas com sucesso!')
  }

  const saveVisualCustomization = () => {
    showToast('✅ Personalização visual salva com sucesso!')
  }

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newContent: ContentItem = {
      id: Date.now().toString(),
      type: contentForm.type,
      title: contentForm.title,
      url: contentForm.url,
      description: contentForm.description,
      created_at: new Date().toISOString()
    }
    
    setContentItems([...contentItems, newContent])
    setShowContentDialog(false)
    resetContentForm()
    showToast('✅ Conteúdo adicionado com sucesso!')
  }

  const handleDeleteContent = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
      setContentItems(contentItems.filter(c => c.id !== id))
      showToast('🗑️ Conteúdo excluído com sucesso!')
    }
  }
  
  const resetPlanForm = () => {
    setPlanForm({
      name: '',
      description: '',
      price_monthly: 0,
      price_yearly: 0,
      features: '',
      max_projects: 0,
      ai_credits: 0,
      storage_gb: 0,
      support_level: 'email',
      color: 'from-blue-500 to-cyan-500',
      icon: 'zap',
      popular: false
    })
  }
  
  const resetPromoForm = () => {
    setPromoForm({
      code: '',
      type: 'percentage',
      value: 0,
      valid_until: '',
      max_uses: 0
    })
  }

  const resetContentForm = () => {
    setContentForm({
      type: 'video',
      title: '',
      url: '',
      description: ''
    })
  }

  // Stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const totalRevenue = users.reduce((acc, user) => {
    const plan = plans.find(p => p.name === user.plan)
    return acc + (plan?.price_monthly || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 border-b border-purple-800 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Painel Admin
                </h1>
                <p className="text-xs text-purple-300">SyncMyMind - Gerenciamento</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Administrador
              </Badge>
              
              <Avatar className="cursor-pointer ring-2 ring-purple-400">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Planos
            </TabsTrigger>
            <TabsTrigger value="promotions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Gift className="h-4 w-4 mr-2" />
              Promoções
            </TabsTrigger>
            <TabsTrigger value="visual" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Palette className="h-4 w-4 mr-2" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Config
            </TabsTrigger>
          </TabsList>

          {/* DASHBOARD */}
          <TabsContent value="dashboard" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h2>
              <p className="text-gray-600 mt-1">Visão geral do sistema</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-blue-100 mt-1">
                    {activeUsers} ativos
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                  <DollarSign className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-green-100 mt-1">
                    +12% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
                  <CreditCard className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{plans.filter(p => p.active).length}</div>
                  <p className="text-xs text-purple-100 mt-1">
                    De {plans.length} planos totais
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Promoções Ativas</CardTitle>
                  <Gift className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{promotions.filter(p => p.active).length}</div>
                  <p className="text-xs text-orange-100 mt-1">
                    {promotions.reduce((acc, p) => acc + p.current_uses, 0)} usos totais
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Planos Mais Populares
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plans.map(plan => {
                    const userCount = users.filter(u => u.plan === plan.name).length
                    return (
                      <div key={plan.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${plan.color} rounded-lg flex items-center justify-center`}>
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{plan.name}</p>
                            <p className="text-sm text-gray-500">{userCount} usuários</p>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                          R$ {plan.price_monthly}/mês
                        </Badge>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                    Atividades Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Novo usuário cadastrado</p>
                      <p className="text-xs text-gray-500">maria@example.com - há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upgrade de plano</p>
                      <p className="text-xs text-gray-500">João Silva: Básico → Profissional</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Promoção utilizada</p>
                      <p className="text-xs text-gray-500">Código WELCOME50 - há 5 horas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h2>
                <p className="text-gray-600 mt-1">Visualize e gerencie contas de usuários</p>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuário</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plano</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Projetos</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Créditos IA</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Último Login</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-purple-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                              {user.plan}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }>
                              {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-gray-900">{user.projects_count}</td>
                          <td className="px-6 py-4 text-gray-900">{user.ai_credits_used}</td>
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            {new Date(user.last_login).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleUserStatus(user.id)}
                              className="mr-2"
                            >
                              {user.status === 'active' ? (
                                <>
                                  <Lock className="h-3 w-3 mr-1" />
                                  Bloquear
                                </>
                              ) : (
                                <>
                                  <Unlock className="h-3 w-3 mr-1" />
                                  Desbloquear
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PLANS */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Gerenciar Planos</h2>
                <p className="text-gray-600 mt-1">Configure e personalize os planos de assinatura</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingPlan(null)
                  resetPlanForm()
                  setShowPlanDialog(true)
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map(plan => (
                <Card key={plan.id} className={`shadow-xl border-0 bg-white/80 backdrop-blur-sm relative ${
                  plan.popular ? 'ring-2 ring-purple-500' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      {plan.icon === 'zap' && <Zap className="h-8 w-8 text-white" />}
                      {plan.icon === 'trending-up' && <TrendingUp className="h-8 w-8 text-white" />}
                      {plan.icon === 'shield' && <Shield className="h-8 w-8 text-white" />}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>
                    <div className="flex items-baseline justify-center mt-4">
                      <span className="text-4xl font-bold text-gray-900">R$ {plan.price_monthly}</span>
                      <span className="text-gray-600 ml-2">/mês</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ou R$ {plan.price_yearly}/ano
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Projetos:</span>
                        <span className="font-medium text-gray-900">
                          {plan.max_projects === -1 ? 'Ilimitado' : plan.max_projects}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Créditos IA:</span>
                        <span className="font-medium text-gray-900">
                          {plan.ai_credits === -1 ? 'Ilimitado' : plan.ai_credits}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Armazenamento:</span>
                        <span className="font-medium text-gray-900">
                          {plan.storage_gb === -1 ? 'Ilimitado' : `${plan.storage_gb}GB`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Suporte:</span>
                        <span className="font-medium text-gray-900 capitalize">{plan.support_level}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={plan.active}
                          onCheckedChange={() => togglePlanActive(plan.id)}
                        />
                        <span className="text-sm text-gray-600">
                          {plan.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPlan(plan)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePlan(plan.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PROMOTIONS */}
          <TabsContent value="promotions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Gerenciar Promoções</h2>
                <p className="text-gray-600 mt-1">Crie cupons e ofertas especiais</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingPromo(null)
                  resetPromoForm()
                  setShowPromoDialog(true)
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Promoção
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map(promo => (
                <Card key={promo.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Gift className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{promo.code}</CardTitle>
                          <CardDescription className="text-sm">
                            {promo.type === 'percentage' ? `${promo.value}% OFF` : `R$ ${promo.value} OFF`}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={
                        promo.active 
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }>
                        {promo.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Válido até:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(promo.valid_until).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Usos:</span>
                        <span className="font-medium text-gray-900">
                          {promo.current_uses} / {promo.max_uses}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={promo.active}
                          onCheckedChange={() => togglePromoActive(promo.id)}
                        />
                        <span className="text-sm text-gray-600">
                          {promo.active ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditPromo(promo)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePromo(promo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* VISUAL CUSTOMIZATION */}
          <TabsContent value="visual" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Personalização Visual</h2>
              <p className="text-gray-600 mt-1">Customize a aparência do aplicativo</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-purple-600" />
                    Cores do Tema
                  </CardTitle>
                  <CardDescription>Defina a paleta de cores do aplicativo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Cor Primária</Label>
                    <div className="flex space-x-3">
                      <Input
                        id="primary-color"
                        type="color"
                        value={visualCustomization.primary_color}
                        onChange={(e) => setVisualCustomization({...visualCustomization, primary_color: e.target.value})}
                        className="w-20 h-12"
                      />
                      <Input
                        type="text"
                        value={visualCustomization.primary_color}
                        onChange={(e) => setVisualCustomization({...visualCustomization, primary_color: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Cor Secundária</Label>
                    <div className="flex space-x-3">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={visualCustomization.secondary_color}
                        onChange={(e) => setVisualCustomization({...visualCustomization, secondary_color: e.target.value})}
                        className="w-20 h-12"
                      />
                      <Input
                        type="text"
                        value={visualCustomization.secondary_color}
                        onChange={(e) => setVisualCustomization({...visualCustomization, secondary_color: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Cor de Destaque</Label>
                    <div className="flex space-x-3">
                      <Input
                        id="accent-color"
                        type="color"
                        value={visualCustomization.accent_color}
                        onChange={(e) => setVisualCustomization({...visualCustomization, accent_color: e.target.value})}
                        className="w-20 h-12"
                      />
                      <Input
                        type="text"
                        value={visualCustomization.accent_color}
                        onChange={(e) => setVisualCustomization({...visualCustomization, accent_color: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="h-5 w-5 mr-2 text-blue-600" />
                    Identidade da Marca
                  </CardTitle>
                  <CardDescription>Configure logo e informações da empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input
                      id="company-name"
                      value={visualCustomization.company_name}
                      onChange={(e) => setVisualCustomization({...visualCustomization, company_name: e.target.value})}
                      placeholder="SyncMyMind"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Slogan</Label>
                    <Input
                      id="tagline"
                      value={visualCustomization.tagline}
                      onChange={(e) => setVisualCustomization({...visualCustomization, tagline: e.target.value})}
                      placeholder="Organize seus projetos com inteligência"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo-url">URL do Logo</Label>
                    <Input
                      id="logo-url"
                      value={visualCustomization.logo_url}
                      onChange={(e) => setVisualCustomization({...visualCustomization, logo_url: e.target.value})}
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Clique para fazer upload do logo</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG ou SVG (max. 2MB)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={saveVisualCustomization}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Personalização
              </Button>
            </div>
          </TabsContent>

          {/* CONTENT MANAGEMENT */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Gerenciar Conteúdo</h2>
                <p className="text-gray-600 mt-1">Adicione vídeos, links e documentos</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingContent(null)
                  resetContentForm()
                  setShowContentDialog(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Conteúdo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentItems.map(item => (
                <Card key={item.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          item.type === 'video' ? 'bg-gradient-to-br from-red-500 to-pink-600' :
                          item.type === 'link' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                          'bg-gradient-to-br from-green-500 to-emerald-600'
                        }`}>
                          {item.type === 'video' && <Video className="h-6 w-6 text-white" />}
                          {item.type === 'link' && <LinkIcon className="h-6 w-6 text-white" />}
                          {item.type === 'document' && <FileText className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="text-xs capitalize">{item.type}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Criado em {new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(item.url, '_blank')}
                      >
                        Abrir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteContent(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {contentItems.length === 0 && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum conteúdo adicionado</h3>
                  <p className="text-gray-600 mb-4">Comece adicionando vídeos, links ou documentos</p>
                  <Button 
                    onClick={() => setShowContentDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Conteúdo
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h2>
              <p className="text-gray-600 mt-1">Ajuste parâmetros globais do aplicativo</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    Configurações de IA
                  </CardTitle>
                  <CardDescription>Ajuste o comportamento do assistente de IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Modelo de IA</Label>
                    <Select value={settings.ai_model} onValueChange={(value) => setSettings({...settings, ai_model: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o (Recomendado)</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Temperatura (Criatividade)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.ai_temperature}
                      onChange={(e) => setSettings({...settings, ai_temperature: parseFloat(e.target.value)})}
                    />
                    <p className="text-xs text-gray-500">0 = Mais preciso, 1 = Mais criativo</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Máximo de Tokens</Label>
                    <Input
                      type="number"
                      value={settings.max_tokens}
                      onChange={(e) => setSettings({...settings, max_tokens: parseInt(e.target.value)})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-600" />
                    Configurações Gerais
                  </CardTitle>
                  <CardDescription>Controle funcionalidades do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login com Google</Label>
                      <p className="text-xs text-gray-500">Permitir autenticação via Google</p>
                    </div>
                    <Switch
                      checked={settings.enable_google_auth}
                      onCheckedChange={(checked) => setSettings({...settings, enable_google_auth: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login com Apple</Label>
                      <p className="text-xs text-gray-500">Permitir autenticação via Apple</p>
                    </div>
                    <Switch
                      checked={settings.enable_apple_auth}
                      onCheckedChange={(checked) => setSettings({...settings, enable_apple_auth: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Novos Cadastros</Label>
                      <p className="text-xs text-gray-500">Permitir registro de novos usuários</p>
                    </div>
                    <Switch
                      checked={settings.allow_new_signups}
                      onCheckedChange={(checked) => setSettings({...settings, allow_new_signups: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo Manutenção</Label>
                      <p className="text-xs text-gray-500">Desabilitar acesso ao sistema</p>
                    </div>
                    <Switch
                      checked={settings.maintenance_mode}
                      onCheckedChange={(checked) => setSettings({...settings, maintenance_mode: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={updateSettings}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* PLAN DIALOG */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}</DialogTitle>
            <DialogDescription>
              Configure os detalhes do plano de assinatura
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Nome do Plano</Label>
                <Input
                  id="plan-name"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                  placeholder="Ex: Profissional"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-color">Cor do Gradiente</Label>
                <Select value={planForm.color} onValueChange={(value) => setPlanForm({...planForm, color: value})}>
                  <SelectTrigger id="plan-color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="from-blue-500 to-cyan-500">Azul</SelectItem>
                    <SelectItem value="from-purple-500 to-pink-500">Roxo</SelectItem>
                    <SelectItem value="from-orange-500 to-red-500">Laranja</SelectItem>
                    <SelectItem value="from-green-500 to-emerald-500">Verde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-description">Descrição</Label>
              <Textarea
                id="plan-description"
                value={planForm.description}
                onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                placeholder="Breve descrição do plano"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-price-monthly">Preço Mensal (R$)</Label>
                <Input
                  id="plan-price-monthly"
                  type="number"
                  value={planForm.price_monthly}
                  onChange={(e) => setPlanForm({...planForm, price_monthly: parseFloat(e.target.value)})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-price-yearly">Preço Anual (R$)</Label>
                <Input
                  id="plan-price-yearly"
                  type="number"
                  value={planForm.price_yearly}
                  onChange={(e) => setPlanForm({...planForm, price_yearly: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan-projects">Máx. Projetos</Label>
                <Input
                  id="plan-projects"
                  type="number"
                  value={planForm.max_projects}
                  onChange={(e) => setPlanForm({...planForm, max_projects: parseInt(e.target.value)})}
                  placeholder="-1 = ilimitado"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-credits">Créditos IA</Label>
                <Input
                  id="plan-credits"
                  type="number"
                  value={planForm.ai_credits}
                  onChange={(e) => setPlanForm({...planForm, ai_credits: parseInt(e.target.value)})}
                  placeholder="-1 = ilimitado"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-storage">Storage (GB)</Label>
                <Input
                  id="plan-storage"
                  type="number"
                  value={planForm.storage_gb}
                  onChange={(e) => setPlanForm({...planForm, storage_gb: parseInt(e.target.value)})}
                  placeholder="-1 = ilimitado"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-support">Nível de Suporte</Label>
              <Select value={planForm.support_level} onValueChange={(value: 'email' | 'priority' | '24/7') => setPlanForm({...planForm, support_level: value})}>
                <SelectTrigger id="plan-support">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="priority">Prioritário</SelectItem>
                  <SelectItem value="24/7">24/7</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-features">Recursos (um por linha)</Label>
              <Textarea
                id="plan-features"
                value={planForm.features}
                onChange={(e) => setPlanForm({...planForm, features: e.target.value})}
                placeholder="Até 5 projetos ativos&#10;10 créditos de IA por mês&#10;Assistente de IA básico"
                rows={6}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="plan-popular"
                checked={planForm.popular}
                onCheckedChange={(checked) => setPlanForm({...planForm, popular: checked})}
              />
              <Label htmlFor="plan-popular">Marcar como "Mais Popular"</Label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowPlanDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
                {editingPlan ? 'Atualizar' : 'Criar'} Plano
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* PROMO DIALOG */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPromo ? 'Editar Promoção' : 'Criar Nova Promoção'}</DialogTitle>
            <DialogDescription>
              Configure cupom de desconto ou oferta especial
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={editingPromo ? handleUpdatePromo : handleCreatePromo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promo-code">Código do Cupom</Label>
              <Input
                id="promo-code"
                value={promoForm.code}
                onChange={(e) => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})}
                placeholder="Ex: WELCOME50"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="promo-type">Tipo de Desconto</Label>
                <Select value={promoForm.type} onValueChange={(value: 'percentage' | 'fixed') => setPromoForm({...promoForm, type: value})}>
                  <SelectTrigger id="promo-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="promo-value">Valor</Label>
                <Input
                  id="promo-value"
                  type="number"
                  value={promoForm.value}
                  onChange={(e) => setPromoForm({...promoForm, value: parseFloat(e.target.value)})}
                  placeholder={promoForm.type === 'percentage' ? '50' : '100'}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="promo-valid">Válido Até</Label>
                <Input
                  id="promo-valid"
                  type="date"
                  value={promoForm.valid_until}
                  onChange={(e) => setPromoForm({...promoForm, valid_until: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="promo-uses">Máximo de Usos</Label>
                <Input
                  id="promo-uses"
                  type="number"
                  value={promoForm.max_uses}
                  onChange={(e) => setPromoForm({...promoForm, max_uses: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowPromoDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-orange-600 to-red-600">
                {editingPromo ? 'Atualizar' : 'Criar'} Promoção
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONTENT DIALOG */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Conteúdo</DialogTitle>
            <DialogDescription>
              Adicione vídeos, links ou documentos ao aplicativo
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateContent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Tipo de Conteúdo</Label>
              <Select value={contentForm.type} onValueChange={(value: 'video' | 'link' | 'document') => setContentForm({...contentForm, type: value})}>
                <SelectTrigger id="content-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-title">Título</Label>
              <Input
                id="content-title"
                value={contentForm.title}
                onChange={(e) => setContentForm({...contentForm, title: e.target.value})}
                placeholder="Ex: Tutorial de uso"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-url">URL</Label>
              <Input
                id="content-url"
                type="url"
                value={contentForm.url}
                onChange={(e) => setContentForm({...contentForm, url: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-description">Descrição</Label>
              <Textarea
                id="content-description"
                value={contentForm.description}
                onChange={(e) => setContentForm({...contentForm, description: e.target.value})}
                placeholder="Breve descrição do conteúdo"
                rows={3}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowContentDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                Adicionar Conteúdo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
