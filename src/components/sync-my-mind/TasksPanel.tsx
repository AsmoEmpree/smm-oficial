'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { CheckSquare, Plus, Trash2 } from 'lucide-react'
import type { Tarefa, PrioridadeTarefa } from '@/types/sync-my-mind'

interface TasksPanelProps {
  tarefas: Tarefa[]
  onAddTarefa: (descricao: string, prioridade?: PrioridadeTarefa) => Promise<void>
  onToggleTarefa: (id: string, concluida: boolean) => Promise<void>
  onDeleteTarefa: (id: string) => Promise<void>
}

export function TasksPanel({
  tarefas,
  onAddTarefa,
  onToggleTarefa,
  onDeleteTarefa,
}: TasksPanelProps) {
  const [newTarefa, setNewTarefa] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTarefa.trim()) return

    setLoading(true)
    try {
      await onAddTarefa(newTarefa, 'media')
      setNewTarefa('')
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const tarefasPendentes = tarefas.filter((t) => !t.concluida)
  const tarefasConcluidas = tarefas.filter((t) => t.concluida)

  const getPrioridadeColor = (prioridade: PrioridadeTarefa) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'baixa':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-green-600" />
          Gestão de Tarefas
          <Badge variant="outline" className="ml-auto">
            {tarefasPendentes.length} pendentes
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Formulário de Nova Tarefa */}
        <div className="border-b p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={newTarefa}
              onChange={(e) => setNewTarefa(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Adicionar nova tarefa..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !newTarefa.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Lista de Tarefas */}
        <ScrollArea className="flex-1 p-4">
          {tarefas.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Nenhuma tarefa ainda. Adicione a primeira!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tarefas Pendentes */}
              {tarefasPendentes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Pendentes ({tarefasPendentes.length})
                  </h3>
                  {tarefasPendentes.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="flex items-start gap-3 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <Checkbox
                        checked={tarefa.concluida}
                        onCheckedChange={(checked) =>
                          onToggleTarefa(tarefa.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {tarefa.descricao}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPrioridadeColor(tarefa.prioridade)}`}
                          >
                            {tarefa.prioridade}
                          </Badge>
                          {tarefa.responsavel && (
                            <span className="text-xs text-gray-500">
                              {tarefa.responsavel}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteTarefa(tarefa.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tarefas Concluídas */}
              {tarefasConcluidas.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Concluídas ({tarefasConcluidas.length})
                  </h3>
                  {tarefasConcluidas.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 border rounded-lg opacity-75"
                    >
                      <Checkbox
                        checked={tarefa.concluida}
                        onCheckedChange={(checked) =>
                          onToggleTarefa(tarefa.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 line-through">
                          {tarefa.descricao}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteTarefa(tarefa.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
