"use client"

import { useState, useEffect } from 'react'
import { Brain, Plus, Users, Target, TrendingUp, Calendar, FileText, Settings, LogOut, Home, BarChart3, FolderOpen, Upload, Copy, Lightbulb, AlertCircle, Grid3X3, List, Map, Eye, Edit, Trash2, DollarSign, Clock, CheckCircle, PauseCircle, XCircle, PlayCircle, Share2, UserPlus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { projectService, authService, userService, projectShareService, type Project, type User } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState({
    name: 'Usuário',
    email: 'usuario@exemplo.com',
    avatar: 'U'
  })

  const [projects, setProjects] = useState<Project[]>([])
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false)
  const [isShareProjectOpen, setIsShareProjectOpen] = useState(false)
  const [bulkProjectsText, setBulkProjectsText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'mindmap'>('grid')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false)
  
  // Estados para compartilhamento
  const [shareSearchQuery, setShareSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Exemplo de formato para criação em massa
  const exampleBulkFormat = `Projeto: E-commerce de Roupas
Descrição: Loja online especializada em moda feminina e masculina
Status: active
Progresso: 75
Investimento: 50000
Receita: 120000
Equipe: 8

Projeto: App de Delivery
Descrição: Aplicativo para entrega de comida com foco em restaurantes locais
Status: active
Progresso: 45
Investimento: 80000
Receita: 65000
Equipe: 12

Projeto: Sistema de Gestão
Descrição: ERP para pequenas e médias empresas
Status: paused
Progresso: 30
Investimento: 120000
Receita: 0
Equipe: 6

Projeto: Plataforma de Cursos
Descrição: Site de cursos online com certificação
Status: completed
Progresso: 100
Investimento: 35000
Receita: 180000
Equipe: 5`

  // Carregar dados do usuário e projetos
  useEffect(() => {
    loadUserData()
    loadProjects()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        setUser({
          name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Usuário',
          email: currentUser.email || 'usuario@exemplo.com',
          avatar: (currentUser.user_metadata?.name || currentUser.email || 'U')[0].toUpperCase()
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
  }

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        const userProjects = await projectService.getByUserId(currentUser.id)
        setProjects(userProjects || [])
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar usuários
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await userService.searchUsers(query)
      setSearchResults(results || [])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Função para compartilhar projeto
  const handleShareProject = async () => {
    if (!selectedProject || selectedUsers.length === 0) return

    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) return

      for (const user of selectedUsers) {
        await projectShareService.shareProject(
          selectedProject.id,
          user.id,
          currentUser.id,
          'view'
        )
      }

      alert(`Projeto compartilhado com ${selectedUsers.length} usuário(s)!`)
      setIsShareProjectOpen(false)
      setSelectedUsers([])
      setShareSearchQuery('')
      setSearchResults([])
    } catch (error) {
      console.error('Erro ao compartilhar projeto:', error)
      alert('Erro ao compartilhar projeto. Tente novamente.')
    }
  }

  const totalInvestment = projects.reduce((sum, project) => sum + (project.investment || 0), 0)
  const totalRevenue = projects.reduce((sum, project) => sum + (project.revenue || 0), 0)
  const totalProfit = totalRevenue - totalInvestment

  const handleLogout = async () => {
    try {
      await authService.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      window.location.href = '/'
    }
  }

  const handleCreateProject = async (formData: FormData) => {
    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        alert('Usuário não autenticado')
        return
      }

      const projectData = {
        name: formData.get('name') as string,
        description: (formData.get('description') as string) || 'Sem descrição',
        owner_id: currentUser.id,
        owner_name: user.name,
        status: (formData.get('status') as 'active' | 'completed' | 'paused' | 'cancelled') || 'active',
        progress: parseInt(formData.get('progress') as string) || 0,
        investment: parseFloat(formData.get('investment') as string) || 0,
        revenue: parseFloat(formData.get('revenue') as string) || 0,
        team_size: parseInt(formData.get('teamSize') as string) || 1
      }

      await projectService.create(projectData)
      await loadProjects()
      setIsCreateProjectOpen(false)
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      alert('Erro ao criar projeto. Tente novamente.')
    }
  }

  const handleBulkCreate = async () => {
    if (!bulkProjectsText.trim()) return

    try {
      const currentUser = await authService.getCurrentUser()
      if (!currentUser) {
        alert('Usuário não autenticado')
        return
      }

      const projectBlocks = bulkProjectsText.split('\n\n').filter(block => block.trim())
      
      for (const block of projectBlocks) {
        const lines = block.split('\n').filter(line => line.trim())
        const projectData: any = {
          owner_id: currentUser.id,
          owner_name: user.name
        }

        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':')
          const value = valueParts.join(':').trim()
          
          switch (key.toLowerCase().trim()) {
            case 'projeto':
              projectData.name = value
              break
            case 'descrição':
            case 'descricao':
              projectData.description = value
              break
            case 'status':
              projectData.status = value || 'active'
              break
            case 'progresso':
              projectData.progress = parseInt(value) || 0
              break
            case 'investimento':
              projectData.investment = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
              break
            case 'receita':
              projectData.revenue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
              break
            case 'equipe':
              projectData.team_size = parseInt(value) || 1
              break
          }
        })

        if (projectData.name) {
          const finalProjectData = {
            name: projectData.name,
            description: projectData.description || 'Sem descrição',
            owner_id: projectData.owner_id,
            owner_name: projectData.owner_name,
            status: projectData.status || 'active',
            progress: projectData.progress || 0,
            investment: projectData.investment || 0,
            revenue: projectData.revenue || 0,
            team_size: projectData.team_size || 1
          }
          
          await projectService.create(finalProjectData)
        }
      }

      await loadProjects()
      setBulkProjectsText('')
      setIsBulkCreateOpen(false)
      alert('Projetos criados com sucesso!')
    } catch (error) {
      console.error('Erro ao criar projetos em massa:', error)
      alert('Erro ao criar projetos. Alguns podem ter sido criados com sucesso.')
    }
  }

  const copyExampleToClipboard = () => {
    navigator.clipboard.writeText(exampleBulkFormat)
    alert('Exemplo copiado para a área de transferência!')
  }

  const loadExampleIntoTextarea = () => {
    setBulkProjectsText(exampleBulkFormat)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'paused': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'completed': return 'Concluído'
      case 'paused': return 'Pausado'
      case 'cancelled': return 'Cancelado'
      default: return 'Desconhecido'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'paused': return <PauseCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project)
    setIsProjectDetailOpen(true)
  }

  const openShareProject = (project: Project) => {
    setSelectedProject(project)
    setIsShareProjectOpen(true)
  }

  // Componente do Mapa Mental
  const MindMapView = () => {
    const centerX = 400
    const centerY = 300
    const radius = 200

    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 min-h-[600px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50"></div>
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 800 600">
          {/* Centro do mapa mental */}
          <circle
            cx={centerX}
            cy={centerY}
            r="60"
            fill="url(#gradient1)"
            className="drop-shadow-lg"
          />
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            className="fill-white text-sm font-bold"
          >
            Meus
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            className="fill-white text-sm font-bold"
          >
            Projetos
          </text>

          {/* Definir gradientes */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Projetos ao redor do centro */}
          {projects.map((project, index) => {
            const angle = (index * 360) / projects.length
            const radian = (angle * Math.PI) / 180
            const x = centerX + Math.cos(radian) * radius
            const y = centerY + Math.sin(radian) * radius
            
            const gradientId = project.status === 'active' ? 'gradient2' : 
                              project.status === 'completed' ? 'gradient1' :
                              project.status === 'paused' ? 'gradient3' : 'gradient4'

            return (
              <g key={project.id}>
                {/* Linha conectora */}
                <line
                  x1={centerX + Math.cos(radian) * 70}
                  y1={centerY + Math.sin(radian) * 70}
                  x2={x - Math.cos(radian) * 50}
                  y2={y - Math.sin(radian) * 50}
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                
                {/* Círculo do projeto */}
                <circle
                  cx={x}
                  cy={y}
                  r="45"
                  fill={`url(#${gradientId})`}
                  className="cursor-pointer hover:opacity-80 transition-opacity drop-shadow-lg"
                  onClick={() => openProjectDetail(project)}
                />
                
                {/* Texto do projeto */}
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-white text-xs font-semibold cursor-pointer"
                  onClick={() => openProjectDetail(project)}
                >
                  {project.name.length > 12 ? project.name.substring(0, 12) + '...' : project.name}
                </text>
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  className="fill-white text-xs cursor-pointer"
                  onClick={() => openProjectDetail(project)}
                >
                  {project.progress}%
                </text>
                
                {/* Indicador de status */}
                <circle
                  cx={x + 30}
                  cy={y - 30}
                  r="8"
                  fill={project.status === 'active' ? '#10b981' : 
                        project.status === 'completed' ? '#3b82f6' :
                        project.status === 'paused' ? '#f59e0b' : '#ef4444'}
                  className="drop-shadow-sm"
                />
              </g>
            )
          })}
        </svg>

        {/* Legenda */}
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <h4 className="text-white text-sm font-semibold mb-2">Legenda</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Ativo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">Concluído</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Pausado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Cancelado</span>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <p className="text-gray-300 text-xs">
            💡 Clique nos projetos para ver detalhes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SyncMyMind
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:opacity-80"
                  onClick={() => window.location.href = '/profile'}
                >
                  {user.avatar}
                </div>
                <div className="hidden sm:block">
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/profile'}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {projects.length === 0 ? 'Bem-vindo ao SyncMyMind!' : 'Dashboard de Projetos'}
          </h1>
          <p className="text-gray-400">
            {projects.length === 0 
              ? 'Comece criando seu primeiro projeto para sincronizar sua equipe.'
              : 'Gerencie seus projetos e acompanhe o progresso da sua equipe.'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total de Projetos
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
              <p className="text-xs text-gray-400">
                {projects.length === 0 ? 'Nenhum projeto criado ainda' : `${projects.filter(p => p.status === 'active').length} ativos`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Investimento Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(totalInvestment)}
              </div>
              <p className="text-xs text-gray-400">
                Investido em projetos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Receita Total
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(totalRevenue)}
              </div>
              <p className="text-xs text-gray-400">
                Gerada pelos projetos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Lucro Líquido
              </CardTitle>
              <Target className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(totalProfit)}
              </div>
              <p className="text-xs text-gray-400">
                Lucro atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Meus Projetos</CardTitle>
                <CardDescription className="text-gray-400">
                  {isLoading ? 'Carregando projetos...' : projects.length === 0 ? 'Seus projetos aparecerão aqui' : `${projects.length} projeto(s) criado(s)`}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {/* View Mode Selector */}
                <div className="flex bg-slate-700 rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('grid')}
                    className={`h-8 px-3 ${viewMode === 'grid' ? 'bg-slate-600' : 'hover:bg-slate-600'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    className={`h-8 px-3 ${viewMode === 'list' ? 'bg-slate-600' : 'hover:bg-slate-600'}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'mindmap' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('mindmap')}
                    className={`h-8 px-3 ${viewMode === 'mindmap' ? 'bg-slate-600' : 'hover:bg-slate-600'}`}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-white">Criar Novo Projeto</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Adicione um novo projeto ao seu dashboard
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      handleCreateProject(new FormData(e.currentTarget))
                    }} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-300">Nome do Projeto *</Label>
                          <Input
                            id="name"
                            name="name"
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="Ex: E-commerce de Roupas"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status" className="text-gray-300">Status</Label>
                          <Select name="status" defaultValue="active">
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="paused">Pausado</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                              <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                        <Textarea
                          id="description"
                          name="description"
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="Descreva o projeto (opcional)"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="progress" className="text-gray-300">Progresso (%)</Label>
                          <Input
                            id="progress"
                            name="progress"
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="0"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="investment" className="text-gray-300">Investimento (R$)</Label>
                          <Input
                            id="investment"
                            name="investment"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue="0"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="revenue" className="text-gray-300">Receita (R$)</Label>
                          <Input
                            id="revenue"
                            name="revenue"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue="0"
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="teamSize" className="text-gray-300">Tamanho da Equipe</Label>
                        <Input
                          id="teamSize"
                          name="teamSize"
                          type="number"
                          min="1"
                          defaultValue="1"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateProjectOpen(false)}
                          className="border-slate-600 text-gray-300 hover:bg-slate-700"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        >
                          Criar Projeto
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isBulkCreateOpen} onOpenChange={setIsBulkCreateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Em Massa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white">Criar Projetos em Massa</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Adicione múltiplos projetos de uma vez usando o formato especificado
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="create" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                        <TabsTrigger value="create" className="data-[state=active]:bg-slate-600">
                          Criar Projetos
                        </TabsTrigger>
                        <TabsTrigger value="example" className="data-[state=active]:bg-slate-600">
                          Exemplo e Formato
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="create" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Cole ou digite os projetos no formato especificado:</Label>
                          <Textarea
                            value={bulkProjectsText}
                            onChange={(e) => setBulkProjectsText(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white min-h-[300px] font-mono text-sm"
                            placeholder="Cole aqui os projetos no formato do exemplo..."
                          />
                        </div>

                        <Alert className="bg-blue-900/20 border-blue-700">
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription className="text-blue-400">
                            <strong>Dica:</strong> Separe cada projeto com uma linha em branco. Campos em branco serão preenchidos com valores padrão.
                          </AlertDescription>
                        </Alert>

                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={loadExampleIntoTextarea}
                            className="border-slate-600 text-gray-300 hover:bg-slate-700"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Carregar Exemplo
                          </Button>
                          <div className="space-x-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsBulkCreateOpen(false)}
                              className="border-slate-600 text-gray-300 hover:bg-slate-700"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleBulkCreate}
                              disabled={!bulkProjectsText.trim()}
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                            >
                              Criar Projetos
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="example" className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-white font-semibold mb-2">📋 Formato Obrigatório:</h3>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                              <code className="text-green-400 text-sm">
                                Projeto: [Nome do Projeto]<br/>
                                Descrição: [Descrição opcional]<br/>
                                Status: [active/paused/completed/cancelled]<br/>
                                Progresso: [0-100]<br/>
                                Investimento: [valor numérico]<br/>
                                Receita: [valor numérico]<br/>
                                Equipe: [número de pessoas]<br/>
                                <br/>
                                [Linha em branco separa projetos]
                              </code>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-white font-semibold">💡 Exemplo Prático:</h3>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={copyExampleToClipboard}
                                className="border-slate-600 text-gray-300 hover:bg-slate-700"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                              </Button>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600 max-h-64 overflow-y-auto">
                              <pre className="text-cyan-400 text-xs whitespace-pre-wrap">
                                {exampleBulkFormat}
                              </pre>
                            </div>
                          </div>

                          <Alert className="bg-yellow-900/20 border-yellow-700">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-yellow-400">
                              <strong>Importante:</strong> Campos em branco ou ausentes receberão valores padrão. 
                              Apenas o "Projeto:" é obrigatório.
                            </AlertDescription>
                          </Alert>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-gray-400 mt-2">Carregando projetos...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Nenhum projeto criado ainda</p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setIsCreateProjectOpen(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Projeto
                  </Button>
                  <p className="text-gray-500 text-sm">ou</p>
                  <Button 
                    onClick={() => setIsBulkCreateOpen(true)}
                    variant="outline" 
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Vários Projetos
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{project.name}</h3>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getStatusColor(project.status)} text-white`}>
                              {getStatusIcon(project.status)}
                              <span className="ml-1">{getStatusText(project.status)}</span>
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Progresso</span>
                            <span className="text-white">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div>
                            <p className="text-gray-400">Investimento</p>
                            <p className="text-red-400 font-medium">{formatCurrency(project.investment)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Receita</p>
                            <p className="text-green-400 font-medium">{formatCurrency(project.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Lucro</p>
                            <p className={`font-medium ${project.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatCurrency(project.profit)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Equipe</p>
                            <p className="text-white font-medium">{project.team_size} pessoas</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => openProjectDetail(project)}
                            className="flex-1 bg-slate-600 hover:bg-slate-500 text-white"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                          <Button
                            onClick={() => openShareProject(project)}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-gray-300 hover:bg-slate-700"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-white font-semibold">{project.name}</h3>
                              <Badge className={`${getStatusColor(project.status)} text-white`}>
                                {getStatusIcon(project.status)}
                                <span className="ml-1">{getStatusText(project.status)}</span>
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-gray-400 text-xs">Progresso</p>
                              <p className="text-white font-medium">{project.progress}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400 text-xs">Investimento</p>
                              <p className="text-red-400 font-medium">{formatCurrency(project.investment)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400 text-xs">Receita</p>
                              <p className="text-green-400 font-medium">{formatCurrency(project.revenue)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-gray-400 text-xs">Equipe</p>
                              <p className="text-white font-medium">{project.team_size}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => openProjectDetail(project)}
                                size="sm"
                                className="bg-slate-600 hover:bg-slate-500"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => openShareProject(project)}
                                variant="outline"
                                size="sm"
                                className="border-slate-600 text-gray-300 hover:bg-slate-700"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mind Map View */}
                {viewMode === 'mindmap' && (
                  projects.length === 0 ? (
                    <div className="text-center py-8">
                      <Map className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Crie projetos para visualizar o mapa mental</p>
                    </div>
                  ) : (
                    <MindMapView />
                  )
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Only show if has projects */}
        {projects.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-400">
                Acesse rapidamente as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="justify-start bg-slate-700 hover:bg-slate-600 text-white h-12"
                >
                  <Plus className="h-4 w-4 mr-3" />
                  Novo Projeto
                </Button>
                
                <Button 
                  onClick={() => setIsBulkCreateOpen(true)}
                  className="justify-start bg-slate-700 hover:bg-slate-600 text-white h-12"
                >
                  <Upload className="h-4 w-4 mr-3" />
                  Em Massa
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/profile'}
                  className="justify-start bg-slate-700 hover:bg-slate-600 text-white h-12"
                >
                  <Users className="h-4 w-4 mr-3" />
                  Perfil
                </Button>
                
                <Button className="justify-start bg-slate-700 hover:bg-slate-600 text-white h-12">
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Relatórios
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started - Only show if no projects */}
        {projects.length === 0 && !isLoading && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Primeiros Passos</CardTitle>
              <CardDescription className="text-gray-400">
                Configure sua conta e comece a usar o SyncMyMind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Crie seu primeiro projeto</p>
                    <p className="text-gray-400 text-xs">Defina metas e objetivos para começar</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Configure seu perfil</p>
                    <p className="text-gray-400 text-xs">Adicione informações pessoais e preferências</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Compartilhe com sua equipe</p>
                    <p className="text-gray-400 text-xs">Convide membros e colabore em projetos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Project Detail Modal */}
      <Dialog open={isProjectDetailOpen} onOpenChange={setIsProjectDetailOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center space-x-2">
                  <span>{selectedProject.name}</span>
                  <Badge className={`${getStatusColor(selectedProject.status)} text-white`}>
                    {getStatusIcon(selectedProject.status)}
                    <span className="ml-1">{getStatusText(selectedProject.status)}</span>
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Progress Section */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progresso do Projeto</span>
                    <span className="text-white font-medium">{selectedProject.progress}%</span>
                  </div>
                  <Progress value={selectedProject.progress} className="h-3" />
                </div>

                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-red-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Investimento</p>
                          <p className="text-red-400 font-bold text-lg">{formatCurrency(selectedProject.investment)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Receita</p>
                          <p className="text-green-400 font-bold text-lg">{formatCurrency(selectedProject.revenue)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-yellow-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Lucro</p>
                          <p className={`font-bold text-lg ${selectedProject.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(selectedProject.profit)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Team Info */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">Equipe do Projeto</p>
                      <p className="text-gray-400 text-sm">{selectedProject.team_size} pessoas trabalhando</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Proprietário</p>
                    <p className="text-white font-medium">{selectedProject.owner_name}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => openShareProject(selectedProject)}
                    variant="outline"
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => setIsProjectDetailOpen(false)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Project Modal */}
      <Dialog open={isShareProjectOpen} onOpenChange={setIsShareProjectOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Compartilhar Projeto</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedProject ? `Compartilhe "${selectedProject.name}" com outros usuários` : 'Compartilhe este projeto'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Search Users */}
            <div className="space-y-2">
              <Label className="text-gray-300">Buscar Usuários</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={shareSearchQuery}
                  onChange={(e) => {
                    setShareSearchQuery(e.target.value)
                    searchUsers(e.target.value)
                  }}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                  placeholder="Digite nome ou email do usuário..."
                />
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <Label className="text-gray-300">Resultados da Busca</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!selectedUsers.find(u => u.id === user.id)) {
                            setSelectedUsers([...selectedUsers, user])
                          }
                        }}
                        disabled={selectedUsers.some(u => u.id === user.id)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {selectedUsers.some(u => u.id === user.id) ? 'Adicionado' : 'Adicionar'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-gray-300">Usuários Selecionados ({selectedUsers.length})</Label>
                <div className="space-y-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-700"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
                        }}
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsShareProjectOpen(false)
                  setSelectedUsers([])
                  setShareSearchQuery('')
                  setSearchResults([])
                }}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleShareProject}
                disabled={selectedUsers.length === 0}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar com {selectedUsers.length} usuário(s)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}