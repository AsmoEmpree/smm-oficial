'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Brain, 
  Plus, 
  Search, 
  BarChart3, 
  Users, 
  Target, 
  CheckSquare, 
  Trash2,
  Calendar,
  Lightbulb,
  Globe,
  GitBranch,
  User,
  Clock,
  AlertCircle,
  MessageSquare,
  FileText,
  Key,
  TrendingUp,
  Zap,
  Archive,
  Edit,
  Link2,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  CheckCircle2
} from 'lucide-react'

// Types
interface Project {
  id: string
  name: string
  description: string
  objective: string
  status: 'ideias' | 'em-andamento' | 'finalizando' | 'aguardando' | 'pausado' | 'concluido'
  priority: 'baixa' | 'media' | 'alta' | 'urgente'
  responsible: 'eu' | 'socio' | 'ambos'
  deadline?: string
  progress: number
  tasks: string[]
  missing: string[]
  observations: string
  dependencies: string[]
  created_at: string
}

interface Login {
  id: string
  project_id: string
  platform: string
  username: string
  password: string
  notes: string
  access: string
  created_at: string
}

interface Communication {
  id: string
  type: 'tarefa-eu' | 'tarefa-socio' | 'acordo' | 'decisao-pendente' | 'decisao-tomada'
  title: string
  description: string
  assigned_to?: 'eu' | 'socio'
  status: 'pendente' | 'concluido'
  created_at: string
}

interface Note {
  id: string
  category: 'ideia' | 'estrategia' | 'importante' | 'melhoria' | 'analise'
  title: string
  content: string
  created_at: string
}

interface Automation {
  id: string
  title: string
  frequency: 'diario' | 'semanal' | 'mensal'
  description: string
  completed: boolean
  created_at: string
}

interface Document {
  id: string
  title: string
  type: 'material' | 'arquivo' | 'link' | 'modelo' | 'observacao'
  content: string
  url?: string
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

// Main Component
export default function CorteryCRM() {
  const [activeTab, setActiveTab] = useState('painel-geral')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Data States
  const [projects, setProjects] = useState<Project[]>([])
  const [logins, setLogins] = useState<Login[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [automations, setAutomations] = useState<Automation[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  
  // Dialog States
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showCommDialog, setShowCommDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [showAutoDialog, setShowAutoDialog] = useState(false)
  const [showDocDialog, setShowDocDialog] = useState(false)
  
  // Selected Items
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  
  // Form States
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    objective: '',
    status: 'ideias' as const,
    priority: 'media' as const,
    responsible: 'eu' as const,
    deadline: '',
    tasks: '',
    missing: '',
    observations: '',
    dependencies: ''
  })
  
  const [loginForm, setLoginForm] = useState({
    project_id: '',
    platform: '',
    username: '',
    password: '',
    notes: '',
    access: ''
  })
  
  const [commForm, setCommForm] = useState({
    type: 'tarefa-eu' as const,
    title: '',
    description: '',
    assigned_to: 'eu' as const,
    status: 'pendente' as const
  })
  
  const [noteForm, setNoteForm] = useState({
    category: 'ideia' as const,
    title: '',
    content: ''
  })
  
  const [autoForm, setAutoForm] = useState({
    title: '',
    frequency: 'diario' as const,
    description: ''
  })
  
  const [docForm, setDocForm] = useState({
    title: '',
    type: 'material' as const,
    content: '',
    url: ''
  })

  // Handlers
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectForm.name,
      description: projectForm.description,
      objective: projectForm.objective,
      status: projectForm.status,
      priority: projectForm.priority,
      responsible: projectForm.responsible,
      deadline: projectForm.deadline,
      progress: 0,
      tasks: projectForm.tasks.split('\n').filter(t => t.trim()),
      missing: projectForm.missing.split('\n').filter(m => m.trim()),
      observations: projectForm.observations,
      dependencies: projectForm.dependencies.split('\n').filter(d => d.trim()),
      created_at: new Date().toISOString()
    }
    
