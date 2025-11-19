"use client"

import { useState, useEffect } from 'react'
import { Brain, Users, FolderOpen, BarChart3, Settings, Shield, LogOut, Search, Filter, Plus, Edit3, Trash2, Eye, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { userService, projectService, statsService, type User, type Project } from '@/lib/supabase'

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  activeProjects: number
  totalRevenue: number
  totalInvestment: number
  totalProfit: number
  monthlyGrowth: number
}

export default function AdminPanel() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'projects' | 'settings'>('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalRevenue: 0,
    totalInvestment: 0,
    totalProfit: 0,
    monthlyGrowth: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar dados iniciais
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setIsLoading(true)
      await Promise.all([
        loadUsers(),
        loadProjects(),
        loadStats()
      ])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const userData = await userService.getAll()
      setUsers(userData || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      setUsers([])
    }
  }

  const loadProjects = async () => {
    try {
      const projectData = await projectService.getAll()
      setProjects(projectData || [])
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
      setProjects([])
    }
  }

  const loadStats = async () => {
    try {
      const systemStats = await statsService.getSystemStats()
      setStats(systemStats)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalProjects: 0,
        activeProjects: 0,
        totalRevenue: 0,
        totalInvestment: 0,
        totalProfit: 0,
        monthlyGrowth: 0
      })
    }
  }

  const handleLogout = () => {
    window.location.href = '/'
  }

  const handleCreateUser = async (formData: FormData) => {
    try {
      const userData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as 'admin' | 'user' | 'manager',
        status: 'active' as const
      }

      await userService.create(userData)
      await loadUsers()
      await loadStats()
      setIsCreateUserOpen(false)
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      alert('Erro ao criar usuário. Tente novamente.')
    }
  }

  const handleUserStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      await userService.update(userId, { status: newStatus })
      await loadUsers()
      await loadStats()
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error)
      alert('Erro ao atualizar status. Tente novamente.')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.delete(userId)
        await loadUsers()
        await loadStats()
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
        alert('Erro ao excluir usuário. Tente novamente.')
      }
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'suspended': return 'bg-red-500'
      case 'completed': return 'bg-blue-500'
      case 'paused': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'inactive': return 'Inativo'
      case 'suspended': return 'Suspenso'
      case 'completed': return 'Concluído'
      case 'paused': return 'Pausado'
      case 'cancelled': return 'Cancelado'
      default: return 'Desconhecido'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'manager': return 'Gerente'
      case 'user': return 'Usuário'
      default: return 'Usuário'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-yellow-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('users')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'users' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Usuários
              </button>
              <button
                onClick={() => setCurrentView('projects')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'projects' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Projetos
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'settings' 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Configurações
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-yellow-500 text-black">A</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Dashboard Header */}
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Administrativo</h1>
              <p className="text-gray-400 mt-1">Visão geral do sistema SyncMyMind</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                  <p className="text-xs text-gray-400">{stats.activeUsers} ativos</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total de Projetos</CardTitle>
                  <FolderOpen className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
                  <p className="text-xs text-gray-400">{stats.activeProjects} ativos</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Receita Total</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</div>
                  <p className="text-xs text-gray-400">
                    {stats.totalRevenue === 0 ? 'Sistema iniciando' : 'Receita acumulada'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Lucro Total</CardTitle>
                  <BarChart3 className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(stats.totalProfit)}
                  </div>
                  <p className="text-xs text-gray-400">
                    {stats.totalProfit === 0 ? 'Pronto para dados reais' : 'Lucro acumulado'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Status do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-green-900/20 border-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-400">
                      Sistema integrado com Supabase e funcionando
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-blue-900/20 border-blue-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-blue-400">
                      {stats.totalUsers === 0 ? 'Aguardando primeiros usuários' : `${stats.totalUsers} usuários cadastrados`}
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-yellow-900/20 border-yellow-700">
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-yellow-400">
                      {stats.totalProjects === 0 ? 'Nenhum projeto criado ainda' : `${stats.totalProjects} projetos no sistema`}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto"></div>
                      <p className="text-gray-400 text-sm mt-2">Carregando...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users.length === 0 && projects.length === 0 ? (
                        <p className="text-gray-400 text-sm">Nenhuma atividade ainda</p>
                      ) : (
                        <>
                          {users.slice(0, 3).map((user) => (
                            <div key={user.id} className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <div>
                                <p className="text-white text-sm">Novo usuário: {user.name}</p>
                                <p className="text-gray-400 text-xs">{formatDate(user.created_at)}</p>
                              </div>
                            </div>
                          ))}
                          {projects.slice(0, 2).map((project) => (
                            <div key={project.id} className="flex items-center space-x-3 p-2 bg-slate-700/30 rounded-lg">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div>
                                <p className="text-white text-sm">Projeto criado: {project.name}</p>
                                <p className="text-gray-400 text-xs">{formatDate(project.created_at)}</p>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {currentView === 'users' && (
          <div className="space-y-8">
            {/* Users Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Gestão de Usuários</h1>
                <p className="text-gray-400 mt-1">Gerencie todos os usuários da plataforma</p>
              </div>
              <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Criar Novo Usuário</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Adicione um novo usuário ao sistema
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleCreateUser(new FormData(e.currentTarget))
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Nome do usuário"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-300">Função</Label>
                      <Select name="role" defaultValue="user">
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="user">Usuário</SelectItem>
                          <SelectItem value="manager">Gerente</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreateUserOpen(false)}
                        className="border-slate-600 text-gray-300 hover:bg-slate-700"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                      >
                        Criar Usuário
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-600 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="suspended">Suspensos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Carregando usuários...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum usuário cadastrado</h3>
                    <p className="text-gray-400 mb-6">Os usuários aparecerão aqui quando se cadastrarem na plataforma</p>
                    <Button 
                      onClick={() => setIsCreateUserOpen(true)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Usuário
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-slate-700">
                        <tr>
                          <th className="text-left p-4 text-gray-300 font-medium">Usuário</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Função</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Projetos</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Cadastro</th>
                          <th className="text-left p-4 text-gray-300 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-cyan-500 text-white">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-white font-medium">{user.name}</p>
                                  <p className="text-gray-400 text-sm">{user.email}</p>
                                  {user.phone && (
                                    <p className="text-gray-500 text-xs">{user.phone}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="border-slate-600 text-gray-300">
                                {getRoleText(user.role)}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={`${getStatusColor(user.status)} text-white`}>
                                {getStatusText(user.status)}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="text-white">{user.projects_count || 0}</span>
                            </td>
                            <td className="p-4">
                              <span className="text-gray-400 text-sm">
                                {formatDate(user.created_at)}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-gray-400 hover:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'projects' && (
          <div className="space-y-8">
            {/* Projects Header */}
            <div>
              <h1 className="text-3xl font-bold text-white">Gestão de Projetos</h1>
              <p className="text-gray-400 mt-1">Monitore todos os projetos da plataforma</p>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Carregando projetos...</p>
              </div>
            ) : projects.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-12">
                  <div className="text-center">
                    <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum projeto criado</h3>
                    <p className="text-gray-400">Os projetos dos usuários aparecerão aqui quando forem criados</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-white">{project.name}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {project.description}
                          </CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(project.status)} text-white`}>
                          {getStatusText(project.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Progresso</span>
                          <span className="text-white">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
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
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                        <div className="text-sm text-gray-400">
                          <p>Por {project.owner_name}</p>
                          <p>{project.team_size} membros</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'settings' && (
          <div className="space-y-8">
            {/* Settings Header */}
            <div>
              <h1 className="text-3xl font-bold text-white">Configurações do Sistema</h1>
              <p className="text-gray-400 mt-1">Gerencie as configurações da plataforma</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Configurações Gerais</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configurações básicas da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nome da Plataforma</Label>
                    <Input
                      defaultValue="SyncMyMind"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Email de Suporte</Label>
                    <Input
                      defaultValue="suporte@syncmymind.com"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Limite de Projetos por Usuário</Label>
                    <Input
                      type="number"
                      defaultValue="10"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Integração Supabase</CardTitle>
                  <CardDescription className="text-gray-400">
                    Status da conexão com banco de dados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-green-900/20 border-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-400">
                      Conectado ao Supabase com sucesso
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700">
                      Testar Conexão
                    </Button>
                    <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700">
                      Backup de Dados
                    </Button>
                    <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700">
                      Logs do Sistema
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}