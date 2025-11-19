'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserProfile, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  Plus, 
  FolderKanban, 
  DollarSign, 
  Users, 
  Crown,
  LogOut,
  Settings,
  LayoutDashboard,
  Target,
  TrendingUp,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/')
          return
        }
        setUser(currentUser)
        
        const userProfile = await getUserProfile(currentUser.id)
        setProfile(userProfile)
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const getPlanBadge = (plan: string) => {
    const badges = {
      free: { label: 'Gratuito', color: 'bg-gray-500' },
      pro: { label: 'Pro', color: 'bg-blue-500' },
      enterprise: { label: 'Empresarial', color: 'bg-purple-500' }
    }
    return badges[plan as keyof typeof badges] || badges.free
  }

  const planBadge = getPlanBadge(profile?.plan)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindFlow
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Badge className={`${planBadge.color} text-white`}>
                {planBadge.label}
              </Badge>
              
              <Avatar>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Olá, {profile?.full_name || 'Usuário'}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bem-vindo ao seu espaço de organização e crescimento
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projetos Ativos
              </CardTitle>
              <FolderKanban className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">
                Nenhum projeto criado ainda
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tarefas Pendentes
              </CardTitle>
              <Target className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">
                Todas em dia
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Progresso Geral
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-gray-500 mt-1">
                Comece seu primeiro projeto
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Membros da Equipe
              </CardTitle>
              <Users className="w-4 h-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-gray-500 mt-1">
                Apenas você
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Mapa Mental</CardTitle>
                  <CardDescription>
                    Organize suas ideias visualmente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Crie mapas mentais interativos para estruturar seus pensamentos e projetos
              </p>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Mapa Mental
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Novo Projeto</CardTitle>
                  <CardDescription>
                    Estruture e analise seu negócio
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Análise SWOT, metas, cronograma e muito mais para seu empreendimento
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Projeto
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <CardTitle className="text-base">Financeiro</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Controle receitas, despesas e previsões
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-base">Equipe</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Colabore em tempo real com membros
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-base">Upgrade</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Desbloqueie recursos avançados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        {profile?.plan === 'free' && (
          <Card className="mt-8 border-purple-200 dark:border-purple-900 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                Primeiros Passos
              </CardTitle>
              <CardDescription>
                Complete estas etapas para aproveitar ao máximo o MindFlow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                    1
                  </div>
                  <span>Crie seu primeiro mapa mental</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span>Adicione um projeto empresarial</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span>Configure seu controle financeiro</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
