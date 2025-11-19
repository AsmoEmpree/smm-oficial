'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, FolderOpen } from 'lucide-react'
import type { Projeto } from '@/types/sync-my-mind'
import { ProjectStatusBadge } from './ProjectStatusBadge'

interface ProjectSidebarProps {
  projetos: Projeto[]
  selectedProjectId?: string
  onSelectProject: (projeto: Projeto) => void
  onCreateProject: () => void
}

export function ProjectSidebar({
  projetos,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
}: ProjectSidebarProps) {
  return (
    <div className="w-80 border-r bg-gray-50/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Projetos</h2>
          <Button
            size="sm"
            onClick={onCreateProject}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {projetos.length} {projetos.length === 1 ? 'projeto' : 'projetos'}
        </p>
      </div>

      {/* Lista de Projetos */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {projetos.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-4">
                Nenhum projeto ainda
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={onCreateProject}
              >
                <Plus className="h-4 w-4 mr-1" />
                Criar Primeiro Projeto
              </Button>
            </div>
          ) : (
            projetos.map((projeto) => (
              <Card
                key={projeto.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedProjectId === projeto.id
                    ? 'ring-2 ring-blue-500 bg-blue-50/50'
                    : 'hover:bg-white'
                }`}
                onClick={() => onSelectProject(projeto)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                      {projeto.nome}
                    </h3>
                    <ProjectStatusBadge status={projeto.status} />
                  </div>
                  
                  {projeto.descricao && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {projeto.descricao}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>
                      {new Date(projeto.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
