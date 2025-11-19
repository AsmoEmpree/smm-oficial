'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Network, MessageSquare, CheckSquare, Key, Settings, LogOut } from 'lucide-react'
import type { Projeto, Observacao, Tarefa, ConexaoProjeto } from '@/types/sync-my-mind'
import {
  getProjetos,
  createProjeto,
  updateProjeto,
  deleteProjeto,
  getObservacoes,
  createObservacao,
  deleteObservacao,
  getTarefas,
  createTarefa,
  toggleTarefa,
  deleteTarefa,
  getConexoes,
  createConexao,
  subscribeToProjectChanges,
  subscribeToAllProjects,
} from '@/lib/sync-my-mind-db'
import { ProjectSidebar } from '@/components/sync-my-mind/ProjectSidebar'
import { ProjectModal } from '@/components/sync-my-mind/ProjectModal'
import { ObservationsPanel } from '@/components/sync-my-mind/ObservationsPanel'
import { TasksPanel } from '@/components/sync-my-mind/TasksPanel'
import { CredentialsPanel } from '@/components/sync-my-mind/CredentialsPanel'
import { MindMap } from '@/components/sync-my-mind/MindMap'
import { ProjectStatusBadge } from '@/components/sync-my-mind/ProjectStatusBadge'

export default function SyncMyMindPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  // Estados principais
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [selectedProject, setSelectedProject] = useState<Projeto | null>(null)
  const [observacoes, setObservacoes] = useState<Observacao[]>([])
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [conexoes, setConexoes] = useState<ConexaoProjeto[]>([])
  
  // Estados de UI
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Verificar autenticação
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/')
        return
      }

      setUser(user)
      await loadData()
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    try {
      const [projetosData, conexoesData] = await Promise.all([
        getProjetos(),
        getConexoes(),
      ])

      setProjetos(projetosData)
      setConexoes(conexoesData)

      // Selecionar primeiro projeto se houver
      if (projetosData.length > 0 && !selectedProject) {
        handleSelectProject(projetosData[0])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleSelectProject = async (projeto: Projeto) => {
    setSelectedProject(projeto)
    setActiveTab('overview')
    
    try {
      const [obsData, tarefasData] = await Promise.all([
        getObservacoes(projeto.id),
        getTarefas(projeto.id),
      ])

      setObservacoes(obsData)
      setTarefas(tarefasData)
    } catch (error) {
      console.error('Erro ao carregar dados do projeto:', error)
    }
  }

  const handleCreateProject = async (data: any) => {
    try {
      const newProject = await createProjeto(data)
      setProjetos([newProject, ...projetos])
      setSelectedProject(newProject)
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      throw error
    }
  }

  const handleAddObservacao = async (texto: string) => {
    if (!selectedProject) return
    
    try {
      const newObs = await createObservacao(selectedProject.id, { texto })
      setObservacoes([newObs, ...observacoes])
    } catch (error) {
      console.error('Erro ao adicionar observação:', error)
      throw error
    }
  }

  const handleDeleteObservacao = async (id: string) => {
    try {
      await deleteObservacao(id)
      setObservacoes(observacoes.filter((obs) => obs.id !== id))
    } catch (error) {
      console.error('Erro ao deletar observação:', error)
      throw error
    }
  }

  const handleAddTarefa = async (descricao: string, prioridade?: any) => {
    if (!selectedProject) return
    
    try {
      const newTarefa = await createTarefa(selectedProject.id, { descricao, prioridade })
      setTarefas([newTarefa, ...tarefas])
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error)
      throw error
    }
  }

  const handleToggleTarefa = async (id: string, concluida: boolean) => {
    try {
      await toggleTarefa(id, concluida)
      setTarefas(
        tarefas.map((t) => (t.id === id ? { ...t, concluida } : t))
      )
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      throw error
    }
  }

  const handleDeleteTarefa = async (id: string) => {
    try {
      await deleteTarefa(id)
      setTarefas(tarefas.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error)
      throw error
    }
  }

  const handleCreateConnection = async (origemId: string, destinoId: string) => {
    try {
      const newConexao = await createConexao(origemId, destinoId)
      setConexoes([...conexoes, newConexao])
    } catch (error) {
      console.error('Erro ao criar conexão:', error)
      throw error
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Realtime subscriptions
  useEffect(() => {
    if (!selectedProject) return

    const unsubscribe = subscribeToProjectChanges(selectedProject.id, async () => {
      // Recarregar dados quando houver mudanças
      const [obsData, tarefasData] = await Promise.all([
        getObservacoes(selectedProject.id),
        getTarefas(selectedProject.id),
      ])
      setObservacoes(obsData)
      setTarefas(tarefasData)
    })

    return () => {
      unsubscribe()
    }
  }, [selectedProject])

  useEffect(() => {
    const unsubscribe = subscribeToAllProjects(async () => {
      const projetosData = await getProjetos()
      setProjetos(projetosData)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sync My Mind
              </h1>
              <p className="text-xs text-gray-600">
                Gestão Colaborativa de Projetos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ProjectSidebar
          projetos={projetos}
          selectedProjectId={selectedProject?.id}
          onSelectProject={handleSelectProject}
          onCreateProject={() => setProjectModalOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!selectedProject ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Selecione um Projeto
                </h2>
                <p className="text-gray-600 mb-6">
                  Escolha um projeto na sidebar ou crie um novo
                </p>
                <Button
                  onClick={() => setProjectModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Criar Novo Projeto
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Project Header */}
              <div className="bg-white border-b p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedProject.nome}
                      </h2>
                      <ProjectStatusBadge status={selectedProject.status} />
                    </div>
                    {selectedProject.descricao && (
                      <p className="text-gray-600">
                        {selectedProject.descricao}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProjectModalOpen(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white border-b px-6">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="overview" className="gap-2">
                      <Network className="h-4 w-4" />
                      Visão Geral
                    </TabsTrigger>
                    <TabsTrigger value="mindmap" className="gap-2">
                      <Brain className="h-4 w-4" />
                      Mapa Mental
                    </TabsTrigger>
                    <TabsTrigger value="observations" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Observações
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Tarefas
                    </TabsTrigger>
                    <TabsTrigger value="credentials" className="gap-2">
                      <Key className="h-4 w-4" />
                      Credenciais
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden p-6">
                  <TabsContent value="overview" className="h-full m-0">
                    <div className="grid grid-cols-2 gap-6 h-full">
                      <ObservationsPanel
                        observacoes={observacoes}
                        onAddObservacao={handleAddObservacao}
                        onDeleteObservacao={handleDeleteObservacao}
                        currentUserId={user?.id}
                      />
                      <TasksPanel
                        tarefas={tarefas}
                        onAddTarefa={handleAddTarefa}
                        onToggleTarefa={handleToggleTarefa}
                        onDeleteTarefa={handleDeleteTarefa}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="mindmap" className="h-full m-0">
                    <MindMap
                      projetos={projetos}
                      conexoes={conexoes}
                      onSelectProject={handleSelectProject}
                      onCreateConnection={handleCreateConnection}
                    />
                  </TabsContent>

                  <TabsContent value="observations" className="h-full m-0">
                    <ObservationsPanel
                      observacoes={observacoes}
                      onAddObservacao={handleAddObservacao}
                      onDeleteObservacao={handleDeleteObservacao}
                      currentUserId={user?.id}
                    />
                  </TabsContent>

                  <TabsContent value="tasks" className="h-full m-0">
                    <TasksPanel
                      tarefas={tarefas}
                      onAddTarefa={handleAddTarefa}
                      onToggleTarefa={handleToggleTarefa}
                      onDeleteTarefa={handleDeleteTarefa}
                    />
                  </TabsContent>

                  <TabsContent value="credentials" className="h-full m-0">
                    <CredentialsPanel projeto={selectedProject} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        onSubmit={handleCreateProject}
        mode="create"
      />
    </div>
  )
}
