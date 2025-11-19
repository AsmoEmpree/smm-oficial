'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ProjetoFormData, ProjetoStatus } from '@/types/sync-my-mind'
import { Loader2 } from 'lucide-react'

interface ProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProjetoFormData) => Promise<void>
  initialData?: ProjetoFormData
  mode?: 'create' | 'edit'
}

export function ProjectModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = 'create',
}: ProjectModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProjetoFormData>(
    initialData || {
      nome: '',
      descricao: '',
      status: 'pendente',
      login_acesso: '',
      senha_acesso: '',
      zeroonepay_api_key: '',
      zeroonepay_secret_key: '',
      zeroonepay_webhook: '',
      zeroonepay_merchant_id: '',
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
      // Reset form
      setFormData({
        nome: '',
        descricao: '',
        status: 'pendente',
        login_acesso: '',
        senha_acesso: '',
        zeroonepay_api_key: '',
        zeroonepay_secret_key: '',
        zeroonepay_webhook: '',
        zeroonepay_merchant_id: '',
      })
    } catch (error) {
      console.error('Erro ao salvar projeto:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Criar Novo Projeto' : 'Editar Projeto'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do projeto. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Informações Básicas</h3>
            
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Projeto *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Website Corporativo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva o projeto..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Inicial</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ProjetoStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Credenciais de Acesso */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700">Credenciais de Acesso</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="login_acesso">Login de Acesso</Label>
                <Input
                  id="login_acesso"
                  value={formData.login_acesso}
                  onChange={(e) => setFormData({ ...formData, login_acesso: e.target.value })}
                  placeholder="usuário@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha_acesso">Senha de Acesso</Label>
                <Input
                  id="senha_acesso"
                  type="password"
                  value={formData.senha_acesso}
                  onChange={(e) => setFormData({ ...formData, senha_acesso: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Integração ZeroOnePay */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700">Integração ZeroOnePay</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zeroonepay_api_key">API Key</Label>
                <Input
                  id="zeroonepay_api_key"
                  value={formData.zeroonepay_api_key}
                  onChange={(e) =>
                    setFormData({ ...formData, zeroonepay_api_key: e.target.value })
                  }
                  placeholder="pk_live_..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zeroonepay_secret_key">Secret Key</Label>
                <Input
                  id="zeroonepay_secret_key"
                  type="password"
                  value={formData.zeroonepay_secret_key}
                  onChange={(e) =>
                    setFormData({ ...formData, zeroonepay_secret_key: e.target.value })
                  }
                  placeholder="sk_live_..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zeroonepay_webhook">Webhook URL</Label>
                <Input
                  id="zeroonepay_webhook"
                  value={formData.zeroonepay_webhook}
                  onChange={(e) =>
                    setFormData({ ...formData, zeroonepay_webhook: e.target.value })
                  }
                  placeholder="https://seu-site.com/webhook"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zeroonepay_merchant_id">ID do Comerciante</Label>
                <Input
                  id="zeroonepay_merchant_id"
                  value={formData.zeroonepay_merchant_id}
                  onChange={(e) =>
                    setFormData({ ...formData, zeroonepay_merchant_id: e.target.value })
                  }
                  placeholder="merchant_..."
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : mode === 'create' ? (
                'Criar Projeto'
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