    setProjects([...projects, newProject])
    setShowProjectDialog(false)
    setProjectForm({
      name: '',
      description: '',
      objective: '',
      status: 'ideias',
      priority: 'media',
      responsible: 'eu',
      deadline: '',
      tasks: '',
      missing: '',
      observations: '',
      dependencies: ''
    })
    showToast('✅ Projeto criado com sucesso!')
  }
  
  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    
    const updatedProject: Project = {
      ...editingProject,
      name: projectForm.name,
      description: projectForm.description,
      objective: projectForm.objective,
      status: projectForm.status,
      priority: projectForm.priority,
      responsible: projectForm.responsible,
      deadline: projectForm.deadline,
      tasks: projectForm.tasks.split('\n').filter(t => t.trim()),
      missing: projectForm.missing.split('\n').filter(m => m.trim()),
      observations: projectForm.observations,
      dependencies: projectForm.dependencies.split('\n').filter(d => d.trim())
    }
    
    setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p))
    setEditingProject(null)
    setShowProjectDialog(false)
    showToast('✅ Projeto atualizado com sucesso!')
  }
  
  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectForm({
      name: project.name,
      description: project.description,
      objective: project.objective,
      status: project.status,
      priority: project.priority,
      responsible: project.responsible,
      deadline: project.deadline || '',
      tasks: project.tasks.join('\n'),
      missing: project.missing.join('\n'),
      observations: project.observations,
      dependencies: project.dependencies.join('\n')
    })
    setShowProjectDialog(true)
  }
  
  const handleDeleteProject = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      setProjects(projects.filter(p => p.id !== id))
      setLogins(logins.filter(l => l.project_id !== id))
      showToast('🗑️ Projeto excluído com sucesso!')
    }
  }
  
  const handleCreateLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newLogin: Login = {
      id: Date.now().toString(),
      ...loginForm,
      created_at: new Date().toISOString()
    }
    
    setLogins([...logins, newLogin])
    setShowLoginDialog(false)
    setLoginForm({
      project_id: '',
      platform: '',
      username: '',
      password: '',
      notes: '',
      access: ''
    })
    showToast('🔐 Login adicionado com sucesso!')
  }
  
  const handleCreateComm = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newComm: Communication = {
      id: Date.now().toString(),
      ...commForm,
      created_at: new Date().toISOString()
    }
    
    setCommunications([...communications, newComm])
    setShowCommDialog(false)
    setCommForm({
      type: 'tarefa-eu',
      title: '',
      description: '',
      assigned_to: 'eu',
      status: 'pendente'
    })
    showToast('💬 Comunicação registrada!')
  }
  
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteForm,
      created_at: new Date().toISOString()
    }
    
    setNotes([...notes, newNote])
    setShowNoteDialog(false)
    setNoteForm({
      category: 'ideia',
      title: '',
      content: ''
    })
    showToast('📝 Observação adicionada!')
  }
  
  const handleCreateAuto = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newAuto: Automation = {
      id: Date.now().toString(),
      ...autoForm,
      completed: false,
      created_at: new Date().toISOString()
    }
    
    setAutomations([...automations, newAuto])
    setShowAutoDialog(false)
    setAutoForm({
      title: '',
      frequency: 'diario',
      description: ''
    })
    showToast('⚡ Automação criada!')
  }
  
  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newDoc: Document = {
      id: Date.now().toString(),
      ...docForm,
      created_at: new Date().toISOString()
    }
    
    setDocuments([...documents, newDoc])
    setShowDocDialog(false)
    setDocForm({
      title: '',
      type: 'material',
      content: '',
      url: ''
    })
    showToast('📄 Documento adicionado!')
  }
  
  const updateProjectProgress = (projectId: string, progress: number) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, progress } : p
    ))
    showToast('📊 Progresso atualizado!')
  }
  
  const toggleAutoCompletion = (autoId: string) => {
    setAutomations(automations.map(a => 
      a.id === autoId ? { ...a, completed: !a.completed } : a
    ))
  }
  
  const toggleCommStatus = (commId: string) => {
    setCommunications(communications.map(c => 
      c.id === commId ? { ...c, status: c.status === 'pendente' ? 'concluido' : 'pendente' } : c
    ))
  }

  // Computed Values
  const activeProjects = projects.filter(p => p.status === 'em-andamento')
  const pendingProjects = projects.filter(p => p.status === 'ideias' || p.status === 'aguardando')
  const pausedProjects = projects.filter(p => p.status === 'pausado')
  const completedProjects = projects.filter(p => p.status === 'concluido')
  
  const myTasks = communications.filter(c => c.assigned_to === 'eu' && c.status === 'pendente')
  const partnerTasks = communications.filter(c => c.assigned_to === 'socio' && c.status === 'pendente')
  const pendingDecisions = communications.filter(c => c.type === 'decisao-pendente')
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideias': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'em-andamento': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'finalizando': return 'bg-green-100 text-green-800 border-green-300'
      case 'aguardando': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'pausado': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'concluido': return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-300'
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'baixa': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ideias': return <Lightbulb className="h-4 w-4" />
      case 'em-andamento': return <PlayCircle className="h-4 w-4" />
      case 'finalizando': return <TrendingUp className="h-4 w-4" />
      case 'aguardando': return <Clock className="h-4 w-4" />
      case 'pausado': return <PauseCircle className="h-4 w-4" />
      case 'concluido': return <CheckCircle2 className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-b border-blue-800 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  Cortery CRM
                </h1>
                <p className="text-xs text-blue-300">QG de Gerenciamento de Projetos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <Avatar className="cursor-pointer ring-2 ring-blue-400">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 p-1">
            <TabsTrigger value="painel-geral" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Painel Geral
            </TabsTrigger>
            <TabsTrigger value="projetos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Lightbulb className="h-4 w-4 mr-2" />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="sincronizacao" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <GitBranch className="h-4 w-4 mr-2" />
              Sincronização
            </TabsTrigger>
            <TabsTrigger value="logins" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Key className="h-4 w-4 mr-2" />
              Logins
            </TabsTrigger>
            <TabsTrigger value="comunicacao" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comunicação
            </TabsTrigger>
            <TabsTrigger value="observacoes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Observações
            </TabsTrigger>
            <TabsTrigger value="automacao" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Zap className="h-4 w-4 mr-2" />
              Automação
            </TabsTrigger>
            <TabsTrigger value="documentacao" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              <Archive className="h-4 w-4 mr-2" />
              Documentação
            </TabsTrigger>
          </TabsList>

          {/* 1. PAINEL GERAL */}
          <TabsContent value="painel-geral" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Painel Geral dos Projetos</h2>
                <p className="text-gray-600 mt-1">Visão macro de todos os projetos da Cortery</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingProject(null)
                  setProjectForm({
                    name: '',
                    description: '',
                    objective: '',
                    status: 'ideias',
                    priority: 'media',
                    responsible: 'eu',
                    deadline: '',
                    tasks: '',
                    missing: '',
                    observations: '',
                    dependencies: ''
                  })
                  setShowProjectDialog(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                  <PlayCircle className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeProjects.length}</div>
                  <p className="text-xs text-blue-100 mt-1">
                    Em andamento agora
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos Pendentes</CardTitle>
                  <Clock className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingProjects.length}</div>
                  <p className="text-xs text-yellow-100 mt-1">
                    Aguardando início
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos Pausados</CardTitle>
                  <PauseCircle className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pausedProjects.length}</div>
                  <p className="text-xs text-gray-100 mt-1">
                    Temporariamente parados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
                  <CheckCircle2 className="h-5 w-5" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{completedProjects.length}</div>
                  <p className="text-xs text-green-100 mt-1">
                    Finalizados com sucesso
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Deadlines Principais */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Calendar className="h-5 w-5 mr-2 text-red-500" />
                  Deadlines Principais
                </CardTitle>
                <CardDescription>Projetos com prazos próximos</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.filter(p => p.deadline).sort((a, b) => 
                  new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
                ).slice(0, 5).map(project => (
                  <div key={project.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(project.status)}
                      <div>
                        <p className="font-medium text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(project.deadline!).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.ceil((new Date(project.deadline!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {projects.filter(p => p.deadline).length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhum deadline definido</p>
                )}
              </CardContent>
            </Card>

            {/* Status Geral */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Target className="h-5 w-5 mr-2 text-blue-500" />
                    Visão Macro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total de Projetos</span>
                    <span className="text-2xl font-bold text-gray-900">{projects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Taxa de Conclusão</span>
                    <span className="text-2xl font-bold text-green-600">
                      {projects.length > 0 ? Math.round((completedProjects.length / projects.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Progresso Médio</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                    Prioridades
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Urgente</span>
                    <Badge className="bg-red-100 text-red-800">
                      {projects.filter(p => p.priority === 'urgente').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Alta</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      {projects.filter(p => p.priority === 'alta').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Média</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {projects.filter(p => p.priority === 'media').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Baixa</span>
                    <Badge className="bg-green-100 text-green-800">
                      {projects.filter(p => p.priority === 'baixa').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 2. PROJETOS */}
          <TabsContent value="projetos" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Gerenciamento de Projetos</h2>
                <p className="text-gray-600 mt-1">Todos os projetos da Cortery em um só lugar</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingProject(null)
                  setProjectForm({
                    name: '',
                    description: '',
                    objective: '',
                    status: 'ideias',
                    priority: 'media',
                    responsible: 'eu',
                    deadline: '',
                    tasks: '',
                    missing: '',
                    observations: '',
                    dependencies: ''
                  })
                  setShowProjectDialog(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Projeto
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Lightbulb className="h-20 w-20 text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum projeto criado</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    Comece criando seu primeiro projeto para organizar todas as iniciativas da Cortery
                  </p>
                  <Button 
                    onClick={() => setShowProjectDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Projeto
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(project => (
                  <Card key={project.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditProject(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                        <Badge variant="outline">
                          <User className="h-3 w-3 mr-1" />
                          {project.responsible}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Progresso</span>
                          <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={project.progress}
                          onChange={(e) => updateProjectProgress(project.id, parseInt(e.target.value))}
                          className="mt-2 w-full"
                        />
                      </div>
                      
                      {project.objective && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Objetivo Principal:</p>
                          <p className="text-sm text-gray-600">{project.objective}</p>
                        </div>
                      )}
                      
                      {project.tasks.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Tarefas Pendentes:</p>
                          <ul className="space-y-1">
                            {project.tasks.slice(0, 3).map((task, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <ChevronRight className="h-4 w-4 mr-1 mt-0.5 text-blue-500 flex-shrink-0" />
                                <span className="line-clamp-1">{task}</span>
                              </li>
                            ))}
                            {project.tasks.length > 3 && (
                              <li className="text-sm text-gray-500 italic">
                                +{project.tasks.length - 3} mais...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {project.missing.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">O que falta:</p>
                          <ul className="space-y-1">
                            {project.missing.slice(0, 2).map((item, idx) => (
                              <li key={idx} className="text-sm text-red-600 flex items-start">
                                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {project.deadline && (
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 3. SINCRONIZAÇÃO ENTRE PROJETOS */}
          <TabsContent value="sincronizacao" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Sincronização Entre Projetos</h2>
              <p className="text-gray-600 mt-1">Visualize interdependências e fluxo de prioridades</p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <GitBranch className="h-5 w-5 mr-2 text-blue-500" />
                  Mapa de Dependências
                </CardTitle>
                <CardDescription>Projetos que dependem de outros para avançar</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.filter(p => p.dependencies.length > 0).length === 0 ? (
                  <div className="text-center py-12">
                    <Link2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma dependência configurada ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.filter(p => p.dependencies.length > 0).map(project => (
                      <div key={project.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{project.name}</h4>
                            <Badge className={getStatusColor(project.status)} variant="outline">
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Depende de:</p>
                          <ul className="space-y-2">
                            {project.dependencies.map((dep, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <ChevronRight className="h-4 w-4 mr-2 text-blue-500" />
                                {dep}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Target className="h-5 w-5 mr-2 text-green-500" />
                    Ordem Lógica de Execução
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projects.sort((a, b) => {
                      const priorityOrder = { urgente: 4, alta: 3, media: 2, baixa: 1 }
                      return priorityOrder[b.priority] - priorityOrder[a.priority]
                    }).map((project, idx) => (
                      <div key={project.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{project.name}</p>
                          <Badge className={getPriorityColor(project.priority)} variant="outline">
                            {project.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                    Alertas de Bloqueio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.filter(p => p.status === 'aguardando' || p.status === 'pausado').length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-gray-600">Nenhum projeto bloqueado</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.filter(p => p.status === 'aguardando' || p.status === 'pausado').map(project => (
                        <div key={project.id} className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
                          <p className="font-medium text-gray-900">{project.name}</p>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          {project.missing.length > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                              Falta: {project.missing[0]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 4. LOGINS E ACESSOS */}
          <TabsContent value="logins" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Logins e Acessos</h2>
                <p className="text-gray-600 mt-1">Gerenciamento seguro de credenciais</p>
              </div>
              <Button 
                onClick={() => setShowLoginDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Login
              </Button>
            </div>

            {logins.length === 0 ? (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Key className="h-20 w-20 text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum login cadastrado</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    Adicione logins e senhas relacionados aos seus projetos
                  </p>
                  <Button 
                    onClick={() => setShowLoginDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Login
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {logins.map(login => {
                  const project = projects.find(p => p.id === login.project_id)
                  return (
                    <Card key={login.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{login.platform}</CardTitle>
                            {project && (
                              <CardDescription>Projeto: {project.name}</CardDescription>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este login?')) {
                                setLogins(logins.filter(l => l.id !== login.id))
                                showToast('🗑️ Login excluído')
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Login:</p>
                          <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                            {login.username}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Senha:</p>
                          <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                            {'•'.repeat(login.password.length)}
                          </p>
                        </div>
                        {login.notes && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Observações:</p>
                            <p className="text-sm text-gray-600">{login.notes}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            {login.access}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* 5. COMUNICAÇÃO ENTRE SÓCIOS */}
          <TabsContent value="comunicacao" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Comunicação Entre Sócios</h2>
                <p className="text-gray-600 mt-1">Canal oficial de tarefas, acordos e decisões</p>
              </div>
              <Button 
                onClick={() => setShowCommDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Comunicação
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Minhas Tarefas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{myTasks.length}</div>
                  <p className="text-blue-100">Tarefas atribuídas a mim</p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Tarefas do Sócio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{partnerTasks.length}</div>
                  <p className="text-indigo-100">Tarefas do parceiro</p>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Decisões Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{pendingDecisions.length}</div>
                  <p className="text-orange-100">Aguardando decisão</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <CheckSquare className="h-5 w-5 mr-2 text-blue-500" />
                    Tarefas Atribuídas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {communications.filter(c => c.type === 'tarefa-eu' || c.type === 'tarefa-socio').length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma tarefa atribuída</p>
                  ) : (
                    <div className="space-y-3">
                      {communications.filter(c => c.type === 'tarefa-eu' || c.type === 'tarefa-socio').map(comm => (
                        <div key={comm.id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{comm.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{comm.description}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleCommStatus(comm.id)}
                            >
                              {comm.status === 'pendente' ? (
                                <Clock className="h-4 w-4 text-orange-500" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              <User className="h-3 w-3 mr-1" />
                              {comm.assigned_to}
                            </Badge>
                            <Badge className={comm.status === 'pendente' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                              {comm.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                    Acordos e Decisões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {communications.filter(c => c.type === 'acordo' || c.type === 'decisao-pendente' || c.type === 'decisao-tomada').length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum acordo registrado</p>
                  ) : (
                    <div className="space-y-3">
                      {communications.filter(c => c.type === 'acordo' || c.type === 'decisao-pendente' || c.type === 'decisao-tomada').map(comm => (
                        <div key={comm.id} className="border rounded-lg p-3 bg-gray-50">
                          <h4 className="font-medium text-gray-900 mb-1">{comm.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{comm.description}</p>
                          <Badge className={
                            comm.type === 'acordo' ? 'bg-blue-100 text-blue-800' :
                            comm.type === 'decisao-pendente' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {comm.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 6. OBSERVAÇÕES GERAIS */}
          <TabsContent value="observacoes" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Observações Gerais</h2>
                <p className="text-gray-600 mt-1">Ideias, estratégias e análises importantes</p>
              </div>
              <Button 
                onClick={() => setShowNoteDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Observação
              </Button>
            </div>

            {notes.length === 0 ? (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-20 w-20 text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma observação ainda</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    Registre ideias, estratégias e pontos importantes
                  </p>
                  <Button 
                    onClick={() => setShowNoteDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeira Observação
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {notes.map(note => (
                  <Card key={note.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className={
                            note.category === 'ideia' ? 'bg-purple-100 text-purple-800' :
                            note.category === 'estrategia' ? 'bg-blue-100 text-blue-800' :
                            note.category === 'importante' ? 'bg-red-100 text-red-800' :
                            note.category === 'melhoria' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }>
                            {note.category}
                          </Badge>
                          <CardTitle className="text-lg mt-2">{note.title}</CardTitle>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Excluir esta observação?')) {
                              setNotes(notes.filter(n => n.id !== note.id))
                              showToast('🗑️ Observação excluída')
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(note.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 7. AUTOMAÇÃO E ROTINA */}
          <TabsContent value="automacao" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Automação e Rotina</h2>
                <p className="text-gray-600 mt-1">Checklists e tarefas recorrentes</p>
              </div>
              <Button 
                onClick={() => setShowAutoDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Automação
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {(['diario', 'semanal', 'mensal'] as const).map(freq => (
                <Card key={freq} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl capitalize">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      Checklist {freq}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {automations.filter(a => a.frequency === freq).length === 0 ? (
                      <p className="text-center text-gray-500 py-4">Nenhuma tarefa {freq}</p>
                    ) : (
                      <div className="space-y-2">
                        {automations.filter(a => a.frequency === freq).map(auto => (
                          <div key={auto.id} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={auto.completed}
                              onChange={() => toggleAutoCompletion(auto.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${auto.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {auto.title}
                              </p>
                              {auto.description && (
                                <p className="text-xs text-gray-500 mt-1">{auto.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 8. DOCUMENTAÇÃO E ARQUIVOS */}
          <TabsContent value="documentacao" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Documentação e Arquivos</h2>
                <p className="text-gray-600 mt-1">Materiais, links e modelos importantes</p>
              </div>
              <Button 
                onClick={() => setShowDocDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Documento
              </Button>
            </div>

            {documents.length === 0 ? (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Archive className="h-20 w-20 text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhum documento ainda</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    Adicione materiais, links e arquivos importantes
                  </p>
                  <Button 
                    onClick={() => setShowDocDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Documento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {documents.map(doc => (
                  <Card key={doc.id} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className={
                            doc.type === 'material' ? 'bg-blue-100 text-blue-800' :
                            doc.type === 'arquivo' ? 'bg-green-100 text-green-800' :
                            doc.type === 'link' ? 'bg-purple-100 text-purple-800' :
                            doc.type === 'modelo' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {doc.type}
                          </Badge>
                          <CardTitle className="text-lg mt-2">{doc.title}</CardTitle>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Excluir este documento?')) {
                              setDocuments(documents.filter(d => d.id !== doc.id))
                              showToast('🗑️ Documento excluído')
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{doc.content}</p>
                      {doc.url && (
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Abrir link
                        </a>
                      )}
                      <p className="text-xs text-gray-400 pt-2 border-t">
                        {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* DIALOGS */}
      
      {/* Project Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Editar Projeto' : 'Criar Novo Projeto'}</DialogTitle>
            <DialogDescription>
              Preencha as informações do projeto
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="description">Descrição Resumida</Label>
                <Textarea
                  id="description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="objective">Objetivo Principal</Label>
                <Textarea
                  id="objective"
                  value={projectForm.objective}
                  onChange={(e) => setProjectForm({...projectForm, objective: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status Atual</Label>
                <Select value={projectForm.status} onValueChange={(value: Project['status']) => setProjectForm({...projectForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideias">Ideias</SelectItem>
                    <SelectItem value="em-andamento">Em Andamento</SelectItem>
                    <SelectItem value="finalizando">Finalizando</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={projectForm.priority} onValueChange={(value: Project['priority']) => setProjectForm({...projectForm, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="responsible">Responsável</Label>
                <Select value={projectForm.responsible} onValueChange={(value: Project['responsible']) => setProjectForm({...projectForm, responsible: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eu">Eu</SelectItem>
                    <SelectItem value="socio">Sócio</SelectItem>
                    <SelectItem value="ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="deadline">Data Limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={projectForm.deadline}
                  onChange={(e) => setProjectForm({...projectForm, deadline: e.target.value})}
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="tasks">Tarefas Pendentes (uma por linha)</Label>
                <Textarea
                  id="tasks"
                  value={projectForm.tasks}
                  onChange={(e) => setProjectForm({...projectForm, tasks: e.target.value})}
                  rows={3}
                  placeholder="Tarefa 1&#10;Tarefa 2&#10;Tarefa 3"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="missing">O que falta para finalizar (uma por linha)</Label>
                <Textarea
                  id="missing"
                  value={projectForm.missing}
                  onChange={(e) => setProjectForm({...projectForm, missing: e.target.value})}
                  rows={3}
                  placeholder="Item 1&#10;Item 2"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="dependencies">Dependências (projetos que este depende, uma por linha)</Label>
                <Textarea
                  id="dependencies"
                  value={projectForm.dependencies}
                  onChange={(e) => setProjectForm({...projectForm, dependencies: e.target.value})}
                  rows={2}
                  placeholder="Projeto A&#10;Projeto B"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={projectForm.observations}
                  onChange={(e) => setProjectForm({...projectForm, observations: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {
                setShowProjectDialog(false)
                setEditingProject(null)
              }}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                {editingProject ? 'Atualizar' : 'Criar'} Projeto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Login</DialogTitle>
            <DialogDescription>Cadastre credenciais de acesso</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-project">Projeto</Label>
              <Select value={loginForm.project_id} onValueChange={(value) => setLoginForm({...loginForm, project_id: value})} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="platform">Plataforma</Label>
              <Input
                id="platform"
                value={loginForm.platform}
                onChange={(e) => setLoginForm({...loginForm, platform: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Login/Email</Label>
              <Input
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="access">Quem tem acesso</Label>
              <Input
                id="access"
                value={loginForm.access}
                onChange={(e) => setLoginForm({...loginForm, access: e.target.value})}
                placeholder="Ex: Eu e Sócio"
              />
            </div>
            <div>
              <Label htmlFor="notes">Observações de segurança</Label>
              <Textarea
                id="notes"
                value={loginForm.notes}
                onChange={(e) => setLoginForm({...loginForm, notes: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              Adicionar Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Communication Dialog */}
      <Dialog open={showCommDialog} onOpenChange={setShowCommDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Comunicação</DialogTitle>
            <DialogDescription>Registre tarefas, acordos ou decisões</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateComm} className="space-y-4">
            <div>
              <Label htmlFor="comm-type">Tipo</Label>
              <Select value={commForm.type} onValueChange={(value: Communication['type']) => setCommForm({...commForm, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tarefa-eu">Tarefa - Eu</SelectItem>
                  <SelectItem value="tarefa-socio">Tarefa - Sócio</SelectItem>
                  <SelectItem value="acordo">Acordo</SelectItem>
                  <SelectItem value="decisao-pendente">Decisão Pendente</SelectItem>
                  <SelectItem value="decisao-tomada">Decisão Tomada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="comm-title">Título</Label>
              <Input
                id="comm-title"
                value={commForm.title}
                onChange={(e) => setCommForm({...commForm, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="comm-description">Descrição</Label>
              <Textarea
                id="comm-description"
                value={commForm.description}
                onChange={(e) => setCommForm({...commForm, description: e.target.value})}
              />
            </div>
            {(commForm.type === 'tarefa-eu' || commForm.type === 'tarefa-socio') && (
              <div>
                <Label htmlFor="assigned">Atribuído a</Label>
                <Select value={commForm.assigned_to} onValueChange={(value: 'eu' | 'socio') => setCommForm({...commForm, assigned_to: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eu">Eu</SelectItem>
                    <SelectItem value="socio">Sócio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              Registrar Comunicação
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Observação</DialogTitle>
            <DialogDescription>Registre ideias e informações importantes</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <Label htmlFor="note-category">Categoria</Label>
              <Select value={noteForm.category} onValueChange={(value: Note['category']) => setNoteForm({...noteForm, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ideia">Ideia Futura</SelectItem>
                  <SelectItem value="estrategia">Ajuste Estratégico</SelectItem>
                  <SelectItem value="importante">Informação Importante</SelectItem>
                  <SelectItem value="melhoria">Ponto de Melhoria</SelectItem>
                  <SelectItem value="analise">Análise de Desempenho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="note-title">Título</Label>
              <Input
                id="note-title"
                value={noteForm.title}
                onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="note-content">Conteúdo</Label>
              <Textarea
                id="note-content"
                value={noteForm.content}
                onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              Adicionar Observação
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Automation Dialog */}
      <Dialog open={showAutoDialog} onOpenChange={setShowAutoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Automação</DialogTitle>
            <DialogDescription>Crie tarefas recorrentes</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAuto} className="space-y-4">
            <div>
              <Label htmlFor="auto-title">Título</Label>
              <Input
                id="auto-title"
                value={autoForm.title}
                onChange={(e) => setAutoForm({...autoForm, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="auto-frequency">Frequência</Label>
              <Select value={autoForm.frequency} onValueChange={(value: Automation['frequency']) => setAutoForm({...autoForm, frequency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="auto-description">Descrição</Label>
              <Textarea
                id="auto-description"
                value={autoForm.description}
                onChange={(e) => setAutoForm({...autoForm, description: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              Criar Automação
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Dialog */}
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Documento</DialogTitle>
            <DialogDescription>Registre materiais e links importantes</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDoc} className="space-y-4">
            <div>
              <Label htmlFor="doc-type">Tipo</Label>
              <Select value={docForm.type} onValueChange={(value: Document['type']) => setDocForm({...docForm, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">Material Importante</SelectItem>
                  <SelectItem value="arquivo">Arquivo Compartilhado</SelectItem>
                  <SelectItem value="link">Link Essencial</SelectItem>
                  <SelectItem value="modelo">Modelo Interno</SelectItem>
                  <SelectItem value="observacao">Observação Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="doc-title">Título</Label>
              <Input
                id="doc-title"
                value={docForm.title}
                onChange={(e) => setDocForm({...docForm, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="doc-content">Conteúdo/Descrição</Label>
              <Textarea
                id="doc-content"
                value={docForm.content}
                onChange={(e) => setDocForm({...docForm, content: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="doc-url">URL (opcional)</Label>
              <Input
                id="doc-url"
                type="url"
                value={docForm.url}
                onChange={(e) => setDocForm({...docForm, url: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              Adicionar Documento
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
