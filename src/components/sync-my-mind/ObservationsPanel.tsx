'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, Trash2 } from 'lucide-react'
import type { Observacao } from '@/types/sync-my-mind'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ObservationsPanelProps {
  observacoes: Observacao[]
  onAddObservacao: (texto: string) => Promise<void>
  onDeleteObservacao: (id: string) => Promise<void>
  currentUserId?: string
}

export function ObservationsPanel({
  observacoes,
  onAddObservacao,
  onDeleteObservacao,
  currentUserId,
}: ObservationsPanelProps) {
  const [newObservacao, setNewObservacao] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newObservacao.trim()) return

    setLoading(true)
    try {
      await onAddObservacao(newObservacao)
      setNewObservacao('')
    } catch (error) {
      console.error('Erro ao adicionar observação:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          Observações Colaborativas
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Lista de Observações */}
        <ScrollArea className="flex-1 p-4">
          {observacoes.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Nenhuma observação ainda. Seja o primeiro a comentar!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {observacoes.map((obs) => (
                <div
                  key={obs.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900">
                          {obs.autor}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(obs.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                    {obs.autor_id === currentUserId && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteObservacao(obs.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {obs.texto}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Formulário de Nova Observação */}
        <div className="border-t p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={newObservacao}
              onChange={(e) => setNewObservacao(e.target.value)}
              placeholder="Adicionar nova observação..."
              rows={3}
              disabled={loading}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={loading || !newObservacao.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
